import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("i'm alive")
})


import ApiRoutes from "./routes/api.routes.js";
app.use("/api", ApiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})