import { postJson } from "./http.js";
import { MAX_OUTPUT_TOKENS, PALETTE_SCHEMA, SYSTEM_PROMPT, TOOL_DESCRIPTION, TOOL_NAME } from "./palette.js";
import { ProviderError, type PaletteProvider } from "./types.js";

interface ChatCompletion {
  choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
}

export function createOpenAiProvider(apiKey: string, model: string): PaletteProvider {
  return {
    id: "openai",
    async propose(theme) {
      const data = (await postJson(
        "https://api.openai.com/v1/chat/completions",
        { Authorization: `Bearer ${apiKey}` },
        {
          model,
          max_completion_tokens: MAX_OUTPUT_TOKENS,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: theme },
          ],
          tools: [
            {
              type: "function",
              function: { name: TOOL_NAME, description: TOOL_DESCRIPTION, parameters: PALETTE_SCHEMA },
            },
          ],
          tool_choice: { type: "function", function: { name: TOOL_NAME } },
        },
      )) as ChatCompletion;

      const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (typeof args !== "string") throw new ProviderError("AI response did not include a palette proposal.");

      try {
        return JSON.parse(args) as Record<string, unknown>;
      } catch {
        throw new ProviderError("AI response was not valid JSON.");
      }
    },
  };
}
