/* eslint-disable react/prop-types */
import styles from "./Button.module.css";

export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  fullWidth = false, 
  disabled = false,
  loading = false,
  loadingText = "Loading..."
}) {
  const buttonClass = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : ""
  ].filter(Boolean).join(" ");

  return (
    <button 
      type="button"
      className={buttonClass} 
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className={styles.loadingContainer}>
          <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10" strokeLinecap="round" />
          </svg>
          {loadingText}
        </span>
      ) : children}
    </button>
  );
}
