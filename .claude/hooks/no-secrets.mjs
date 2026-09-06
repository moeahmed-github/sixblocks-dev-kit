/**
 * no-secrets — PreToolUse (Edit | Write)
 *
 * Refuses to write a live credential into the repo.
 *
 * Placeholders are allowed. The point is to catch a real key pasted in by
 * accident, not to ban the word "key".
 */

import { readHookInput, deny, allow } from "./_input.mjs";

const PATTERNS = [
  { name: "Anthropic API key", pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}/ },
  { name: "OpenAI API key", pattern: /\bsk-(proj-)?[A-Za-z0-9]{32,}/ },
  { name: "AWS access key ID", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "GitHub token", pattern: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b/ },
  { name: "GitHub fine-grained token", pattern: /\bgithub_pat_[A-Za-z0-9_]{50,}/ },
  { name: "Stripe live secret key", pattern: /\bsk_live_[A-Za-z0-9]{20,}/ },
  { name: "Stripe live publishable key", pattern: /\bpk_live_[A-Za-z0-9]{20,}/ },
  { name: "Slack token", pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: "Google API key", pattern: /\bAIza[A-Za-z0-9_-]{35}\b/ },
  { name: "Supabase service role JWT", pattern: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/ },
  { name: "private key block", pattern: /-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
];

/** Obvious placeholders — these are what docs and examples should contain. */
const PLACEHOLDER =
  /(your[_-]?key|xxx+|\.\.\.|<[^>]+>|example|placeholder|redacted|sk-ant-api03-REPLACE)/i;

const input = await readHookInput();
const parameters = input?.tool_input ?? {};

// Whatever the tool is about to put on disk.
const written = [
  parameters.content,
  parameters.new_string,
  ...(Array.isArray(parameters.edits)
    ? parameters.edits.map((edit) => edit?.new_string)
    : []),
]
  .filter((value) => typeof value === "string")
  .join("\n");

if (written.length === 0) allow();

for (const { name, pattern } of PATTERNS) {
  const match = written.match(pattern);
  if (!match) continue;

  // A masked example in documentation is fine and expected.
  const context = written.slice(
    Math.max(0, (match.index ?? 0) - 40),
    (match.index ?? 0) + match[0].length + 40,
  );
  if (PLACEHOLDER.test(context)) continue;

  deny(
    "PreToolUse",
    `Blocked by the no-secrets hook: this write contains what looks like a real ${name}.\n\nPut it in .env.local (which is gitignored) and read it from the environment. If it is a fake value for an example, make it obviously fake — "sk-ant-api03-REPLACE-ME" rather than a realistic string.`,
  );
}

// Never write a real .env file into the repo.
const file = parameters.file_path;
if (typeof file === "string" && /(^|[\\/])\.env(\.|$)/.test(file)) {
  if (!/\.env\.(example|sample|template)$/.test(file)) {
    deny(
      "PreToolUse",
      `Blocked by the no-secrets hook: writing ${file}. Environment files holding real values do not belong in the repo. Write .env.example with empty values instead, and tell the user to fill in .env.local themselves.`,
    );
  }
}

allow();
