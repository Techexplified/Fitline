/* eslint-disable react/prop-types */
import styles from "./UnitToggle.module.css";

export default function UnitToggle({ value, onChange }) {
  return (
    <div className={styles.toggleControl}>
      <button
        type="button"
        className={`${styles.toggleBtn} ${value === "cm" ? styles.activeToggle : ""}`}
        onClick={() => onChange("cm")}
      >
        cm
      </button>
      <button
        type="button"
        className={`${styles.toggleBtn} ${value === "inches" ? styles.activeToggle : ""}`}
        onClick={() => onChange("inches")}
      >
        inches
      </button>
    </div>
  );
}
