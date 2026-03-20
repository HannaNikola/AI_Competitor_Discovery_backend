import OpenAI from "openai";
import { InsightSchema } from "../lib/schema";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInsight(analysis: any, competitors: any[]) {
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
  const parsed = InsightSchema.safeParse(raw);

  if (!parsed.success) {
    console.log(parsed.error);
    throw new Error("Invalid insight response");
  }

  return parsed.data;
}
