import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

const requestLog = new Map<string, number[]>();

/**
 * Simple in-memory per-IP rate limit. This is a single-user local tool, not
 * a distributed service, so no shared store is needed — just enough to stop
 * a runaway client loop from burning through API spend.
 */
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ error: "Too many AI requests. Please try again later." });
    return;
  }

  recent.push(now);
  requestLog.set(key, recent);
  next();
}
