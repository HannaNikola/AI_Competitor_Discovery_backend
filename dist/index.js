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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
(0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (origin === "http://localhost:3000") {
            return callback(null, true);
        }
        if (/\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
app.use(express_1.default.json());
app.use("/api", pipeline_1.default);
app.use((_, res) => {
    res.status(404).json({ message: "Route not found", status: "error" });
});
// app.use((err, req, res, next) => {
//   console.error("error:", err.message);
//   res.status(err.status || 500).json({ message: err.message || "Server error" });
// });
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
