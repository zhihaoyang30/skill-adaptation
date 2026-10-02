# Paper promo page — "Evolving to Match Capabilities"

Self-contained static site (no build step, works from `file://` or any static server).

## Files
- `index.html` / `style.css` / `main.js` — the page (vanilla JS + inline SVG)
- `data.js` — all figure data, taken 1:1 from the paper's plotting code
  (`reports/figures/fig1_data.json`, `fig1/part_b/plot_fig2_skill_adaptation.py`,
  `fig2/plot_fig2b.py` values, `reports/cache/task_categories.json`)
- `assets/` — figure PNGs exported from `overleaf/.../figure/*.pdf` + model logo SVGs
- `paper.pdf` — the submitted PDF

## Serve
```bash
cd web && python3 -m http.server 8000
# open http://localhost:8000
```

## Interactions
- Fig 1a: three clickable tier regions (weak/medium/strong) + hover for measured numbers
- Fig 1b: animated two-executor replay (auto-plays once, replay/skip button)
- Fig 2: round stepper r0→r5 — each click shows the round's skill change + measured
  suite result, and the schematic curves advance one round; auto-play available
- Case study: animated summary of the paper's fig:case (two arms, per-round rewards)
- Fig 3: dumbbell chart with all-tasks / skill-sensitive toggle; clickable donut with
  per-category task descriptions and full task lists
- Fig 4: static pipeline + result figures from the paper

Palette matches the paper figures: ink `#333333`, w/-skill purple `#7668d4`,
tier colors weak `#B4503A` / mid `#C08428` / strong `#1F6A8C`.

Reviewed and iterated 5 rounds against gpt-6-astra (reviews in /tmp/review_r1..r5.txt
at build time); remaining known limitations: Fig 1/2 are qualitative teaser
reproductions (stated on-page), and the case replay is an animated summary of the
paper's case figure rather than a raw trajectory replay.
