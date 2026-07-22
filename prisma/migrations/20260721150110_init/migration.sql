-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SizeGuide" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateLabel" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'cm',
    "columns" JSONB NOT NULL,
    "rows" JSONB NOT NULL,
    "productScope" TEXT NOT NULL,
    "displayPlacement" TEXT NOT NULL,
    "buttonLabel" TEXT NOT NULL DEFAULT 'Size guide',
    "sizeFinderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SizeGuideProduct" (
    "id" TEXT NOT NULL,
    "sizeGuideId" TEXT NOT NULL,
    "shopifyProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SizeGuideProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_domain_key" ON "Shop"("domain");

-- CreateIndex
CREATE INDEX "SizeGuide_shopId_idx" ON "SizeGuide"("shopId");

-- CreateIndex
CREATE INDEX "SizeGuide_shopId_status_idx" ON "SizeGuide"("shopId", "status");

-- CreateIndex
CREATE INDEX "SizeGuideProduct_shopifyProductId_idx" ON "SizeGuideProduct"("shopifyProductId");

-- CreateIndex
CREATE UNIQUE INDEX "SizeGuideProduct_sizeGuideId_shopifyProductId_key" ON "SizeGuideProduct"("sizeGuideId", "shopifyProductId");

-- AddForeignKey
ALTER TABLE "SizeGuide" ADD CONSTRAINT "SizeGuide_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SizeGuideProduct" ADD CONSTRAINT "SizeGuideProduct_sizeGuideId_fkey" FOREIGN KEY ("sizeGuideId") REFERENCES "SizeGuide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
