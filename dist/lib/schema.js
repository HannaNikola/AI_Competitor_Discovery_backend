"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultSchema = exports.InsightSchema = exports.CompetitorsSchema = exports.CompetitorSchema = exports.AnalysisSchema = void 0;
const zod_1 = require("zod");
exports.AnalysisSchema = zod_1.z.object({
    product_category: zod_1.z.string().default(""),
    target_users: zod_1.z.array(zod_1.z.string()).default([]),
    key_value_proposition: zod_1.z.string().default(""),
    business_model: zod_1.z.string().default(""),
    short_summary: zod_1.z.string().default(""),
});
exports.CompetitorSchema = zod_1.z.object({
    name: zod_1.z.string().optional().default("Unknown"),
    product_category: zod_1.z.string().optional().default("N/A"),
    key_value_proposition: zod_1.z
        .string()
        .optional()
        .default("No description provided"),
    business_model: zod_1.z.string().optional().default("N/A"),
});
exports.CompetitorsSchema = zod_1.z.object({
    competitors: zod_1.z.array(exports.CompetitorSchema).default([]),
});
exports.InsightSchema = zod_1.z.object({
    investment_signal: zod_1.z.string().default(""),
    opportunity: zod_1.z.string().default(""),
    reason: zod_1.z.string().default(""),
});
exports.ResultSchema = zod_1.z.object({
    analysis: exports.AnalysisSchema,
    competitors: exports.CompetitorsSchema,
    insight: exports.InsightSchema,
});
