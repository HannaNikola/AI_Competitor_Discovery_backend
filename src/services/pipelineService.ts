import { ResultSchema } from "../schema/schema";
import { createAgentWorkflow } from "../lib/agentWorkflow";
import { checkCredits } from "../helpers/checkCredits";

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
    // await checkCredits();
  const workflow = createAgentWorkflow();
  const result = await workflow.invoke({ url });

  const parsed = ResultSchema.safeParse(result);

  if (!parsed.success) {
    throw new Error("Invalid pipeline response");
  }
  return parsed.data;
};
