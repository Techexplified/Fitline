/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./LivePreviewPanel.module.css";

export default function LivePreviewPanel({ 
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

        {/* Scrollable Browser Content Wrapper */}
        <div className={styles.mockBrowserContent}>
          {typeof children === "function" ? children({ device }) : children}
        </div>
      </div>

      <footer className={styles.previewFooter}>
        This is what shoppers see. Nothing publishes until the final step.
      </footer>
    </div>
  );
}
