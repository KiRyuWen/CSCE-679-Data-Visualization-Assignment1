/**
 * Level 2: the daily max/min line pair drawn inside a single heatmap cell.
 */
const MiniLineChart = (function () {

  /**
   * @param {d3.Selection} group  the <g class="cell-group"> for one month;
   *        its origin (0,0) is the cell's top-left corner
   * @param {Object} record       one monthly record, with record.days
   * @param {Object} scales       { width, height, temperatureScale }
   *
   * HINT (x): days within the month ->
   *   d3.scaleLinear().domain([1, d3.max(days, d => d.day)]).range([0, width])
   * Use the actual last day, not a constant 31, or February's line stops short
   * of the cell edge.
   *
   * HINT (y): the y scale must be SHARED across every cell, otherwise each
   * cell is auto-scaled to itself and the cells are no longer comparable —
   * that is the whole point of the level 2 chart. Build it once in
   * main-level2.js from the global min/max over all daily rows and pass it in.
   * Remember range([height, 0]): SVG y grows downward.
   *
   * HINT (the path): one d3.line() generator reused for both series —
   *   const line = d3.line().x(d => x(d.day)).y(d => y(d.max));
   * For the min series either make a second generator or parameterize the
   * accessor: makeLine(d => d.min).
   *
   * HINT: append the paths AFTER the background rect so they are not hidden,
   * and give them classes "mini-line mini-line--max" / "--min" — the colors
   * already exist in css/styles.css.
   */
  function render(group, record, scales) {
    // TODO
  }

  return { render };
})();
