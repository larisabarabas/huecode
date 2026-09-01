# Backlog

## Dev server: port 8787 still gets EADDRINUSE after stopping the project

**Status:** open, deferred
**Added:** 2026-09-01

Even after adding a `predev` script (`lsof -ti tcp:8787 | xargs kill -9 2>/dev/null || true`) to auto-clear the port before `npm run dev` starts, `[api] Error: listen EADDRINUSE: address already in use :::8787` still occurs.

**What we found before pausing:** the process actually bound to :8787 traces back through a full `npm run dev` process tree (`npm run dev` → `concurrently` → `npm run dev:server` → `tsx watch` → forked node child) whose top-level `npm run dev` process has **PPID 1** — i.e. it's orphaned from its original terminal (most likely the terminal/tab was closed rather than stopped with Ctrl+C), so it kept running and holding the port in the background, invisible in any open terminal.

Open questions for next look:
- Why didn't `predev`'s `lsof | xargs kill` catch this orphaned process on the next `npm run dev`? (Candidates: predev only runs before the `dev` script specifically — if the server was ever started via `npm run dev:server` directly, or a non-npm launcher, predev is skipped; or a timing/race issue between predev's kill and the new listen attempt.)
- Whether `tsx watch`'s own restart-on-file-change cycle can independently cause a transient EADDRINUSE (old forked child not fully released before the new one binds), separate from the orphaned-process issue.

**Possible fixes to evaluate:**
- Add signal handling / process-group cleanup so `npm run dev` reliably kills its whole tree on exit, not just the top process.
- Confirm predev's `lsof`/`xargs kill` is actually being invoked and working as expected (test directly).
- Consider replacing `tsx watch` with a non-watch `tsx server/index.ts` for the server process, trading auto-restart for a shallower, easier-to-kill process tree.
