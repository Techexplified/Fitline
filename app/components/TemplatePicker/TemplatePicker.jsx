/* eslint-disable react/prop-types */
import TextField from "../TextField/TextField";
import styles from "./TemplatePicker.module.css";

function ShirtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 5v3a3 3 0 0 0 3 3h1v11h10V11h1a3 3 0 0 0 3-3V5l-3-3H6z" />
      <path d="M10 2a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ShoeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17V8.5a1.5 1.5 0 0 1 1.5-1.5h3.17a2 2 0 0 0 1.42-.59l1.83-1.82A2 2 0 0 1 12.33 4H15a2 2 0 0 1 2 2v2a4 4 0 0 0 4 4v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M12 8h3m-3 3h4M7 17v-4" />
    </svg>
  );
}

function RingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

function KidsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

function IntimatesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="13" r="4" />
      <circle cx="17" cy="13" r="4" />
      <path d="M3 13h1m3-4V6a2 2 0 0 1 4 0v3m2 0V6a2 2 0 0 1 4 0v3m3 4h1" />
      <path d="M11 13h2" />
    </svg>
  );
}

function CustomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

const icons = {
  shirt: <ShirtIcon />,
  shoe: <ShoeIcon />,
  ring: <RingIcon />,
  kids: <KidsIcon />,
  intimates: <IntimatesIcon />,
  custom: <CustomIcon />,
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function TemplatePicker({
  templates,
  selectedId,
  onSelect,
  customName,
  onCustomNameChange,
  nameError
}) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {templates.map((tpl) => {
          const isSelected = tpl.id === selectedId;
          return (
            <div
              key={tpl.id}
              className={`${styles.card} ${isSelected ? styles.selectedCard : ""}`}
              onClick={() => onSelect(tpl.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelect(tpl.id);
                }
              }}
            >
              {isSelected && (
                <div className={styles.checkBadge}>
                  <CheckIcon />
                </div>
              )}
              <div className={styles.iconContainer}>
                {icons[tpl.icon] || <ShirtIcon />}
              </div>
              <div className={styles.textContainer}>
                <h4 className={styles.title}>{tpl.label}</h4>
                <p className={styles.subtitle}>{tpl.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
      {selectedId === "custom" && (
        <div className={styles.customNameFieldWrapper}>
          <TextField
            label="Product type name"
            placeholder="Hats, Belts, Gloves…"
            value={customName}
            onChange={onCustomNameChange}
            error={nameError ? "Give your product type a name before continuing" : undefined}
          />
        </div>
      )}
    </div>
  );
}
