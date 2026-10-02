/* ============================================================
 * main.js — interactive recreations of the paper figures
 * Vanilla JS + inline SVG, no dependencies.
 * ============================================================ */

const SVGNS = "http://www.w3.org/2000/svg";
function el(name, attrs = {}, parent = null) {
  const n = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}
function html(tag, cls, parent, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  if (parent) parent.appendChild(n);
  return n;
}

/* ---------------- tooltip ---------------- */
const tooltip = document.getElementById("tooltip");
function showTip(evt, htmlStr) {
  tooltip.innerHTML = htmlStr;
  tooltip.hidden = false;
  moveTip(evt);
}
function moveTip(evt) {
  const pad = 14;
  let x = evt.clientX + pad, y = evt.clientY + pad;
  const r = tooltip.getBoundingClientRect();
  if (x + r.width > window.innerWidth - 8) x = evt.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 8) y = evt.clientY - r.height - pad;
  x = Math.max(8, Math.min(x, window.innerWidth - r.width - 8));
  y = Math.max(8, Math.min(y, window.innerHeight - r.height - 8));
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}
function showTipAt(target, htmlStr) {
  const r = target.getBoundingClientRect();
  tooltip.innerHTML = htmlStr;
  tooltip.hidden = false;
  tooltip.style.left = "0px"; tooltip.style.top = "0px";
  const tr = tooltip.getBoundingClientRect();
  const x = Math.max(8, Math.min(r.right + 10, window.innerWidth - tr.width - 8));
  const y = Math.max(8, Math.min(r.top - 10, window.innerHeight - tr.height - 8));
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}
function hideTip() { tooltip.hidden = true; }
document.addEventListener("keydown", ev => { if (ev.key === "Escape") hideTip(); });

/* ============================================================
 * FIG 1a — scatter: skill benefit vs base capability
 * Three clickable tier zones (weak / medium / strong).
 * ============================================================ */
(function fig1a() {
  const W = 520, H = 400, M = { l: 56, r: 20, t: 18, b: 52 };
  const iw = W - M.l - M.r, ih = H - M.t - M.b;
  const xmin = 14, xmax = 70, ymin = -14, ymax = 34;
  const X = v => M.l + (v - xmin) / (xmax - xmin) * iw;
  const Y = v => M.t + (ymax - v) / (ymax - ymin) * ih;

  const root = document.getElementById("fig1a");
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "group",
    "aria-label": "Scatter plot of skill benefit versus base capability for seven models in three tiers; tier regions are clickable" }, root);

  // tier zones (rounded blobs behind clusters), clickable
  const zones = [
    { tier: "weak",   cx: (X(22) + X(42.4)) / 2, cy: (Y(-9) + Y(3.5)) / 2, rx: 118, ry: 62, rot: -14 },
    { tier: "mid",    cx: (X(39.5) + X(50.3)) / 2, cy: Y(24.05), rx: 78, ry: 44, rot: 0 },
    { tier: "strong", cx: (X(57.8) + X(60.3)) / 2, cy: Y(26.9), rx: 62, ry: 44, rot: 0 },
  ];
  const detail = document.getElementById("tier-detail");
  let activeZone = null;
  const zoneActivators = {};

  zones.forEach(z => {
    const p = PALETTE.tiers[z.tier];
    const e = el("ellipse", {
      cx: z.cx, cy: z.cy, rx: z.rx, ry: z.ry,
      transform: `rotate(${z.rot} ${z.cx} ${z.cy})`,
      fill: p.wash, opacity: 0.42, stroke: p.ink, "stroke-opacity": 0,
      class: "tier-zone", tabindex: 0, role: "button", "aria-expanded": "false",
      "aria-controls": "tier-detail",
      "aria-label": `${TIER_INFO[z.tier].name} tier — click for details`,
    }, svg);
    const activate = () => {
      svg.querySelectorAll(".tier-zone").forEach(q => {
        q.classList.remove("active"); q.setAttribute("stroke-opacity", 0);
        q.setAttribute("aria-expanded", "false");
      });
      if (activeZone === z.tier) {
        activeZone = null; detail.hidden = true; return;
      }
      activeZone = z.tier;
      e.classList.add("active");
      e.setAttribute("stroke-opacity", 0.9);
      e.setAttribute("aria-expanded", "true");
      const info = TIER_INFO[z.tier];
      detail.hidden = false;
      detail.style.borderLeftColor = p.ink;
      detail.style.background = PALETTE.tiers[z.tier].bg;
      detail.innerHTML = `<h4 style="color:${p.ink}">${info.name} — ${info.headline}</h4>
        <p>${info.body}</p>
        <div class="tier-models">Models: ${info.models.join(" · ")}</div>`;
    };
    e.addEventListener("click", activate);
    e.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); activate(); } });
    zoneActivators[z.tier] = activate;
  });

  // zero line
  el("line", { x1: M.l, x2: W - M.r, y1: Y(0), y2: Y(0),
    stroke: "#9aa0a8", "stroke-dasharray": "6 5", "stroke-width": 1.4 }, svg);
  el("text", { x: M.l - 8, y: Y(0) + 4, "text-anchor": "end", "font-size": 12,
    fill: "#5A6270", "font-weight": 700 }, svg).textContent = "0";

  // axes arrows
  function arrow(x1, y1, x2, y2) {
    const g = el("g", {}, svg);
    el("line", { x1, y1, x2, y2, stroke: "#59636E", "stroke-width": 3.4, "stroke-linecap": "round" }, g);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const ah = 9;
    el("path", {
      d: `M ${x2} ${y2} L ${x2 - ah * Math.cos(ang - 0.45)} ${y2 - ah * Math.sin(ang - 0.45)}
          M ${x2} ${y2} L ${x2 - ah * Math.cos(ang + 0.45)} ${y2 - ah * Math.sin(ang + 0.45)}`,
      stroke: "#59636E", "stroke-width": 3.4, "stroke-linecap": "round", fill: "none" }, g);
  }
  arrow(M.l - 26, H - M.b + 6, M.l - 26, M.t + 6);            // y axis
  arrow(M.l + 4, H - M.b + 30, W - M.r - 4, H - M.b + 30);    // x axis
  const yl = el("text", { x: M.l - 34, y: (M.t + H - M.b) / 2, "text-anchor": "middle",
    "font-size": 15, "font-weight": 800, fill: "#151A21",
    transform: `rotate(-90 ${M.l - 34} ${(M.t + H - M.b) / 2})` }, svg);
  yl.textContent = "Skill benefit";
  const xl = el("text", { x: (M.l + W - M.r) / 2, y: H - 4, "text-anchor": "middle",
    "font-size": 15, "font-weight": 800, fill: "#151A21" }, svg);
  xl.textContent = "Base capability";

  // tier word labels (clickable, mirror the zones)
  const words = [
    { t: "WEAK", tier: "weak", x: X(52), y: Y(-8), c: PALETTE.tiers.weak.ink },
    { t: "MEDIUM", tier: "mid", x: X(30), y: Y(30), c: PALETTE.tiers.mid.ink },
    { t: "STRONG", tier: "strong", x: X(60), y: Y(17.5), c: PALETTE.tiers.strong.ink },
  ];
  words.forEach(w => {
    const t = el("text", { x: w.x, y: w.y, "text-anchor": "middle", "font-size": 15,
      "font-weight": 800, fill: w.c, "letter-spacing": "1.5", cursor: "pointer" }, svg);
    t.textContent = w.t;
    t.addEventListener("click", () => zoneActivators[w.tier]());
  });

  // model marks: white disc + tier ring + logo
  // display-only x nudges so the two strong-tier discs don't overlap
  const DX = { "GPT-5.6-luna": -1.6, "Opus-5": 1.6 };
  FIG1A.forEach(m => {
    const p = PALETTE.tiers[m.tier];
    const mx = m.x + (DX[m.label] || 0);
    const g = el("g", { cursor: "pointer", tabindex: 0, role: "button",
      "aria-label": `${m.label}: base ${m.measured.base}, skill benefit ${m.measured.benefit > 0 ? "+" : ""}${m.measured.benefit}. Activate to show its tier's details.` }, svg);
    el("circle", { cx: X(mx), cy: Y(m.y), r: 15, fill: "#fff", stroke: p.ink, "stroke-width": 1.6 }, g);
    el("image", { href: "assets/" + m.icon, x: X(mx) - 9, y: Y(m.y) - 9, width: 18, height: 18 }, g);
    const lbl = el("text", { x: X(mx), y: Y(m.y) - 22, "text-anchor": "middle",
      "font-size": 12, "font-weight": 800, fill: "#151A21", "pointer-events": "none" }, g);
    lbl.textContent = m.label;
    // nudge overlapping labels
    if (m.label === "Gemma-4-E4B" || m.label === "Qwen3.5-9B") lbl.setAttribute("y", Y(m.y) + 32);
    if (m.label === "Sonnet-4.6") lbl.setAttribute("y", Y(m.y) + 32);
    if (m.label === "Opus-5") lbl.setAttribute("y", Y(m.y) + 32);

    const tipHtml =
      `<b>${m.label}</b> (${TIER_INFO[m.tier].name.toLowerCase()} tier)<br>
       measured base score: ${m.measured.base}<br>
       skill benefit: ${m.measured.benefit > 0 ? "+" : ""}${m.measured.benefit} points<br>
       <span style="opacity:.75">on the 103 skill-sensitive pairs</span>`;
    g.addEventListener("mousemove", ev => showTip(ev, tipHtml));
    g.addEventListener("mouseleave", hideTip);
    g.addEventListener("focus", () => showTipAt(g, tipHtml));
    g.addEventListener("blur", hideTip);
    g.addEventListener("click", () => zoneActivators[m.tier]());
    g.addEventListener("keydown", ev => {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); zoneActivators[m.tier](); }
    });
  });
})();

/* ============================================================
 * FIG 1b — one skill, two executors: animated trace race
 * ============================================================ */
(function fig1b() {
  const root = document.getElementById("fig1b");

  const sc = html("div", "skillcard", root);
  html("div", "fname", sc, FIG1B.skill.file);
  FIG1B.skill.lines.forEach(l => {
    const d = html("div", null, sc);
    d.innerHTML = l
      .replace("pcap_utils.py", "<code>pcap_utils.py</code>")
      .replace("value", "<b>value</b>").replace("metric", "<b>metric</b>");
  });

  const race = html("div", "race", root);
  const cols = {};
  [["strong", FIG1B.strong], ["weak", FIG1B.weak]].forEach(([key, cfg]) => {
    const col = html("div", "racer " + key, race);
    const head = html("div", "racer-head", col);
    const img = document.createElement("img");
    img.src = "assets/" + cfg.icon; img.alt = "";
    head.appendChild(img);
    html("span", null, head, cfg.model);
    const lines = cfg.steps.map(s => {
      const d = html("div", "trace-line", col);
      d.innerHTML = `<span>${s.cmd}</span><span class="${s.ok ? "note-ok" : "note-bad"}">${s.ok ? "✓" : "✗"} ${s.note}</span>`;
      return d;
    });
    const tbl = document.createElement("table");
    tbl.className = "mini-table";
    tbl.innerHTML = `<thead><tr><th>metric</th><th>value</th></tr></thead><tbody>` +
      cfg.table.map(r => `<tr class="${cfg.tableCorrupted ? "bad" : ""}"><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("") +
      `</tbody>`;
    col.appendChild(tbl);
    const v = html("div", "verdict " + (key === "strong" ? "pass" : "fail"), col, cfg.verdict);
    cols[key] = { lines, tbl, verdict: v };
  });

  // STATIC: no animation — everything visible immediately
  Object.values(cols).forEach(c => {
    c.lines.forEach(l => l.classList.add("shown"));
    c.tbl.classList.add("shown");
    c.verdict.classList.add("shown");
  });
})();

/* ============================================================
 * FIG 2 — five-round self-evolution with round stepper
 * ============================================================ */
const fig2state = { round: 0 };
(function fig2() {
  const W = 560, H = 420, M = { l: 48, r: 66, t: 16, b: 46 };
  const iw = W - M.l - M.r, ih = H - M.t - M.b;
  const X = r => M.l + r / 5 * iw;
  const Y = v => M.t + (1 - v) * ih;

  const root = document.getElementById("fig2chart");
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "group",
    "aria-label": "Schematic: task score of three weak models over five self-evolution rounds, with and without skill adaptation" }, root);

  // tier bands (top strips like the paper)
  el("rect", { x: M.l, y: Y(0.97), width: iw, height: Y(0.80) - Y(0.97), fill: PALETTE.tiers.strong.bg }, svg);
  el("line", { x1: M.l, x2: M.l + iw, y1: Y(FIG2.tierLines.strong), y2: Y(FIG2.tierLines.strong),
    stroke: PALETTE.tiers.strong.ink, "stroke-dasharray": "5 4", "stroke-width": 1.3 }, svg);
  el("rect", { x: M.l, y: Y(0.72), width: iw, height: Y(0.60) - Y(0.72), fill: PALETTE.tiers.mid.bg }, svg);
  el("line", { x1: M.l, x2: M.l + iw, y1: Y(FIG2.tierLines.mid), y2: Y(FIG2.tierLines.mid),
    stroke: PALETTE.tiers.mid.ink, "stroke-dasharray": "5 4", "stroke-width": 1.3 }, svg);
  el("line", { x1: M.l, x2: M.l + iw, y1: Y(FIG2.tierLines.weak), y2: Y(FIG2.tierLines.weak),
    stroke: PALETTE.tiers.weak.ink, "stroke-dasharray": "5 4", "stroke-width": 1.3 }, svg);

  const bandLabels = [
    ["STRONG", Y(0.93), PALETTE.tiers.strong.ink],
    ["MEDIUM", Y(0.67), "#9a6a1f"],
    ["WEAK", Y(0.205), PALETTE.tiers.weak.ink],
  ];
  bandLabels.forEach(([t, y, c]) => {
    const e = el("text", { x: M.l + iw - 4, y: y - 5, "text-anchor": "end",
      "font-size": 12.5, "font-weight": 800, fill: c, "letter-spacing": "1.2" }, svg);
    e.textContent = t;
  });

  // x labels
  for (let r = 0; r <= 5; r++) {
    const t = el("text", { x: X(r), y: H - M.b + 22, "text-anchor": "middle",
      "font-size": 14.5, fill: "#151A21", "font-weight": 800 }, svg);
    t.textContent = "Round " + r;
  }
  const xt = el("text", { x: M.l + iw / 2, y: H - 4, "text-anchor": "middle",
    "font-size": 14.5, "font-weight": 800, fill: "#151A21" }, svg);
  xt.textContent = "Evolve round →";
  const yt = el("text", { x: 12, y: M.t + ih / 2, "text-anchor": "middle", "font-size": 14.5,
    "font-weight": 800, fill: "#151A21", transform: `rotate(-90 12 ${M.t + ih / 2})` }, svg);
  yt.textContent = "Task score ↑";

  // series
  const models = ["Qwen3.6-flash", "Qwen3.5-9B", "Gemma-4-E4B"];
  const series = {};   // model -> { metaPath, nmPath, dots, icon }
  const gLines = el("g", {}, svg);

  function pathFor(vals, upto) {
    let d = "";
    for (let i = 0; i <= upto; i++) d += (i ? " L " : "M ") + X(i) + " " + Y(vals[i]);
    return d;
  }

  models.forEach(m => {
    const c = FIG2.lineColors[m];
    const nm = el("path", { d: "", fill: "none", stroke: c, "stroke-width": 1.8,
      "stroke-dasharray": "4 4", opacity: 0.55 }, gLines);
    // darker underlay so the palest series keeps contrast against white
    const under = el("path", { d: "", fill: "none", stroke: "#4a4370", "stroke-width": 4.6,
      "stroke-linecap": "round", opacity: 0.4 }, gLines);
    const mt = el("path", { d: "", fill: "none", stroke: c, "stroke-width": 3.2,
      "stroke-linecap": "round" }, gLines);
    const dots = [];
    for (let i = 0; i <= 5; i++) {
      const d = el("circle", { cx: X(i), cy: Y(FIG2.meta[m][i]), r: 4.4, fill: "#fff",
        stroke: c, "stroke-width": 2, opacity: 0, "pointer-events": "none", tabindex: -1,
        role: "img", "aria-label": `${m}, round ${i} (schematic position; measured final gap +2.0 to +5.1 points)` }, gLines);
      const tip = `<b>${m}</b> — round ${i}<br>` +
        `<span style="opacity:.8">Illustrative curve (the paper's Fig. 2 is qualitative).<br>` +
        `Measured suite result: with the meta-skill the loop ends<br>+2.0 to +5.1 points above the loop without it.</span>`;
      d.addEventListener("mousemove", ev => showTip(ev, tip));
      d.addEventListener("mouseleave", hideTip);
      d.addEventListener("focus", () => showTipAt(d, tip));
      d.addEventListener("blur", hideTip);
      dots.push(d);
    }
    // end-of-line icon plate
    const gi = el("g", { opacity: 0 }, svg);
    el("circle", { cx: 0, cy: 0, r: 14, fill: "#fff", stroke: PALETTE.tiers.weak.ink, "stroke-width": 1.4 }, gi);
    el("image", { href: "assets/" + FIG2.icons[m].svg, x: -8.5, y: -8.5, width: 17, height: 17 }, gi);
    // model name label along the line
    const nameT = el("text", { "font-size": 12.5, "font-weight": 800, fill: "#151A21",
      "text-anchor": "middle" }, svg);
    nameT.textContent = m;
    series[m] = { nm, mt, under, dots, icon: gi, nameT, color: c };
  });

  // STATIC render: full r0–r5 curves always drawn; the stepper only moves a
  // round marker (vertical highlight line) — no path animation.
  const marker = el("line", { y1: M.t, y2: M.t + ih, stroke: "#7668d4",
    "stroke-width": 2, "stroke-dasharray": "2 4", opacity: 0.8 }, svg);
  function render(round) {
    models.forEach(m => {
      const s = series[m];
      const fullD = pathFor(FIG2.meta[m], 5);
      s.mt.setAttribute("d", fullD);
      s.under.setAttribute("d", fullD);
      s.nm.setAttribute("d", pathFor(FIG2.nometa[m], 5));
      s.dots.forEach((d, i) => {
        d.setAttribute("opacity", 1);
        d.setAttribute("pointer-events", "auto");
        d.setAttribute("tabindex", 0);
        d.setAttribute("r", i === round ? 6 : 4.4);
        d.setAttribute("stroke-width", i === round ? 3 : 2);
      });
      // icons fixed at the r5 endpoints
      const y5 = Y(FIG2.meta[m][5]);
      s.icon.setAttribute("transform", `translate(${Math.min(X(5) + 24, W - 18)} ${y5})`);
      s.icon.setAttribute("opacity", 1);
      // model name above the middle of its curve
      s.nameT.setAttribute("x", X(2));
      s.nameT.setAttribute("y", Y(FIG2.meta[m][2]) - 10);
      s.nameT.setAttribute("text-anchor", "middle");
    });
    marker.setAttribute("x1", X(round));
    marker.setAttribute("x2", X(round));
  }
  render(0);
  fig2state.render = render;
})();

/* ---------------- round stepper + narrative panel ---------------- */
(function rounds() {
  const title = document.getElementById("round-title");
  const body = document.getElementById("round-body");
  const prev = document.getElementById("round-prev");
  const next = document.getElementById("round-next");
  const dotsBox = document.getElementById("round-dots");
  const dots = ROUNDS.map((_, i) => {
    const b = html("button", "round-dot", dotsBox);
    b.setAttribute("aria-label", "Round " + i);
    b.addEventListener("click", () => go(i));
    return b;
  });

  function renderRound(i) {
    const r = ROUNDS[i];
    title.textContent = r.title;
    body.innerHTML = "";
    const blk = html("div", "rewrite-block", body);
    if (r.rewrite) {
      html("span", "mode-chip", blk, r.rewrite.mode);
      const diff = html("div", "diff", blk);
      const b = html("div", "before", diff);
      b.innerHTML = `<span class="tag">${r.rewrite.beforeTag || "BEFORE"}</span>${r.rewrite.before}`;
      const a = html("div", r.rewrite.afterStyle === "fail" ? "before" : "after", diff);
      a.innerHTML = `<span class="tag">${r.rewrite.afterTag || "META-SKILL REWRITE"}</span>${r.rewrite.after}`;
    } else {
      const sk = html("div", "diff", blk);
      const s = html("div", "before", sk);
      s.innerHTML = `<span class="tag">ORIGINAL SKILL</span>${r.skillState[0].text}`;
    }
    html("p", "round-outcome", blk, r.outcome);
    html("div", "round-solved", blk, r.solved);
  }

  function go(i) {
    fig2state.round = Math.max(0, Math.min(5, i));
    fig2state.render(fig2state.round);
    renderRound(fig2state.round);
    prev.disabled = fig2state.round === 0;
    next.disabled = fig2state.round === 5;
    dots.forEach((d, j) => {
      d.classList.toggle("done", j < fig2state.round);
      d.classList.toggle("current", j === fig2state.round);
      d.setAttribute("aria-current", j === fig2state.round ? "true" : "false");
    });
  }
  prev.addEventListener("click", () => go(fig2state.round - 1));
  next.addEventListener("click", () => go(fig2state.round + 1));

  go(0);
})();


/* ============================================================
 * FIG 3a — dumbbell chart with suite toggle
 * ============================================================ */
(function fig3dumbbell() {
  const W = 560, H = 380, M = { l: 128, r: 24, t: 10, b: 40 };
  const iw = W - M.l - M.r, ih = H - M.t - M.b;
  const X = v => M.l + v * iw;

  const root = document.getElementById("fig3dumbbell");
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "group",
    "aria-label": "Dumbbell chart: score without and with skill for seven models; rows are focusable" }, root);

  const rows = FIG3_DUMBBELL.all.rows;
  const rowY = i => M.t + (i + 0.5) / rows.length * ih;

  // tier bands
  const bands = [
    { from: 0, to: 2, bg: PALETTE.tiers.strong.bg },
    { from: 2, to: 4, bg: PALETTE.tiers.mid.bg },
    { from: 4, to: 7, bg: PALETTE.tiers.weak.bg },
  ];
  bands.forEach(b => {
    el("rect", { x: 0, y: M.t + b.from / rows.length * ih, width: W,
      height: (b.to - b.from) / rows.length * ih, fill: b.bg, opacity: 0.6 }, svg);
  });

  // grid + x axis
  for (let v = 0; v <= 1.0001; v += 0.2) {
    el("line", { x1: X(v), x2: X(v), y1: M.t, y2: M.t + ih, stroke: PALETTE.grid, "stroke-width": 1 }, svg);
    const t = el("text", { x: X(v), y: M.t + ih + 18, "text-anchor": "middle", "font-size": 11.5, fill: "#5A6270" }, svg);
    t.textContent = v.toFixed(1);
  }
  const xt = el("text", { x: M.l + iw / 2, y: H - 4, "text-anchor": "middle", "font-size": 13,
    fill: "#333", "font-style": "italic" }, svg);
  xt.textContent = "score sₘ";

  // labels
  rows.forEach((r, i) => {
    const t = el("text", { x: M.l - 10, y: rowY(i) + 4, "text-anchor": "end", "font-size": 12.5,
      fill: "#151A21", "font-weight": 600 }, svg);
    t.textContent = r.label;
  });

  // dumbbells (animated on toggle)
  const items = rows.map((r, i) => {
    const g = el("g", { tabindex: 0, role: "img" }, svg);
    const y = rowY(i);
    const link = el("line", { y1: y, y2: y, stroke: PALETTE.purple, "stroke-width": 2, opacity: 0.55 }, g);
    const cWo = el("circle", { cy: y, r: 5.5, fill: "#fff", stroke: PALETTE.muted, "stroke-width": 2.2 }, g);
    const cW = el("circle", { cy: y, r: 5.5, fill: "#fff", stroke: PALETTE.purple, "stroke-width": 2.2 }, g);
    const dTxt = el("text", { y: y - 10, "text-anchor": "middle", "font-size": 12,
      fill: PALETTE.purple, "font-weight": 700 }, g);
    const woTxt = el("text", { y: y + 4, "font-size": 11.5, fill: "#4a515e" }, g);
    const wTxt = el("text", { y: y + 4, "font-size": 11.5, fill: PALETTE.purple, "font-weight": 600 }, g);
    [link, cWo, cW, dTxt, woTxt, wTxt].forEach(e => e.style.transition = "all .6s cubic-bezier(.3,.8,.3,1)");
    g.style.cursor = "default";
    const tipFor = () => {
      const d = current.rows[i];
      return `<b>${d.label}</b><br>w/o skill: ${d.wo.toFixed(3)}<br>w/ skill: ${d.w.toFixed(3)}<br>Δ = ${(d.w - d.wo >= 0 ? "+" : "")}${(d.w - d.wo).toFixed(3)}`;
    };
    g.addEventListener("mousemove", ev => showTip(ev, tipFor()));
    g.addEventListener("mouseleave", hideTip);
    g.addEventListener("focus", () => showTipAt(g, tipFor()));
    g.addEventListener("blur", hideTip);
    return { g, link, cWo, cW, dTxt, woTxt, wTxt };
  });

  let current = FIG3_DUMBBELL.all;
  function render(suite) {
    current = FIG3_DUMBBELL[suite];
    current.rows.forEach((r, i) => {
      const it = items[i];
      it.g.setAttribute("aria-label",
        `${r.label}: score ${r.wo.toFixed(3)} without skill, ${r.w.toFixed(3)} with skill`);
      it.link.setAttribute("x1", X(Math.min(r.wo, r.w)));
      it.link.setAttribute("x2", X(Math.max(r.wo, r.w)));
      it.cWo.setAttribute("cx", X(r.wo));
      it.cW.setAttribute("cx", X(r.w));
      const d = r.w - r.wo;
      it.dTxt.setAttribute("x", X((r.wo + r.w) / 2));
      it.dTxt.textContent = (d >= 0 ? "+" : "−") + Math.abs(d).toFixed(3);
      const lo = Math.min(r.wo, r.w), hi = Math.max(r.wo, r.w);
      // numbers on outer sides
      if (r.wo <= r.w) {
        it.woTxt.setAttribute("x", X(r.wo) - 9); it.woTxt.setAttribute("text-anchor", "end");
        it.wTxt.setAttribute("x", X(r.w) + 9); it.wTxt.setAttribute("text-anchor", "start");
      } else {
        it.woTxt.setAttribute("x", X(r.wo) + 9); it.woTxt.setAttribute("text-anchor", "start");
        it.wTxt.setAttribute("x", X(r.w) - 9); it.wTxt.setAttribute("text-anchor", "end");
      }
      it.woTxt.textContent = r.wo.toFixed(3);
      it.wTxt.textContent = r.w.toFixed(3);
      // avoid colliding with the model-name column at the far left:
      // if a label would cross into the name column, place it above/below its dot instead
      [[it.woTxt, r.wo, -12], [it.wTxt, r.w, 16]].forEach(([txt, v, dy]) => {
        const anchor = txt.getAttribute("text-anchor");
        const xPos = parseFloat(txt.getAttribute("x"));
        const y = parseFloat(it.cWo.getAttribute("cy"));
        if (anchor === "end" && xPos - 34 < M.l) {
          txt.setAttribute("x", X(v));
          txt.setAttribute("y", y + dy);
          txt.setAttribute("text-anchor", "middle");
        } else {
          txt.setAttribute("y", y + 4);
        }
      });
    });
  }
  render("all");

  document.querySelectorAll(".seg-btn").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".seg-btn").forEach(q => { q.classList.remove("active"); q.setAttribute("aria-pressed", "false"); });
      b.classList.add("active");
      b.setAttribute("aria-pressed", "true");
      render(b.dataset.suite);
    });
  });
})();

/* ============================================================
 * FIG 3b — donut with clickable slices
 * ============================================================ */
(function fig3donut() {
  const W = 340, H = 340, cx = W / 2, cy = H / 2, R = 130, r = 78;
  const root = document.getElementById("fig3donut");
  const detail = document.getElementById("donut-detail");
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "group",
    "aria-label": "Donut chart of 103 selected tasks by category; slices are clickable" }, root);

  const total = FIG3_DONUT.reduce((s, d) => s + d.count, 0);
  let a0 = -Math.PI / 2;
  let active = null;

  function arcPath(a1, a2, expand = 0) {
    const RR = R + expand;
    const large = a2 - a1 > Math.PI ? 1 : 0;
    const p = (rad, a) => `${cx + rad * Math.cos(a)} ${cy + rad * Math.sin(a)}`;
    return `M ${p(RR, a1)} A ${RR} ${RR} 0 ${large} 1 ${p(RR, a2)} L ${p(r, a2)} A ${r} ${r} 0 ${large} 0 ${p(r, a1)} Z`;
  }

  const slices = FIG3_DONUT.map(d => {
    const a1 = a0, a2 = a0 + d.count / total * Math.PI * 2;
    a0 = a2;
    const path = el("path", { d: arcPath(a1, a2), fill: d.color, stroke: "#fff", "stroke-width": 2,
      class: "donut-slice", tabindex: 0, role: "button",
      "aria-label": `${d.name}: ${d.count} task–skill pairs — click for details` }, svg);
    // percentage label on big slices: dark ink with a white halo, readable on any slice color
    if (d.count / total > 0.06) {
      const mid = (a1 + a2) / 2, lr = (R + r) / 2;
      const t = el("text", { x: cx + lr * Math.cos(mid), y: cy + lr * Math.sin(mid) + 4,
        "text-anchor": "middle", "font-size": 12.5, "font-weight": 800,
        fill: "#1c1c1c", stroke: "#ffffff", "stroke-width": 3, "paint-order": "stroke",
        "pointer-events": "none" }, svg);
      t.textContent = Math.round(d.count / total * 100) + "%";
    }
    const select = () => {
      svg.querySelectorAll(".donut-slice").forEach((q, i) => {
        q.classList.remove("active");
        q.setAttribute("aria-pressed", "false");
        q.setAttribute("d", arcPath(anglesList[i][0], anglesList[i][1], 0));
      });
      active = d;
      path.classList.add("active");
      path.setAttribute("aria-pressed", "true");
      path.setAttribute("d", arcPath(a1, a2, 8));
      renderDetail(d);
    };
    path.addEventListener("click", select);
    path.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(); } });
    path.addEventListener("mousemove", ev => showTip(ev, `<b>${d.name}</b><br>${d.count} task–skill pairs (${Math.round(d.count / total * 100)}%)<br><span style="opacity:.75">click for the task list</span>`));
    path.addEventListener("mouseleave", hideTip);
    return { path, a1, a2 };
  });
  const anglesList = slices.map(s => [s.a1, s.a2]);

  // center label
  const c1 = el("text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 30,
    "font-weight": 800, fill: "#151A21" }, svg);
  c1.textContent = total;
  const c2 = el("text", { x: cx, y: cy + 18, "text-anchor": "middle", "font-size": 12.5, fill: "#5A6270" }, svg);
  c2.textContent = "selected pairs";

  function renderDetail(d) {
    detail.innerHTML = "";
    const card = html("div", "dd-card", detail);
    card.style.borderLeftColor = d.color;
    html("h4", null, card, `${d.name} — ${d.count} task–skill pairs (${Math.round(d.count / total * 100)}%)`);
    html("div", "dd-src", card, d.sources);
    html("p", null, card, d.desc);
    const SHOW = 14;
    const wrap = html("div", "dd-tasks-wrap", card);
    html("div", "dd-src", wrap, "All tasks in this category:");
    const box = html("div", "dd-tasks", wrap);
    box.style.maxHeight = "150px";
    d.tasks.slice(0, SHOW).forEach(t => html("span", "dd-task", box, t));
    if (d.tasks.length > SHOW) {
      const extra = html("span", null, box);
      extra.style.display = "contents";
      const more = html("button", "dd-task", box, `+ ${d.tasks.length - SHOW} more…`);
      more.style.cursor = "pointer";
      more.setAttribute("aria-expanded", "false");
      let open = false;
      more.addEventListener("click", () => {
        open = !open;
        more.setAttribute("aria-expanded", String(open));
        if (open) {
          d.tasks.slice(SHOW).forEach(t => html("span", "dd-task", extra, t));
          more.textContent = "show fewer";
        } else {
          extra.innerHTML = "";
          more.textContent = `+ ${d.tasks.length - SHOW} more…`;
        }
        more.focus();
      });
    }
  }

  // legend with counts (clickable, mirrors the slices)
  const legend = document.createElement("div");
  legend.className = "donut-legend";
  root.insertAdjacentElement("afterend", legend);
  FIG3_DONUT.forEach((d, i) => {
    const b = html("button", "lg", legend);
    b.innerHTML = `<span class="sw" style="background:${d.color}"></span>${d.name} <b>${d.count}</b>`;
    b.addEventListener("click", () => slices[i].path.dispatchEvent(new Event("click")));
  });

  // preselect the biggest slice
  slices[0].path.dispatchEvent(new Event("click"));
})();
