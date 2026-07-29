/* eslint-disable react/prop-types */
import { useState } from "react";
import SizeChartReadOnlyTable from "../SizeChartReadOnlyTable/SizeChartReadOnlyTable";
import SizeGuidePopup from "../SizeGuidePopup/SizeGuidePopup";
import RecommendationResult from "../RecommendationResult/RecommendationResult";
import { getRecommendedSize } from "../../utils/sizeRecommendation";
import styles from "./SizeGuidePreviewContent.module.css";

function TshirtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ width: 44, height: 44, color: "#cbd5e1" }}>
      <path d="M6 2L3 5v3a3 3 0 0 0 3 3h1v11h10V11h1a3 3 0 0 0 3-3V5l-3-3H6z" />
      <path d="M10 2a2 2 0 0 0 4 0" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 6 }}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function SizeFinderWidget({ chartData, unit, onRecommendation }) {
  const getNumericColumns = (chart) => {
    if (!chart || !chart.columns) return [];
    return chart.columns.filter((col) => {
      return chart.rows?.some((row) => {
        const val = row.values?.[col];
        return val !== undefined && val !== null && val !== "" && !isNaN(parseFloat(val));
      });
    });
  };

  const numericCols = getNumericColumns(chartData);
  const [inputs, setInputs] = useState(() => {
    const initial = {};
    numericCols.forEach((col) => {
      const lower = col.toLowerCase();
      if (lower === "chest" || lower === "chest / bust") {
        initial[col] = "90";
      } else if (lower === "waist") {
        initial[col] = "78";
      } else {
        initial[col] = "";
      }
    });
    return initial;
  });

  const [isRecommending, setIsRecommending] = useState(false);
  const [result, setResult] = useState(null);

  const handleRecommend = () => {
    setIsRecommending(true);
    setResult(null);
    setTimeout(() => {
      const rec = getRecommendedSize(chartData, inputs);
      setResult(rec);
      setIsRecommending(false);
      if (rec && onRecommendation) {
        onRecommendation(rec.rowIndex);
      }
    }, 600);
  };

  if (numericCols.length === 0) {
    return null;
  }

  return (
    <div className={styles.finderContainer}>
      <h4 className={styles.finderHeading}>Try it as a shopper would</h4>
      <div className={styles.finderForm}>
        {numericCols.map((col) => {
          const isOptional = col.toLowerCase() === "waist";
          const inputId = `preview-input-${col.replace(/[^a-zA-Z0-9]/g, "-")}`;
          return (
            <div key={col} className={styles.finderField}>
              <label className={styles.finderLabel} htmlFor={inputId}>
                {col} {isOptional && <span className={styles.optionalText}>optional</span>}
              </label>
              <div className={styles.finderInputWrapper}>
                <input 
                  id={inputId}
                  type="number"
                  step="any"
                  min="0"
                  value={inputs[col] ?? ""} 
                  onChange={(e) => setInputs({ ...inputs, [col]: e.target.value })} 
                  className={styles.finderInput} 
                />
                <span className={styles.finderUnitBadge}>{unit === "inches" ? "inches" : "cm"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "12px" }}>
        <button 
          type="button" 
          onClick={handleRecommend} 
          className={styles.finderButton}
          disabled={isRecommending}
        >
          {isRecommending ? "Recommending..." : "Recommend my size"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "12px" }}>
          <RecommendationResult 
            size={result.size}
            reason={result.reason}
            confidence={result.confidence}
          />
        </div>
      )}
    </div>
  );
}

export default function SizeGuidePreviewContent({
  placement = "popup",
  buttonLabel = "Size guide",
  chartData,
  unit = "cm",
  sizeFinderEnabled = false,
  productMock,
  device = "desktop"
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(-1);

  const handleRecommendation = (idx) => {
    setHighlightedRowIndex(idx);
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setHighlightedRowIndex(-1); // Reset highlight on open
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const product = productMock || {
    title: "Heavyweight Boxy Tee",
    price: "$48.00",
    swatches: ["black", "steel", "gray"]
  };

  return (
    <>
      {/* Product Mock Container */}
      <div className={`${styles.browserContent} ${device === "mobile" ? styles.mobileLayout : styles.desktopLayout}`}>
        <div className={styles.productImageContainer}>
          <TshirtIcon />
        </div>
        <div className={styles.productDetails}>
          <h2 className={styles.productTitle}>{product.title}</h2>
          <p className={styles.productPrice}>{product.price}</p>
          
          <div className={styles.colorSwatches}>
            {product.swatches?.map((color) => (
              <span 
                key={color} 
                className={`${styles.swatch} ${
                  color === "black" ? styles.swatchBlack : 
                  color === "steel" ? styles.swatchSteel : 
                  styles.swatchGray
                }`} 
              />
            ))}
          </div>

          {placement === "popup" && (
            <button type="button" className={styles.sizeGuideBtn} onClick={handleOpenPopup}>
              <TagIcon />
              {buttonLabel || "Size guide"}
            </button>
          )}
        </div>
      </div>

      {/* Inline Section */}
      {placement === "inline" && chartData && (
        <div className={styles.inlineSection}>
          <div className={styles.divider} />
          <div className={styles.inlineContent}>
            <h4 className={styles.inlineHeading}>Size guide</h4>
            <SizeChartReadOnlyTable chartData={chartData} highlightedRowIndex={highlightedRowIndex} />
            
            {sizeFinderEnabled && (
              <SizeFinderWidget 
                chartData={chartData} 
                unit={unit} 
                onRecommendation={handleRecommendation} 
              />
            )}
          </div>
        </div>
      )}

      {/* Floating Tab Tab */}
      {placement === "floating" && (
        <button type="button" className={styles.floatingTab} onClick={handleOpenPopup}>
          <span>{buttonLabel || "Size guide"}</span>
        </button>
      )}

      {/* Size Guide Popup Dialog */}
      {(placement === "popup" || placement === "floating") && (
        <SizeGuidePopup
          open={isPopupOpen}
          onClose={handleClosePopup}
          title={chartData?.templateLabel || "Size guide"}
          chartData={chartData}
        >
          {sizeFinderEnabled && (
            <SizeFinderWidget 
              chartData={chartData} 
              unit={unit} 
              onRecommendation={handleRecommendation} 
            />
          )}
        </SizeGuidePopup>
      )}
    </>
  );
}
