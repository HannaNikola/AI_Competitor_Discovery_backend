"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rerankCompetitors = rerankCompetitors;
const openai_1 = __importDefault(require("openai"));
const schema_1 = require("../lib/schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function rerankCompetitors(analysis, candidates) {
    const prompt = `
You are a venture capital analyst.

Startup:
${JSON.stringify(analysis)}

Candidates:
${JSON.stringify(candidates)}

Select the most relevant competitors.

Return ONLY valid JSON:

{
  "competitors": [
    {
      "name": string,
      "product_category": string,
      "key_value_proposition": string,
      "business_model": string
    }
  ]
}

RULES:
- competitors MUST ALWAYS be an array
- Each competitor MUST have ALL fields
- DO NOT rename keys
- DO NOT return strings instead of objects
- If empty → return "competitors": []
- Output ONLY JSON
`;
    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a VC analyst." },
            { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
    });
    const raw = JSON.parse(res.choices[0].message.content || "{}");
    const parsed = schema_1.CompetitorsSchema.safeParse(raw);
    if (!parsed.success) {
        throw new Error("Invalid competitors response");
    }
    return parsed.data;
}
