import express from "express";
import cors from "cors";
import pipelineRouter from "./routes/pipeline";
import dotenv from "dotenv";

dotenv.config();

// const app = express();

// const PORT = process.env.PORT || 3001;


// cors({
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


// app.use(express.json());
// app.use("/api", pipelineRouter);

// app.use((_, res) => {
//   res.status(404).json({ message: "Route not found", status: "error" });
// });


// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin === "http://localhost:3000") return callback(null, true);
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/api", pipelineRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found", status: "error" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});