import { GrowthScenario, WalkForwardProjection } from "../../types";

/**
 * Simulation Module - ZanAtlas
 * 
 * Walk-forward modelling engine for scenario analysis.
 * Uses deterministic projections for MVP.
 * Designed for Monte Carlo or ML-based projections later.
 */

export const defaultScenarios: GrowthScenario[] = [
  {
    name: "East Coast Road Upgrade",
    description: "Major road improvement connecting Stone Town to the east coast, reducing travel times by 40%.",
    assumptions: [
      { parameter: "accessibilityMultiplier", value: 1.4, description: "Road access improvement" },
      { parameter: "demandLift", value: 1.15, description: "Increased tourism demand from improved access" },
      { parameter: "priceLift", value: 1.12, description: "Price appreciation from infrastructure" },
    ],
    affectedZones: ["paje", "jambiani", "michamvi", "chwaka"],
    timeHorizonYears: 5,
  },
  {
    name: "Golden Visa Demand Surge",
    description: "Zanzibar Golden Visa programme attracts significant foreign investment demand.",
    assumptions: [
      { parameter: "demandLift", value: 1.25, description: "Foreign buyer demand increase" },
      { parameter: "priceLift", value: 1.20, description: "Premium pricing from international demand" },
      { parameter: "liquidityImprovement", value: 1.3, description: "Higher market transaction volume" },
    ],
    affectedZones: ["stone-town", "paje", "nungwi", "kendwa"],
    timeHorizonYears: 3,
  },
  {
    name: "Flood Regulation Tightening",
    description: "New government regulations restrict development in flood-prone coastal areas.",
    assumptions: [
      { parameter: "restrictionMultiplier", value: 0.6, description: "Reduced developable area in flood zones" },
      { parameter: "priceImpact", value: 0.85, description: "Price depression in affected zones" },
      { parameter: "safeZoneLift", value: 1.15, description: "Price increase in non-flood zones" },
    ],
    affectedZones: ["chwaka", "stone-town", "jambiani"],
    timeHorizonYears: 2,
  },
  {
    name: "Marina Development at Michamvi",
    description: "New luxury marina and yacht club planned for Michamvi coast.",
    assumptions: [
      { parameter: "demandLift", value: 1.30, description: "Luxury tourism demand increase" },
      { parameter: "priceLift", value: 1.25, description: "Premium pricing near marina" },
      { parameter: "infrastructureImprovement", value: 1.2, description: "Supporting infrastructure development" },
    ],
    affectedZones: ["michamvi", "paje"],
    timeHorizonYears: 5,
  },
  {
    name: "Digital Free Zone Expansion",
    description: "Zanzibar expands its Digital Free Zone, attracting tech companies and digital nomads.",
    assumptions: [
      { parameter: "demandLift", value: 1.18, description: "Tech sector demand for commercial/residential space" },
      { parameter: "priceLift", value: 1.10, description: "Moderate price appreciation" },
    ],
    affectedZones: ["stone-town", "fumba"],
    timeHorizonYears: 5,
  },
  {
    name: "Tourism Recovery Growth",
    description: "Strong tourism recovery exceeding pre-pandemic levels by 130%.",
    assumptions: [
      { parameter: "demandLift", value: 1.30, description: "Tourism demand surge" },
      { parameter: "priceLift", value: 1.22, description: "Hospitality asset appreciation" },
      { parameter: "occupancyLift", value: 1.25, description: "Higher average occupancy rates" },
    ],
    affectedZones: ["nungwi", "kendwa", "paje", "matemwe", "kiwengwa"],
    timeHorizonYears: 3,
  },
];

function projectZone(
  zoneId: string,
  scenario: GrowthScenario,
  year: number
): WalkForwardProjection {
  const assumptions = scenario.assumptions;
  const demandLift = assumptions.find((a) => a.parameter === "demandLift")?.value ?? 1.0;
  const priceLift = assumptions.find((a) => a.parameter === "priceLift")?.value ?? 1.0;

  // Compound growth over years
  const growthFactor = Math.pow(demandLift, year / scenario.timeHorizonYears);
  const priceFactor = Math.pow(priceLift, year / scenario.timeHorizonYears);

  // Base values (mock)
  const baseDemand = 50;
  const basePrice = 50;
  const baseRisk = 30;

  // Zone-specific modifiers (deterministic based on zone name hash)
  const zoneModifier = zoneId.length * 3 % 10;

  return {
    zoneId,
    year,
    projectedDemandIndex: Math.round(Math.min(100, baseDemand * growthFactor + zoneModifier)),
    projectedPriceIndex: Math.round(Math.min(100, basePrice * priceFactor + zoneModifier)),
    projectedRiskIndex: Math.round(Math.max(5, baseRisk - zoneModifier)),
    confidence: Math.round(Math.max(40, 90 - year * 8)),
  };
}

export function runSimulation(
  scenario: GrowthScenario,
): WalkForwardProjection[] {
  const projections: WalkForwardProjection[] = [];

  for (const zoneId of scenario.affectedZones) {
    for (let yearOffset = 0; yearOffset <= scenario.timeHorizonYears; yearOffset++) {
      projections.push(
        projectZone(zoneId, scenario, yearOffset)
      );
    }
  }

  return projections;
}

export function getScenarioById(id: string): GrowthScenario | undefined {
  return defaultScenarios.find(
    (s) => s.name.toLowerCase().replace(/\s+/g, "-") === id
  );
}

export function getAllScenarioIds(): string[] {
  return defaultScenarios.map((s) =>
    s.name.toLowerCase().replace(/\s+/g, "-")
  );
}
