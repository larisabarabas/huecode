import "dotenv/config";

// AI provider/key/model config lives in server/ai/config.ts; this file only has to
// guarantee .env is loaded before anything reads process.env.
export const PORT = Number(process.env.PORT ?? 8787);
