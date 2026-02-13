/*
  Warnings:

  - You are about to drop the `Alias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Alias_alias_entry_id_key";

-- DropIndex
DROP INDEX "Alias_aliased_entry_id_idx";

-- DropIndex
DROP INDEX "Alias_aliased_entry_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Alias";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entryUUID" TEXT,
    "dseUUID" TEXT NOT NULL,
    "materialized_path" TEXT NOT NULL,
    "immediate_superior_id" INTEGER,
    "glue" BOOLEAN NOT NULL DEFAULT false,
    "cp" BOOLEAN NOT NULL DEFAULT false,
    "entry" BOOLEAN NOT NULL DEFAULT false,
    "alias" BOOLEAN NOT NULL DEFAULT false,
    "subr" BOOLEAN NOT NULL DEFAULT false,
    "nssr" BOOLEAN NOT NULL DEFAULT false,
    "xr" BOOLEAN NOT NULL DEFAULT false,
    "admPoint" BOOLEAN NOT NULL DEFAULT false,
    "subentry" BOOLEAN NOT NULL DEFAULT false,
    "shadow" BOOLEAN NOT NULL DEFAULT false,
    "immSupr" BOOLEAN NOT NULL DEFAULT false,
    "rhob" BOOLEAN NOT NULL DEFAULT false,
    "sa" BOOLEAN NOT NULL DEFAULT false,
    "dsSubentry" BOOLEAN NOT NULL DEFAULT false,
    "createTimestamp" DATETIME NOT NULL,
    "modifyTimestamp" DATETIME NOT NULL,
    "deleteTimestamp" DATETIME,
    "creatorsName" JSONB,
    "modifiersName" JSONB,
    "expiresTimestamp" DATETIME,
    "modifyNameTimestamp" DATETIME,
    "previousName" JSONB,
    "governingStructureRule" INTEGER,
    "structuralObjectClass" TEXT,
    "subordinate_completeness" BOOLEAN,
    "attribute_completeness" BOOLEAN,
    "lastShadowUpdate" DATETIME,
    "keep_children_in_database" BOOLEAN NOT NULL DEFAULT false,
    "may_add_top_level_dse" BOOLEAN NOT NULL DEFAULT false,
    "hierarchyParent_id" INTEGER,
    "hierarchyParentDN" JSONB,
    "hierarchyParentStr" TEXT,
    "hierarchyTop_id" INTEGER,
    "hierarchyTopDN" JSONB,
    "hierarchyTopStr" TEXT,
    "hierarchyPath" TEXT,
    "hierarchyLevel" INTEGER,
    "aliased_entry_name" JSONB,
    "aliased_entry_id" INTEGER,
    "otherData" JSONB,
    CONSTRAINT "Entry_immediate_superior_id_fkey" FOREIGN KEY ("immediate_superior_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Entry_hierarchyParent_id_fkey" FOREIGN KEY ("hierarchyParent_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Entry_hierarchyTop_id_fkey" FOREIGN KEY ("hierarchyTop_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Entry_aliased_entry_id_fkey" FOREIGN KEY ("aliased_entry_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("admPoint", "alias", "attribute_completeness", "cp", "createTimestamp", "creatorsName", "deleteTimestamp", "dsSubentry", "dseUUID", "entry", "entryUUID", "expiresTimestamp", "glue", "governingStructureRule", "hierarchyLevel", "hierarchyParentDN", "hierarchyParentStr", "hierarchyParent_id", "hierarchyPath", "hierarchyTopDN", "hierarchyTopStr", "hierarchyTop_id", "id", "immSupr", "immediate_superior_id", "keep_children_in_database", "lastShadowUpdate", "materialized_path", "may_add_top_level_dse", "modifiersName", "modifyNameTimestamp", "modifyTimestamp", "nssr", "otherData", "previousName", "rhob", "sa", "shadow", "structuralObjectClass", "subentry", "subordinate_completeness", "subr", "xr") SELECT "admPoint", "alias", "attribute_completeness", "cp", "createTimestamp", "creatorsName", "deleteTimestamp", "dsSubentry", "dseUUID", "entry", "entryUUID", "expiresTimestamp", "glue", "governingStructureRule", "hierarchyLevel", "hierarchyParentDN", "hierarchyParentStr", "hierarchyParent_id", "hierarchyPath", "hierarchyTopDN", "hierarchyTopStr", "hierarchyTop_id", "id", "immSupr", "immediate_superior_id", "keep_children_in_database", "lastShadowUpdate", "materialized_path", "may_add_top_level_dse", "modifiersName", "modifyNameTimestamp", "modifyTimestamp", "nssr", "otherData", "previousName", "rhob", "sa", "shadow", "structuralObjectClass", "subentry", "subordinate_completeness", "subr", "xr" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE INDEX "Entry_immediate_superior_id_deleteTimestamp_expiresTimestamp_subentry_idx" ON "Entry"("immediate_superior_id", "deleteTimestamp", "expiresTimestamp", "subentry");
CREATE INDEX "Entry_materialized_path_idx" ON "Entry"("materialized_path");
CREATE INDEX "Entry_hierarchyTop_id_idx" ON "Entry"("hierarchyTop_id");
CREATE INDEX "Entry_hierarchyParent_id_idx" ON "Entry"("hierarchyParent_id");
CREATE INDEX "Entry_hierarchyPath_idx" ON "Entry"("hierarchyPath");
CREATE UNIQUE INDEX "Entry_dseUUID_key" ON "Entry"("dseUUID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
