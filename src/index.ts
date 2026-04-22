import express from "express";
import cors from "cors";
import pipelineRouter from "./routes/pipeline";
import dotenv from "dotenv";

// для рендера
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "https://ai-competitor-discovery.vercel.app",
// ];

// // Первым делом — вручную выставляем CORS заголовки для всех запросов
// app.use((req, res, next) => {
//   const origin = req.headers.origin as string;

//   const isAllowed =
//     !origin ||
//     allowedOrigins.includes(origin) ||
//     /^https:\/\/ai-competitor-discovery.*\.vercel\.app$/.test(origin);

//   if (isAllowed && origin) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );

//   // Preflight — сразу отвечаем 204
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }

//   next();
// });

// app.use(express.json());

// app.use("/api", pipelineRouter);

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// app.use((err: any, req: any, res: any, next: any) => {
//   console.error("Server error:", err.message);
//   res.status(500).json({ message: err.message || "Internal server error" });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://ai-competitor-discovery.vercel.app",
];


app.use((req, res, next) => {
  const origin = req.headers.origin as string;

  const isAllowed =
    !origin ||
    allowedOrigins.includes(origin) ||
    /^https:\/\/ai-competitor-discovery.*\.vercel\.app$/.test(origin);

  if (isAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use("/api", pipelineRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});