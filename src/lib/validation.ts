import { z } from "zod";

export const geoPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const saveSiteSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const analysisRequestSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const simulationRequestSchema = z.object({
  scenarioId: z.string().min(1),
});

export const anomalyDetectionRequestSchema = z.object({
  analysis: z.object({
    location: geoPointSchema,
    neighbourhood: z.string().nullable().optional(),
    riskScore: z.object({
      floodRisk: z.number(),
      coastalExposure: z.number(),
      densityPressure: z.number(),
      infrastructureRisk: z.number(),
      overallRisk: z.number(),
      riskBand: z.enum(["Low", "Medium", "High"]),
    }),
    opportunityScore: z.object({
      tourismDemand: z.number(),
      infrastructureAccess: z.number(),
      developmentMomentum: z.number(),
      marketLiquidity: z.number(),
      overallOpportunity: z.number(),
      opportunityBand: z.enum(["Low", "Medium", "High", "Prime"]),
    }),
    capitalScore: z.number(),
    suggestedStrategy: z.string(),
    badges: z.array(z.string()),
    recommendedActions: z.array(z.string()),
    disclaimer: z.string(),
  }),
});

export const cumulativeAssessmentRequestSchema = z.object({
  analysis: z.object({
    location: geoPointSchema,
    neighbourhood: z.string().nullable().optional(),
    riskScore: z.object({
      floodRisk: z.number(),
      coastalExposure: z.number(),
      densityPressure: z.number(),
      infrastructureRisk: z.number(),
      overallRisk: z.number(),
      riskBand: z.enum(["Low", "Medium", "High"]),
    }),
    opportunityScore: z.object({
      tourismDemand: z.number(),
      infrastructureAccess: z.number(),
      developmentMomentum: z.number(),
      marketLiquidity: z.number(),
      overallOpportunity: z.number(),
      opportunityBand: z.enum(["Low", "Medium", "High", "Prime"]),
    }),
    capitalScore: z.number(),
    suggestedStrategy: z.string(),
    badges: z.array(z.string()),
    recommendedActions: z.array(z.string()),
    disclaimer: z.string(),
  }),
});

export type SaveSiteInput = z.infer<typeof saveSiteSchema>;
export type AnalysisRequestInput = z.infer<typeof analysisRequestSchema>;
export type SimulationRequestInput = z.infer<typeof simulationRequestSchema>;
