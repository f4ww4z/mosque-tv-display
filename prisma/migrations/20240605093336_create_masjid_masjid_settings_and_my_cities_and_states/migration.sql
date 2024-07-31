/*
  Warnings:

  - The values [USER,ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `masjidId` to the `CarouselItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SettingName" AS ENUM ('TIME_UNTIL_IQAMAH', 'NOTIFY_PRAYER_TIME_SOUND', 'TIME_UNTIL_PRAYER_ENDS', 'TIME_BETWEEN_SLIDESHOWS');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('MASJID_ADMIN', 'SUPERADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MASJID_ADMIN';
COMMIT;

-- AlterTable
ALTER TABLE "CarouselItem" ADD COLUMN     "masjidId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "masjidId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'MASJID_ADMIN';

-- DropTable
DROP TABLE "Settings";

-- CreateTable
CREATE TABLE "MYState" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MYState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MYZone" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "MYZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MYCity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" INTEGER NOT NULL,

    CONSTRAINT "MYCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Masjid" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,

    CONSTRAINT "Masjid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasjidSetting" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" "SettingName" NOT NULL,
    "value" TEXT NOT NULL,
    "masjidId" TEXT NOT NULL,

    CONSTRAINT "MasjidSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MYState_name_key" ON "MYState"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MYZone_code_key" ON "MYZone"("code");

-- AddForeignKey
ALTER TABLE "MYZone" ADD CONSTRAINT "MYZone_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "MYState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MYCity" ADD CONSTRAINT "MYCity_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "MYZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_masjidId_fkey" FOREIGN KEY ("masjidId") REFERENCES "Masjid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Masjid" ADD CONSTRAINT "Masjid_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "MYCity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasjidSetting" ADD CONSTRAINT "MasjidSetting_masjidId_fkey" FOREIGN KEY ("masjidId") REFERENCES "Masjid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarouselItem" ADD CONSTRAINT "CarouselItem_masjidId_fkey" FOREIGN KEY ("masjidId") REFERENCES "Masjid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
