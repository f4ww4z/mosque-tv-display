-- CreateEnum
CREATE TYPE "MasjidType" AS ENUM ('SURAU', 'MASJID');

-- AlterTable
ALTER TABLE "Masjid" ADD COLUMN     "type" "MasjidType" NOT NULL DEFAULT 'SURAU';
