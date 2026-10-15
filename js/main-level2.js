/**
 * Level 2 entry point: same grid as level 1, but each cell carries a mini
 * line chart of that month's daily max/min temperatures.
 */
(async function main() {
  const daily = await DataService.loadDailyRecords();
  const allMonthly = DataService.aggregateByMonth(daily);
  const monthly = DataService.takeRecentYears(allMonthly, CONFIG.level2YearCount);

  // Background color still encodes the monthly max (same scheme as level 1),
  // so the two levels read consistently.
  // TODO: const color = d3.scaleSequential(...)...

  /**
   * ONE temperature scale shared by every cell — see the note in
   * mini-line-chart.js about why this must not be per-cell.
   *
   * HINT: domain over the daily rows that actually get drawn:
   *   const days = monthly.flatMap(d => d.days);
   *   d3.scaleLinear()
   *     .domain([d3.min(days, d => d.min), d3.max(days, d => d.max)])
   *     .nice()
   *     .range([cellHeight - pad, pad]);   // inverted, with a little padding
   */
  // TODO: const temperatureScale = ...

  // TODO:
  // Heatmap.render({
  //   container: "#chart",
  //   records: monthly,
  //   cell: CONFIG.cell.level2,
  //   renderCell: (group, record, scales) => {
  //     group.append("rect").attr("class", "cell")... .attr("fill", color(record.max));
  //     MiniLineChart.render(group, record, { ...scales, temperatureScale });
  //   },
  // });
  //
  // Heatmap.attachTooltip(d3.selectAll(".cell-group"));
  // Legend.render("#legend", color, "monthly max temperature (°C)");
  // Legend.renderLineKey("#legend");
})();
