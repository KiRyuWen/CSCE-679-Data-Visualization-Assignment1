/**
 * Color legend (requirement #4 on both levels).
 *
 * Renders a continuous color ramp plus an axis into #legend.
 */
const Legend = (function () {

  /**
   * @param {string} containerSelector  e.g. "#legend"
   * @param {d3.ScaleSequential} colorScale  the SAME scale the cells use —
   *        pass it in rather than rebuilding it, or the legend will lie.
   * @param {string} title
   *
   * HINT (the ramp): an SVG <rect> cannot hold a gradient by itself. Two ways:
   *   a) draw a <linearGradient> in <defs> with ~10 <stop>s sampled from
   *      colorScale, then fill one rect with url(#gradient-id); or
   *   b) draw N thin rects (N = legend.width), each filled with
   *      colorScale(valueAt(i)). Simpler, totally fine at this size.
   *
   * HINT (the axis): build a d3.scaleLinear with the same domain as the color
   * scale and range [0, legend.width], then d3.axisBottom(that).ticks(6).
   * Append it in a <g> translated down by legend.height.
   *
   * HINT: clear the container first (d3.select(sel).selectAll("*").remove())
   * so re-rendering on toggle does not stack legends on top of each other.
   */
    function render(containerSelector, colorScale, title) {
    const container = d3.select(containerSelector);
    container.selectAll("*").remove();   // rebuilt on every toggle

    const colors = colorScale.range();
    const boundaries = [
      colorScale.domain()[0],
      ...colorScale.thresholds(),
      colorScale.domain()[1],
    ];

    const swatchWidth = CONFIG.legend.width / colors.length;
    const swatchHeight = CONFIG.legend.height;

    const svg = container.append("svg")
      .attr("width", CONFIG.legend.width + 40)
      .attr("height", swatchHeight + 36);

    // Inset so the first and last boundary labels are not clipped.
    const plot = svg.append("g").attr("transform", "translate(20,18)");

    plot.append("text")
      .attr("x", 0)
      .attr("y", -6)
      .text(title);

    plot.selectAll("rect")
      .data(colors)
      .join("rect")
      .attr("x", (color, index) => index * swatchWidth)
      .attr("width", swatchWidth)
      .attr("height", swatchHeight)
      .attr("fill", (color) => color);

    plot.selectAll("text.tick")
      .data(boundaries)
      .join("text")
      .attr("class", "tick")
      .attr("x", (value, index) => index * swatchWidth)
      .attr("y", swatchHeight + 13)
      .attr("text-anchor", "middle")
      .text((value) => d3.format(".1~f")(value));
  }


  /**
   * Level 2 extra: a small key explaining the two line colors
   * (red = max, blue = min). Two short line samples + labels.
   */
  function renderLineKey(containerSelector) {
    // TODO
  }

  return { render, renderLineKey };
})();
