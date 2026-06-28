import { CompositeIntelligence } from "../../types";
import { calculateEntropySummary } from "./entropy";
import { calculateCorrelationAnalysis } from "./correlation";
import { calculateVolatilityAnalysis } from "./volatility";
import { calculateClusterAnalysis } from "./clustering";
import { calculateMomentumAnalysis } from "./momentum";

export function calculateCompositeIntelligence(): CompositeIntelligence {
  return {
    entropy: calculateEntropySummary(),
    correlation: calculateCorrelationAnalysis(),
    volatility: calculateVolatilityAnalysis(),
    clustering: calculateClusterAnalysis(),
    momentum: calculateMomentumAnalysis(),
    generatedAt: new Date().toISOString(),
  };
}

export { calculateEntropySummary } from "./entropy";
export { calculateCorrelationAnalysis } from "./correlation";
export { calculateVolatilityAnalysis } from "./volatility";
export { calculateClusterAnalysis } from "./clustering";
export { calculateMomentumAnalysis } from "./momentum";
