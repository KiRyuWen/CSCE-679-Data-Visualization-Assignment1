/**
 * The cell background color scale, shared by both levels.
 *
 * Level 2 uses the same scale as level 1: checking level2.png against
 * level1.png, a month with a given maximum temperature falls in the same
 * class in both images. Only the legend differs -- level 2 displays the full
 * eleven-colour Spectral ramp, even though just the warm six ever appear.
 */
const ColorScale = (function () {

  /**
   * @param {Array} monthlyRecords  the records the domain is fitted to
   * @param {string} metric         "max" or "min"
   * @returns {Function} d3 quantize scale: temperature -> colour
   */
  function forMetric(monthlyRecords, metric) {
    const [coolest, hottest] = d3.extent(
      monthlyRecords,
      (record) => record[metric]
    );

    // Six discrete classes -- the reference images are quantized, not a
    // continuous ramp.
    //
    // The domain runs to (maximum + 2) rather than the maximum itself. For
    // the max metric that places the class breaks at 21.5 / 25 / 28.5 / 32 /
    // 35.5, which reproduces the reference cell for cell. Using the bare
    // extent moves 40% of the cells into a neighbouring class.
    const colorScale = d3
      .scaleQuantize()
      .domain([coolest, hottest + 2])
      .range(CONFIG.colorClasses);

    return colorScale;
  }

  return { forMetric };
})();
