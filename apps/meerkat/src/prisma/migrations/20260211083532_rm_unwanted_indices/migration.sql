-- DropIndex
DROP INDEX "AttributeValue_type_oid_tag_class_constructed_tag_number_normalized_str_idx";

-- DropIndex
DROP INDEX "AttributeValue_entry_id_operational_type_oid_idx";

-- DropIndex
DROP INDEX "AttributeValue_entry_id_type_oid_tag_class_constructed_tag_number_normalized_str_idx";

-- CreateIndex
CREATE INDEX "AttributeValue_entry_id_type_oid_operational_idx" ON "AttributeValue"("entry_id", "type_oid", "operational");
