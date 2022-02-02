/*
  Warnings:

  - A unique constraint covering the columns `[entry_id,ruleIdentifier]` on the table `DITStructureRule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `DITStructureRule_ruleIdentifier_idx` ON `DITStructureRule`;

-- CreateIndex
CREATE INDEX `ContextUseRule_entry_id_active_idx` ON `ContextUseRule`(`entry_id`, `active`);

-- CreateIndex
CREATE UNIQUE INDEX `DITStructureRule_entry_id_ruleIdentifier_key` ON `DITStructureRule`(`entry_id`, `ruleIdentifier`);
