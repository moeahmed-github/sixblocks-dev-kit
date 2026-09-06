/**
 * Shared helpers for the hook scripts in this directory.
 *
 * Every hook receives a JSON object on stdin. The fields used here:
 *   hook_event_name  string
 *   tool_name        string          e.g. "Edit", "Write", "Bash"
 *   tool_input       object          the tool's parameters
 *   tool_input.file_path  string     for Edit / Write
 *   tool_input.command    string     for Bash
 *   cwd              string
 */

import path from "node:path";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

/** Read and parse the JSON payload on stdin. Never throws. */
export async function readHookInput() {
  try {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    // A hook that crashes on malformed input would block the session for a
    // reason that has nothing to do with the user's work. Fail open.
    return {};
  }
}

/** Project root. CLAUDE_PROJECT_DIR is set by Claude Code. */
export function projectDir(input = {}) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
}

/** Absolute path of the file a tool just touched, or null. */
export function touchedFile(input = {}) {
  const file = input?.tool_input?.file_path;
  return typeof file === "string" && file.length > 0 ? file : null;
}

/** Path relative to the project root, with forward slashes. */
export function relativePath(file, root) {
  return path.relative(root, file).split(path.sep).join("/");
}

/** True if the path is inside a directory we never process. */
export function isIgnored(relative) {
  return /^(node_modules|\.next|\.git|dist|build|coverage)\//.test(relative);
}

/**
 * Deny a PreToolUse call. Exit code 2 blocks it and feeds stderr back to
 * Claude; the JSON on stdout carries the structured decision.
 */
export function deny(event, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: event,
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  process.stderr.write(`${reason}\n`);
  process.exit(2);
}

/**
 * Run a locally installed CLI by invoking its JavaScript entry point with the
 * current Node binary.
 *
 * Not `npx`: on Windows npx resolves to npx.cmd, and since Node 20.12 spawning
 * a .cmd without `shell: true` fails outright — silently, if the caller only
 * inspects the exit status. Going straight to the .js entry point sidesteps
 * both the shell and the platform difference.
 *
 * Returns { ok, status, output }. `ok` is false if the tool could not be run
 * at all, which callers should treat differently from the tool reporting
 * problems with the code.
 */
export function runNodeBin(root, binRelativePath, args) {
  const bin = path.join(root, binRelativePath);
  if (!existsSync(bin)) {
    return { ok: false, status: null, output: `not installed: ${binRelativePath}` };
  }

  const result = spawnSync(process.execPath, [bin, ...args], {
    cwd: root,
    encoding: "utf8",
  });

  if (result.error) {
    return { ok: false, status: null, output: result.error.message };
  }

  return {
    ok: true,
    status: result.status,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`,
  };
}

/**
 * Send feedback from a PostToolUse hook.
 *
 * PostToolUse cannot block — the tool already ran — so it uses the top-level
 * `decision` / `reason` pair with a clean exit, not exit code 2. Verified
 * against the hooks reference rather than assumed.
 */
export function feedback(reason) {
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
  process.exit(0);
}

/** Allow: say nothing, exit clean. Silence is the common case. */
export function allow() {
  process.exit(0);
}
