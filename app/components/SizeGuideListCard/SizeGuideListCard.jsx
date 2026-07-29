/* eslint-disable react/prop-types */
import { Link } from "react-router";
import Button from "../Button/Button";
import styles from "./SizeGuideListCard.module.css";

function ShirtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <path d="M6 2L3 5v3a3 3 0 0 0 3 3h1v11h10V11h1a3 3 0 0 0 3-3V5l-3-3H6z" />
      <path d="M10 2a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ShoeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <path d="M3 17V8.5a1.5 1.5 0 0 1 1.5-1.5h3.17a2 2 0 0 0 1.42-.59l1.83-1.82A2 2 0 0 1 12.33 4H15a2 2 0 0 1 2 2v2a4 4 0 0 0 4 4v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M12 8h3m-3 3h4M7 17v-4" />
    </svg>
  );
}

function RingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

function KidsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

function IntimatesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <circle cx="7" cy="13" r="4" />
      <circle cx="17" cy="13" r="4" />
      <path d="M3 13h1m3-4V6a2 2 0 0 1 4 0v3m2 0V6a2 2 0 0 1 4 0v3m3 4h1" />
      <path d="M11 13h2" />
    </svg>
  );
}

function CustomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

const icons = {
  apparel: <ShirtIcon />,
  footwear: <ShoeIcon />,
  rings: <RingIcon />,
  kids: <KidsIcon />,
  intimates: <IntimatesIcon />,
  custom: <CustomIcon />,
};

function getRelativeTimeString(date) {
  if (!date) return "some time ago";
  const now = new Date();
  const updated = new Date(date);
  const diffMs = now.getTime() - updated.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export default function SizeGuideListCard({ guide }) {
  const icon = icons[guide.templateId] || <CustomIcon />;
  const titleText = guide.name || guide.templateLabel;
  const productsCount = guide.products?.length || 0;
  const scopeText = guide.productScope === "all" ? "All products" : `${productsCount} products`;

  const rowsCount = Array.isArray(guide.rows) ? guide.rows.length : 0;
  const colsCount = Array.isArray(guide.columns) ? guide.columns.length : 0;

  return (
    <div className={styles.cardRow}>
      {/* Left Icon Box */}
      <div className={styles.iconBox}>
        {icon}
      </div>

      {/* Middle Details */}
      <div className={styles.infoCol}>
        <div className={styles.titleLine}>
          <span className={styles.title}>{titleText}</span>
          <span className={styles.scopeBadge}>{scopeText}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaText}>
            {rowsCount} sizes &middot; {colsCount} measurements
          </span>
          <span className={styles.bullet}>&middot;</span>
          <span className={styles.timeText}>
            Updated {getRelativeTimeString(guide.updatedAt)}
          </span>
        </div>
      </div>

      {/* Right Action */}
      
    </div>
  );
}
