# Implementation hints

Scaffold notes for this assignment. Every stub in `js/` has inline hints; this
file covers the things that are easy to lose an afternoon to.

## Run it

`d3.csv()` is a `fetch()` call, and `fetch` refuses `file://` URLs. Opening
`index.html` by double-clicking will fail with a CORS error no matter how
correct your code is. Serve the folder over HTTP:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

(VS Code's Live Server extension does the same thing.)

## Build order

Do it in this sequence — each step is visible on screen, so you always know
which step broke:

1. `DataService.loadDailyRecords` → `console.log` the first row, confirm the
   numbers are numbers and the date is a `Date`.
2. `DataService.aggregateByMonth` → should give you 250 records
   (1997-01 through 2017-10).
3. `Heatmap.render` with a plain gray fill → get the grid and axes right
   before thinking about color.
4. Color scale + `Legend.render`.
5. `Tooltip`.
6. Level 2 on top of the same grid.

## Gotchas

**D3 v7 event signature.** Listeners are `(event, datum)`. Tutorials written
for v4/v5 use `(datum, index)` and will hand you an event object where you
expect data. Also `d3.event` no longer exists.

**`scaleBand`, not arithmetic.** For a categorical grid, let `scaleBand` own
position and size. `xScale(year)` and `xScale.bandwidth()` — never
`i * cellWidth`.

**Month numbering.** JS `Date.getMonth()` is 0-indexed. Store 1–12 in your
records and index labels with `CONFIG.monthNames[month - 1]`; mixing the two
conventions is the classic off-by-one here.

**Year tick format.** `d3.axisTop(x)` on numeric years renders `1,997`. Use
`.tickFormat(d3.format("d"))`.

**SVG y axis points down.** Line-chart y ranges are `[height, 0]`, not
`[0, height]`.

**One shared y scale in level 2.** If each cell scales to its own min/max, a
mild February and a brutal August produce identical-looking lines, and the
chart stops meaning anything. Compute the temperature scale once across all
drawn days and pass it to every cell.

**The data ends mid-year.** The CSV stops at 2017-10-28, so 2017 has no
Nov/Dec cells. That is correct — the reference screenshot shows the same gap.
Don't pad it.

**Group per cell.** Binding to `<g>` rather than `<rect>` costs nothing in
level 1 and means level 2 is a `renderCell` swap instead of a rewrite.

## Grading tie-ins

- *Readability (30%)*: name things after the domain (`monthlyRecords`, not
  `data2`), and comment the **why** — a comment restating `.attr("fill", ...)`
  earns nothing, a comment explaining your color-domain choice does.
- *Maintainability (20%)*: that is what `config.js` and the module split are
  for. If you find yourself copy-pasting between `main-level1.js` and
  `main-level2.js`, push the shared part down into `heatmap.js`.
