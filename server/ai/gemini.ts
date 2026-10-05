import { postJson } from "./http.js";
import { MAX_OUTPUT_TOKENS, PALETTE_SCHEMA, SYSTEM_PROMPT, TOOL_DESCRIPTION, TOOL_NAME } from "./palette.js";
import { ProviderError, type PaletteProvider } from "./types.js";

interface GenerateContentResponse {
  candidates?: { content?: { parts?: { functionCall?: { args?: Record<string, unknown> } }[] } }[];
}

export function createGeminiProvider(apiKey: string, model: string): PaletteProvider {
  return {
    id: "gemini",
    async propose(theme) {
      // The key goes in a header, not the URL, so it can't end up in logs or error messages.
      const data = (await postJson(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        { "x-goog-api-key": apiKey },
        {
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: theme }] }],
          tools: [
            {
              functionDeclarations: [
                { name: TOOL_NAME, description: TOOL_DESCRIPTION, parameters: PALETTE_SCHEMA },
              ],
            },
          ],
          toolConfig: { functionCallingConfig: { mode: "ANY", allowedFunctionNames: [TOOL_NAME] } },
          generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
        },
      )) as GenerateContentResponse;

      const call = data.candidates?.[0]?.content?.parts?.find((part) => part.functionCall)?.functionCall;
      if (!call?.args) throw new ProviderError("AI response did not include a palette proposal.");
      return call.args;
    },
  };
}
