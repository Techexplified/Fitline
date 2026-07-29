/* global process */
import { useLoaderData, Link } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import Button from "../components/Button/Button";
import SizeGuideListCard from "../components/SizeGuideListCard/SizeGuideListCard";
import styles from "../components/app.dashboard.module.css";

export const loader = async ({ request }) => {
  let shopDomain = "mock-shop.myshopify.com";
  try {
    const { session } = await authenticate.admin(request);
    shopDomain = session.shop;
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      throw error;
    }
  }

  const shopRecord = await prisma.shop.findUnique({ where: { domain: shopDomain } });

  const guides = shopRecord
    ? await prisma.sizeGuide.findMany({
        where: { shopId: shopRecord.id },
        orderBy: { updatedAt: "desc" },
        include: { products: true },
      })
    : [];

  return { guides };
};

export default function AppDashboard() {
  const { guides } = useLoaderData();

  const guidesCountText = guides.length === 1 ? "1 guide" : `${guides.length} guides`;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardWidth}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Your size guides</h1>
            <span className={styles.countBadge}>{guidesCountText}</span>
          </div>
          <p className={styles.subtitle}>Every size guide you&apos;ve published, in one place.</p>
        </header>

        {/* Content list or Empty State */}
        {guides.length > 0 ? (
          <div className={styles.card}>
            {guides.map((guide) => (
              <SizeGuideListCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyStateCard}>
            <p className={styles.emptyText}>No size guides yet.</p>
            <Link to="/app/chooseprod" className={styles.emptyBtnLink}>
              <Button variant="primary">Create size guide</Button>
            </Link>
          </div>
        )}

        {/* Footer info note */}
        <footer className={styles.footer}>
          <span className={styles.dot}>&bull;</span>
          <span className={styles.footerText}>
            Need a new one?{" "}
            <Link to="/app/chooseprod" className={styles.footerLink}>
              Start the setup wizard to add another size guide
            </Link>
            .
          </span>
        </footer>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return boundary.error();
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
