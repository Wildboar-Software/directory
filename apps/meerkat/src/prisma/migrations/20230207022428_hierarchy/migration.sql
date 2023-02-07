-- AlterTable
ALTER TABLE `Entry` ADD COLUMN `hierarchyLevel` INTEGER NULL,
    ADD COLUMN `hierarchyParentStr` VARCHAR(2048) NULL,
    ADD COLUMN `hierarchyTopStr` VARCHAR(2048) NULL;
