---
description: Run the full verification loop, then commit the phase
argument-hint: <phase>   e.g. 0
---

Close out phase **$1**.

**Verify first. Show the output of every command — never assert that a check
passed.**

1. `npm run typecheck`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. `node scripts/audit-palette.mjs`
6. `npm run sync` — report any drift
7. Dispatch `site-reviewer` over the diff

Then check the phase's done-criteria in `_BUILD/01_EXECUTION_GUIDE.md` and
report each box with the evidence that satisfies it.

If everything passes, commit with a message naming the phase and what shipped.
If anything fails, **stop and report** — do not commit a red phase, and do not
describe a failing check as "mostly working".

Finally, state what the next phase is and remind me to clear context before
starting it.
