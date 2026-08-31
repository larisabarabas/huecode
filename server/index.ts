import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { PORT, isAiConfigured } from "./env";
import { rateLimit } from "./rateLimit";
import { proposePaletteFromTheme } from "./anthropicPalette";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

const MAX_THEME_LENGTH = 200;

// Never returns the key itself — only whether the server has one configured,
// so the frontend can show/hide the AI option without ever handling a secret.
app.get("/api/config", (_req, res) => {
  res.json({ aiAvailable: isAiConfigured });
});

app.post("/api/palette/ai", rateLimit, async (req, res) => {
  const theme = req.body?.theme;

  if (typeof theme !== "string" || !theme.trim() || theme.length > MAX_THEME_LENGTH) {
    res.status(400).json({ error: `theme must be a non-empty string under ${MAX_THEME_LENGTH} characters.` });
    return;
  }

  if (!isAiConfigured) {
    res.status(503).json({ error: "AI is not configured on this server." });
    return;
  }

  try {
    const result = await proposePaletteFromTheme(theme.trim());
    res.json(result);
  } catch (err) {
    console.error("AI palette generation failed:", err);
    res.status(502).json({ error: "AI palette generation failed. Try again, or generate without AI." });
  }
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
