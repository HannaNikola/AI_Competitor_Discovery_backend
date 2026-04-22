import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function checkCredits() {
  try {
    const response = await client.models.list();

    // если запрос прошёл — ключ рабочий и баланс ещё есть
    return true;
  } catch (error: any) {
    if (
      error?.status === 429 &&
      (error?.error?.code === "insufficient_quota" ||
        error?.code === "insufficient_quota")
    ) {
      throw new Error(
        "Analysis is temporarily unavailable because the AI service credits have run out.",
      );
    }

    if (error?.status === 401) {
      throw new Error(
        "Analysis is temporarily unavailable because the AI service is not configured correctly.",
      );
    }

    throw new Error(
      "Analysis is temporarily unavailable. Please try again later.",
    );
  }
}
