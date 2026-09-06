---
description: Run the full verification loop, then commit
argument-hint: <what you are closing out>   e.g. auth refactor
---

Close out **$1**.

**Verify first. Show the output of every command — never assert that a check
passed.**

Run this project's checks, in order. **Edit this list to match your project** —
these are the defaults, not the law:

1. `npm run typecheck`
2. `npm run lint`
3. `npm test`
4. `npm run build`

Then dispatch the `site-reviewer` agent over the diff, if the project has one.

Then check the done-criteria for the work being closed — wherever your project
records them (an issue, a plan file, a checklist) — and report each one with
the evidence that satisfies it.

If everything passes, commit with a message naming what shipped.
If anything fails, **stop and report** — do not commit a red build, and do not
describe a failing check as "mostly working".

Finally, state what the next piece of work is.
