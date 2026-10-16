/* js/data/figures.js - the diagrams for "Medium in 60".
 *
 * One figure per chapter, drawn inline as SVG in the page's own language:
 * monochrome ink on opacity steps, mono labels, hairline strokes. The CSS
 * classes live in styles.css (.fig, .st, .f5, .txd ...). Everything here is
 * a plain string, so qa.mjs and the app can both import it as data.
 */

const E = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const fig = (vb, cap, inner) =>
  '<figure class="fig"><svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
  inner + "</svg><figcaption>" + cap + "</figcaption></figure>";

/* Arrowhead marker. One figure is on screen at a time, so one id is enough. */
const AR =
  '<defs><marker id="ar" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
  '<path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs>';

/* text: anchor "m" (middle, default), "s" (start), "e" (end) */
const t = (x, y, s, mods, a) =>
  '<text x="' + x + '" y="' + y + '"' + (mods ? ' class="' + mods + '"' : "") +
  ' text-anchor="' + (a === "s" ? "start" : a === "e" ? "end" : "middle") +
  '" dominant-baseline="central">' + E(s) + "</text>";

const box = (x, y, w, h, s, mods) =>
  '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" class="st' +
  (mods ? " " + mods : "") + '"/>' +
  (s == null ? "" : t(x + w / 2, y + h / 2 + 0.5, s));

const node = (cx, cy, s) =>
  '<circle cx="' + cx + '" cy="' + cy + '" r="15" class="st f2"/>' + t(cx, cy + 0.5, s);

const ln = (x1, y1, x2, y2, mods) =>
  '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (mods || "st-d") + '"/>';

const ar = (x1, y1, x2, y2, mods) =>
  '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (mods || "st-k") +
  '" marker-end="url(#ar)"/>';

const pa = (d, mods) =>
  '<path d="' + d + '" class="' + (mods || "st-k") + '" marker-end="url(#ar)"/>';

const dot = (cx, cy, r) =>
  '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r || 2.5) + '" class="dot"/>';

/* a row of cells: items is an array of labels, mods(i) may vary the class */
const row = (x0, y, w, h, g, items, mods) =>
  items.map((s, i) => box(x0 + i * (w + g), y, w, h, s, mods ? mods(i) : "")).join("");

export const FIG = {

  /* python-core: the four containers */
  containers: fig("0 0 640 152",
    "Pick by the question: order, keys, membership, or a frozen pair.",
    [0, 163, 326, 489].map((x, i) => {
      const names = ["list", "dict", "set", "tuple"];
      const notes = ["ordered, resizable", "key to value, O(1)", "membership only", "frozen, hashable"];
      let inner = box(x, 6, 148, 92, null, "f2") + t(x + 74, 24, names[i], "txd txs");
      if (i === 0) {
        inner += [0, 1, 2].map((j) => box(x + 22 + j * 35, 44, 34, 26, String(j + 1))).join("");
      } else if (i === 1) {
        inner += box(x + 18, 46, 40, 24, "a") + ar(x + 62, 58, x + 88, 58) + box(x + 92, 46, 40, 24, "1", "f5");
      } else if (i === 2) {
        inner += '<rect x="' + (x + 20) + '" y="42" width="108" height="36" rx="9" class="st-d dsh"/>' +
          box(x + 28, 48, 36, 24, "7") + box(x + 84, 48, 36, 24, "4");
      } else {
        inner += t(x + 74, 58, "(r, c)");
      }
      return inner + t(x + 74, 140, notes[i], "txd txs");
    }).join("") + AR),

  /* stdlib: need -> import */
  toolbox: fig("0 0 640 236",
    "Six needs, six imports; the rest of this page is built from them.",
    AR + [
      ["count items and group them", "Counter + defaultdict"],
      ["reorder anything by a key", "sorted(xs, key=...)"],
      ["keep the best k", "heapq + nlargest"],
      ["an insert point in sorted data", "bisect_left"],
      ["generate every candidate", "itertools + product"],
      ["memoize a recursion", "lru_cache"]
    ].map(([need, mod], i) => {
      const y = 24 + i * 38;
      return t(4, y, need, "txd txs", "s") + ar(268, y, 302, y) + box(310, y - 13, 320, 26, mod);
    }).join("")),

  /* idioms: alias vs copy */
  alias: fig("0 0 640 180",
    "b = a gives one list two names; a[:] builds a second list.",
    AR
    + box(10, 6, 300, 168, null, "f2")
    + box(330, 6, 300, 168, null, "f2")
    + t(160, 28, "b = a", "txd txs")
    + t(52, 64, "a") + ar(66, 64, 118, 64)
    + t(52, 104, "b") + ar(66, 104, 118, 88)
    + box(126, 46, 150, 66, "[1, 2, 3]", "f5")
    + t(480, 28, "c = a[:]", "txd txs")
    + t(372, 56, "a") + ar(386, 56, 420, 56)
    + t(372, 122, "b") + ar(386, 122, 420, 122)
    + box(426, 42, 150, 30, "[1, 2, 3]", "f5")
    + box(426, 108, 150, 30, "[1, 2, 3]", "f5")),

  /* hashing: one probe instead of a walk */
  probe: fig("0 0 640 172",
    "A seen set replaces the walk with one probe.",
    AR
    + t(8, 56, "list scan:", "txd txs", "s")
    + row(84, 40, 64, 32, 4, ["3", "1", "4", "1", "5", "9", "2"], (i) => (i === 5 ? "f5 st-k" : ""))
    + ar(84, 86, 552, 86, "st-d")
    + t(316, 104, "up to n steps, one per cell", "txd txs")
    + t(8, 136, "dict probe:", "txd txs", "s")
    + box(120, 121, 52, 30, "k")
    + ar(176, 136, 250, 136)
    + box(256, 119, 66, 34, "9", "f5 st-k")
    + t(334, 136, "one lookup, hash the key", "txd txs", "s")),

  /* two-pointers: converge and discard */
  converge: fig("0 0 640 160",
    "Too small, advance left; too big, retreat right. One candidate leaves per step.",
    AR
    + t(200, 20, "sum too small", "txd txs")
    + ar(160, 32, 240, 32)
    + t(440, 20, "sum too big", "txd txs")
    + ar(480, 32, 400, 32)
    + row(113, 50, 64, 40, 6, ["1", "3", "5", "7", "9", "11"], undefined)
    + t(140, 136, "left")
    + ar(141, 126, 141, 94)
    + t(500, 136, "right")
    + ar(500, 126, 500, 94)),

  /* sliding-window: the window moves past the duplicate */
  window: fig("0 0 640 200",
    "Each element enters once and leaves once; left jumps past the duplicate.",
    AR
    + row(75, 28, 56, 34, 6, ["a", "b", "c", "a", "b", "c", "b", "b"], undefined)
    + ln(75, 68, 75, 80, "st-k") + ln(75, 80, 261, 80, "st-k") + ln(261, 68, 261, 80, "st-k")
    + t(75, 94, "left", "txd txs") + t(261, 94, "right", "txd txs")
    + row(75, 118, 56, 34, 6, ["a", "b", "c", "a", "b", "c", "b", "b"], (i) => (i === 3 ? "f5 st-k" : ""))
    + ln(137, 156, 137, 168, "st-k") + ln(137, 168, 379, 168, "st-k") + ln(379, 156, 379, 168, "st-k")
    + t(137, 182, "left", "txd txs") + t(379, 182, "right", "txd txs")
    + t(440, 104, "left = last[a] + 1", "txd txs")),

  /* binary-search: three probes, each keeps a half */
  halving: fig("0 0 640 210",
    "log m probes; each one keeps the feasible half.",
    AR
    + t(288, 20, "mid = 4: first probe", "txd txs")
    + row(66, 36, 60, 32, 4, ["1", "2", "3", "4", "5", "6", "7", "8"], (i) => (i === 3 ? "f5 st-k" : ""))
    + t(288, 80, "feasible: hi = mid", "txd txs")
    + row(66, 96, 60, 32, 4, ["1", "2", "3", "4", "5", "6", "7", "8"], (i) => (i < 4 ? (i === 1 ? "f5 st-k" : "") : "st-d"))
    + t(288, 140, "too slow: lo = mid + 1", "txd txs")
    + row(66, 156, 60, 32, 4, ["1", "2", "3", "4", "5", "6", "7", "8"], (i) => (i < 2 ? (i === 0 ? "f5 st-k" : "") : "st-d"))
    + t(288, 202, "lo = hi: the smallest feasible speed", "txd txs")),

  /* linked-lists: split, reverse, weave */
  reorder: fig("0 0 640 250",
    "Split with slow and fast, reverse the back half, then weave.",
    AR
    + t(8, 44, "split", "txd txs", "s")
    + node(130, 44, "A") + node(220, 44, "B") + node(310, 44, "C") + node(400, 44, "D")
    + ar(147, 44, 203, 44) + ar(237, 44, 293, 44) + ar(327, 44, 383, 44)
    + ln(265, 16, 265, 72, "st-d dsh")
    + t(352, 16, "slow stops here", "txd txs")
    + t(8, 130, "reverse", "txd txs", "s")
    + node(310, 130, "D") + node(400, 130, "C") + ar(327, 130, 383, 130)
    + t(8, 210, "weave", "txd txs", "s")
    + node(130, 210, "A") + node(220, 210, "D") + node(310, 210, "B") + node(400, 210, "C")
    + ar(147, 210, 203, 210) + ar(237, 210, 293, 210) + ar(327, 210, 383, 210)),

  /* stacks: pending days on a decreasing stack */
  temps: fig("0 0 640 240",
    "The stack holds pending days; a warmer day pops it and writes the gap.",
    AR
    + t(320, 14, "today: 76 at index 6", "txd txs")
    + row(114, 30, 48, 30, 4, ["73", "74", "75", "71", "69", "72", "76", "73"], (i) => (i === 6 ? "f5 st-k" : ""))
    + pa("M 450 62 C 380 92, 160 76, 94 68")
    + ["72", "69", "71", "75", "74"].map((v, i) => box(28, 56 + i * 26, 64, 24, v, "st-d dsh")).join("")
    + box(28, 186, 64, 24, "73", "st-k f5")
    + t(340, 112, "pop while temps[top] < 76: each popped index gets answer i - j", "txd txs")),

  /* trees: the same seven nodes, two visit orders */
  walks: fig("0 0 640 250",
    "Same seven nodes, two orders: down before across, or one level at a time.",
    ln(155, 55, 105, 95) + ln(155, 55, 205, 95)
    + ln(105, 125, 75, 165) + ln(105, 125, 135, 165)
    + ln(205, 125, 175, 165) + ln(205, 125, 235, 165)
    + node(155, 40, "1") + node(105, 110, "2") + node(205, 110, "3")
    + node(75, 180, "4") + node(135, 180, "5") + node(175, 180, "6") + node(235, 180, "7")
    + ln(485, 55, 435, 95) + ln(485, 55, 535, 95)
    + ln(435, 125, 405, 165) + ln(435, 125, 465, 165)
    + ln(535, 125, 505, 165) + ln(535, 125, 565, 165)
    + node(485, 40, "1") + node(435, 110, "2") + node(535, 110, "3")
    + node(405, 180, "4") + node(465, 180, "5") + node(505, 180, "6") + node(565, 180, "7")
    + t(155, 232, "depth first: down before across", "txd txs")
    + t(485, 232, "breadth first: level by level", "txd txs")),

  /* graphs: BFS distance rings on a grid */
  rings: fig("0 0 640 216",
    "Numbers are BFS distance from the source; every cell is a node with four edges.",
    [0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5].map((c) => {
      const d = Math.abs(c - 2) + Math.abs(r - 1);
      const mods = d === 0 ? "f5 st-k" : d === 1 ? "f5" : "";
      return box(188 + c * 44, 16 + r * 44, 44, 44, String(d), mods);
    }).join("")).join("")
    + t(560, 96, "four edges", "txd txs")
    + t(560, 116, "per cell", "txd txs")),

  /* backtracking: the same three lines at every node */
  backtrack: fig("0 0 640 210",
    "Every branch runs the same three lines; returning restores the state.",
    AR
    + box(230, 16, 180, 44, "recurse")
    + box(70, 146, 180, 44, "append the choice")
    + box(390, 146, 180, 44, "pop it back")
    + pa("M 246 60 C 205 96, 178 112, 165 142")
    + pa("M 250 168 C 300 196, 340 196, 390 168")
    + pa("M 554 146 C 566 100, 480 52, 414 44")),

  /* heaps: tree and array are one list */
  heap: fig("0 0 640 260",
    "Tree order and array order are the same heap; children of i sit at 2i+1 and 2i+2.",
    ln(320, 57, 240, 97) + ln(320, 57, 400, 97)
    + ln(240, 127, 200, 167) + ln(240, 127, 280, 167)
    + ln(400, 127, 360, 167) + ln(400, 127, 440, 167)
    + node(320, 42, "1") + node(240, 112, "2") + node(400, 112, "7")
    + node(200, 182, "4") + node(280, 182, "9") + node(360, 182, "8") + node(440, 182, "5")
    + row(112, 210, 56, 30, 4, ["1", "2", "7", "4", "9", "8", "5"], undefined)
    + t(320, 252, "children of i: 2i+1 and 2i+2", "txd txs")),

  /* intervals: bars merge in one sorted sweep */
  merge: fig("0 0 640 206",
    "Sorted by start, overlapping bars combine in one sweep.",
    [["[1, 3]", 1, 3, 24], ["[2, 6]", 2, 6, 50], ["[8, 10]", 8, 10, 76], ["[15, 18]", 15, 18, 102]]
      .map(([lab, a, b, y]) => t(54, y + 10, lab, "txd txs", "e") + box(60 + a * 30, y, (b - a) * 30, 20, null, "f5")).join("")
    + ln(8, 136, 632, 136, "st-d dsh")
    + t(320, 152, "one pass, sorted by start", "txd txs")
    + box(90, 168, 150, 20, null, "st-k f5")
    + box(300, 168, 60, 20, null, "st-k f5")
    + box(510, 168, 90, 20, null, "st-k f5")),

  /* dp-1d: ways(n) reads two steps back */
  stairs: fig("0 0 640 215",
    "ways(n) reads only n-1 and n-2; those two values are all you keep.",
    ["1", "1", "2", "3", "5", "8"].map((v, i) => {
      const x = 100 + i * 84, top = 170 - i * 26;
      return box(x, top, 72, 196 - top, null, "f2") + t(x + 36, top + 14, v) + t(x + 36, 208, "n=" + i, "txd txs");
    }).join("")
    + AR
    + pa("M 424 84 C 430 76, 438 72, 446 68")
    + pa("M 340 108 C 380 90, 420 78, 448 70")
    + t(430, 82, "n-1", "txd txs", "e")
    + t(332, 102, "n-2", "txd txs", "e")),

  /* dp-2d: the filled table and one rolling row */
  grid: fig("0 0 640 216",
    "Every cell sums its top and left neighbors; one rolling row is enough.",
    AR
    + [[1, 1, 1, 1], [1, 2, 3, 4], [1, 3, 6, 10]].map((rvals, r) => rvals.map((v, c) => {
      const mods = (r === 2 && c === 2) ? "f5 st-k" : (r === 0 || c === 0) ? "f2" : "";
      return box(192 + c * 64, 34 + r * 48, 64, 48, String(v), mods);
    }).join("")).join("")
    + ar(352, 108, 352, 128)
    + ar(292, 154, 316, 154)
    + t(452, 154, "top + left", "txd txs", "s")),

  /* final: every center of the string */
  centers: fig("0 0 640 180",
    "2n - 1 centers, one per index and one per gap; expand while the ends match.",
    AR
    + row(168, 46, 56, 40, 6, ["b", "a", "b", "a", "d"], undefined)
    + [196, 258, 320, 382, 444].map((x) => dot(x, 100)).join("")
    + [227, 289, 351, 413].map((x) => dot(x, 106)).join("")
    + ar(314, 104, 270, 104, "st-k dsh")
    + ar(326, 104, 376, 104, "st-k dsh")
    + t(320, 130, "odd and even centers", "txd txs")
    + t(320, 152, "expand out, keep the longest", "txd txs"))
};
