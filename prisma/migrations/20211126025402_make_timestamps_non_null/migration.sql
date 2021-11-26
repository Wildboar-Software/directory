/*
  Warnings:

  - Made the column `createdTimestamp` on table `Entry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modifyTimestamp` on table `Entry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `OperationalBinding` DROP FOREIGN KEY `OperationalBinding_access_point_id_fkey`;

-- AlterTable
ALTER TABLE `Entry` MODIFY `createdTimestamp` DATETIME(3) NOT NULL,
    MODIFY `modifyTimestamp` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `OperationalBinding` MODIFY `access_point_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
