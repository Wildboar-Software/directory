-- CreateTable
CREATE TABLE `Entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `immediate_superior_id` INTEGER,
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
    `createdTimestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifyTimestamp` DATETIME(3) NOT NULL,
    `deleteTimestamp` DATETIME(3),
    `creatorsName` JSON NOT NULL,
    `modifiersName` JSON NOT NULL,
    `uniqueIdentifier` LONGBLOB,
    `entryUUID` VARCHAR(191) NOT NULL,
    `subordinate_completeness` BOOLEAN,
    `attribute_completeness` BOOLEAN,
    `attribute_values_incomplete` BOOLEAN,
    `keep_children_in_database` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Entry_immediate_superior_id_deleteTimestamp_subentry_idx`(`immediate_superior_id`, `deleteTimestamp`, `subentry`),
    UNIQUE INDEX `Entry_entryUUID_key`(`entryUUID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Password` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `encrypted` LONGBLOB NOT NULL,
    `algorithm_oid` VARCHAR(191) NOT NULL,
    `algorithm_parameters_der` LONGBLOB,
    `pwdStartTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pwdExpiryTime` DATETIME(3),
    `pwdEndTime` DATETIME(3),
    `pwdFails` INTEGER NOT NULL DEFAULT 0,
    `pwdFailureTime` DATETIME(3),
    `pwdGracesUsed` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Password_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdModifyEntryAllowed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `PwdModifyEntryAllowed_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdChangeAllowed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `PwdChangeAllowed_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMaxAge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMaxAge_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdExpiryAge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdExpiryAge_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMinLength` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMinLength_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoDictionaryWords` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `NoDictionaryWords_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoPersonNames` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `NoPersonNames_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoGeographicalNames` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` BOOLEAN NOT NULL,

    UNIQUE INDEX `NoGeographicalNames_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdDictionaries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdExpiryWarning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdExpiryWarning_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdGraces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdGraces_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdFailureDuration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdFailureDuration_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdLockoutDuration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdLockoutDuration_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMaxFailures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMaxFailures_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMaxTimeInHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMaxTimeInHistory_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdMinTimeInHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdMinTimeInHistory_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdHistorySlots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdHistorySlots_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PwdRecentlyExpiredDuration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `value` INTEGER NOT NULL,

    UNIQUE INDEX `PwdRecentlyExpiredDuration_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `tag_class` SMALLINT NOT NULL,
    `constructed` BOOLEAN NOT NULL,
    `tag_number` INTEGER NOT NULL,
    `ber` LONGBLOB NOT NULL,
    `jer` JSON,
    `sort_key` BIGINT UNSIGNED,
    `security_label` LONGBLOB,
    `security_policy_identifier` VARCHAR(191),
    `security_classification` SMALLINT,
    `privacy_mark` VARCHAR(191),

    INDEX `AttributeValue_entry_id_idx`(`entry_id`),
    INDEX `AttributeValue_type_sort_key_idx`(`type`, `sort_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `tag_class` SMALLINT NOT NULL,
    `constructed` BOOLEAN NOT NULL,
    `tag_number` INTEGER NOT NULL,
    `ber` LONGBLOB NOT NULL,
    `hint` BIGINT,
    `jer` JSON,
    `fallback` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ACIItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `tag` VARCHAR(191) NOT NULL,
    `precedence` INTEGER NOT NULL,
    `auth_level_basic_level` INTEGER,
    `auth_level_basic_local_qualifier` INTEGER,
    `auth_level_basic_signed` BOOLEAN,
    `ber` LONGBLOB NOT NULL,
    `scope` ENUM('PRESCRIPTIVE', 'ENTRY', 'SUBENTRY') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clearance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `policy_id` VARCHAR(191) NOT NULL,
    `unmarked` BOOLEAN NOT NULL,
    `unclassified` BOOLEAN NOT NULL,
    `restricted` BOOLEAN NOT NULL,
    `confidential` BOOLEAN NOT NULL,
    `secret` BOOLEAN NOT NULL,
    `topSecret` BOOLEAN NOT NULL,
    `security_categories_covered` JSON NOT NULL,
    `ber` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ber` LONGBLOB NOT NULL,
    `knowledge_type` ENUM('MY_ACCESS_POINT', 'SUPERIOR', 'SPECIFIC', 'NON_SPECIFIC', 'SUPPLIER', 'CONSUMER', 'SECONDARY_SHADOW', 'OTHER', 'OB_REQUEST', 'OB_SHADOW_MASTER', 'NON_SUPPLYING_MASTER') NOT NULL,
    `ae_title` JSON NOT NULL,
    `category` INTEGER,
    `chainingRequired` BOOLEAN,
    `supplier_is_master` BOOLEAN,
    `non_supplying_master_id` INTEGER,
    `is_consumer_of_id` INTEGER,
    `entry_id` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NetworkServiceAccessPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ipv4` VARCHAR(191),
    `tcp_port` INTEGER,
    `url` VARCHAR(191),
    `bytes` LONGBLOB NOT NULL,
    `access_point_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NonSpecificKnowledge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ber` LONGBLOB NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubtreeSpecification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `base` JSON,
    `specific_exclusions` JSON,
    `minimum` INTEGER NOT NULL DEFAULT 0,
    `maximum` INTEGER,
    `specification_filter` JSON,
    `ber` LONGBLOB NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DitBridgeKnowledge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `domain_local_id` VARCHAR(191) NOT NULL,
    `ber` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NameForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `oid` VARCHAR(191) NOT NULL,
    `namedObjectClass` VARCHAR(191) NOT NULL,
    `mandatoryAttributes` VARCHAR(191) NOT NULL,
    `optionalAttributes` VARCHAR(191) NOT NULL,
    `ldapName` VARCHAR(191) NOT NULL,
    `ldapDesc` VARCHAR(191),
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `NameForm_oid_key`(`oid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DITStructureRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruleIdentifier` INTEGER NOT NULL,
    `nameForm_id` INTEGER NOT NULL,
    `superiorStructureRules` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,

    INDEX `DITStructureRule_ruleIdentifier_idx`(`ruleIdentifier`),
    INDEX `DITStructureRule_entry_id_idx`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `structural_class` VARCHAR(191) NOT NULL,
    `auxiliary_classes` VARCHAR(191) NOT NULL,
    `mandatory_attributes` VARCHAR(191) NOT NULL,
    `optional_attributes` VARCHAR(191) NOT NULL,
    `precluded_attributes` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,

    INDEX `ContentRule_entry_id_idx`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextUseRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attributeType` VARCHAR(191) NOT NULL,
    `mandatory` VARCHAR(191) NOT NULL,
    `optional` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,

    INDEX `ContextUseRule_entry_id_idx`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friendship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anchor` VARCHAR(191) NOT NULL,
    `friends` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `entry_id` INTEGER NOT NULL,

    UNIQUE INDEX `Friendship_entry_id_anchor_key`(`entry_id`, `anchor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchingRuleUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `information` VARCHAR(191) NOT NULL,
    `entry_id` INTEGER NOT NULL,

    UNIQUE INDEX `MatchingRuleUse_entry_id_identifier_key`(`entry_id`, `identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeTypeDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `derivation` VARCHAR(191),
    `equalityMatch` VARCHAR(191),
    `orderingMatch` VARCHAR(191),
    `substringsMatch` VARCHAR(191),
    `attributeSyntax` VARCHAR(191),
    `multiValued` BOOLEAN NOT NULL DEFAULT true,
    `collective` BOOLEAN NOT NULL DEFAULT false,
    `userModifiable` BOOLEAN NOT NULL DEFAULT true,
    `application` ENUM('USER_APPLICATIONS', 'DSA_OPERATION', 'DISTRIBUTED_OPERATION', 'DIRECTORY_OPERATION') NOT NULL DEFAULT 'USER_APPLICATIONS',
    `ldapSyntax` VARCHAR(191),
    `ldapNames` VARCHAR(191),
    `ldapDescription` VARCHAR(191),
    `dummy` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `AttributeTypeDescription_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectClassDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `subclassOf` VARCHAR(191) NOT NULL,
    `kind` ENUM('ABSTRACT', 'STRUCTURAL', 'AUXILIARY') NOT NULL DEFAULT 'STRUCTURAL',
    `mandatories` VARCHAR(191) NOT NULL,
    `optionals` VARCHAR(191) NOT NULL,
    `ldapNames` VARCHAR(191),
    `ldapDescription` VARCHAR(191),

    UNIQUE INDEX `ObjectClassDescription_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `syntax` VARCHAR(191) NOT NULL,
    `assertionSyntax` VARCHAR(191),

    UNIQUE INDEX `ContextDescription_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `dmd_id` VARCHAR(191) NOT NULL,
    `service_type` VARCHAR(191),
    `user_class` INTEGER,
    `family_grouping` INTEGER,
    `family_return_member_select` INTEGER,
    `relaxation_minimum` INTEGER NOT NULL DEFAULT 1,
    `relaxation_maximum` INTEGER,
    `additionalControl` VARCHAR(191) NOT NULL,
    `base_object_allowed` BOOLEAN NOT NULL DEFAULT true,
    `one_level_allowed` BOOLEAN NOT NULL DEFAULT true,
    `whole_subtree_allowed` BOOLEAN NOT NULL DEFAULT true,
    `imposed_subset` INTEGER,
    `entry_limit_default` INTEGER,
    `entry_limit_max` INTEGER,
    `ber` LONGBLOB NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `entry_id` INTEGER NOT NULL,

    UNIQUE INDEX `SearchRule_rule_id_key`(`rule_id`),
    INDEX `SearchRule_rule_id_idx`(`rule_id`),
    INDEX `SearchRule_user_class_idx`(`user_class`),
    UNIQUE INDEX `SearchRule_dmd_id_rule_id_key`(`dmd_id`, `rule_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `version` SMALLINT NOT NULL,
    `serial_number` LONGBLOB NOT NULL,
    `issuer` JSON NOT NULL,
    `subject` JSON NOT NULL,
    `not_before` DATETIME(3) NOT NULL,
    `not_after` DATETIME(3) NOT NULL,
    `signature_alg` VARCHAR(191) NOT NULL,
    `spki_alg` VARCHAR(191) NOT NULL,
    `authority_key_identifier` LONGBLOB NOT NULL,
    `authority_cert_serial_number` LONGBLOB NOT NULL,
    `subject_key_identifier` LONGBLOB NOT NULL,
    `ca` BOOLEAN,
    `path_len` INTEGER,
    `key_usage_digitalSignature` BOOLEAN,
    `key_usage_contentCommitment` BOOLEAN,
    `key_usage_keyEncipherment` BOOLEAN,
    `key_usage_dataEncipherment` BOOLEAN,
    `key_usage_keyAgreement` BOOLEAN,
    `key_usage_keyCertSign` BOOLEAN,
    `key_usage_cRLSign` BOOLEAN,
    `key_usage_encipherOnly` BOOLEAN,
    `key_usage_decipherOnly` BOOLEAN,
    `ext_key_usage` VARCHAR(191) NOT NULL,
    `private_key_usage_not_before` DATETIME(3),
    `private_key_usage_not_after` DATETIME(3),
    `certificate_policies` VARCHAR(191) NOT NULL,
    `crl_distribution_points_count` INTEGER NOT NULL,
    `revoked_time` DATETIME(3),
    `revoked_reason` INTEGER,
    `signature_bytes` LONGBLOB NOT NULL,
    `subject_public_key_bytes` LONGBLOB NOT NULL,
    `certificate_der` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationalBinding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `previous_id` INTEGER,
    `outbound` BOOLEAN NOT NULL,
    `uuid` VARCHAR(191) NOT NULL,
    `binding_type` VARCHAR(191) NOT NULL,
    `binding_identifier` INTEGER NOT NULL,
    `binding_version` INTEGER NOT NULL,
    `agreement_ber` LONGBLOB NOT NULL,
    `access_point_id` INTEGER NOT NULL,
    `initiator` ENUM('SYMMETRIC', 'ROLE_A', 'ROLE_B') NOT NULL,
    `initiator_ber` LONGBLOB NOT NULL,
    `validity_start` DATETIME(3) NOT NULL,
    `validity_end` DATETIME(3),
    `security_certification_path` LONGBLOB,
    `security_name` JSON,
    `security_time` DATETIME(3),
    `security_random` LONGBLOB,
    `security_target` SMALLINT,
    `security_operationCode` VARCHAR(191),
    `security_errorProtection` SMALLINT,
    `security_errorCode` VARCHAR(191),
    `new_context_prefix_rdn` JSON,
    `immediate_superior` JSON,
    `shadowed_context_prefix` JSON,
    `knowledge_type` ENUM('MASTER', 'SHADOW', 'BOTH'),
    `subordinates` BOOLEAN,
    `supply_contexts` VARCHAR(191),
    `supplier_initiated` BOOLEAN,
    `periodic_beginTime` DATETIME(3),
    `periodic_windowSize` INTEGER,
    `periodic_updateInterval` INTEGER,
    `othertimes` BOOLEAN,
    `master_access_point_id` INTEGER,
    `secondary_shadows` BOOLEAN,
    `source_ip` VARCHAR(191),
    `source_tcp_port` SMALLINT,
    `source_ae_title` JSON,
    `source_credentials_type` SMALLINT,
    `source_certificate_path` LONGBLOB,
    `source_bind_token` LONGBLOB,
    `source_strong_name` JSON,
    `source_attr_cert_path` LONGBLOB,
    `requested_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `responded_time` DATETIME(3),
    `terminated_time` DATETIME(3),
    `accepted` BOOLEAN,
    `last_update` DATETIME(3),
    `last_ob_problem` SMALLINT,
    `last_shadow_problem` SMALLINT,

    UNIQUE INDEX `OperationalBinding_previous_id_key`(`previous_id`),
    INDEX `OperationalBinding_validity_end_validity_start_idx`(`validity_end`, `validity_start`),
    UNIQUE INDEX `OperationalBinding_uuid_key`(`uuid`),
    UNIQUE INDEX `OperationalBinding_binding_type_binding_identifier_binding_v_key`(`binding_type`, `binding_identifier`, `binding_version`, `terminated_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhitelistedOperationalBinding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `binding_type` VARCHAR(191) NOT NULL,
    `initiator` ENUM('SYMMETRIC', 'ROLE_A', 'ROLE_B'),
    `min_validity_start` DATETIME(3),
    `max_validity_end` DATETIME(3),
    `hostnames` VARCHAR(191) NOT NULL,
    `subnet` VARCHAR(191),
    `permitted` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NamedObjectIdentifier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `oid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(128) NOT NULL,

    INDEX `NamedObjectIdentifier_name_idx`(`name`),
    UNIQUE INDEX `NamedObjectIdentifier_oid_key`(`oid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RDN` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` LONGBLOB NOT NULL,
    `str` VARCHAR(191),

    UNIQUE INDEX `RDN_entry_id_type_key`(`entry_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryObjectClass` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `object_class` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntryObjectClass_entry_id_object_class_key`(`entry_id`, `object_class`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alias_entry_id` INTEGER NOT NULL,
    `aliased_entry_id` INTEGER,
    `aliased_entry_name` JSON,

    INDEX `Alias_aliased_entry_id_idx`(`aliased_entry_id`),
    UNIQUE INDEX `Alias_alias_entry_id_key`(`alias_entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryAdministrativeRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `administrativeRole` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntryAdministrativeRole_entry_id_administrativeRole_key`(`entry_id`, `administrativeRole`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryCollectiveExclusion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `collectiveExclusion` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntryCollectiveExclusion_entry_id_collectiveExclusion_key`(`entry_id`, `collectiveExclusion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryAccessControlScheme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
    `accessControlScheme` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EntryAccessControlScheme_entry_id_key`(`entry_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_immediate_superior_id_fkey` FOREIGN KEY (`immediate_superior_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Password` ADD CONSTRAINT `Password_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdModifyEntryAllowed` ADD CONSTRAINT `PwdModifyEntryAllowed_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdChangeAllowed` ADD CONSTRAINT `PwdChangeAllowed_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxAge` ADD CONSTRAINT `PwdMaxAge_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdExpiryAge` ADD CONSTRAINT `PwdExpiryAge_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMinLength` ADD CONSTRAINT `PwdMinLength_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoDictionaryWords` ADD CONSTRAINT `NoDictionaryWords_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoPersonNames` ADD CONSTRAINT `NoPersonNames_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoGeographicalNames` ADD CONSTRAINT `NoGeographicalNames_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdDictionaries` ADD CONSTRAINT `PwdDictionaries_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdExpiryWarning` ADD CONSTRAINT `PwdExpiryWarning_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdGraces` ADD CONSTRAINT `PwdGraces_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdFailureDuration` ADD CONSTRAINT `PwdFailureDuration_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdLockoutDuration` ADD CONSTRAINT `PwdLockoutDuration_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxFailures` ADD CONSTRAINT `PwdMaxFailures_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMaxTimeInHistory` ADD CONSTRAINT `PwdMaxTimeInHistory_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdMinTimeInHistory` ADD CONSTRAINT `PwdMinTimeInHistory_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdHistorySlots` ADD CONSTRAINT `PwdHistorySlots_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PwdRecentlyExpiredDuration` ADD CONSTRAINT `PwdRecentlyExpiredDuration_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeValue` ADD CONSTRAINT `AttributeValue_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextValue` ADD CONSTRAINT `ContextValue_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `AttributeValue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ACIItem` ADD CONSTRAINT `ACIItem_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clearance` ADD CONSTRAINT `Clearance_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_non_supplying_master_id_fkey` FOREIGN KEY (`non_supplying_master_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_is_consumer_of_id_fkey` FOREIGN KEY (`is_consumer_of_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD CONSTRAINT `AccessPoint_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkServiceAccessPoint` ADD CONSTRAINT `NetworkServiceAccessPoint_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NonSpecificKnowledge` ADD CONSTRAINT `NonSpecificKnowledge_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubtreeSpecification` ADD CONSTRAINT `SubtreeSpecification_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DITStructureRule` ADD CONSTRAINT `DITStructureRule_nameForm_id_fkey` FOREIGN KEY (`nameForm_id`) REFERENCES `NameForm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DITStructureRule` ADD CONSTRAINT `DITStructureRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentRule` ADD CONSTRAINT `ContentRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextUseRule` ADD CONSTRAINT `ContextUseRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friendship` ADD CONSTRAINT `Friendship_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchingRuleUse` ADD CONSTRAINT `MatchingRuleUse_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SearchRule` ADD CONSTRAINT `SearchRule_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_previous_id_fkey` FOREIGN KEY (`previous_id`) REFERENCES `OperationalBinding`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_access_point_id_fkey` FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD CONSTRAINT `OperationalBinding_master_access_point_id_fkey` FOREIGN KEY (`master_access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RDN` ADD CONSTRAINT `RDN_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryObjectClass` ADD CONSTRAINT `EntryObjectClass_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_alias_entry_id_fkey` FOREIGN KEY (`alias_entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_aliased_entry_id_fkey` FOREIGN KEY (`aliased_entry_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAdministrativeRole` ADD CONSTRAINT `EntryAdministrativeRole_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryCollectiveExclusion` ADD CONSTRAINT `EntryCollectiveExclusion_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryAccessControlScheme` ADD CONSTRAINT `EntryAccessControlScheme_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
