/*
  Warnings:

  - You are about to drop the column `password_id` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `noDictionaryWords` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `noGeographicalNames` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `noPersonNames` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdChangeAllowed` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdDictionaries` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdExpiryAge` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdExpiryWarning` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdFailureDuration` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdGraces` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdHistorySlots` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdLockoutDuration` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdMaxAge` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdMaxFailures` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdMaxTimeInHistory` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdMinLength` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdMinTimeInHistory` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdModifyEntryAllowed` on the `Password` table. All the data in the column will be lost.
  - You are about to drop the column `pwdRecentlyExpiredDuration` on the `Password` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[binding_type,binding_identifier,binding_version,terminated_time]` on the table `OperationalBinding` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entry_id]` on the table `Password` will be added. If there are existing duplicate values, this will fail.
  - Made the column `binding_identifier` on table `OperationalBinding` required. This step will fail if there are existing NULL values in that column.
  - Made the column `binding_version` on table `OperationalBinding` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `entry_id` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Entry` DROP FOREIGN KEY `Entry_ibfk_2`;

-- AlterTable
ALTER TABLE `Entry` DROP COLUMN `password_id`;

-- AlterTable
ALTER TABLE `OperationalBinding` MODIFY `binding_identifier` INTEGER NOT NULL,
    MODIFY `binding_version` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Password` DROP COLUMN `noDictionaryWords`,
    DROP COLUMN `noGeographicalNames`,
    DROP COLUMN `noPersonNames`,
    DROP COLUMN `pwdChangeAllowed`,
    DROP COLUMN `pwdDictionaries`,
    DROP COLUMN `pwdExpiryAge`,
    DROP COLUMN `pwdExpiryWarning`,
    DROP COLUMN `pwdFailureDuration`,
    DROP COLUMN `pwdGraces`,
    DROP COLUMN `pwdHistorySlots`,
    DROP COLUMN `pwdLockoutDuration`,
    DROP COLUMN `pwdMaxAge`,
    DROP COLUMN `pwdMaxFailures`,
    DROP COLUMN `pwdMaxTimeInHistory`,
    DROP COLUMN `pwdMinLength`,
    DROP COLUMN `pwdMinTimeInHistory`,
    DROP COLUMN `pwdModifyEntryAllowed`,
    DROP COLUMN `pwdRecentlyExpiredDuration`,
    ADD COLUMN `entry_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `PwdModifyEntryAllowed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `PwdModifyEntryAllowed.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdChangeAllowed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `PwdChangeAllowed.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMaxAge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMaxAge.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdExpiryAge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdExpiryAge.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMinLength` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMinLength.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoDictionaryWords` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `NoDictionaryWords.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoPersonNames` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `NoPersonNames.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoGeographicalNames` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `NoGeographicalNames.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdDictionaries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PwdDictionaries.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdExpiryWarning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdExpiryWarning.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdGraces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdGraces.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdFailureDuration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdFailureDuration.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdLockoutDuration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdLockoutDuration.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMaxFailures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMaxFailures.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMaxTimeInHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMaxTimeInHistory.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMinTimeInHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMinTimeInHistory.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdHistorySlots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdHistorySlots.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdRecentlyExpiredDuration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdRecentlyExpiredDuration.entry_id_unique`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `OperationalBinding.validity_end_validity_start_index` ON `OperationalBinding`(`validity_end`, `validity_start`);

-- CreateIndex
CREATE UNIQUE INDEX `OperationalBinding.binding_type_binding_identifier_binding_versi` ON `OperationalBinding`(`binding_type`, `binding_identifier`, `binding_version`, `terminated_time`);

-- CreateIndex
CREATE UNIQUE INDEX `Password.entry_id_unique` ON `Password`(`entry_id`);

-- AddForeignKey
ALTER TABLE `Password` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdModifyEntryAllowed` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdChangeAllowed` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxAge` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdExpiryAge` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMinLength` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoDictionaryWords` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoPersonNames` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoGeographicalNames` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdDictionaries` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdExpiryWarning` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdGraces` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdFailureDuration` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdLockoutDuration` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxFailures` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxTimeInHistory` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMinTimeInHistory` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdHistorySlots` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdRecentlyExpiredDuration` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
