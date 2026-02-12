/*
  Warnings:

  - You are about to drop the column `jer` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `jer` on the `ContextValue` table. All the data in the column will be lost.

*/
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
    CONSTRAINT "AttributeValue_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AttributeValue" ("constructed", "content_octets", "entry_id", "id", "operational", "tag_class", "tag_number", "type_oid") SELECT "constructed", "content_octets", "entry_id", "id", "operational", "tag_class", "tag_number", "type_oid" FROM "AttributeValue";
DROP TABLE "AttributeValue";
ALTER TABLE "new_AttributeValue" RENAME TO "AttributeValue";
CREATE INDEX "AttributeValue_entry_id_type_oid_operational_idx" ON "AttributeValue"("entry_id", "type_oid", "operational");
CREATE TABLE "new_ContextValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "tag_class" INTEGER NOT NULL,
    "constructed" BOOLEAN NOT NULL,
    "tag_number" INTEGER NOT NULL,
    "ber" BLOB NOT NULL,
    "fallback" BOOLEAN NOT NULL,
    CONSTRAINT "ContextValue_value_id_fkey" FOREIGN KEY ("value_id") REFERENCES "AttributeValue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ContextValue" ("ber", "constructed", "fallback", "id", "tag_class", "tag_number", "type", "value_id") SELECT "ber", "constructed", "fallback", "id", "tag_class", "tag_number", "type", "value_id" FROM "ContextValue";
DROP TABLE "ContextValue";
ALTER TABLE "new_ContextValue" RENAME TO "ContextValue";
CREATE INDEX "ContextValue_value_id_idx" ON "ContextValue"("value_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
