import OpenAI from "openai";
import { AnalysisSchema } from "../lib/schema";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeSturtup(text: string) {
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
  const parsed = AnalysisSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("ZOD ERROR:", parsed.error);
    throw new Error("Invalid analysis response");
  }
  return parsed.data;
}
