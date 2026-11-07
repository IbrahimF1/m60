/* js/sandpack.js - Sandpack + Pyodide exercise component for "Medium in 60".
 *
 * Each practice exercise renders in the shape the judge sites converged
 * on (see research/judge-ui-patterns.md): Run and Submit are separate
 * actions above the editor, and below it a console with two tabs.
 *
 *   Testcase  - the sample cases for the task in view, exactly as the
 *               judge parses them (Input / Expected), plus an opt-in
 *               custom input with an optional expected value
 *               (HackerRank's checkbox, LeetCode's editable case).
 *   Result    - a verdict line (Accepted / Wrong Answer / Runtime Error /
 *               Syntax Error, case count, milliseconds), Case 1 / Case 2
 *               tabs with per-case pass/fail marks, and per case the
 *               Input / Output / Expected blocks with the wrong output
 *               tinted, a Stdout block for prints, and the case's error.
 *               Cases beyond the first failing task stay hidden, which
 *               keeps the rail's drip ladder unspoiled.
 *
 * Run judges the task in view (plus the custom case when asked) and never
 * advances the ladder. Submit judges every task's cases, credits the rail,
 * and is the only path to Accepted. After either action the console
 * switches to Result, opened on the first failing case, like LeetCode.
 * Execution is Pyodide inside a hidden Sandpack preview; the page renders
 * everything itself from the structured verdicts the judge posts back.
 */

import { composeProgram, parseTest } from "./checks.js?v=20";

const SP_MODULE_URL = "./vendor/sandpack-client.mjs";

/* The root build exports the `loadSandpackClient(iframe, setup, options)`
 * factory (which dispatches `template: "static"` to the static client).
 * Newer builds may export the class directly; support both. */
let clientFactoryPromise = null;
function loadClientFactory() {
  if (!clientFactoryPromise) {
    clientFactoryPromise = import(SP_MODULE_URL).then((mod) => {
      const f = mod.loadSandpackClient || (mod.default && mod.default.loadSandpackClient);
      if (typeof f === "function") return f;
      const C = mod.SandpackStatic || mod.StaticSandpackClient || mod.SandpackClient ||
        (mod.default && (mod.default.SandpackStatic || mod.default.SandpackClient));
      if (typeof C === "function") return (el, setup, opts) => Promise.resolve(new C(el, setup, opts));
      throw new Error("loadSandpackClient not exported by sandpack-client");
    });
  }
  return clientFactoryPromise;
}

/* The judge lives inside the Sandpack preview iframe. Kept ES5 + string
 * concatenation only: this function is serialized with Function.prototype
 * .toString and injected as the iframe's script. No template literals. */
function __lp60Runner() {
  var consoleText = "";
  function stage(s) {
    try { parent.postMessage({ type: "LP60_STAGE", stage: s }, "*"); } catch (e) { /* sandboxed */ }
  }
  function say(t) { consoleText += t; }
  function fail(msg) {
    stage("done");
    try {
      parent.postMessage({ type: "LP60_RESULT", ok: false, error: msg, stdout: consoleText }, "*");
    } catch (e) { /* sandboxed */ }
  }
  window.onerror = function (m) { fail(String(m)); return true; };

  var code = document.getElementById("py-src").textContent;

  stage("boot");
  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.js";
  s.onerror = function () {
    fail("could not load Pyodide from the CDN (offline?)");
  };
  s.onload = function () {
    var pyRuntime = null;
    loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/" })
      .then(function (py) {
        pyRuntime = py;
        py.setStdout({ batched: say });
        py.setStderr({ batched: say });
        /* Pyodide owns the event loop (WebLoop). Do not call
         * asyncio.set_event_loop() here: replacing the loop breaks
         * runPythonAsync on current Pyodide builds. */
        return py.runPythonAsync(
          "import sys\n" +
          "sys.setrecursionlimit(20000)\n"
        ).then(function () { return py.runPythonAsync(code); });
      })
      .then(function () {
        stage("done");
        var detail = null, results = null;
        try {
          detail = JSON.parse(pyRuntime.runPython("__import__('json').dumps(__lp60_detail__)"));
          results = JSON.parse(pyRuntime.runPython("__import__('json').dumps(__lp60_results__)"));
        } catch (e) { detail = null; }
        if (!detail) { fail("the judge did not report its cases"); return; }
        try {
          parent.postMessage(
            { type: "LP60_RESULT", ok: true, detail: detail, results: results || [], stdout: consoleText },
            "*"
          );
        } catch (e) { /* sandboxed */ }
      })
      .catch(function (e) {
        var msg = String((e && e.message) || e);
        var lines = msg.replace(/\s+$/, "").split("\n");
        fail(lines.slice(-8).join("\n"));
      });
  };
  document.body.appendChild(s);
}

function buildRunnerShell(program) {
  const py = String(program).replace(/<\/script/gi, "<\\/script");
  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "</head><body>",
    '<script type="text/x-python" id="py-src">' + py + "<\/script>",
    "<script>(" + __lp60Runner.toString() + ")();<\/script>",
    "</body></html>"
  ].join("");
}

/* One global listener; the active mount registers its handlers. */
let activeResultHandler = null;
let activeStageHandler = null;
window.addEventListener("message", (ev) => {
  const d = ev && ev.data;
  if (!d) return;
  if (d.type === "LP60_RESULT" && typeof activeResultHandler === "function") activeResultHandler(d);
  if (d.type === "LP60_STAGE" && typeof activeStageHandler === "function") activeStageHandler(d);
});

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* The expected text for a parsed case: the literal for `is`, the source
 * for everything else (they are written as literals in the data). */
function expectedText(c) {
  if (!c) return "";
  if (c.kind === "is") return c.rhs;
  if (c.kind === "in") return c.rhs + "  (one of)";
  if (c.kind === "raw") return "the check must pass";
  return c.rhs;
}

export function mountExercise(container, section, opts) {
  const ex = section.exercise;
  const options = opts || {};
  const draftKey = "lp60.code." + section.id;
  /* v3: task ladders were rewritten for beginners, so checks earned against
   * the old lists are void. Code drafts still match the unchanged starters
   * and are kept. */
  const doneKey = "lp60.v3.tasks." + section.id;
  const customKey = "lp60.custom." + section.id;
  const tasks = Array.isArray(ex.tasks) ? ex.tasks : [];
  const done = tasks.map(() => false);
  const custom = { on: false, input: "", expected: "" };

  /* Restore task checks earned in earlier visits, and the saved custom
   * testcase (a convenience, never a verdict). */
  try {
    const saved = JSON.parse(localStorage.getItem(doneKey) || "null");
    if (Array.isArray(saved)) saved.forEach((v, i) => { if (i < done.length) done[i] = !!v; });
  } catch (e) { /* private mode */ }
  try {
    const c = JSON.parse(localStorage.getItem(customKey) || "null");
    if (c && typeof c === "object") {
      custom.on = !!c.on;
      custom.input = typeof c.input === "string" ? c.input : "";
      custom.expected = typeof c.expected === "string" ? c.expected : "";
    }
  } catch (e) { /* private mode */ }

  function persistDone() {
    try { localStorage.setItem(doneKey, JSON.stringify(done.map((v) => (v ? 1 : 0)))); }
    catch (e) { /* noop */ }
  }
  function persistCustom() {
    try { localStorage.setItem(customKey, JSON.stringify(custom)); }
    catch (e) { /* noop */ }
  }

  const continueBlock = tasks.length && options.go
    ? '<div class="sp-continue">' +
        '<p class="sp-continue-hint small">Solve all tasks to continue.</p>' +
        '<a class="pill pill-light pill-sm sp-continue-link" data-sp-go href="' + escHtml(options.go.href) +
          '" aria-disabled="true">' + escHtml(options.go.label) + "</a>" +
      "</div>"
    : "";

  container.classList.add("sp");
  container.innerHTML =
    '<div class="sp-toolbar">' +
      '<button class="pill pill-light pill-sm sp-run" type="button">Run \u25B8</button>' +
      (tasks.length ? '<button class="pill pill-dark pill-sm sp-submit" type="button">Submit</button>' : "") +
      '<button class="pill pill-light pill-sm sp-reset" type="button">Reset code</button>' +
      '<span class="sp-status" data-sp-status>Run the samples or submit; Python executes right here, in a hidden preview.</span>' +
    "</div>" +
    '<div class="sp-main' + (tasks.length ? "" : " sp-solo") + '">' +
      '<div class="sp-work">' +
        '<div class="sp-editor-wrap" data-sp-editor></div>' +
        '<div class="sp-console">' +
          '<div class="sp-console-tabs" role="tablist" aria-label="Exercise console">' +
            '<button class="sp-console-tab is-active" type="button" role="tab" aria-selected="true" data-tab="testcase">Testcase</button>' +
            '<button class="sp-console-tab" type="button" role="tab" aria-selected="false" data-tab="result">Result</button>' +
            '<span class="sp-console-tabs-space"></span>' +
          "</div>" +
          '<div class="sp-console-panel is-active" data-panel="testcase" role="tabpanel">' +
            '<div class="sp-samples" data-sp-samples></div>' +
            '<div class="sp-custom">' +
              '<label class="sp-custom-toggle">' +
                '<input type="checkbox" data-sp-custom-on' + (custom.on ? " checked" : "") + "> " +
                "Also run a custom input" +
              "</label>" +
              '<div class="sp-custom-fields">' +
                '<label class="sp-field"><span class="tc-label">Input</span>' +
                  '<input class="sp-input" type="text" data-sp-custom-in spellcheck="false" autocomplete="off" placeholder=""></label>' +
                '<label class="sp-field"><span class="tc-label">Expected (optional)</span>' +
                  '<input class="sp-input" type="text" data-sp-custom-exp spellcheck="false" autocomplete="off" placeholder="[&quot;bat&quot;], [&quot;cat&quot;]"></label>' +
              "</div>" +
              '<p class="sp-custom-note small">A Python expression, e.g. <code>group_anagrams(["eat", "tea"])</code>. It runs after the samples; Run shows what it returns.</p>' +
            "</div>" +
          "</div>" +
          '<div class="sp-console-panel" data-panel="result" role="tabpanel">' +
            '<p class="sp-empty small" data-sp-empty>No results yet. Run the sample cases, or submit to check every task.</p>' +
            '<div class="sp-result" data-sp-result hidden></div>' +
          "</div>" +
        "</div>" +
        '<div class="sp-host" data-sp-preview aria-hidden="true"></div>' +
      "</div>" +
      (tasks.length
        ? '<aside class="sp-tasks" data-sp-tasks aria-label="Exercise tasks">' +
            '<div class="sp-tasks-head">' +
              '<span class="label">Tasks</span>' +
              '<span class="sp-tasks-count" data-sp-count>0/' + tasks.length + "</span>" +
            "</div>" +
            '<div class="sp-step-nav">' +
              '<button class="sp-nav-btn" type="button" data-sp-prev aria-label="Previous task">\u2039</button>' +
              '<div class="sp-progress" data-sp-progress></div>' +
              '<button class="sp-nav-btn" type="button" data-sp-next aria-label="Next task">\u203A</button>' +
            "</div>" +
            '<ol class="task-list" data-sp-list></ol>' +
            '<details class="task-help">' +
              '<summary>Stuck? Get a hint.</summary>' +
              '<div class="task-help-body" data-sp-help></div>' +
            "</details>" +
            continueBlock +
          "</aside>"
        : "") +
    "</div>";

  const editorHost = container.querySelector("[data-sp-editor]");
  const previewHost = container.querySelector("[data-sp-preview]");
  const statusEl = container.querySelector("[data-sp-status]");
  const runBtn = container.querySelector(".sp-run");
  const submitBtn = container.querySelector(".sp-submit");
  const resetBtn = container.querySelector(".sp-reset");
  const listEl = container.querySelector("[data-sp-list]");
  const countEl = container.querySelector("[data-sp-count]");
  const progressEl = container.querySelector("[data-sp-progress]");
  const prevBtn = container.querySelector("[data-sp-prev]");
  const nextBtn = container.querySelector("[data-sp-next]");
  const helpEl = container.querySelector("[data-sp-help]");
  const helpWrap = container.querySelector(".task-help");
  const goEl = container.querySelector("[data-sp-go]");
  const samplesEl = container.querySelector("[data-sp-samples]");
  const emptyEl = container.querySelector("[data-sp-empty]");
  const resultEl = container.querySelector("[data-sp-result]");
  const customOnEl = container.querySelector("[data-sp-custom-on]");
  const customInEl = container.querySelector("[data-sp-custom-in]");
  const customExpEl = container.querySelector("[data-sp-custom-exp]");
  const consoleTabs = container.querySelector(".sp-console-tabs");

  /* --- console tabs ----------------------------------------------------- */

  function switchTab(name) {
    container.querySelectorAll(".sp-console-tab").forEach((b) => {
      const on = b.getAttribute("data-tab") === name;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    container.querySelectorAll(".sp-console-panel").forEach((p) => {
      p.classList.toggle("is-active", p.getAttribute("data-panel") === name);
    });
  }
  if (consoleTabs) consoleTabs.addEventListener("click", (ev) => {
    const b = ev.target.closest ? ev.target.closest("[data-tab]") : null;
    if (b) switchTab(b.getAttribute("data-tab"));
  });

  /* --- task rail -------------------------------------------------------
   * The rail drips and steps: a completed task's description collapses out
   * of view and only one task stands open at a time. Earned tasks stay
   * reviewable by stepping with the arrows or clicking a segment of the
   * progress bar; nothing ahead of the current task is ever shown. */

  function activeIndex() {
    for (let i = 0; i < done.length; i++) if (!done[i]) return i;
    return -1;
  }

  let prevActive = -2;
  let viewIndex = -1;
  let lastResults = null;
  let lastRenderedView = -1;

  function casesFor(i) {
    const t = tasks[i];
    if (!t) return [];
    return (t.tests || (t.test ? [t.test] : [])).map(parseTest);
  }

  /* The Testcase panel: the sample cases for whichever task the rail has
   * in view, shown as the judge sees them. Re-rendered whenever the view
   * moves (the custom fields below are separate DOM and keep their text). */
  function renderSamples() {
    if (!samplesEl) return;
    const t = tasks[viewIndex];
    if (!t) { samplesEl.innerHTML = ""; return; }
    const cases = casesFor(viewIndex);
    const rows = cases.map((c, i) =>
      '<li><span class="sp-case-n">' + (i + 1) + "</span>" +
        '<span class="sp-io">' +
          '<span class="sp-io-row"><span class="tc-label">Input</span>' +
            "<code>" + escHtml(c.kind === "raw" ? c.src : c.lhs) + "</code></span>" +
          '<span class="sp-io-row"><span class="tc-label">Expected</span>' +
            "<code>" + escHtml(expectedText(c)) + "</code></span>" +
        "</span></li>"
    ).join("");
    samplesEl.innerHTML =
      '<span class="label">Sample cases \u00B7 task ' + String(viewIndex + 1).padStart(2, "0") + "</span>" +
      '<ol class="sp-cases">' + rows + "</ol>";
    if (customInEl && !custom.input) {
      customInEl.placeholder = cases.length
        ? cases[0].kind === "raw" ? "your own expression" : cases[0].lhs
        : "your own expression";
    }
  }

  function renderTasks(latest) {
    lastResults = latest;
    const active = activeIndex();
    const passed = done.filter(Boolean).length;
    const freshTask = active >= 0 && active > prevActive;   /* just unlocked */
    const wasAllDone = prevActive === -1;
    prevActive = active;
    const maxView = active < 0 ? tasks.length - 1 : active;
    if (viewIndex === -1) viewIndex = active < 0 ? tasks.length - 1 : active;
    if (freshTask) viewIndex = active;
    if (active === -1 && !wasAllDone) viewIndex = tasks.length - 1;   /* finish on the last step */
    viewIndex = Math.max(0, Math.min(viewIndex, maxView));
    const viewMoved = viewIndex !== lastRenderedView;

    const viewed = tasks[viewIndex];
    if (listEl && viewed) {
      const isDone = done[viewIndex];
      const cls = "task" + (isDone ? " is-done" : "") +
        (viewIndex === active ? " is-active" + (freshTask ? " is-new" : "") : "");
      const failedNow = latest && latest[viewIndex] !== null && !isDone;
      const movesHtml = (viewed.moves && viewed.moves.length)
        ? '<ol class="task-moves">' + viewed.moves.map((m) => "<li>" + escHtml(m) + "</li>").join("") + "</ol>"
        : "";
      const figHtml = viewed.diagram ? '<div class="task-fig">' + viewed.diagram + "</div>" : "";
      const checksHtml = (viewed.checks && viewed.checks.length)
        ? '<ul class="task-checks">' + viewed.checks.map((c) => {
            const ci = c && typeof c === "object" ? c.input : c;
            const co = c && typeof c === "object" ? c.output : "";
            return '<li><span class="tc-label">Input</span>' +
              '<span class="tc-val">' + escHtml(ci == null ? "" : ci) + "</span>" +
              (co != null && co !== ""
                ? '<span class="tc-label">Output</span><span class="tc-val">' + escHtml(co) + "</span>"
                : "") +
              "</li>";
          }).join("") + "</ul>"
        : "";
      listEl.innerHTML = '<li class="' + cls + '" data-task="' + viewIndex + '">' +
        '<span class="task-num">' + String(viewIndex + 1).padStart(2, "0") + "</span>" +
        '<span class="task-text">' + (viewed.text || "") + movesHtml + figHtml + checksHtml +
          (failedNow ? '<span class="task-error">' + escHtml(latest[viewIndex]) + "</span>" : "") +
        "</span>" +
        '<span class="task-check"' + (isDone ? ' role="img" aria-label="passed"' : ' aria-hidden="true"') + ">" +
          (isDone ? "\u2713" : "") +
        "</span>" +
      "</li>";
    }

    if (countEl) countEl.textContent = passed + "/" + tasks.length;

    if (progressEl) {
      /* One segment per task: filled when earned, half for the current one,
       * empty and inert for everything still ahead. */
      progressEl.innerHTML = tasks.map((_, i) => {
        const reachable = i <= maxView;
        return '<button type="button" class="sp-seg' +
          (done[i] ? " is-done" : "") + (i === active ? " is-current" : "") +
          '" data-seg="' + i + '"' + (reachable ? "" : ' disabled aria-disabled="true"') +
          ' aria-label="Task ' + (i + 1) + '"><span></span></button>';
      }).join("");
    }

    if (prevBtn) prevBtn.disabled = viewIndex <= 0;
    if (nextBtn) nextBtn.disabled = viewIndex >= maxView;

    const shown = tasks[viewIndex];
    if (helpEl && helpWrap && shown) {
      helpWrap.querySelector("summary").textContent = "Stuck? Get a hint.";
      const shownTests = shown.tests || (shown.test ? [shown.test] : []);
      helpEl.innerHTML =
        (shown.hint
          ? '<span class="label">Hint for task ' + String(viewIndex + 1).padStart(2, "0") + "</span>" +
            '<p class="task-help-hint">' + escHtml(shown.hint) + "</p>"
          : "") +
        '<span class="label">The check this task must pass</span>' +
        '<pre class="task-help-code"><code>' + escHtml(shownTests.join("\n")) + "</code></pre>";
    }

    if (goEl) {
      const unlocked = tasks.length > 0 && passed === tasks.length;
      goEl.classList.toggle("pill-dark", unlocked);
      goEl.classList.toggle("pill-light", !unlocked);
      if (unlocked) goEl.removeAttribute("aria-disabled");
      else goEl.setAttribute("aria-disabled", "true");
    }

    if (viewMoved) renderSamples();
    lastRenderedView = viewIndex;
  }

  /* Step through reviewable tasks: arrows move one, a bar segment jumps. */
  function stepView(delta) {
    const active = activeIndex();
    const maxView = active < 0 ? tasks.length - 1 : active;
    const from = viewIndex < 0 ? maxView : viewIndex;
    viewIndex = Math.max(0, Math.min(from + delta, maxView));
    renderTasks(lastResults);
  }

  if (prevBtn) prevBtn.addEventListener("click", () => stepView(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => stepView(1));
  if (progressEl) progressEl.addEventListener("click", (ev) => {
    const seg = ev.target.closest ? ev.target.closest("[data-seg]") : null;
    if (!seg || seg.disabled) return;
    const i = Number(seg.getAttribute("data-seg"));
    const active = activeIndex();
    const maxView = active < 0 ? tasks.length - 1 : active;
    if (!Number.isInteger(i) || i > maxView) return;
    viewIndex = i;
    renderTasks(lastResults);
  });

  if (goEl) {
    goEl.addEventListener("click", (ev) => {
      if (goEl.getAttribute("aria-disabled") === "true") ev.preventDefault();
    });
  }

  /* --- custom testcase --------------------------------------------------- */

  if (customOnEl) customOnEl.addEventListener("change", () => {
    custom.on = customOnEl.checked;
    persistCustom();
  });
  if (customInEl) customInEl.addEventListener("input", () => {
    custom.input = customInEl.value;
    if (custom.input.trim() && !custom.on) { custom.on = true; customOnEl.checked = true; }
    persistCustom();
  });
  if (customExpEl) customExpEl.addEventListener("input", () => {
    custom.expected = customExpEl.value;
    persistCustom();
  });
  customInEl.value = custom.input;
  customExpEl.value = custom.expected;

  renderTasks(null);

  /* --- editor ---------------------------------------------------------- */

  const starter = ex.starter || "";
  const saved = (() => {
    try { return localStorage.getItem(draftKey); } catch (e) { return null; }
  })();

  let editor;
  let getValue;
  let setValue;

  if (typeof window.CodeMirror === "function") {
    const cm = window.CodeMirror(editorHost, {
      value: saved != null ? saved : starter,
      mode: "python",
      theme: "lp",
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      lineWrapping: true,
      extraKeys: {
        Tab: (cmInst) => cmInst.replaceSelection("    ", "end"),
        "Ctrl-Enter": () => runBtn.click(),
        "Cmd-Enter": () => runBtn.click(),
        "Shift-Ctrl-Enter": () => { if (submitBtn) submitBtn.click(); },
        "Shift-Cmd-Enter": () => { if (submitBtn) submitBtn.click(); }
      }
    });
    cm.setSize("100%", "100%");
    editor = cm;
    getValue = () => cm.getValue();
    setValue = (v) => cm.setValue(v);
  } else {
    const ta = document.createElement("textarea");
    ta.spellcheck = false;
    ta.style.cssText =
      "width:100%;height:100%;border:0;padding:12px;font:13px/1.6 ui-monospace,Consolas,monospace;" +
      "background:#fff;color:#1c1917;resize:none;outline:none;box-sizing:border-box;";
    ta.value = saved != null ? saved : starter;
    editorHost.appendChild(ta);
    editor = ta;
    getValue = () => ta.value;
    setValue = (v) => { ta.value = v; };
  }

  /* --- draft persistence ----------------------------------------------- */
  let draftTimer = null;
  function persistDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      try {
        const v = getValue();
        if (v !== starter) localStorage.setItem(draftKey, v);
        else localStorage.removeItem(draftKey);
      } catch (e) { /* private mode */ }
    }, 500);
  }
  if (editor && typeof editor.on === "function") editor.on("change", persistDraft);
  else editorHost.addEventListener("input", persistDraft);

  /* --- result panel ----------------------------------------------------- */

  /* Everything the Result tab shows about one judge run. */
  let lastRun = null;         /* {mode, detail, results, stdout, error} */
  let selectedCase = 0;

  function fmtMs(total) {
    if (total >= 100) return Math.round(total) + " ms";
    if (total >= 10) return Math.round(total * 10) / 10 + " ms";
    return Math.round(total * 100) / 100 + " ms";
  }

  function kvRow(label, value, bad) {
    return '<div class="sp-kv' + (bad ? " is-bad" : "") + '">' +
      '<span class="tc-label">' + escHtml(label) + "</span>" +
      '<code class="sp-kv-val">' + escHtml(value) + "</code></div>";
  }

  function renderCaseBody(c) {
    const isCustom = c.task === -1;
    const bad = !c.ok && !c.error;
    let html = '<div class="sp-case-body">';
    if (isCustom) html += '<span class="sp-case-task">custom input</span>';
    else if (tasks.length) html += '<span class="sp-case-task">task ' + String(c.task + 1).padStart(2, "0") + "</span>";
    if (c.error) {
      html += '<div class="sp-kv"><span class="tc-label">Input</span>' +
        '<code class="sp-kv-val">' + escHtml(c.kind === "raw" ? c.src : c.input) + "</code></div>";
      html += '<pre class="sp-case-error"><code>' + escHtml(c.error) + "</code></pre>";
    } else {
      html += kvRow("Input", c.kind === "raw" ? c.src : c.input, false);
      html += kvRow(c.oneof ? "Output (one of these)" : "Output", c.actual == null ? "None" : c.actual, bad);
      if (c.expected != null) html += kvRow("Expected", c.expected, false);
    }
    if (c.stdout) html += '<div class="sp-case-stdout"><span class="tc-label">Stdout</span>' +
      "<pre><code>" + escHtml(c.stdout.replace(/\s+$/, "")) + "</code></pre></div>";
    html += '<span class="sp-case-ms">' + fmtMs(c.ms) + "</span>";
    html += "</div>";
    return html;
  }

  function renderResult() {
    if (!resultEl) return;
    if (!lastRun) { resultEl.hidden = true; if (emptyEl) emptyEl.hidden = false; return; }
    if (emptyEl) emptyEl.hidden = true;
    resultEl.hidden = false;

    const r = lastRun;

    /* A program-level failure (syntax error, traceback, Pyodide load):
     * no cases exist, only the error. */
    if (!r.detail) {
      const syntax = /SyntaxError|IndentationError|TabError/.test(r.error || "");
      resultEl.innerHTML =
        '<div class="sp-verdict-row"><span class="sp-verdict is-err">' +
          (syntax ? "Syntax Error" : "Runtime Error") + "</span>" +
          '<span class="sp-verdict-meta">' + escHtml(r.mode === "submit" ? "submission" : "sample run") + "</span></div>" +
        '<pre class="sp-case-error"><code>' + escHtml(r.error || "") + "</code></pre>" +
        (r.stdout ? consoleBlock(r.stdout) : "");
      return;
    }

    /* The drip guard: on a submission, cases after the first failing
     * task stay unread (their inputs would spoil the ladder ahead). */
    let shown = r.detail;
    let hiddenNote = "";
    if (r.mode === "submit" && tasks.length) {
      let firstFailTask = -1;
      for (const c of r.detail) if (!c.ok && c.task >= 0) { firstFailTask = c.task; break; }
      if (firstFailTask >= 0 && firstFailTask < tasks.length - 1) {
        shown = r.detail.filter((c) => c.task <= firstFailTask);
        hiddenNote = '<p class="sp-hidden-note small">Cases for tasks ' + (firstFailTask + 2) + "\u2013" + tasks.length +
          " stay hidden until task " + (firstFailTask + 1) + " passes.</p>";
      }
    }

    const passN = shown.filter((c) => c.ok).length;
    const anyErr = shown.some((c) => c.error);
    const allPass = passN === shown.length;
    const runtimeMs = shown.reduce((a, c) => a + (Number(c.ms) || 0), 0);

    let verdict, vClass;
    if (anyErr) { verdict = "Runtime Error"; vClass = "is-err"; }
    else if (!allPass) { verdict = "Wrong Answer"; vClass = "is-err"; }
    else if (r.mode === "submit") { verdict = "Accepted"; vClass = "is-ok"; }
    else { verdict = "Finished"; vClass = "is-ok"; }

    const tabs = shown.map((c, i) => {
      const label = c.task === -1 ? "custom" : String(i + 1);
      const mark = c.ok ? " \u2713" : " \u00D7";
      const cls = "sp-case-tab" + (c.ok ? " is-pass" : " is-fail") + (i === selectedCase ? " is-active" : "");
      return '<button class="' + cls + '" type="button" data-case="' + i + '" aria-label="Case ' + label +
        ": " + (c.ok ? "passed" : c.error ? "error" : "wrong answer") + '">' + label + mark + "</button>";
    }).join("");

    const sel = shown[Math.min(selectedCase, shown.length - 1)];
    resultEl.innerHTML =
      '<div class="sp-verdict-row">' +
        '<span class="sp-verdict ' + vClass + '">' + verdict + "</span>" +
        '<span class="sp-verdict-meta">' + passN + "/" + shown.length + " cases \u00B7 " + fmtMs(runtimeMs) +
          " \u00B7 " + (r.mode === "submit" ? "submission" : "sample run") + "</span>" +
      "</div>" +
      (shown.length
        ? '<div class="sp-case-tabs" role="tablist" aria-label="Cases">' + tabs + "</div>" +
          renderCaseBody(sel)
        : "") +
      hiddenNote +
      (r.stdout ? consoleBlock(r.stdout) : "");
  }

  function consoleBlock(stdout) {
    return '<div class="sp-console-out"><span class="tc-label">Console (print output)</span>' +
      "<pre><code>" + escHtml(stdout.replace(/\s+$/, "")) + "</code></pre></div>";
  }

  resultEl.addEventListener("click", (ev) => {
    const b = ev.target.closest ? ev.target.closest("[data-case]") : null;
    if (!b) return;
    selectedCase = Number(b.getAttribute("data-case"));
    renderResult();
  });

  /* --- the run itself ---------------------------------------------------- */

  let client = null;
  let seq = 0;

  function setStatus(text, cls) {
    statusEl.textContent = text;
    statusEl.classList.remove("is-ok", "is-err");
    if (cls) statusEl.classList.add(cls);
  }

  function startRun(mode) {
    const my = ++seq;
    const customWanted = mode === "run" && custom.on && custom.input.trim();
    if (mode === "run" && !tasks.length && !customWanted) {
      setStatus("Type a custom input in the Testcase panel first, then Run.", "is-err");
      switchTab("testcase");
      customInEl.focus();
      return;
    }
    const taskIndex = mode === "run" ? Math.max(0, viewIndex) : -1;
    if (mode === "run") {
      setStatus(
        tasks.length
          ? "Running task " + String(taskIndex + 1).padStart(2, "0") + " sample cases\u2026 (first run boots Pyodide)"
          : "Running the custom input\u2026 (first run boots Pyodide)"
      );
    } else {
      setStatus("Submitting: judging every task\u2026 (first run boots Pyodide)");
    }
    if (client) { try { client.destroy(); } catch (e) { /* noop */ } client = null; }
    previewHost.textContent = "";

    activeStageHandler = (d) => {
      if (my !== seq) return;
      if (d.stage === "boot") setStatus("Loading Python (Pyodide). First run downloads ~10 MB, cached afterwards.");
    };
    activeResultHandler = (d) => {
      if (my !== seq) return;
      activeStageHandler = null;

      if (!d.ok) {
        lastRun = { mode: mode, detail: null, error: d.error || "", stdout: d.stdout || "" };
        selectedCase = 0;
        renderResult();
        switchTab("result");
        setStatus(/SyntaxError|IndentationError|TabError/.test(d.error || "")
          ? "Syntax error in your code. See Result."
          : "Your code raised before any case ran. See Result.", "is-err");
        return;
      }

      const detail = Array.isArray(d.detail) ? d.detail : [];
      const results = Array.isArray(d.results) ? d.results : [];

      if (mode === "submit") {
        let earned = false;
        results.forEach((v, i) => {
          if (v === null && i < done.length && !done[i]) { done[i] = true; earned = true; }
        });
        if (earned) persistDone();
      }

      /* Open on the first failing case, like LeetCode. */
      const firstFail = detail.findIndex((c) => !c.ok);
      selectedCase = firstFail >= 0 ? firstFail : 0;
      lastRun = { mode: mode, detail: detail, results: results, stdout: d.stdout || "", error: "" };

      renderTasks(mode === "submit" ? results : runVerdicts(results));
      renderResult();
      switchTab("result");

      /* The status line narrates; the Result panel shows the cases. */
      if (mode === "submit") {
        const passed = done.filter(Boolean).length;
        if (tasks.length && passed === tasks.length) {
          setStatus("Accepted. All " + tasks.length + " tasks pass \u2713 Chapter marked complete.", "is-ok");
          if (typeof window.__lp60Pass === "function") window.__lp60Pass(section.id);
        } else {
          const firstFailTask = results.findIndex((v) => v !== null);
          setStatus(
            passed + " of " + tasks.length + " tasks pass. Task " + (firstFailTask + 1) + ": " +
              results[firstFailTask] + ". See Result.",
            "is-err"
          );
        }
      } else {
        const shownPass = detail.filter((c) => c.ok).length;
        if (!detail.length) {
          setStatus("No cases ran. Check the custom input and try again.", "is-err");
        } else if (shownPass === detail.length) {
          const customOnly = detail.length === 1 && detail[0].task === -1;
          setStatus(customOnly
            ? "Custom input finished. See Result for what it returned."
            : "Sample cases pass\u2014Submit to check every task.", "is-ok");
        } else {
          const firstBad = detail.findIndex((c) => !c.ok);
          setStatus("Case " + (firstBad + 1) + (detail[firstBad].task === -1 ? " (custom)" : "") +
            ": " + (detail[firstBad].error ? detail[firstBad].error.split(":", 1)[0] : "wrong answer") +
            ". See Result.", "is-err");
        }
      }
    };

    (async () => {
      try {
        const factory = await loadClientFactory();
        if (my !== seq) return;
        const program = mode === "run"
          ? composeProgram(getValue(), tasks, {
              mode: "run",
              taskIndex: taskIndex,
              custom: customWanted ? { input: custom.input, expected: custom.expected } : null
            })
          : composeProgram(getValue(), tasks);
        const files = {
          "/main.py": { code: program },
          "/index.html": { code: buildRunnerShell(program) }
        };
        const iframe = document.createElement("iframe");
        iframe.title = "Python preview";
        iframe.style.cssText = "width:1px;height:1px;border:0;display:block;";
        previewHost.appendChild(iframe);
        const c = await factory(
          iframe,
          { files: files, template: "static", entry: "/index.html" },
          { showOpenInCodeSandbox: false, showSandpackErrorScreen: true }
        );
        if (my !== seq) { try { c.destroy(); } catch (e) { /* noop */ } return; }
        client = c;
      } catch (e) {
        if (my !== seq) return;
        setStatus("Could not load Sandpack (" + (e && e.message ? e.message : e) + "). Check your connection.", "is-err");
      }
    })();
  }

  /* Run keeps its own per-task verdict list: the judged task's reason (or
   * null) in its slot, null everywhere else, so the rail can flag the one
   * task that was just sampled without crediting anything. */
  function runVerdicts(results) {
    const v = tasks.map(() => null);
    if (viewIndex >= 0 && viewIndex < v.length && Array.isArray(results) && results[viewIndex] != null) {
      v[viewIndex] = results[viewIndex];
    }
    return v;
  }

  runBtn.addEventListener("click", () => startRun("run"));
  if (submitBtn) submitBtn.addEventListener("click", () => startRun("submit"));
  resetBtn.addEventListener("click", () => {
    setValue(starter);
    try { localStorage.removeItem(draftKey); } catch (e) { /* noop */ }
    setStatus("Code reset to the starter.");
    if (editor && editor.refresh) editor.refresh();
  });

  return { run: () => startRun("run"), getEditor: () => editor };
}
