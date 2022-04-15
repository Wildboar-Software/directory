/*
  Warnings:

  - A unique constraint covering the columns `[entry_id,identifier]` on the table `AttributeTypeDescription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entry_id,identifier]` on the table `ContextDescription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entry_id,identifier]` on the table `NameForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[entry_id,identifier]` on the table `ObjectClassDescription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `AttributeTypeDescription_identifier_key` ON `AttributeTypeDescription`;

-- DropIndex
DROP INDEX `ContextDescription_identifier_key` ON `ContextDescription`;

-- DropIndex
DROP INDEX `NameForm_identifier_key` ON `NameForm`;

-- DropIndex
DROP INDEX `ObjectClassDescription_identifier_key` ON `ObjectClassDescription`;

-- CreateIndex
CREATE UNIQUE INDEX `AttributeTypeDescription_entry_id_identifier_key` ON `AttributeTypeDescription`(`entry_id`, `identifier`);

-- CreateIndex
CREATE UNIQUE INDEX `ContextDescription_entry_id_identifier_key` ON `ContextDescription`(`entry_id`, `identifier`);

-- CreateIndex
CREATE UNIQUE INDEX `NameForm_entry_id_identifier_key` ON `NameForm`(`entry_id`, `identifier`);

-- CreateIndex
CREATE UNIQUE INDEX `ObjectClassDescription_entry_id_identifier_key` ON `ObjectClassDescription`(`entry_id`, `identifier`);
