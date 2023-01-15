-- DropIndex
DROP INDEX `AttributeValue_entry_id_type_oid_tag_class_constructed_tag_n_idx` ON `AttributeValue`;

-- CreateIndex
CREATE INDEX `AttributeValue_entry_id_type_oid_tag_class_constructed_tag_n_idx` ON `AttributeValue`(`entry_id`, `type_oid`(32), `tag_class`, `constructed`, `tag_number`, `content_octets`(64));

-- CreateIndex
CREATE INDEX `AttributeValue_type_oid_tag_class_constructed_tag_number_con_idx` ON `AttributeValue`(`type_oid`(32), `tag_class`, `constructed`, `tag_number`, `content_octets`(64));
