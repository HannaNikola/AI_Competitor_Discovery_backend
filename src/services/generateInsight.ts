import OpenAI from "openai";
import { InsightSchema } from "../schema/schema";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInsight(analysis: any, competitors: any[]) {
  const prompt = `
You are a Startup Strategist. Define the competitive gap.

Startup: ${JSON.stringify(analysis)}
Competitors: ${JSON.stringify(competitors)}

Task:
- product_positioning: Map the product (e.g., "Developer-first infrastructure" vs "SMB No-code tool"). Identify if it's a 'Point Solution' or a 'Platform'.
- notable_differentiators: Identify the ONE technical or product "hook" that makes it unique. Avoid generic words like "flexible" or "seamless".
- technical_focus: Analyze the "How". (e.g., Event-driven architecture, LLM wrapper, Data aggregator, Real-time sync).
- complexity: Estimate implementation effort (e.g., "Low: Self-service" vs "High: Requires custom API mapping").

Return ONLY valid JSON:
{
   "product_positioning": string,
   "primary_audience": string,
   "notable_differentiators": string,
   "technical_focus": string,
   "implementation_complexity": string
}

RULES:
- Do not repeat the product's name in differentiators.
- Focus on technical reality, not marketing fluff.
- Output ONLY JSON.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a product strategist. Focus on technical reality, not marketing fluff.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const raw = JSON.parse(response.choices[0].message.content || "{}");
  const parsed = InsightSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid insight response");
  return parsed.data;
}
