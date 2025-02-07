import express from "express";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("i'm alive")
})


app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})