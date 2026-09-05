-- CreateEnum
CREATE TYPE "WinnerStatus" AS ENUM ('ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_REQUESTED', 'PENDING', 'PASSED', 'FAILED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Winner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prizeTier" TEXT NOT NULL,
    "prizeName" TEXT NOT NULL,
    "status" "WinnerStatus" NOT NULL DEFAULT 'ACTIVE',
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Winner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycRequest" (
    "id" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "remarks" TEXT,

    CONSTRAINT "KycRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Winner_userId_key" ON "Winner"("userId");

-- CreateIndex
CREATE INDEX "Winner_prizeTier_idx" ON "Winner"("prizeTier");

-- CreateIndex
CREATE INDEX "Winner_status_idx" ON "Winner"("status");

-- CreateIndex
CREATE INDEX "Winner_kycStatus_idx" ON "Winner"("kycStatus");

-- CreateIndex
CREATE INDEX "KycRequest_winnerId_idx" ON "KycRequest"("winnerId");

-- CreateIndex
CREATE INDEX "KycRequest_status_idx" ON "KycRequest"("status");

-- AddForeignKey
ALTER TABLE "KycRequest" ADD CONSTRAINT "KycRequest_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Winner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
