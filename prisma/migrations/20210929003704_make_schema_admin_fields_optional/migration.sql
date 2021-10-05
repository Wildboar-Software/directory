/*
  Warnings:

  - You are about to drop the column `oid` on the `NameForm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entry_id,structural_class]` on the table `ContentRule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier]` on the table `NameForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `NameForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `NameForm_oid_key` ON `NameForm`;

-- AlterTable
ALTER TABLE `ContentRule` MODIFY `auxiliary_classes` VARCHAR(191),
    MODIFY `mandatory_attributes` VARCHAR(191),
    MODIFY `optional_attributes` VARCHAR(191),
    MODIFY `precluded_attributes` VARCHAR(191);

-- AlterTable
ALTER TABLE `NameForm` DROP COLUMN `oid`,
    ADD COLUMN `identifier` VARCHAR(191) NOT NULL,
    MODIFY `optionalAttributes` VARCHAR(191),
    MODIFY `ldapName` VARCHAR(191),
    MODIFY `name` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `ContentRule_entry_id_structural_class_key` ON `ContentRule`(`entry_id`, `structural_class`);

-- CreateIndex
CREATE INDEX `NameForm_namedObjectClass_idx` ON `NameForm`(`namedObjectClass`);

-- CreateIndex
CREATE UNIQUE INDEX `NameForm_identifier_key` ON `NameForm`(`identifier`);
