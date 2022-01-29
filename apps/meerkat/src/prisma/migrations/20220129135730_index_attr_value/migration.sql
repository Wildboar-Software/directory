-- AlterTable
ALTER TABLE `AttributeValue` ADD COLUMN `index_key` INTEGER NULL;

-- CreateIndex
CREATE INDEX `AttributeValue_entry_id_type_index_key_idx` ON `AttributeValue`(`entry_id`, `type`, `index_key`);

-- CreateIndex
CREATE INDEX `AttributeValue_entry_id_type_tag_class_constructed_tag_numbe_idx` ON `AttributeValue`(`entry_id`, `type`, `tag_class`, `constructed`, `tag_number`);

-- CreateIndex
CREATE INDEX `AttributeValue_entry_id_operational_type_idx` ON `AttributeValue`(`entry_id`, `operational`, `type`);
