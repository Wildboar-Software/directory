-- AlterTable
ALTER TABLE `ContextDescription` ADD COLUMN `absentMatch` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `defaultValue` LONGBLOB NULL;
