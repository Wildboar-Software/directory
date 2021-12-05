/*
  Warnings:

  - You are about to drop the column `ber` on the `Clearance` table. All the data in the column will be lost.
  - You are about to drop the column `security_categories_covered` on the `Clearance` table. All the data in the column will be lost.
  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RDN` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhitelistedOperationalBinding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `RDN` DROP FOREIGN KEY `RDN_entry_id_fkey`;

-- AlterTable
ALTER TABLE `Clearance` DROP COLUMN `ber`,
    DROP COLUMN `security_categories_covered`,
    MODIFY `unmarked` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `unclassified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `restricted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `confidential` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `secret` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `topSecret` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Certificate`;

-- DropTable
DROP TABLE `RDN`;

-- DropTable
DROP TABLE `WhitelistedOperationalBinding`;

-- CreateTable
CREATE TABLE `ClearanceSecurityCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clearance_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` LONGBLOB NOT NULL,

    INDEX `ClearanceSecurityCategory_clearance_id_idx`(`clearance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DistinguishedValue` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` LONGBLOB NOT NULL,
    `str` VARCHAR(191) NULL,

    UNIQUE INDEX `DistinguishedValue_entry_id_type_key`(`entry_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClearanceSecurityCategory` ADD CONSTRAINT `ClearanceSecurityCategory_clearance_id_fkey` FOREIGN KEY (`clearance_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DistinguishedValue` ADD CONSTRAINT `DistinguishedValue_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
