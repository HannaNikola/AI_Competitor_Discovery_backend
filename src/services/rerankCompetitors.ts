import OpenAI from "openai";
import { CompetitorsSchema } from "../schema/schema";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function rerankCompetitors(analysis: any, candidates: any[]) {
  const prompt = `
You are a Senior Product Analyst. Select the 10 closest competitors for the following startup.

Startup Analysis:
${JSON.stringify(analysis)}

Candidate List:
${JSON.stringify(candidates)}

CRITICAL SELECTION HIERARCHY:
1. Direct Competitors: Same core mechanics and "Jobs to be Done".
2. Functional Competitors: Solve the same problem but with a different UI/UX.
3. Ecosystem Competitors: Platforms that might absorb this feature as a plugin.

Prioritize specific niche matches (e.g., "CRM for Doctors") over general market leaders.

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
- Return up to 10 competitors.
- If empty, return {"competitors": []}.
- Output ONLY JSON.
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a product analyst. Compare products by category and UX mechanics.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const raw = JSON.parse(res.choices[0].message.content || "{}");
  const parsed = CompetitorsSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid competitors response");
  return parsed.data;
}
