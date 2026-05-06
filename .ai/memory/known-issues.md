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

---

- **Issue**: `GeneratePayrollDrawer` referenced undefined `isCreating` — mutation loading state not destructured from `useCreatePayroll()`.
- **Impact**: Runtime `ReferenceError` when opening the Generate Payroll drawer.
- **Workaround**: N/A — bug prevented drawer from rendering.
- **Mitigation Plan**: Fixed by destructuring `isPending` as `isCreating` from `useCreatePayroll()` (TanStack Query v5 `UseMutationResult`). All other mutation hooks in the payroll module already follow this pattern.
- **Date**: 2026-05-03

---

- **Issue**: 6 integration tests failing in `auth.integration.test.tsx` and `onboarding.integration.test.tsx` — tests expected toast notifications and API call patterns that no longer match the refactored source code.
- **Impact**: CI pipeline blocked — `pnpm turbo run test` fails in `user-dashboard`.
- **Workaround**: N/A — tests blocked CI.
- **Mitigation Plan**: Tests updated to match current code behavior:
  - Auth I-01/I-05: removed toast.success expectations (code navigates without toast now)
  - Auth I-02/I-06: replaced toast assertions with spy-call + no-redirect checks (code uses inline form errors now)
  - Auth I-07: updated expected toast message to "A new OTP has been sent to your email."
  - Onboarding I-02: added industry/size field fills (schema now requires them, form was staying invalid)
- **Date**: 2026-05-06

---

- **Issue**: `MainButton` variant `"accent"` not assignable to shadcn `Button` variant type — the `Variant` type union in `MainButton` declared `'accent'` but the underlying `buttonVariants` cva had no `accent` key (only `accentOutline`). Caused 3 TS2322 errors blocking push.
- **Impact**: Blocked `pre-push` hook, preventing `git push`.
- **Workaround**: N/A — type error blocked build/push.
- **Mitigation Plan**: Removed `'accent'` from `MainButton`'s `Variant` type union. The single usage in `navbar/index.tsx` (`variant="accent"`) was changed to `variant="ghost"` (already used nearby for "Contact Me"). `'accentOutline'` remains available.
- **Date**: 2026-05-03

---

- **Issue**: `GeneratePayrollDrawer` referenced undefined `isCreating` — mutation loading state not destructured from `useCreatePayroll()`.
- **Impact**: Runtime `ReferenceError` when opening the Generate Payroll drawer.
- **Workaround**: N/A — bug prevented drawer from rendering.
- **Mitigation Plan**: Fixed by destructuring `isPending` as `isCreating` from `useCreatePayroll()` (TanStack Query v5 `UseMutationResult`). All other mutation hooks in the payroll module already follow this pattern.
- **Date**: 2026-05-03
