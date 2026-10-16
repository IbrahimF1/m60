/* js/app.js - router + renderers for "Medium in 60" (vanilla JS, hash SPA).
 * The markup here is the cronicle.me design language: centered type blocks,
 * one white card per section, pills for actions, no accent color. */

import { TOOLBOX } from "./data/sections-toolbox.js";
import { PATTERNS_A } from "./data/sections-patterns-a.js";
import { PATTERNS_B } from "./data/sections-patterns-b.js";
import { PATTERNS_C } from "./data/sections-patterns-c.js";
import { CHEATSHEET } from "./data/reference.js";
import { mountExercise } from "./sandpack.js?v=16";

/* Canonical chapter order, regardless of import order. */
const ORDER = [
  "python-core", "stdlib", "idioms",
  "hashing", "two-pointers", "sliding-window", "binary-search",
  "linked-lists", "stacks",
  "trees", "graphs", "backtracking", "heaps", "intervals",
  "dp-1d", "dp-2d", "final"
];
const GROUPS = [
  { label: "Toolbox", ids: ORDER.slice(0, 3) },
  { label: "Patterns", ids: ORDER.slice(3, 16) },
  { label: "Close", ids: ORDER.slice(16) }
];

const ALL = [...TOOLBOX, ...PATTERNS_A, ...PATTERNS_B, ...PATTERNS_C];
const SECTIONS = ORDER
  .map((id) => ALL.find((s) => s && s.id === id))
  .filter(Boolean);
const BY_ID = new Map(SECTIONS.map((s) => [s.id, s]));
const TOTAL_MINUTES = SECTIONS.reduce((a, s) => a + (Number(s.minutes) || 0), 0);

/* ---------- progress (localStorage) ---------- */

const PKEY = "lp60.progress";
function readProgress() {
  try { return JSON.parse(localStorage.getItem(PKEY) || "{}") || {}; }
  catch (e) { return {}; }
}
function writeProgress(p) {
  try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) { /* noop */ }
}
function isDone(id) { return !!readProgress()[id]; }
function setDone(id, val) {
  const p = readProgress();
  if (val) p[id] = 1; else delete p[id];
  writeProgress(p);
  const onHome = !location.hash || location.hash === "#/";
  if (onHome) route(); else refreshProgressUI();
}
window.__lp60Pass = (id) => { if (!isDone(id)) setDone(id, true); };

function refreshProgressUI() {
  const done = SECTIONS.filter((s) => isDone(s.id)).length;
  const card = document.getElementById("progressCard");
  const caption = document.getElementById("progressCaption");
  const dock = document.getElementById("progressDock");
  if (card) card.textContent = done + "/" + SECTIONS.length;
  if (caption) caption.textContent = done === 1 ? "chapter done" : "chapters done";
  if (dock) {
    dock.setAttribute("aria-label",
      done + " of " + SECTIONS.length + " chapters complete. Back to the syllabus.");
  }
  renderTOC();
}

/* ---------- helpers ---------- */

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function minutes(s) { return (Number(s.minutes) || 0) + " min"; }

/* ---------- TOC ---------- */

function renderTOC() {
  const toc = document.getElementById("toc");
  if (!toc) return;
  const current = location.hash.match(/^#\/section\/([a-z0-9-]+)/);
  const currentId = current ? current[1] : null;
  let groups = "";
  let n = 0;
  for (const g of GROUPS) {
    groups += '<div class="label toc-group">' + esc(g.label) + '</div><ol class="toc-list">';
    for (const id of g.ids) {
      const s = BY_ID.get(id);
      if (!s) continue;
      n += 1;
      const done = isDone(id);
      const active = id === currentId ? " active" : "";
      groups +=
        '<li><a href="#/section/' + id + '" class="' + active.trim() + '">' +
        (done ? '<span class="toc-check">\u2713</span>' : "") +
        String(n).padStart(2, "0") + " " + esc(s.title) +
        "</a></li>";
    }
    groups += "</ol>";
  }
  const wide = window.matchMedia("(min-width: 961px)").matches;
  toc.innerHTML =
    "<details class=\"toc-wrap\"" + (wide ? " open" : "") + ">" +
      '<summary class="toc-toggle"><span>Chapters</span></summary>' +
      '<div class="toc-inner">' + groups + "</div>" +
    "</details>";
}

/* ---------- home ---------- */

function renderSyllabusRows() {
  let n = 0;
  let html = "";
  for (const g of GROUPS) {
    html += '<div class="chapter-group"><span class="label">' + esc(g.label) + "</span></div>";
    for (const id of g.ids) {
      const s = BY_ID.get(id);
      if (!s) continue;
      n += 1;
      const done = isDone(id);
      html +=
        '<a class="chapter-row" href="#/section/' + id + '">' +
          '<span class="chapter-num">' + String(n).padStart(2, "0") + "</span>" +
          "<span>" +
            '<span class="chapter-title">' + esc(s.title) + "</span>" +
            (s.tagline ? '<span class="chapter-tag">' + esc(s.tagline) + "</span>" : "") +
          "</span>" +
          '<span class="chapter-min">' + minutes(s) + "</span>" +
          '<span class="chapter-check">' + (done ? "\u2713" : "") + "</span>" +
        "</a>";
    }
  }
  return html;
}

function renderHome(el) {
  const first = BY_ID.get("python-core");
  const doneCount = SECTIONS.filter((s) => isDone(s.id)).length;

  el.innerHTML =
    '<section class="hero">' +
      '<h1 class="display">Almost every Medium is one of eleven patterns.</h1>' +
      '<p class="subhero">Seventeen short chapters for people who already program, ' +
        "each with a live Python editor in the page.</p>" +
      '<div class="cta-row">' +
        '<a class="pill pill-dark" href="#/section/python-core">Start with Python</a>' +
        '<a class="pill pill-light" href="#/section/hashing">Skip to the patterns</a>' +
      "</div>" +
    "</section>" +

    '<section class="block demo">' +
      '<div class="card exercise" id="home-demo">' +
        '<div class="exercise-head">' +
          '<span class="label">Chapter 01, practice</span>' +
          '<h2 class="exercise-title">' + esc(first.exercise.title) + "</h2>" +
          (first.exercise.leetcode
            ? '<a class="leetcode-link" href="' + esc(first.exercise.leetcode) + '" target="_blank" rel="noopener">on LeetCode \u2197</a>'
            : "") +
        "</div>" +
        '<div class="exercise-prompt">' + first.exercise.prompt + "</div>" +
        chips(first.exercise) +
        '<div id="home-demo-mount"></div>' +
        solutionBlock(first.exercise) +
      "</div>" +
      '<p class="small subscript">This is real CPython, compiled to WebAssembly, executing inside the page.</p>' +
    "</section>" +

    '<p class="mission">Most of the work is noticing which pattern a statement hides; ' +
      "the rest is Python you already know.</p>" +

    '<section class="block syllabus">' +
      '<h2 class="title">The syllabus</h2>' +
      '<div class="card">' + renderSyllabusRows() + "</div>" +
      '<p class="small syllabus-note">' + doneCount + " of " + SECTIONS.length +
        " chapters complete. Finish an exercise or press Mark complete to tick a chapter.</p>" +
    "</section>" +

    '<section class="features">' +
      feature("Run Python here", "Every chapter ends with an exercise you can run without leaving the page.") +
      feature("Every name is a link", "Every function in the prose and the code opens its page on docs.python.org.") +
      feature("Recognition drills", "Eleven patterns cover everything from hash maps to grid DP.") +
      feature("Close the tab, keep your code", "Drafts and chapter progress live in localStorage; a chapter reopens with your work in it.") +
    "</section>" +

    '<section class="cta-block">' +
      '<h2 class="display">Eleven patterns, about an hour.</h2>' +
      '<a class="pill pill-dark" href="#/section/python-core">Start with Python</a>' +
    "</section>";

  document.title = "Medium in 60: LeetCode Mediums in Python, in about an hour";

  const mount = el.querySelector("#home-demo-mount");
  if (mount) mountExercise(mount, first);
}

function feature(h, p) {
  return '<div class="feature"><h3 class="sub-head">' + h + '</h3><p>' + p + "</p></div>";
}

function chips(ex) {
  const items = (ex.docs || [])
    .map((d) => '<a class="chip" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.text) + "</a>")
    .join("");
  return items ? '<div class="doc-chips">' + items + "</div>" : "";
}

function solutionBlock(ex) {
  return ex.solution
    ? '<details class="solution"><summary>Show one solution</summary>' +
      "<pre><code>" + esc(ex.solution) + "</code></pre></details>"
    : "";
}

/* ---------- section page ---------- */

function renderSection(el, id) {
  const s = BY_ID.get(id);
  if (!s) { location.hash = "#/"; return; }
  const idx = SECTIONS.indexOf(s);
  const prev = SECTIONS[idx - 1];
  const next = SECTIONS[idx + 1];
  const ex = s.exercise || {};
  const done = isDone(s.id);

  el.innerHTML =
    '<article class="section-page">' +
      '<header class="page-head">' +
        '<span class="label">Chapter ' + String(idx + 1).padStart(2, "0") + " of " + SECTIONS.length +
          " \u00b7 " + minutes(s) + "</span>" +
        '<h1 class="display">' + esc(s.title) + "</h1>" +
        (s.tagline ? '<p class="subhero">' + esc(s.tagline) + "</p>" : "") +
      "</header>" +

      '<div class="body">' + (s.body || "") + "</div>" +

      '<div class="card exercise">' +
        '<div class="exercise-head">' +
          '<span class="label">Practice</span>' +
          '<h3 class="exercise-title">' + esc(ex.title || "Exercise") + "</h3>" +
          (ex.leetcode ? '<a class="leetcode-link" href="' + esc(ex.leetcode) + '" target="_blank" rel="noopener">on LeetCode \u2197</a>' : "") +
        "</div>" +
        '<div class="exercise-prompt">' + (ex.prompt || "") + "</div>" +
        chips(ex) +
        '<div id="sp-mount"></div>' +
        solutionBlock(ex) +
      "</div>" +

      '<div class="section-footer">' +
        (prev
          ? '<a class="nav-link" href="#/section/' + prev.id + '">\u2190 ' + esc(prev.title) + "</a>"
          : '<span class="spacer"></span>') +
        '<button class="pill ' + (done ? "pill-dark" : "pill-light") + ' pill-sm mark-done" type="button">' +
          (done ? "\u2713 Chapter complete" : "Mark complete") +
        "</button>" +
        (next
          ? '<a class="nav-link" href="#/section/' + next.id + '">' + esc(next.title) + " \u2192</a>"
          : '<span class="spacer"></span>') +
      "</div>" +
    "</article>";

  document.title = s.title + " \u00b7 Medium in 60";

  const mount = el.querySelector("#sp-mount");
  if (mount && ex.starter) mountExercise(mount, s);

  const btn = el.querySelector(".mark-done");
  btn.addEventListener("click", () => {
    setDone(s.id, !isDone(s.id));
    const now = isDone(s.id);
    btn.classList.toggle("pill-dark", now);
    btn.classList.toggle("pill-light", !now);
    btn.textContent = now ? "\u2713 Chapter complete" : "Mark complete";
  });
}

/* ---------- reference ---------- */

function renderReference(el) {
  const th = (t) => (t ? "<th>" + esc(t) + "</th>" : "<th></th>");
  const td = (t) => "<td>" + t + "</td>";

  const bigORows = (CHEATSHEET.bigO || []).map((r) =>
    "<tr>" + td(esc(r.op)) + td(esc(r.complexity)) +
    td('<a href="' + esc(r.url) + '" target="_blank" rel="noopener">python wiki \u2197</a>') + "</tr>"
  ).join("");

  const weaponRows = (CHEATSHEET.weapons || []).map((r) =>
    "<tr>" + td(esc(r.name)) + td(esc(r.what)) +
    td('<a href="' + esc(r.url) + '" target="_blank" rel="noopener">docs \u2197</a>') + "</tr>"
  ).join("");

  const signalRows = (CHEATSHEET.signals || []).map((r) =>
    "<tr>" + td(esc(r.signal)) + td(esc(r.pattern)) +
    td('<a href="' + esc(r.href) + '">chapter \u2192</a>') + "</tr>"
  ).join("");

  el.innerHTML =
    '<article class="reference-page">' +
      '<header class="page-head">' +
        '<span class="label">Appendix</span>' +
        '<h1 class="display">The cheat sheet</h1>' +
        '<p class="subhero">What Python operations cost, which stdlib tool takes a job, ' +
          "and the tell for each pattern.</p>" +
      "</header>" +

      '<div class="card table-card">' +
        '<span class="label">Pattern recognition</span>' +
        '<table><thead><tr>' + th("If you see") + th("Reach for") + th("") + "</tr></thead>" +
        "<tbody>" + signalRows + "</tbody></table>" +
      "</div>" +

      '<div class="card table-card">' +
        '<span class="label">Stdlib weapons</span>' +
        '<table><thead><tr>' + th("Tool") + th("What it does") + th("") + "</tr></thead>" +
        "<tbody>" + weaponRows + "</tbody></table>" +
      "</div>" +

      '<div class="card table-card">' +
        '<span class="label">Operation costs</span>' +
        '<table><thead><tr>' + th("Operation") + th("Cost") + th("") + "</tr></thead>" +
        "<tbody>" + bigORows + "</tbody></table>" +
      "</div>" +
    "</article>";

  document.title = "Reference \u00b7 Medium in 60";
}

/* ---------- about ---------- */

const DESIGN = [
  {
    k: "cronicle.me",
    v: "the design language this site clones: warm paper, one grotesque at weight 400, pills with inset highlights, the giant footer wordmark",
    u: "https://cronicle.me/"
  },
  {
    k: "Special Gothic",
    v: "the typeface, by Kilotype, served from this repo under the SIL Open Font License",
    u: "https://fonts.google.com/specimen/Special+Gothic"
  }
];
const INFLUENCES = [
  { k: "manuelmoreale.dev", v: "calm prose, quiet micro-labels, a 68ch measure", u: "https://manuelmoreale.dev/" },
  { k: "adamwhitcroft.com", v: "tiny uppercase section labels, key-value rows, quiet footers", u: "https://adamwhitcroft.com/" },
  { k: "thorstenball.com", v: "the sidebar-plus-column layout", u: "https://thorstenball.com/" },
  { k: "perrera.com", v: "pill chips, warm neutrals", u: "https://perrera.com/" },
  { k: "staydecent.ca", v: "plain-text navigation, arrows on links", u: "https://staydecent.ca/" }
];
const TECH = [
  { k: "Sandpack", v: "the in-page sandbox that boots your code", u: "https://sandpack.codesandbox.io/docs/" },
  { k: "Pyodide", v: "CPython compiled to WebAssembly, running your Python locally", u: "https://pyodide.org/" },
  { k: "CodeMirror 5", v: "the editor you type in", u: "https://codemirror.net/5/" }
];

function creditsCard(label, rows, note) {
  const items = rows
    .map((r) =>
      '<li><a class="credits-key" href="' + esc(r.u) + '" target="_blank" rel="noopener">' + esc(r.k) + "</a>" +
      '<span class="credits-val">' + esc(r.v) + "</span></li>"
    )
    .join("");
  return '<div class="card credits-card"><span class="label">' + esc(label) + "</span>" +
    '<ul class="credits-list">' + items + "</ul>" +
    (note ? '<p class="small">' + note + "</p>" : "") +
    "</div>";
}

function renderAbout(el) {
  el.innerHTML =
    '<article class="about-page">' +
      '<header class="page-head">' +
        '<span class="label">About</span>' +
        '<h1 class="display">A pretty simple website</h1>' +
        '<p class="subhero">Vanilla HTML, CSS and JavaScript; one page, no build step.</p>' +
      "</header>" +

      '<div class="body"><p>A one-hour pass over the patterns behind LeetCode Mediums, ' +
      "written for people who already program. Each chapter is short on purpose; " +
      "each exercise runs real Python (CPython 3.14 via WebAssembly) inside a Sandpack preview, and every " +
      'API mentioned links straight to <a href="https://docs.python.org/3/" target="_blank" rel="noopener">docs.python.org</a>.' +
      "</p></div>" +

      creditsCard("Design", DESIGN) +
      creditsCard("Earlier influences",
        INFLUENCES,
        'All five were found via <a href="https://deadsimplesites.com/" target="_blank" rel="noopener">deadsimplesites.com</a>. ' +
        "Their look is borrowed with affection; their content is their own.") +
      creditsCard("Machinery", TECH) +

      '<div class="card credits-card">' +
        '<span class="label">Privacy</span>' +
        '<p class="credits-val">There are no trackers and no accounts. Chapter progress and your editor ' +
        "drafts are kept in this browser's localStorage. Loading an exercise fetches the Sandpack module " +
        "and Pyodide from public CDNs; that is the only network traffic.</p>" +
      "</div>" +
    "</article>";

  document.title = "About \u00b7 Medium in 60";
}

/* ---------- router ---------- */

function route() {
  const app = document.getElementById("app");
  const hash = location.hash || "#/";
  const m = hash.match(/^#\/section\/([a-z0-9-]+)/);

  if (m) renderSection(app, m[1]);
  else if (hash.startsWith("#/reference")) renderReference(app);
  else if (hash.startsWith("#/about")) renderAbout(app);
  else renderHome(app);

  document.body.classList.toggle("has-rail", !!m);

  renderTOC();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", () => {
  refreshProgressUI();
  route();
});
if (document.readyState !== "loading") {
  refreshProgressUI();
  route();
}
