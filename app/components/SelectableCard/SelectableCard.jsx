/* eslint-disable react/prop-types */
import styles from "./SelectableCard.module.css";

export default function SelectableCard({ selected, title, description, onClick, disabled }) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`${styles.card} ${selected ? styles.selectedCard : ""} ${disabled ? styles.disabledCard : ""}`} 
      onClick={handleClick}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          handleClick();
        }
      }}
    >
      <div className={styles.topRow}>
        <div className={`${styles.radioOuter} ${selected ? styles.radioOuterSelected : ""} ${disabled ? styles.disabledRadioOuter : ""}`}>
          {selected && <div className={`${styles.radioInner} ${disabled ? styles.disabledRadioInner : ""}`} />}
        </div>
        <h3 className={`${styles.title} ${disabled ? styles.disabledTitle : ""}`}>{title}</h3>
      </div>
      <div className={styles.descriptionContainer}>
        <p className={`${styles.description} ${disabled ? styles.disabledDescription : ""}`}>{description}</p>
      </div>
    </div>
  );
}
