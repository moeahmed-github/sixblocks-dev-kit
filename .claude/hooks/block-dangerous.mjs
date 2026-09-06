/**
 * block-dangerous — PreToolUse (Bash)
 *
 * Refuses a small set of commands that destroy work irreversibly. This is a
 * safety net, not a security boundary: it stops an accident, not an attacker.
 *
 * Every rule here is narrow on purpose. A hook that blocks too much gets
 * disabled, and then it protects nothing.
 */

import { readHookInput, deny, allow } from "./_input.mjs";

const RULES = [
  {
    // rm -rf against a root, a home directory, or a bare wildcard.
    pattern: /\brm\s+(-[a-z]*[rf][a-z]*\s+)+(\/|~|\/\*|\.\s*$|\*\s*$)/i,
    reason:
      "`rm -rf` targeting a root, home directory, or bare wildcard. Name the exact directory instead.",
  },
  {
    pattern: /\bgit\s+push\b[^\n]*(--force(?!-with-lease)|(\s|^)-f(\s|$))/i,
    reason:
      "Force push. Use `--force-with-lease`, which refuses when someone else has pushed since you last fetched.",
  },
  {
    pattern: /\bgit\s+reset\s+--hard\b/i,
    reason:
      "`git reset --hard` discards uncommitted work with no recovery. Use `git stash` first, or commit to a scratch branch.",
  },
  {
    pattern: /\bgit\s+clean\s+-[a-z]*[fd][a-z]*/i,
    reason:
      "`git clean -fd` deletes untracked files permanently. Run it with `-n` first and read the list.",
  },
  {
    pattern: /\bgit\s+checkout\s+--\s+\./i,
    reason:
      "`git checkout -- .` discards every uncommitted change in the tree. Name the specific file.",
  },
  {
    pattern: /\bgit\s+branch\s+-D\s+(main|master)\b/i,
    reason: "Deleting the main branch.",
  },
  {
    pattern: /\bRemove-Item\b[^\n]*-Recurse[^\n]*-Force[^\n]*(\\|\/|~|\*)\s*$/i,
    reason:
      "Recursive forced delete against a root or wildcard path. Name the exact directory.",
  },
  {
    pattern: /\b(drop\s+database|truncate\s+table)\b/i,
    reason: "Destructive database statement.",
  },
  {
    pattern: /:\(\)\s*\{\s*:\|:&\s*\}\s*;\s*:/,
    reason: "Fork bomb.",
  },
];

const input = await readHookInput();
const command = input?.tool_input?.command;
if (typeof command !== "string" || command.length === 0) allow();

for (const rule of RULES) {
  if (rule.pattern.test(command)) {
    deny(
      "PreToolUse",
      `Blocked by the block-dangerous hook.\n\n${rule.reason}\n\nCommand: ${command}\n\nIf this is genuinely what you want, tell the user what will be lost and let them run it themselves.`,
    );
  }
}

allow();
