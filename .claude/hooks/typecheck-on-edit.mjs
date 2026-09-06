/**
 * typecheck-on-edit — PostToolUse (Edit | Write) on .ts / .tsx
 *
 * Surfaces type errors at the moment they are introduced, rather than at the
 * end of the phase when working out which edit caused them is expensive.
 *
 * The whole project is checked, not the single file: tsc has no single-file
 * mode that respects the project's config and path aliases.
 */

import {
  readHookInput,
  projectDir,
  touchedFile,
  relativePath,
  isIgnored,
  runNodeBin,
  feedback,
  allow,
} from "./_input.mjs";

const input = await readHookInput();
const file = touchedFile(input);
if (!file || !/\.tsx?$/.test(file)) allow();

const root = projectDir(input);
const relative = relativePath(file, root);
if (isIgnored(relative) || relative.startsWith("..")) allow();

const result = runNodeBin(root, "node_modules/typescript/bin/tsc", [
  "--noEmit",
  "--pretty",
  "false",
]);

if (!result.ok) {
  process.stderr.write(`typecheck-on-edit could not run tsc: ${result.output}\n`);
  allow();
}

if (result.status === 0) allow();

const errors = result.output
  .split("\n")
  .filter((line) => line.includes("error TS"))
  .slice(0, 20);

if (errors.length === 0) allow();

feedback(
  `TypeScript errors after editing ${relative}. Fix these before continuing:\n\n${errors.join("\n")}`,
);
