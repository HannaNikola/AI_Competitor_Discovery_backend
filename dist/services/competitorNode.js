"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.competitorNode = competitorNode;
const embeddings_1 = require("./embeddings");
const vectorDB_1 = require("../lib/vectorDB");
const rerankCompetitors_1 = require("./rerankCompetitors");
async function competitorNode(state) {
    const startups = state.discoveredStartups || [];
    const queryEmbedding = await (0, embeddings_1.getEmbedding)(JSON.stringify(state.analysis));
    for (const s of startups) {
        const embedding = await (0, embeddings_1.getEmbedding)(`${s.name} - ${s.description}`);
        (0, vectorDB_1.addVector)({
            url: s.url,
            embedding,
            metadata: s,
        });
    }
    const candidates = (0, vectorDB_1.findSimilar)(queryEmbedding, 10);
    const competitors = await (0, rerankCompetitors_1.rerankCompetitors)(state.analysis, candidates);
    return { competitors };
}
