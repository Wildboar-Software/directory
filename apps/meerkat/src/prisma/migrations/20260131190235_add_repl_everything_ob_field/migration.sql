-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OperationalBinding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER,
    "previous_id" INTEGER,
    "outbound" BOOLEAN NOT NULL,
    "uuid" TEXT NOT NULL,
    "binding_type" TEXT NOT NULL,
    "binding_identifier" INTEGER NOT NULL,
    "binding_version" INTEGER NOT NULL,
    "agreement_ber" BLOB NOT NULL,
    "access_point_id" INTEGER,
    "initiator" TEXT NOT NULL,
    "initiator_ber" BLOB NOT NULL,
    "validity_start" DATETIME NOT NULL,
    "validity_end" DATETIME,
    "security_certification_path" BLOB,
    "security_name" JSONB,
    "security_time" DATETIME,
    "security_random" BLOB,
    "security_target" INTEGER,
    "security_operationCode" TEXT,
    "security_errorProtection" INTEGER,
    "security_errorCode" TEXT,
    "new_context_prefix_rdn" JSONB,
    "immediate_superior" JSONB,
    "shadowed_context_prefix" JSONB,
    "knowledge_type" TEXT,
    "subordinates" BOOLEAN,
    "supply_contexts" TEXT,
    "supplier_initiated" BOOLEAN,
    "periodic_beginTime" DATETIME,
    "periodic_windowSize" INTEGER,
    "periodic_updateInterval" INTEGER,
    "othertimes" BOOLEAN,
    "master_access_point_id" INTEGER,
    "secondary_shadows" BOOLEAN,
    "is_the_replicate_everything_ob" BOOLEAN NOT NULL DEFAULT false,
    "source_ip" TEXT,
    "source_tcp_port" INTEGER,
    "source_ae_title" JSONB,
    "source_credentials_type" INTEGER,
    "source_certificate_path" BLOB,
    "source_bind_token" BLOB,
    "source_strong_name" JSONB,
    "source_attr_cert_path" BLOB,
    "requested_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_time" DATETIME,
    "terminated_time" DATETIME,
    "accepted" BOOLEAN,
    "last_update" DATETIME,
    "last_ob_problem" INTEGER,
    "last_shadow_problem" INTEGER,
    "local_last_update" DATETIME,
    "remote_last_update" DATETIME,
    "requested_strategy" TEXT,
    "requested_strategy_external_ber" BLOB,
    CONSTRAINT "OperationalBinding_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OperationalBinding_previous_id_fkey" FOREIGN KEY ("previous_id") REFERENCES "OperationalBinding" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OperationalBinding_access_point_id_fkey" FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OperationalBinding_master_access_point_id_fkey" FOREIGN KEY ("master_access_point_id") REFERENCES "AccessPoint" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OperationalBinding" ("accepted", "access_point_id", "agreement_ber", "binding_identifier", "binding_type", "binding_version", "entry_id", "id", "immediate_superior", "initiator", "initiator_ber", "knowledge_type", "last_ob_problem", "last_shadow_problem", "last_update", "local_last_update", "master_access_point_id", "new_context_prefix_rdn", "othertimes", "outbound", "periodic_beginTime", "periodic_updateInterval", "periodic_windowSize", "previous_id", "remote_last_update", "requested_strategy", "requested_strategy_external_ber", "requested_time", "responded_time", "secondary_shadows", "security_certification_path", "security_errorCode", "security_errorProtection", "security_name", "security_operationCode", "security_random", "security_target", "security_time", "shadowed_context_prefix", "source_ae_title", "source_attr_cert_path", "source_bind_token", "source_certificate_path", "source_credentials_type", "source_ip", "source_strong_name", "source_tcp_port", "subordinates", "supplier_initiated", "supply_contexts", "terminated_time", "uuid", "validity_end", "validity_start") SELECT "accepted", "access_point_id", "agreement_ber", "binding_identifier", "binding_type", "binding_version", "entry_id", "id", "immediate_superior", "initiator", "initiator_ber", "knowledge_type", "last_ob_problem", "last_shadow_problem", "last_update", "local_last_update", "master_access_point_id", "new_context_prefix_rdn", "othertimes", "outbound", "periodic_beginTime", "periodic_updateInterval", "periodic_windowSize", "previous_id", "remote_last_update", "requested_strategy", "requested_strategy_external_ber", "requested_time", "responded_time", "secondary_shadows", "security_certification_path", "security_errorCode", "security_errorProtection", "security_name", "security_operationCode", "security_random", "security_target", "security_time", "shadowed_context_prefix", "source_ae_title", "source_attr_cert_path", "source_bind_token", "source_certificate_path", "source_credentials_type", "source_ip", "source_strong_name", "source_tcp_port", "subordinates", "supplier_initiated", "supply_contexts", "terminated_time", "uuid", "validity_end", "validity_start" FROM "OperationalBinding";
DROP TABLE "OperationalBinding";
ALTER TABLE "new_OperationalBinding" RENAME TO "OperationalBinding";
CREATE INDEX "OperationalBinding_binding_type_binding_identifier_binding_version_terminated_time_idx" ON "OperationalBinding"("binding_type", "binding_identifier", "binding_version", "terminated_time");
CREATE INDEX "OperationalBinding_validity_end_validity_start_idx" ON "OperationalBinding"("validity_end", "validity_start");
CREATE INDEX "OperationalBinding_entry_id_idx" ON "OperationalBinding"("entry_id");
CREATE INDEX "OperationalBinding_previous_id_idx" ON "OperationalBinding"("previous_id");
CREATE UNIQUE INDEX "OperationalBinding_uuid_key" ON "OperationalBinding"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
