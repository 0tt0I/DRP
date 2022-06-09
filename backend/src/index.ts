import express from "express";

const app = express();

app.get("/api", (_req, res) => res.sendStatus(200));
app.listen(3000, () => console.log("Listening on port 3000"));

