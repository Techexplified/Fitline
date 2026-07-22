/* eslint-disable react/prop-types */
import styles from "./TextField.module.css";

export default function TextField({ label, value, onChange, placeholder, helperText, error }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className={styles.errorText}>{error}</p>}
      {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}
