import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { data } from "react-router";

export const loader = async ({ request }) => {
  // const { session } = await authenticate.public.appProxy(request);

  // if (!session) {
  //   return data({ guide: null }, { status: 200 });
  // }
  let session;
  try {
    ({ session } = await authenticate.public.appProxy(request));
  } catch (error) {
    return data({ guide: null }, { status: 200 });
  }

  const url = new URL(request.url);
  const shopifyProductId = url.searchParams.get("productId");

  if (!shopifyProductId) {
    return data({ error: "Missing productId" }, { status: 400 });
  }

  const shopRecord = await prisma.shop.findUnique({
    where: { domain: session.shop },
  });

  if (!shopRecord) {
    return data({ guide: null }, { status: 200 });
  }

  // Look for a guide specifically attached to this product first
  const specificMatch = await prisma.sizeGuideProduct.findFirst({
    where: {
      shopifyProductId,
      sizeGuide: { shopId: shopRecord.id, status: "published" },
    },
    include: { sizeGuide: true },
  });

  let guide = specificMatch?.sizeGuide ?? null;

  // Fall back to an "all products" guide if no specific match exists
  if (!guide) {
    guide = await prisma.sizeGuide.findFirst({
      where: { shopId: shopRecord.id, productScope: "all", status: "published" },
    });
  }

  if (!guide) {
    return data({ guide: null }, { status: 200 });
  }

  return data({
    guide: {
      unit: guide.unit,
      columns: guide.columns,
      rows: guide.rows,
      displayPlacement: guide.displayPlacement,
      buttonLabel: guide.buttonLabel,
      sizeFinderEnabled: guide.sizeFinderEnabled,
      templateLabel: guide.templateLabel,
    },
  });
};
