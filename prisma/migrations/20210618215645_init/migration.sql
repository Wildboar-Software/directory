-- CreateEnum
CREATE TYPE "Knowledge" AS ENUM ('MY_ACCESS_POINT', 'SUPERIOR', 'SPECIFIC', 'NON_SPECIFIC', 'SUPPLIER', 'CONSUMER', 'SECONDARY_SHADOW', 'OTHER');

-- CreateEnum
CREATE TYPE "ObjectClassKind" AS ENUM ('ABSTRACT', 'STRUCTURAL', 'AUXILIARY');

-- CreateEnum
CREATE TYPE "AttributeUsage" AS ENUM ('USER_APPLICATIONS', 'DSA_OPERATION', 'DISTRIBUTED_OPERATION', 'DIRECTORY_OPERATION');

-- CreateTable
CREATE TABLE "DIT" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "dit_id" INTEGER NOT NULL,
    "rdn" JSONB NOT NULL,
    "immediate_superior_id" INTEGER,
    "objectClass" TEXT[],
    "aliased_entry_dn" JSONB NOT NULL,
    "root" BOOLEAN NOT NULL DEFAULT false,
    "glue" BOOLEAN NOT NULL DEFAULT false,
    "cp" BOOLEAN NOT NULL DEFAULT false,
    "entry" BOOLEAN NOT NULL DEFAULT false,
    "alias" BOOLEAN NOT NULL DEFAULT false,
    "subr" BOOLEAN NOT NULL DEFAULT false,
    "nssr" BOOLEAN NOT NULL DEFAULT false,
    "supr" BOOLEAN NOT NULL DEFAULT false,
    "xr" BOOLEAN NOT NULL DEFAULT false,
    "admPoint" BOOLEAN NOT NULL DEFAULT false,
    "subentry" BOOLEAN NOT NULL DEFAULT false,
    "shadow" BOOLEAN NOT NULL DEFAULT false,
    "immSupr" BOOLEAN NOT NULL DEFAULT false,
    "rhob" BOOLEAN NOT NULL DEFAULT false,
    "sa" BOOLEAN NOT NULL DEFAULT false,
    "dsSubentry" BOOLEAN NOT NULL DEFAULT false,
    "familyMember" BOOLEAN NOT NULL DEFAULT false,
    "ditBridge" BOOLEAN NOT NULL DEFAULT false,
    "writeableCopy" BOOLEAN NOT NULL DEFAULT false,
    "createdTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyTimestamp" TIMESTAMP(3) NOT NULL,
    "deleteTimestamp" TIMESTAMP(3),
    "creatorsName" JSONB NOT NULL,
    "modifiersName" JSONB NOT NULL,
    "is_family_parent" BOOLEAN NOT NULL,
    "is_family_child" BOOLEAN NOT NULL,
    "hierarchyLevel" INTEGER,
    "hierarchyBelow" BOOLEAN,
    "hierarchyParent" INTEGER,
    "hierarchyTop" INTEGER,
    "password_id" INTEGER,
    "structuralObjectClass" TEXT NOT NULL,
    "accessControlScheme" TEXT,
    "intEmail" TEXT,
    "jid" TEXT,
    "objectIdentifier" TEXT,
    "countryName" CHAR(2),
    "countryCode3c" CHAR(3),
    "countryCode3n" SMALLINT,
    "utmCoordinates_id" INTEGER,
    "organizationIdentifier" TEXT,
    "communicationsNetwork" TEXT,
    "oidC1" SMALLINT,
    "oidC2" SMALLINT,
    "oidC" INTEGER,
    "urnC" TEXT,
    "tagOid" TEXT,
    "uiiInUrn" TEXT,
    "epcInUrn" TEXT,
    "contentType" TEXT,
    "messageDigest" BYTEA,
    "attribute_integrity_info" BYTEA,
    "administrativeRole" TEXT[],
    "governingStructureRule" INTEGER,
    "entryUUID" UUID NOT NULL,
    "dc" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UtmCoordinate" (
    "id" SERIAL NOT NULL,
    "zone" TEXT NOT NULL,
    "easting" INTEGER NOT NULL,
    "northing" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "id" SERIAL NOT NULL,
    "encrypted" BYTEA NOT NULL,
    "algorithm_id" INTEGER NOT NULL,
    "pwdStartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pwdExpiryTime" TIMESTAMP(3),
    "pwdEndTime" TIMESTAMP(3),
    "pwdFails" INTEGER NOT NULL DEFAULT 0,
    "pwdFailureTime" TIMESTAMP(3),
    "pwdGracesUsed" INTEGER NOT NULL DEFAULT 0,
    "pwdModifyEntryAllowed" BOOLEAN,
    "pwdChangeAllowed" BOOLEAN,
    "pwdMaxAge" INTEGER,
    "pwdExpiryAge" INTEGER,
    "pwdMinLength" INTEGER,
    "noDictionaryWords" BOOLEAN,
    "noPersonNames" BOOLEAN,
    "noGeographicalNames" BOOLEAN,
    "pwdDictionaries" TEXT,
    "pwdExpiryWarning" INTEGER,
    "pwdGraces" INTEGER,
    "pwdFailureDuration" INTEGER,
    "pwdLockoutDuration" INTEGER,
    "pwdMaxFailures" INTEGER,
    "pwdMaxTimeInHistory" INTEGER,
    "pwdMinTimeInHistory" INTEGER,
    "pwdHistorySlots" INTEGER,
    "pwdRecentlyExpiredDuration" INTEGER,
    "pwdEncAlg_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Algorithm" (
    "id" SERIAL NOT NULL,
    "oid" TEXT NOT NULL,
    "parameters" BYTEA NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "tag_class" SMALLINT NOT NULL,
    "constructed" BOOLEAN NOT NULL,
    "tag_number" INTEGER NOT NULL,
    "ber" BYTEA NOT NULL,
    "hint" BIGINT,
    "jer" JSONB,
    "security_label" BYTEA,
    "security_policy_identifier" TEXT,
    "security_classification" SMALLINT NOT NULL,
    "privacy_mark" TEXT,
    "deleteTimestamp" TIMESTAMP(3),
    "visible_to_ldap" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextValue" (
    "id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "value_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "tag_class" SMALLINT NOT NULL,
    "constructed" BOOLEAN NOT NULL,
    "tag_number" INTEGER NOT NULL,
    "ber" BYTEA NOT NULL,
    "hint" BIGINT,
    "jer" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ACIItem" (
    "id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "precedence" INTEGER NOT NULL,
    "auth_level_basic_level" INTEGER NOT NULL,
    "auth_level_basic_local_qualifier" INTEGER,
    "auth_level_basic_signed" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clearance" (
    "id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "policy_id" TEXT NOT NULL,
    "unmarked" BOOLEAN NOT NULL,
    "unclassified" BOOLEAN NOT NULL,
    "restricted" BOOLEAN NOT NULL,
    "confidential" BOOLEAN NOT NULL,
    "secret" BOOLEAN NOT NULL,
    "topSecret" BOOLEAN NOT NULL,
    "security_categories_covered" JSONB NOT NULL,
    "ber" BYTEA NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessPoint" (
    "id" SERIAL NOT NULL,
    "knowledge_type" "Knowledge" NOT NULL,
    "ae_title" JSONB NOT NULL,
    "ipv4" INET NOT NULL,
    "tcp_port" SMALLINT NOT NULL,
    "category" INTEGER,
    "chainingRequired" BOOLEAN,
    "supplier_is_master" BOOLEAN,
    "non_supplying_master_id" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalBindingType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalBinding" (
    "id" SERIAL NOT NULL,
    "binding_type_id" INTEGER NOT NULL,
    "identifier" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "agreement_ber" BYTEA NOT NULL,
    "access_point_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NameForm" (
    "id" SERIAL NOT NULL,
    "oid" TEXT NOT NULL,
    "namedObjectClass" TEXT NOT NULL,
    "mandatoryAttributes" TEXT[],
    "optionalAttributes" TEXT[],
    "ldapName" TEXT[],
    "ldapDesc" TEXT,
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DITStructureRule" (
    "id" SERIAL NOT NULL,
    "ruleIdentifier" INTEGER NOT NULL,
    "nameForm_id" INTEGER NOT NULL,
    "superiorStructureRules" TEXT[],
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DITStructureRuleUse" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRule" (
    "id" SERIAL NOT NULL,
    "structural_class" TEXT NOT NULL,
    "auxiliary_classes" TEXT[],
    "mandatory_attributes" TEXT[],
    "optional_attributes" TEXT[],
    "precluded_attributes" TEXT[],
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRuleUse" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextUseRule" (
    "id" SERIAL NOT NULL,
    "attributeType" TEXT NOT NULL,
    "mandatory" TEXT[],
    "optional" TEXT[],
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextUseRuleUse" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "anchor" TEXT NOT NULL,
    "friends" TEXT[],
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendshipUse" (
    "id" SERIAL NOT NULL,
    "friendship_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingRuleDescription" (
    "id" SERIAL NOT NULL,
    "information" TEXT,
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingRuleUse" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeTypeDescription" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT[],
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
    "application" "AttributeUsage" NOT NULL DEFAULT E'USER_APPLICATIONS',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeTypeDescriptionUse" (
    "id" SERIAL NOT NULL,
    "description_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectClassDescription" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "subclassOf" TEXT[],
    "kind" "ObjectClassKind" NOT NULL DEFAULT E'STRUCTURAL',
    "mandatories" TEXT[],
    "optionals" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectClassDescriptionUsage" (
    "id" SERIAL NOT NULL,
    "description_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextDescription" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT[],
    "description" TEXT,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "syntax" TEXT NOT NULL,
    "assertionSyntax" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextDescriptionUse" (
    "id" SERIAL NOT NULL,
    "description_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchRule" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "dmd_id" TEXT NOT NULL,
    "service_type" TEXT,
    "user_class" INTEGER,
    "family_grouping" INTEGER,
    "family_return_member_select" INTEGER,
    "relaxation_minimum" INTEGER NOT NULL DEFAULT 1,
    "relaxation_maximum" INTEGER,
    "additionalControl" TEXT[],
    "base_object_allowed" BOOLEAN NOT NULL DEFAULT true,
    "one_level_allowed" BOOLEAN NOT NULL DEFAULT true,
    "whole_subtree_allowed" BOOLEAN NOT NULL DEFAULT true,
    "imposed_subset" INTEGER,
    "entry_limit_default" INTEGER,
    "entry_limit_max" INTEGER,
    "ber" BYTEA NOT NULL,
    "name" TEXT[],
    "description" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchRuleUse" (
    "id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "version" SMALLINT NOT NULL,
    "serial_number" BYTEA NOT NULL,
    "issuer" JSONB NOT NULL,
    "subject" JSONB NOT NULL,
    "not_before" TIMESTAMP(3) NOT NULL,
    "not_after" TIMESTAMP(3) NOT NULL,
    "signature_alg" TEXT NOT NULL,
    "spki_alg" TEXT NOT NULL,
    "authority_key_identifier" BYTEA NOT NULL,
    "authority_cert_serial_number" BYTEA NOT NULL,
    "subject_key_identifier" BYTEA NOT NULL,
    "ca" BOOLEAN,
    "path_len" INTEGER,
    "key_usage_digitalSignature" BOOLEAN,
    "key_usage_contentCommitment" BOOLEAN,
    "key_usage_keyEncipherment" BOOLEAN,
    "key_usage_dataEncipherment" BOOLEAN,
    "key_usage_keyAgreement" BOOLEAN,
    "key_usage_keyCertSign" BOOLEAN,
    "key_usage_cRLSign" BOOLEAN,
    "key_usage_encipherOnly" BOOLEAN,
    "key_usage_decipherOnly" BOOLEAN,
    "ext_key_usage" TEXT[],
    "private_key_usage_not_before" TIMESTAMP(3),
    "private_key_usage_not_after" TIMESTAMP(3),
    "certificate_policies" TEXT[],
    "crl_distribution_points_count" INTEGER NOT NULL,
    "revoked_time" TIMESTAMP(3),
    "revoked_reason" INTEGER,
    "signature_bytes" BYTEA NOT NULL,
    "subject_public_key_bytes" BYTEA NOT NULL,
    "certificate_der" BYTEA NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry.immediate_superior_id_rdn_unique" ON "Entry"("immediate_superior_id", "rdn");

-- CreateIndex
CREATE INDEX "Entry.aliased_entry_dn_index" ON "Entry"("aliased_entry_dn");

-- CreateIndex
CREATE UNIQUE INDEX "SearchRule.rule_id_unique" ON "SearchRule"("rule_id");

-- AddForeignKey
ALTER TABLE "Entry" ADD FOREIGN KEY ("dit_id") REFERENCES "DIT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD FOREIGN KEY ("immediate_superior_id") REFERENCES "Entry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD FOREIGN KEY ("password_id") REFERENCES "Password"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD FOREIGN KEY ("utmCoordinates_id") REFERENCES "UtmCoordinate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD FOREIGN KEY ("algorithm_id") REFERENCES "Algorithm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextValue" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextValue" ADD FOREIGN KEY ("value_id") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ACIItem" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clearance" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPoint" ADD FOREIGN KEY ("non_supplying_master_id") REFERENCES "AccessPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationalBinding" ADD FOREIGN KEY ("binding_type_id") REFERENCES "OperationalBindingType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationalBinding" ADD FOREIGN KEY ("access_point_id") REFERENCES "AccessPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DITStructureRule" ADD FOREIGN KEY ("nameForm_id") REFERENCES "NameForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DITStructureRuleUse" ADD FOREIGN KEY ("rule_id") REFERENCES "DITStructureRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DITStructureRuleUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRuleUse" ADD FOREIGN KEY ("rule_id") REFERENCES "ContentRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRuleUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextUseRuleUse" ADD FOREIGN KEY ("rule_id") REFERENCES "ContextUseRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextUseRuleUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendshipUse" ADD FOREIGN KEY ("friendship_id") REFERENCES "Friendship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendshipUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingRuleUse" ADD FOREIGN KEY ("rule_id") REFERENCES "MatchingRuleDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingRuleUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeTypeDescriptionUse" ADD FOREIGN KEY ("description_id") REFERENCES "AttributeTypeDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeTypeDescriptionUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectClassDescriptionUsage" ADD FOREIGN KEY ("description_id") REFERENCES "ObjectClassDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectClassDescriptionUsage" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextDescriptionUse" ADD FOREIGN KEY ("description_id") REFERENCES "ContextDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextDescriptionUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchRuleUse" ADD FOREIGN KEY ("rule_id") REFERENCES "SearchRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchRuleUse" ADD FOREIGN KEY ("entry_id") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
