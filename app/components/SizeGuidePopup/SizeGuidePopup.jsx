/* eslint-disable react/prop-types, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import SizeChartReadOnlyTable from "../SizeChartReadOnlyTable/SizeChartReadOnlyTable";
import styles from "./SizeGuidePopup.module.css";

export default function SizeGuidePopup({ open, onClose, title = "Size guide", chartData, children }) {
  if (!open || !chartData) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </header>

        <SizeChartReadOnlyTable chartData={chartData} />
        {children}
      </div>
    </div>
  );
}
