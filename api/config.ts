import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAiConfigured } from "../server/env";

// Never returns the key itself — only whether the server has one configured,
// so the frontend can show/hide the AI option without ever handling a secret.
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ aiAvailable: isAiConfigured });
}
