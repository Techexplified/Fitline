/* global process */
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useFetcher, data } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import SetupLayout from "../components/SetupLayout/SetupLayout";
import RecommendationResult from "../components/RecommendationResult/RecommendationResult";
import Button from "../components/Button/Button";
import { getRecommendedSize } from "../utils/sizeRecommendation";
import styles from "../components/app.fit.module.css";

const sampleApparelChart = {
  unit: "cm",
  rowLabelHeader: "Size",
  columns: ["Chest", "Waist", "Length"],
  rows: [
    { label: "XS", values: { Chest: 86, Waist: 71, Length: 66 } },
    { label: "S",  values: { Chest: 91, Waist: 76, Length: 68 } },
    { label: "M",  values: { Chest: 97, Waist: 81, Length: 70 } },
    { label: "L",  values: { Chest: 104, Waist: 86, Length: 72 } },
    { label: "XL", values: { Chest: 112, Waist: 94, Length: 74 } },
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

export const action = async ({ request }) => {
  let shopDomain = "mock-shop.myshopify.com";
  try {
    const { session } = await authenticate.admin(request);
    shopDomain = session.shop;
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      throw error;
    }
  }

  const formData = await request.formData();
  const payload = JSON.parse(formData.get("payload"));

  const {
    selectedOption,        // "all" | "specific"
    selectedProductIds,    // string[] of gid://shopify/Product/...
    selectedTemplateId,
    resolvedTemplateLabel,
    chartData,              // { columns: string[], rows: [...] }
    unit,
    selectedPlacement,      // "popup" | "inline" | "floating"
    buttonLabel,
    recommendEnabled,
  } = payload;

  // TODO (future pass): when selectedOption === "all", enforce the rule that
  // only one published "all products" guide can exist per shop — find any
  // existing SizeGuide for this shop with productScope "all" and status
  // "published", and demote it to "draft" before publishing this one.
  // Not implemented yet — this pass only handles productScope "specific".

  const shopRecord = await prisma.shop.upsert({
    where: { domain: shopDomain },
    create: { domain: shopDomain },
    update: {},
  });

  if (payload.selectedOption === "all") {
    const existing = await prisma.sizeGuide.findFirst({
      where: { shopId: shopRecord.id, productScope: "all" },
    });
    if (existing) {
      return data(
        { error: "An all-products size guide already exists for this shop.", existingGuideId: existing.id },
        { status: 409 }
      );
    }
  }

  const sizeGuide = await prisma.sizeGuide.create({
    data: {
      shopId: shopRecord.id,
      name: resolvedTemplateLabel,
      templateId: selectedTemplateId,
      templateLabel: resolvedTemplateLabel,
      unit,
      columns: chartData.columns,
      rows: chartData.rows,
      productScope: selectedOption,
      displayPlacement: selectedPlacement,
      buttonLabel,
      sizeFinderEnabled: recommendEnabled,
      status: "published",
      publishedAt: new Date(),
    },
  });

  if (selectedOption === "specific" && Array.isArray(selectedProductIds) && selectedProductIds.length > 0) {
    await prisma.sizeGuideProduct.createMany({
      data: selectedProductIds.map((shopifyProductId) => ({
        sizeGuideId: sizeGuide.id,
        shopifyProductId,
      })),
      skipDuplicates: true,
    });
  }

  return data({ sizeGuideId: sizeGuide.id });
};

export default function FitSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const [enabled, setEnabled] = useState(true);
  const [chest, setChest] = useState("90");
  const [waist, setWaist] = useState("78");
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [publishError, setPublishError] = useState(null);

  const handleBack = () => {
    navigate("/app/display");
  };

  const handlePublish = () => {
    setPublishError(null);
    const payload = {
      ...location.state,
      recommendEnabled: enabled,
    };
    fetcher.submit(
      { payload: JSON.stringify(payload) },
      { method: "post" }
    );
  };

  useEffect(() => {
    if (fetcher.data?.sizeGuideId) {
      const summaryState = {
        sizeGuideId: fetcher.data.sizeGuideId,
        products: location.state?.products || { 
          title: location.state?.selectedOption === "all" ? "All products" : "Specific products", 
          description: location.state?.selectedOption === "all" ? "Applies across your catalog" : `${location.state?.selectedProductIds?.length || 0} products selected`
        },
        chart: { 
          templateLabel: location.state?.resolvedTemplateLabel || "Apparel", 
          sizeCount: location.state?.chartData?.rows?.length || 0, 
          measurementCount: location.state?.chartData?.columns?.length || 0 
        },
        display: { 
          placementLabel: location.state?.display?.placementLabel || (location.state?.selectedPlacement === "popup" ? "Popup dialog" : location.state?.selectedPlacement === "inline" ? "Inline block" : "Floating tab"),
          buttonLabel: location.state?.buttonLabel || "Size guide" 
        },
        sizeFinderEnabled: enabled,
      };
      navigate("/app/published", { state: summaryState });
    } else if (fetcher.data?.error) {
      setPublishError(fetcher.data.error);
    }
  }, [fetcher.data, location.state, enabled, navigate]);

  const handleRecommend = () => {
    setIsRecommending(true);
    setTimeout(() => {
      const result = getRecommendedSize(sampleApparelChart, { chest, waist });
      setRecommendationResult(result);
      setIsRecommending(false);
    }, 600); // Artificial delay to simulate processing
  };

  const isPublishing = fetcher.state !== "idle";

  return (
    <SetupLayout
      currentStep={4}
      totalSteps={4}
      title="Recommend a size"
      description="Shoppers enter a measurement or two and get a suggested size. Swap this rule for your own model later — the inputs stay the same."
      onBack={handleBack}
      onContinue={handlePublish}
      continueLabel="Publish size guide"
      continueLoading={isPublishing}
      continueLoadingText="Publishing..."
      previewContent={{
        placement: location.state?.selectedPlacement || "floating",
        buttonLabel: location.state?.buttonLabel || "Size guide"
      }}
    >
      {/* Enable Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerText}>
          <h4 className={styles.bannerTitle}>Enable &ldquo;Recommend a size&rdquo; on your store</h4>
          <p className={styles.bannerDescription}>
            When enabled, shoppers can enter their measurements on the product page and get a suggested size.
          </p>
        </div>
        <label className={styles.switch} htmlFor="recommend-toggle" aria-label="Toggle size recommendations">
          <input 
            id="recommend-toggle"
            type="checkbox" 
            checked={enabled} 
            onChange={() => setEnabled(!enabled)} 
          />
          <span className={styles.slider} />
        </label>
      </div>

      {/* Shopper Simulation Section */}
      <div className={styles.simulationSection}>
        <h4 className={styles.formHeading}>Try it as a shopper would</h4>
        
        <div className={styles.formRow}>
          <div className={styles.inputCol}>
            <label className={styles.inputLabel} htmlFor="chest-input">Chest / bust</label>
            <div className={styles.inputWrapper}>
              <input 
                id="chest-input"
                type="text" 
                value={chest} 
                onChange={(e) => setChest(e.target.value)} 
                className={styles.formInput} 
              />
              <span className={styles.unitBadge}>cm</span>
            </div>
          </div>

          <div className={styles.inputCol}>
            <label className={styles.inputLabel} htmlFor="waist-input">
              Waist <span className={styles.optionalText}>optional</span>
            </label>
            <div className={styles.inputWrapper}>
              <input 
                id="waist-input"
                type="text" 
                value={waist} 
                onChange={(e) => setWaist(e.target.value)} 
                className={styles.formInput} 
              />
              <span className={styles.unitBadge}>cm</span>
            </div>
          </div>
        </div>

        <div className={styles.buttonSection}>
          <Button 
            onClick={handleRecommend} 
            fullWidth={true}
            loading={isRecommending}
            loadingText="Recommending..."
          >
            Recommend my size
          </Button>
        </div>

        {recommendationResult && (
          <RecommendationResult 
            size={recommendationResult.size} 
            reason={recommendationResult.reason} 
            confidence={recommendationResult.confidence} 
          />
        )}
      </div>

      {publishError && (
        <div style={{
          color: '#991b1b',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '13px',
          fontFamily: "'Inter', sans-serif",
          marginTop: '16px',
          lineHeight: '1.4'
        }}>
          {publishError}
        </div>
      )}
    </SetupLayout>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
