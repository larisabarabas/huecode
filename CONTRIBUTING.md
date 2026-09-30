# Contributing to Huecode

Thanks for your interest in Huecode. This guide covers how to propose a change, set up the project, and get a pull request merged.

## Scope

**Huecode turns text or an image into an accessible Tailwind color palette, with a live preview and code export.**

### What's welcome
- Bug fixes, accessibility improvements, documentation and tests.
- Improvements to palette generation, the previews and the export output.
- New export formats, with a PR that includes a documented solution and solid arguments for why the format belongs in Huecode.
- New AI providers. Anthropic is the only one supported today, and more are planned.

### What's out of scope
Nothing is ruled out yet. The issue-first rule below is how scope is decided.

## Before you open a PR

**Open an issue first, for everything.** That includes bug fixes and docs. Say what you want to change and why, and wait for a maintainer to confirm before writing code. A one-line issue is enough for a small fix. PRs without a linked, approved issue may be closed without review.

The maintainer has the final say on scope.

## Setup

Requires Node 22.

```bash
git clone https://github.com/larisabarabas/huecode.git
cd huecode
npm ci
cp .env.example .env   # optional, only needed for AI enhancement
npm run dev            # web on Vite, API on port 8787
```

Everything except AI enhancement works without a key. To try the AI path, add your own `ANTHROPIC_API_KEY` to `.env`. The key is only read on the server (`server/env.ts`) and never sent to the browser. Never commit `.env` or paste a key into an issue or PR.

## Checks

Run these before you push. CI runs the same two commands.

```bash
npm run build   # type-checks the app and the server, then builds
npm test        # Vitest suite
```

For visual changes, check the result in a browser in both light and dark themes.

## Pull requests

- Link the approved issue (`Closes #123`).
- Keep the change focused. One concern per PR.
- Add or update tests for behavior changes.
- Include before and after screenshots for UI changes.
- Write commit messages that say what changed and why.
- Don't include secrets, API keys or personal file paths.

## Reporting security issues

Don't open a public issue. See [SECURITY.md](SECURITY.md).
