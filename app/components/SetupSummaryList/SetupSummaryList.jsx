/* eslint-disable react/prop-types */
import styles from "./SetupSummaryList.module.css";

export default function SetupSummaryList({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.card}>
      {items.map((item, idx) => (
        <div key={item.label || idx} className={styles.row}>
          <div className={styles.labelCol}>
            <span className={styles.labelText}>{item.label}</span>
          </div>
          <div className={styles.contentCol}>
            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.description}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
