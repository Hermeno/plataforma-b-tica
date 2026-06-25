-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "cpf" DROP NOT NULL,
ALTER COLUMN "birthDate" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "rolloverCompleted" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "rolloverRequired" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "depositAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "wageredAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "bonusPaidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referredId_key" ON "referrals"("referredId");

-- CreateIndex
CREATE INDEX "referrals_referrerId_idx" ON "referrals"("referrerId");
