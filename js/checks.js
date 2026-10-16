/* js/checks.js - the hidden task checks for "Medium in 60".
 *
 * Every practice exercise is a starter (the function to write) plus a list
 * of tasks. Each task has a human line for the page and one Python
 * statement that must succeed for the task to count. This module composes
 * the two into one program: the user's code, then a small harness that
 * runs every task in order, catches each failure, and leaves the verdict
 * in __lp60_results__ (None per passed task, the exception class name per
 * failed one). The page reads that list back after a run.
 *
 * Pure string work, no DOM: the browser runtime and qa.mjs share it, so
 * the checks that pass in QA are the checks that run in the page.
 */

/* The statement the page (and qa.mjs) runs to read the verdict back.
 * None becomes null in JSON; a failed task carries its exception name. */
export const RESULT_PROBE = "__import__('json').dumps(__lp60_results__)";

/* The harness appended to the user's code. Kept deliberately plain so a
 * reader of main.py could follow it, and so a user's own names cannot
 * collide with the few it introduces (all dunder-prefixed). */
export function buildChecks(tasks) {
  const list = (tasks || [])
    .map((t) => "    " + JSON.stringify(String(t.test || "").trim()) + ",")
    .join("\n");
  return [
    "# ---- checks (added by the page; each line must pass) ----",
    "__lp60_results__ = []",
    "for __lp60_test__ in [",
    list,
    "]:",
    "    try:",
    "        exec(__lp60_test__, globals())",
    "        __lp60_results__.append(None)",
    "    except Exception as __lp60_exc__:",
    "        __lp60_results__.append(type(__lp60_exc__).__name__)",
    ""
  ].join("\n");
}

/* The program the sandbox actually runs. */
export function composeProgram(code, tasks) {
  return String(code).replace(/\s+$/, "") + "\n\n\n" + buildChecks(tasks);
}

/* A local (Node/CPython) program that prints the verdict as JSON, for
 * qa.mjs: nothing about it depends on the browser. */
export function composeProbeScript(code, tasks) {
  return composeProgram(code, tasks) + "\nprint(" + RESULT_PROBE + ")\n";
}
