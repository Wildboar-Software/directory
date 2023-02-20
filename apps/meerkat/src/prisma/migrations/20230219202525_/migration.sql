/*
  Warnings:

  - You are about to drop the column `c3c` on the `PostalCodesGazetteEntry` table. All the data in the column will be lost.
  - You are about to drop the column `c3n` on the `PostalCodesGazetteEntry` table. All the data in the column will be lost.
  - You are about to drop the column `locality_1` on the `PostalCodesGazetteEntry` table. All the data in the column will be lost.
  - You are about to drop the column `locality_2` on the `PostalCodesGazetteEntry` table. All the data in the column will be lost.
  - You are about to drop the column `locality_3` on the `PostalCodesGazetteEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[c2c,st,locality]` on the table `PostalCodesGazetteEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locality` to the `PostalCodesGazetteEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PostalCodesGazetteEntry` DROP COLUMN `c3c`,
    DROP COLUMN `c3n`,
    DROP COLUMN `locality_1`,
    DROP COLUMN `locality_2`,
    DROP COLUMN `locality_3`,
    ADD COLUMN `locality` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PostalCodesGazetteEntry_c2c_st_locality_key` ON `PostalCodesGazetteEntry`(`c2c`, `st`, `locality`);
