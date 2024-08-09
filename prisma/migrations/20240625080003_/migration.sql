/*
  Warnings:

  - You are about to drop the column `name` on the `MasjidSetting` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `MasjidSetting` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[masjidId]` on the table `MasjidSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MasjidSetting" DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'ms',
ADD COLUMN     "newsTexts" TEXT[],
ADD COLUMN     "notifyPrayerTimeSound" TEXT NOT NULL DEFAULT '/sounds/azan1.wav',
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'teal',
ADD COLUMN     "timeBetweenSlideshows" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "timeUntilIqamah" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "timeUntilPrayerEnds" INTEGER NOT NULL DEFAULT 15;

-- DropEnum
DROP TYPE "SettingName";

-- CreateIndex
CREATE UNIQUE INDEX "MasjidSetting_masjidId_key" ON "MasjidSetting"("masjidId");
