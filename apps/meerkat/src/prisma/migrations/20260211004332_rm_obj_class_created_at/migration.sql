/*
  Warnings:

  - You are about to drop the column `created_at` on the `EntryObjectClass` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EntryObjectClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "object_class" TEXT NOT NULL,
    CONSTRAINT "EntryObjectClass_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EntryObjectClass" ("entry_id", "id", "object_class") SELECT "entry_id", "id", "object_class" FROM "EntryObjectClass";
DROP TABLE "EntryObjectClass";
ALTER TABLE "new_EntryObjectClass" RENAME TO "EntryObjectClass";
CREATE INDEX "EntryObjectClass_object_class_entry_id_idx" ON "EntryObjectClass"("object_class", "entry_id");
CREATE UNIQUE INDEX "EntryObjectClass_entry_id_object_class_key" ON "EntryObjectClass"("entry_id", "object_class");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
