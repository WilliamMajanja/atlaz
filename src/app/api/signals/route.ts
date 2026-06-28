import { NextResponse } from "next/server";
import { generateMarketSignals } from "@/modules/signals";

export async function GET() {
  try {
    const signals = generateMarketSignals();
    return NextResponse.json(signals);
  } catch (error) {
    console.error("Market signals error:", error);
    return NextResponse.json(
      { error: "Failed to generate market signals" },
      { status: 500 }
    );
  }
}
