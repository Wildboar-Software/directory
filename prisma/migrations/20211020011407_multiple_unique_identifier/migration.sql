/*
  Warnings:

  - You are about to drop the column `uniqueIdentifier` on the `Entry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[immediate_superior_id]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Entry` DROP COLUMN `uniqueIdentifier`;

-- CreateTable
CREATE TABLE `UniqueIdentifier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `uniqueIdentifier` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Entry_immediate_superior_id_unique` ON `Entry`(`immediate_superior_id`);

-- AddForeignKey
ALTER TABLE `UniqueIdentifier` ADD CONSTRAINT `UniqueIdentifier_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
