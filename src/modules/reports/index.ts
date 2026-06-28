import { SiteAnalysisFull, GeoPoint, BadgeType } from "../../types";
import { config } from "../../lib/config";

/**
 * Report Module - ZanAtlas
 * 
 * Generates structured report content for saved analyses.
 * MVP produces HTML print views; PDF export plumbed for later.
 */

export interface ReportContent {
  title: string;
  generatedAt: string;
  location: GeoPoint;
  neighbourhood: string | null;
  riskSummary: {
    overallRisk: number;
    riskBand: string;
    floodRisk: number;
    coastalExposure: number;
    keyConcerns: string[];
  };
  opportunitySummary: {
    overallOpportunity: number;
    opportunityBand: string;
    tourismDemand: number;
    infrastructureAccess: number;
    keyStrengths: string[];
  };
  capitalAllocation: {
    score: number;
    suggestedStrategy: string;
    investmentThesis: string;
  };
  dueDiligenceChecklist: string[];
  badges: BadgeType[];
  disclaimer: string;
}

const DISCLAIMER = config.disclaimer;

const BASE_DUE_DILIGENCE = [
  "Verify land title and ownership with a qualified Zanzibar lawyer",
  "Confirm zoning approval for intended use with Zanzibar authorities",
  "Commission a professional land survey by a licensed surveyor",
  "Review encumbrances, liens, and encumbrances with government land registry",
  "Assess environmental impact requirements",
  "Verify access to utilities (water, electricity, sewage)",
  "Confirm road access rights and any easements",
  "Review community consultation requirements",
  "Check for any pending legal disputes on the property",
  "Obtain independent valuation from a certified valuer",
];

export function generateReportContent(analysis: SiteAnalysisFull): ReportContent {
  const keyConcerns: string[] = [];
  if (analysis.riskScore.floodRisk > 50) keyConcerns.push("Flood risk is elevated");
  if (analysis.riskScore.coastalExposure > 60) keyConcerns.push("High coastal exposure");
  if (analysis.riskScore.infrastructureRisk > 40) keyConcerns.push("Infrastructure access concerns");

  const keyStrengths: string[] = [];
  if (analysis.opportunityScore.tourismDemand > 70) keyStrengths.push("Strong tourism demand");
  if (analysis.opportunityScore.infrastructureAccess > 60) keyStrengths.push("Good infrastructure access");
  if (analysis.opportunityScore.developmentMomentum > 60) keyStrengths.push("Strong development momentum");

  return {
    title: `Land Intelligence Report - ${analysis.neighbourhood ?? "Unknown Location"}`,
    generatedAt: new Date().toISOString(),
    location: analysis.location,
    neighbourhood: analysis.neighbourhood,
    riskSummary: {
      overallRisk: analysis.riskScore.overallRisk,
      riskBand: analysis.riskScore.riskBand,
      floodRisk: analysis.riskScore.floodRisk,
      coastalExposure: analysis.riskScore.coastalExposure,
      keyConcerns,
    },
    opportunitySummary: {
      overallOpportunity: analysis.opportunityScore.overallOpportunity,
      opportunityBand: analysis.opportunityScore.opportunityBand,
      tourismDemand: analysis.opportunityScore.tourismDemand,
      infrastructureAccess: analysis.opportunityScore.infrastructureAccess,
      keyStrengths,
    },
    capitalAllocation: {
      score: analysis.capitalScore,
      suggestedStrategy: analysis.suggestedStrategy,
      investmentThesis: `Based on the ${analysis.neighbourhood ?? "selected"} location profile, this site scores ${analysis.capitalScore}/100 for capital deployment. Recommended strategy: ${analysis.suggestedStrategy}.`,
    },
    dueDiligenceChecklist: [...BASE_DUE_DILIGENCE],
    badges: analysis.badges,
    disclaimer: DISCLAIMER,
  };
}

// PDF export stub - to be implemented with a PDF generation library
export async function generatePdfReport(reportContent: ReportContent): Promise<Uint8Array | null> {
  void reportContent;
  // TODO: Implement PDF generation using @react-pdf/renderer or puppeteer
  // For MVP, return null to indicate PDF not yet available
  console.log("PDF generation not yet implemented");
  return null;
}
