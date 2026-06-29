import { NextRequest, NextResponse } from "next/server";
import { generateCumulativeAssessment, checkOllamaHealth } from "@/lib/ollama";
import { cumulativeAssessmentRequestSchema } from "@/lib/validation";
import { SiteAnalysisFull } from "@/types";

export const maxDuration = 120;

function generateLocalAssessment(analysis: SiteAnalysisFull): string {
  const n = analysis.neighbourhood ?? "the site";
  const risk = analysis.riskScore;
  const opp = analysis.opportunityScore;

  return `CUMULATIVE IMPACT ASSESSMENT — ${n.toUpperCase()}, ZANZIBAR

1. ENVIRONMENTAL IMPACT
   Flood Risk: ${risk.floodRisk}/100 — ${risk.floodRisk > 60 ? "High concern. Elevated construction and drainage design recommended." : risk.floodRisk > 30 ? "Moderate concern. Standard flood mitigation advised." : "Low concern. No significant flood risk detected."}
   Coastal Exposure: ${risk.coastalExposure}/100 — ${risk.coastalExposure > 60 ? "Significant coastal proximity. Erosion and storm surge buffers required." : "Manageable coastal exposure."}
   Density Pressure: ${risk.densityPressure}/100 — ${risk.densityPressure > 60 ? "High-density area. Infrastructure strain and environmental degradation risks." : "Low density pressure. Favorable for development."}

2. SOCIAL IMPACT
   Tourism Demand (${opp.tourismDemand}/100): ${opp.tourismDemand > 70 ? "Strong tourism ecosystem. Local employment opportunities but potential cultural displacement risks." : "Moderate tourism sector. Balanced community integration possible."}
   Infrastructure Access (${opp.infrastructureAccess}/100): ${opp.infrastructureAccess > 60 ? "Good infrastructure connectivity. Reduced community disruption during development." : "Limited infrastructure. Development may require significant local investment."}

3. ECONOMIC IMPACT
   Development Momentum (${opp.developmentMomentum}/100): ${opp.developmentMomentum > 70 ? "Rapid development zone. Strong ROI potential but monitor for market saturation." : "Steady growth trajectory. Measured development approach recommended."}
   Capital Score: ${analysis.capitalScore}/100 — ${analysis.capitalScore > 65 ? "Strong investment-grade profile." : "Speculative-grade. Higher due diligence required."}
   Recommended Strategy: ${analysis.suggestedStrategy}

4. MITIGATION RECOMMENDATIONS
   • ${analysis.recommendedActions[0] ?? "Conduct full due diligence"}
   • ${analysis.recommendedActions[1] ?? "Engage local stakeholders"}
   • Commission environmental and social impact assessments
   • Develop community benefit-sharing framework
   • Establish monitoring and evaluation protocol

Assessment generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Source: Local assessment engine (Ollama offline)`;
}

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

    let assessment: string;
    let source: "ai" | "local";

    if (isHealthy) {
      try {
        assessment = await generateCumulativeAssessment(analysis as SiteAnalysisFull);
        source = "ai";
      } catch {
        console.warn("AI assessment failed, falling back to local");
        assessment = generateLocalAssessment(analysis as SiteAnalysisFull);
        source = "local";
      }
    } else {
      assessment = generateLocalAssessment(analysis as SiteAnalysisFull);
      source = "local";
    }

    return NextResponse.json({ assessment, source });
  } catch (error) {
    console.error("Cumulative assessment error:", error);
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
