/* eslint-disable react/prop-types */
import styles from "./RecommendationResult.module.css";

export default function RecommendationResult({ size, reason, confidence }) {
  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.sizeBox}>
          <span className={styles.sizeText}>{size}</span>
        </div>
        <p className={styles.reasonText}>{reason}</p>
      </div>

      <div className={styles.progressBarWrapper}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${confidence}%` }} 
        />
      </div>

      <div className={styles.labelRow}>
        <span className={styles.labelText}>Confidence</span>
        <span className={styles.confidenceValue}>{confidence}%</span>
      </div>
    </div>
  );
}
