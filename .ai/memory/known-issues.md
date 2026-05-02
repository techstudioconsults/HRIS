# Known Issues & Technical Debt

Format:

- **Issue**: Brief description
- **Impact**:
- **Workaround**:
- **Mitigation Plan**:
- **Date**: YYYY-MM-DD

---

- **Issue**: Kilo v7.2.25 does not auto-discover agent markdown files from `.kilo/agent/` or `.kilo/agents/` project directories — agents defined only as `.md` files in those directories are silently ignored by `kilo agent list` and the `/agents` slash command.
- **Impact**: Custom agents from the blackbox persona were not selectable in Kilo sessions; only built-in agents appeared.
- **Workaround**: Define agents explicitly in the `agent` key of `kilo.json` using `{file:.kilo/agent/<name>.md}` prompt references. This loads the agent MD content correctly while preserving the file-based separation of concerns.
- **Mitigation Plan**: Fixed in `kilo.json` — all 6 blackbox agents (architect, planner, backend-implementer, frontend-implementer, reviewer, optimizer) are now registered via the `agent` config key.
- **Date**: 2026-04-29
