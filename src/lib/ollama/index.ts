import { SiteAnalysisFull, AnomalyMitigationPlan, MitigationAction } from "../../types";
import type { Anomaly } from "../../modules/anomaly-detection";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3:latest";
const GENERATION_TIMEOUT_MS = 120_000;

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export async function generateCumulativeAssessment(
  analysis: SiteAnalysisFull
): Promise<string> {
  const context = buildPromptContext(analysis);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: context,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 1024,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } finally {
    clearTimeout(timeout);
  }
}

function buildPromptContext(analysis: SiteAnalysisFull): string {
  const neighbourhood = analysis.neighbourhood ?? "Unknown Location";
  const lat = analysis.location.latitude.toFixed(5);
  const lon = analysis.location.longitude.toFixed(5);

  return `You are an expert environmental and urban planning consultant specializing in Zanzibar, Tanzania. Write a Cumulative Impact Assessment report.

CONTEXT:
- Location: ${neighbourhood}, Zanzibar, Tanzania
- Coordinates: ${lat}, ${lon}
- Zanzibar is an archipelago in the Indian Ocean (Unguja & Pemba islands)
- Part of the United Republic of Tanzania
- Official languages: Swahili and English
- Capital: Zanzibar City (Stone Town is the historic quarter)

ANALYSIS DATA:
- Risk Score: ${analysis.riskScore.overallRisk}/100 (${analysis.riskScore.riskBand})
- Flood Risk: ${analysis.riskScore.floodRisk}/100
- Coastal Exposure: ${analysis.riskScore.coastalExposure}/100
- Density Pressure: ${analysis.riskScore.densityPressure}/100
- Opportunity Score: ${analysis.opportunityScore.overallOpportunity}/100 (${analysis.opportunityScore.opportunityBand})
- Tourism Demand: ${analysis.opportunityScore.tourismDemand}/100
- Infrastructure Access: ${analysis.opportunityScore.infrastructureAccess}/100
- Development Momentum: ${analysis.opportunityScore.developmentMomentum}/100
- Capital Allocation Score: ${analysis.capitalScore}/100
- Strategy: ${analysis.suggestedStrategy}
- Badges: ${analysis.badges.join(", ")}

Write a professional CIA report for ${neighbourhood}, Zanzibar. Structure with numbered sections. Focus on environmental, social, and economic cumulative impacts. Reference local context: tropical climate, coral reefs, mangroves, tourism economy, Stone Town UNESCO site. Use professional consulting language. Write the full report now:`;
}

export async function* generateCumulativeAssessmentStream(
  analysis: SiteAnalysisFull
): AsyncGenerator<string, void, unknown> {
  const context = buildPromptContext(analysis);

  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: context,
      stream: true,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 1024,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.trim());

    for (const line of lines) {
      try {
        const data: OllamaResponse = JSON.parse(line);
        if (data.response) {
          yield data.response;
        }
      } catch {
      }
    }
  }
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function buildMitigationPrompt(analysis: SiteAnalysisFull, anomaly: Anomaly): string {
  return `You are a senior land investment risk manager specializing in Zanzibar real estate. Generate a detailed mitigation plan for the following anomaly detected during a site analysis.

ANOMALY DETAILS:
- Title: ${anomaly.title}
- Category: ${anomaly.category}
- Severity: ${anomaly.severity}
- Description: ${anomaly.description}
- Expected: ${anomaly.expected ?? "N/A"}
- Actual: ${anomaly.actual ?? "N/A"}
- Recommendation: ${anomaly.recommendation}

SITE CONTEXT:
- Zone: ${analysis.neighbourhood ?? "Unknown"}
- Risk Score: ${analysis.riskScore.overallRisk}/100 (${analysis.riskScore.riskBand})
- Opportunity Score: ${analysis.opportunityScore.overallOpportunity}/100 (${analysis.opportunityScore.opportunityBand})
- Capital Score: ${analysis.capitalScore}/100
- Strategy: ${analysis.suggestedStrategy}
- Badges: ${analysis.badges.join(", ")}

Provide your response as valid JSON only (no markdown, no code fences) with this exact structure:
{
  "aiAssessment": "Brief AI analysis of the anomaly in context",
  "mitigationActions": [
    {
      "priority": "immediate|short_term|medium_term|ongoing",
      "title": "Action title",
      "description": "Detailed description of mitigation action",
      "effort": "low|medium|high",
      "impact": "low|medium|high",
      "timeline": "Timeframe to complete"
    }
  ],
  "costEstimate": { "low": number, "high": number, "currency": "USD" },
  "riskResidual": "low|medium|high"
}

Provide 2-4 mitigation actions. Be specific to Zanzibar context. Use realistic USD cost estimates for the Zanzibar market.`;
}

export async function generateMitigationPlan(
  analysis: SiteAnalysisFull,
  anomaly: Anomaly
): Promise<AnomalyMitigationPlan> {
  const context = buildMitigationPrompt(analysis, anomaly);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: context,
        stream: false,
        options: {
          temperature: 0.5,
          top_p: 0.85,
          num_predict: 1024,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }

    const data: OllamaResponse = await response.json();
    const parsed = JSON.parse(data.response);

    return {
      anomalyId: anomaly.id,
      anomalyTitle: anomaly.title,
      severity: anomaly.severity,
      category: anomaly.category,
      aiAssessment: parsed.aiAssessment ?? "",
      mitigationActions: (parsed.mitigationActions ?? []).map((a: MitigationAction) => ({
        priority: a.priority ?? "medium_term",
        title: a.title ?? "Mitigation action",
        description: a.description ?? "",
        effort: a.effort ?? "medium",
        impact: a.impact ?? "medium",
        timeline: a.timeline ?? "TBD",
      })),
      costEstimate: {
        low: parsed.costEstimate?.low ?? 5000,
        high: parsed.costEstimate?.high ?? 20000,
        currency: "USD",
      },
      riskResidual: parsed.riskResidual ?? "medium",
    };
  } catch (err) {
    throw new Error(
      `Failed to generate mitigation plan: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateSpeculationBrief(
  zoneName: string,
  analysis: SiteAnalysisFull
): Promise<string> {
  const prompt = `You are a Zanzibar land speculation expert. Write a concise, data-driven speculation brief for ${zoneName}.

Current Analysis:
- Risk: ${analysis.riskScore.overallRisk}/100 (${analysis.riskScore.riskBand})
- Opportunity: ${analysis.opportunityScore.overallOpportunity}/100 (${analysis.opportunityScore.opportunityBand})
- Capital Score: ${analysis.capitalScore}/100
- Tourism: ${analysis.opportunityScore.tourismDemand}/100
- Infrastructure: ${analysis.opportunityScore.infrastructureAccess}/100
- Momentum: ${analysis.opportunityScore.developmentMomentum}/100

Write a 2-3 paragraph speculation brief covering:
1. Entry timing assessment (buy now or wait?)
2. Price appreciation outlook (12mo, 36mo, 60mo)
3. Key catalysts and risks
4. Recommended hold period

Be direct, specific, and actionable. No fluff.`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.6, top_p: 0.9, num_predict: 768 },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch {
    throw new Error("Failed to generate speculation brief");
  } finally {
    clearTimeout(timeout);
  }
}
