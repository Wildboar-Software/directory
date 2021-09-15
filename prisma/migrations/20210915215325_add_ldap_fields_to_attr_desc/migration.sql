-- AlterTable
ALTER TABLE `AttributeTypeDescription` ADD COLUMN `ldapDescription` VARCHAR(191),
    ADD COLUMN `ldapNames` VARCHAR(191),
    ADD COLUMN `ldapSyntax` VARCHAR(191);
