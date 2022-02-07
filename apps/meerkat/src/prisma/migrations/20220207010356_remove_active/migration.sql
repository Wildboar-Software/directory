/*
  Warnings:

  - You are about to drop the column `active` on the `AttributeTypeDescription` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `ContentRule` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `ContextDescription` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `ContextUseRule` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `DITStructureRule` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `MatchingRuleUse` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `ObjectClassDescription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entry_id,attributeType]` on the table `ContextUseRule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `ContextUseRule_entry_id_active_idx` ON `ContextUseRule`;

-- AlterTable
ALTER TABLE `AttributeTypeDescription` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `ContentRule` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `ContextDescription` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `ContextUseRule` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `DITStructureRule` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `Friendship` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `MatchingRuleUse` DROP COLUMN `active`;

-- AlterTable
ALTER TABLE `ObjectClassDescription` DROP COLUMN `active`;

-- CreateIndex
CREATE INDEX `ACIItem_entry_id_active_precedence_idx` ON `ACIItem`(`entry_id`, `active`, `precedence`);

-- CreateIndex
CREATE INDEX `Clearance_entry_id_active_policy_id_idx` ON `Clearance`(`entry_id`, `active`, `policy_id`);

-- CreateIndex
CREATE INDEX `ClearanceSecurityCategory_clearance_id_type_idx` ON `ClearanceSecurityCategory`(`clearance_id`, `type`);

-- CreateIndex
CREATE UNIQUE INDEX `ContextUseRule_entry_id_attributeType_key` ON `ContextUseRule`(`entry_id`, `attributeType`);
