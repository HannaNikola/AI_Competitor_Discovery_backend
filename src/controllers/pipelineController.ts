import { runPipeline } from "../services/pipelineService";
import { Request, Response } from "express";

export const pipelineControllers = async (req: Request, res: Response) => {
  const { url } = req.body;

  try {
    const data = await runPipeline(url);

    res.json({
  success: true,
  ...data,
});
  } catch (error: any) {
     res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal server error",
  });
  }
};

