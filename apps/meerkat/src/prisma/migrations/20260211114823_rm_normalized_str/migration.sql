/*
  Warnings:

  - You are about to drop the column `normalized_str` on the `AttributeValue` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "DistinguishedValue_type_oid_normalized_str_entry_id_key";

-- DropIndex
DROP INDEX "EntryObjectClass_object_class_entry_id_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AttributeValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "type_oid" BLOB NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "tag_class" INTEGER NOT NULL,
    "constructed" BOOLEAN NOT NULL,
    "tag_number" INTEGER NOT NULL,
    "content_octets" BLOB NOT NULL,
    "jer" JSONB,
    CONSTRAINT "AttributeValue_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AttributeValue" ("constructed", "content_octets", "entry_id", "id", "jer", "operational", "tag_class", "tag_number", "type_oid") SELECT "constructed", "content_octets", "entry_id", "id", "jer", "operational", "tag_class", "tag_number", "type_oid" FROM "AttributeValue";
DROP TABLE "AttributeValue";
ALTER TABLE "new_AttributeValue" RENAME TO "AttributeValue";
CREATE INDEX "AttributeValue_entry_id_type_oid_operational_idx" ON "AttributeValue"("entry_id", "type_oid", "operational");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
