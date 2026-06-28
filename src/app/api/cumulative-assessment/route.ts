import { NextRequest, NextResponse } from "next/server";
import { generateCumulativeAssessment, checkOllamaHealth } from "@/lib/ollama";
import { cumulativeAssessmentRequestSchema } from "@/lib/validation";
import { SiteAnalysisFull } from "@/types";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = cumulativeAssessmentRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { analysis } = parsed.data;

    const isHealthy = await checkOllamaHealth();
    if (!isHealthy) {
      return NextResponse.json(
        { error: "Ollama service is not available. Please ensure Ollama is running on http://localhost:11434" },
        { status: 503 }
      );
    }

    const assessment = await generateCumulativeAssessment(analysis as SiteAnalysisFull);
    return NextResponse.json({ assessment });
  } catch (error) {
    console.error("Cumulative assessment error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Assessment generation timed out. The model may be loading — please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate cumulative assessment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isHealthy = await checkOllamaHealth();
    return NextResponse.json({ healthy: isHealthy });
  } catch {
    return NextResponse.json({ healthy: false });
  }
}
