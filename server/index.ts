import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { PORT } from "./env.js";
import { isAiConfigured, publicAiConfig } from "./ai/index.js";
import { rateLimit } from "./rateLimit.js";
import { handlePaletteAiRequest } from "./paletteAiRoute.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

// Never returns the key itself — only whether the server has one configured (plus
// provider id and demo flag), so the frontend can show/hide the AI option without
// ever handling a secret.
app.get("/api/config", (_req, res) => {
  res.json(publicAiConfig());
});

app.post("/api/palette/ai", rateLimit, async (req, res) => {
  const { status, body } = await handlePaletteAiRequest(req.body?.theme);
  res.status(status).json(body);
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} (AI ${isAiConfigured ? "enabled" : "disabled"})`);
});
