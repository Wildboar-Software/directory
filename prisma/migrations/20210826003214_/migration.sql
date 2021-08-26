-- CreateTable
CREATE TABLE `Entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rdn` JSON NOT NULL,
    `immediate_superior_id` INTEGER,
    `objectClass` VARCHAR(191) NOT NULL,
    `commonName` VARCHAR(191),
    `aliased_entry_dn` JSON,
    `glue` BOOLEAN NOT NULL DEFAULT false,
    `cp` BOOLEAN NOT NULL DEFAULT false,
    `entry` BOOLEAN NOT NULL DEFAULT false,
    `subr` BOOLEAN NOT NULL DEFAULT false,
    `nssr` BOOLEAN NOT NULL DEFAULT false,
    `xr` BOOLEAN NOT NULL DEFAULT false,
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
    `hierarchyLevel` INTEGER,
    `hierarchyBelow` BOOLEAN,
    `hierarchyParent` INTEGER,
    `hierarchyTop` INTEGER,
    `password_id` INTEGER,
    `structuralObjectClass` VARCHAR(191),
    `accessControlScheme` VARCHAR(191),
    `intEmail` VARCHAR(191),
    `jid` VARCHAR(191),
    `objectIdentifier` VARCHAR(191),
    `countryName` CHAR(2),
    `countryCode3c` CHAR(3),
    `countryCode3n` SMALLINT,
    `utmCoordinates_id` INTEGER,
    `organizationIdentifier` VARCHAR(191),
    `communicationsNetwork` VARCHAR(191),
    `oidC1` SMALLINT,
    `oidC2` SMALLINT,
    `oidC` INTEGER,
    `urnC` VARCHAR(191),
    `tagOid` VARCHAR(191),
    `uiiInUrn` VARCHAR(191),
    `epcInUrn` VARCHAR(191),
    `contentType` VARCHAR(191),
    `messageDigest` LONGBLOB,
    `attribute_integrity_info` LONGBLOB,
    `administrativeRole` VARCHAR(191),
    `governingStructureRule` INTEGER,
    `entryUUID` VARCHAR(191) NOT NULL,
    `dc` VARCHAR(191),
    `subordinate_completeness` BOOLEAN,
    `attribute_completeness` BOOLEAN,
    `attribute_values_incomplete` BOOLEAN,
    `keep_children_in_database` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Entry.entryUUID_unique`(`entryUUID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UtmCoordinate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `zone` VARCHAR(191) NOT NULL,
    `easting` INTEGER NOT NULL,
    `northing` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Password` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `encrypted` LONGBLOB NOT NULL,
    `algorithm_oid` VARCHAR(191) NOT NULL,
    `algorithm_parameters_der` LONGBLOB,
    `pwdStartTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pwdExpiryTime` DATETIME(3),
    `pwdEndTime` DATETIME(3),
    `pwdFails` INTEGER NOT NULL DEFAULT 0,
    `pwdFailureTime` DATETIME(3),
    `pwdGracesUsed` INTEGER NOT NULL DEFAULT 0,
    `pwdModifyEntryAllowed` BOOLEAN,
    `pwdChangeAllowed` BOOLEAN,
    `pwdMaxAge` INTEGER,
    `pwdExpiryAge` INTEGER,
    `pwdMinLength` INTEGER,
    `noDictionaryWords` BOOLEAN,
    `noPersonNames` BOOLEAN,
    `noGeographicalNames` BOOLEAN,
    `pwdDictionaries` VARCHAR(191),
    `pwdExpiryWarning` INTEGER,
    `pwdGraces` INTEGER,
    `pwdFailureDuration` INTEGER,
    `pwdLockoutDuration` INTEGER,
    `pwdMaxFailures` INTEGER,
    `pwdMaxTimeInHistory` INTEGER,
    `pwdMinTimeInHistory` INTEGER,
    `pwdHistorySlots` INTEGER,
    `pwdRecentlyExpiredDuration` INTEGER,

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
    `hint` BIGINT,
    `jer` JSON,
    `security_label` LONGBLOB,
    `security_policy_identifier` VARCHAR(191),
    `security_classification` SMALLINT,
    `privacy_mark` VARCHAR(191),
    `deleteTimestamp` DATETIME(3),
    `visible_to_ldap` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entry_id` INTEGER NOT NULL,
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
    `tcp_port` SMALLINT,
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
    `base` JSON NOT NULL,
    `specific_exclusions` JSON NOT NULL,
    `minimum` INTEGER NOT NULL DEFAULT 0,
    `maximum` INTEGER,
    `specification_filter` JSON NOT NULL,
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DITStructureRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruleIdentifier` INTEGER NOT NULL,
    `nameForm_id` INTEGER NOT NULL,
    `superiorStructureRules` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DITStructureRuleUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

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
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentRuleUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextUseRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attributeType` VARCHAR(191) NOT NULL,
    `mandatory` VARCHAR(191) NOT NULL,
    `optional` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextUseRuleUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friendship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anchor` VARCHAR(191) NOT NULL,
    `friends` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FriendshipUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `friendship_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchingRuleDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `information` VARCHAR(191),
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchingRuleUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeTypeDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeTypeDescriptionUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectClassDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `subclassOf` VARCHAR(191) NOT NULL,
    `kind` ENUM('ABSTRACT', 'STRUCTURAL', 'AUXILIARY') NOT NULL DEFAULT 'STRUCTURAL',
    `mandatories` VARCHAR(191) NOT NULL,
    `optionals` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectClassDescriptionUsage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextDescription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191),
    `obsolete` BOOLEAN NOT NULL DEFAULT false,
    `syntax` VARCHAR(191) NOT NULL,
    `assertionSyntax` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContextDescriptionUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

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

    UNIQUE INDEX `SearchRule.rule_id_unique`(`rule_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SearchRuleUse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `entry_id` INTEGER NOT NULL,

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
    `binding_identifier` INTEGER,
    `binding_version` SMALLINT,
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

    UNIQUE INDEX `OperationalBinding.previous_id_unique`(`previous_id`),
    UNIQUE INDEX `OperationalBinding.uuid_unique`(`uuid`),
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

-- AddForeignKey
ALTER TABLE `Entry` ADD FOREIGN KEY (`immediate_superior_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD FOREIGN KEY (`password_id`) REFERENCES `Password`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD FOREIGN KEY (`utmCoordinates_id`) REFERENCES `UtmCoordinate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeValue` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextValue` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextValue` ADD FOREIGN KEY (`value_id`) REFERENCES `AttributeValue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ACIItem` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clearance` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD FOREIGN KEY (`non_supplying_master_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD FOREIGN KEY (`is_consumer_of_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPoint` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkServiceAccessPoint` ADD FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NonSpecificKnowledge` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubtreeSpecification` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DITStructureRule` ADD FOREIGN KEY (`nameForm_id`) REFERENCES `NameForm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DITStructureRuleUse` ADD FOREIGN KEY (`rule_id`) REFERENCES `DITStructureRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DITStructureRuleUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentRuleUse` ADD FOREIGN KEY (`rule_id`) REFERENCES `ContentRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentRuleUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextUseRuleUse` ADD FOREIGN KEY (`rule_id`) REFERENCES `ContextUseRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextUseRuleUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FriendshipUse` ADD FOREIGN KEY (`friendship_id`) REFERENCES `Friendship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FriendshipUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchingRuleUse` ADD FOREIGN KEY (`rule_id`) REFERENCES `MatchingRuleDescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchingRuleUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeTypeDescriptionUse` ADD FOREIGN KEY (`description_id`) REFERENCES `AttributeTypeDescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttributeTypeDescriptionUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectClassDescriptionUsage` ADD FOREIGN KEY (`description_id`) REFERENCES `ObjectClassDescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectClassDescriptionUsage` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextDescriptionUse` ADD FOREIGN KEY (`description_id`) REFERENCES `ContextDescription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextDescriptionUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SearchRuleUse` ADD FOREIGN KEY (`rule_id`) REFERENCES `SearchRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SearchRuleUse` ADD FOREIGN KEY (`entry_id`) REFERENCES `Entry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD FOREIGN KEY (`previous_id`) REFERENCES `OperationalBinding`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD FOREIGN KEY (`access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalBinding` ADD FOREIGN KEY (`master_access_point_id`) REFERENCES `AccessPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
