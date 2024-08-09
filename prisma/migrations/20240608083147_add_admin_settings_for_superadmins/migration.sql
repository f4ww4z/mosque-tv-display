-- AlterTable
ALTER TABLE "Masjid" ADD COLUMN     "whatsappGroupLink" TEXT,
ALTER COLUMN "registrationNumber" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AdminSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "monthlyFee" DOUBLE PRECISION NOT NULL DEFAULT 150,
    "yearlyFee" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "features" TEXT[],

    CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
);
