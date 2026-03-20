"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentWorkflow_1 = require("../lib/agentWorkflow");
const schema_1 = require("../lib/schema");
const router = (0, express_1.Router)();
router.post("/pipeline", async (req, res) => {
    const { url } = req.body;
    try {
        const workflow = (0, agentWorkflow_1.createAgentWorkflow)();
        const result = await workflow.invoke({ url });
        const parsed = schema_1.ResultSchema.safeParse(result);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
exports.default = router;
