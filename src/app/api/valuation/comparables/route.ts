import { NextRequest, NextResponse } from "next/server";
import { runComparableAnalysis } from "@/modules/valuation/comparables";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { error: "latitude and longitude are required numbers" },
        { status: 400 }
      );
    }

    const result = runComparableAnalysis({ latitude, longitude });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Comparable analysis error:", error);
    return NextResponse.json(
      { error: "Failed to run comparable analysis" },
      { status: 500 }
    );
  }
}
