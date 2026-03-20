import { getEmbedding } from "./embeddings";
import { addVector, findSimilar } from "../lib/vectorDB";
import { rerankCompetitors } from "./rerankCompetitors";

export async function competitorNode(state: any) {
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
