/**
 * Level 2 entry point: the same year/month grid as level 1, but each cell
 * also carries a mini line chart of that month's daily max/min temperatures.
 */
(async function main() {
  const daily = await DataService.loadDailyRecords();
  const allMonthly = DataService.aggregateByMonth(daily);
  const monthly = DataService.takeRecentYears(allMonthly, CONFIG.level2YearCount);

  // The cell background encodes the monthly maximum, using the same scale as
  // level 1. Fitted to the ten years shown, which gives the same domain the
  // full dataset does (18-37C), so the two levels stay consistent.
  const colorScale = ColorScale.forMetric(monthly, "max");

  Heatmap.render({
    container: "#chart",
    records: monthly,
    cell: CONFIG.cell.level2,
    renderCell: (group, record, scales) => {
      group
        .append("rect")
        .attr("class", "cell")
        .attr("width", scales.width)
        .attr("height", scales.height)
        .attr("fill", colorScale(record.max));

      // STEP 3 will add: MiniLineChart.render(group, record, scales);
    },
  });
})();
