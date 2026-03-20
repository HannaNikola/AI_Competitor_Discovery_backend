import express from "express";
import cors from "cors";
import pipelineRouter from "./routes/pipline";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", pipelineRouter);

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});




