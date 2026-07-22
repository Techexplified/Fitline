/* eslint-disable react/prop-types */
import SetupStepper from "../SetupStepper/SetupStepper";
import LivePreviewPanel from "../LivePreviewPanel/LivePreviewPanel";
import Button from "../Button/Button";
import styles from "./SetupLayout.module.css";

export default function SetupLayout({
  currentStep,
  totalSteps,
  title,
  description,
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = "Continue",
  continueLoading = false,
  continueLoadingText = "Loading...",
  children,
  previewContent
}) {
  return (
    <div className={styles.layoutPage}>
      <SetupStepper currentStep={currentStep} />
      
      <main className={styles.layoutContainer}>
        <div className={styles.contentColumn}>
          <div className={styles.stepHeader}>
            <p className={styles.stepEyebrow}>Step {currentStep} of {totalSteps}</p>
            <h1 className={styles.stepTitle}>{title}</h1>
            {description && <p className={styles.stepDescription}>{description}</p>}
          </div>

          <div className={styles.stepBody}>
            {children}
          </div>

          <footer className={styles.stepFooter}>
            <Button onClick={onBack} variant="secondary">
              Back
            </Button>
            <div className={styles.footerRight}>
              <span className={styles.footerIndicator}>Step {currentStep} of {totalSteps}</span>
              <Button 
                onClick={onContinue} 
                variant="primary" 
                disabled={continueDisabled}
                loading={continueLoading}
                loadingText={continueLoadingText}
              >
                {continueLabel}
              </Button>
            </div>
          </footer>
        </div>

        <div className={styles.previewColumn}>
          <LivePreviewPanel {...previewContent} />
        </div>
      </main>
    </div>
  );
}
