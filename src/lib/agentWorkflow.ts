import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { analyzeSturtup } from "../services/analyzeStartup";
import { getEmbedding } from "../services/embeddings";
import { generateInsight } from "../services/generateInsight";
import { scrapeWebsite } from "../services/scraper";
import { addVector, findSimilar } from "./vectorDB";
import { discoverStartupsNode } from "../services/discoverStartups";
import { rerankCompetitors } from "../services/rerankCompetitors";

// 1. Определяем схему состояния (State)
// Annotation.Root автоматически создает "каналы" и правила обновления
const AgentStateAnnotation = Annotation.Root({
  url: Annotation<string>,
  websiteText: Annotation<string>,
  analysis: Annotation<any>,
  competitors: Annotation<any[]>,
  insight: Annotation<any>,
  discoveredStartups: Annotation<any[]>,
});

// Тип для использования внутри функций
type AgentState = typeof AgentStateAnnotation.State;

// 2. Функции-узлы (Nodes)
// получают текущее состояние и возвращают только то, что нужно обновить

async function scrapeNode(state: AgentState) {
  const text = await scrapeWebsite(state.url);
  return { websiteText: text };
}

async function analysisNode(state: AgentState) {
  if (!state.websiteText) throw new Error("Нет текста для анализа");

  const analysis = await analyzeSturtup(state.websiteText);
  return { analysis };
}

async function competitorNode(state: AgentState) {
  if (!state.analysis) throw new Error("Нет анализа для поиска конкурентов");

  const startups = state.discoveredStartups || [];

  // 1 Эмбеддинг анализируемого стартапа
  const queryEmbedding = await getEmbedding(JSON.stringify(state.analysis));

  // 2 Загружаем Product Hunt стартапы в vectorDB
  for (const s of startups) {
    const embedding = await getEmbedding(`${s.name} - ${s.description}`);
    addVector({
      url: s.url,
      embedding,
      metadata: s,
    });
  }

  // 3 Находим кандидатов
  const candidates = findSimilar(queryEmbedding, 10);

  // 4 Опциональный rerank через GPT для точного порядка
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
    .addNode("analyzeStartup", analysisNode)
    .addNode("findCompetitors", competitorNode)
    .addNode("generateInsight", insightNode)

    .addEdge(START, "discoverStartups")
    .addEdge("discoverStartups", "scrapeWebsite")
    .addEdge("scrapeWebsite", "analyzeStartup")
    .addEdge("analyzeStartup", "findCompetitors")
    .addEdge("findCompetitors", "generateInsight")
    .addEdge("generateInsight", END);

  return workflow.compile();
}
