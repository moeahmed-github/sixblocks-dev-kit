---
name: cc-fact-check
description: Use when course content mentions a Claude Code command, slash command, CLI flag, keyboard shortcut, config file path, settings key, hook event name, MCP behaviour, agent frontmatter field, or any product behaviour — and before any lesson containing a terminal command is marked ready.
---

# Claude Code Fact Check

Nothing about Claude Code reaches a student unverified. A beginner has no way
to tell a typo from their own mistake: one wrong flag and they conclude they
are too stupid for this, and they are gone.

**Memory is not a source.** Not yours, not the draft author's.

## Process

1. Extract every factual claim from the draft: command names, flags,
   shortcuts, file paths, event names, config keys, described behaviours.
2. Verify each one by **running it**, or by reading **official documentation**,
   or by asking the **claude-code-guide** agent. Those are the only three
   acceptable sources.
3. Record the Claude Code version verified against and stamp it in the level
   footer: "Verified against Claude Code vX.Y, <month year>."
4. Flag anything likely to change, and add a `<Callout type="note">` telling
   the student how to check current behaviour themselves (`/help`,
   `claude --version`, the docs link).

## Output

| Claim | Where it appears | Source of truth | Status | Correction |

Status is one of: **VERIFIED**, **WRONG**, **OUTDATED**, **UNVERIFIABLE**.

Anything not VERIFIED blocks publication. There is no "probably fine" state.

## Rationalizations

| Excuse | Reality |
|---|---|
| "I used this flag last week" | Versions ship weekly. Run it. |
| "It's in my training data" | Training data is a snapshot, and this product moves. Not a source. |
| "The docs probably say the same thing" | Then reading them costs you thirty seconds. |
| "It's a tiny cosmetic difference in the output" | Beginners panic at cosmetic differences. That is the whole point of this check. |
| "The feature obviously exists" | Inventing a plausible-sounding feature is the single most damaging thing this course can do. |
| "I'll verify the whole module at the end" | You will verify the ones you remember doubting. Verify each as you go. |

## Red flags — stop

- You are about to write VERIFIED without having run the command or opened a doc
- The draft describes what a feature "does" with no output shown
- A flag or path appears that you have not seen in this session
- The lesson works on your OS and no one checked the other one
