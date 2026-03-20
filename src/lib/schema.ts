import { z } from "zod";

export const AnalysisSchema = z.object({
  product_category: z.string().default(""),
  target_users: z.array(z.string()).default([]),
  key_value_proposition: z.string().default(""),
  business_model: z.string().default(""),
  short_summary: z.string().default(""),
});

export const CompetitorSchema = z.object({
  name: z.string().optional().default("Unknown"),
  product_category: z.string().optional().default("N/A"),
  key_value_proposition: z
    .string()
    .optional()
    .default("No description provided"),
  business_model: z.string().optional().default("N/A"),
});

export const CompetitorsSchema = z.object({
  competitors: z.array(CompetitorSchema).default([]),
});

export const InsightSchema = z.object({
  investment_signal: z.string().default(""),
  opportunity: z.string().default(""),
  reason: z.string().default(""),
});

export const ResultSchema = z.object({
  analysis: AnalysisSchema,
  competitors: CompetitorsSchema,
  insight: InsightSchema,
});
