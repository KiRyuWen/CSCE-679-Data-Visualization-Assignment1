/**
 * The year x month matrix — shared by both levels.
 *
 * Level 1 fills each cell with a color. Level 2 uses the exact same grid and
 * draws a mini line chart on top of each cell, so this module deliberately
 * knows nothing about what goes *inside* a cell: it builds the scales, axes
 * and one <g class="cell-group"> per month, then hands each group to a
 * caller-supplied `renderCell` callback.
 */
const Heatmap = (function () {

  /**
   * @param {Object} options
   * @param {string} options.container      CSS selector, e.g. "#chart"
   * @param {Array}  options.records        monthly records from DataService
   * @param {Object} options.cell           CONFIG.cell.level1 or .level2
   * @param {Function} options.renderCell   (group, record, scales) => void
   *        called once per cell; draws whatever belongs inside it
   *
   * @returns {Object} { xScale, yScale, innerWidth, innerHeight }
   *
   * ---------------------------------------------------------------------
   * HINT (scales): both axes are categorical, so use d3.scaleBand().
   *   xScale = d3.scaleBand()
   *     .domain(DataService.listYears(records))
   *     .range([0, years.length * cell.width])
   *     .padding(cell.paddingX / cell.width);   // gap between cells
   *   yScale = same idea with d3.range(1, 13) as the domain.
   * scaleBand gives you xScale(year) for position and xScale.bandwidth() for
   * size — never compute i * width by hand.
   *
   * HINT (SVG skeleton): the standard D3 margin convention —
   *   svg = d3.select(container).append("svg")
   *            .attr("width", innerWidth + margin.left + margin.right)
   *            .attr("height", innerHeight + margin.top + margin.bottom);
   *   plot = svg.append("g")
   *            .attr("transform", `translate(${margin.left},${margin.top})`);
   * Then every scale output is relative to `plot`, which keeps the math clean.
   *
   * HINT (axes): the reference image puts years on TOP and months on the LEFT:
   *   d3.axisTop(xScale).tickFormat(d3.format("d"))   // "1997", not "1,997"
   *   d3.axisLeft(yScale).tickFormat(m => CONFIG.monthNames[m - 1])
   * Append each in its own <g class="axis">; the left one needs no transform,
   * the top one none either since `plot` is already offset.
   *
   * HINT (cells): bind data ONCE and position a <g> per record, so level 2 can
   * append several elements per cell:
   *   plot.selectAll("g.cell-group")
   *       .data(records, d => `${d.year}-${d.month}`)   // key function!
   *       .join("g")
   *       .attr("class", "cell-group")
   *       .attr("transform", d => `translate(${xScale(d.year)},${yScale(d.month)})`)
   *       .each(function (d) { renderCell(d3.select(this), d, scales); });
   * Inside the group, coordinates start at (0,0) — no offset math per element.
   */
  function render(options) {
    const { container, records, cell, renderCell } = options;
    const margin = CONFIG.margin;

    const years = DataService.listYears(records);
    const months = d3.range(1, 13);          // [1, 2, …, 12]

    const innerWidth = years.length * cell.width;
    const innerHeight = months.length * cell.height;

    const svg = d3.select(container)
      .append("svg")
      .attr("width", innerWidth + margin.left + margin.right)
      .attr("height", innerHeight + margin.top + margin.bottom);

    // Everything inside `plot` is positioned relative to the grid's top-left
    // corner, so no drawing code has to add the margins back in.
    const plot = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(years)
      .range([0, innerWidth])
      // paddingOuter is half of paddingInner, so each edge gets half a gap
      // and the step stays exactly cell.width. Plain .padding() would set
      // both to the same value and shrink every cell.
      .paddingInner(cell.paddingX / cell.width)
      .paddingOuter(cell.paddingX / cell.width / 2);

    const yScale = d3.scaleBand()
      .domain(months)
      .range([0, innerHeight])
      .paddingInner(cell.paddingY / cell.height)
      .paddingOuter(cell.paddingY / cell.height / 2);

    const xAxis = d3.axisTop(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat((month) => CONFIG.monthNames[month - 1]);

    plot.append("g")
      .attr("class", "axis")
      .call(xAxis);

    plot.append("g")
      .attr("class", "axis")
      .call(yAxis);
    // Passed to renderCell so each level can draw whatever belongs in a cell
    // without recomputing the geometry.
    const scales = {
      xScale,
      yScale,
      width: xScale.bandwidth(),
      height: yScale.bandwidth(),
    };

    const cellGroups = plot.selectAll("g.cell-group")
      .data(records, (record) => `${record.year}-${record.month}`)
      .join("g")
      .attr("class", "cell-group")
      .attr("transform", (record) =>
        `translate(${xScale(record.year)},${yScale(record.month)})`
      );

    cellGroups.each(function (record) {
      renderCell(d3.select(this), record, scales);
    });

    return { xScale, yScale, innerWidth, innerHeight };
  }

  /**
   * Attach tooltip handlers to a selection of cells.
   * Kept here so both levels get identical hover behaviour.
   *
   * HINT: .on("mouseover", (event, d) => Tooltip.show(event, Tooltip.formatMonthly(d)))
   *       .on("mousemove", Tooltip.move)
   *       .on("mouseout", Tooltip.hide)
   * In D3 v7 the listener signature is (event, datum) — not (datum, index)
   * like v5. This is the single most common thing to get wrong when copying
   * older tutorials.
   */
    function attachTooltip(selection, separator) {
    selection
      .on("mouseover", (event, record) => {
        Tooltip.show(event, Tooltip.formatMonthly(record, separator));
      })
      .on("mousemove", (event) => {
        Tooltip.move(event);
      })
      .on("mouseout", () => {
        Tooltip.hide();
      });
  }


  return { render, attachTooltip };
})();
