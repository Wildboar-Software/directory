/*
  Warnings:

  - You are about to drop the `PasswordRecentlyExpired` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdAccountLockedTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdChangeAllowed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdChangedTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdDictionaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdEndTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdExpiryAge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdExpiryTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdExpiryWarning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdFails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdFailureCountInterval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdFailureDuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdFailureTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdGraceUseTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdGraces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdGracesUsed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdGracyExpiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdHistorySlots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdLastSuccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdLockout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdLockoutDuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMaxAge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMaxDelay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMaxFailures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMaxIdle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMaxTimeInHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMinAge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMinDelay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMinLength` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMinTimeInHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdModifyEntryAllowed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdMustChange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdRecentlyExpiredDuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdReset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdSafeModify` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdStartTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PwdVocabulary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PasswordRecentlyExpired` DROP FOREIGN KEY `PasswordRecentlyExpired_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdAccountLockedTime` DROP FOREIGN KEY `PwdAccountLockedTime_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdAttribute` DROP FOREIGN KEY `PwdAttribute_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdChangeAllowed` DROP FOREIGN KEY `PwdChangeAllowed_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdChangedTime` DROP FOREIGN KEY `PwdChangedTime_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdDictionaries` DROP FOREIGN KEY `PwdDictionaries_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdEndTime` DROP FOREIGN KEY `PwdEndTime_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdExpiryAge` DROP FOREIGN KEY `PwdExpiryAge_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdExpiryTime` DROP FOREIGN KEY `PwdExpiryTime_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdExpiryWarning` DROP FOREIGN KEY `PwdExpiryWarning_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdFails` DROP FOREIGN KEY `PwdFails_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdFailureCountInterval` DROP FOREIGN KEY `PwdFailureCountInterval_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdFailureDuration` DROP FOREIGN KEY `PwdFailureDuration_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdFailureTime` DROP FOREIGN KEY `PwdFailureTime_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdGraceUseTime` DROP FOREIGN KEY `PwdGraceUseTime_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdGraces` DROP FOREIGN KEY `PwdGraces_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdGracesUsed` DROP FOREIGN KEY `PwdGracesUsed_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdGracyExpiry` DROP FOREIGN KEY `PwdGracyExpiry_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdHistorySlots` DROP FOREIGN KEY `PwdHistorySlots_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdLastSuccess` DROP FOREIGN KEY `PwdLastSuccess_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdLockout` DROP FOREIGN KEY `PwdLockout_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdLockoutDuration` DROP FOREIGN KEY `PwdLockoutDuration_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxAge` DROP FOREIGN KEY `PwdMaxAge_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxDelay` DROP FOREIGN KEY `PwdMaxDelay_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxFailures` DROP FOREIGN KEY `PwdMaxFailures_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxIdle` DROP FOREIGN KEY `PwdMaxIdle_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMaxTimeInHistory` DROP FOREIGN KEY `PwdMaxTimeInHistory_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMinAge` DROP FOREIGN KEY `PwdMinAge_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMinDelay` DROP FOREIGN KEY `PwdMinDelay_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMinLength` DROP FOREIGN KEY `PwdMinLength_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMinTimeInHistory` DROP FOREIGN KEY `PwdMinTimeInHistory_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdModifyEntryAllowed` DROP FOREIGN KEY `PwdModifyEntryAllowed_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdMustChange` DROP FOREIGN KEY `PwdMustChange_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdRecentlyExpiredDuration` DROP FOREIGN KEY `PwdRecentlyExpiredDuration_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdReset` DROP FOREIGN KEY `PwdReset_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdSafeModify` DROP FOREIGN KEY `PwdSafeModify_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdStartTime` DROP FOREIGN KEY `PwdStartTime_entry_id_fkey`;

-- DropForeignKey
ALTER TABLE `PwdVocabulary` DROP FOREIGN KEY `PwdVocabulary_entry_id_fkey`;

-- AlterTable
ALTER TABLE `AttributeValue` ADD COLUMN `operational` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `PasswordRecentlyExpired`;

-- DropTable
DROP TABLE `PwdAccountLockedTime`;

-- DropTable
DROP TABLE `PwdAttribute`;

-- DropTable
DROP TABLE `PwdChangeAllowed`;

-- DropTable
DROP TABLE `PwdChangedTime`;

-- DropTable
DROP TABLE `PwdDictionaries`;

-- DropTable
DROP TABLE `PwdEndTime`;

-- DropTable
DROP TABLE `PwdExpiryAge`;

-- DropTable
DROP TABLE `PwdExpiryTime`;

-- DropTable
DROP TABLE `PwdExpiryWarning`;

-- DropTable
DROP TABLE `PwdFails`;

-- DropTable
DROP TABLE `PwdFailureCountInterval`;

-- DropTable
DROP TABLE `PwdFailureDuration`;

-- DropTable
DROP TABLE `PwdFailureTime`;

-- DropTable
DROP TABLE `PwdGraceUseTime`;

-- DropTable
DROP TABLE `PwdGraces`;

-- DropTable
DROP TABLE `PwdGracesUsed`;

-- DropTable
DROP TABLE `PwdGracyExpiry`;

-- DropTable
DROP TABLE `PwdHistorySlots`;

-- DropTable
DROP TABLE `PwdLastSuccess`;

-- DropTable
DROP TABLE `PwdLockout`;

-- DropTable
DROP TABLE `PwdLockoutDuration`;

-- DropTable
DROP TABLE `PwdMaxAge`;

-- DropTable
DROP TABLE `PwdMaxDelay`;

-- DropTable
DROP TABLE `PwdMaxFailures`;

-- DropTable
DROP TABLE `PwdMaxIdle`;

-- DropTable
DROP TABLE `PwdMaxTimeInHistory`;

-- DropTable
DROP TABLE `PwdMinAge`;

-- DropTable
DROP TABLE `PwdMinDelay`;

-- DropTable
DROP TABLE `PwdMinLength`;

-- DropTable
DROP TABLE `PwdMinTimeInHistory`;

-- DropTable
DROP TABLE `PwdModifyEntryAllowed`;

-- DropTable
DROP TABLE `PwdMustChange`;

-- DropTable
DROP TABLE `PwdRecentlyExpiredDuration`;

-- DropTable
DROP TABLE `PwdReset`;

-- DropTable
DROP TABLE `PwdSafeModify`;

-- DropTable
DROP TABLE `PwdStartTime`;

-- DropTable
DROP TABLE `PwdVocabulary`;
