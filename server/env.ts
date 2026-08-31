import "dotenv/config";

export const PORT = Number(process.env.PORT ?? 8787);
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
export const isAiConfigured = Boolean(ANTHROPIC_API_KEY);
