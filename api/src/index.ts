import express from "express";

// TODO: Replace with environment config
const port = 3000;

const app = express();

app.get("/api", (_req, res) => res.sendStatus(200));
app.listen(port, () => console.log(`Listening on port ${port}`));