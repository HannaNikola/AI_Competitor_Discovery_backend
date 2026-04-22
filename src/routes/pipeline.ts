import { Router } from "express";
import { createAgentWorkflow } from "../lib/agentWorkflow";
import { ResultSchema } from "../schema/schema";
import { pipelineControllers } from "../controllers/pipelineController";

const router = Router();


router.post("/pipeline", pipelineControllers)
export default router;


