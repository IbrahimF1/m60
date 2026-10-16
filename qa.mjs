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

const ALL = [...TOOLBOX, ...PATTERNS_A, ...PATTERNS_B, ...PATTERNS_C];
const byId = new Map(ALL.map((s) => [s.id, s]));

console.log("sections:");
for (const s of ALL) {
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
    if (!t || typeof t.test !== "string" || !t.test.startsWith("assert ")) err(where + " task test missing: " + (t && t.test));
    if (String((t && t.text) || "").includes("`") || String((t && t.test) || "").includes("`")) err(where + " task contains backtick");
  }
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
    if (results.every((v) => v === null)) err("[" + id + "] starter already passes every task");
    else ok("[" + id + "] starter fails " + results.filter((v) => v !== null).length + "/" + tasks.length + " as intended");
  } catch (e) {
    err("[" + id + "] starter did not run: " + String(e.stderr || e.message).slice(-200));
  }
}

console.log("\n" + (errors ? errors + " PROBLEM(S)" : "ALL CHECKS PASSED"));
process.exit(errors ? 1 : 0);
