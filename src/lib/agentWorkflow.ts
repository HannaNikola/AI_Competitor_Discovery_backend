import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { analyzeSturtup } from "../services/analyzeStartup";
import { getEmbedding } from "../services/embeddings";
import { generateInsight } from "../services/generateInsight";
import { scrapeWebsite } from "../services/scraper";
import { addVector, findSimilar } from "./vectorDB";
import { discoverStartupsNode } from "../services/discoverStartups";
import { rerankCompetitors } from "../services/rerankCompetitors";
import { validatePageNode } from "../schema/validatePageNode";


export const AgentStateAnnotation = Annotation.Root({
  url: Annotation<string>(),
  websiteText: Annotation<string>(),
  analysis: Annotation<any>(),
  competitors: Annotation<any[]>(),
  insight: Annotation<any>(),
  discoveredStartups: Annotation<any[]>(),
});


export type AgentState = typeof AgentStateAnnotation.State;



async function scrapeNode(state: AgentState) {
  const text = await scrapeWebsite(state.url);
  return { websiteText: text };
}

async function analysisNode(state: AgentState) {
  const text = state.websiteText?.trim();

  if (!text || text.length < 200) {
    throw new Error(
      "We couldn't extract enough information from this page. Please try a company homepage, product page, pricing page, or documentation page.",
    );
  }

  const analysis = await analyzeSturtup(text);

  const totalFields = 8;

  const filledFields = [
    analysis.product_category,
    analysis.target_users?.length ? "target_users" : "",
    analysis.key_value_proposition,
    analysis.business_model,
    analysis.short_summary,
  ].filter(Boolean).length;

  const emptyFields = totalFields - filledFields;

  
  if (emptyFields > 3) {
    throw new Error(
      "We couldn't identify enough information about this company or product. Please try a homepage, product page, pricing page, or documentation page.",
    );
  }

  if (
    analysis.business_model === "Unknown" &&
    !analysis.product_category &&
    !analysis.key_value_proposition
  ) {
    throw new Error(
      "This website does not show enough signals of a startup or digital product.",
    );
  }
  return { analysis };
}

async function competitorNode(state: AgentState) {
  if (!state.analysis) throw new Error("Нет анализа для поиска конкурентов");

  const startups = state.discoveredStartups || [];

  const queryEmbedding = await getEmbedding(JSON.stringify(state.analysis));

  for (const s of startups) {
    const embedding = await getEmbedding(`${s.name} - ${s.description}`);
    addVector({
      url: s.url,
      embedding,
      metadata: s,
    });
  }

  const candidates = findSimilar(queryEmbedding, 10);
  const competitors = await rerankCompetitors(state.analysis, candidates);

  return { competitors };
}

async function insightNode(state: AgentState) {
  const insight = await generateInsight(
    state.analysis,
    state.competitors || [],
  );

  return { insight };
}

export function createAgentWorkflow() {
  const workflow = new StateGraph(AgentStateAnnotation)

    .addNode("discoverStartups", discoverStartupsNode)
    .addNode("scrapeWebsite", scrapeNode)

    
    .addNode("validatePageNode", validatePageNode)

    .addNode("analyzeStartup", analysisNode)
    .addNode("findCompetitors", competitorNode)
    .addNode("generateInsight", insightNode)

    .addEdge(START, "discoverStartups")
    .addEdge("discoverStartups", "scrapeWebsite")

    
    .addEdge("scrapeWebsite", "validatePageNode")
    .addEdge("validatePageNode", "analyzeStartup")

    .addEdge("analyzeStartup", "findCompetitors")
    .addEdge("findCompetitors", "generateInsight")
    .addEdge("generateInsight", END);

  return workflow.compile();
}
