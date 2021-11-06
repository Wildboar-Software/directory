/*
  Warnings:

  - You are about to drop the column `hierarchyParent` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `hierarchyTop` on the `Entry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aliased_entry_id]` on the table `Alias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[immediate_superior_id]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hierarchyParent_id]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Entry` DROP COLUMN `hierarchyParent`,
    DROP COLUMN `hierarchyTop`,
    ADD COLUMN `hierarchyParentDN` JSON NULL,
    ADD COLUMN `hierarchyParent_id` INTEGER NULL,
    ADD COLUMN `hierarchyTopDN` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Alias_aliased_entry_id_key` ON `Alias`(`aliased_entry_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Entry_immediate_superior_id_key` ON `Entry`(`immediate_superior_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Entry_hierarchyParent_id_key` ON `Entry`(`hierarchyParent_id`);

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_hierarchyParent_id_fkey` FOREIGN KEY (`hierarchyParent_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
