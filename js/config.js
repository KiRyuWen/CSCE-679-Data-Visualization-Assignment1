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
    // width/height are the cell PITCH (cell + gap); paddingX/paddingY are the
    // gaps in pixels, measured from the reference images.
    level1: { width: 41, height: 37, paddingX: 7, paddingY: 7 },
    level2: { width: 97, height: 72, paddingX: 20, paddingY: 15 },
  },

  // The level 2 legend shows the full eleven-class Spectral ramp over
  // 0-40C, coolest first, even though only the warm six ever appear in the
  // cells. Matches level2.png.
  legendClasses: d3.schemeSpectral[11].slice().reverse(),

  // Every level 2 mini line chart uses this fixed temperature domain rather
  // than fitting to its own month, so the cells are directly comparable.
  // It matches the 0-40 Celsius axis on the legend in level2.png.
  dailyTemperatureDomain: [0, 40],

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
