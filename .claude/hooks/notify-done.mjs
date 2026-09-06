/**
 * notify-done — Stop
 *
 * Long runs finish while you are looking at something else. This rings the
 * terminal bell and prints one short line, so a run that finished twenty
 * minutes ago gets noticed.
 *
 * Deliberately quiet: one line, no summary. A Stop hook that writes a lot
 * gets in the way of reading the actual output.
 *
 * PERSONALISE: change LABEL to your project's name.
 */

import { readHookInput, allow } from "./_input.mjs";

const LABEL = "claude";

await readHookInput();

const time = new Date().toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});

// \u0007 (BEL) rings the terminal bell — the part that actually gets attention when
// the terminal is behind another window.
process.stderr.write(`\u0007[${LABEL}] run finished at ${time}\n`);

allow();
