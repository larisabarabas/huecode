import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clientIpFromHeader, isRateLimited } from "../../server/rateLimit.js";
import { handlePaletteAiRequest } from "../../server/paletteAiRoute.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const ip = clientIpFromHeader(req.headers["x-forwarded-for"]);
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many AI requests. Please try again later." });
    return;
  }

  const { status, body } = await handlePaletteAiRequest(req.body?.theme);
  res.status(status).json(body);
}
