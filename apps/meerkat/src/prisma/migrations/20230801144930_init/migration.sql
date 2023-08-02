-- CreateTable
CREATE TABLE `Entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryUUID` VARCHAR(191) NULL,
    `dseUUID` VARCHAR(191) NOT NULL,
    `materialized_path` VARCHAR(191) NOT NULL,
    `immediate_superior_id` INTEGER NULL,
    `glue` BOOLEAN NOT NULL DEFAULT false,
    `cp` BOOLEAN NOT NULL DEFAULT false,
    `entry` BOOLEAN NOT NULL DEFAULT false,
    `alias` BOOLEAN NOT NULL DEFAULT false,
    `subr` BOOLEAN NOT NULL DEFAULT false,
    `nssr` BOOLEAN NOT NULL DEFAULT false,
    `xr` BOOLEAN NOT NULL DEFAULT false,
    `admPoint` BOOLEAN NOT NULL DEFAULT false,
    `subentry` BOOLEAN NOT NULL DEFAULT false,
    `shadow` BOOLEAN NOT NULL DEFAULT false,
    `immSupr` BOOLEAN NOT NULL DEFAULT false,
    `rhob` BOOLEAN NOT NULL DEFAULT false,
    `sa` BOOLEAN NOT NULL DEFAULT false,
    `dsSubentry` BOOLEAN NOT NULL DEFAULT false,
    `createTimestamp` DATETIME(3) NOT NULL,
    `modifyTimestamp` DATETIME(3) NOT NULL,
    `deleteTimestamp` DATETIME(3) NULL,
    `creatorsName` JSON NULL,
    `modifiersName` JSON NULL,
    `expiresTimestamp` DATETIME(3) NULL,
    `modifyNameTimestamp` DATETIME(3) NULL,
    `previousName` JSON NULL,
    `governingStructureRule` INTEGER NULL,
    `structuralObjectClass` VARCHAR(128) NULL,
    `subordinate_completeness` BOOLEAN NULL,
    `attribute_completeness` BOOLEAN NULL,
    `lastShadowUpdate` DATETIME(3) NULL,
    `keep_children_in_database` BOOLEAN NOT NULL DEFAULT false,
    `may_add_top_level_dse` BOOLEAN NOT NULL DEFAULT false,
    `hierarchyParent_id` INTEGER NULL,
    `hierarchyParentDN` JSON NULL,
    `hierarchyParentStr` VARCHAR(2048) NULL,
    `hierarchyTop_id` INTEGER NULL,
    `hierarchyTopDN` JSON NULL,
    `hierarchyTopStr` VARCHAR(2048) NULL,
    `hierarchyPath` VARCHAR(191) NULL,
    `hierarchyLevel` INTEGER NULL,
    `otherData` JSON NULL,

    INDEX `Entry_immediate_superior_id_deleteTimestamp_expiresTimestamp_idx`(`immediate_superior_id`, `deleteTimestamp`, `expiresTimestamp`, `subentry`),
    INDEX `Entry_materialized_path_idx`(`materialized_path`),
    INDEX `Entry_hierarchyTop_id_idx`(`hierarchyTop_id`),
    INDEX `Entry_hierarchyParent_id_idx`(`hierarchyParent_id`),
    INDEX `Entry_hierarchyPath_idx`(`hierarchyPath`),
    UNIQUE INDEX `Entry_dseUUID_key`(`dseUUID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Password` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `encrypted` LONGBLOB NOT NULL,
    `algorithm_oid` VARCHAR(128) NOT NULL,
    `algorithm_parameters_der` LONGBLOB NULL,

    UNIQUE INDEX `Password_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `password` LONGBLOB NOT NULL,

    UNIQUE INDEX `PasswordHistory_entry_id_time_key`(`entry_id`, `time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordDictionaryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bit` SMALLINT NOT NULL,
    `item` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PasswordDictionaryItem_bit_item_key`(`bit`, `item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `type_oid` LONGBLOB NOT NULL,
    `operational` BOOLEAN NOT NULL DEFAULT false,
    `tag_class` SMALLINT NOT NULL,
    `constructed` BOOLEAN NOT NULL,
    `tag_number` INTEGER NOT NULL,
    `content_octets` LONGBLOB NOT NULL,
    `jer` JSON NULL,
    `normalized_str` VARCHAR(16000) NULL,

    INDEX `AttributeValue_entry_id_type_oid_tag_class_constructed_tag_n_idx`(`entry_id`, `type_oid`(32), `tag_class`, `constructed`, `tag_number`, `normalized_str`(128)),
    INDEX `AttributeValue_entry_id_operational_type_oid_idx`(`entry_id`, `operational`, `type_oid`(32)),
    INDEX `AttributeValue_type_oid_tag_class_constructed_tag_number_nor_idx`(`type_oid`(32), `tag_class`, `constructed`, `tag_number`, `normalized_str`(128)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value_id` INTEGER NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `tag_class` SMALLINT NOT NULL,
    `constructed` BOOLEAN NOT NULL,
    `tag_number` INTEGER NOT NULL,
    `ber` LONGBLOB NOT NULL,
    `jer` JSON NULL,
    `fallback` BOOLEAN NOT NULL,

    INDEX `ContextValue_value_id_idx`(`value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ber` LONGBLOB NOT NULL,
    `knowledge_type` ENUM('MY_ACCESS_POINT', 'SUPERIOR', 'SPECIFIC', 'NON_SPECIFIC', 'SUPPLIER', 'CONSUMER', 'SECONDARY_SUPPLIER', 'SECONDARY_CONSUMER', 'OTHER', 'OB_REQUEST', 'OB_SHADOW_MASTER', 'NON_SUPPLYING_MASTER', 'CROSS_REFERENCE') NOT NULL,
    `ae_title` JSON NOT NULL,
    `category` INTEGER NULL,
    `chainingRequired` BOOLEAN NULL,
    `supplier_is_master` BOOLEAN NULL,
    `non_supplying_master_id` INTEGER NULL,
    `is_consumer_of_id` INTEGER NULL,
    `entry_id` INTEGER NULL,
    `nsk_group` BIGINT NULL,
    `nssr_binding_identifier` INTEGER NULL,
    `trust_ibra` BOOLEAN NOT NULL DEFAULT false,
    `disclose_cross_refs` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AccessPoint_entry_id_idx`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NetworkServiceAccessPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostname` VARCHAR(255) NULL,
    `port` INTEGER NULL,
    `url` VARCHAR(191) NULL,
    `bytes` LONGBLOB NOT NULL,
    `access_point_id` INTEGER NOT NULL,

    INDEX `NetworkServiceAccessPoint_access_point_id_idx`(`access_point_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DitBridgeKnowledge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `domain_local_id` VARCHAR(191) NULL,
    `ber` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NameForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namedObjectClass` VARCHAR(128) NOT NULL,
    `mandatoryAttributes` TEXT NOT NULL,
    `optionalAttributes` TEXT NULL,
    `ldapName` TEXT NULL,
    `ldapDesc` TEXT NULL,
    `identifier` VARCHAR(128) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `entry_id` INTEGER NULL,

    INDEX `NameForm_namedObjectClass_idx`(`namedObjectClass`),
    UNIQUE INDEX `NameForm_entry_id_identifier_key`(`entry_id`, `identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DITStructureRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruleIdentifier` INTEGER NOT NULL,
    `nameForm` VARCHAR(128) NOT NULL,
    `superiorStructureRules` TEXT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DITStructureRule_entry_id_ruleIdentifier_key`(`entry_id`, `ruleIdentifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `structural_class` VARCHAR(128) NOT NULL,
    `auxiliary_classes` TEXT NULL,
    `mandatory_attributes` TEXT NULL,
    `optional_attributes` TEXT NULL,
    `precluded_attributes` TEXT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ContentRule_entry_id_structural_class_key`(`entry_id`, `structural_class`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextUseRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attributeType` VARCHAR(128) NOT NULL,
    `mandatory` TEXT NULL,
    `optional` TEXT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ContextUseRule_entry_id_attributeType_key`(`entry_id`, `attributeType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friendship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anchor` VARCHAR(128) NOT NULL,
    `friends` TEXT NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Friendship_entry_id_anchor_key`(`entry_id`, `anchor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchingRuleUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(128) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `information` TEXT NOT NULL,
    `entry_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MatchingRuleUse_entry_id_identifier_key`(`entry_id`, `identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeTypeDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(128) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `derivation` VARCHAR(128) NULL,
    `equalityMatch` VARCHAR(128) NULL,
    `orderingMatch` VARCHAR(128) NULL,
    `substringsMatch` VARCHAR(128) NULL,
    `attributeSyntax` TEXT NULL,
    `multiValued` BOOLEAN NOT NULL DEFAULT true,
    `collective` BOOLEAN NOT NULL DEFAULT false,
    `userModifiable` BOOLEAN NOT NULL DEFAULT true,
    `application` ENUM('USER_APPLICATIONS', 'DSA_OPERATION', 'DISTRIBUTED_OPERATION', 'DIRECTORY_OPERATION') NOT NULL DEFAULT 'USER_APPLICATIONS',
    `ldapSyntax` VARCHAR(128) NULL,
    `ldapNames` VARCHAR(191) NULL,
    `ldapDescription` TEXT NULL,
    `dummy` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `entry_id` INTEGER NULL,

    UNIQUE INDEX `AttributeTypeDescription_entry_id_identifier_key`(`entry_id`, `identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectClassDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(128) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `subclassOf` TEXT NULL,
    `kind` ENUM('ABSTRACT', 'STRUCTURAL', 'AUXILIARY') NOT NULL DEFAULT 'STRUCTURAL',
    `mandatories` TEXT NULL,
    `optionals` TEXT NULL,
    `ldapNames` VARCHAR(191) NULL,
    `ldapDescription` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `entry_id` INTEGER NULL,

    UNIQUE INDEX `ObjectClassDescription_entry_id_identifier_key`(`entry_id`, `identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(128) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `syntax` TEXT NOT NULL,
    `assertionSyntax` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `absentMatch` BOOLEAN NOT NULL DEFAULT true,
    `defaultValue` LONGBLOB NULL,
    `entry_id` INTEGER NULL,

    UNIQUE INDEX `ContextDescription_entry_id_identifier_key`(`entry_id`, `identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationalBinding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NULL,
    `previous_id` INTEGER NULL,
    `outbound` BOOLEAN NOT NULL,
    `uuid` VARCHAR(191) NOT NULL,
    `binding_type` VARCHAR(128) NOT NULL,
    `binding_identifier` INTEGER NOT NULL,
    `binding_version` INTEGER NOT NULL,
    `agreement_ber` LONGBLOB NOT NULL,
    `access_point_id` INTEGER NULL,
    `initiator` ENUM('SYMMETRIC', 'ROLE_A', 'ROLE_B') NOT NULL,
    `initiator_ber` LONGBLOB NOT NULL,
    `validity_start` DATETIME(3) NOT NULL,
    `validity_end` DATETIME(3) NULL,
    `security_certification_path` LONGBLOB NULL,
    `security_name` JSON NULL,
    `security_time` DATETIME(3) NULL,
    `security_random` LONGBLOB NULL,
    `security_target` SMALLINT NULL,
    `security_operationCode` VARCHAR(191) NULL,
    `security_errorProtection` SMALLINT NULL,
    `security_errorCode` VARCHAR(191) NULL,
    `new_context_prefix_rdn` JSON NULL,
    `immediate_superior` JSON NULL,
    `shadowed_context_prefix` JSON NULL,
    `knowledge_type` ENUM('MASTER', 'SHADOW', 'BOTH') NULL,
    `subordinates` BOOLEAN NULL,
    `supply_contexts` TEXT NULL,
    `supplier_initiated` BOOLEAN NULL,
    `periodic_beginTime` DATETIME(3) NULL,
    `periodic_windowSize` INTEGER NULL,
    `periodic_updateInterval` INTEGER NULL,
    `othertimes` BOOLEAN NULL,
    `master_access_point_id` INTEGER NULL,
    `secondary_shadows` BOOLEAN NULL,
    `source_ip` VARCHAR(191) NULL,
    `source_tcp_port` INTEGER NULL,
    `source_ae_title` JSON NULL,
    `source_credentials_type` SMALLINT NULL,
    `source_certificate_path` LONGBLOB NULL,
    `source_bind_token` LONGBLOB NULL,
    `source_strong_name` JSON NULL,
    `source_attr_cert_path` LONGBLOB NULL,
    `requested_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `responded_time` DATETIME(3) NULL,
    `terminated_time` DATETIME(3) NULL,
    `accepted` BOOLEAN NULL,
    `last_update` DATETIME(3) NULL,
    `last_ob_problem` SMALLINT NULL,
    `last_shadow_problem` SMALLINT NULL,
    `local_last_update` DATETIME(3) NULL,
    `remote_last_update` DATETIME(3) NULL,
    `requested_strategy` ENUM('TOTAL', 'INCREMENTAL', 'EXTERNAL') NULL,
    `requested_strategy_external_ber` LONGBLOB NULL,

    INDEX `OperationalBinding_binding_type_binding_identifier_binding_v_idx`(`binding_type`, `binding_identifier`, `binding_version`, `terminated_time`),
    INDEX `OperationalBinding_validity_end_validity_start_idx`(`validity_end`, `validity_start`),
    INDEX `OperationalBinding_entry_id_idx`(`entry_id`),
    INDEX `OperationalBinding_previous_id_idx`(`previous_id`),
    UNIQUE INDEX `OperationalBinding_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NamedObjectIdentifier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `oid` VARCHAR(128) NOT NULL,
    `name` VARCHAR(128) NOT NULL,

    INDEX `NamedObjectIdentifier_name_idx`(`name`),
    UNIQUE INDEX `NamedObjectIdentifier_oid_key`(`oid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DistinguishedValue` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `type_oid` LONGBLOB NOT NULL,
    `tag_class` SMALLINT NOT NULL,
    `constructed` BOOLEAN NOT NULL,
    `tag_number` INTEGER NOT NULL,
    `content_octets` LONGBLOB NOT NULL,
    `normalized_str` VARCHAR(191) NULL,
    `order_index` INTEGER NOT NULL,

    UNIQUE INDEX `DistinguishedValue_entry_id_type_oid_key`(`entry_id`, `type_oid`(32)),
    UNIQUE INDEX `DistinguishedValue_type_oid_normalized_str_entry_id_key`(`type_oid`(32), `normalized_str`, `entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryObjectClass` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `object_class` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EntryObjectClass_object_class_entry_id_idx`(`object_class`, `entry_id`),
    UNIQUE INDEX `EntryObjectClass_entry_id_object_class_key`(`entry_id`, `object_class`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alias_entry_id` INTEGER NOT NULL,
    `aliased_entry_id` INTEGER NULL,
    `aliased_entry_name` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Alias_aliased_entry_id_key`(`aliased_entry_id`),
    INDEX `Alias_aliased_entry_id_idx`(`aliased_entry_id`),
    UNIQUE INDEX `Alias_alias_entry_id_key`(`alias_entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryAttributeValuesIncomplete` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `attribute_type` VARCHAR(128) NOT NULL,

    UNIQUE INDEX `EntryAttributeValuesIncomplete_entry_id_attribute_type_key`(`entry_id`, `attribute_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AltServer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uri` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InstalledVersions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `installedTimestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `version` VARCHAR(191) NOT NULL,
    `migration_problems` TEXT NULL,

    INDEX `InstalledVersions_version_idx`(`version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnqueuedSearchResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `connection_uuid` VARCHAR(40) NOT NULL,
    `query_ref` VARCHAR(40) NOT NULL,
    `result_index` INTEGER NOT NULL,
    `entry_id` INTEGER NULL,
    `entry_info` LONGBLOB NOT NULL,

    UNIQUE INDEX `EnqueuedSearchResult_connection_uuid_query_ref_result_index_key`(`connection_uuid`, `query_ref`, `result_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnqueuedListResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `connection_uuid` VARCHAR(40) NOT NULL,
    `query_ref` VARCHAR(40) NOT NULL,
    `result_index` INTEGER NOT NULL,
    `entry_id` INTEGER NULL,
    `subordinate_info` LONGBLOB NOT NULL,

    UNIQUE INDEX `EnqueuedListResult_connection_uuid_query_ref_result_index_key`(`connection_uuid`, `query_ref`, `result_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessPointCredentials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `access_point_id` INTEGER NOT NULL,
    `simple_name` JSON NULL,
    `simple_password_unprotected` LONGBLOB NULL,
    `simple_password_hash_value` LONGBLOB NULL,
    `simple_password_hash_algorithm_oid` VARCHAR(191) NULL,
    `simple_password_hash_algorithm_parameters` LONGBLOB NULL,
    `strong_pkcs12` LONGBLOB NULL,
    `mtls_client_pkcs12` LONGBLOB NULL,

    UNIQUE INDEX `AccessPointCredentials_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostalCodesGazetteEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `c2c` CHAR(2) NOT NULL,
    `st` VARCHAR(191) NOT NULL,
    `locality` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PostalCodesGazetteEntry_c2c_st_locality_postal_code_key`(`c2c`, `st`, `locality`, `postal_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostalCodeBoundaryPoints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postal_code_id` INTEGER NOT NULL,
    `northing` INTEGER NOT NULL,
    `easting` INTEGER NOT NULL,

    INDEX `PostalCodeBoundaryPoints_postal_code_id_idx`(`postal_code_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PendingShadowIncrementalStepRefresh` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `binding_identifier` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ber` LONGBLOB NOT NULL,
    `submitted` BOOLEAN NOT NULL DEFAULT false,
    `acknowledged` BOOLEAN NOT NULL DEFAULT false,
    `rename` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('OTHER', 'ADD', 'REMOVE', 'MODIFY', 'MULTI') NOT NULL,

    INDEX `PendingShadowIncrementalStepRefresh_binding_identifier_time_idx`(`binding_identifier`, `time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_immediate_superior_id_fkey` FOREIGN KEY (`immediate_superior_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_hierarchyParent_id_fkey` FOREIGN KEY (`hierarchyParent_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_hierarchyTop_id_fkey` FOREIGN KEY (`hierarchyTop_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Password` ADD CONSTRAINT `Password_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordHistory` ADD CONSTRAINT `PasswordHistory_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeValue` ADD CONSTRAINT `AttributeValue_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextValue` ADD CONSTRAINT `ContextValue_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `AttributeValue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_non_supplying_master_id_fkey` FOREIGN KEY (`non_supplying_master_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_is_consumer_of_id_fkey` FOREIGN KEY (`is_consumer_of_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkServiceAccessPoint` ADD CONSTRAINT `NetworkServiceAccessPoint_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NameForm` ADD CONSTRAINT `NameForm_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DITStructureRule` ADD CONSTRAINT `DITStructureRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentRule` ADD CONSTRAINT `ContentRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextUseRule` ADD CONSTRAINT `ContextUseRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friendship` ADD CONSTRAINT `Friendship_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchingRuleUse` ADD CONSTRAINT `MatchingRuleUse_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeTypeDescription` ADD CONSTRAINT `AttributeTypeDescription_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectClassDescription` ADD CONSTRAINT `ObjectClassDescription_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextDescription` ADD CONSTRAINT `ContextDescription_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_previous_id_fkey` FOREIGN KEY (`previous_id`) REFERENCES `OperationalBinding`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_master_access_point_id_fkey` FOREIGN KEY (`master_access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DistinguishedValue` ADD CONSTRAINT `DistinguishedValue_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryObjectClass` ADD CONSTRAINT `EntryObjectClass_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_alias_entry_id_fkey` FOREIGN KEY (`alias_entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_aliased_entry_id_fkey` FOREIGN KEY (`aliased_entry_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAttributeValuesIncomplete` ADD CONSTRAINT `EntryAttributeValuesIncomplete_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnqueuedSearchResult` ADD CONSTRAINT `EnqueuedSearchResult_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnqueuedListResult` ADD CONSTRAINT `EnqueuedListResult_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPointCredentials` ADD CONSTRAINT `AccessPointCredentials_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostalCodeBoundaryPoints` ADD CONSTRAINT `PostalCodeBoundaryPoints_postal_code_id_fkey` FOREIGN KEY (`postal_code_id`) REFERENCES `PostalCodesGazetteEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
