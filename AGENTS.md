<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Graphify: local only

Graphify is a local-machine tool only. Never add, commit, or push any graphify-related code, config, or generated files to this GitHub repository. The repo must contain only project files. Keep all graphify artifacts untracked/local.

# Graphify: update on every commit

Keep the local knowledge graph (`graphify-out/`) in sync with the repo. Treat a commit as
incomplete until the graph reflects it:

- A post-commit hook auto-rebuilds the graph from code changes after every `git commit`
  (detached, no LLM). Check with `graphify hook status`; install with `graphify hook install`.
- The hook ignores doc/image changes. After committing docs (e.g. `README.md`, `AGENTS.md`),
  run `graphify . --update` once so those changes are extracted too.
- Never commit graphify artifacts — install the hook locally, not in tracked files.
