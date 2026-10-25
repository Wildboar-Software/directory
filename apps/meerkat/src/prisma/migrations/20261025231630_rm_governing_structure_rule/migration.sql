-- Copy governingStructureRule into AttributeValue before the column is dropped.
-- 2.5.21.10 is id-soa-governingStructureRule. The value is a BER INTEGER
-- (universal, primitive, tag 2). Content octets are the minimal
-- two's-complement encoding of the 32-bit rule identifier.
INSERT INTO "AttributeValue" (
    "entry_id",
    "type_oid",
    "operational",
    "tag_class",
    "constructed",
    "tag_number",
    "content_octets"
)
SELECT
    "id",
    x'55150A',
    1,
    0,
    0,
    2,
    CASE
        WHEN "governingStructureRule" BETWEEN 0 AND 127 THEN unhex(printf('%02X', "governingStructureRule"))
        WHEN "governingStructureRule" BETWEEN 128 AND 255 THEN unhex(printf('00%02X', "governingStructureRule"))
        WHEN "governingStructureRule" BETWEEN 256 AND 32767 THEN unhex(printf('%02X%02X', ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN 32768 AND 65535 THEN unhex(printf('00%02X%02X', ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN 65536 AND 8388607 THEN unhex(printf('%02X%02X%02X', ("governingStructureRule" >> 16) & 255, ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN 8388608 AND 16777215 THEN unhex(printf('00%02X%02X%02X', ("governingStructureRule" >> 16) & 255, ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN 16777216 AND 2147483647 THEN unhex(printf('%02X%02X%02X%02X', ("governingStructureRule" >> 24) & 255, ("governingStructureRule" >> 16) & 255, ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN -128 AND -1 THEN unhex(printf('%02X', "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN -256 AND -129 THEN unhex(printf('FF%02X', "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN -32768 AND -257 THEN unhex(printf('%02X%02X', ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN -65536 AND -32769 THEN unhex(printf('FF%02X%02X', ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN -8388608 AND -65537 THEN unhex(printf('%02X%02X%02X', ("governingStructureRule" >> 16) & 255, ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN -16777216 AND -8388609 THEN unhex(printf('FF%02X%02X%02X', ("governingStructureRule" >> 16) & 255, ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
        WHEN "governingStructureRule" BETWEEN -2147483648 AND -16777217 THEN unhex(printf('%02X%02X%02X%02X', ("governingStructureRule" >> 24) & 255, ("governingStructureRule" >> 16) & 255, ("governingStructureRule" >> 8) & 255, "governingStructureRule" & 255))
    END
FROM "Entry"
WHERE "governingStructureRule" IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM "AttributeValue" AS "existing"
    WHERE "existing"."entry_id" = "Entry"."id"
    AND "existing"."type_oid" = x'55150A'
);

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
INSERT INTO "new_Entry" ("admPoint", "alias", "aliased_entry_id", "aliased_entry_name", "attribute_completeness", "cp", "createTimestamp", "creatorsName", "deleteTimestamp", "dsSubentry", "dseUUID", "entry", "entryUUID", "expiresTimestamp", "glue", "hierarchyLevel", "hierarchyParentDN", "hierarchyParentStr", "hierarchyParent_id", "hierarchyPath", "hierarchyTopDN", "hierarchyTopStr", "hierarchyTop_id", "id", "immSupr", "immediate_superior_id", "keep_children_in_database", "lastShadowUpdate", "materialized_path", "may_add_top_level_dse", "modifiersName", "modifyNameTimestamp", "modifyTimestamp", "nssr", "otherData", "previousName", "rhob", "sa", "shadow", "structuralObjectClass", "subentry", "subordinate_completeness", "subr", "xr") SELECT "admPoint", "alias", "aliased_entry_id", "aliased_entry_name", "attribute_completeness", "cp", "createTimestamp", "creatorsName", "deleteTimestamp", "dsSubentry", "dseUUID", "entry", "entryUUID", "expiresTimestamp", "glue", "hierarchyLevel", "hierarchyParentDN", "hierarchyParentStr", "hierarchyParent_id", "hierarchyPath", "hierarchyTopDN", "hierarchyTopStr", "hierarchyTop_id", "id", "immSupr", "immediate_superior_id", "keep_children_in_database", "lastShadowUpdate", "materialized_path", "may_add_top_level_dse", "modifiersName", "modifyNameTimestamp", "modifyTimestamp", "nssr", "otherData", "previousName", "rhob", "sa", "shadow", "structuralObjectClass", "subentry", "subordinate_completeness", "subr", "xr" FROM "Entry";
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
