/*
  Warnings:

  - A unique constraint covering the columns `[type_oid,normalized_str,entry_id]` on the table `DistinguishedValue` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `DistinguishedValue_type_oid_tag_class_tag_number_constructed_idx` ON `DistinguishedValue`;

-- CreateIndex
CREATE UNIQUE INDEX `DistinguishedValue_type_oid_normalized_str_entry_id_key` ON `DistinguishedValue`(`type_oid`(32), `normalized_str`, `entry_id`);
