-- CreateTable
CREATE TABLE "Entry" (
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
    "creatorsName" BLOB,
    "modifiersName" BLOB,
    "expiresTimestamp" DATETIME,
    "modifyNameTimestamp" DATETIME,
    "previousName" BLOB,
    "governingStructureRule" INTEGER,
    "structuralObjectClass" TEXT,
    "subordinate_completeness" BOOLEAN,
    "attribute_completeness" BOOLEAN,
    "lastShadowUpdate" DATETIME,
    "keep_children_in_database" BOOLEAN NOT NULL DEFAULT false,
    "may_add_top_level_dse" BOOLEAN NOT NULL DEFAULT false,
    "hierarchyParent_id" INTEGER,
    "hierarchyParentDN" BLOB,
    "hierarchyParentStr" TEXT,
    "hierarchyTop_id" INTEGER,
    "hierarchyTopDN" BLOB,
    "hierarchyTopStr" TEXT,
    "hierarchyPath" TEXT,
    "hierarchyLevel" INTEGER,
    CONSTRAINT "Entry_immediate_superior_id_fkey" FOREIGN KEY ("immediate_superior_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Entry_hierarchyParent_id_fkey" FOREIGN KEY ("hierarchyParent_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Entry_hierarchyTop_id_fkey" FOREIGN KEY ("hierarchyTop_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Password" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "encrypted" BLOB NOT NULL,
    "algorithm_oid" TEXT NOT NULL,
    "algorithm_parameters_der" BLOB,
    CONSTRAINT "Password_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "time" DATETIME NOT NULL,
    "password" BLOB NOT NULL,
    CONSTRAINT "PasswordHistory_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordDictionaryItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bit" INTEGER NOT NULL,
    "item" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "type_oid" BLOB NOT NULL,
    "operational" BOOLEAN NOT NULL DEFAULT false,
    "tag_class" INTEGER NOT NULL,
    "constructed" BOOLEAN NOT NULL,
    "tag_number" INTEGER NOT NULL,
    "content_octets" BLOB NOT NULL,
    "normalized_str" TEXT,
    CONSTRAINT "AttributeValue_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContextValue" (
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

-- CreateTable
CREATE TABLE "AccessPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ber" BLOB NOT NULL,
    "knowledge_type" TEXT NOT NULL,
    "ae_title" BLOB NOT NULL,
    "category" INTEGER,
    "chainingRequired" BOOLEAN,
    "supplier_is_master" BOOLEAN,
    "non_supplying_master_id" INTEGER,
    "is_consumer_of_id" INTEGER,
    "entry_id" INTEGER,
    "nsk_group" BIGINT,
    "nssr_binding_identifier" INTEGER,
    "trust_ibra" BOOLEAN NOT NULL DEFAULT false,
    "disclose_cross_refs" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessPoint_non_supplying_master_id_fkey" FOREIGN KEY ("non_supplying_master_id") REFERENCES "AccessPoint" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AccessPoint_is_consumer_of_id_fkey" FOREIGN KEY ("is_consumer_of_id") REFERENCES "AccessPoint" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AccessPoint_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NetworkServiceAccessPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostname" TEXT,
    "port" INTEGER,
    "url" TEXT,
    "bytes" BLOB NOT NULL,
    "access_point_id" INTEGER NOT NULL,
    CONSTRAINT "NetworkServiceAccessPoint_access_point_id_fkey" FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DitBridgeKnowledge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain_local_id" TEXT,
    "ber" BLOB NOT NULL
);

-- CreateTable
CREATE TABLE "NameForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namedObjectClass" TEXT NOT NULL,
    "mandatoryAttributes" TEXT NOT NULL,
    "optionalAttributes" TEXT,
    "ldapName" TEXT,
    "ldapDesc" TEXT,
    "identifier" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entry_id" INTEGER,
    CONSTRAINT "NameForm_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DITStructureRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ruleIdentifier" INTEGER NOT NULL,
    "nameForm" TEXT NOT NULL,
    "superiorStructureRules" TEXT,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "entry_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DITStructureRule_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "structural_class" TEXT NOT NULL,
    "auxiliary_classes" TEXT,
    "mandatory_attributes" TEXT,
    "optional_attributes" TEXT,
    "precluded_attributes" TEXT,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "entry_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentRule_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContextUseRule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attributeType" TEXT NOT NULL,
    "mandatory" TEXT,
    "optional" TEXT,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "entry_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContextUseRule_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "anchor" TEXT NOT NULL,
    "friends" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "entry_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Friendship_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchingRuleUse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "information" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchingRuleUse_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttributeTypeDescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "derivation" TEXT,
    "equalityMatch" TEXT,
    "orderingMatch" TEXT,
    "substringsMatch" TEXT,
    "attributeSyntax" TEXT,
    "multiValued" BOOLEAN NOT NULL DEFAULT true,
    "collective" BOOLEAN NOT NULL DEFAULT false,
    "userModifiable" BOOLEAN NOT NULL DEFAULT true,
    "application" TEXT NOT NULL DEFAULT 'USER_APPLICATIONS',
    "ldapSyntax" TEXT,
    "ldapNames" TEXT,
    "ldapDescription" TEXT,
    "dummy" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entry_id" INTEGER,
    CONSTRAINT "AttributeTypeDescription_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ObjectClassDescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "subclassOf" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'STRUCTURAL',
    "mandatories" TEXT,
    "optionals" TEXT,
    "ldapNames" TEXT,
    "ldapDescription" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entry_id" INTEGER,
    CONSTRAINT "ObjectClassDescription_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContextDescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "identifier" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "syntax" TEXT NOT NULL,
    "assertionSyntax" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "absentMatch" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" BLOB,
    "entry_id" INTEGER,
    CONSTRAINT "ContextDescription_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OperationalBinding" (
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
    "security_name" BLOB,
    "security_time" DATETIME,
    "security_random" BLOB,
    "security_target" INTEGER,
    "security_operationCode" TEXT,
    "security_errorProtection" INTEGER,
    "security_errorCode" TEXT,
    "new_context_prefix_rdn" BLOB,
    "immediate_superior" BLOB,
    "shadowed_context_prefix" BLOB,
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
    "source_ip" TEXT,
    "source_tcp_port" INTEGER,
    "source_ae_title" BLOB,
    "source_credentials_type" INTEGER,
    "source_certificate_path" BLOB,
    "source_bind_token" BLOB,
    "source_strong_name" BLOB,
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

-- CreateTable
CREATE TABLE "NamedObjectIdentifier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "oid" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DistinguishedValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "type_oid" BLOB NOT NULL,
    "tag_class" INTEGER NOT NULL,
    "constructed" BOOLEAN NOT NULL,
    "tag_number" INTEGER NOT NULL,
    "content_octets" BLOB NOT NULL,
    "normalized_str" TEXT,
    "order_index" INTEGER NOT NULL,
    CONSTRAINT "DistinguishedValue_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntryObjectClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "object_class" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EntryObjectClass_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alias_entry_id" INTEGER NOT NULL,
    "aliased_entry_id" INTEGER,
    "aliased_entry_name" BLOB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alias_alias_entry_id_fkey" FOREIGN KEY ("alias_entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Alias_aliased_entry_id_fkey" FOREIGN KEY ("aliased_entry_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EntryAttributeValuesIncomplete" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry_id" INTEGER NOT NULL,
    "attribute_type" TEXT NOT NULL,
    CONSTRAINT "EntryAttributeValuesIncomplete_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AltServer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uri" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "InstalledVersions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "installedTimestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,
    "migration_problems" TEXT
);

-- CreateTable
CREATE TABLE "EnqueuedSearchResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "connection_uuid" TEXT NOT NULL,
    "query_ref" TEXT NOT NULL,
    "result_index" INTEGER NOT NULL,
    "entry_id" INTEGER,
    "entry_info" BLOB NOT NULL,
    CONSTRAINT "EnqueuedSearchResult_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnqueuedListResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "connection_uuid" TEXT NOT NULL,
    "query_ref" TEXT NOT NULL,
    "result_index" INTEGER NOT NULL,
    "entry_id" INTEGER,
    "subordinate_info" BLOB NOT NULL,
    CONSTRAINT "EnqueuedListResult_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccessPointCredentials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_point_id" INTEGER NOT NULL,
    "simple_name" BLOB,
    "simple_password_unprotected" BLOB,
    "simple_password_hash_value" BLOB,
    "simple_password_hash_algorithm_oid" TEXT,
    "simple_password_hash_algorithm_parameters" BLOB,
    "strong_pkcs12" BLOB,
    "mtls_client_pkcs12" BLOB,
    CONSTRAINT "AccessPointCredentials_access_point_id_fkey" FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostalCodesGazetteEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "c2c" TEXT NOT NULL,
    "st" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PostalCodeBoundaryPoints" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postal_code_id" INTEGER NOT NULL,
    "northing" INTEGER NOT NULL,
    "easting" INTEGER NOT NULL,
    CONSTRAINT "PostalCodeBoundaryPoints_postal_code_id_fkey" FOREIGN KEY ("postal_code_id") REFERENCES "PostalCodesGazetteEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PendingShadowIncrementalStepRefresh" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "binding_identifier" INTEGER NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ber" BLOB NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "rename" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Entry_immediate_superior_id_deleteTimestamp_expiresTimestamp_subentry_idx" ON "Entry"("immediate_superior_id", "deleteTimestamp", "expiresTimestamp", "subentry");

-- CreateIndex
CREATE INDEX "Entry_materialized_path_idx" ON "Entry"("materialized_path");

-- CreateIndex
CREATE INDEX "Entry_hierarchyTop_id_idx" ON "Entry"("hierarchyTop_id");

-- CreateIndex
CREATE INDEX "Entry_hierarchyParent_id_idx" ON "Entry"("hierarchyParent_id");

-- CreateIndex
CREATE INDEX "Entry_hierarchyPath_idx" ON "Entry"("hierarchyPath");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_dseUUID_key" ON "Entry"("dseUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Password_entry_id_key" ON "Password"("entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordHistory_entry_id_time_key" ON "PasswordHistory"("entry_id", "time");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordDictionaryItem_bit_item_key" ON "PasswordDictionaryItem"("bit", "item");

-- CreateIndex
CREATE INDEX "AttributeValue_entry_id_type_oid_tag_class_constructed_tag_number_normalized_str_idx" ON "AttributeValue"("entry_id", "type_oid", "tag_class", "constructed", "tag_number", "normalized_str");

-- CreateIndex
CREATE INDEX "AttributeValue_entry_id_operational_type_oid_idx" ON "AttributeValue"("entry_id", "operational", "type_oid");

-- CreateIndex
CREATE INDEX "AttributeValue_type_oid_tag_class_constructed_tag_number_normalized_str_idx" ON "AttributeValue"("type_oid", "tag_class", "constructed", "tag_number", "normalized_str");

-- CreateIndex
CREATE INDEX "ContextValue_value_id_idx" ON "ContextValue"("value_id");

-- CreateIndex
CREATE INDEX "AccessPoint_entry_id_idx" ON "AccessPoint"("entry_id");

-- CreateIndex
CREATE INDEX "NetworkServiceAccessPoint_access_point_id_idx" ON "NetworkServiceAccessPoint"("access_point_id");

-- CreateIndex
CREATE INDEX "NameForm_namedObjectClass_idx" ON "NameForm"("namedObjectClass");

-- CreateIndex
CREATE UNIQUE INDEX "NameForm_entry_id_identifier_key" ON "NameForm"("entry_id", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "DITStructureRule_entry_id_ruleIdentifier_key" ON "DITStructureRule"("entry_id", "ruleIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRule_entry_id_structural_class_key" ON "ContentRule"("entry_id", "structural_class");

-- CreateIndex
CREATE UNIQUE INDEX "ContextUseRule_entry_id_attributeType_key" ON "ContextUseRule"("entry_id", "attributeType");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_entry_id_anchor_key" ON "Friendship"("entry_id", "anchor");

-- CreateIndex
CREATE UNIQUE INDEX "MatchingRuleUse_entry_id_identifier_key" ON "MatchingRuleUse"("entry_id", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeTypeDescription_entry_id_identifier_key" ON "AttributeTypeDescription"("entry_id", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ObjectClassDescription_entry_id_identifier_key" ON "ObjectClassDescription"("entry_id", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ContextDescription_entry_id_identifier_key" ON "ContextDescription"("entry_id", "identifier");

-- CreateIndex
CREATE INDEX "OperationalBinding_binding_type_binding_identifier_binding_version_terminated_time_idx" ON "OperationalBinding"("binding_type", "binding_identifier", "binding_version", "terminated_time");

-- CreateIndex
CREATE INDEX "OperationalBinding_validity_end_validity_start_idx" ON "OperationalBinding"("validity_end", "validity_start");

-- CreateIndex
CREATE INDEX "OperationalBinding_entry_id_idx" ON "OperationalBinding"("entry_id");

-- CreateIndex
CREATE INDEX "OperationalBinding_previous_id_idx" ON "OperationalBinding"("previous_id");

-- CreateIndex
CREATE UNIQUE INDEX "OperationalBinding_uuid_key" ON "OperationalBinding"("uuid");

-- CreateIndex
CREATE INDEX "NamedObjectIdentifier_name_idx" ON "NamedObjectIdentifier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NamedObjectIdentifier_oid_key" ON "NamedObjectIdentifier"("oid");

-- CreateIndex
CREATE UNIQUE INDEX "DistinguishedValue_entry_id_type_oid_key" ON "DistinguishedValue"("entry_id", "type_oid");

-- CreateIndex
CREATE UNIQUE INDEX "DistinguishedValue_type_oid_normalized_str_entry_id_key" ON "DistinguishedValue"("type_oid", "normalized_str", "entry_id");

-- CreateIndex
CREATE INDEX "EntryObjectClass_object_class_entry_id_idx" ON "EntryObjectClass"("object_class", "entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntryObjectClass_entry_id_object_class_key" ON "EntryObjectClass"("entry_id", "object_class");

-- CreateIndex
CREATE UNIQUE INDEX "Alias_aliased_entry_id_key" ON "Alias"("aliased_entry_id");

-- CreateIndex
CREATE INDEX "Alias_aliased_entry_id_idx" ON "Alias"("aliased_entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "Alias_alias_entry_id_key" ON "Alias"("alias_entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntryAttributeValuesIncomplete_entry_id_attribute_type_key" ON "EntryAttributeValuesIncomplete"("entry_id", "attribute_type");

-- CreateIndex
CREATE INDEX "InstalledVersions_version_idx" ON "InstalledVersions"("version");

-- CreateIndex
CREATE UNIQUE INDEX "EnqueuedSearchResult_connection_uuid_query_ref_result_index_key" ON "EnqueuedSearchResult"("connection_uuid", "query_ref", "result_index");

-- CreateIndex
CREATE UNIQUE INDEX "EnqueuedListResult_connection_uuid_query_ref_result_index_key" ON "EnqueuedListResult"("connection_uuid", "query_ref", "result_index");

-- CreateIndex
CREATE UNIQUE INDEX "AccessPointCredentials_uuid_key" ON "AccessPointCredentials"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PostalCodesGazetteEntry_c2c_st_locality_postal_code_key" ON "PostalCodesGazetteEntry"("c2c", "st", "locality", "postal_code");

-- CreateIndex
CREATE INDEX "PostalCodeBoundaryPoints_postal_code_id_idx" ON "PostalCodeBoundaryPoints"("postal_code_id");

-- CreateIndex
CREATE INDEX "PendingShadowIncrementalStepRefresh_binding_identifier_time_idx" ON "PendingShadowIncrementalStepRefresh"("binding_identifier", "time");
