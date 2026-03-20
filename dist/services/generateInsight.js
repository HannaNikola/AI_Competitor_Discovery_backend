"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsight = generateInsight;
const openai_1 = __importDefault(require("openai"));
const schema_1 = require("../lib/schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function generateInsight(analysis, competitors) {
    const prompt = `
You are a venture capital analyst.

Startup analysis:
${JSON.stringify(analysis)}

Competitors:
${JSON.stringify(competitors)}

Generate investment insight.

Return ONLY valid JSON:

{
  "investment_signal": string,
  "reason": string,
  "opportunity": string
}

RULES:
- DO NOT add extra fields
- DO NOT return arrays where strings expected
- Keep responses concise
- Output ONLY JSON
`;
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a VC analyst." },
            { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
    });
    const raw = JSON.parse(response.choices[0].message.content || "{}");
    const parsed = schema_1.InsightSchema.safeParse(raw);
    if (!parsed.success) {
        console.log(parsed.error);
        throw new Error("Invalid insight response");
    }
    return parsed.data;
}
