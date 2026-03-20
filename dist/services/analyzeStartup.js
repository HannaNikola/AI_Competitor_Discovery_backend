"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSturtup = analyzeSturtup;
const openai_1 = __importDefault(require("openai"));
const schema_1 = require("../lib/schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function analyzeSturtup(text) {
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `
You are a venture capital analyst.

Analyze the startup website content.

Return ONLY valid JSON строго по схеме:

{
  "product_category": string,
  "target_users": string[],
  "key_value_proposition": string,
  "business_model": string,
  "short_summary": string
}

RULES:
- target_users MUST ALWAYS be an array of strings
- NEVER return a string instead of an array
- NEVER change field names
- DO NOT add extra fields
- If no data → return empty array [] or empty string ""
- Output ONLY JSON
`,
            },
            {
                role: "user",
                content: text.slice(0, 6000),
            },
        ],
        response_format: { type: "json_object" },
    });
    const raw = JSON.parse(response.choices[0].message.content || "{}");
    const parsed = schema_1.AnalysisSchema.safeParse(raw);
    if (!parsed.success) {
        console.error("ZOD ERROR:", parsed.error);
        throw new Error("Invalid analysis response");
    }
    return parsed.data;
}
