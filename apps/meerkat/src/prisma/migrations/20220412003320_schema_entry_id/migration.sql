-- AlterTable
ALTER TABLE `AttributeTypeDescription` ADD COLUMN `entry_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `ContextDescription` ADD COLUMN `entry_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `NameForm` ADD COLUMN `entry_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `ObjectClassDescription` ADD COLUMN `entry_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `AttributeTypeDescription_entry_id_idx` ON `AttributeTypeDescription`(`entry_id`);

-- CreateIndex
CREATE INDEX `ContextDescription_entry_id_idx` ON `ContextDescription`(`entry_id`);

-- CreateIndex
CREATE INDEX `NameForm_entry_id_idx` ON `NameForm`(`entry_id`);

-- CreateIndex
CREATE INDEX `ObjectClassDescription_entry_id_idx` ON `ObjectClassDescription`(`entry_id`);

-- AddForeignKey
ALTER TABLE `NameForm` ADD CONSTRAINT `NameForm_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeTypeDescription` ADD CONSTRAINT `AttributeTypeDescription_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectClassDescription` ADD CONSTRAINT `ObjectClassDescription_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextDescription` ADD CONSTRAINT `ContextDescription_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
