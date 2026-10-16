/* js/sandpack.js - Sandpack + Pyodide exercise component for "Medium in 60".
 *
 * Each practice exercise renders the SQLBolt shape in this site's language:
 * a toolbar (Run / Reset / status), the editor with its output below it in
 * the work column, and a numbered task rail on the right. Running appends
 * the hidden checks (js/checks.js) to the user's code, executes it in
 * Pyodide inside a Sandpack preview, and posts one verdict per task back;
 * the rail turns each passed task into a checked line and unlocks the
 * continue pill when the whole list is green.
 */

import { composeProgram, RESULT_PROBE } from "./checks.js";

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

/* The runner lives inside the Sandpack preview iframe. Kept ES5 + string
 * concatenation only: this function is serialized with Function.prototype
 * .toString and injected as the iframe's script. No template literals. */
function __lp60Runner() {
  var out = document.getElementById("out");
  var status = document.getElementById("status");
  function say(t) { out.textContent += t; }
  function report(ok, results, msg) {
    var all = ok && results && results.length > 0;
    if (all) {
      for (var i = 0; i < results.length; i++) {
        if (results[i] !== null) { all = false; break; }
      }
    }
    if (ok) {
      status.className = all ? "ok" : "";
      status.textContent = all
        ? "All tasks passed."
        : "Finished. Some tasks still fail; the page shows which.";
    } else {
      status.className = "err";
      status.textContent = "Error: " + msg;
    }
    try {
      parent.postMessage(
        { type: "LP60_RESULT", ok: ok, results: results || null, error: msg || "" },
        "*"
      );
    } catch (e) { /* sandboxed */ }
  }
  window.onerror = function (m) { report(false, null, String(m)); return true; };

  var code = document.getElementById("py-src").textContent;

  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.js";
  s.onerror = function () {
    report(false, null, "could not load Pyodide from the CDN (offline?)");
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
        /* Read the per-task verdict list the harness left behind. */
        var results = null;
        try {
          results = JSON.parse(pyRuntime.runPython("__import__('json').dumps(__lp60_results__)"));
        } catch (e) { results = null; }
        if (!results) { report(false, null, "the checks did not report a verdict"); return; }
        report(true, results, "");
      })
      .catch(function (e) {
        var msg = String((e && e.message) || e);
        var lines = msg.replace(/\s+$/, "").split("\n");
        report(false, null, lines.slice(-6).join("\n"));
      });
  };
  document.body.appendChild(s);
}

function buildRunnerShell(program) {
  const py = String(program).replace(/<\/script/gi, "<\\/script");
  const css = [
    "*{box-sizing:border-box;}",
    "html,body{margin:0;padding:16px;background:#fff;color:#000;",
    "font:13px/1.65 ui-monospace,'Cascadia Mono',Consolas,monospace;}",
    "#status{margin:0 0 12px;padding:12px 14px;background:rgba(0,0,0,.02);",
    "border-radius:16px;color:rgba(0,0,0,.5);white-space:pre-wrap;}",
    "#status.ok{background:rgba(0,0,0,.05);color:#000;}",
    "#status.err{color:#B3261E;white-space:pre-wrap;}",
    "#out{margin:0;white-space:pre-wrap;word-break:break-word;}"
  ].join("");
  return [
    '<!DOCTYPE html><html><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<style>" + css + "</style></head><body>",
    '<p id="status">Loading Python (Pyodide). First run downloads ~10 MB, cached afterwards.</p>',
    '<pre id="out"></pre>',
    '<script type="text/x-python" id="py-src">' + py + "<\/script>",
    "<script>(" + __lp60Runner.toString() + ")();<\/script>",
    "</body></html>"
  ].join("");
}

/* One global result listener; the active mount registers a handler. */
let activeResultHandler = null;
window.addEventListener("message", (ev) => {
  const d = ev && ev.data;
  if (d && d.type === "LP60_RESULT" && typeof activeResultHandler === "function") {
    activeResultHandler(d);
  }
});

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function mountExercise(container, section, opts) {
  const ex = section.exercise;
  const options = opts || {};
  const draftKey = "lp60.code." + section.id;
  const doneKey = "lp60.tasks." + section.id;
  const tasks = Array.isArray(ex.tasks) ? ex.tasks : [];
  const done = tasks.map(() => false);

  /* Restore task checks earned in earlier visits. */
  try {
    const saved = JSON.parse(localStorage.getItem(doneKey) || "null");
    if (Array.isArray(saved)) saved.forEach((v, i) => { if (i < done.length) done[i] = !!v; });
  } catch (e) { /* private mode */ }

  function persistDone() {
    try { localStorage.setItem(doneKey, JSON.stringify(done.map((v) => (v ? 1 : 0)))); }
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
      '<button class="pill pill-dark pill-sm sp-run" type="button">Run \u25B8</button>' +
      '<button class="pill pill-light pill-sm sp-reset" type="button">Reset code</button>' +
      '<span class="sp-status" data-sp-status>Press Run. Python executes right here, in a Sandpack preview.</span>' +
    "</div>" +
    '<div class="sp-main' + (tasks.length ? "" : " sp-solo") + '">' +
      '<div class="sp-work">' +
        '<div class="sp-editor-wrap" data-sp-editor></div>' +
        '<div class="sp-out">' +
          '<div class="sp-out-head"><span class="label">Output</span></div>' +
          '<div class="sp-preview-wrap" data-sp-preview></div>' +
        "</div>" +
      "</div>" +
      (tasks.length
        ? '<aside class="sp-tasks" data-sp-tasks aria-label="Exercise tasks">' +
            '<div class="sp-tasks-head">' +
              '<span class="label">Tasks</span>' +
              '<span class="sp-tasks-count" data-sp-count>0/' + tasks.length + "</span>" +
            "</div>" +
            '<ol class="task-list" data-sp-list></ol>' +
            '<details class="task-help">' +
              '<summary>Stuck? Read this task\'s solution.</summary>' +
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
  const resetBtn = container.querySelector(".sp-reset");
  const listEl = container.querySelector("[data-sp-list]");
  const countEl = container.querySelector("[data-sp-count]");
  const helpEl = container.querySelector("[data-sp-help]");
  const helpWrap = container.querySelector(".task-help");
  const goEl = container.querySelector("[data-sp-go]");

  /* --- task rail ------------------------------------------------------- */

  function activeIndex() {
    for (let i = 0; i < done.length; i++) if (!done[i]) return i;
    return -1;
  }

  function renderTasks(latest) {
    const active = activeIndex();
    const passed = done.filter(Boolean).length;

    if (listEl) {
      listEl.innerHTML = tasks.map((t, i) => {
        const isDone = done[i];
        const cls = "task" + (isDone ? " is-done" : "") + (i === active ? " is-active" : "");
        const failedNow = latest && latest[i] !== null && !isDone;
        return '<li class="' + cls + '" data-task="' + i + '">' +
          '<span class="task-num">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="task-text">' + (t.text || "") +
            (failedNow ? '<span class="task-error">' + escHtml(latest[i]) + "</span>" : "") +
          "</span>" +
          '<span class="task-check"' + (isDone ? ' role="img" aria-label="passed"' : ' aria-hidden="true"') + ">" +
            (isDone ? "\u2713" : "") +
          "</span>" +
        "</li>";
      }).join("");
    }

    if (countEl) countEl.textContent = passed + "/" + tasks.length;

    if (helpEl && helpWrap) {
      if (active < 0) {
        helpWrap.querySelector("summary").textContent = "All tasks pass.";
        helpEl.innerHTML = "";
        helpWrap.removeAttribute("open");
      } else {
        helpWrap.querySelector("summary").textContent = "Stuck? Read this task\u2019s solution.";
        helpEl.innerHTML =
          '<span class="label">Task ' + String(active + 1).padStart(2, "0") + " expects</span>" +
          '<pre class="task-help-code"><code>' + escHtml(tasks[active].test) + "</code></pre>";
      }
    }

    if (goEl) {
      const unlocked = tasks.length > 0 && passed === tasks.length;
      goEl.classList.toggle("pill-dark", unlocked);
      goEl.classList.toggle("pill-light", !unlocked);
      if (unlocked) goEl.removeAttribute("aria-disabled");
      else goEl.setAttribute("aria-disabled", "true");
    }
  }

  if (goEl) {
    goEl.addEventListener("click", (ev) => {
      if (goEl.getAttribute("aria-disabled") === "true") ev.preventDefault();
    });
  }

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
        "Cmd-Enter": () => runBtn.click()
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

  /* --- sandpack run ----------------------------------------------------- */

  let client = null;
  let seq = 0;

  function setStatus(text, cls) {
    statusEl.textContent = text;
    statusEl.classList.remove("is-ok", "is-err");
    if (cls) statusEl.classList.add(cls);
  }

  function run() {
    const my = ++seq;
    setStatus("Booting Python in the preview\u2026 (first run fetches Pyodide)");
    renderTasks(null);
    if (client) { try { client.destroy(); } catch (e) { /* noop */ } client = null; }
    previewHost.textContent = "";

    activeResultHandler = (d) => {
      if (my !== seq) return;
      if (!d.ok) {
        setStatus("Error. See the traceback in the output.", "is-err");
        return;
      }
      const results = Array.isArray(d.results) ? d.results : [];
      let earned = false;
      results.forEach((v, i) => {
        if (v === null && i < done.length && !done[i]) { done[i] = true; earned = true; }
      });
      if (earned) persistDone();
      renderTasks(results);

      if (!results.length) {
        setStatus("Finished, but no verdict came back from the checks. Press Run to try again.", "is-err");
        return;
      }

      const passed = done.filter(Boolean).length;
      if (tasks.length && passed === tasks.length) {
        setStatus("All " + tasks.length + " tasks pass \u2713 Chapter marked complete.", "is-ok");
        if (typeof window.__lp60Pass === "function") window.__lp60Pass(section.id);
      } else {
        const firstFail = results.findIndex((v) => v !== null);
        const errName = firstFail >= 0 ? results[firstFail] : "";
        setStatus(
          passed + " of " + tasks.length + " tasks pass. Task " + (firstFail + 1) + " fails" +
          (errName ? " (" + errName + ")" : "") + "; see the output.",
          "is-err"
        );
      }
    };

    (async () => {
      try {
        const factory = await loadClientFactory();
        if (my !== seq) return;
        const program = composeProgram(getValue(), tasks);
        const files = {
          "/main.py": { code: program },
          "/index.html": { code: buildRunnerShell(program) }
        };
        const iframe = document.createElement("iframe");
        iframe.title = "Python preview";
        iframe.style.cssText = "width:100%;height:100%;border:0;display:block;background:#fff;";
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

  runBtn.addEventListener("click", run);
  resetBtn.addEventListener("click", () => {
    setValue(starter);
    try { localStorage.removeItem(draftKey); } catch (e) { /* noop */ }
    setStatus("Code reset to the starter. Press Run.");
    if (editor && editor.refresh) editor.refresh();
  });

  return { run, getEditor: () => editor };
}
