/* js/checks.js - the case judge for "Medium in 60".
 *
 * Every practice exercise is a starter (the function to write) plus a list
 * of tasks, and every task carries assert lines. Each assert is parsed into
 * one structured case: the call to make (lhs), the answer it must produce
 * (rhs) and how to compare them. The composed program runs the user's code,
 * then judges every case the way LeetCode judges a submission: the call
 * runs once inside a stdout tap, its value is compared against the expected
 * value, and the case reports pass, mismatch or exception with its own
 * runtime. The page reads the detail back and renders it as per-case
 * Input / Output / Expected; a per-task verdict list (one entry per task,
 * None when every case in it passed) is kept for the task rail and qa.mjs.
 *
 * Pure string work, no DOM: the browser runtime and qa.mjs share it, so
 * the cases that pass in QA are the cases that run in the page.
 */

/* The statements the page (and qa.mjs) run to read the verdicts back.
 * None becomes null in JSON; a failed task carries a short reason. */
export const RESULT_PROBE = "__import__('json').dumps(__lp60_results__)";
export const DETAIL_PROBE = "__import__('json').dumps(__lp60_detail__)";

/* One assert line becomes one case. Shapes (every check in the data files
 * is one of the first four):
 *   assert f(x) == expected        eq    judged by ==
 *   assert f(x) is True|False|None is    judged by identity
 *   assert f(x) in (a, b)          in    judged by membership
 *   assert <anything else>         raw   exec'd verbatim, pass/fail only
 * A custom case typed by the reader in the Testcase panel is "custom":
 * the call must eval, and if an expected value was given, must equal it. */
export function parseTest(src) {
  const s = String(src).trim();
  let m = s.match(/^assert\s+([\s\S]+?)\s+==\s+([\s\S]+)$/);
  if (m) return { kind: "eq", lhs: m[1], rhs: m[2], src: s };
  m = s.match(/^assert\s+([\s\S]+?)\s+is\s+(True|False|None)\s*$/);
  if (m) return { kind: "is", lhs: m[1], rhs: m[2], src: s };
  m = s.match(/^assert\s+([\s\S]+?)\s+in\s+([\s\S]+)$/);
  if (m) return { kind: "in", lhs: m[1], rhs: m[2], src: s };
  return { kind: "raw", lhs: s, rhs: "", src: s };
}

/* The item list for a run. mode "submit" judges every task's cases;
 * mode "run" judges just one task's cases, plus the reader's custom
 * case (input + optional expected) when one is given. */
export function buildItems(tasks, opts) {
  const o = opts || {};
  const items = [];
  const taskCases = (t) => (t.tests || (t.test ? [t.test] : [])).map(parseTest);
  if (o.mode === "run") {
    const t = tasks[o.taskIndex];
    if (t) {
      taskCases(t).forEach((c) => items.push({ task: o.taskIndex, kind: c.kind, lhs: c.lhs, rhs: c.rhs, src: c.src }));
    }
    const cu = o.custom;
    if (cu && cu.input && cu.input.trim()) {
      items.push({ task: -1, kind: "custom", lhs: cu.input.trim(), rhs: (cu.expected || "").trim(), src: "" });
    }
    return items;
  }
  tasks.forEach((t, i) => {
    taskCases(t).forEach((c) => items.push({ task: i, kind: c.kind, lhs: c.lhs, rhs: c.rhs, src: c.src }));
  });
  return items;
}

/* The judge appended to the user's code. Deliberately plain Python a
 * reader of main.py could follow; every name it introduces is
 * dunder-prefixed so it cannot collide with the user's own. */
export function buildHarness(items, taskCount) {
  return [
    "# ---- cases (added by the page; each case must pass) ----",
    "import io as __io, time as __time, contextlib as __ctx",
    "",
    "__lp60_detail__ = []",
    "__lp60_results__ = [None] * " + Number(taskCount),
    "",
    "",
    "def __lp60_case__(__item):",
    "    __d = {'task': __item['task'], 'kind': __item['kind'], 'input': __item['lhs'],",
    "           'expected': None, 'actual': None, 'oneof': False,",
    "           'ok': False, 'error': '', 'stdout': '', 'ms': 0.0}",
    "    __buf = __io.StringIO()",
    "    __t0 = __time.perf_counter()",
    "    try:",
    "        with __ctx.redirect_stdout(__buf), __ctx.redirect_stderr(__buf):",
    "            if __item['kind'] == 'raw':",
    "                exec(__item['src'], globals())",
    "                __d['ok'] = True",
    "            else:",
    "                __got = eval(__item['lhs'], globals())",
    "                __d['actual'] = repr(__got)",
    "                if __item['kind'] == 'eq':",
    "                    __want = eval(__item['rhs'], globals())",
    "                    __d['expected'] = repr(__want)",
    "                    __d['ok'] = __got == __want",
    "                elif __item['kind'] == 'is':",
    "                    __want = {'True': True, 'False': False, 'None': None}[__item['rhs']]",
    "                    __d['expected'] = __item['rhs']",
    "                    __d['ok'] = __got is __want",
    "                elif __item['kind'] == 'in':",
    "                    __want = eval(__item['rhs'], globals())",
    "                    __d['expected'] = repr(__want)",
    "                    __d['oneof'] = True",
    "                    __d['ok'] = __got in __want",
    "                else:",
    "                    if __item['rhs']:",
    "                        __want = eval(__item['rhs'], globals())",
    "                        __d['expected'] = repr(__want)",
    "                        __d['ok'] = __got == __want",
    "                    else:",
    "                        __d['ok'] = True",
    "    except Exception as __exc:",
    "        __d['error'] = type(__exc).__name__ + ': ' + str(__exc)",
    "    __d['ms'] = round((__time.perf_counter() - __t0) * 1000.0, 1)",
    "    __d['stdout'] = __buf.getvalue()",
    "    return __d",
    "",
    "",
    "for __item in " + JSON.stringify(items) + ":",
    "    __lp60_detail__.append(__lp60_case__(__item))",
    "",
    "for __d in __lp60_detail__:",
    "    if __d['ok'] or not (0 <= __d['task'] < len(__lp60_results__)):",
    "        continue",
    "    __lp60_results__[__d['task']] = __d['error'].split(':', 1)[0].strip() or 'wrong answer'",
    ""
  ].join("\n");
}

/* The program the sandbox actually runs. No opts: the full submission
 * (every task), which is the shape qa.mjs probes. */
export function composeProgram(code, tasks, opts) {
  const items = buildItems(tasks, opts);
  return String(code).replace(/\s+$/, "") + "\n\n\n" + buildHarness(items, (tasks || []).length);
}

/* A local (Node/CPython) program that prints the verdict as JSON, for
 * qa.mjs: nothing about it depends on the browser. */
export function composeProbeScript(code, tasks) {
  return composeProgram(code, tasks) + "\nprint(" + RESULT_PROBE + ")\n";
}
