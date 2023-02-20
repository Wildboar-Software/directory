/*
  Warnings:

  - A unique constraint covering the columns `[c2c,st,locality,postal_code]` on the table `PostalCodesGazetteEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `PostalCodesGazetteEntry_c2c_st_locality_key` ON `PostalCodesGazetteEntry`;

-- CreateIndex
CREATE UNIQUE INDEX `PostalCodesGazetteEntry_c2c_st_locality_postal_code_key` ON `PostalCodesGazetteEntry`(`c2c`, `st`, `locality`, `postal_code`);
