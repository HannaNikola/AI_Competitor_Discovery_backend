import OpenAI from "openai";
import { CompetitorsSchema } from "../lib/schema";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function rerankCompetitors(analysis: any, candidates: any[]) {
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

  const parsed = CompetitorsSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Invalid competitors response");
  }

  return parsed.data;
}
