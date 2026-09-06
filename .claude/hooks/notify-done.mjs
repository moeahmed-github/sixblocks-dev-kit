/**
 * notify-done — Stop
 *
 * Authoring a module is a long run. This rings the terminal bell and prints
 * one short line, so a run that finished twenty minutes ago gets noticed.
 *
 * Deliberately quiet: one line, no summary. A Stop hook that writes a lot
 * gets in the way of reading the actual output.
 */

import { readHookInput, allow } from "./_input.mjs";

await readHookInput();

const time = new Date().toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});

// \u0007 (BEL) rings the terminal bell — the part that actually gets attention when
// the terminal is behind another window.
process.stderr.write(`\u0007[six blocks] run finished at ${time}\n`);

allow();
