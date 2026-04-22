import OpenAI from "openai";
import { AnalysisSchema } from "../schema/schema";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeSturtup(text: string) {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
You are a Senior Product Strategist. Analyze the startup website content with a focus on its unique competitive edge and "Jobs to be Done".

Extract the following:
- product_category: Specific niche.
- target_users: List specific segments (e.g., "Growth Marketers", not just "Users").
- key_value_proposition: Focus on the 'Outcome' (what the user achieves), not the 'Tool'.
- business_model: REQUIRED. Infer from signs of pricing, trials, or enterprise demos. 
- tech_stack_signals: Look for infrastructure (AWS, Vercel), architecture (Event-driven, Real-time, Block-based), or AI model mentions.
- key_features: Focus on 'Hero Features' that solve the main pain point. Ignore generic features like 'Login' or 'Dashboard'.

Return ONLY valid JSON:
{
  "product_category": string,
  "target_users": string[],
  "key_value_proposition": string,
  "business_model": string,
  "short_summary": string,
  "use_cases": string[],
  "key_features": string[],
  "tech_stack_signals": string[]
}

RULES:
- business_model must be: "Subscription-based SaaS", "Freemium SaaS", "Enterprise SaaS", "Marketplace", "Usage-based pricing", or "One-time purchase".
- Use "Freemium SaaS" for developer tools with a free tier.
- Think step-by-step: Is this a standalone app, an API, or a service? Who would pay for this?
- If information is missing, use empty array [] or empty string "".
- Output ONLY JSON.
`,
      },
      {
        role: "user",
        content: text.slice(0, 8000),
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = JSON.parse(response.choices[0].message.content || "{}");
  const parsed = AnalysisSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid analysis response");
  return parsed.data;
}
