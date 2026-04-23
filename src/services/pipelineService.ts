import { ResultSchema } from "../schema/schema";
import { createAgentWorkflow } from "../lib/agentWorkflow";


export const runPipeline = async (url: string) => {
  const workflow = createAgentWorkflow();
  const result = await workflow.invoke({ url });

  const parsed = ResultSchema.safeParse(result);

  if (!parsed.success) {
    throw new Error("Invalid pipeline response");
  }
  return parsed.data;
};


