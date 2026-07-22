/* eslint-disable react/prop-types */
import styles from "./SetupStepper.module.css";

const steps = [
  { number: 1, label: "Products" },
  { number: 2, label: "Chart" },
  { number: 3, label: "Display" },
  { number: 4, label: "Fit" },
];

export default function SetupStepper({ currentStep }) {
  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepperList}>
        <div className={styles.progressLine}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          let circleClass = styles.circle;
          let labelClass = styles.label;
          
          if (isActive) {
            circleClass += ` ${styles.activeCircle}`;
            labelClass += ` ${styles.activeLabel}`;
          } else if (isCompleted) {
            circleClass += ` ${styles.completedCircle}`;
            labelClass += ` ${styles.completedLabel}`;
          } else {
            circleClass += ` ${styles.inactiveCircle}`;
            labelClass += ` ${styles.inactiveLabel}`;
          }
          
          return (
            <div key={step.number} className={styles.stepItem}>
              <div className={circleClass}>
                {isCompleted ? (
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={labelClass}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
