import { NextRequest, NextResponse } from "next/server";
import { runFullSiteAnalysis } from "@/lib/scoring";
import { analysisRequestSchema } from "@/lib/validation";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analysisRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { latitude, longitude } = parsed.data;
    const analysis = runFullSiteAnalysis({ latitude, longitude });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to run analysis" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const analyses = await db.analysis.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(analyses);
  } catch (error) {
    console.error("Failed to fetch analyses:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
