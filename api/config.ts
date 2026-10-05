import type { VercelRequest, VercelResponse } from "@vercel/node";
import { publicAiConfig } from "../server/ai/index.js";

// Never returns the key itself — only whether the server has one configured (plus
// provider id and demo flag), so the frontend can show/hide the AI option without
// ever handling a secret.
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json(publicAiConfig());
}
