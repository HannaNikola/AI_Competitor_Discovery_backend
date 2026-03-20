import express from "express";
import cors from "cors";
import pipelineRouter from "./routes/pipeline";
import dotenv from "dotenv";

dotenv.config();

const app = express();




const corsOptions = {
  origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", pipelineRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});