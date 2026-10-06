/**
 * Deployment-level branding, read at build time from VITE_* env vars so forks and
 * self-hosters aren't tied to the original maintainer's links. See .env.example.
 */
const env = import.meta.env;

/** Where the header logo links. Defaults to the app itself. */
export const HOME_URL: string = env.VITE_HOME_URL?.trim() || "/";

/**
 * Footer "Open source on GitHub" link. Defaults to the upstream project; point it at
 * your fork, or set VITE_REPO_URL to an empty string to hide the footer.
 */
export const REPO_URL: string = (env.VITE_REPO_URL ?? "https://github.com/larisabarabas/huecode").trim();
