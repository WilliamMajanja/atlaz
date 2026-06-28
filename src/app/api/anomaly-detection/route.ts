import { NextRequest, NextResponse } from "next/server";
import { detectAnomalies, getAnomalySummary } from "@/modules/anomaly-detection";
import { anomalyDetectionRequestSchema } from "@/lib/validation";
import { SiteAnalysisFull } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = anomalyDetectionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { analysis } = parsed.data;
    const anomalies = detectAnomalies(analysis as SiteAnalysisFull);
    const summary = getAnomalySummary(anomalies);

    return NextResponse.json({ anomalies, summary });
  } catch (error) {
    console.error("Anomaly detection error:", error);
    return NextResponse.json(
      { error: "Failed to run anomaly detection" },
      { status: 500 }
    );
  }
}
