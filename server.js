import express from "express";
import "dotenv/config";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(express.static("public"));
app.use(cors());
app.use(helmet());
app.use(limiter)

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("i'm alive")
})


import ApiRoutes from "./routes/api.routes.js";
import { limiter } from "./config/rateLimiter.js";
import logger from "./config/logger.js";
app.use("/api", ApiRoutes);

import './jobs'

app.use((req, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})