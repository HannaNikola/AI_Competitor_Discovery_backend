import express from "express";
import cors from "cors";
import pipelineRouter from "./routes/pipline";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", pipelineRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

