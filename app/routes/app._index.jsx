/* global process */
import { useNavigate } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import styles from "../components/app._index.module.css";
import OnboardingStepList from "../components/OnboardingStepList/OnboardingStepList";
import Button from "../components/Button/Button";

// Inline SVG components as requested
function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="12 7 17 7 17 12" />
      <polyline points="12 17 7 17 7 12" />
    </svg>
  );
}

const steps = [
  {
    number: 1,
    title: "Choose products",
    description: "Pick which products show the guide",
    icon: <CameraIcon />,
  },
  {
    number: 2,
    title: "Build the chart",
    description: "Start from a template, edit inline",
    icon: <ListIcon />,
  },
  {
    number: 3,
    title: "Choose how it shows",
    description: "Popup, inline, or floating tab",
    icon: <MonitorIcon />,
  },
  {
    number: 4,
    title: "Recommend a size",
    description: "Match a shopper's measurements",
    icon: <RulerIcon />,
  },
];

export const loader = async ({ request }) => {
  try {
    await authenticate.admin(request);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    throw error;
  }
  return null;
};

export default function Index() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/app/chooseprod");
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Setup</p>
          <h1 className={styles.heading}>Set up your size guide</h1>
          <p className={styles.subtext}>
            Add a size chart to your products and help shoppers find the right fit. Takes about two minutes.
          </p>
        </header>

        <section className={styles.cardSection}>
          <OnboardingStepList steps={steps} />
        </section>

        <div className={styles.actions}>
          <Button onClick={handleGetStarted} variant="primary">
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
