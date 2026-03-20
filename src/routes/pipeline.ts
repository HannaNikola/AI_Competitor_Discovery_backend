import { Router } from "express";
import { createAgentWorkflow } from "../lib/agentWorkflow";
import { ResultSchema } from "../lib/schema";

const router = Router();

router.post("/pipeline", async (req, res) => {
  const { url } = req.body;

  try {
    const workflow = createAgentWorkflow();
    const result = await workflow.invoke({ url });

    const parsed = ResultSchema.safeParse(result);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid pipeline response",
      });
    }

    res.json({
      success: true,
      ...parsed.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;



