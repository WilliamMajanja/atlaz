import { NextRequest, NextResponse } from "next/server";
import { defaultScenarios, runSimulation } from "@/modules/simulation";
import { simulationRequestSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(defaultScenarios);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = simulationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { scenarioId } = parsed.data;

    const scenario = defaultScenarios.find(
      (s) => s.name.toLowerCase().replace(/\s+/g, "-") === scenarioId
    );

    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }

    const projections = runSimulation(scenario);
    return NextResponse.json({ scenario, projections });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { error: "Failed to run simulation" },
      { status: 500 }
    );
  }
}
