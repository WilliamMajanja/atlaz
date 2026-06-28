import { NextRequest, NextResponse } from "next/server";
import { SiteAnalysisFull } from "@/types";
import type { Anomaly } from "@/modules/anomaly-detection";
import { generateAnomalyMitigation, generateLocalMitigation } from "@/modules/anomaly-detection/mitigation";
import { checkOllamaHealth } from "@/lib/ollama";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis, anomalies } = body;

    if (!analysis || !anomalies) {
      return NextResponse.json(
        { error: "analysis and anomalies are required" },
        { status: 400 }
      );
    }

    const isHealthy = await checkOllamaHealth();

    let plans;
    if (isHealthy) {
      plans = await generateAnomalyMitigation(
        analysis as SiteAnalysisFull,
        anomalies as Anomaly[]
      );
    } else {
      plans = generateLocalMitigation(anomalies as Anomaly[]);
    }

    return NextResponse.json({
      plans,
      source: isHealthy ? "ai" : "local",
    });
  } catch (error) {
    console.error("Mitigation generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate mitigation plans" },
      { status: 500 }
    );
  }
}
