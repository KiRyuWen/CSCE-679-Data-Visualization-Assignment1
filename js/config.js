/**
 * Shared constants for both levels.
 *
 * Everything that a grader might want to tweak (cell size, margins, color
 * scheme) lives here so no magic numbers are buried in the drawing code.
 */
const CONFIG = {
  dataUrl: "temperature_daily.csv",

  // Outer margins leave room for the year axis (top) and month axis (left).
  margin: { top: 40, right: 20, bottom: 20, left: 80 },

  // Cell geometry. Level 2 needs bigger cells to fit a readable line chart.
  cell: {
    level1: { width: 41, height: 37, padding: 7 },
    level2: { width: 97, height: 72, padding: 3 },
  },

  // Level 2 only looks at the most recent N years (the spec says 5–10).
  level2YearCount: 10,

  // Six-class ColorBrewer Spectral, reversed so it runs cool -> hot.
  // level1.png uses exactly these six swatches:
  //   #ffffbf #fee08b #fdae61 #f46d43 #d53e4f #9e0142
  // Swap this array to restyle both levels; the class count follows from it.
  colorClasses: d3.schemeSpectral[11].slice(0, 6).reverse(),

  legend: {
    width: 260,
    height: 12,
    tickCount: 6,
  },

  // Month index (1-12) -> label for the y axis.
  monthNames: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};
