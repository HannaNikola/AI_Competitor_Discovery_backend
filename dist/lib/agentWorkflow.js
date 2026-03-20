"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentWorkflow = createAgentWorkflow;
const langgraph_1 = require("@langchain/langgraph");
const analyzeStartup_1 = require("../services/analyzeStartup");
const embeddings_1 = require("../services/embeddings");
const generateInsight_1 = require("../services/generateInsight");
const scraper_1 = require("../services/scraper");
const vectorDB_1 = require("./vectorDB");
const discoverStartups_1 = require("../services/discoverStartups");
const rerankCompetitors_1 = require("../services/rerankCompetitors");
// 1. Определяем схему состояния (State)
// Annotation.Root автоматически создает "каналы" и правила обновления
const AgentStateAnnotation = langgraph_1.Annotation.Root({
    url: (langgraph_1.Annotation),
    websiteText: (langgraph_1.Annotation),
    analysis: (langgraph_1.Annotation),
    competitors: (langgraph_1.Annotation),
    insight: (langgraph_1.Annotation),
    discoveredStartups: (langgraph_1.Annotation),
});
// 2. Функции-узлы (Nodes)
// получают текущее состояние и возвращают только то, что нужно обновить
async function scrapeNode(state) {
    const text = await (0, scraper_1.scrapeWebsite)(state.url);
    return { websiteText: text };
}
async function analysisNode(state) {
    if (!state.websiteText)
        throw new Error("Нет текста для анализа");
    const analysis = await (0, analyzeStartup_1.analyzeSturtup)(state.websiteText);
    return { analysis };
}
async function competitorNode(state) {
    if (!state.analysis)
        throw new Error("Нет анализа для поиска конкурентов");
    const startups = state.discoveredStartups || [];
    // 1 Эмбеддинг анализируемого стартапа
    const queryEmbedding = await (0, embeddings_1.getEmbedding)(JSON.stringify(state.analysis));
    // 2 Загружаем Product Hunt стартапы в vectorDB
    for (const s of startups) {
        const embedding = await (0, embeddings_1.getEmbedding)(`${s.name} - ${s.description}`);
        (0, vectorDB_1.addVector)({
            url: s.url,
            embedding,
            metadata: s,
        });
    }
    // 3 Находим кандидатов
    const candidates = (0, vectorDB_1.findSimilar)(queryEmbedding, 10);
    // 4 Опциональный rerank через GPT для точного порядка
    const competitors = await (0, rerankCompetitors_1.rerankCompetitors)(state.analysis, candidates);
    return { competitors };
}
async function insightNode(state) {
    const insight = await (0, generateInsight_1.generateInsight)(state.analysis, state.competitors || []);
    return { insight };
}
function createAgentWorkflow() {
    const workflow = new langgraph_1.StateGraph(AgentStateAnnotation)
        .addNode("discoverStartups", discoverStartups_1.discoverStartupsNode)
        .addNode("scrapeWebsite", scrapeNode)
        .addNode("analyzeStartup", analysisNode)
        .addNode("findCompetitors", competitorNode)
        .addNode("generateInsight", insightNode)
        .addEdge(langgraph_1.START, "discoverStartups")
        .addEdge("discoverStartups", "scrapeWebsite")
        .addEdge("scrapeWebsite", "analyzeStartup")
        .addEdge("analyzeStartup", "findCompetitors")
        .addEdge("findCompetitors", "generateInsight")
        .addEdge("generateInsight", langgraph_1.END);
    return workflow.compile();
}
