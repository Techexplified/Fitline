/* eslint-disable react/prop-types */
import styles from "./OnboardingStepList.module.css";

export default function OnboardingStepList({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className={styles.card}>
      {steps.map((step, idx) => (
        <div key={step.number || idx} className={styles.row}>
          <div className={styles.badge}>
            {step.number}
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </div>
          {step.icon && (
            <div className={styles.iconWrapper}>
              {step.icon}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
