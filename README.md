# sixblocks-dev-kit

A small, opinionated `.claude/` kit: one agent, three skills, one command, and
six hooks. MIT licensed. Drop it into any project.

These are not demo files. They are the actual tooling that shipped
[The Six Blocks](https://sixblocks.vercel.app) — **197 lessons, 412 static
pages, 78 commits, in 22 days** (2026-08-15 to 2026-09-06) — generalized so
they work in your project instead of only in that one.

This is deliberately small. If you want a large catalog, go to
[wshobson/agents](https://github.com/wshobson/agents) or
[anthropics/skills](https://github.com/anthropics/skills) — both excellent and
far bigger than this. What this kit offers instead is a short list of files
that were used hard on a real project, with the reasoning left in the
comments.

## ⚠️ Read before you install

Everything in `.claude/hooks/` runs **automatically** on matching tool calls —
no per-run confirmation. Read a hook's source before adding it to a project
you care about. That applies to this repo exactly as much as to any other.

## Install

```
cp -r .claude /path/to/your-project/
cd /path/to/your-project/.claude
cp settings.json.example settings.json
```

Then open `settings.json` and delete any hook you do not want. Claude Code
picks the rest up automatically — no build step.

## What's in it

### Agent

| File | Does |
|---|---|
| `agents/site-reviewer.md` | Reviews web app code for correctness, accessibility, type safety, performance, and design-system violations. Edit the verify-command list and the design-token rules to match your project. |

### Skills

| File | Does |
|---|---|
| `skills/beginner-voice/SKILL.md` | Writing guidance for prose a non-expert reads — docs, UI copy, error messages. Second person, one idea per sentence, define terms at first use. |
| `skills/cc-fact-check/SKILL.md` | Verification process for any Claude Code command, flag, or behaviour claim before it ships in your docs. "Memory is not a source." |
| `skills/screenshot-capture/SKILL.md` | Standards for consistent terminal and browser screenshots, so a hundred images look like one person took them. |

### Command

| File | Does |
|---|---|
| `commands/ship-phase.md` | A verify-then-commit gate: run the checks, only commit if everything is green, never describe a failing check as "mostly working." Edit the check list for your project. |

### Hooks

| File | Event | Does | Prerequisite |
|---|---|---|---|
| `hooks/_input.mjs` | (shared helper) | Every hook below imports this. **Required.** | — |
| `hooks/block-dangerous.mjs` | PreToolUse (Bash) | Blocks a narrow set of irreversible commands. A safety net against accidents, not a security boundary. | none |
| `hooks/no-secrets.mjs` | PreToolUse (Edit\|Write) | Refuses to write a real-looking API key, token, or private key to disk. Placeholders pass. | none |
| `hooks/format-on-edit.mjs` | PostToolUse (Edit\|Write) | Runs Prettier on any file just written. | **Prettier installed locally** — otherwise it silently no-ops (fails open by design). |
| `hooks/typecheck-on-edit.mjs` | PostToolUse (Edit\|Write, `.ts`/`.tsx`) | Runs project-wide `tsc --noEmit` after a TypeScript edit and reports errors immediately. | **TypeScript installed locally** + a working `tsconfig.json` — same silent no-op otherwise. |
| `hooks/notify-done.mjs` | Stop | Terminal bell and one line when a long run finishes. Set `LABEL` to your project name. | none |

## block-dangerous: what it actually blocks

Run `node test-block-dangerous.mjs` to check this table yourself against the
real patterns. Current result — 16/16:

```
ALLOW  rm -f /tmp/scratch.txt              ALLOW  git checkout -- .gitignore
ALLOW  rm -rf /var/log/app                 ALLOW  git checkout -- src/app.ts
ALLOW  rm -rf node_modules                 BLOCK  git checkout -- .
BLOCK  rm -rf /                            BLOCK  git push --force
BLOCK  rm -rf ~                            ALLOW  git push --force-with-lease
BLOCK  rm -rf *                            BLOCK  git reset --hard
BLOCK  rm -rf .                            BLOCK  git clean -fd
ALLOW  npm run build                       BLOCK  git branch -D main
```

The two "was a false positive" rows are why the table exists: an earlier
version anchored its patterns loosely and blocked `rm -f /tmp/anything`
(any absolute path) and `git checkout -- .gitignore` (any dotfile). A safety
net that fires on ordinary commands gets switched off, and then it protects
nothing.

## Known limitations

**`block-dangerous.mjs` matches its patterns anywhere in the command text,
including inside quoted strings.** A command that merely *mentions* a
dangerous pattern — a test fixture, an echo, a grep — gets blocked. This
happened three times while writing this repo. Fixing it properly needs real
shell parsing; a half-parser would be worse than the honest limitation, so it
is documented rather than papered over. It is consistent with what the hook
says about itself: a safety net for accidents, not a security boundary.

**The `format-on-edit` and `typecheck-on-edit` hooks fail open.** If the tool
is not installed they do nothing, quietly. That is intentional — a hook that
breaks the session because a dependency is missing is worse than one that
skips — but it means "installed and working" is not something you can assume.
Check it once.

## What is deliberately not here

The course this came from also has agents that draft lessons, audit curriculum
coverage, simulate a beginner reading a draft, and lint MDX structure. They are
not here because they are **useless outside that repo** — they encode one
project's content template and folder layout — not because they are secret.
Shipping them would make this kit bigger and worse.

The same logic is why this repo is 11 files instead of 200.

## License

MIT — see `LICENSE`. Copy it, change it, ship it in your own project. No
attribution required.

---

Built while making [The Six Blocks](https://sixblocks.vercel.app), a free
course that takes someone who has never opened a terminal to a deployed,
paid product. The [full inventory](https://sixblocks.vercel.app/resources) of
every agent, skill, hook, and command used to build that site — including the
ones held back above — is public there.
