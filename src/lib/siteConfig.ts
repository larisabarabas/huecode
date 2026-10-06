/**
 * Deployment-level branding, read at build time from VITE_* env vars so forks and
 * self-hosters aren't tied to the original maintainer's links. See .env.example.
 */
const env = import.meta.env;

/** Where the header logo links. Defaults to the app itself. */
export const HOME_URL: string = env.VITE_HOME_URL?.trim() || "/";

/** Footer credit ("Built by <name>"). Hidden unless a name is set. */
export const CREDIT_NAME: string = env.VITE_CREDIT_NAME?.trim() || "";
export const CREDIT_URL: string = env.VITE_CREDIT_URL?.trim() || "";
