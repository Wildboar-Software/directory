/*
  Warnings:

  - You are about to drop the column `attribute_values_incomplete` on the `Entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Entry` DROP COLUMN `attribute_values_incomplete`;

-- CreateTable
CREATE TABLE `EntryAttributeValuesIncomplete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `attribute_type` VARCHAR(128) NOT NULL,

    UNIQUE INDEX `EntryAttributeValuesIncomplete_entry_id_attribute_type_key`(`entry_id`, `attribute_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EntryAttributeValuesIncomplete` ADD CONSTRAINT `EntryAttributeValuesIncomplete_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
