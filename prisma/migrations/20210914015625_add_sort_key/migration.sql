/*
  Warnings:

  - You are about to drop the column `deleteTimestamp` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `hint` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `visible_to_ldap` on the `AttributeValue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AttributeValue` DROP COLUMN `deleteTimestamp`,
    DROP COLUMN `hint`,
    DROP COLUMN `visible_to_ldap`,
    ADD COLUMN `sort_key` INTEGER;

-- AlterTable
ALTER TABLE `PwdDictionaries` MODIFY `value` MEDIUMTEXT NOT NULL;

-- CreateIndex
CREATE INDEX `AttributeValue.type_sort_key_index` ON `AttributeValue`(`type`, `sort_key`);

-- RenameIndex
ALTER TABLE `AttributeValue` RENAME INDEX `entry_id` TO `AttributeValue.entry_id_index`;
