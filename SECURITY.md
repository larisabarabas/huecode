# Security Policy

## Supported versions

Only the latest release on `main` receives security fixes.

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub:

**Security tab → Report a vulnerability** on this repository
(`https://github.com/larisabarabas/huecode/security/advisories/new`).

Do not open a public issue or pull request for a security problem.

Include what you found, how to reproduce it, and the impact you expect.

## What to expect

- Acknowledgment within about 72 hours.
- A best-effort assessment and fix. This is a solo-maintained project, so I can't promise a fixed deadline, but I'll keep you updated.
- Credit in the fix, if you want it.

## Scope

In scope:
- The Huecode app and its API (`server/`, `api/`).
- Handling of the `ANTHROPIC_API_KEY`, which must stay server-side.
- The GitHub Actions workflows in this repository.

Out of scope:
- Vulnerabilities in third-party dependencies with no exploitable path in Huecode. Report those upstream.
- Issues that require the attacker to already control the user's machine or `.env` file.
- Rate-limit or cost concerns on a self-hosted instance you run with your own key.
