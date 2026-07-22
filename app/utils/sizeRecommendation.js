/**
 * Calculates size recommendation based on merchant size chart and shopper inputs.
 * Note: The confidence scoring algorithm here is a placeholder to be replaced by a real model's confidence output later.
 *
 * @param {Object} chartData - The active size chart containing rows and column attributes.
 * @param {Object} inputs - Shopper inputs (e.g., chest, waist).
 * @returns {Object|null} The recommended size details or null if invalid inputs.
 */
export function getRecommendedSize(chartData, inputs) {
  if (!chartData || !chartData.rows || chartData.rows.length === 0) {
    return null;
  }

  let bestRow = null;
  let bestScore = Infinity;
  let closestField = "";

  const chestVal = parseFloat(inputs.chest);
  const waistVal = parseFloat(inputs.waist);

  chartData.rows.forEach((row) => {
    let score = 0;
    let count = 0;
    let closestFieldForRow = "";
    let minFieldDiff = Infinity;

    // Check Chest/Bust (case-insensitive key match)
    const chestKey = Object.keys(row.values).find(
      (k) => k.toLowerCase() === "chest"
    );
    if (!isNaN(chestVal) && chestKey !== undefined) {
      const rowVal = parseFloat(row.values[chestKey]);
      if (!isNaN(rowVal)) {
        const diff = Math.abs(rowVal - chestVal);
        score += diff;
        count++;
        if (diff < minFieldDiff) {
          minFieldDiff = diff;
          closestFieldForRow = "chest";
        }
      }
    }

    // Check Waist (case-insensitive key match)
    const waistKey = Object.keys(row.values).find(
      (k) => k.toLowerCase() === "waist"
    );
    if (!isNaN(waistVal) && waistKey !== undefined) {
      const rowVal = parseFloat(row.values[waistKey]);
      if (!isNaN(rowVal)) {
        const diff = Math.abs(rowVal - waistVal);
        score += diff;
        count++;
        if (diff < minFieldDiff) {
          minFieldDiff = diff;
          closestFieldForRow = "waist";
        }
      }
    }

    if (count > 0) {
      const avgScore = score / count;
      if (avgScore < bestScore) {
        bestScore = avgScore;
        bestRow = row;
        closestField = closestFieldForRow || "chest";
      }
    }
  });

  if (!bestRow) {
    // Default fallback to middle size row if no valid inputs are entered
    const middleIndex = Math.floor(chartData.rows.length / 2);
    bestRow = chartData.rows[middleIndex];
    closestField = "chest";
    bestScore = 20;
  }

  // Convert distance score into a rough 0-100 percentage.
  // Standard placeholder formula: Math.max(10, Math.min(100, Math.round(100 - bestScore * 3.5)))
  // If bestScore is 0 (exact match), confidence is 100%. If bestScore is 20, confidence is 30%.
  const confidence = Math.max(10, Math.min(100, Math.round(100 - bestScore * 3.5)));

  return {
    size: bestRow.label || bestRow.size,
    reason: `Best fit by ${closestField}. Highlighted in the chart.`,
    confidence: confidence,
  };
}
