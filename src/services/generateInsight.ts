import OpenAI from "openai";
import { InsightSchema } from "../schema/schema";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export async function generateInsight(analysis: any, competitors: any[]) {
//   const prompt = `
// You are a Startup Strategist. Define the competitive gap.

// Startup: ${JSON.stringify(analysis)}
// Competitors: ${JSON.stringify(competitors)}

// Task:
// - product_positioning: Map the product (e.g., "Developer-first infrastructure" vs "SMB No-code tool"). Identify if it's a 'Point Solution' or a 'Platform'.
// - notable_differentiators: Identify the ONE technical or product "hook" that makes it unique. Avoid generic words like "flexible" or "seamless".
// - technical_focus: Analyze the "How". (e.g., Event-driven architecture, LLM wrapper, Data aggregator, Real-time sync).
// - complexity: Estimate implementation effort (e.g., "Low: Self-service" vs "High: Requires custom API mapping").

// Return ONLY valid JSON:
// {
//    "product_positioning": string,
//    "primary_audience": string,
//    "notable_differentiators": string,
//    "technical_focus": string,
//    "implementation_complexity": string
// }

// RULES:
// - Do not repeat the product's name in differentiators.
// - Focus on technical reality, not marketing fluff.
// - Output ONLY JSON.
// `;

//   const response = await client.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a product strategist. Focus on technical reality, not marketing fluff.",
//       },
//       { role: "user", content: prompt },
//     ],
//     response_format: { type: "json_object" },
//   });

//   const raw = JSON.parse(response.choices[0].message.content || "{}");
//   const parsed = InsightSchema.safeParse(raw);
//   if (!parsed.success) throw new Error("Invalid insight response");
//   return parsed.data;
// }


export async function generateInsight(analysis: any, competitors: any[]) {
  const prompt = `
You are a Product Strategy Analyst. Your task is to provide a technical and business snapshot of the startup based ONLY on the provided data.


Startup: ${JSON.stringify(analysis)}
Competitors: ${JSON.stringify(competitors)}

Task:
Provide a concise architectural and business breakdown using these 4 fields:

1. core_mechanics: Describe the primary technical engine (e.g., "Bi-directional state sync", "LLM-wrapper with custom prompts", "Heuristic-based data scraper").
2. monetization_leverage: Identify what drives the price based on their model (e.g., "Seat-based (per user)", "Usage-based (per credit/API call)", "Tiered feature access"). 
3. integration_strategy: How the product fits into the user's stack (e.g., "Native API-level integration", "Browser-extension overlay", "Standalone platform").
4. adoption_barrier: Technical or operational effort required to start (e.g., "Zero-config (Oauth only)", "Complex: Requires custom schema mapping", "Manual data migration").
5.- key_features: Identify 3-5 unique "killer features" or standout capabilities that define the product experience.

STRICT ANTI-HALLUCINATION RULES:
- key_features should be concise, separated by semicolons.
- Do not repeat information from the analysis block.
-"Use professional yet accessible language. Imagine you are explaining this to a product lead in a brief hallway conversation."
- Use ONLY the provided Startup and Competitors data. 
- DO NOT invent pricing numbers or features not mentioned in the text.
- If the data is insufficient to determine a field, write "Information not available based on provided source".
- Avoid marketing fluff (e.g., "amazing", "powerful", "world-class"). 
- Focus on technical reality and observable business facts.
- Return ONLY valid JSON.
Return ONLY valid JSON:
{
   "core_mechanics": string,
   "monetization_leverage": string,
   "integration_strategy": string,
   "adoption_barrier": string,
   "key_features": string
}`;



  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a neutral technical strategist. You analyze data objectively without speculation or invented facts.",
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
