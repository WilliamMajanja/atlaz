import {
  InvestorProfile,
  CapitalAllocationRecommendation,
  ZoneRecommendation,
  NeighbourhoodProfile,
} from "../../types";

/**
 * Capital Allocation Module - ZanAtlas
 * 
 * Future-facing investor strategy engine.
 * Uses deterministic rules with seed data for MVP.
 * Designed to be enhanced with ML/AI later.
 */

interface ZoneScore {
  zone: NeighbourhoodProfile;
  score: number;
  matchReasons: string[];
  riskFactors: string[];
}

function scoreZoneForInvestor(
  zone: NeighbourhoodProfile,
  profile: InvestorProfile
): ZoneScore {
  let score = 0;
  const matchReasons: string[] = [];
  const riskFactors: string[] = [];

  // Tourism demand alignment
  if (profile.preferredStrategy === "hotel" || profile.preferredStrategy === "villa") {
    score += zone.tourismScore * 0.3;
    if (zone.tourismScore > 75) matchReasons.push("Strong tourism demand");
  }

  // Infrastructure alignment
  score += zone.infrastructureScore * 0.2;
  if (zone.infrastructureScore > 60) matchReasons.push("Good infrastructure access");

  // Risk tolerance alignment
  if (profile.riskTolerance === "conservative") {
    score += (100 - zone.floodSensitivity) * 0.2;
    if (zone.floodSensitivity > 60) riskFactors.push("High flood sensitivity");
    score += zone.infrastructureScore * 0.1;
  } else if (profile.riskTolerance === "opportunistic") {
    score += zone.developmentMomentum * 0.3;
    if (zone.developmentMomentum > 60) matchReasons.push("Strong development momentum");
  }

  // Time horizon alignment
  if (profile.timeHorizonYears >= 5) {
    score += zone.developmentMomentum * 0.15;
    if (zone.developmentMomentum > 50) matchReasons.push("Good long-term growth trajectory");
  }

  // Budget alignment
  const avgPrice = (zone.pricePerSqmMin + zone.pricePerSqmMax) / 2;
  const affordableSqm = profile.budgetUsd / avgPrice;
  if (affordableSqm > 2000) {
    score += 10;
    matchReasons.push("Within budget for meaningful land area");
  } else if (affordableSqm < 200) {
    score -= 10;
    riskFactors.push("Limited land area within budget");
  }

  // Strategy-specific bonuses
  if (profile.preferredStrategy === "land_bank") {
    score += zone.developmentMomentum * 0.1;
    matchReasons.push("Land bank strategy suitable");
  }
  if (profile.preferredStrategy === "mixed_use") {
    score += zone.infrastructureScore * 0.1;
    if (zone.infrastructureScore > 50) matchReasons.push("Good for mixed-use development");
  }

  // Flood risk check
  if (zone.floodSensitivity > 65) {
    riskFactors.push("Significant flood risk");
  }

  return { zone, score: Math.round(score), matchReasons, riskFactors };
}

function generateThesis(
  profile: InvestorProfile,
  topZones: ZoneScore[]
): string {
  const strategies = {
    land_bank: "land banking for long-term appreciation",
    villa: "villa development for tourism rental income",
    apartments: "apartment development for residential market",
    hotel: "hotel/resort development for hospitality revenue",
    mixed_use: "mixed-use development combining commercial and residential",
  };

  const riskDescriptions = {
    conservative: "low-risk, high-confidence locations",
    balanced: "balanced risk-reward positions",
    opportunistic: "high-upside emerging locations",
  };

  const topZoneNames = topZones.slice(0, 3).map((z) => z.zone.name).join(", ");

  return `Based on your $${(profile.budgetUsd / 1000).toFixed(0)}K budget with a ${profile.riskTolerance} risk profile and ${profile.timeHorizonYears}-year horizon, we recommend ${strategies[profile.preferredStrategy]} focused on ${riskDescriptions[profile.riskTolerance]}. Priority zones: ${topZoneNames}.`;
}

function generateNextActions(profile: InvestorProfile, topZones: ZoneScore[]): string[] {
  const actions: string[] = [
    "Verify land title and ownership with qualified Zanzibar lawyer",
    "Confirm zoning approval for intended use",
    "Commission professional land survey",
    "Review encumbrances and liens with government authorities",
  ];

  if (profile.preferredStrategy === "hotel" || profile.preferredStrategy === "villa") {
    actions.push("Assess tourism licensing requirements");
    actions.push("Review environmental impact assessment requirements");
  }

  if (topZones.some((z) => z.zone.floodSensitivity > 50)) {
    actions.push("Obtain flood risk assessment from qualified surveyor");
  }

  actions.push("Engage with local real estate agents for market intelligence");
  actions.push("Visit sites in person before committing capital");

  return actions;
}

export function generateCapitalAllocation(
  profile: InvestorProfile,
  zones: NeighbourhoodProfile[]
): CapitalAllocationRecommendation {
  const scored = zones.map((z) => scoreZoneForInvestor(z, profile));
  scored.sort((a, b) => b.score - a.score);

  const recommendedZones: ZoneRecommendation[] = scored
    .filter((z) => z.score > 30)
    .slice(0, 5)
    .map((z) => ({
      zoneId: z.zone.id,
      zoneName: z.zone.name,
      score: z.score,
      thesis: z.matchReasons.join(". "),
      riskFactors: z.riskFactors,
    }));

  const avoidZones: ZoneRecommendation[] = scored
    .filter((z) => z.riskFactors.length > 1)
    .slice(0, 3)
    .map((z) => ({
      zoneId: z.zone.id,
      zoneName: z.zone.name,
      score: z.score,
      thesis: z.zone.strategicNote,
      riskFactors: z.riskFactors,
    }));

  return {
    recommendedZones,
    avoidZones,
    thesis: generateThesis(profile, scored),
    keyRisks: [
      "Land title verification required",
      "Zoning approval not guaranteed",
      "Infrastructure development timelines uncertain",
      "Climate and flood risk exposure",
      "Market liquidity may be limited",
    ],
    nextActions: generateNextActions(profile, scored),
  };
}
