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
    `hierarchyTop_id` INTEGER NULL,
    `hierarchyTopDN` JSON NULL,
    `hierarchyPath` VARCHAR(191) NULL,
    `otherData` JSON NULL,

    INDEX `Entry_immediate_superior_id_deleteTimestamp_subentry_idx`(`immediate_superior_id`, `deleteTimestamp`, `subentry`),
    INDEX `Entry_materialized_path_idx`(`materialized_path`),
    INDEX `Entry_hierarchyTop_id_idx`(`hierarchyTop_id`),
    INDEX `Entry_hierarchyParent_id_idx`(`hierarchyParent_id`),
    INDEX `Entry_hierarchyPath_idx`(`hierarchyPath`),
    UNIQUE INDEX `Entry_dseUUID_key`(`dseUUID`),
    UNIQUE INDEX `Entry_entryUUID_key`(`entryUUID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UniqueIdentifier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `uniqueIdentifier` LONGBLOB NOT NULL,

    INDEX `UniqueIdentifier_entry_id_idx`(`entry_id`),
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
CREATE TABLE `PasswordEncryptionAlgorithm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `oid` VARCHAR(128) NOT NULL,
    `parameters` LONGBLOB NULL,

    UNIQUE INDEX `PasswordEncryptionAlgorithm_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `operational` BOOLEAN NOT NULL DEFAULT false,
    `tag_class` SMALLINT NOT NULL,
    `constructed` BOOLEAN NOT NULL,
    `tag_number` INTEGER NOT NULL,
    `index_key` INTEGER NULL,
    `ber` LONGBLOB NOT NULL,
    `jer` JSON NULL,
    `security_label` LONGBLOB NULL,
    `security_policy_identifier` VARCHAR(191) NULL,
    `security_classification` SMALLINT NULL,
    `privacy_mark` VARCHAR(191) NULL,

    INDEX `AttributeValue_entry_id_type_index_key_idx`(`entry_id`, `type`, `index_key`),
    INDEX `AttributeValue_entry_id_type_tag_class_constructed_tag_numbe_idx`(`entry_id`, `type`, `tag_class`, `constructed`, `tag_number`),
    INDEX `AttributeValue_entry_id_operational_type_idx`(`entry_id`, `operational`, `type`),
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
    `hint` BIGINT NULL,
    `jer` JSON NULL,
    `fallback` BOOLEAN NOT NULL,

    INDEX `ContextValue_value_id_idx`(`value_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ACIItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `tag` VARCHAR(191) NOT NULL,
    `precedence` INTEGER NOT NULL,
    `auth_level_basic_level` INTEGER NULL,
    `auth_level_basic_local_qualifier` INTEGER NULL,
    `auth_level_basic_signed` BOOLEAN NULL,
    `auth_level_other_dir_ref` VARCHAR(128) NULL,
    `auth_level_other_indir_ref` INTEGER NULL,
    `auth_level_other_descriptor` VARCHAR(191) NULL,
    `auth_level_other_encoding_type` INTEGER NULL,
    `auth_level_other_encoding` LONGBLOB NULL,
    `ber` LONGBLOB NOT NULL,
    `scope` ENUM('PRESCRIPTIVE', 'ENTRY', 'SUBENTRY') NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ACIItem_entry_id_active_precedence_idx`(`entry_id`, `active`, `precedence`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clearance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `policy_id` VARCHAR(128) NOT NULL,
    `unmarked` BOOLEAN NOT NULL DEFAULT false,
    `unclassified` BOOLEAN NOT NULL DEFAULT false,
    `restricted` BOOLEAN NOT NULL DEFAULT false,
    `confidential` BOOLEAN NOT NULL DEFAULT false,
    `secret` BOOLEAN NOT NULL DEFAULT false,
    `topSecret` BOOLEAN NOT NULL DEFAULT false,
    `ber` LONGBLOB NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Clearance_entry_id_active_policy_id_idx`(`entry_id`, `active`, `policy_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClearanceSecurityCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clearance_id` INTEGER NOT NULL,
    `type` VARCHAR(128) NOT NULL,
    `value` LONGBLOB NOT NULL,

    INDEX `ClearanceSecurityCategory_clearance_id_type_idx`(`clearance_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ber` LONGBLOB NOT NULL,
    `knowledge_type` ENUM('MY_ACCESS_POINT', 'SUPERIOR', 'SPECIFIC', 'NON_SPECIFIC', 'SUPPLIER', 'CONSUMER', 'SECONDARY_SUPPLIER', 'SECONDARY_CONSUMER', 'OTHER', 'OB_REQUEST', 'OB_SHADOW_MASTER', 'NON_SUPPLYING_MASTER') NOT NULL,
    `ae_title` JSON NOT NULL,
    `category` INTEGER NULL,
    `chainingRequired` BOOLEAN NULL,
    `supplier_is_master` BOOLEAN NULL,
    `non_supplying_master_id` INTEGER NULL,
    `is_consumer_of_id` INTEGER NULL,
    `entry_id` INTEGER NULL,
    `nsk_group` BIGINT NULL,
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
CREATE TABLE `SubtreeSpecification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `base` JSON NULL,
    `specific_exclusions` JSON NULL,
    `minimum` INTEGER NOT NULL DEFAULT 0,
    `maximum` INTEGER NULL,
    `specification_filter` JSON NULL,
    `ber` LONGBLOB NOT NULL,
    `entry_id` INTEGER NOT NULL,

    INDEX `SubtreeSpecification_entry_id_idx`(`entry_id`),
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
    `description` VARCHAR(191) NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NameForm_namedObjectClass_idx`(`namedObjectClass`),
    UNIQUE INDEX `NameForm_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DITStructureRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruleIdentifier` INTEGER NOT NULL,
    `nameForm` VARCHAR(128) NOT NULL,
    `superiorStructureRules` TEXT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
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
    `description` VARCHAR(191) NULL,
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
    `description` VARCHAR(191) NULL,
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
    `description` VARCHAR(191) NULL,
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
    `description` VARCHAR(191) NULL,
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
    `description` VARCHAR(191) NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `derivation` VARCHAR(128) NULL,
    `equalityMatch` VARCHAR(128) NULL,
    `orderingMatch` VARCHAR(128) NULL,
    `substringsMatch` VARCHAR(128) NULL,
    `attributeSyntax` VARCHAR(191) NULL,
    `multiValued` BOOLEAN NOT NULL DEFAULT true,
    `collective` BOOLEAN NOT NULL DEFAULT false,
    `userModifiable` BOOLEAN NOT NULL DEFAULT true,
    `application` ENUM('USER_APPLICATIONS', 'DSA_OPERATION', 'DISTRIBUTED_OPERATION', 'DIRECTORY_OPERATION') NOT NULL DEFAULT 'USER_APPLICATIONS',
    `ldapSyntax` VARCHAR(128) NULL,
    `ldapNames` VARCHAR(191) NULL,
    `ldapDescription` VARCHAR(191) NULL,
    `dummy` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AttributeTypeDescription_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectClassDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(128) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `subclassOf` TEXT NULL,
    `kind` ENUM('ABSTRACT', 'STRUCTURAL', 'AUXILIARY') NOT NULL DEFAULT 'STRUCTURAL',
    `mandatories` TEXT NULL,
    `optionals` TEXT NULL,
    `ldapNames` VARCHAR(191) NULL,
    `ldapDescription` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ObjectClassDescription_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(128) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `syntax` VARCHAR(191) NOT NULL,
    `assertionSyntax` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ContextDescription_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `dmd_id` VARCHAR(128) NOT NULL,
    `service_type` VARCHAR(128) NULL,
    `user_class` INTEGER NULL,
    `family_grouping` INTEGER NULL,
    `family_return_member_select` INTEGER NULL,
    `relaxation_minimum` INTEGER NOT NULL DEFAULT 1,
    `relaxation_maximum` INTEGER NULL,
    `additionalControl` TEXT NULL,
    `base_object_allowed` BOOLEAN NOT NULL DEFAULT true,
    `one_level_allowed` BOOLEAN NOT NULL DEFAULT true,
    `whole_subtree_allowed` BOOLEAN NOT NULL DEFAULT true,
    `imposed_subset` INTEGER NULL,
    `entry_limit_default` INTEGER NULL,
    `entry_limit_max` INTEGER NULL,
    `ber` LONGBLOB NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `entry_id` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SearchRule_rule_id_key`(`rule_id`),
    INDEX `SearchRule_rule_id_idx`(`rule_id`),
    INDEX `SearchRule_user_class_idx`(`user_class`),
    INDEX `SearchRule_entry_id_idx`(`entry_id`),
    UNIQUE INDEX `SearchRule_dmd_id_rule_id_key`(`dmd_id`, `rule_id`),
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
    `source_tcp_port` SMALLINT NULL,
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

    UNIQUE INDEX `OperationalBinding_previous_id_key`(`previous_id`),
    INDEX `OperationalBinding_validity_end_validity_start_idx`(`validity_end`, `validity_start`),
    INDEX `OperationalBinding_entry_id_idx`(`entry_id`),
    UNIQUE INDEX `OperationalBinding_uuid_key`(`uuid`),
    UNIQUE INDEX `OperationalBinding_binding_type_binding_identifier_binding_v_key`(`binding_type`, `binding_identifier`, `binding_version`, `terminated_time`),
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
    `type` VARCHAR(128) NOT NULL,
    `value` LONGBLOB NOT NULL,
    `str` VARCHAR(191) NULL,
    `order_index` INTEGER NOT NULL,

    UNIQUE INDEX `DistinguishedValue_entry_id_type_key`(`entry_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryObjectClass` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `object_class` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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
CREATE TABLE `EntryAdministrativeRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `administrativeRole` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EntryAdministrativeRole_entry_id_administrativeRole_key`(`entry_id`, `administrativeRole`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryCollectiveExclusion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `collectiveExclusion` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EntryCollectiveExclusion_entry_id_collectiveExclusion_key`(`entry_id`, `collectiveExclusion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryAccessControlScheme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `accessControlScheme` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EntryAccessControlScheme_entry_id_key`(`entry_id`),
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

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_immediate_superior_id_fkey` FOREIGN KEY (`immediate_superior_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_hierarchyParent_id_fkey` FOREIGN KEY (`hierarchyParent_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_hierarchyTop_id_fkey` FOREIGN KEY (`hierarchyTop_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UniqueIdentifier` ADD CONSTRAINT `UniqueIdentifier_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Password` ADD CONSTRAINT `Password_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordHistory` ADD CONSTRAINT `PasswordHistory_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordEncryptionAlgorithm` ADD CONSTRAINT `PasswordEncryptionAlgorithm_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeValue` ADD CONSTRAINT `AttributeValue_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextValue` ADD CONSTRAINT `ContextValue_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `AttributeValue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ACIItem` ADD CONSTRAINT `ACIItem_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clearance` ADD CONSTRAINT `Clearance_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClearanceSecurityCategory` ADD CONSTRAINT `ClearanceSecurityCategory_clearance_id_fkey` FOREIGN KEY (`clearance_id`) REFERENCES `Clearance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_non_supplying_master_id_fkey` FOREIGN KEY (`non_supplying_master_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_is_consumer_of_id_fkey` FOREIGN KEY (`is_consumer_of_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkServiceAccessPoint` ADD CONSTRAINT `NetworkServiceAccessPoint_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubtreeSpecification` ADD CONSTRAINT `SubtreeSpecification_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `SearchRule` ADD CONSTRAINT `SearchRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_master_access_point_id_fkey` FOREIGN KEY (`master_access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_previous_id_fkey` FOREIGN KEY (`previous_id`) REFERENCES `OperationalBinding`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DistinguishedValue` ADD CONSTRAINT `DistinguishedValue_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryObjectClass` ADD CONSTRAINT `EntryObjectClass_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_alias_entry_id_fkey` FOREIGN KEY (`alias_entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_aliased_entry_id_fkey` FOREIGN KEY (`aliased_entry_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAdministrativeRole` ADD CONSTRAINT `EntryAdministrativeRole_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryCollectiveExclusion` ADD CONSTRAINT `EntryCollectiveExclusion_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAccessControlScheme` ADD CONSTRAINT `EntryAccessControlScheme_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAttributeValuesIncomplete` ADD CONSTRAINT `EntryAttributeValuesIncomplete_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnqueuedSearchResult` ADD CONSTRAINT `EnqueuedSearchResult_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnqueuedListResult` ADD CONSTRAINT `EnqueuedListResult_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPointCredentials` ADD CONSTRAINT `AccessPointCredentials_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
