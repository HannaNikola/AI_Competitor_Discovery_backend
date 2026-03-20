type VectorItem = {
  url: string;
  embedding: number[];
  metadata?: any;
};

// Наше временное хранилище в оперативной памяти (обнуляется при перезагрузке сервера)
export const vectorDB: VectorItem[] = [];

/**
 * Добавляет вектор в базу
 */
export function addVector(item: VectorItem) {
  vectorDB.push(item);
}

/**
 * Математическая функция косинусного сходства
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0; // Защита от векторов разной длины

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);

  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0; // Защита от деления на ноль

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Ищет наиболее похожие элементы
 */
export function findSimilar(queryEmbedding: number[], topK = 3) {
  const scored = vectorDB.map((item) => ({
    url: item.url,
    metadata: item.metadata,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  // Сортируем: от самого высокого совпадения (1.0) до самого низкого (0.0)
  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
