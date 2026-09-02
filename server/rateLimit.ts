import type { NextFunction, Request, Response } from "express";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

const requestLog = new Map<string, number[]>();

/**
 * Framework-agnostic in-memory per-key rate limit. Records the call and returns
 * true when the caller is over the limit. This is a single-user tool, not a
 * distributed service, so no shared store is needed — just enough to stop a
 * runaway client loop from burning through API spend. On serverless (Vercel)
 * the map lives per warm instance, so the limit is best-effort there.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) return true;

  recent.push(now);
  requestLog.set(key, recent);
  return false;
}

/** Express middleware wrapper around {@link isRateLimited}, used by the local dev server. */
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  if (isRateLimited(req.ip ?? "unknown")) {
    res.status(429).json({ error: "Too many AI requests. Please try again later." });
    return;
  }
  next();
}
