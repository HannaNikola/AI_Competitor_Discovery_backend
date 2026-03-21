"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pipeline_1 = __importDefault(require("./routes/pipeline"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (origin === "http://localhost:3000" ||
            origin === "http://127.0.0.1:3000") {
            return callback(null, true);
        }
        if (origin === "https://ai-competitor-discovery.vercel.app") {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api", pipeline_1.default);
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);
    res.status(500).json({
        message: err.message || "Internal server error",
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
