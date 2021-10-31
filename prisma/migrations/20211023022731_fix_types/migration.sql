-- AlterTable
ALTER TABLE `DitBridgeKnowledge` MODIFY `domain_local_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SearchRule` MODIFY `additionalControl` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL;
