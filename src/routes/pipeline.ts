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





// const app = express();
// const PORT = process.env.PORT || 2000;

// app.use(morgan("tiny"));

// app.use(
//   cors({
//     origin: (origin, callback) => {
     
//       if (!origin) return callback(null, true);

      
//       if (origin === "http://localhost:3000") {
//         return callback(null, true);
//       }

      
//       if (/\.vercel\.app$/.test(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error(`CORS blocked: ${origin}`));
//     },
//     credentials: true, 
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(cookieParser());
// app.use(express.json());

// app.use("/api/users", authRouter);
// app.use("/api/events", eventRouter);
// app.use("/api/todo/overdue", filterObjectRouter);
// app.use("/api/todo", todoRouter);

// app.use((_, res) => {
//   res.status(404).json({ message: "Route not found", status: "error" });
// });

// app.use((err, req, res, next) => {
//   console.error("error:", err.message);
//   res.status(err.status || 500).json({ message: err.message || "Server error" });
// });

// cleanExpiredSessions().catch(console.error);
// setInterval(cleanExpiredSessions, 1000 * 60 * 60);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
