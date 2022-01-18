-- AlterTable
ALTER TABLE `Entry` ADD COLUMN `modifyNameTimestamp` DATETIME(3) NULL,
    ADD COLUMN `previousName` JSON NULL;
