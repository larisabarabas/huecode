import { postJson } from "./http.js";
import { MAX_OUTPUT_TOKENS, PALETTE_SCHEMA, SYSTEM_PROMPT, TOOL_DESCRIPTION, TOOL_NAME } from "./palette.js";
import { ProviderError, type PaletteProvider } from "./types.js";

interface ChatCompletion {
  choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
}

/** A 400 that names reasoning_effort: the model doesn't take that parameter (e.g. gpt-4o). */
function rejectsReasoningEffort(err: unknown): boolean {
  return err instanceof ProviderError && /\(400\)/.test(err.message) && /reasoning_effort/.test(err.message);
}

export function createOpenAiProvider(apiKey: string, model: string): PaletteProvider {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = { Authorization: `Bearer ${apiKey}` };

  return {
    id: "openai",
    async propose(theme) {
      const body = {
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
      };

      // /chat/completions rejects function tools on reasoning models unless reasoning is off
      // ("Function tools with reasoning_effort are not supported ... set reasoning_effort to 'none'"),
      // which is how the default model (gpt-6-luna) failed. Non-reasoning models (e.g. gpt-4o),
      // which can be selected via AI_MODEL, reject the parameter itself, so on that 400 we retry without it.
      //
      // Known gap: a reasoning model that doesn't accept "none" fails both attempts, and the second
      // error is the tools/reasoning one above. Supporting those means moving this adapter to
      // /v1/responses, which allows function tools alongside reasoning. Until then, pick a model
      // that accepts reasoning_effort "none" or has no reasoning.
      let data: ChatCompletion;
      try {
        data = (await postJson(url, headers, { ...body, reasoning_effort: "none" })) as ChatCompletion;
      } catch (err) {
        if (!rejectsReasoningEffort(err)) throw err;
        data = (await postJson(url, headers, body)) as ChatCompletion;
      }

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
