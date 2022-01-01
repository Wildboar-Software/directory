/*
  Warnings:

  - You are about to drop the `NonSpecificKnowledge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `NonSpecificKnowledge` DROP FOREIGN KEY `NonSpecificKnowledge_entry_id_fkey`;

-- AlterTable
ALTER TABLE `AccessPoint` ADD COLUMN `nsk_group` BIGINT NULL;

-- DropTable
DROP TABLE `NonSpecificKnowledge`;
