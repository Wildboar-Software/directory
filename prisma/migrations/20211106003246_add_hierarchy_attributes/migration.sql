/*
  Warnings:

  - A unique constraint covering the columns `[dseUUID]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - The required column `dseUUID` was added to the `Entry` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Entry` ADD COLUMN `dseUUID` VARCHAR(191) NOT NULL,
    ADD COLUMN `hierarchyLevel` INTEGER NULL,
    ADD COLUMN `hierarchyParent` JSON NULL,
    ADD COLUMN `hierarchyPath` VARCHAR(191) NULL,
    ADD COLUMN `hierarchyTop` JSON NULL,
    ADD COLUMN `lastShadowUpdate` DATETIME(3) NULL,
    MODIFY `createdTimestamp` DATETIME(3) NULL,
    MODIFY `modifyTimestamp` DATETIME(3) NULL,
    MODIFY `creatorsName` JSON NULL,
    MODIFY `modifiersName` JSON NULL,
    MODIFY `entryUUID` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Entry_dseUUID_key` ON `Entry`(`dseUUID`);
