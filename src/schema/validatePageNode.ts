import type { AgentState } from "../lib/agentWorkflow";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function validatePageNode(state: AgentState) {
  if (!state.websiteText || state.websiteText.trim().length < 200) {
    throw new Error("We couldn't read enough information from this page.");
  }
  const text = state.websiteText.toLowerCase();

  const blockedDomains = [
    "producthunt.com",
    "linkedin.com",
    "crunchbase.com",
    "facebook.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "youtube.com",
  ];

  if (blockedDomains.some((d) => state.url.includes(d))) {
    throw new Error(
      "Please enter the official website of a startup or product.",
    );
  }
  const suspiciousSignals = [
    "captcha",
    "cloudflare",
    "access denied",
    "404",
    "page not found",
    "enable javascript",
    "too many requests",
    "checking your browser",
  ];

  if (suspiciousSignals.filter((s) => text.includes(s)).length >= 2) {
    throw new Error(
      "We couldn't analyze this page. Please enter a public startup or product website.",
    );
  }

  const validateResponse = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
                You are a filter for a startup analysis tool.

Determine whether the provided website text belongs to:
- a technology startup
- a SaaS product
- an app
- a developer tool
- an AI product
- a digital platform
- a startup that could plausibly appear on Product Hunt

Reject:
- local businesses
- restaurants
- salons
- real estate agencies
- law firms
- generic ecommerce stores
- traditional businesses without a technology product

Return ONLY valid JSON:
 {
  "is_startup": boolean,
  "reason": string
}

RULES:
- is_startup should be true only if the business appears to sell or provide a digital/technology product
- SaaS, API products, AI tools, fintech, devtools, marketplaces, and software platforms should return true
- Keep reason short
, `,
      },
      {
        role: "user",
        content: state.websiteText.slice(0, 8000),
      },
    ],
  });
  const result = JSON.parse(
    validateResponse.choices[0].message.content || "{}",
  );

  if (!result.is_startup) {
    throw new Error(
      result.reason
        ? `We only analyze startups and digital products. ${result.reason}`
        : "We only analyze startups and digital products.",
    );
  }
  return {};
}
