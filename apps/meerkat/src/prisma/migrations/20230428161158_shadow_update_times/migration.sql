-- AlterTable
ALTER TABLE `OperationalBinding` ADD COLUMN `local_last_update` DATETIME(3) NULL,
    ADD COLUMN `remote_last_update` DATETIME(3) NULL;
