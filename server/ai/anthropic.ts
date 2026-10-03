import Anthropic from "@anthropic-ai/sdk";
import { isBudgetStatus, looksLikeBudgetExhausted } from "./http.js";
import { MAX_OUTPUT_TOKENS, PALETTE_SCHEMA, SYSTEM_PROMPT, TOOL_DESCRIPTION, TOOL_NAME } from "./palette.js";
import { ProviderError, type PaletteProvider } from "./types.js";

export function createAnthropicProvider(apiKey: string, model: string): PaletteProvider {
  const client = new Anthropic({ apiKey });

  return {
    id: "anthropic",
    async propose(theme) {
      let message: Anthropic.Message;
      try {
        message = await client.messages.create({
          model,
          max_tokens: MAX_OUTPUT_TOKENS,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: theme }],
          tools: [
            {
              name: TOOL_NAME,
              description: TOOL_DESCRIPTION,
              input_schema: PALETTE_SCHEMA as Anthropic.Tool.InputSchema,
            },
          ],
          tool_choice: { type: "tool", name: TOOL_NAME },
        });
      } catch (err) {
        if (err instanceof Anthropic.APIError) {
          // Anthropic reports an empty balance as a 400 and a hit spend limit as a 4xx/429 with this wording.
          throw new ProviderError(`Anthropic request failed (${err.status}): ${err.message}`, {
            budgetExhausted: isBudgetStatus(err.status) && looksLikeBudgetExhausted(err.message),
          });
        }
        throw err;
      }

      const toolUse = message.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
      );
      if (!toolUse) throw new ProviderError("AI response did not include a palette proposal.");
      return toolUse.input as Record<string, unknown>;
    },
  };
}
