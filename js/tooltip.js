/**
 * Hover tooltip (level 1 requirement #3).
 *
 * One shared DOM node (#tooltip) is moved around rather than one node per
 * cell — 250+ absolutely positioned divs would be wasteful and flicker.
 */
const Tooltip = (function () {
  const node = d3.select("#tooltip");
  const OFFSET_X = 12;
  const OFFSET_Y = 12;
  // Shared by show() and move() so the box sits in the same place either way.
  function positionAt(event) {
    node
      .style("left", `${event.pageX + OFFSET_X}px`)
      .style("top", `${event.pageY + OFFSET_Y}px`);
  }
  /**
   * @param {MouseEvent} event  the pointer event, used for positioning
   * @param {string} html       markup to display
   *
   * HINT: position with event.pageX / event.pageY (document coordinates,
   * which is what `position: absolute` on <body> expects). Offset by ~12px so
   * the box does not sit under the cursor.
   *
   * HINT: the CSS already handles the fade — just add the "is-visible" class
   * via .classed("is-visible", true).
   */
  function show(event, html) {
    node.html(html);
    positionAt(event);
    node.classed("is-visible", true).attr("aria-hidden", "false");
  }

  /** Follow the cursor without re-rendering the content. */
  function move(event) {
    positionAt(event);
  }

  function hide() {
    node.classed("is-visible", false).attr("aria-hidden", "true");
  }


  /**
   * Format helper so both levels print the same thing.
   * Reference image reads: "Date: 2002-03; max: 28 min: 14"
   *
   * HINT: d3.format("02d") or String(month).padStart(2, "0") for the month.
   */
  function formatMonthly(record) {
    const paddedMonth = String(record.month).padStart(2, "0");
    return `Date: ${record.year}-${paddedMonth}; max: ${record.max} min: ${record.min}`;
  }

  return { show, move, hide, formatMonthly };
})();
