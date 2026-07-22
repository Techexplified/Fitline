/* global process */
import { useState } from "react";
import { useNavigate, useLoaderData, useLocation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import SetupLayout from "../components/SetupLayout/SetupLayout";
import SelectableCard from "../components/SelectableCard/SelectableCard";
import ProductPicker from "../components/ProductPicker/ProductPicker";
import styles from "../components/app.chooseprod.module.css";

// Helper to provide realistic mock products for local development environments
function getMockProducts() {
  return [
    {
      id: "gid://shopify/Product/1",
      title: "Heavyweight Boxy Tee",
      productType: "Tops",
      imageUrl: null,
      variantCount: 4,
      price: "48.00",
      currencyCode: "USD",
    },
    {
      id: "gid://shopify/Product/2",
      title: "Ribbed Tank Top",
      productType: "Tops",
      imageUrl: null,
      variantCount: 5,
      price: "32.00",
      currencyCode: "USD",
    },
    {
      id: "gid://shopify/Product/3",
      title: "Oversized Hoodie",
      productType: "Outerwear",
      imageUrl: null,
      variantCount: 4,
      price: "88.00",
      currencyCode: "USD",
    },
    {
      id: "gid://shopify/Product/4",
      title: "Relaxed Linen Shirt",
      productType: "Tops",
      imageUrl: null,
      variantCount: 5,
      price: "72.00",
      currencyCode: "USD",
    },
    {
      id: "gid://shopify/Product/5",
      title: "Cropped Knit Sweater",
      productType: "Knitwear",
      imageUrl: null,
      variantCount: 4,
      price: "64.00",
      currencyCode: "USD",
    },
    {
      id: "gid://shopify/Product/6",
      title: "Wide-Leg Trouser",
      productType: "Bottoms",
      imageUrl: null,
      variantCount: 6,
      price: "96.00",
      currencyCode: "USD",
    },
  ];
}

export const loader = async ({ request }) => {
  let admin;
  let session;
  try {
    const authResult = await authenticate.admin(request);
    admin = authResult.admin;
    session = authResult.session;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Authentication failed, falling back to mock products in local dev:", error);
      return { products: getMockProducts(), existingAllProductsGuide: null };
    }
    throw error;
  }

  let existingAllProductsGuide = null;
  if (session?.shop) {
    const shopRecord = await prisma.shop.findUnique({ where: { domain: session.shop } });
    existingAllProductsGuide = shopRecord
      ? await prisma.sizeGuide.findFirst({
          where: { shopId: shopRecord.id, productScope: "all" },
          select: { id: true, name: true, updatedAt: true },
        })
      : null;
  }

  try {
    // Note: Shops with more than 50 products will need cursor-based pagination
    // (using pageInfo.hasNextPage / after cursor) added to this query in the future.
    const response = await admin.graphql(`
      query GetProducts($first: Int!, $query: String) {
        products(first: $first, query: $query, sortKey: TITLE) {
          edges {
            node {
              id
              title
              productType
              featuredImage {
                url
                altText
              }
              variantsCount {
                count
              }
              priceRangeV2 {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `, {
      variables: {
        first: 50,
      },
    });

    const responseJson = await response.json();
    const edges = responseJson.data?.products?.edges || [];

    const products = edges.map(({ node }) => ({
      id: node.id, // Keep exact "gid://shopify/Product/..." format for SizeGuideProduct
      title: node.title,
      productType: node.productType || "Uncategorized",
      imageUrl: node.featuredImage?.url ?? null,
      variantCount: node.variantsCount?.count ?? 0,
      price: node.priceRangeV2?.minVariantPrice?.amount,
      currencyCode: node.priceRangeV2?.minVariantPrice?.currencyCode,
    }));

    return { products, existingAllProductsGuide };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to query real Shopify products, falling back to mock products:", error);
      return { products: getMockProducts(), existingAllProductsGuide };
    }
    throw error;
  }
};

export default function ChooseProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const loaderData = useLoaderData() || {};
  const products = loaderData.products || [];
  const existingAllProductsGuide = loaderData.existingAllProductsGuide || null;

  // Initialize selected option & products from history if navigating back
  const [selectedOption, setSelectedOption] = useState(() => {
    const forwardedOption = location.state?.products?.selectedOption;
    // If an all-products size guide exists, "all" is disabled. Force to "specific" to prevent bypassing the check.
    if (existingAllProductsGuide && (forwardedOption === "all" || !forwardedOption)) {
      return "specific";
    }
    return forwardedOption || "all";
  });
  const [selectedProductIds, setSelectedProductIds] = useState(() => {
    return location.state?.products?.selectedProductIds || [];
  });

  const handleBack = () => {
    navigate("/app");
  };

  const handleContinue = () => {
    // Prevent routing if invalid
    if (selectedOption === "all" && existingAllProductsGuide) {
      return;
    }
    if (selectedOption === "specific" && selectedProductIds.length === 0) {
      return;
    }

    navigate("/app/chart", {
      state: {
        products: {
          title: selectedOption === "all" ? "All products" : "Specific products",
          description: selectedOption === "all" ? "Applies across your catalog" : `${selectedProductIds.length} products selected`,
          selectedOption,
          selectedProductIds,
        },
        selectedOption,
        selectedProductIds,
      }
    });
  };

  const handleToggleProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (alreadyAllSelected, filteredIds) => {
    if (alreadyAllSelected) {
      // Deselect all filtered ids
      setSelectedProductIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered ids (avoid duplicates)
      setSelectedProductIds((prev) => {
        const next = [...prev];
        filteredIds.forEach((id) => {
          if (!next.includes(id)) {
            next.push(id);
          }
        });
        return next;
      });
    }
  };

  // Continue is disabled if specific option selected but no products checked
  const continueDisabled = selectedOption === "specific" && selectedProductIds.length === 0;

  return (
    <SetupLayout
      currentStep={1}
      totalSteps={4}
      title="Choose products"
      description="Decide where this size guide appears. Apply it to your whole catalog, or pick specific products."
      onBack={handleBack}
      onContinue={handleContinue}
      continueDisabled={continueDisabled}
    >
      <div className={styles.cardsRow}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SelectableCard
            selected={selectedOption === "all"}
            disabled={!!existingAllProductsGuide}
            title="All products"
            description="Show the guide on every product in your catalog."
            onClick={() => setSelectedOption("all")}
          />
          {existingAllProductsGuide && (
            <div style={{ 
              color: '#991b1b', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fee2e2', 
              borderRadius: '8px', 
              padding: '10px 14px', 
              fontSize: '13px',
              fontFamily: "'Inter', sans-serif",
              lineHeight: '1.4'
            }}>
              {/* TODO: link this to the dashboard's edit/delete flow once app.dashboard.jsx (or equivalent) is built */}
              You already have an all-products size guide (<strong>{existingAllProductsGuide.name}</strong>). Delete or edit it from your dashboard before creating a new one.
            </div>
          )}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <SelectableCard
            selected={selectedOption === "specific"}
            title="Specific products"
            description="Choose which products show the guide."
            onClick={() => setSelectedOption("specific")}
          />
        </div>
      </div>

      {selectedOption === "specific" && (
        <ProductPicker
          products={products}
          selectedIds={selectedProductIds}
          onToggleProduct={handleToggleProduct}
          onToggleSelectAll={handleToggleSelectAll}
        />
      )}
    </SetupLayout>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
