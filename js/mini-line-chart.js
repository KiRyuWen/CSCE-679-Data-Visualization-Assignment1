/**
 * Level 2: the daily max/min line pair drawn inside a single heatmap cell.
 */
const MiniLineChart = (function () {

  /**
   * @param {d3.Selection} group  the <g class="cell-group"> for one month;
   *        its origin (0,0) is the cell's top-left corner
   * @param {Object} record       one monthly record, with record.days
   * @param {Object} scales       { width, height } of the cell
   */
  function render(group, record, scales) {
    const days = record.days;

    // The real last day of this month, not a constant 31 -- otherwise
    // February's line would stop short of the cell's right edge.
    const lastDay = d3.max(days, (day) => day.day);

    const dayScale = d3
      .scaleLinear()
      .domain([1, lastDay])
      .range([0, scales.width]);

    // Fixed domain, identical in every cell, so a mild February and a hot
    // August are drawn on the same footing. Fitting this per cell would make
    // every month look alike and defeat the purpose of the chart.
    const temperatureScale = d3
      .scaleLinear()
      .domain(CONFIG.dailyTemperatureDomain)
      .range([scales.height, 0]);   // inverted: SVG y grows downward

    // One generator, parameterized by which temperature it reads.
    function lineForTemperature(readTemperature) {
      return d3
        .line()
        .x((day) => dayScale(day.day))
        .y((day) => temperatureScale(readTemperature(day)));
    }

    // Appended after the background rect so the lines sit on top of it.
    group
      .append("path")
      .attr("class", "mini-line mini-line--max")
      .attr("d", lineForTemperature((day) => day.max)(days));

    group
      .append("path")
      .attr("class", "mini-line mini-line--min")
      .attr("d", lineForTemperature((day) => day.min)(days));
  }

  return { render };
})();
