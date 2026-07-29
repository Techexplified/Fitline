(function () {
  const root = document.getElementById("fitline-size-guide-root");
  if (!root) return;

  const productGid = root.dataset.productGid;

  fetch(`/apps/fitline/size-guide?productId=${encodeURIComponent(productGid)}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch guide");
      }
      return res.json();
    })
    .then((data) => {
      if (!data.guide) return; // no guide for this product — render nothing
      renderGuide(root, data.guide);
    })
    .catch(() => {
      // fail silently on the storefront — never show a broken UI to shoppers
    });

  function renderGuide(root, guide) {
    switch (guide.displayPlacement) {
      case "popup":
        renderPopupTrigger(root, guide);
        break;
      case "inline":
        renderInline(root, guide);
        break;
      case "floating":
        renderFloatingTab(root, guide);
        break;
    }
  }

  function getNumericColumns(guide) {
    return guide.columns.filter(col => {
      return guide.rows.some(row => {
        const val = row.values[col];
        return val !== undefined && val !== null && val !== "" && !isNaN(parseFloat(val));
      });
    });
  }

  function buildTableHTML(guide, highlightedSizeRowIndex = -1) {
    let html = '';
    html += `<div class="fitline-unit-caption">Measurements in ${guide.unit === "cm" ? "centimetres" : "inches"}</div>`;
    html += `<div class="fitline-table-wrapper">`;
    html += `<table class="fitline-table">`;
    
    // Header
    html += `<thead><tr>`;
    html += `<th class="fitline-th">Size</th>`;
    guide.columns.forEach(col => {
      html += `<th class="fitline-th">${col}</th>`;
    });
    html += `</tr></thead>`;
    
    // Body
    html += `<tbody>`;
    guide.rows.forEach((row, rowIndex) => {
      const isHighlighted = rowIndex === highlightedSizeRowIndex;
      const rowClass = isHighlighted ? 'fitline-tr fitline-tr-highlighted' : 'fitline-tr';
      html += `<tr class="${rowClass}">`;
      html += `<td class="fitline-td fitline-row-label">${row.size}</td>`;
      guide.columns.forEach(col => {
        const val = row.values[col] !== undefined && row.values[col] !== null ? row.values[col] : '-';
        html += `<td class="fitline-td">${val}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody>`;
    html += `</table>`;
    html += `</div>`;
    return html;
  }

  function buildSizeFinderHTML(guide) {
    const numericCols = getNumericColumns(guide);
    if (numericCols.length === 0) return '';

    let html = '';
    html += `<div class="fitline-size-finder">`;
    html += `<h4 class="fitline-finder-heading">Try it as a shopper would</h4>`;
    html += `<div class="fitline-finder-form">`;
    
    numericCols.forEach(col => {
      const colId = `fitline-input-${col.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const isOptional = col.toLowerCase() === 'waist';
      html += `<div class="fitline-finder-field">`;
      html += `<label class="fitline-finder-label" for="${colId}">${col}${isOptional ? ' <span class="fitline-optional-text">optional</span>' : ''}</label>`;
      html += `<div class="fitline-finder-input-wrapper">`;
      html += `<input type="number" id="${colId}" class="fitline-finder-input" data-column="${col}" step="any" min="0">`;
      html += `<span class="fitline-finder-unit-badge">${guide.unit}</span>`;
      html += `</div>`;
      html += `</div>`;
    });
    
    html += `</div>`;
    html += `<button type="button" class="fitline-finder-button">Recommend my size</button>`;
    html += `<div class="fitline-recommendation-result-container"></div>`;
    html += `</div>`;
    return html;
  }

  // function getRecommendedSize(guide, inputs) {
  //   if (!guide || !guide.rows || guide.rows.length === 0) {
  //     return null;
  //   }

  //   let bestRow = null;
  //   let bestScore = Infinity;
  //   let closestField = "";

  //   const chestVal = parseFloat(inputs.chest);
  //   const waistVal = parseFloat(inputs.waist);

  //   guide.rows.forEach((row) => {
  //     let score = 0;
  //     let count = 0;
  //     let closestFieldForRow = "";
  //     let minFieldDiff = Infinity;

  //     // Check Chest/Bust (case-insensitive key match)
  //     const chestKey = Object.keys(row.values).find(
  //       (k) => k.toLowerCase() === "chest"
  //     );
  //     if (!isNaN(chestVal) && chestKey !== undefined) {
  //       const rowVal = parseFloat(row.values[chestKey]);
  //       if (!isNaN(rowVal)) {
  //         const diff = Math.abs(rowVal - chestVal);
  //         score += diff;
  //         count++;
  //         if (diff < minFieldDiff) {
  //           minFieldDiff = diff;
  //           closestFieldForRow = "chest";
  //         }
  //       }
  //     }

  //     // Check Waist (case-insensitive key match)
  //     const waistKey = Object.keys(row.values).find(
  //       (k) => k.toLowerCase() === "waist"
  //     );
  //     if (!isNaN(waistVal) && waistKey !== undefined) {
  //       const rowVal = parseFloat(row.values[waistKey]);
  //       if (!isNaN(rowVal)) {
  //         const diff = Math.abs(rowVal - waistVal);
  //         score += diff;
  //         count++;
  //         if (diff < minFieldDiff) {
  //           minFieldDiff = diff;
  //           closestFieldForRow = "waist";
  //         }
  //       }
  //     }

  //     if (count > 0) {
  //       const avgScore = score / count;
  //       if (avgScore < bestScore) {
  //         bestScore = avgScore;
  //         bestRow = row;
  //         closestField = closestFieldForRow || "chest";
  //       }
  //     }
  //   });

  //   if (!bestRow) {
  //     // Default fallback to middle size row if no valid inputs are entered
  //     const middleIndex = Math.floor(guide.rows.length / 2);
  //     bestRow = guide.rows[middleIndex];
  //     closestField = "chest";
  //     bestScore = 20;
  //   }

  //   // Convert distance score into a rough 0-100 percentage.
  //   const confidence = Math.max(10, Math.min(100, Math.round(100 - bestScore * 3.5)));

  //   const rowIndex = guide.rows.indexOf(bestRow);

  //   return {
  //     size: bestRow.size,
  //     reason: `Best fit by ${closestField}. Highlighted in the chart.`,
  //     confidence: confidence,
  //     rowIndex: rowIndex
  //   };
  // }


  function getRecommendedSize(guide, inputs) {
  if (!guide || !guide.rows || guide.rows.length === 0) {
    return null;
  }

  // Only consider inputs that were actually entered and are valid numbers
  const enteredFields = Object.entries(inputs)
    .map(([key, val]) => [key, parseFloat(val)])
    .filter(([, val]) => !isNaN(val));

  if (enteredFields.length === 0) {
    return null; // nothing entered — don't fake a recommendation
  }

  let bestRow = null;
  let bestScore = Infinity;
  let closestField = "";

  guide.rows.forEach((row) => {
    let score = 0;
    let count = 0;
    let minFieldDiff = Infinity;
    let closestFieldForRow = "";

    enteredFields.forEach(([fieldKey, inputVal]) => {
      // case-insensitive match against this row's actual value keys
      const matchedKey = Object.keys(row.values).find(
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
  const rowIndex = guide.rows.indexOf(bestRow);

  return {
    size: bestRow.size,
    reason: `Best fit by ${closestField}. Highlighted in the chart.`,
    confidence,
    rowIndex,
  };
}

  function initSizeFinder(container, guide, tableContainer) {
    const btn = container.querySelector(".fitline-finder-button");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const inputs = {};
      const inputElems = container.querySelectorAll(".fitline-finder-input");
      inputElems.forEach(input => {
        const col = input.dataset.column;
        const val = input.value.trim();
        if (val !== "" && col) {
          inputs[col] = val;
        }
      });

      // Swap button state to "Recommending..."
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = "Recommending...";

      // Clear previous result
      const resultContainer = container.querySelector(".fitline-recommendation-result-container");
      resultContainer.innerHTML = "";

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;

        const result = getRecommendedSize(guide, inputs);
        if (!result) return;

        // Render result panel
        resultContainer.innerHTML = `
          <div class="fitline-result-card">
            <div class="fitline-result-top">
              <div class="fitline-result-size-box">
                <span class="fitline-result-size-text">${result.size}</span>
              </div>
              <p class="fitline-result-reason-text">${result.reason}</p>
            </div>
            <div class="fitline-result-progress-wrapper">
              <div class="fitline-result-progress-fill" style="width: ${result.confidence}%"></div>
            </div>
            <div class="fitline-result-label-row">
              <span class="fitline-result-label-text">Confidence</span>
              <span class="fitline-result-confidence-val">${result.confidence}%</span>
            </div>
          </div>
        `;

        // Highlight table row
        if (tableContainer) {
          tableContainer.innerHTML = buildTableHTML(guide, result.rowIndex);
        }
      }, 600); // Artificial delay to simulate processing
    });
  }

  function openDialog(guide) {
    // Remove existing if any
    const existing = document.getElementById("fitline-dialog-backdrop");
    if (existing) existing.remove();

    const backdrop = document.createElement("div");
    backdrop.id = "fitline-dialog-backdrop";
    backdrop.className = "fitline-dialog-backdrop";

    const dialog = document.createElement("div");
    dialog.className = "fitline-dialog";

    const header = document.createElement("header");
    header.className = "fitline-dialog-header";
    header.innerHTML = `
      <h3 class="fitline-dialog-title">${guide.templateLabel || guide.name || 'Size guide'}</h3>
      <button type="button" class="fitline-dialog-close-btn" aria-label="Close dialog">&times;</button>
    `;
    dialog.appendChild(header);

    const content = document.createElement("div");
    content.className = "fitline-dialog-content";

    const tableContainer = document.createElement("div");
    tableContainer.className = "fitline-table-container";
    tableContainer.innerHTML = buildTableHTML(guide);
    content.appendChild(tableContainer);

    if (guide.sizeFinderEnabled) {
      const finderContainer = document.createElement("div");
      finderContainer.innerHTML = buildSizeFinderHTML(guide);
      initSizeFinder(finderContainer, guide, tableContainer);
      content.appendChild(finderContainer);
    }

    dialog.appendChild(content);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    // Event listeners
    const closeBtn = header.querySelector(".fitline-dialog-close-btn");
    closeBtn.addEventListener("click", () => {
      backdrop.remove();
    });

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.remove();
      }
    });
  }

  function renderPopupTrigger(root, guide) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fitline-popup-trigger-btn";
    btn.textContent = guide.buttonLabel || "Size guide";
    btn.addEventListener("click", () => {
      openDialog(guide);
    });
    root.appendChild(btn);
  }

  function renderInline(root, guide) {
    const container = document.createElement("div");
    container.className = "fitline-inline-container";

    const divider = document.createElement("hr");
    divider.className = "fitline-inline-divider";
    container.appendChild(divider);

    const title = document.createElement("h3");
    title.className = "fitline-inline-title";
    title.textContent = guide.templateLabel || guide.name || "Size guide";
    container.appendChild(title);

    const tableContainer = document.createElement("div");
    tableContainer.className = "fitline-table-container";
    tableContainer.innerHTML = buildTableHTML(guide);
    container.appendChild(tableContainer);

    if (guide.sizeFinderEnabled) {
      const finderContainer = document.createElement("div");
      finderContainer.innerHTML = buildSizeFinderHTML(guide);
      initSizeFinder(finderContainer, guide, tableContainer);
      container.appendChild(finderContainer);
    }

    root.appendChild(container);
  }

  function renderFloatingTab(root, guide) {
    const tab = document.createElement("div");
    tab.className = "fitline-floating-tab";
    tab.textContent = guide.buttonLabel || "Size guide";
    tab.addEventListener("click", () => {
      openDialog(guide);
    });
    document.body.appendChild(tab);
  }
})();
