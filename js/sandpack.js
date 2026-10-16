/* js/sandpack.js - Sandpack + Pyodide exercise component for "Medium in 60".
 *
 * Each exercise renders: toolbar (Run / Reset / status) + a CodeMirror editor
 * + a Sandpack (static-client) preview. The preview boots a tiny static
 * page that loads Pyodide from the CDN and executes the user's Python with
 * stdout/stderr captured. Results are posted back via window.postMessage.
 */

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
  function report(ok, passed, msg) {
    if (ok) {
      status.className = "ok";
      status.textContent = passed
        ? "All tests passed."
        : "Finished, but not all tests passed yet. Output above.";
    } else {
      status.className = "err";
      status.textContent = "Error: " + msg;
    }
    try {
      parent.postMessage({ type: "LP60_RESULT", ok: ok, passed: !!passed }, "*");
    } catch (e) { /* sandboxed */ }
  }
  window.onerror = function (m) { report(false, false, String(m)); return true; };

  var code = document.getElementById("py-src").textContent;

  var s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.js";
  s.onerror = function () {
    report(false, false, "could not load Pyodide from the CDN (offline?)");
  };
  s.onload = function () {
    loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/" })
      .then(function (py) {
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
        var passed = out.textContent.indexOf("All tests passed!") !== -1;
        report(true, passed, "");
      })
      .catch(function (e) {
        var msg = String((e && e.message) || e);
        var lines = msg.replace(/\s+$/, "").split("\n");
        report(false, false, lines.slice(-6).join("\n"));
      });
  };
  document.body.appendChild(s);
}

function buildRunnerShell(pythonCode) {
  const py = String(pythonCode).replace(/<\/script/gi, "<\\/script");
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

export function mountExercise(container, section) {
  const ex = section.exercise;
  const draftKey = "lp60.code." + section.id;

  container.classList.add("sp");
  container.innerHTML =
    '<div class="sp-toolbar">' +
      '<button class="pill pill-dark pill-sm sp-run" type="button">Run \u25B8</button>' +
      '<button class="pill pill-light pill-sm sp-reset" type="button">Reset code</button>' +
      '<span class="sp-status" data-sp-status>Press Run. Python executes right here, in a Sandpack preview.</span>' +
    "</div>" +
    '<div class="sp-main">' +
      '<div class="sp-editor-wrap" data-sp-editor style="height:360px"></div>' +
      '<div class="sp-preview-wrap" data-sp-preview style="height:360px"></div>' +
    "</div>";

  const editorHost = container.querySelector("[data-sp-editor]");
  const previewHost = container.querySelector("[data-sp-preview]");
  const statusEl = container.querySelector("[data-sp-status]");
  const runBtn = container.querySelector(".sp-run");
  const resetBtn = container.querySelector(".sp-reset");

  const starter = ex.starter || "";
  const saved = (() => {
    try { return localStorage.getItem(draftKey); } catch (e) { return null; }
  })();

  /* --- editor --- */
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

  /* --- draft persistence --- */
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

  /* --- sandpack run --- */
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
    if (client) { try { client.destroy(); } catch (e) { /* noop */ } client = null; }
    previewHost.textContent = "";

    activeResultHandler = (d) => {
      if (my !== seq) return;
      if (d.ok && d.passed) setStatus("All tests passed \u2713 Chapter marked complete.", "is-ok");
      else if (d.ok) setStatus("Finished. Some tests still failing; see the preview output.", "is-err");
      else setStatus("Error. See the traceback in the preview.", "is-err");
      if (d.ok && d.passed && typeof window.__lp60Pass === "function") {
        window.__lp60Pass(section.id);
      }
    };

    (async () => {
      try {
        const factory = await loadClientFactory();
        if (my !== seq) return;
        const files = {
          "/main.py": { code: getValue() },
          "/index.html": { code: buildRunnerShell(getValue()) }
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
