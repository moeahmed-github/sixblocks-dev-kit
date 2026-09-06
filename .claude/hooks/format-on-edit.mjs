/**
 * format-on-edit — PostToolUse (Edit | Write)
 *
 * Runs Prettier on the file that was just written. Formatting is not a
 * judgement call, so it should never cost anyone a review comment.
 *
 * Fails open on formatting problems — a malformed file must not stop the
 * session — but reports loudly if Prettier itself could not be run, because a
 * hook that quietly does nothing is worse than no hook at all.
 */

import {
  readHookInput,
  projectDir,
  touchedFile,
  relativePath,
  isIgnored,
  runNodeBin,
  allow,
} from "./_input.mjs";

/**
 * Code only. Markdown and MDX are deliberately absent: Prettier's MDX printer
 * edits CONTENT, not just layout — it mangles multi-line JSX comments into
 * `{/_ _/}` (which no longer compiles) and collapses runs of spaces inside
 * code/output blocks, where the spacing is the real captured output. Add MDX
 * back only if you have checked what it does to your own content.
 */
const FORMATTABLE = /\.(tsx?|jsx?|mjs|cjs|css|json)$/;

const input = await readHookInput();
const file = touchedFile(input);
if (!file || !FORMATTABLE.test(file)) allow();

const root = projectDir(input);
const relative = relativePath(file, root);
if (isIgnored(relative) || relative.startsWith("..")) allow();

const result = runNodeBin(root, "node_modules/prettier/bin/prettier.cjs", [
  "--write",
  "--ignore-unknown",
  relative,
]);

if (!result.ok) {
  process.stderr.write(
    `format-on-edit could not run Prettier: ${result.output}\n`,
  );
} else if (result.status !== 0) {
  process.stderr.write(`prettier: ${result.output.trim()}\n`);
}

// Silent on success. Prettier prints the filename on every run, and that is
// noise in the transcript.
allow();
