/*
  Warnings:

  - You are about to drop the column `communicationsNetwork` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode3c` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode3n` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `countryName` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `dc` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `epcInUrn` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `intEmail` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `jid` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `messageDigest` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `objectIdentifier` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `oidC` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `oidC1` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `oidC2` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `organizationIdentifier` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `tagOid` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `uiiInUrn` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `urnC` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `utmCoordinates_id` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the `UtmCoordinate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Entry` DROP FOREIGN KEY `Entry_ibfk_3`;

-- AlterTable
ALTER TABLE `Entry` DROP COLUMN `communicationsNetwork`,
    DROP COLUMN `contentType`,
    DROP COLUMN `countryCode3c`,
    DROP COLUMN `countryCode3n`,
    DROP COLUMN `countryName`,
    DROP COLUMN `dc`,
    DROP COLUMN `epcInUrn`,
    DROP COLUMN `intEmail`,
    DROP COLUMN `jid`,
    DROP COLUMN `messageDigest`,
    DROP COLUMN `objectIdentifier`,
    DROP COLUMN `oidC`,
    DROP COLUMN `oidC1`,
    DROP COLUMN `oidC2`,
    DROP COLUMN `organizationIdentifier`,
    DROP COLUMN `tagOid`,
    DROP COLUMN `uiiInUrn`,
    DROP COLUMN `urnC`,
    DROP COLUMN `utmCoordinates_id`,
    ADD COLUMN `uniqueIdentifier` LONGBLOB;

-- DropTable
DROP TABLE `UtmCoordinate`;
