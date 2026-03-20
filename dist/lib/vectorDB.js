"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorDB = void 0;
exports.addVector = addVector;
exports.findSimilar = findSimilar;
// Наше временное хранилище в оперативной памяти (обнуляется при перезагрузке сервера)
exports.vectorDB = [];
/**
 * Добавляет вектор в базу
 */
function addVector(item) {
    exports.vectorDB.push(item);
}
/**
 * Математическая функция косинусного сходства
 */
function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        return 0; // Защита от векторов разной длины
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0)
        return 0; // Защита от деления на ноль
    return dotProduct / (magnitudeA * magnitudeB);
}
/**
 * Ищет наиболее похожие элементы
 */
function findSimilar(queryEmbedding, topK = 3) {
    const scored = exports.vectorDB.map((item) => ({
        url: item.url,
        metadata: item.metadata,
        score: cosineSimilarity(queryEmbedding, item.embedding),
    }));
    // Сортируем: от самого высокого совпадения (1.0) до самого низкого (0.0)
    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
