import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAiConfigured } from "../../server/env";
import { isRateLimited } from "../../server/rateLimit";
import { proposePaletteFromTheme } from "../../server/anthropicPalette";

const MAX_THEME_LENGTH = 200;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const theme = req.body?.theme;

  if (typeof theme !== "string" || !theme.trim() || theme.length > MAX_THEME_LENGTH) {
    res.status(400).json({ error: `theme must be a non-empty string under ${MAX_THEME_LENGTH} characters.` });
    return;
  }

  if (!isAiConfigured) {
    res.status(503).json({ error: "AI is not configured on this server." });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many AI requests. Please try again later." });
    return;
  }

  try {
    const result = await proposePaletteFromTheme(theme.trim());
    res.status(200).json(result);
  } catch (err) {
    console.error("AI palette generation failed:", err);
    res.status(502).json({ error: "AI palette generation failed. Try again, or generate without AI." });
  }
}
