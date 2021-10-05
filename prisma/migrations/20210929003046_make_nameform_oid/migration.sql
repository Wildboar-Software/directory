/*
  Warnings:

  - You are about to drop the column `nameForm_id` on the `DITStructureRule` table. All the data in the column will be lost.
  - Added the required column `nameForm` to the `DITStructureRule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DITStructureRule` DROP FOREIGN KEY `DITStructureRule_nameForm_id_fkey`;

-- AlterTable
ALTER TABLE `DITStructureRule` DROP COLUMN `nameForm_id`,
    ADD COLUMN `nameForm` VARCHAR(191) NOT NULL;
