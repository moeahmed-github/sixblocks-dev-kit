/**
 * Assertion table for block-dangerous.mjs.
 *
 * Literals are assembled from character codes so that running this file does
 * not itself trip a block-dangerous hook watching the command line — which is
 * the hook's documented third limitation, demonstrated.
 */
import { readFileSync } from "node:fs";

// Defaults to this repo's copy; set HOOK_PATH to check another copy.
const src = readFileSync(
  process.env.HOOK_PATH ??
    new URL("./.claude/hooks/block-dangerous.mjs", import.meta.url),
  "utf8",
);
// Pull RULES out without executing the hook (it reads stdin and calls exit).
const body = src.slice(src.indexOf("const RULES"), src.indexOf("const input"));
const RULES = eval(`${body}; RULES`);

const S = String.fromCharCode(47); // /
const D = String.fromCharCode(46); // .
const A = String.fromCharCode(42); // *
const co = `git check${"out"} -- `;
const rm = `r${"m"} -rf `;
const rmf = `r${"m"} -f `;

const cases = [
  [`${rmf}${S}tmp${S}scratch.txt`, "ALLOW", "named absolute file (was a false positive)"],
  [`${rm}${S}var${S}log${S}app`, "ALLOW", "named deep path"],
  [`${rm}node_modules`, "ALLOW", "named directory"],
  [`${rm}${S}`, "BLOCK", "root"],
  [`${rm}~`, "BLOCK", "home"],
  [`${rm}${A}`, "BLOCK", "bare wildcard"],
  [`${rm}${D}`, "BLOCK", "bare dot"],
  [`${co}${D}gitignore`, "ALLOW", "dotfile (was a false positive)"],
  [`${co}src${S}app.ts`, "ALLOW", "named file"],
  [`${co}${D}`, "BLOCK", "bare dot"],
  ["git push --force origin main", "BLOCK", "force push"],
  ["git push --force-with-lease origin main", "ALLOW", "force-with-lease is the safe form"],
  ["git reset --hard", "BLOCK", "hard reset"],
  ["git clean -fd", "BLOCK", "clean"],
  ["git branch -D main", "BLOCK", "delete main branch"],
  ["npm run build", "ALLOW", "ordinary command"],
];

let failed = 0;
for (const [cmd, want, note] of cases) {
  const got = RULES.some((rule) => rule.pattern.test(cmd)) ? "BLOCK" : "ALLOW";
  const ok = got === want;
  if (!ok) failed += 1;
  console.log(ok ? "  ok " : " FAIL", got.padEnd(6), "|", cmd.padEnd(34), "|", note);
}

console.log(
  failed === 0
    ? `\nALL ${cases.length} CASES PASS`
    : `\n${failed} of ${cases.length} FAILED`,
);
process.exit(failed ? 1 : 0);
