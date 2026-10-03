# Huecode

Turn a few words or an image into an accessible Tailwind color palette. See it on real interface mockups in light and dark, then copy the code.

![Huecode showing a generated palette applied to an app mockup, in light mode](docs/screenshots/app-light.jpg)

<details>
<summary>More screenshots</summary>

| | Light | Dark |
| --- | --- | --- |
| App | ![App preview, light](docs/screenshots/app-light.jpg) | ![App preview, dark](docs/screenshots/app-dark.jpg) |
| Components | ![Components preview, light](docs/screenshots/components-light.jpg) | ![Components preview, dark](docs/screenshots/components-dark.jpg) |
| Marketing | ![Marketing preview, light](docs/screenshots/marketing-light.jpg) | ![Marketing preview, dark](docs/screenshots/marketing-dark.jpg) |

</details>

## What it does

- **Generate from text or an image.** Type a theme like "sunset over the sea" or start from an image. Plain text generation works offline and gives the same palette for the same words. Shuffle produces variations.
- **AI enhancement (optional).** With an API key for Anthropic, OpenAI or Gemini, the text path can ask a model for a palette instead.
- **A full scale per role.** Each color role gets an 11-step shade scale, plus semantic tokens for light and dark themes.
- **Live preview.** The palette is applied to App, Components and Marketing mockups, in light and dark, with soft or sharp corners.
- **Export.** Copy or download the result as Tailwind v4, Tailwind v3, CSS variables or TypeScript tokens. Every format includes both the shade scale and the semantic light and dark tokens.

## Quick start

Requires Node 22.

```bash
git clone https://github.com/larisabarabas/huecode.git
cd huecode
npm ci
npm run dev
```

Then open `http://localhost:5173`. The API runs on port 8787.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Web app and API together, with reload |
| `npm run build` | Type-checks the app and the server, then builds |
| `npm test` | Runs the Vitest suite |
| `npm start` | Runs the API server |

## AI enhancement and your API key

Everything except AI enhancement works with no key at all.

To use the AI path, copy `.env.example` to `.env` and set a key for one provider: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` or `GEMINI_API_KEY`. If you set more than one, choose with `AI_PROVIDER` (`anthropic`, `openai` or `gemini`). `AI_MODEL` overrides the provider's default model. Keys are read only on the server (`server/ai/config.ts`) and are never sent to the browser, and the app has no place to type a key in. Without a key, the server reports AI as unavailable through `/api/config` and the app hides the AI option.

The server limits AI requests to 30 per hour per client. On serverless hosts this limit is best-effort. Requests to the AI path use your key and can cost money, so keep it out of version control. `.env` is already in `.gitignore`, and setting a spend limit in your provider's console is a good idea.

### Output token limit

Each AI request is capped at 700 output tokens, which is plenty for eight HSL colors and a one-sentence rationale. The cap is the `MAX_OUTPUT_TOKENS` constant in `server/ai/palette.ts`, and all three providers use it. It is not an environment variable, so change it in that file. Raise it if your model is cut off before it finishes a palette. Models that spend tokens on internal reasoning before answering are the likeliest to need more. A cut-off shows up as "AI palette generation failed" in the app and a "did not include a palette proposal" error in the server log.

### The hosted demo

The hosted demo runs on the maintainer's key, which lives in the host's environment settings and not in this repository. That key has a monthly spend cap, and the demo tells you so next to the AI toggle. If the cap is reached, AI pauses and the standard generator keeps working. The server remembers the pause in memory for 30 minutes, so on serverless hosts it is best-effort: the first request on each instance may still fail before the toggle shows as paused. For unlimited use, self-host with your own key. Set `AI_DEMO_MODE=true` only if you run a public instance on a capped shared key and want the same notice.

## Fonts

The interface loads Instrument Sans and JetBrains Mono, both open-licensed, from Google Fonts at runtime. That means Google receives a request when the page loads.

## Roadmap

A snapshot of what's planned. Priorities can change, and an issue is the place to discuss anything here.

- A loading state for AI generation, so the palette doesn't look frozen while waiting
- More accurate color extraction from images
- Showing the raw colors the AI proposed, before the shade scales are built

## Contributing

Contributions are welcome, and Huecode works issue-first: open an issue before you write code, for everything. See [CONTRIBUTING.md](CONTRIBUTING.md) for the scope, setup and PR checklist. To report a security problem privately, see [SECURITY.md](SECURITY.md).
## License

[MIT](LICENSE) © 2026 Stefania Barabas
