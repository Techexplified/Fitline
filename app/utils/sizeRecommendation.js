/**
 * Calculates size recommendation based on merchant size chart and shopper inputs.
 *
 * @param {Object} chartData - The active size chart containing rows and column attributes.
 * @param {Object} inputs - Shopper inputs (e.g., { chest: "90", waist: "78" }).
 * @returns {Object|null} The recommended size details or null if invalid inputs.
 */
export function getRecommendedSize(chartData, inputs) {
  if (!chartData || !chartData.rows || chartData.rows.length === 0) {
    return null;
  }

  // Only consider inputs that were actually entered and are valid numbers
  const enteredFields = Object.entries(inputs || {})
    .map(([key, val]) => [key, parseFloat(val)])
    .filter(([, val]) => !isNaN(val));

  if (enteredFields.length === 0) {
    return null; // nothing entered — don't fake a recommendation
  }

  let bestRow = null;
  let bestScore = Infinity;
  let closestField = "";

  chartData.rows.forEach((row) => {
    let score = 0;
    let count = 0;
    let minFieldDiff = Infinity;
    let closestFieldForRow = "";

    enteredFields.forEach(([fieldKey, inputVal]) => {
      // case-insensitive match against this row's actual value keys
      const matchedKey = Object.keys(row.values || {}).find(
        (k) => k.toLowerCase() === fieldKey.toLowerCase()
      );
      if (matchedKey === undefined) return;

      const rowVal = parseFloat(row.values[matchedKey]);
      if (isNaN(rowVal)) return;

      const diff = Math.abs(rowVal - inputVal);
      score += diff;
      count++;
      if (diff < minFieldDiff) {
        minFieldDiff = diff;
        closestFieldForRow = matchedKey;
      }
    });

    if (count > 0) {
      const avgScore = score / count;
      if (avgScore < bestScore) {
        bestScore = avgScore;
        bestRow = row;
        closestField = closestFieldForRow;
      }
    }
  });

  if (!bestRow) {
    return null;
  }

  const confidence = Math.max(10, Math.min(100, Math.round(100 - bestScore * 3.5)));
  const rowIndex = chartData.rows.indexOf(bestRow);

  return {
    size: bestRow.label || bestRow.size,
    reason: `Best fit by ${closestField}. Highlighted in the chart.`,
    confidence,
    rowIndex,
  };
}
