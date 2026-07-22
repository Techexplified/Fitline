/* global process */
import { useLocation, useNavigate } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import SetupSummaryList from "../components/SetupSummaryList/SetupSummaryList";
import Button from "../components/Button/Button";
import styles from "../components/app.published.module.css";

const mockSummary = {
  products: { title: "All products", description: "Applies across your catalog" },
  chart: { templateLabel: "Footwear", sizeCount: 5, measurementCount: 3 },
  display: { placementLabel: "Floating tab", buttonLabel: "Size guide" },
  sizeFinderEnabled: true,
};

export const loader = async ({ request }) => {
  try {
    await authenticate.admin(request);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      return null;
    }
    throw error;
  }
  // Note: sizeGuideId and summary details arrive via location.state on the client,
  // avoiding an extra server-side query on the published confirmation page.
  return null;
};

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PublishedSetup() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read configuration state from router transition, fall back to mock details in dev
  const summary = location.state || mockSummary;

  const items = [
    {
      label: "PRODUCTS",
      title: summary.products?.title || mockSummary.products.title,
      description: summary.products?.description || mockSummary.products.description,
    },
    {
      label: "CHART",
      title: summary.chart?.templateLabel || mockSummary.chart.templateLabel,
      description: summary.chart 
        ? `${summary.chart.sizeCount} sizes · ${summary.chart.measurementCount} measurements`
        : `${mockSummary.chart.sizeCount} sizes · ${mockSummary.chart.measurementCount} measurements`,
    },
    {
      label: "DISPLAY",
      title: summary.display?.placementLabel || mockSummary.display.placementLabel,
      description: `Button label: ${summary.display?.buttonLabel || mockSummary.display.buttonLabel}`,
    },
    {
      label: "SIZE FINDER",
      title: summary.sizeFinderEnabled ? "Ready" : "Off",
      description: summary.sizeFinderEnabled
        ? "Turn on once you connect a model"
        : "Enable anytime from setup",
    },
  ];

  const handleEdit = () => {
    // Navigate back to step 1 to let them modify their choices
    navigate("/app/chooseprod");
  };

  const handleViewStore = () => {
    // TODO: link to storefront product with size guide
    console.log("TODO: link to storefront product with size guide");
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconCircle}>
        <CheckCircleIcon />
      </div>

      <span className={styles.eyebrow}>Published</span>

      <h1 className={styles.title}>Your size guide is live</h1>

      <p className={styles.description}>
        Shoppers can open it on your selected products and find their size in seconds.
      </p>

      <div className={styles.summaryCardWrapper}>
        <SetupSummaryList items={items} />
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={handleViewStore} variant="primary">
          View on your store
        </Button>
        <Button onClick={handleEdit} variant="secondary">
          Edit setup
        </Button>
      </div>
    </div>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
