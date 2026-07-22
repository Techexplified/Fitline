/* eslint-disable react/prop-types, no-unused-vars */
import { useState } from "react";
import SizeChartReadOnlyTable from "../SizeChartReadOnlyTable/SizeChartReadOnlyTable";
import styles from "./LivePreviewPanel.module.css";

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

export default function LivePreviewPanel({ 
  placement = "popup", 
  buttonLabel = "Size guide", 
  onSizeGuideClick, 
  previewChartData,
  children 
}) {
  const [device, setDevice] = useState("desktop");

  return (
    <div className={styles.previewContainer}>
      <header className={styles.previewHeader}>
        <span className={styles.previewLabel}>LIVE PREVIEW</span>
        <div className={styles.toggleControl}>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${device === "desktop" ? styles.activeToggle : ""}`}
            onClick={() => setDevice("desktop")}
          >
            Desktop
          </button>
          <button 
            type="button"
            className={`${styles.toggleBtn} ${device === "mobile" ? styles.activeToggle : ""}`}
            onClick={() => setDevice("mobile")}
          >
            Mobile
          </button>
        </div>
      </header>

      <div className={`${styles.browserWindow} ${device === "mobile" ? styles.mobileWidth : styles.desktopWidth}`}>
        {/* Mock Browser Header Bar */}
        <div className={styles.browserHeader}>
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <div className={styles.addressBar}>
            yourstore.com/products/heavy-boxy-tee
          </div>
        </div>

        {/* Browser Content */}
        <div className={`${styles.browserContent} ${device === "mobile" ? styles.mobileLayout : styles.desktopLayout}`}>
          <div className={styles.productImageContainer}>
            <TshirtIcon />
          </div>
          <div className={styles.productDetails}>
            <h2 className={styles.productTitle}>Heavyweight Boxy Tee</h2>
            <p className={styles.productPrice}>$48.00</p>
            
            <div className={styles.colorSwatches}>
              <span className={`${styles.swatch} ${styles.swatchBlack}`} />
              <span className={`${styles.swatch} ${styles.swatchSteel}`} />
              <span className={`${styles.swatch} ${styles.swatchGray}`} />
            </div>

            {placement === "popup" && (
              <button type="button" className={styles.sizeGuideBtn} onClick={onSizeGuideClick}>
                <TagIcon />
                {buttonLabel || "Size guide"}
              </button>
            )}
          </div>
        </div>

        {placement === "inline" && previewChartData && (
          <div className={styles.inlineSection}>
            <div className={styles.divider} />
            <div className={styles.inlineContent}>
              <h4 className={styles.inlineHeading}>Size guide</h4>
              <SizeChartReadOnlyTable chartData={previewChartData} />
            </div>
          </div>
        )}

        {placement === "floating" && (
          <button type="button" className={styles.floatingTab} onClick={onSizeGuideClick}>
            <span>{buttonLabel || "Size guide"}</span>
          </button>
        )}

        {children}
      </div>

      <footer className={styles.previewFooter}>
        This is what shoppers see. Nothing publishes until the final step.
      </footer>
    </div>
  );
}
