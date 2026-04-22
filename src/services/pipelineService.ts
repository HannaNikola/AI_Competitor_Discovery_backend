import { ResultSchema } from "../schema/schema";
import { createAgentWorkflow } from "../lib/agentWorkflow";


// export const runPipeline = async (url: string) => {
//   const workflow = createAgentWorkflow();
//   const result = await workflow.invoke({ url });

//   const parsed = ResultSchema.safeParse(result);

//   if (!parsed.success) {
//     throw new Error("Invalid pipeline response");
//   }
//   return parsed.data;
// };


export const runPipeline = async (url: string) => {
  try {
    const workflow = createAgentWorkflow();

    const result = await Promise.race([
      workflow.invoke({ url }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 20000)
      ),
    ]);

    const parsed = ResultSchema.safeParse(result);

    if (!parsed.success) {
      throw new Error("Invalid pipeline response");
    }

    return parsed.data;

  } catch (error: any) {

    // 💰 деньги закончились
    if (
      error?.status === 429 ||
      error?.message?.includes("quota")
    ) {
      throw new Error(
        "Analysis is temporarily unavailable due to limited AI credits."
      );
    }

    // ⏱️ таймаут
    if (error?.message?.includes("Timeout")) {
      throw new Error(
        "The analysis took too long. Please try another website."
      );
    }

    // 🌐 scraping ошибки
    if (error?.message?.includes("page.goto")) {
      throw new Error(
        "We couldn't access this website. It may block automated access."
      );
    }

    throw error;
  }
};
