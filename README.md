# sixblocks-dev-kit

The real `.claude/` pieces used to build [The Six Blocks](https://thesixblocks.com),
extracted and MIT-licensed so you can drop them into your own project.

**Not the same thing as `claude-code-starter-kit`** — that's a *teaching
exercise* from Module 5.6 of the course (a small kit you build yourself:
`researcher`, `code-reviewer`, `test-runner` agents, one hook, three
commands). This repo is different: it's the actual dev tooling that shipped
the course site itself, minus everything specific to authoring lesson
content (that half stays in the private course repo and is only described,
not packaged, on [thesixblocks.com/resources](https://thesixblocks.com/resources)).

## ⚠️ Read before you install

Everything in `.claude/hooks/` runs **automatically** on matching tool calls
— no per-run confirmation. Read a hook's source before adding it to a project
you care about. Same goes for any agent or hook you get from any repo,
including this one and the ones this README links to below.

## Install

Copy the `.claude/` folder into your project root. Claude Code picks it up
automatically — no build step, no config change.

```
cp -r .claude /path/to/your-project/
```

## What's in it

### Agent

| File | Does |
|---|---|
| `agents/site-reviewer.md` | Reviews web app code for correctness, accessibility, type safety, performance, and design-token violations. Adapt the design-token section to your own design system, or delete it if you don't have one. |

### Skills

| File | Does |
|---|---|
| `skills/beginner-voice/SKILL.md` | Writing guidance for any prose a non-expert reader sees — UI copy, docs, error messages. Second person, one idea per sentence, define terms at first use. |
| `skills/cc-fact-check/SKILL.md` | Verification process for any Claude Code command/flag/config claim before it ships in your own docs — "memory is not a source." |
| `skills/screenshot-capture/SKILL.md` | Standards for consistent terminal/browser screenshots in documentation (fixed colors, fonts, crop, no personal data in frame). |

### Command

| File | Does |
|---|---|
| `commands/ship-phase.md` | A verify-then-commit gate: run the full check suite, only commit if everything is green, never describe a failing check as "mostly working." **Edit the command list inside it** — it currently references this course's own `npm run typecheck/lint/test/build` and `_BUILD/01_EXECUTION_GUIDE.md`; swap in your project's real verify commands. |

### Hooks

| File | Event | Does | Prerequisite |
|---|---|---|---|
| `hooks/_input.mjs` | (shared helper) | Every hook below imports this. **Required** — the others break on import without it. | — |
| `hooks/block-dangerous.mjs` | PreToolUse (Bash) | Blocks a narrow set of irreversible commands (`rm -rf /`, force push, `git reset --hard`, fork bombs, etc). A safety net against accidents, not a security boundary. | none |
| `hooks/no-secrets.mjs` | PreToolUse (Edit\|Write) | Refuses to write a real-looking API key/token/private-key block to disk. Placeholders are allowed. | none |
| `hooks/format-on-edit.mjs` | PostToolUse (Edit\|Write) | Runs Prettier on any file just written. | **Prettier must be installed locally** (`node_modules/prettier`) — if it isn't, the hook silently no-ops (fails open by design; it just won't format anything). |
| `hooks/typecheck-on-edit.mjs` | PostToolUse (Edit\|Write, `.ts`/`.tsx`) | Runs a project-wide `tsc --noEmit` after any TypeScript edit and reports errors immediately. | **TypeScript must be installed locally** (`node_modules/typescript`) and a working `tsconfig.json` must exist — same silent-no-op behavior otherwise. |
| `hooks/notify-done.mjs` | Stop | Terminal bell + one line when a long run finishes. | none |

None of these are wired up automatically — you still need a `.claude/settings.json`
in your project that maps each hook to its event, e.g.:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "node .claude/hooks/block-dangerous.mjs" }] },
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "node .claude/hooks/no-secrets.mjs" }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "node .claude/hooks/format-on-edit.mjs" }] },
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "node .claude/hooks/typecheck-on-edit.mjs" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "node .claude/hooks/notify-done.mjs" }] }
    ]
  }
}
```

## What's deliberately not here

The course-authoring half of the original `.claude/` — `lesson-writer`,
`curriculum-auditor`, `content-reviewer`, `beginner-simulator`, `cc-verifier`
agents; `course-consistency`, `lesson-author`, `mdx-lesson-scaffold`,
`roadmap-sync` skills; `capture`, `level-audit`, `new-lesson`, `qa-lesson`
commands; `lesson-lint.mjs` hook. All of it is specific to writing MDX
lessons for a course and would confuse a student bootstrapping their own
project, so it's documented (not packaged) on
[thesixblocks.com/resources](https://thesixblocks.com/resources) instead.

## More agents & skills

This is a small, honest slice of what exists. For a much bigger catalog:

- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic's official public Agent Skills repo
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) — Anthropic-managed directory of vetted Claude Code plugins
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) — community-curated list of commands, hooks, and workflows
- [wshobson/agents](https://github.com/wshobson/agents) — large, actively maintained subagent/plugin/skill collection
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — official MCP reference servers

Same warning applies to all of them: read before you run.

## License

MIT — see `LICENSE`. Copy, modify, ship it in your own project.
