/*
  Warnings:

  - You are about to drop the column `sort_key` on the `AttributeValue` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `AttributeValue_type_sort_key_idx` ON `AttributeValue`;

-- AlterTable
ALTER TABLE `AttributeValue` DROP COLUMN `sort_key`;

-- CreateTable
CREATE TABLE `EnqueuedListResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `connection_uuid` VARCHAR(40) NOT NULL,
    `query_ref` VARCHAR(40) NOT NULL,
    `result_index` INTEGER NOT NULL,
    `entry_id` INTEGER NULL,
    `subordinate_info` LONGBLOB NOT NULL,

    UNIQUE INDEX `EnqueuedListResult_connection_uuid_query_ref_result_index_key`(`connection_uuid`, `query_ref`, `result_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EnqueuedListResult` ADD CONSTRAINT `EnqueuedListResult_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
