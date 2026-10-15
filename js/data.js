/**
 * Data loading and reshaping.
 *
 * The CSV is daily:   date,max_temperature,min_temperature
 * Both levels draw one mark per (year, month), so everything here is about
 * turning ~7500 daily rows into ~250 monthly rows.
 */
const DataService = (function () {

  /**
   * Load and parse the CSV.
   *
   * @returns {Promise<Array<{date: Date, year: number, month: number,
   *                          day: number, max: number, min: number}>>}
   *
   * HINT: use d3.csv(url, rowAccessor). The row accessor runs per row and
   * should coerce types — d3.csv gives you strings otherwise, and `"25" < "9"`
   * would silently break every scale.
   *   - date:  d3.timeParse("%Y-%m-%d")(row.date)
   *   - max/min: +row.max_temperature  (unary + is the shortest coercion)
   *   - year/month/day: read them off the parsed Date (getFullYear(),
   *     getMonth() + 1, getDate()). Store month 1-12, not 0-11, so it lines
   *     up with CONFIG.monthNames[month - 1].
   */
  async function loadDailyRecords() {
    // TODO
    let result = Array();
    const parseDate = d3.timeParse("%Y-%m-%d");
    await d3.csv(CONFIG.dataUrl, (d) => {
      let date = parseDate(d.date);
      result.push({
        date,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        max: Number(d.max_temperature),
        min: Number(d.min_temperature)
      })
    })
    return result
  }

  /**
   * Collapse daily records into one record per (year, month).
   *
   * @param {Array} dailyRecords  output of loadDailyRecords()
   * @returns {Array<{year, month, max, min, days: Array}>}
   *   max  = highest max_temperature seen that month
   *   min  = lowest  min_temperature seen that month
   *   days = the daily records of that month, sorted by day (level 2 needs it)
   *
   * HINT: d3.rollups(records, reducer, d => d.year, d => d.month) returns a
   * nested array [[year, [[month, reduced], ...]], ...]. Flatten it with
   * flatMap into the flat shape above — flat data is much easier to bind with
   * selection.data().
   *
   * HINT: inside the reducer, `v` is the array of that month's daily rows, so
   * d3.max(v, d => d.max) and d3.min(v, d => d.min) give you the two numbers.
   * Keep `v` itself (sorted) as `days`.
   */
function aggregateByMonth(dailyRecords) {
  const nested = d3.rollups(
    dailyRecords,
    (v) => ({
      max: d3.max(v, (d) => d.max),
      min: d3.min(v, (d) => d.min),
      days: v.sort((a, b) => a.day - b.day)
    }),
    (d) => d.year,
    (d) => d.month
  );

  return nested.flatMap(([year, months]) =>
    months.map(([month, stats]) => ({ year, month, ...stats }))
  );
}


  /**
   * @returns {number[]} sorted ascending list of distinct years — this is the
   * domain of the x scale, and the thing you slice for level 2.
   */
  function listYears(monthlyRecords) {
    // 250 records, twelve per year, so the years repeat.
    const allYears = monthlyRecords.map((record) => record.year);

    // A Set keeps only distinct values.
    const uniqueYears = new Set(allYears);

    // Spread back to an array: Set has no .sort(), and scaleBand().domain()
    // needs an array. d3.ascending compares numerically — bare .sort() would
    // compare them as strings.
    const sortedYears = [...uniqueYears].sort(d3.ascending);

    return sortedYears;
  }


  /**
   * Keep only the most recent `count` years (level 2).
   *
   * HINT: get the years, take the last `count` of them, then filter the
   * records whose year is in that set.
   */
  function takeRecentYears(monthlyRecords, count) {
    const sortedYears = listYears(monthlyRecords);
    const recentYears = sortedYears.slice(sortedYears.length - count);
    const recentYearSet = new Set(recentYears);

    return monthlyRecords.filter((record) => recentYearSet.has(record.year));
  }


  // Expose only what the pages need; everything else stays private.
  return { loadDailyRecords, aggregateByMonth, listYears, takeRecentYears };
})();
