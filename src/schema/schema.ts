// import { z } from "zod";

// export const AnalysisSchema = z.object({
//   product_category: z.string().default(""),
//   target_users: z.array(z.string()).default([]),
//   key_value_proposition: z.string().default(""),
//   business_model: z.string().default(""),
//   short_summary: z.string().default(""),
// });

// export const CompetitorSchema = z.object({
//   name: z.string().optional().default("Unknown"),
//   product_category: z.string().optional().default("N/A"),
//   key_value_proposition: z
//     .string()
//     .optional()
//     .default("No description provided"),
//   business_model: z.string().optional().default("N/A"),
// });

// export const CompetitorsSchema = z.object({
//   competitors: z.array(CompetitorSchema).default([]),
// });

// export const InsightSchema = z.object({
//   investment_signal: z.string().default(""),
//   opportunity: z.string().default(""),
//   reason: z.string().default(""),
// });

// export const ResultSchema = z.object({
//   analysis: AnalysisSchema,
//   competitors: CompetitorsSchema,
//   insight: InsightSchema,
// });





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

// export const InsightSchema = z.object({
//   product_positioning: z.string().default(""),
//   primary_audience: z.string().default(""),
//   notable_differentiators: z.string().default(""),
//   technical_focus: z.string().default(""),
//   implementation_complexity:z.string().default(""),
// });

export const InsightSchema = z.object({
  core_mechanics: z.string().default(""),
  monetization_leverage: z.string().default(""),
  integration_strategy: z.string().default(""),
  adoption_barrier: z.string().default(""),
  key_features: z.string().default(""),
});

export const ResultSchema = z.object({
  analysis: AnalysisSchema,
  competitors: CompetitorsSchema,
  insight: InsightSchema,
});



// use_cases: z.string().default(""),
//   key_features: z.string().default(""),
//   tech_stack_signals: z.string().default(""),