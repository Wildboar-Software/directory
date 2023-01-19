-- DropIndex
DROP INDEX `EntryObjectClass_object_class_idx` ON `EntryObjectClass`;

-- CreateIndex
CREATE INDEX `EntryObjectClass_object_class_entry_id_idx` ON `EntryObjectClass`(`object_class`, `entry_id`);
