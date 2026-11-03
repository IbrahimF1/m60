/* qa.mjs — schema + content validation for "Medium in 60".
 * Run: node qa.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { TOOLBOX } from "./js/data/sections-toolbox.js";
import { PATTERNS_A } from "./js/data/sections-patterns-a.js";
import { PATTERNS_B } from "./js/data/sections-patterns-b.js";
import { PATTERNS_C } from "./js/data/sections-patterns-c.js";
import { CHEATSHEET } from "./js/data/reference.js";
import { composeProbeScript } from "./js/checks.js";

const ORDER = [
  "python-core", "stdlib", "idioms",
  "hashing", "two-pointers", "sliding-window", "binary-search",
  "linked-lists", "stacks",
  "trees", "graphs", "backtracking", "heaps", "intervals",
  "dp-1d", "dp-2d", "final"
];

let errors = 0;
const err = (m) => { errors++; console.log("  FAIL " + m); };
const ok = (m) => console.log("  ok   " + m);

/* Tasks are ladders: same canonical function, one new idea per step, and
 * each step carries several assert lines that all must pass. The forcing
 * chain is machine-verified: exercise.steps[k] is an authored program that
 * passes exactly tasks 1..k+1 and fails the rest, proving the previous
 * step's solution cannot satisfy the next task. Each task renders as
 * goal (text) + numbered moves + step diagram + check rows, with a hint
 * behind the Stuck panel. LADDER_REQUIRED flips true once every chapter
 * carries the full anatomy. */
const LADDER_REQUIRED = true;

const ALL = [...TOOLBOX, ...PATTERNS_A, ...PATTERNS_B, ...PATTERNS_C];
const byId = new Map(ALL.map((s) => [s.id, s]));

/* Optional scope filter: node qa.mjs --only=hashing,two-pointers runs the
 * per-chapter checks for just those chapters. The ladder rollout runs one
 * agent per data file; the whole-file run stays the final gate. */
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const inScope = (id) => !ONLY.length || ONLY.includes(id);

console.log("sections:");
if (ONLY.length) console.log("  scope: " + ONLY.join(", "));
for (const s of ALL) {
  if (!inScope(s.id)) continue;
  const where = "[" + s.id + "]";
  if (!ORDER.includes(s.id)) err(where + " unexpected id");
  if (typeof s.title !== "string" || !s.title) err(where + " title");
  if (!Number.isInteger(s.minutes) || s.minutes < 2 || s.minutes > 8) err(where + " minutes=" + s.minutes);
  if (typeof s.tagline !== "string" || s.tagline.length > 130) err(where + " tagline len=" + (s.tagline || "").length);
  const b = s.body || "";
  if (b.length < 900) err(where + " body too short (" + b.length + ")");
  if (b.includes("`")) err(where + " body contains backtick");
  if (!b.includes("<p class=\"callout complexity\"")) err(where + " missing complexity callout");
  if (!/<pre><code(\s[^>]*)?>/.test(b)) err(where + " missing code example block");
  const badTags = b.match(/<(?!\/?(?:h3|p|ul|ol|li|pre|code|em|strong|a|figure|figcaption|svg|g|defs|marker|path|rect|circle|line|polyline|polygon|text|tspan)\b)[a-z][^>]*>/gi);
  if (badTags) err(where + " disallowed tags: " + badTags.slice(0, 5).join(" "));
  if (!b.includes('<figure class="fig"')) { err(where + " missing figure"); }
  else {
    if (!b.includes("<figcaption>")) err(where + " figure missing caption");
    if (!/<svg viewBox="[0-9 ]+"/.test(b)) err(where + " figure svg missing viewBox");
    if (!/<\/(?:svg|figure)>/.test(b)) err(where + " unclosed figure");
  }
  const hrefs = [...b.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const h of hrefs) {
    const fine = h.startsWith("https://docs.python.org/") ||
      h.startsWith("https://wiki.python.org/") ||
      h.startsWith("https://leetcode.com/") ||
      h.startsWith("#/section/");
    if (!fine) err(where + " body href not whitelisted: " + h);
  }
  if (!hrefs.some((h) => h.startsWith("https://docs.python.org/") || h.startsWith("https://wiki.python.org/"))) {
    err(where + " body has no python docs links");
  }

  const ex = s.exercise || {};
  if (!ex.title || !ex.prompt) err(where + " exercise title/prompt");
  if (!/^https:\/\/leetcode\.com\/problems\//.test(ex.leetcode || "")) err(where + " leetcode url");
  if (!Array.isArray(ex.docs) || ex.docs.length < 2) err(where + " docs chips");
  for (const d of ex.docs || []) {
    if (!d.text || !/^https:\/\/(docs\.python\.org|wiki\.python\.org)\//.test(d.url || "")) err(where + " chip url: " + (d && d.url));
  }
  const st = ex.starter || "";
  const so = ex.solution || "";
  if (!st || !st.includes("TODO")) err(where + " starter missing stub");
  if (/\bassert\b/.test(st)) err(where + " starter still contains checks");
  if (st.includes("`") || so.includes("`")) err(where + " python contains backtick");
  const tk = ex.tasks;
  if (!Array.isArray(tk) || tk.length < 3 || tk.length > 6) err(where + " tasks count=" + ((tk || []).length));
  for (const t of tk || []) {
    if (!t || typeof t.text !== "string" || !t.text) err(where + " task text missing");
    const tests = t && (t.tests || (t.test ? [t.test] : []));
    if (!tests.length) err(where + " task tests missing: " + (t && (t.tests || t.test)));
    for (const tst of tests) {
      if (typeof tst !== "string" || !tst.startsWith("assert ")) err(where + " task test bad: " + tst);
      if (typeof tst === "string" && tst.includes("`")) err(where + " task contains backtick");
    }
    if (/[\u2013\u2014]/.test(String((t && t.text) || ""))) err(where + " task text has a typographic dash");
    const hint = t && t.hint;
    if (hint != null) {
      if (typeof hint !== "string" || !hint.trim()) err(where + " task hint empty");
      else if (hint.length > 160) err(where + " task hint too long (" + hint.length + ")");
      else if (hint.includes("`") || /[<>]/.test(hint)) err(where + " task hint must be plain text");
      else if (/[\u2013\u2014]/.test(hint)) err(where + " task hint has a typographic dash");
    } else if (LADDER_REQUIRED) err(where + " task hint missing");
    const moves = t && t.moves;
    if (moves != null) {
      if (!Array.isArray(moves) || !moves.length || moves.length > 4) err(where + " task moves count=" + ((moves || []).length));
      for (const m of Array.isArray(moves) ? moves : []) {
        if (typeof m !== "string" || !m.trim()) err(where + " task move empty");
        else if (m.length > 90) err(where + " task move too long (" + m.length + ")");
        else if (m.includes("`") || /[<>]/.test(m)) err(where + " task move must be plain text");
        else if (/[\u2013\u2014]/.test(m)) err(where + " task move has a typographic dash");
      }
    } else if (LADDER_REQUIRED) err(where + " task moves missing");
    const checks = t && t.checks;
    if (checks != null) {
      if (!Array.isArray(checks) || !checks.length || checks.length > 4) err(where + " task checks count=" + ((checks || []).length));
      for (const c of Array.isArray(checks) ? checks : []) {
        if (!c || typeof c !== "object" || typeof c.input !== "string" || typeof c.output !== "string") {
          err(where + " task check must be {input, output}");
        } else if (!c.input.trim() || !c.output.trim()) {
          err(where + " task check input/output empty");
        } else if (c.input.length > 60 || c.output.length > 60) {
          err(where + " task check too long");
        } else if (/[<>`]/.test(c.input + c.output)) {
          err(where + " task check must be plain text");
        } else if (/[\u2013\u2014]/.test(c.input + c.output)) {
          err(where + " task check has a typographic dash");
        }
      }
    } else if (LADDER_REQUIRED) err(where + " task checks missing");
    const dia = t && t.diagram;
    if (dia != null) {
      if (typeof dia !== "string" || !/<svg viewBox="[0-9 ]+"/.test(dia) || !dia.includes("</svg>")) {
        err(where + " task diagram malformed");
      } else if (dia.includes("`")) {
        err(where + " task diagram contains backtick");
      } else {
        const badDia = dia.match(/<(?!\/?(?:svg|g|defs|marker|path|rect|circle|line|polyline|polygon|text|tspan)\b)[a-z][^>]*>/gi);
        if (badDia) err(where + " task diagram disallowed tags: " + badDia.slice(0, 3).join(" "));
        const ids = [...dia.matchAll(/marker id="([^"]+)"/g)].map((m) => m[1]);
        for (const id of ids) if (!/^ar[a-z0-9-]{2,}$/.test(id)) err(where + " task diagram marker id not unique-safe: " + id);
      }
    } else if (LADDER_REQUIRED) err(where + " task diagram missing");
  }
  const steps = ex.steps;
  if (steps != null) {
    if (!Array.isArray(steps) || steps.length !== (tk || []).length) {
      err(where + " steps count=" + ((steps || []).length) + " but tasks=" + ((tk || []).length));
    }
    for (const s of Array.isArray(steps) ? steps : []) {
      if (typeof s !== "string" || !s.trim()) err(where + " step program missing");
      else if (s.includes("`")) err(where + " step contains backtick");
      else if (s.includes("TODO")) err(where + " step contains TODO");
    }
  } else if (LADDER_REQUIRED) err(where + " steps missing");
  if (!so || so === st) err(where + " solution missing/identical");
  if (so.includes("TODO")) err(where + " solution still has TODO");
  if (!errors) ok(where + " " + s.title);
}

console.log("chapter coverage:");
for (const id of ORDER) {
  if (!byId.has(id)) err("missing chapter: " + id);
}
if (ORDER.every((id) => byId.has(id))) ok("all " + ORDER.length + " chapters present");

console.log("cheatsheet:");
if (!Array.isArray(CHEATSHEET.bigO) || CHEATSHEET.bigO.length < 8) err("bigO rows");
if (!Array.isArray(CHEATSHEET.weapons) || CHEATSHEET.weapons.length < 10) err("weapons rows");
if (!Array.isArray(CHEATSHEET.signals) || CHEATSHEET.signals.length < 10) err("signals rows");
for (const r of CHEATSHEET.signals || []) {
  const id = String(r.href || "").replace("#/section/", "");
  if (!ORDER.includes(id)) err("signal href bad: " + r.href);
}
for (const r of CHEATSHEET.bigO || []) {
  if (r.url !== "https://wiki.python.org/moin/TimeComplexity") err("bigO url: " + r.url);
}
console.log("  rows: bigO=" + (CHEATSHEET.bigO || []).length +
  " weapons=" + (CHEATSHEET.weapons || []).length +
  " signals=" + (CHEATSHEET.signals || []).length);

console.log("solutions (python execution):");
for (const id of ORDER) {
  if (!inScope(id)) continue;
  const p = "solutions/" + id + ".py";
  if (!existsSync(p)) { err("missing " + p); continue; }
  const src = readFileSync(p, "utf8");
  if (src.includes("TODO")) err(p + " contains TODO");
  try {
    const out = execFileSync("python", [p], { encoding: "utf8", timeout: 15000 });
    if (!out.includes("All tests passed!")) err(p + " no success line: " + out.slice(-120));
    else ok(p);
  } catch (e) {
    err(p + " exited nonzero: " + String(e.stderr || e.message).slice(-300));
  }
}

console.log("tasks (composed with js/checks.js, run in python):");
function runComposed(code, tasks) {
  const out = execFileSync("python", ["-c", composeProbeScript(code, tasks)], { encoding: "utf8", timeout: 15000 });
  const line = out.trim().split("\n").filter(Boolean).pop();
  return JSON.parse(line);
}
for (const id of ORDER) {
  if (!inScope(id)) continue;
  const s = byId.get(id);
  if (!s) continue;
  const ex = s.exercise || {};
  const tasks = ex.tasks || [];
  try {
    const results = runComposed(ex.solution || "", tasks);
    const failing = results.map((v, i) => (v === null ? null : i + 1)).filter((v) => v !== null);
    if (results.length !== tasks.length) err("[" + id + "] solution produced " + results.length + " verdicts for " + tasks.length + " tasks");
    else if (failing.length) err("[" + id + "] solution fails task(s) " + failing.join(", "));
    else ok("[" + id + "] solution passes all " + tasks.length + " tasks");
  } catch (e) {
    err("[" + id + "] solution did not run: " + String(e.stderr || e.message).slice(-200));
  }
  try {
    const results = runComposed(ex.starter || "", tasks);
    const passedIdx = results.map((v, i) => (v === null ? i + 1 : null)).filter((v) => v !== null);
    if (passedIdx.length) err("[" + id + "] starter already passes task(s) " + passedIdx.join(", ") + "; every task must force code");
    else ok("[" + id + "] starter fails all " + tasks.length + " tasks as intended");
  } catch (e) {
    err("[" + id + "] starter did not run: " + String(e.stderr || e.message).slice(-200));
  }
}

console.log("steps (ladder forcing: step k passes exactly tasks 1..k):");
for (const id of ORDER) {
  if (!inScope(id)) continue;
  const s = byId.get(id);
  if (!s) continue;
  const ex = s.exercise || {};
  const tasks = ex.tasks || [];
  const steps = ex.steps;
  if (!Array.isArray(steps) || !steps.length) continue;
  for (let k = 0; k < steps.length; k++) {
    try {
      const results = runComposed(steps[k], tasks);
      const earlyFail = results.map((v, i) => (i <= k && v !== null ? i + 1 : null)).filter((v) => v !== null);
      const latePass = results.map((v, i) => (i > k && v === null ? i + 1 : null)).filter((v) => v !== null);
      if (earlyFail.length) err("[" + id + "] step " + (k + 1) + " fails its own task(s) " + earlyFail.join(", "));
      else if (latePass.length) err("[" + id + "] step " + (k + 1) + " already passes later task(s) " + latePass.join(", "));
      else ok("[" + id + "] step " + (k + 1) + " passes tasks 1.." + (k + 1) + ", fails the rest");
    } catch (e) {
      err("[" + id + "] step " + (k + 1) + " did not run: " + String(e.stderr || e.message).slice(-200));
    }
  }
}

console.log("\n" + (errors ? errors + " PROBLEM(S)" : "ALL CHECKS PASSED"));
process.exit(errors ? 1 : 0);
