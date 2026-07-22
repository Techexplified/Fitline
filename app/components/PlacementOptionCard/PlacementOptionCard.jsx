/* eslint-disable react/prop-types */
import styles from "./PlacementOptionCard.module.css";

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  );
}

function FloatingTabIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="12" height="12" rx="1" />
      <path d="M15 9h5v6h-5" />
    </svg>
  );
}

const icons = {
  monitor: <MonitorIcon />,
  bars: <BarsIcon />,
  tab: <FloatingTabIcon />,
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PlacementOptionCard({ selected, icon, title, description, onClick }) {
  return (
    <div
      className={`${styles.card} ${selected ? styles.selectedCard : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className={styles.iconContainer}>
        {icons[icon] || <MonitorIcon />}
      </div>
      <div className={styles.textContainer}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.badgeContainer}>
        {selected && (
          <div className={styles.checkBadge}>
            <CheckIcon />
          </div>
        )}
      </div>
    </div>
  );
}
