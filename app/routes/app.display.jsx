/* global process */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import SetupLayout from "../components/SetupLayout/SetupLayout";
import PlacementOptionCard from "../components/PlacementOptionCard/PlacementOptionCard";
import TextField from "../components/TextField/TextField";
import SizeGuidePreviewContent from "../components/SizeGuidePreviewContent/SizeGuidePreviewContent";
import styles from "../components/app.display.module.css";

const placementOptions = [
  {
    id: "popup",
    icon: "monitor",
    title: "Popup dialog",
    description: "A button opens the chart in a centered panel. The dependable default.",
  },
  {
    id: "inline",
    icon: "bars",
    title: "Inline block",
    description: "The chart sits under the product details. Nothing to click.",
  },
  {
    id: "floating",
    icon: "tab",
    title: "Floating tab",
    description: "A tab pinned to the page edge, reachable while scrolling.",
  },
];

const sampleChartData = {
  unit: "cm",
  rowLabelHeader: "Age",
  columns: ["Height", "Chest", "Waist"],
  rows: [
    { label: "2–3y", values: { Height: 98, Chest: 55, Waist: 53 } },
    { label: "4–5y", values: { Height: 110, Chest: 58, Waist: 55 } },
    { label: "6–7y", values: { Height: 122, Chest: 63, Waist: 57 } },
    { label: "8–9y", values: { Height: 134, Chest: 68, Waist: 60 } },
  ],
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
  return null;
};

export default function DisplaySetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlacement, setSelectedPlacement] = useState("popup");
  const [buttonLabel, setButtonLabel] = useState("Size guide");

  const effectiveChartData = location.state?.chartData || sampleChartData;
  const effectiveUnit = location.state?.unit || "cm";
  const mockProduct = {
    title: "Heavyweight Boxy Tee",
    price: "$48.00",
    swatches: ["black", "steel", "gray"]
  };

  const handleBack = () => {
    navigate("/app/chart");
  };

  const handleContinue = () => {
    navigate("/app/fit", {
      state: {
        ...location.state,
        display: {
          placementLabel: placementOptions.find((opt) => opt.id === selectedPlacement)?.title || selectedPlacement,
          buttonLabel: buttonLabel,
        },
        selectedPlacement,
        buttonLabel,
      }
    });
  };

  const showButtonLabelInput = selectedPlacement === "popup" || selectedPlacement === "floating";

  const previewConfig = {
    children: ({ device }) => (
      <SizeGuidePreviewContent
        placement={selectedPlacement}
        buttonLabel={buttonLabel}
        chartData={effectiveChartData}
        unit={effectiveUnit}
        sizeFinderEnabled={false}
        productMock={mockProduct}
        device={device}
      />
    )
  };

  return (
    <SetupLayout
      currentStep={3}
      totalSteps={4}
      title="Choose how it shows"
      description="Set where the guide appears on the product page. The preview updates as you choose."
      onBack={handleBack}
      onContinue={handleContinue}
      previewContent={previewConfig}
    >
      <div className={styles.optionsStack}>
        <h3 className={styles.sectionLabel}>Placement</h3>
        {placementOptions.map((opt) => (
          <PlacementOptionCard
            key={opt.id}
            selected={selectedPlacement === opt.id}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
            onClick={() => setSelectedPlacement(opt.id)}
          />
        ))}
      </div>

      {showButtonLabelInput && (
        <div className={styles.inputSection}>
          <TextField
            label="Button label"
            value={buttonLabel}
            onChange={setButtonLabel}
            helperText="On phones the chart opens as a full-width sheet. Try the mobile toggle in the preview."
          />
        </div>
      )}
    </SetupLayout>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
