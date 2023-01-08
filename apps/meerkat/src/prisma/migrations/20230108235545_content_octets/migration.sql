/*
  Warnings:

  - You are about to drop the column `ber` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `privacy_mark` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `security_classification` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `security_label` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `security_policy_identifier` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the `ACIItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Clearance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClearanceSecurityCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntryAccessControlScheme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntryAdministrativeRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntryCollectiveExclusion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordEncryptionAlgorithm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubtreeSpecification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UniqueIdentifier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content_octets` to the `AttributeValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ACIItem` DROP FOREIGN KEY `ACIItem_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `Clearance` DROP FOREIGN KEY `Clearance_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `ClearanceSecurityCategory` DROP FOREIGN KEY `ClearanceSecurityCategory_clearance_id_fkey`;

-- DropForeignKey
ALTER TABLE `EntryAccessControlScheme` DROP FOREIGN KEY `EntryAccessControlScheme_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `EntryAdministrativeRole` DROP FOREIGN KEY `EntryAdministrativeRole_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `EntryCollectiveExclusion` DROP FOREIGN KEY `EntryCollectiveExclusion_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PasswordEncryptionAlgorithm` DROP FOREIGN KEY `PasswordEncryptionAlgorithm_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `SearchRule` DROP FOREIGN KEY `SearchRule_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `SubtreeSpecification` DROP FOREIGN KEY `SubtreeSpecification_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `UniqueIdentifier` DROP FOREIGN KEY `UniqueIdentifier_entry_id_fkey`;

-- DropIndex
DROP INDEX `Entry_immediate_superior_id_deleteTimestamp_subentry_idx` ON `Entry`;

-- AlterTable
ALTER TABLE `AttributeValue` DROP COLUMN `ber`,
    DROP COLUMN `privacy_mark`,
    DROP COLUMN `security_classification`,
    DROP COLUMN `security_label`,
    DROP COLUMN `security_policy_identifier`,
    ADD COLUMN `content_octets` LONGBLOB NOT NULL;

-- DropTable
DROP TABLE `ACIItem`;

-- DropTable
DROP TABLE `Clearance`;

-- DropTable
DROP TABLE `ClearanceSecurityCategory`;

-- DropTable
DROP TABLE `EntryAccessControlScheme`;

-- DropTable
DROP TABLE `EntryAdministrativeRole`;

-- DropTable
DROP TABLE `EntryCollectiveExclusion`;

-- DropTable
DROP TABLE `PasswordEncryptionAlgorithm`;

-- DropTable
DROP TABLE `SearchRule`;

-- DropTable
DROP TABLE `SubtreeSpecification`;

-- DropTable
DROP TABLE `UniqueIdentifier`;

-- CreateIndex
CREATE INDEX `Entry_immediate_superior_id_deleteTimestamp_expiresTimestamp_idx` ON `Entry`(`immediate_superior_id`, `deleteTimestamp`, `expiresTimestamp`, `subentry`);
