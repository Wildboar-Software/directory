import type { Context } from "../types/index.js";
import { attributes as x500at } from "@wildboar/x500";
import { matchingRules as x500mr } from "@wildboar/x500";
import attributeFromInformationObject from "./attributeFromInformationObject.js";
import { AttributeUsage } from "../generated/client.js";
import entryUUID from "../schema/attributes/entryUUID.js";
import { userPwdHistory } from "@wildboar/x500/PasswordPolicy";
import { userPwdRecentlyExpired } from "@wildboar/x500/PasswordPolicy";
import asn1SyntaxInfo from "../x500/asn1SyntaxToInfo.js";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/InformationFramework";
import { ObjectIdentifier } from "@wildboar/asn1";
// TODO: Apparently, I forgot to add these to `x500at`... whoops.
import { uid } from "@wildboar/x500/SelectedAttributeTypes";
import { dc } from "@wildboar/x500/SelectedAttributeTypes";

// Drivers
import accessControlSubentryListDriver from "../database/drivers/accessControlSubentryList.js";
import administratorsAddressDriver from "../database/drivers/administratorsAddress.js";
import aliasedEntryNameDriver from "../database/drivers/aliasedEntryName.js";
import altServerDriver from "../database/drivers/altServer.js";
import attributeTypesDriver from "../database/drivers/attributeTypes.js";
import collectiveAttributeSubentryListDriver from "../database/drivers/collectiveAttributeSubentryList.js";
import consumerKnowledgeDriver from "../database/drivers/consumerKnowledge.js";
import contextDefaultSubentryListDriver from "../database/drivers/contextDefaultSubentryList.js";
import contextTypesDriver from "../database/drivers/contextTypes.js";
import createTimestampDriver from "../database/drivers/createTimestamp.js";
import creatorsNameDriver from "../database/drivers/creatorsName.js";
import ditBridgeKnowledgeDriver from "../database/drivers/ditBridgeKnowledge.js";
import dITContentRulesDriver from "../database/drivers/dITContentRules.js";
import dITContextUseDriver from "../database/drivers/dITContextUse.js";
import dITStructureRulesDriver from "../database/drivers/dITStructureRules.js";
import dseTypeDriver from "../database/drivers/dseType.js";
import dynamicSubtreesDriver from "../database/drivers/dynamicSubtrees.js";
import entryDNDriver from "../database/drivers/entryDN.js";
import entryTtlDriver from "../database/drivers/entryTtl.js";
import entryUUIDDriver from "../database/drivers/entryUUID.js";
import family_informationDriver from "../database/drivers/family_information.js";
import fullVendorVersionDriver from "../database/drivers/fullVendorVersion.js";
import friendsDriver from "../database/drivers/friends.js";
import governingStructureRuleDriver from "../database/drivers/governingStructureRule.js";
import hasSubordinatesDriver from "../database/drivers/hasSubordinates.js";
import hierarchyBelowDriver from "../database/drivers/hierarchyBelow.js";
import hierarchyLevelDriver from "../database/drivers/hierarchyLevel.js";
import hierarchyParentDriver from "../database/drivers/hierarchyParent.js";
import hierarchyTopDriver from "../database/drivers/hierarchyTop.js";
import ldapSyntaxesDriver from "../database/drivers/ldapSyntaxes.js";
import matchingRulesDriver from "../database/drivers/matchingRules.js";
import matchingRuleUseDriver from "../database/drivers/matchingRuleUse.js";
import modifiersNameDriver from "../database/drivers/modifiersName.js";
import modifyTimestampDriver from "../database/drivers/modifyTimestamp.js";
import myAccessPointDriver from "../database/drivers/myAccessPoint.js";
import nameFormsDriver from "../database/drivers/nameForms.js";
import namingContextsDriver from "../database/drivers/namingContexts.js";
import nonSpecificKnowledgeDriver from "../database/drivers/nonSpecificKnowledge.js";
import numSubordinatesDriver from "../database/drivers/numSubordinates.js";
import objectClassDriver from "../database/drivers/objectClass.js";
import objectClassesDriver from "../database/drivers/objectClasses.js";
import pwdAdminSubentryListDriver from "../database/drivers/pwdAdminSubentryList.js";
import pwdFailureDurationDriver from "../database/drivers/pwdFailureDuration.js";
import secondaryShadowsDriver from "../database/drivers/secondaryShadows.js";
import serviceAdminSubentryListDriver from "../database/drivers/serviceAdminSubentryList.js";
import specificKnowledgeDriver from "../database/drivers/specificKnowledge.js";
import structuralObjectClassDriver from "../database/drivers/structuralObjectClass.js";
import subschemaSubentryListDriver from "../database/drivers/subschemaSubentryList.js";
import superiorKnowledgeDriver from "../database/drivers/superiorKnowledge.js";
import superiorUUIDDriver from "../database/drivers/superiorUUID.js";
import supplierKnowledgeDriver from "../database/drivers/supplierKnowledge.js";
import supportedControlDriver from "../database/drivers/supportedControl.js";
import supportedExtensionDriver from "../database/drivers/supportedExtension.js";
import supportedFeaturesDriver from "../database/drivers/supportedFeatures.js";
import supportedLDAPVersionDriver from "../database/drivers/supportedLDAPVersion.js";
import supportedSASLMechanismsDriver from "../database/drivers/supportedSASLMechanisms.js";
import syncTimestampDriver from "../database/drivers/syncTimestamp.js";
import userPasswordDriver from "../database/drivers/userPassword.js";
import userPwdDriver from "../database/drivers/userPwd.js";
import userPwdHistoryDriver from "../database/drivers/userPwdHistory.js";
import vendorNameDriver from "../database/drivers/vendorName.js";
import vendorVersionDriver from "../database/drivers/vendorVersion.js";

// X.400 Attribute Types
import {
    mhs_acceptable_eits,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_deliverable_classes,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_deliverable_content_types,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_dl_archive_service,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_dl_members,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_dl_policy,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_dl_related_lists,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_dl_submit_permissions,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_dl_subscription_service,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_exclusively_acceptable_eits,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_maximum_content_length,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_message_store_dn,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_or_addresses,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_or_addresses_with_capabilities,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_supported_attributes,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_supported_automatic_actions,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_supported_content_types,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_supported_matching_rules,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mhs_unacceptable_eits,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    routingCollectiveName,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    connectionGroupName,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    entryConnectionGroupName,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    transitExitConnectionGroupName,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    localExitConnectionGroupName,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    oRAddressSubtrees,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    mHSMessageTransferAgentName,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    enumeratedFlag,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    connectionType,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    groupMTAPassword,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    memberMTA,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    securityContext,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    mTAName,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    globalDomainIdentifier,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    mTAPassword,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    specificPasswords,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    callingPSAPs,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    routingAdvice,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    expressionMatches,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    nextLevelComplete,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    recipientMDAssignedAlternateRecipient,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    oRAddressElementName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSCountryName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSADMDName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPRMDName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSOrganizationName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSOrganizationalUnitName,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSCommonNameAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSSurnameAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSGivenNameAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSInitialsAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSGenerationQualifierAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSNetworkAddressAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSExtendedNetworkAddressAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSTerminalIdentifierAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSTerminalTypeAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSNumericUserIdentifierAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPDSNameAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPostalCodeAttribute,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    edi_name,
} from "@wildboar/x400/EDIMUseOfDirectory";
import {
    edi_routing_address,
} from "@wildboar/x400/EDIMUseOfDirectory";
import {
    edi_capabilities,
} from "@wildboar/x400/EDIMUseOfDirectory";

// X.700 Attribute Types
import {
    actions,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    additionalInformation,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    andAttributeIds,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    asn1ModuleContents,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    asn1Version,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    attributeGroups,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    attributes,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    behaviour,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    characterizedBy,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    conditionalPackages,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    context,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    create,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    definedAs,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    delete_,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    derivedFrom,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    derivedOrWithSyntaxChoice,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    description as x700description,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    documentName,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    documentObjectIdentifier,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    fixed,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    groupElements,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    informationStatus,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    matchesFor,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    modeConfirmed,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    moduleReference,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    namedBySuperiorObjectClass,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    nameForm,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    notifications,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    optionallyRegisteredAs,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    parameters,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    registeredAs,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    specification,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    subordinateObjectClass,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    syntaxOrAttribute,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    templateDefinition,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    templateName,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    withAttribute,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    withInformationSyntax,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    withReplySyntax,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";
import {
    mappedRelationshipClass,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    operationsMapping,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    qualifiedBy,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    relationshipObject,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    roleMappingSpecificationSet,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    roleSpecifier,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    supports,
} from "@wildboar/x700/GrmDefinitionDirectoryASN1Module";
import {
    supportedCmipProfiles,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";
import {
    supportedCmipVersion,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";
import {
    supportedCmisFunctionalUnits,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";
import {
    supportedSmaseFunctionalUnits,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";
import {
    supportsMKMglobalNames,
} from "@wildboar/x700/RepertoireDirectoryASN1Module";

// Platform Certificate Attribute Types
import {
    tCGPlatformSpecification,
    tCGCredentialType,
    platformManufacturerStr,
    platformModel,
    platformVersion,
    platformSerial,
    platformManufacturerId,
    tBBSecurityAssertions,
    platformConfiguration,
    platformConfigUri,
} from "@wildboar/platcert";

// PKCS #9 Attribute Types
import {
    pKCS7PDU,
} from "@wildboar/pkcs/PKCS-9";
import {
    userPKCS12,
} from "@wildboar/pkcs/PKCS-9";
import {
    pKCS15Token,
} from "@wildboar/pkcs/PKCS-9";
import {
    encryptedPrivateKeyInfo,
} from "@wildboar/pkcs/PKCS-9";
import {
    emailAddress,
} from "@wildboar/pkcs/PKCS-9";
import {
    unstructuredName,
} from "@wildboar/pkcs/PKCS-9";
import {
    unstructuredAddress,
} from "@wildboar/pkcs/PKCS-9";
// import {
//     dateOfBirth,
// } from "@wildboar/pkcs/PKCS-9";
// import {
//     placeOfBirth,
// } from "@wildboar/pkcs/PKCS-9";
// import {
//     gender,
// } from "@wildboar/pkcs/PKCS-9";
// import {
//     countryOfCitizenship,
// } from "@wildboar/pkcs/PKCS-9";
// import {
//     countryOfResidence,
// } from "@wildboar/pkcs/PKCS-9";
// import { // This has the same ID as pseudonym from X.520, but different matching rules!
//     pseudonym,
// } from "@wildboar/pkcs/PKCS-9";
// import {
//     contentType,
// } from "@wildboar/pkcs/PKCS-9";
// import {
//     messageDigest,
// } from "@wildboar/pkcs/PKCS-9";
// import {
//     signingTime,
// } from "@wildboar/pkcs/PKCS-9";
import {
    randomNonce,
} from "@wildboar/pkcs/PKCS-9";
import {
    counterSignature,
} from "@wildboar/pkcs/PKCS-9";
import {
    challengePassword,
} from "@wildboar/pkcs/PKCS-9";
import {
    extensionRequest,
} from "@wildboar/pkcs/PKCS-9";
import {
    extendedCertificateAttributes,
} from "@wildboar/pkcs/PKCS-9";
import {
    friendlyName,
} from "@wildboar/pkcs/PKCS-9";
import {
    localKeyId,
} from "@wildboar/pkcs/PKCS-9";
import {
    signingDescription,
} from "@wildboar/pkcs/PKCS-9";
// import {
//     smimeCapabilities,
// } from "@wildboar/pkcs/PKCS-9";

// IANA / LDAP Parity Schema
// import {
//     ads_allowAnonymousAccess,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-allowAnonymousAccess.oa.js"
// import {
//     ads_authenticatorClass,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticatorClass.oa.js"
// import {
//     ads_authenticatorId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticatorId.oa.js"
// import {
//     ads_baseDn,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-baseDn.oa.js"
// import {
//     ads_certificatePassword,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-certificatePassword.oa.js"
// import {
//     ads_changeLogExposed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changeLogExposed.oa.js"
// import {
//     ads_changeLogId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changeLogId.oa.js"
// import {
//     ads_chgPwdPolicyCategoryCount,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdPolicyCategoryCount.oa.js"
// import {
//     ads_chgPwdPolicyPasswordLength,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdPolicyPasswordLength.oa.js"
// import {
//     ads_chgPwdPolicyTokenSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdPolicyTokenSize.oa.js"
// import {
//     ads_chgPwdServicePrincipal,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdServicePrincipal.oa.js"
// import {
//     ads_confidentialityRequired,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-confidentialityRequired.oa.js"
// import {
//     ads_contextEntry,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-contextEntry.oa.js"
// import {
//     ads_delegateHost,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateHost.oa.js"
// import {
//     ads_delegatePort,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegatePort.oa.js"
// import {
//     ads_delegateSsl,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateSsl.oa.js"
// import {
//     ads_delegateSslTrustManager,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateSslTrustManager.oa.js"
// import {
//     ads_delegateTls,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateTls.oa.js"
// import {
//     ads_delegateTlsTrustManager,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateTlsTrustManager.oa.js"
// import {
//     ads_directoryServiceId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-directoryServiceId.oa.js"
// import {
//     ads_dsAccessControlEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsAccessControlEnabled.oa.js"
// import {
//     ads_dsAllowAnonymousAccess,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsAllowAnonymousAccess.oa.js"
// import {
//     ads_dsDenormalizeOpAttrsEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsDenormalizeOpAttrsEnabled.oa.js"
// import {
//     ads_dsPasswordHidden,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsPasswordHidden.oa.js"
// import {
//     ads_dsReplicaId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsReplicaId.oa.js"
// import {
//     ads_dsSyncPeriodMillis,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsSyncPeriodMillis.oa.js"
// import {
//     ads_dsTestEntries,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsTestEntries.oa.js"
// import {
//     ads_enabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-enabled.oa.js"
// import {
//     ads_enabledCiphers,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-enabledCiphers.oa.js"
// import {
//     ads_enabledProtocols,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-enabledProtocols.oa.js"
// import {
//     ads_extendedOpHandlerClass,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-extendedOpHandlerClass.oa.js"
// import {
//     ads_extendedOpId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-extendedOpId.oa.js"
// import {
//     ads_hashAlgorithm,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-hashAlgorithm.oa.js"
// import {
//     ads_hashAttribute,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-hashAttribute.oa.js"
// import {
//     ads_httpAppCtxPath,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpAppCtxPath.oa.js"
// import {
//     ads_httpConfFile,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpConfFile.oa.js"
// import {
//     ads_httpWarFile,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpWarFile.oa.js"
// import {
//     ads_Id,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-Id.oa.js"
// import {
//     ads_indexAttributeId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexAttributeId.oa.js"
// import {
//     ads_indexCacheSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexCacheSize.oa.js"
// import {
//     ads_indexFileName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexFileName.oa.js"
// import {
//     ads_indexHasReverse,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexHasReverse.oa.js"
// import {
//     ads_indexNumDupLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexNumDupLimit.oa.js"
// import {
//     ads_indexWorkingDir,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexWorkingDir.oa.js"
// import {
//     ads_interceptorClassName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptorClassName.oa.js"
// import {
//     ads_interceptorId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptorId.oa.js"
// import {
//     ads_interceptorOrder,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptorOrder.oa.js"
// import {
//     ads_jdbmPartitionOptimizerEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-jdbmPartitionOptimizerEnabled.oa.js"
// import {
//     ads_journalFileName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalFileName.oa.js"
// import {
//     ads_journalId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalId.oa.js"
// import {
//     ads_journalRotation,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalRotation.oa.js"
// import {
//     ads_journalWorkingDir,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalWorkingDir.oa.js"
// import {
//     ads_keystoreFile,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-keystoreFile.oa.js"
// import {
//     ads_krbAllowableClockSkew,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbAllowableClockSkew.oa.js"
// import {
//     ads_krbBodyChecksumVerified,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbBodyChecksumVerified.oa.js"
// import {
//     ads_krbEmptyAddressesAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbEmptyAddressesAllowed.oa.js"
// import {
//     ads_krbEncryptionTypes,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbEncryptionTypes.oa.js"
// import {
//     ads_krbForwardableAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbForwardableAllowed.oa.js"
// import {
//     ads_krbKdcPrincipal,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbKdcPrincipal.oa.js"
// import {
//     ads_krbMaximumRenewableLifetime,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbMaximumRenewableLifetime.oa.js"
// import {
//     ads_krbMaximumTicketLifetime,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbMaximumTicketLifetime.oa.js"
// import {
//     ads_krbPaEncTimestampRequired,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbPaEncTimestampRequired.oa.js"
// import {
//     ads_krbPostdatedAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbPostdatedAllowed.oa.js"
// import {
//     ads_krbPrimaryRealm,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbPrimaryRealm.oa.js"
// import {
//     ads_krbProxiableAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbProxiableAllowed.oa.js"
// import {
//     ads_krbRenewableAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbRenewableAllowed.oa.js"
// import {
//     ads_maxPDUSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-maxPDUSize.oa.js"
// import {
//     ads_maxSizeLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-maxSizeLimit.oa.js"
// import {
//     ads_maxTimeLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-maxTimeLimit.oa.js"
// import {
//     ads_needClientAuth,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-needClientAuth.oa.js"
// import {
//     ads_ntlmMechProvider,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-ntlmMechProvider.oa.js"
// import {
//     ads_partitionCacheSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionCacheSize.oa.js"
// import {
//     ads_partitionId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionId.oa.js"
// import {
//     ads_partitionSuffix,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionSuffix.oa.js"
// import {
//     ads_partitionSyncOnWrite,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionSyncOnWrite.oa.js"
// import {
//     ads_pwdAllowUserChange,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdAllowUserChange.oa.js"
// import {
//     ads_pwdAttribute,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdAttribute.oa.js"
// import {
//     ads_pwdCheckQuality,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdCheckQuality.oa.js"
// import {
//     ads_pwdExpireWarning,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdExpireWarning.oa.js"
// import {
//     ads_pwdFailureCountInterval,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdFailureCountInterval.oa.js"
// import {
//     ads_pwdGraceAuthNLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdGraceAuthNLimit.oa.js"
// import {
//     ads_pwdGraceExpire,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdGraceExpire.oa.js"
// import {
//     ads_pwdId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdId.oa.js"
// import {
//     ads_pwdInHistory,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdInHistory.oa.js"
// import {
//     ads_pwdLockout,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdLockout.oa.js"
// import {
//     ads_pwdLockoutDuration,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdLockoutDuration.oa.js"
// import {
//     ads_pwdMaxAge,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxAge.oa.js"
// import {
//     ads_pwdMaxDelay,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxDelay.oa.js"
// import {
//     ads_pwdMaxFailure,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxFailure.oa.js"
// import {
//     ads_pwdMaxIdle,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxIdle.oa.js"
// import {
//     ads_pwdMaxLength,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxLength.oa.js"
// import {
//     ads_pwdMinAge,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMinAge.oa.js"
// import {
//     ads_pwdMinDelay,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMinDelay.oa.js"
// import {
//     ads_pwdMinLength,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMinLength.oa.js"
// import {
//     ads_pwdMustChange,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMustChange.oa.js"
// import {
//     ads_pwdSafeModify,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdSafeModify.oa.js"
// import {
//     ads_pwdValidator,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdValidator.oa.js"
// import {
//     ads_replAttributes,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replAttributes.oa.js"
// import {
//     ads_replConsumerId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replConsumerId.oa.js"
// import {
//     ads_replConsumerImpl,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replConsumerImpl.oa.js"
// import {
//     ads_replCookie,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replCookie.oa.js"
// import {
//     ads_replEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replEnabled.oa.js"
// import {
//     ads_replLogMaxIdle,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replLogMaxIdle.oa.js"
// import {
//     ads_replLogPurgeThresholdCount,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replLogPurgeThresholdCount.oa.js"
// import {
//     ads_replPingerSleep,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replPingerSleep.oa.js"
// import {
//     ads_replProvHostName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replProvHostName.oa.js"
// import {
//     ads_replProvPort,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replProvPort.oa.js"
// import {
//     ads_replRefreshInterval,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replRefreshInterval.oa.js"
// import {
//     ads_replRefreshNPersist,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replRefreshNPersist.oa.js"
// import {
//     ads_replReqHandler,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replReqHandler.oa.js"
// import {
//     ads_replSearchFilter,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replSearchFilter.oa.js"
// import {
//     ads_replSearchSizeLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replSearchSizeLimit.oa.js"
// import {
//     ads_replSearchTimeOut,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replSearchTimeOut.oa.js"
// import {
//     ads_replStrictCertValidation,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replStrictCertValidation.oa.js"
// import {
//     ads_replUserDn,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replUserDn.oa.js"
// import {
//     ads_replUserPassword,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replUserPassword.oa.js"
// import {
//     ads_replUseTls,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replUseTls.oa.js"
// import {
//     ads_saslHost,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslHost.oa.js"
// import {
//     ads_saslMechClassName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslMechClassName.oa.js"
// import {
//     ads_saslMechName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslMechName.oa.js"
// import {
//     ads_saslPrincipal,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslPrincipal.oa.js"
// import {
//     ads_saslRealms,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslRealms.oa.js"
// import {
//     ads_searchBaseDN,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-searchBaseDN.oa.js"
// import {
//     ads_serverId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-serverId.oa.js"
// import {
//     ads_systemPort,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-systemPort.oa.js"
// import {
//     ads_transportAddress,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportAddress.oa.js"
// import {
//     ads_transportBacklog,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportBacklog.oa.js"
// import {
//     ads_transportEnableSSL,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportEnableSSL.oa.js"
// import {
//     ads_transportId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportId.oa.js"
// import {
//     ads_transportNbThreads,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportNbThreads.oa.js"
// import {
//     ads_wantClientAuth,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-wantClientAuth.oa.js"
import {
    apacheDnsCharacterString,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsCharacterString.oa.js"
import {
    apacheDnsClass,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsClass.oa.js"
import {
    apacheDnsDomainName,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsDomainName.oa.js"
import {
    apacheDnsIpAddress,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsIpAddress.oa.js"
import {
    apacheDnsMxPreference,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsMxPreference.oa.js"
import {
    apacheDnsServicePort,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServicePort.oa.js"
import {
    apacheDnsServicePriority,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServicePriority.oa.js"
import {
    apacheDnsServiceWeight,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServiceWeight.oa.js"
import {
    apacheDnsSoaExpire,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaExpire.oa.js"
import {
    apacheDnsSoaMinimum,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaMinimum.oa.js"
import {
    apacheDnsSoaMName,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaMName.oa.js"
import {
    apacheDnsSoaRefresh,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaRefresh.oa.js"
import {
    apacheDnsSoaRetry,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaRetry.oa.js"
import {
    apacheDnsSoaRName,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaRName.oa.js"
import {
    apacheDnsSoaSerial,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaSerial.oa.js"
import {
    apacheDnsTtl,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsTtl.oa.js"
// import {
//     authPassword,
// } from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPassword.oa.js";
// import {
//     supportedAuthPasswordSchemes,
// } from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/supportedAuthPasswordSchemes.oa.js";
import {
    automountInformation,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automountInformation.oa.js"
import {
    corbaIor,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaIor.oa.js";
import {
    corbaRepositoryId,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaRepositoryId.oa.js";
import {
    aRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/aRecord.oa.js";
import {
    associatedDomain,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/associatedDomain.oa.js";
import {
    associatedName,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/associatedName.oa.js";
import {
    audio,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/audio.oa.js";
import {
    buildingName,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/buildingName.oa.js";
import {
    cNAMERecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/cNAMERecord.oa.js";
import {
    dITRedirect,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/dITRedirect.oa.js";
import {
    documentAuthor,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentAuthor.oa.js";
import {
    documentIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentIdentifier.oa.js";
import {
    documentLocation,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentLocation.oa.js";
import {
    documentPublisher,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentPublisher.oa.js";
import {
    documentTitle,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentTitle.oa.js";
import {
    documentVersion,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentVersion.oa.js";
import {
    favouriteDrink,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/favouriteDrink.oa.js";
import {
    friendlyCountryName,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/friendlyCountryName.oa.js";
import {
    homePostalAddress,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/homePostalAddress.oa.js";
import {
    homeTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/homeTelephoneNumber.oa.js";
import {
    host,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/host.oa.js";
import {
    info,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/info.oa.js";
import {
    janetMailbox,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/janetMailbox.oa.js";
import {
    mail,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mail.oa.js";
import {
    mailPreferenceOption,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mailPreferenceOption.oa.js";
import {
    manager,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/manager.oa.js";
import {
    mDRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mDRecord.oa.js";
import {
    mobileTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mobileTelephoneNumber.oa.js";
import {
    mxRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mxRecord.oa.js";
import {
    nSRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/nSRecord.oa.js";
import {
    organizationalStatus,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/organizationalStatus.oa.js";
import {
    pagerTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pagerTelephoneNumber.oa.js";
import {
    personalTitle,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/personalTitle.oa.js";
import {
    roomNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/roomNumber.oa.js";
import {
    secretary,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/secretary.oa.js";
import {
    sOARecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/sOARecord.oa.js";
import {
    textEncodedORAddress,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/textEncodedORAddress.oa.js";
import {
    uniqueIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/uniqueIdentifier.oa.js";
import {
    userClass,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/userClass.oa.js";
import {
    dhcpAddressState,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpAddressState.oa.js"
import {
    dhcpAssignedHostName,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpAssignedHostName.oa.js"
import {
    dhcpAssignedToClient,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpAssignedToClient.oa.js"
import {
    dhcpBootpFlag,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpBootpFlag.oa.js"
import {
    dhcpClassData,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpClassData.oa.js"
import {
    dhcpClassesDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpClassesDN.oa.js"
import {
    dhcpDelayedServiceParameter,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpDelayedServiceParameter.oa.js"
import {
    dhcpDnsStatus,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpDnsStatus.oa.js"
import {
    dhcpDomainName,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpDomainName.oa.js"
import {
    dhcpErrorLog,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpErrorLog.oa.js"
import {
    dhcpExpirationTime,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpExpirationTime.oa.js"
import {
    dhcpFailOverEndpointState,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpFailOverEndpointState.oa.js"
import {
    dhcpGroupDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpGroupDN.oa.js"
import {
    dhcpHashBucketAssignment,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHashBucketAssignment.oa.js"
import {
    dhcpHostDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHostDN.oa.js"
import {
    dhcpHWAddress,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHWAddress.oa.js"
import {
    dhcpImplementation,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpImplementation.oa.js"
import {
    dhcpLastTransactionTime,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLastTransactionTime.oa.js"
import {
    dhcpLeaseDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLeaseDN.oa.js"
import {
    dhcpLeasesDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLeasesDN.oa.js"
import {
    dhcpMaxClientLeadTime,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpMaxClientLeadTime.oa.js"
import {
    dhcpNetMask,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpNetMask.oa.js"
import {
    dhcpOption,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpOption.oa.js"
import {
    dhcpOptionsDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpOptionsDN.oa.js"
import {
    dhcpPermitList,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPermitList.oa.js"
import {
    dhcpPoolDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPoolDN.oa.js"
import {
    dhcpPrimaryDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPrimaryDN.oa.js"
import {
    dhcpRange,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpRange.oa.js"
import {
    dhcpRelayAgentInfo,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpRelayAgentInfo.oa.js"
import {
    dhcpRequestedHostName,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpRequestedHostName.oa.js"
import {
    dhcpReservedForClient,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpReservedForClient.oa.js"
import {
    dhcpSecondaryDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSecondaryDN.oa.js"
import {
    dhcpServiceDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpServiceDN.oa.js"
import {
    dhcpSharedNetworkDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSharedNetworkDN.oa.js"
import {
    dhcpStartTimeOfState,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpStartTimeOfState.oa.js"
import {
    dhcpStatements,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpStatements.oa.js"
import {
    dhcpSubclassesDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubclassesDN.oa.js"
import {
    dhcpSubnetDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubnetDN.oa.js"
import {
    dhcpVersion,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpVersion.oa.js"
import {
    numSubordinates,
} from "@wildboar/parity-schema/src/lib/modules/DS389CoreSchema/numSubordinates.oa.js";
import {
    changeNumber,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeNumber.oa.js";
import {
    changes,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changes.oa.js";
import {
    changeTime,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeTime.oa.js";
import {
    changeType,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeType.oa.js";
import {
    deleteOldRdn,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/deleteOldRdn.oa.js";
import {
    newRdn,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/newRdn.oa.js";
import {
    newSuperior,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/newSuperior.oa.js";
import {
    nsUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/nsUniqueId.oa.js";
import {
    targetDn,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/targetDn.oa.js";
import {
    targetUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/targetUniqueId.oa.js";
import {
    attributeMap,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/attributeMap.oa.js";
import {
    authenticationMethod,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/authenticationMethod.oa.js";
import {
    bindTimeLimit,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/bindTimeLimit.oa.js";
import {
    credentialLevel,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/credentialLevel.oa.js";
import {
    defaultSearchBase,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/defaultSearchBase.oa.js";
import {
    defaultSearchScope,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/defaultSearchScope.oa.js";
import {
    defaultServerList,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/defaultServerList.oa.js";
import {
    dereferenceAliases,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/dereferenceAliases.oa.js";
import {
    followReferrals,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/followReferrals.oa.js";
import {
    objectclassMap,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/objectclassMap.oa.js";
import {
    preferredServerList,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/preferredServerList.oa.js";
import {
    profileTTL,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/profileTTL.oa.js";
import {
    searchTimeLimit,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/searchTimeLimit.oa.js";
import {
    serviceAuthenticationMethod,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/serviceAuthenticationMethod.oa.js";
import {
    serviceCredentialLevel,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/serviceCredentialLevel.oa.js";
import {
    serviceSearchDescriptor,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/serviceSearchDescriptor.oa.js";
import {
    dgIdentity,
} from "@wildboar/parity-schema/src/lib/modules/DynGroup/dgIdentity.oa.js";
import {
    memberURL,
} from "@wildboar/parity-schema/src/lib/modules/DynGroup/memberURL.oa.js";
import {
    eduPersonAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonAffiliation.oa.js";
import {
    eduPersonAssurance,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonAssurance.oa.js";
import {
    eduPersonEntitlement,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonEntitlement.oa.js";
import {
    eduPersonNickName,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonNickName.oa.js";
import {
    eduPersonOrcid,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonOrcid.oa.js";
import {
    eduPersonOrgDN,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonOrgDN.oa.js";
import {
    eduPersonOrgUnitDN,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonOrgUnitDN.oa.js";
import {
    eduPersonPrimaryAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrimaryAffiliation.oa.js";
import {
    eduPersonPrimaryOrgUnitDN,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrimaryOrgUnitDN.oa.js";
import {
    eduPersonPrincipalName,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrincipalName.oa.js";
import {
    eduPersonPrincipalNamePrior,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrincipalNamePrior.oa.js";
import {
    eduPersonScopedAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonScopedAffiliation.oa.js";
import {
    eduPersonTargetedID,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonTargetedID.oa.js";
import {
    eduPersonUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonUniqueId.oa.js";
import {
    fedfsAnnotation,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsAnnotation.oa.js";
import {
    fedfsDescr,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsDescr.oa.js";
import {
    fedfsFslUuid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFslUuid.oa.js";
import {
    fedfsFsnTTL,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsnTTL.oa.js";
import {
    fedfsFsnUuid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsnUuid.oa.js";
import {
    fedfsNceDN,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNceDN.oa.js";
import {
    fedfsNfsClassChange,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassChange.oa.js";
import {
    fedfsNfsClassFileid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassFileid.oa.js";
import {
    fedfsNfsClassHandle,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassHandle.oa.js";
import {
    fedfsNfsClassReaddir,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassReaddir.oa.js";
import {
    fedfsNfsClassSimul,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassSimul.oa.js";
import {
    fedfsNfsClassWritever,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassWritever.oa.js";
import {
    fedfsNfsCurrency,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsCurrency.oa.js";
import {
    fedfsNfsGenFlagGoing,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsGenFlagGoing.oa.js";
import {
    fedfsNfsGenFlagSplit,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsGenFlagSplit.oa.js";
import {
    fedfsNfsGenFlagWritable,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsGenFlagWritable.oa.js";
import {
    fedfsNfsReadOrder,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsReadOrder.oa.js";
import {
    fedfsNfsReadRank,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsReadRank.oa.js";
import {
    fedfsNfsTransFlagRdma,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsTransFlagRdma.oa.js";
import {
    fedfsNfsURI,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsURI.oa.js";
import {
    fedfsNfsValidFor,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsValidFor.oa.js";
import {
    fedfsNfsVarSub,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsVarSub.oa.js";
import {
    fedfsNfsWriteOrder,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsWriteOrder.oa.js";
import {
    fedfsNfsWriteRank,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsWriteRank.oa.js";
import {
    fedfsUuid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsUuid.oa.js";
import {
    mailaccess,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailaccess.oa.js";
import {
    mailbox,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailbox.oa.js";
import {
    maildest,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/maildest.oa.js";
import {
    maildrop,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/maildrop.oa.js";
import {
    mailRoutingAddress,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailRoutingAddress.oa.js";
import {
    transport,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/transport.oa.js";
import {
    carLicense,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/carLicense.oa.js";
import {
    departmentNumber,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/departmentNumber.oa.js";
import {
    displayName,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/displayName.oa.js";
import {
    employeeNumber,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/employeeNumber.oa.js";
import {
    employeeType,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/employeeType.oa.js";
import {
    preferredLanguage,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/preferredLanguage.oa.js";
import {
    javaClassName,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaClassName.oa.js";
import {
    javaClassNames,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaClassNames.oa.js";
import {
    javaCodebase,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaCodebase.oa.js";
import {
    javaDoc,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaDoc.oa.js";
import {
    javaFactory,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaFactory.oa.js";
import {
    javaReferenceAddress,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaReferenceAddress.oa.js";
import {
    javaSerializedData,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaSerializedData.oa.js";
import {
    krbHostServer,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbHostServer.oa.js";
import {
    krbKdcServers,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbKdcServers.oa.js";
import {
    krbLdapServers,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbLdapServers.oa.js";
import {
    krbMaxRenewableAge,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbMaxRenewableAge.oa.js";
import {
    krbMaxTicketLife,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbMaxTicketLife.oa.js";
import {
    krbPrincipalExpiration,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalExpiration.oa.js";
import {
    krbPrincipalName,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalName.oa.js";
import {
    krbPrincipalReferences,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalReferences.oa.js";
import {
    krbPrincipalType,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalType.oa.js";
import {
    krbPwdServers,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPwdServers.oa.js";
import {
    krbRealmReferences,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbRealmReferences.oa.js";
import {
    krbSearchScope,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbSearchScope.oa.js";
import {
    krbTicketFlags,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbTicketFlags.oa.js";
import {
    krbUPEnabled,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbUPEnabled.oa.js";
import {
    krb5AccountDisabled,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5AccountDisabled.oa.js";
import {
    krb5AccountExpirationTime,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5AccountExpirationTime.oa.js";
import {
    krb5AccountLockedOut,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5AccountLockedOut.oa.js";
import {
    krb5EncryptionType,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5EncryptionType.oa.js";
import {
    krb5KDCFlags,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5KDCFlags.oa.js";
import {
    krb5Key,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5Key.oa.js";
import {
    krb5KeyVersionNumber,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5KeyVersionNumber.oa.js";
import {
    krb5MaxLife,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5MaxLife.oa.js";
import {
    krb5MaxRenew,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5MaxRenew.oa.js";
import {
    krb5PasswordEnd,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5PasswordEnd.oa.js";
import {
    krb5PrincipalName,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5PrincipalName.oa.js";
import {
    krb5PrincipalRealm,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5PrincipalRealm.oa.js";
import {
    krb5RealmName,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5RealmName.oa.js";
import {
    krb5ValidEnd,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5ValidEnd.oa.js";
import {
    krb5ValidStart,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5ValidStart.oa.js";
import {
    pwdAccountLockedTime,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdAccountLockedTime.oa.js";
import {
    pwdAllowUserChange,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdAllowUserChange.oa.js";
// import {
//     pwdAttribute,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdAttribute.oa.js";
import {
    pwdChangedTime,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdChangedTime.oa.js";
import {
    pwdCheckQuality,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdCheckQuality.oa.js";
// import {
//     pwdEndTime,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdEndTime.oa.js";
import {
    pwdExpireWarning,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdExpireWarning.oa.js";
import {
    pwdFailureCountInterval,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdFailureCountInterval.oa.js";
// import {
//     pwdFailureTime,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdFailureTime.oa.js";
import {
    pwdGraceAuthNLimit,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceAuthNLimit.oa.js";
import {
    pwdGraceExpire,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceExpire.oa.js";
import {
    pwdGraceUseTime,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceUseTime.oa.js";
// import {
//     pwdHistory,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdHistory.oa.js";
import {
    pwdInHistory,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdInHistory.oa.js";
import {
    pwdLastSuccess,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLastSuccess.oa.js";
import {
    pwdLockout,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLockout.oa.js";
// import {
//     pwdLockoutDuration,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLockoutDuration.oa.js";
// import {
//     pwdMaxAge,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxAge.oa.js";
import {
    pwdMaxDelay,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxDelay.oa.js";
import {
    pwdMaxFailure,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxFailure.oa.js";
import {
    pwdMaxIdle,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxIdle.oa.js";
import {
    pwdMaxLength,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxLength.oa.js";
import {
    pwdMinAge,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMinAge.oa.js";
import {
    pwdMinDelay,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMinDelay.oa.js";
// import {
//     pwdMinLength,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMinLength.oa.js";
import {
    pwdMustChange,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMustChange.oa.js";
import {
    pwdPolicySubentry,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdPolicySubentry.oa.js";
import {
    pwdReset,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdReset.oa.js";
import {
    pwdSafeModify,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdSafeModify.oa.js";
// import {
//     pwdStartTime,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdStartTime.oa.js";
// import {
//     ref,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPReferral/ref.oa.js";
import {
    gpgFingerprint,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgFingerprint.oa.js";
import {
    gpgMailbox,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgMailbox.oa.js";
import {
    gpgSubCertID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgSubCertID.oa.js";
import {
    gpgSubFingerprint,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgSubFingerprint.oa.js";
import {
    pgpBaseKeySpaceDN,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpBaseKeySpaceDN.oa.js";
import {
    pgpCertID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpCertID.oa.js";
import {
    pgpDisabled,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpDisabled.oa.js";
import {
    pgpKey,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKey.oa.js";
import {
    pgpKeyCreateTime,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyCreateTime.oa.js";
import {
    pgpKeyExpireTime,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyExpireTime.oa.js";
import {
    pgpKeyID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyID.oa.js";
import {
    pgpKeySize,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeySize.oa.js";
import {
    pgpKeyType,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyType.oa.js";
import {
    pgpRevoked,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpRevoked.oa.js";
import {
    pgpSignerID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpSignerID.oa.js";
import {
    pgpSoftware,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpSoftware.oa.js";
import {
    pgpSubKeyID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpSubKeyID.oa.js";
import {
    pgpUserID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpUserID.oa.js";
import {
    pgpVersion,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpVersion.oa.js";
import {
    mailHost,
} from "@wildboar/parity-schema/src/lib/modules/Misc/mailHost.oa.js";
// import {
//     mailLocalAddress,
// } from "@wildboar/parity-schema/src/lib/modules/Misc/mailLocalAddress.oa.js";
import { // Duplicate attribute type name. Using the other one, because it is multi-valued and subtypes `mail`.
    mailRoutingAddress as openldapMailRoutingAddress,
} from "@wildboar/parity-schema/src/lib/modules/Misc/mailRoutingAddress.oa.js";
import {
    associatedDomain as associatedX400Domain,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedDomain.oa.js";
import {
    associatedInternetGateway,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedInternetGateway.oa.js";
import {
    associatedORAddress,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedORAddress.oa.js";
import {
    associatedX400Gateway,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedX400Gateway.oa.js";
import {
    mcgamTables,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/mcgamTables.oa.js";
import {
    oRAddressComponentType,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/oRAddressComponentType.oa.js";
import {
    custom1,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom1.oa.js";
import {
    custom2,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom2.oa.js";
import {
    custom3,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom3.oa.js";
import {
    custom4,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom4.oa.js";
import {
    homeurl,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/homeurl.oa.js";
import {
    mozillaHomeCountryName,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeCountryName.oa.js";
import {
    mozillaHomeFriendlyCountryName,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeFriendlyCountryName.oa.js";
import {
    mozillaHomeLocalityName,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeLocalityName.oa.js";
import {
    mozillaHomePostalAddress2,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomePostalAddress2.oa.js";
import {
    mozillaHomePostalCode,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomePostalCode.oa.js";
import {
    mozillaHomeState,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeState.oa.js";
import {
    mozillaPostalAddress2,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaPostalAddress2.oa.js";
import {
    mozillaSecondEmail,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaSecondEmail.oa.js";
import {
    nsAIMid,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/nsAIMid.oa.js";
import {
    workurl,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/workurl.oa.js";
import {
    xmozillanickname,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/xmozillanickname.oa.js";
import {
    xmozillausehtmlmail,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/xmozillausehtmlmail.oa.js";
import {
    authorizedService,
} from "@wildboar/parity-schema/src/lib/modules/NameServiceAdditionalSchema/authorizedService.oa.js";
import {
    bootFile,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootFile.oa.js";
import {
    bootParameter,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootParameter.oa.js";
import {
    gecos,
} from "@wildboar/parity-schema/src/lib/modules/NIS/gecos.oa.js";
import {
    gidNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/gidNumber.oa.js";
import {
    homeDirectory,
} from "@wildboar/parity-schema/src/lib/modules/NIS/homeDirectory.oa.js";
import {
    ipHostNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipHostNumber.oa.js";
import {
    ipNetmaskNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipNetmaskNumber.oa.js";
import {
    ipNetworkNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipNetworkNumber.oa.js";
import {
    ipProtocolNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipProtocolNumber.oa.js";
import {
    ipServicePort,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipServicePort.oa.js";
import {
    ipServiceProtocol,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipServiceProtocol.oa.js";
import {
    loginShell,
} from "@wildboar/parity-schema/src/lib/modules/NIS/loginShell.oa.js";
import {
    macAddress,
} from "@wildboar/parity-schema/src/lib/modules/NIS/macAddress.oa.js";
import {
    memberNisNetgroup,
} from "@wildboar/parity-schema/src/lib/modules/NIS/memberNisNetgroup.oa.js";
import {
    memberUid,
} from "@wildboar/parity-schema/src/lib/modules/NIS/memberUid.oa.js";
import {
    nisMapEntry,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisMapEntry.oa.js";
import {
    nisMapName,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisMapName.oa.js";
import {
    nisNetgroupTriple,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisNetgroupTriple.oa.js";
import {
    oncRpcNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/oncRpcNumber.oa.js";
import {
    shadowExpire,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowExpire.oa.js";
import {
    shadowFlag,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowFlag.oa.js";
import {
    shadowInactive,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowInactive.oa.js";
import {
    shadowLastChange,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowLastChange.oa.js";
import {
    shadowMax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowMax.oa.js";
import {
    shadowMin,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowMin.oa.js";
import {
    shadowWarning,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowWarning.oa.js";
import {
    uidNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/uidNumber.oa.js";
import {
    legalName,
} from "@wildboar/parity-schema/src/lib/modules/NSCommonSchema/legalName.oa.js";
import {
    administratorsAddress,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/administratorsAddress.oa.js";
// import {
//     emailAddress,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/emailAddress.oa.js";
// import { // TODO: Eventually support this, when you track the change number.
//     etag,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/etag.oa.js";
import {
    fullVendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/fullVendorVersion.oa.js";
import {
    isMemberOf,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/isMemberOf.oa.js";
// import {
//     configContext,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/configContext.oa.js";
// import {
//     monitorContext,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/monitorContext.oa.js";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa.js";
// import {
//     syncreplCookie,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncreplCookie.oa.js";
import {
    syncTimestamp,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncTimestamp.oa.js";
import {
    labeledURI,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/labeledURI.oa.js";
import {
    pamExcludeSuffix,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamExcludeSuffix.oa.js";
import {
    pamFallback,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamFallback.oa.js";
import {
    pamFilter,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamFilter.oa.js";
import {
    pamIDAttr,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamIDAttr.oa.js";
import {
    pamIDMapMethod,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamIDMapMethod.oa.js";
import {
    pamIncludeSuffix,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamIncludeSuffix.oa.js";
import {
    pamMissingSuffix,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamMissingSuffix.oa.js";
import {
    pamSecure,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamSecure.oa.js";
import {
    pamService,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamService.oa.js";
import {
    ftpDownloadBandwidth,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpDownloadBandwidth.oa.js";
import {
    ftpDownloadRatio,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpDownloadRatio.oa.js";
import {
    ftpGid,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpGid.oa.js";
import {
    ftpQuotaFiles,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpQuotaFiles.oa.js";
import {
    ftpQuotaMBytes,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpQuotaMBytes.oa.js";
import {
    ftpStatus,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpStatus.oa.js";
import {
    ftpUid,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpUid.oa.js";
import {
    ftpUploadBandwidth,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpUploadBandwidth.oa.js";
import {
    ftpUploadRatio,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpUploadRatio.oa.js";
import {
    accountStatus,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/accountStatus.oa.js";
import {
    confirmtext,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/confirmtext.oa.js";
import {
    deliveryMode,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/deliveryMode.oa.js";
import {
    deliveryProgramPath,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/deliveryProgramPath.oa.js";
import {
    dnmember,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/dnmember.oa.js";
import {
    dnmoderator,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/dnmoderator.oa.js";
import {
    dnsender,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/dnsender.oa.js";
import {
    filtermember,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/filtermember.oa.js";
import {
    filtersender,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/filtersender.oa.js";
import {
    mailAlternateAddress,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailAlternateAddress.oa.js";
import {
    mailForwardingAddress,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailForwardingAddress.oa.js";
import {
    mailHost as qmailHost,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailHost.oa.js";
import {
    mailMessageStore,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailMessageStore.oa.js";
import {
    mailQuotaCount,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailQuotaCount.oa.js";
import {
    mailQuotaSize,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailQuotaSize.oa.js";
import {
    mailReplyText,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailReplyText.oa.js";
import {
    mailSizeMax,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailSizeMax.oa.js";
import {
    membersonly,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/membersonly.oa.js";
import {
    moderatortext,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/moderatortext.oa.js";
import {
    qladnmanager,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qladnmanager.oa.js";
import {
    qlaDomainList,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaDomainList.oa.js";
import {
    qlaMailHostList,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailHostList.oa.js";
import {
    qlaMailMStorePrefix,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailMStorePrefix.oa.js";
import {
    qlaMailQuotaCount,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailQuotaCount.oa.js";
import {
    qlaMailQuotaSize,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailQuotaSize.oa.js";
import {
    qlaMailSizeMax,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailSizeMax.oa.js";
import {
    qlaQmailGid,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaQmailGid.oa.js";
import {
    qlaQmailUid,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaQmailUid.oa.js";
import {
    qlaUidPrefix,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaUidPrefix.oa.js";
import {
    qmailAccountPurge,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailAccountPurge.oa.js";
import {
    qmailDotMode,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailDotMode.oa.js";
import {
    qmailGID,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailGID.oa.js";
import {
    qmailUID,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUID.oa.js";
import {
    rfc822member,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/rfc822member.oa.js";
import {
    rfc822moderator,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/rfc822moderator.oa.js";
import {
    rfc822sender,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/rfc822sender.oa.js";
import {
    senderconfirm,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/senderconfirm.oa.js";
import {
    dialupAccess,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/dialupAccess.oa.js";
import {
    freeradiusDhcpv4Attribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4Attribute.oa.js";
import {
    freeradiusDhcpv4GatewayAddr,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4GatewayAddr.oa.js";
import {
    freeradiusDhcpv4GatewayIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4GatewayIdentifier.oa.js";
import {
    freeradiusDhcpv4PoolName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4PoolName.oa.js";
import {
    freeradiusDhcpv6Attribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6Attribute.oa.js";
import {
    freeradiusDhcpv6GatewayAddr,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6GatewayAddr.oa.js";
import {
    freeradiusDhcpv6GatewayIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6GatewayIdentifier.oa.js";
import {
    freeradiusDhcpv6PoolNameNA,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6PoolNameNA.oa.js";
import {
    freeradiusDhcpv6PoolNamePD,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6PoolNamePD.oa.js";
import {
    freeradiusDhcpv6PoolNameTA,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6PoolNameTA.oa.js";
import {
    radiusAcctAuthentic,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctAuthentic.oa.js";
import {
    radiusAcctInputOctets,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctInputOctets.oa.js";
import {
    radiusAcctInterval,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctInterval.oa.js";
import {
    radiusAcctOutputOctets,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctOutputOctets.oa.js";
import {
    radiusAcctSessionId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctSessionId.oa.js";
import {
    radiusAcctSessionTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctSessionTime.oa.js";
import {
    radiusAcctStartTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctStartTime.oa.js";
import {
    radiusAcctStopTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctStopTime.oa.js";
import {
    radiusAcctTerminateCause,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctTerminateCause.oa.js";
import {
    radiusAcctUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctUniqueId.oa.js";
import {
    radiusAcctUpdateTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctUpdateTime.oa.js";
import {
    radiusArapFeatures,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusArapFeatures.oa.js";
import {
    radiusArapSecurity,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusArapSecurity.oa.js";
import {
    radiusArapZoneAccess,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusArapZoneAccess.oa.js";
import {
    radiusAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAttribute.oa.js";
import {
    radiusAuthType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAuthType.oa.js";
import {
    radiusCallbackId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCallbackId.oa.js";
import {
    radiusCallbackNumber,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCallbackNumber.oa.js";
import {
    radiusCalledStationId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCalledStationId.oa.js";
import {
    radiusCallingStationId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCallingStationId.oa.js";
import {
    radiusClass,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClass.oa.js";
import {
    radiusClientComment,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientComment.oa.js";
import {
    radiusClientIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientIdentifier.oa.js";
import {
    radiusClientIPAddress,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientIPAddress.oa.js";
import {
    radiusClientRequireMa,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientRequireMa.oa.js";
import {
    radiusClientSecret,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientSecret.oa.js";
import {
    radiusClientShortname,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientShortname.oa.js";
import {
    radiusClientType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientType.oa.js";
import {
    radiusClientVirtualServer,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientVirtualServer.oa.js";
import {
    radiusConnectInfoStart,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusConnectInfoStart.oa.js";
import {
    radiusConnectInfoStop,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusConnectInfoStop.oa.js";
import {
    radiusControlAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusControlAttribute.oa.js";
import {
    radiusExpiration,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusExpiration.oa.js";
import {
    radiusFilterId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFilterId.oa.js";
import {
    radiusFramedAppleTalkLink,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedAppleTalkLink.oa.js";
import {
    radiusFramedAppleTalkNetwork,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedAppleTalkNetwork.oa.js";
import {
    radiusFramedAppleTalkZone,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedAppleTalkZone.oa.js";
import {
    radiusFramedCompression,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedCompression.oa.js";
import {
    radiusFramedIPAddress,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedIPAddress.oa.js";
import {
    radiusFramedIPNetmask,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedIPNetmask.oa.js";
import {
    radiusFramedIPXNetwork,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedIPXNetwork.oa.js";
import {
    radiusFramedMTU,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedMTU.oa.js";
import {
    radiusFramedProtocol,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedProtocol.oa.js";
import {
    radiusFramedRoute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedRoute.oa.js";
import {
    radiusFramedRouting,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedRouting.oa.js";
import {
    radiusGroupName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusGroupName.oa.js";
import {
    radiusHint,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusHint.oa.js";
import {
    radiusHuntgroupName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusHuntgroupName.oa.js";
import {
    radiusIdleTimeout,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusIdleTimeout.oa.js";
import {
    radiusLoginIPHost,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginIPHost.oa.js";
import {
    radiusLoginLATGroup,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATGroup.oa.js";
import {
    radiusLoginLATNode,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATNode.oa.js";
import {
    radiusLoginLATPort,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATPort.oa.js";
import {
    radiusLoginLATService,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATService.oa.js";
import {
    radiusLoginService,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginService.oa.js";
import {
    radiusLoginTCPPort,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginTCPPort.oa.js";
import {
    radiusLoginTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginTime.oa.js";
import {
    radiusNASIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASIdentifier.oa.js";
import {
    radiusNASIpAddress,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASIpAddress.oa.js";
import {
    radiusNASPort,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASPort.oa.js";
import {
    radiusNASPortId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASPortId.oa.js";
import {
    radiusNASPortType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASPortType.oa.js";
import {
    radiusPasswordRetry,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusPasswordRetry.oa.js";
import {
    radiusPortLimit,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusPortLimit.oa.js";
import {
    radiusProfileDN,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusProfileDN.oa.js";
import {
    radiusPrompt,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusPrompt.oa.js";
import {
    radiusProxyToRealm,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusProxyToRealm.oa.js";
import {
    radiusRealm,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusRealm.oa.js";
import {
    radiusReplicateToRealm,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusReplicateToRealm.oa.js";
import {
    radiusReplyAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusReplyAttribute.oa.js";
import {
    radiusReplyMessage,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusReplyMessage.oa.js";
import {
    radiusRequestAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusRequestAttribute.oa.js";
import {
    radiusServiceType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusServiceType.oa.js";
import {
    radiusSessionTimeout,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusSessionTimeout.oa.js";
import {
    radiusSimultaneousUse,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusSimultaneousUse.oa.js";
import {
    radiusStripUserName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusStripUserName.oa.js";
import {
    radiusTerminationAction,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTerminationAction.oa.js";
import {
    radiusTunnelAssignmentId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelAssignmentId.oa.js";
import {
    radiusTunnelClientEndpoint,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelClientEndpoint.oa.js";
import {
    radiusTunnelMediumType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelMediumType.oa.js";
import {
    radiusTunnelPassword,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelPassword.oa.js";
import {
    radiusTunnelPreference,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelPreference.oa.js";
import {
    radiusTunnelPrivateGroupId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelPrivateGroupId.oa.js";
import {
    radiusTunnelServerEndpoint,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelServerEndpoint.oa.js";
import {
    radiusTunnelType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelType.oa.js";
import {
    radiusUserCategory,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusUserCategory.oa.js";
import {
    radiusUserName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusUserName.oa.js";
import {
    radiusVSA,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusVSA.oa.js";
import {
    automountKey,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/automountKey.oa.js";
import {
    automountMapName,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/automountMapName.oa.js";
import {
    nisDomain,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisDomain.oa.js";
import {
    nisPublicKey,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisPublicKey.oa.js";
import {
    nisSecretKey,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisSecretKey.oa.js";
import {
    dynamicSubtrees,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicSubtrees.oa.js";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa.js";
import {
    calCalAdrURI,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calCalAdrURI.oa.js";
import {
    calCalURI,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calCalURI.oa.js";
import {
    calCAPURI,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calCAPURI.oa.js";
import {
    calFBURL,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calFBURL.oa.js";
import {
    calOtherCalAdrURIs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherCalAdrURIs.oa.js";
import {
    calOtherCalURIs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherCalURIs.oa.js";
import {
    calOtherCAPURIs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherCAPURIs.oa.js";
import {
    calOtherFBURLs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherFBURLs.oa.js";
import {
    service_advert_attribute_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-attribute-authenticator.oa.js"
import {
    service_advert_scopes,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-scopes.oa.js"
import {
    service_advert_service_type,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-service-type.oa.js"
import {
    service_advert_url_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-url-authenticator.oa.js"
import {
    template_major_version_number,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/template-major-version-number.oa.js"
import {
    template_minor_version_number,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/template-minor-version-number.oa.js"
import {
    template_url_syntax,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/template-url-syntax.oa.js"
import {
    vendorName,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorName.oa.js";
import {
    vendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorVersion.oa.js";
import {
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa.js";
import {
    ldifLocationURL,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/ldifLocationURL.oa.js";
import {
    mailReceipt,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/mailReceipt.oa.js";
import {
    managedDomains,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/managedDomains.oa.js";
import {
    providerCertificate,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerCertificate.oa.js";
import {
    providerCertificateHash,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerCertificateHash.oa.js";
import {
    providerName,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerName.oa.js";
import {
    providerUnit,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerUnit.oa.js";
import {
    printer_aliases,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-aliases.oa.js"
import {
    printer_charge_info_uri,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charge-info-uri.oa.js"
import {
    printer_charge_info,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charge-info.oa.js"
import {
    printer_charset_configured,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charset-configured.oa.js"
import {
    printer_charset_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charset-supported.oa.js"
import {
    printer_color_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-color-supported.oa.js"
import {
    printer_compression_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-compression-supported.oa.js"
import {
    printer_copies_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-copies-supported.oa.js"
import {
    printer_current_operator,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-current-operator.oa.js"
import {
    printer_delivery_orientation_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-delivery-orientation-supported.oa.js"
import {
    printer_device_id,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-device-id.oa.js"
import {
    printer_device_service_count,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-device-service-count.oa.js"
import {
    printer_document_format_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-document-format-supported.oa.js"
import {
    printer_finishings_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-finishings-supported.oa.js"
import {
    printer_generated_natural_language_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-generated-natural-language-supported.oa.js"
import {
    printer_geo_location,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-geo-location.oa.js"
import {
    printer_info,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-info.oa.js"
import {
    printer_ipp_features_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-ipp-features-supported.oa.js"
import {
    printer_ipp_versions_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-ipp-versions-supported.oa.js"
import {
    printer_job_k_octets_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-job-k-octets-supported.oa.js"
import {
    printer_job_priority_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-job-priority-supported.oa.js"
import {
    printer_location,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-location.oa.js"
import {
    printer_make_and_model,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-make-and-model.oa.js"
import {
    printer_media_local_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-media-local-supported.oa.js"
import {
    printer_media_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-media-supported.oa.js"
import {
    printer_more_info,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-more-info.oa.js"
import {
    printer_multiple_document_jobs_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-multiple-document-jobs-supported.oa.js"
import {
    printer_name,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-name.oa.js"
import {
    printer_natural_language_configured,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-natural-language-configured.oa.js"
import {
    printer_number_up_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-number-up-supported.oa.js"
import {
    printer_output_features_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-output-features-supported.oa.js"
import {
    printer_pages_per_minute_color,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-pages-per-minute-color.oa.js"
import {
    printer_pages_per_minute,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-pages-per-minute.oa.js"
import {
    printer_print_quality_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-print-quality-supported.oa.js"
import {
    printer_resolution_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-resolution-supported.oa.js"
import {
    printer_service_person,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-service-person.oa.js"
import {
    printer_sides_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-sides-supported.oa.js"
import {
    printer_stacking_order_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-stacking-order-supported.oa.js"
import {
    printer_uri,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-uri.oa.js"
import {
    printer_uuid,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-uuid.oa.js"
import {
    printer_xri_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-xri-supported.oa.js"
import {
    sabayonProfileName,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileName.oa.js";
import {
    sabayonProfileURL,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileURL.oa.js";
import {
    acctFlags,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/acctFlags.oa.js";
import {
    domain,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/domain.oa.js";
import {
    homeDrive,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/homeDrive.oa.js";
import {
    kickoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/kickoffTime.oa.js";
import {
    lmPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/lmPassword.oa.js";
import {
    logoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/logoffTime.oa.js";
import {
    logonTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/logonTime.oa.js";
import {
    ntPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/ntPassword.oa.js";
import {
    primaryGroupID,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/primaryGroupID.oa.js";
import {
    profilePath,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/profilePath.oa.js";
import {
    pwdCanChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/pwdCanChange.oa.js";
import {
    pwdLastSet,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/pwdLastSet.oa.js";
// import {
//     pwdMustChange,
// } from "@wildboar/parity-schema/src/lib/modules/SambaSchema/pwdMustChange.oa.js";
import {
    rid,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/rid.oa.js";
import {
    scriptPath,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/scriptPath.oa.js";
import {
    smbHome,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/smbHome.oa.js";
import {
    userWorkstations,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/userWorkstations.oa.js";
import {
    sambaAcctFlags,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaAcctFlags.oa.js";
import {
    sambaAlgorithmicRidBase,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaAlgorithmicRidBase.oa.js";
import {
    sambaBadPasswordCount,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaBadPasswordCount.oa.js";
import {
    sambaBadPasswordTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaBadPasswordTime.oa.js";
import {
    sambaBoolOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaBoolOption.oa.js";
import {
    sambaDomainName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaDomainName.oa.js";
import {
    sambaForceLogoff,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaForceLogoff.oa.js";
import {
    sambaGroupType,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaGroupType.oa.js";
import {
    sambaHomeDrive,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaHomeDrive.oa.js";
import {
    sambaHomePath,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaHomePath.oa.js";
import {
    sambaIntegerOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaIntegerOption.oa.js";
import {
    sambaKickoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaKickoffTime.oa.js";
import {
    sambaLMPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLMPassword.oa.js";
import {
    sambaLockoutDuration,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLockoutDuration.oa.js";
import {
    sambaLockoutObservationWindow,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLockoutObservationWindow.oa.js";
import {
    sambaLockoutThreshold,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLockoutThreshold.oa.js";
import {
    sambaLogoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogoffTime.oa.js";
import {
    sambaLogonHours,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonHours.oa.js";
import {
    sambaLogonScript,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonScript.oa.js";
import {
    sambaLogonTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonTime.oa.js";
import {
    sambaLogonToChgPwd,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonToChgPwd.oa.js";
import {
    sambaMaxPwdAge,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMaxPwdAge.oa.js";
import {
    sambaMinPwdAge,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMinPwdAge.oa.js";
import {
    sambaMinPwdLength,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMinPwdLength.oa.js";
import {
    sambaMungedDial,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMungedDial.oa.js";
import {
    sambaNextGroupRid,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNextGroupRid.oa.js";
import {
    sambaNextRid,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNextRid.oa.js";
import {
    sambaNextUserRid,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNextUserRid.oa.js";
import {
    sambaNTPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNTPassword.oa.js";
import {
    sambaOptionName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaOptionName.oa.js";
import {
    sambaPasswordHistory,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPasswordHistory.oa.js";
import {
    sambaPrimaryGroupSID,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrimaryGroupSID.oa.js";
import {
    sambaPrivilegeList,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrivilegeList.oa.js";
import {
    sambaPrivName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrivName.oa.js";
import {
    sambaProfilePath,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaProfilePath.oa.js";
import {
    sambaPwdCanChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdCanChange.oa.js";
import {
    sambaPwdHistoryLength,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdHistoryLength.oa.js";
import {
    sambaPwdLastSet,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdLastSet.oa.js";
import {
    sambaPwdMustChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdMustChange.oa.js";
import {
    sambaRefuseMachinePwdChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaRefuseMachinePwdChange.oa.js";
import {
    sambaShareName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaShareName.oa.js";
import {
    sambaSID,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSID.oa.js";
import {
    sambaSIDList,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSIDList.oa.js";
import {
    sambaStringListOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaStringListOption.oa.js";
import {
    sambaStringOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaStringOption.oa.js";
import {
    sambaTrustFlags,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaTrustFlags.oa.js";
import {
    sambaUserWorkstations,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaUserWorkstations.oa.js";
import {
    mailHost as sendmailMailHost,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/mailHost.oa.js";
import {
    mailLocalAddress,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/mailLocalAddress.oa.js";
import {
    mailRoutingAddress as sendmailRoutingAddress,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/mailRoutingAddress.oa.js";
import {
    sudoCommand,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoCommand.oa.js";
import {
    sudoHost,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoHost.oa.js";
import {
    sudoNotAfter,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoNotAfter.oa.js";
import {
    sudoNotBefore,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoNotBefore.oa.js";
import {
    sudoOption,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoOption.oa.js";
import {
    sudoOrder,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoOrder.oa.js";
import {
    sudoRunAs,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRunAs.oa.js";
import {
    sudoRunAsGroup,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRunAsGroup.oa.js";
import {
    sudoRunAsUser,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRunAsUser.oa.js";
import {
    sudoUser,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoUser.oa.js";
import {
    distinguishedNameTableKey,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/distinguishedNameTableKey.oa.js";
import {
    textTableKey,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableKey.oa.js";
import {
    textTableValue,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableValue.oa.js";
import {
    uddiAccessPoint,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAccessPoint.oa.js"
import {
    uddiAddressLine,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAddressLine.oa.js"
import {
    uddiAuthorizedName,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAuthorizedName.oa.js"
import {
    uddiBindingKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBindingKey.oa.js"
import {
    uddiBusinessKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessKey.oa.js"
import {
    uddiCategoryBag,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiCategoryBag.oa.js"
import {
    uddiDescription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiDescription.oa.js"
import {
    uddiDiscoveryURLs,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiDiscoveryURLs.oa.js"
import {
    uddiEMail,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiEMail.oa.js"
import {
    uddiFromKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiFromKey.oa.js"
import {
    uddiHostingRedirector,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiHostingRedirector.oa.js"
import {
    uddiIdentifierBag,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiIdentifierBag.oa.js"
import {
    uddiInstanceDescription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiInstanceDescription.oa.js"
import {
    uddiInstanceParms,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiInstanceParms.oa.js"
import {
    uddiIsHidden,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiIsHidden.oa.js"
import {
    uddiIsProjection,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiIsProjection.oa.js"
import {
    uddiKeyedReference,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiKeyedReference.oa.js"
import {
    uddiLang,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiLang.oa.js"
import {
    uddiName,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiName.oa.js"
import {
    uddiOperator,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiOperator.oa.js"
import {
    uddiOverviewDescription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiOverviewDescription.oa.js"
import {
    uddiOverviewURL,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiOverviewURL.oa.js"
import {
    uddiPersonName,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPersonName.oa.js"
import {
    uddiPhone,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPhone.oa.js"
import {
    uddiServiceKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiServiceKey.oa.js"
import {
    uddiSortCode,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiSortCode.oa.js"
import {
    uddiTModelKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelKey.oa.js"
import {
    uddiToKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiToKey.oa.js"
import {
    uddiUseType,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiUseType.oa.js"
import {
    uddiUUID,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiUUID.oa.js"
import {
    uddiv3BindingKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3BindingKey.oa.js"
import {
    uddiv3BriefResponse,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3BriefResponse.oa.js"
import {
    uddiv3BusinessKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3BusinessKey.oa.js"
import {
    uddiv3DigitalSignature,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3DigitalSignature.oa.js"
import {
    uddiv3EntityCreationTime,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityCreationTime.oa.js"
import {
    uddiv3EntityDeletionTime,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityDeletionTime.oa.js"
import {
    uddiv3EntityKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityKey.oa.js"
import {
    uddiv3EntityModificationTime,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityModificationTime.oa.js"
import {
    uddiv3ExpiresAfter,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3ExpiresAfter.oa.js"
import {
    uddiv3MaxEntities,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3MaxEntities.oa.js"
import {
    uddiv3NodeId,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3NodeId.oa.js"
import {
    uddiv3NotificationInterval,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3NotificationInterval.oa.js"
import {
    uddiv3ServiceKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3ServiceKey.oa.js"
import {
    uddiv3SubscriptionFilter,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3SubscriptionFilter.oa.js"
import {
    uddiv3SubscriptionKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3SubscriptionKey.oa.js"
import {
    uddiv3TModelKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3TModelKey.oa.js"
// import {
//     entryUUID,
// } from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa.js";
import {
    vPIMExtendedAbsenceStatus,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMExtendedAbsenceStatus.oa.js";
import {
    vPIMMaxMessageSize,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMMaxMessageSize.oa.js";
import {
    vPIMRfc822Mailbox,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMRfc822Mailbox.oa.js";
import {
    vPIMSpokenName,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSpokenName.oa.js";
import {
    vPIMSubMailboxes,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSubMailboxes.oa.js";
import {
    vPIMSupportedAudioMediaTypes,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSupportedAudioMediaTypes.oa.js";
import {
    vPIMSupportedMessageContext,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSupportedMessageContext.oa.js";
import {
    vPIMSupportedUABehaviors,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSupportedUABehaviors.oa.js";
import {
    vPIMTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMTelephoneNumber.oa.js";
import {
    vPIMTextName,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMTextName.oa.js";

// CMS Attribute Types
import {
    aa_contentLocation,
} from "@wildboar/cms";
import {
    aa_contentLocations,
} from "@wildboar/cms";
import {
    aa_parentBlock,
} from "@wildboar/cms";
import {
    aa_precedingBlock,
} from "@wildboar/cms";
import {
    aa_sidechains,
} from "@wildboar/cms";
import {
    aa_signerInfo,
} from "@wildboar/cms";
import {
    aa_signerInfos,
} from "@wildboar/cms";
import {
    aa_timeStamped,
} from "@wildboar/cms";
import {
//     signcryptedEnvelope,
//     aa_contentType,
    aa_countersignature,
//     aa_messageDigest,
//     aa_signingTime,
    aa_encrypKeyPref,
//     aa_smimeCapabilities,
//     tokenizedParts,
} from "@wildboar/cms";

// ITU Schema
import {
    cEKReference,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/cEKReference.oa.js";
import {
    cEKMaxDecrypts,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/cEKMaxDecrypts.oa.js";
import {
    kEKDerivationAlg,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/kEKDerivationAlg.oa.js";
import {
    accessService,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/accessService.oa.js";
import {
    dateOfBirth,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/dateOfBirth.oa.js";
import {
    placeOfBirth,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/placeOfBirth.oa.js";
import {
    gender,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/gender.oa.js";
import {
    countryOfCitizenship,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/countryOfCitizenship.oa.js";
import {
    countryOfResidence,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/countryOfResidence.oa.js";
import {
    deviceOwner,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/deviceOwner.oa.js";
import {
    clearanceSponsor,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/clearanceSponsor.oa.js";
import {
    binarySigningTime,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/binarySigningTime.oa.js";
import {
    tokenizedParts,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/tokenizedParts.oa.js";
import {
    authenticationInfo,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/authenticationInfo.oa.js";
import {
    accesIdentity,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/accesIdentity.oa.js";
import {
    chargingIdentity,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/chargingIdentity.oa.js";
import {
    group,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/group.oa.js";
import {
    clearance_RFC3281,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/clearance-RFC3281.oa.js"
import {
    encAttrs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/encAttrs.oa.js";
import {
    smimeCapabilities,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/smimeCapabilities.oa.js";
// import {
//     signerInfo,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signerInfo.oa.js";
// import {
//     signerInfos,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signerInfos.oa.js";
// import {
//     contentLocation,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/contentLocation.oa.js";
// import {
//     contentLocations,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/contentLocations.oa.js";
// import {
//     precedingBlock,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/precedingBlock.oa.js";
// import {
//     timeStamped,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/timeStamped.oa.js";
// import {
//     sidechains,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/sidechains.oa.js";
// import {
//     parentBlock,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/parentBlock.oa.js";
import {
    signcryptedEnvelope,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signcryptedEnvelope.oa.js";
// import {
//     encrypKeyPref,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/encrypKeyPref.oa.js";
import {
    firmwarePackageID,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/firmwarePackageID.oa.js";
import {
    targetHardwareIDs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/targetHardwareIDs.oa.js";
import {
    decryptKeyID,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/decryptKeyID.oa.js";
import {
    implCryptoAlgs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/implCryptoAlgs.oa.js";
import {
    implCompressAlgs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/implCompressAlgs.oa.js";
import {
    communityIdentifiers,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/communityIdentifiers.oa.js";
import {
    firmwarePackageInfo,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/firmwarePackageInfo.oa.js";
import {
    wrappedFirmwareKey,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/wrappedFirmwareKey.oa.js";
import {
    contentType,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/contentType.oa.js";
import {
    messageDigest,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/messageDigest.oa.js";
import {
    signingTime,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signingTime.oa.js";
// import {
//     countersignature,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/countersignature.oa.js";
import {
    extension_req,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/extension-req.oa.js"
import {
    unsignedData,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/unsignedData.oa.js";
import {
    multipleSignatures,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/multipleSignatures.oa.js";
import {
    wlanSSID,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/wlanSSID.oa.js";

import {
    commUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commUniqueId.oa.js"
import {
    commOwner,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commOwner.oa.js"
import {
    commPrivate,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commPrivate.oa.js"
import {
    commURI,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commURI.oa.js"
import {
    h323IdentityGKDomain,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityGKDomain.oa.js"
import {
    h323Identityh323_ID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323Identityh323-ID.oa.js"
import {
    h323IdentitydialedDigits,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitydialedDigits.oa.js"
import {
    h323Identityemail_ID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323Identityemail-ID.oa.js"
import {
    h323IdentityURL_ID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityURL-ID.oa.js"
import {
    h323IdentitytransportID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitytransportID.oa.js"
import {
    h323IdentitypartyNumber,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitypartyNumber.oa.js"
import {
    h323IdentitymobileUIM,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitymobileUIM.oa.js"
import {
    h323IdentityEndpointType,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityEndpointType.oa.js"
import {
    h323IdentityServiceLevel,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityServiceLevel.oa.js"
import {
    h235IdentityEndpointID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h235IdentityEndpointID.oa.js"
import {
    h235IdentityPassword,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h235IdentityPassword.oa.js"
import {
    h320IdentityCC,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityCC.oa.js"
import {
    h320IdentityNDC,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityNDC.oa.js"
import {
    h320IdentitySN,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentitySN.oa.js"
import {
    h320IdentityServiceLevel,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityServiceLevel.oa.js"
import {
    h320IdentityExtension,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityExtension.oa.js"
import {
    sIPIdentitySIPURI,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentitySIPURI.oa.js"
import {
    sIPIdentityRegistrarAddress,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityRegistrarAddress.oa.js"
import {
    sIPIdentityProxyAddress,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityProxyAddress.oa.js"
import {
    sIPIdentityAddress,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityAddress.oa.js"
import {
    sIPIdentityPassword,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityPassword.oa.js"
import {
    sIPIdentityUserName,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityUserName.oa.js"
import {
    sIPIdentityServiceLevel,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityServiceLevel.oa.js"
import {
    genericIdentityProtocolIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/genericIdentityProtocolIdentifier.oa.js"
import {
    genericIdentityMessage,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/genericIdentityMessage.oa.js"
import {
    callPreferenceURI,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/callPreferenceURI.oa.js"
import {
    userSMIMECertificate,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/userSMIMECertificate.oa.js"

// ERS
import {
    aa_er_External,
} from "@wildboar/parity-schema/src/lib/modules/ERS/aa-er-External.oa.js"
import {
    aa_er_Internal,
} from "@wildboar/parity-schema/src/lib/modules/ERS/aa-er-Internal.oa.js"

// ESS
import {
    aa_receiptRequest,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-receiptRequest.oa.js"
import {
    aa_contentIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-contentIdentifier.oa.js"
import {
    aa_contentHint,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-contentHint.oa.js"
import {
    aa_msgSigDigest,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-msgSigDigest.oa.js"
import {
    aa_contentReference,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-contentReference.oa.js"
import {
    aa_securityLabel,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-securityLabel.oa.js"
import {
    aa_equivalentLabels,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-equivalentLabels.oa.js"
import {
    aa_mlExpandHistory,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-mlExpandHistory.oa.js"
import {
    aa_signingCertificate,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-signingCertificate.oa.js"
import {
    aa_signingCertificateV2,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-signingCertificateV2.oa.js"

// UPT
import {
    providerId,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/providerId.oa.js"
import {
    providedServiceId,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/providedServiceId.oa.js"
import {
    providedLocations,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/providedLocations.oa.js"
import {
    pui,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/pui.oa.js"
import {
    specialPassword,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/specialPassword.oa.js"
import {
    variablePassword,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/variablePassword.oa.js"
import {
    nbOfFailedAuthentications,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/nbOfFailedAuthentications.oa.js"
import {
    userCredit,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userCredit.oa.js"
import {
    callInfoRecords,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callInfoRecords.oa.js"
import {
    activeChargingService,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/activeChargingService.oa.js"
import {
    allowedServiceFeatures,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/allowedServiceFeatures.oa.js"
import {
    uptNumber,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/uptNumber.oa.js"
import {
    defaultChargingReference,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/defaultChargingReference.oa.js"
import {
    icRegistrationAddress,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/icRegistrationAddress.oa.js"
import {
    allowedRegistrationAddress,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/allowedRegistrationAddress.oa.js"
import {
    allowedDestinations,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/allowedDestinations.oa.js"
import {
    supplServId,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/supplServId.oa.js"
import {
    supplServiceStatus,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/supplServiceStatus.oa.js"
import {
    forwardedToNumber,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/forwardedToNumber.oa.js"
import {
    typesOfNotification,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/typesOfNotification.oa.js"
import {
    noReplyConditionTimer,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/noReplyConditionTimer.oa.js"

// Intelligent Networks Attribute Types
import {
    methodUse,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/methodUse.oa.js"
import {
    securityFacilityId,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/securityFacilityId.oa.js"
import {
    secretKey,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/secretKey.oa.js"
import {
    identifierList,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/identifierList.oa.js"
import {
    bindLevelIfOK,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/bindLevelIfOK.oa.js"
import {
    lockSession,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/lockSession.oa.js"
import {
    failureCounter,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/failureCounter.oa.js"
import {
    maxAttempts,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/maxAttempts.oa.js"
import {
    currentList,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/currentList.oa.js"
import {
    stockId,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/stockId.oa.js"
import {
    source,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/source.oa.js"
import {
    sizeOfRestocking,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/sizeOfRestocking.oa.js"
import {
    stock,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/stock.oa.js"

// CRMF Attribute Types
import {
    regCtrl_regToken,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-regToken.oa.js"
import {
    regCtrl_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-authenticator.oa.js"
import {
    regCtrl_pkiPublicationInfo,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa.js"
import {
    regCtrl_pkiArchiveOptions,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa.js"
import {
    regCtrl_oldCertID,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-oldCertID.oa.js"
import {
    regCtrl_protocolEncrKey,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-protocolEncrKey.oa.js"
import {
    regInfo_utf8Pairs,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regInfo-utf8Pairs.oa.js"
import {
    regInfo_certReq,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regInfo-certReq.oa.js"

// Telebiometrics Authentication Infrastructure (TAI) Attribute Types
import {
    biometricInformationTemplate,
} from "@wildboar/parity-schema/src/lib/modules/TAI/biometricInformationTemplate.oa.js";
import {
    bioSecLevelReference,
} from "@wildboar/parity-schema/src/lib/modules/TAI/bioSecLevelReference.oa.js";
import {
    bDCReportContentInformation,
} from "@wildboar/parity-schema/src/lib/modules/TAI/bDCReportContentInformation.oa.js";

// X.952 Printer Service Offer Definitions (Commented out because it turns out this is just an example module.)
// import {
//     printerType,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/printerType.oa.js";
// import {
//     locationRoom,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/locationRoom.oa.js";
// import {
//     locationBuilding,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/locationBuilding.oa.js";
// import {
//     costPerPage,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/costPerPage.oa.js";
// import {
//     languagesSupported,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/languagesSupported.oa.js";
// import {
//     pagesPerMinute,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/pagesPerMinute.oa.js";
// import {
//     pageSize,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/pageSize.oa.js";
// import {
//     dotsPerInch,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/dotsPerInch.oa.js";
// import {
//     colourCapable,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/colourCapable.oa.js";
// import {
//     driverName,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/driverName.oa.js";
// import {
//     queueLength,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/queueLength.oa.js";

// X.952 Trader Definitions
import {
    traderInterface,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderInterface.oa.js";
import {
    dsaName,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/dsaName.oa.js";
import {
    typeRepos,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/typeRepos.oa.js";
import {
    defSearchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defSearchCard.oa.js";
import {
    maxSearchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxSearchCard.oa.js";
import {
    defMatchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defMatchCard.oa.js";
import {
    maxMatchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxMatchCard.oa.js";
import {
    defReturnCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defReturnCard.oa.js";
import {
    maxReturnCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxReturnCard.oa.js";
import {
    defHopCount,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defHopCount.oa.js";
import {
    maxHopCount,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxHopCount.oa.js";
import {
    defFollowPolicy,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defFollowPolicy.oa.js";
import {
    maxFollowPolicy,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxFollowPolicy.oa.js";
import {
    maxLinkFollowPolicy,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxLinkFollowPolicy.oa.js";
import {
    supportsModifiableProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/supportsModifiableProperties.oa.js";
import {
    supportsDynamicProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/supportsDynamicProperties.oa.js";
import {
    supportsProxyOffers,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/supportsProxyOffers.oa.js";
import {
    maxList,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxList.oa.js";
import {
    requestIdStem,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/requestIdStem.oa.js";
import {
    typeManagementConstraint,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/typeManagementConstraint.oa.js";
import {
    searchConstraint,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/searchConstraint.oa.js";
import {
    offerAcceptanceConstraint,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/offerAcceptanceConstraint.oa.js";
import {
    sOfferId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/sOfferId.oa.js";
import {
    serviceInterfaceId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceInterfaceId.oa.js";
import {
    serviceTypeId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceTypeId.oa.js";
import {
    hasDynamicProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/hasDynamicProperties.oa.js";
import {
    hasModifiableProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/hasModifiableProperties.oa.js";
import {
    dynamicProps,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/dynamicProps.oa.js";
import {
    linkName,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/linkName.oa.js";
import {
    linkId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/linkId.oa.js";
import {
    targetTraderInterfaceId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/targetTraderInterfaceId.oa.js";
import {
    defPassOnFollowRule,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defPassOnFollowRule.oa.js";
import {
    limitingFollowRule,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/limitingFollowRule.oa.js";
import {
    proxyOfferId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyOfferId.oa.js";
import {
    proxyLookUpInterfaceId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyLookUpInterfaceId.oa.js";
import {
    constraintRecipe,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/constraintRecipe.oa.js";
import {
    ifMatchAll,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/ifMatchAll.oa.js";
import {
    interfaceReference,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/interfaceReference.oa.js";
import {
    interfaceType,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/interfaceType.oa.js";

// Matching Rules Suitable for Naming
import {
    addressCapabilitiesMatch,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    capabilityMatch,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    oRNameExactMatch,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mSStringMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSStringCaseSensitiveMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSStringListMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSStringListElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSSingleSubstringListMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSSingleSubstringListElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRAddressMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRAddressElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRAddressSubstringElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRNameMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRNameElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRNameSubstringElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionOrDLExpansionMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionOrDLExpansionElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionOrDLExpansionSubstringElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mTSIdentifierMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    contentCorrelatorMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    contentIdentifierMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    iPMIdentifierMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    oRDescriptorMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    oRDescriptorElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    oRDescriptorSingleElementMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    recipientSpecifierMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    recipientSpecifierElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    recipientSpecifierSubstringElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberSubstringElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    distributionCodeMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    informationCategoryMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    policySpecificationMatch,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/policySpecificationMatch.oa.js";
import {
    pkcs9CaseIgnoreMatch,
} from "@wildboar/pkcs/PKCS-9";
import {
    signingTimeMatch,
} from "@wildboar/pkcs/PKCS-9";
import {
    directoryStringApproxMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/directoryStringApproxMatch.oa.js";
import {
    ia5StringApproxMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/ia5StringApproxMatch.oa.js";
import {
    integerBitAndMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/integerBitAndMatch.oa.js";
import {
    integerBitOrMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/integerBitOrMatch.oa.js";
import {
    uuidMatch,
} from "@wildboar/parity-schema/src/lib/modules/UUID/uuidMatch.oa.js";
import { attributes as schemaLevelIIAttributes } from "@wildboar/schema-level-ii";

/**
 * @summary Initialize Meerkat DSA's internal index of known attribute types.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known attribute types.
 *
 * @param ctx The context object
 *
 * @function
 * @async
 */
export
async function loadAttributeTypes (ctx: Context): Promise<void> {
    Object.entries({
        ...{
            ...x500at,
            uniqueIdentifier: undefined,
            x500UniqueIdentifier: x500at.uniqueIdentifier,
        },

        uid,
        dc,

        userPwdHistory,
        userPwdRecentlyExpired,

        // X.400 Attribute Types
        "mhs-acceptable-eits": mhs_acceptable_eits,
        "mhs-deliverable-classes": mhs_deliverable_classes,
        "mhs-deliverable-content-types": mhs_deliverable_content_types,
        "mhs-dl-archive-service": mhs_dl_archive_service,
        "mhs-dl-members": mhs_dl_members,
        "mhs-dl-policy": mhs_dl_policy,
        "mhs-dl-related-lists": mhs_dl_related_lists,
        "mhs-dl-submit-permissions": mhs_dl_submit_permissions,
        "mhs-dl-subscription-service": mhs_dl_subscription_service,
        "mhs-exclusively-acceptable-eits": mhs_exclusively_acceptable_eits,
        "mhs-maximum-content-length": mhs_maximum_content_length,
        "mhs-message-store-dn": mhs_message_store_dn,
        "mhs-or-addresses": mhs_or_addresses,
        "mhs-or-addresses-with-capabilities": mhs_or_addresses_with_capabilities,
        "mhs-supported-attributes": mhs_supported_attributes,
        "mhs-supported-automatic-actions": mhs_supported_automatic_actions,
        "mhs-supported-content-types": mhs_supported_content_types,
        "mhs-supported-matching-rules": mhs_supported_matching_rules,
        "mhs-unacceptable-eits": mhs_unacceptable_eits,
        routingCollectiveName,
        connectionGroupName,
        entryConnectionGroupName,
        transitExitConnectionGroupName,
        localExitConnectionGroupName,
        oRAddressSubtrees,
        mHSMessageTransferAgentName,
        enumeratedFlag,
        connectionType,
        groupMTAPassword,
        memberMTA,
        securityContext,
        mTAName,
        globalDomainIdentifier,
        mTAPassword,
        specificPasswords,
        callingPSAPs,
        routingAdvice,
        expressionMatches,
        nextLevelComplete,
        recipientMDAssignedAlternateRecipient,
        oRAddressElementName,
        mHSCountryName,
        mHSADMDName,
        mHSPRMDName,
        mHSOrganizationName,
        mHSOrganizationalUnitName,
        mHSCommonNameAttribute,
        mHSSurnameAttribute,
        mHSGivenNameAttribute,
        mHSInitialsAttribute,
        mHSGenerationQualifierAttribute,
        mHSNetworkAddressAttribute,
        mHSExtendedNetworkAddressAttribute,
        mHSTerminalIdentifierAttribute,
        mHSTerminalTypeAttribute,
        mHSNumericUserIdentifierAttribute,
        mHSPDSNameAttribute,
        mHSPostalCodeAttribute,
        "edi-name": edi_name,
        "edi-routing-address": edi_routing_address,
        "edi-capabilities": edi_capabilities,
        actions,
        additionalInformation,
        andAttributeIds,
        asn1ModuleContents,
        asn1Version,
        attributeGroups,
        attributes,
        behaviour,
        characterizedBy,
        conditionalPackages,
        context,
        create,
        definedAs,
        "delete": delete_,
        derivedFrom,
        derivedOrWithSyntaxChoice,
        x700description,
        documentName,
        documentObjectIdentifier,
        fixed,
        groupElements,
        informationStatus,
        matchesFor,
        modeConfirmed,
        moduleReference,
        namedBySuperiorObjectClass,
        nameForm,
        notifications,
        optionallyRegisteredAs,
        parameters,
        registeredAs,
        specification,
        subordinateObjectClass,
        syntaxOrAttribute,
        templateDefinition,
        templateName,
        withAttribute,
        withInformationSyntax,
        withReplySyntax,
        mappedRelationshipClass,
        operationsMapping,
        qualifiedBy,
        relationshipObject,
        roleMappingSpecificationSet,
        roleSpecifier,
        supports,
        supportedCmipProfiles,
        supportedCmipVersion,
        supportedCmisFunctionalUnits,
        supportedSmaseFunctionalUnits,
        supportsMKMglobalNames,
        tCGPlatformSpecification,
        tCGCredentialType,
        platformManufacturerStr,
        platformModel,
        platformVersion,
        platformSerial,
        platformManufacturerId,
        tBBSecurityAssertions,
        platformConfiguration,
        platformConfigUri,
        pKCS7PDU,
        userPKCS12,
        pKCS15Token,
        encryptedPrivateKeyInfo,
        emailAddress,
        unstructuredName,
        unstructuredAddress,
        dateOfBirth,
        placeOfBirth,
        gender,
        countryOfCitizenship,
        countryOfResidence,
        // pseudonym,
        contentType,
        messageDigest,
        signingTime,
        randomNonce,
        counterSignature,
        challengePassword,
        extensionRequest,
        extendedCertificateAttributes,
        friendlyName,
        localKeyId,
        signingDescription,
        smimeCapabilities,

        // IANA LDAP Parity Schema
        // "ads-allowAnonymousAccess": ads_allowAnonymousAccess,
        // "ads-authenticatorClass": ads_authenticatorClass,
        // "ads-authenticatorId": ads_authenticatorId,
        // "ads-baseDn": ads_baseDn,
        // "ads-certificatePassword": ads_certificatePassword,
        // "ads-changeLogExposed": ads_changeLogExposed,
        // "ads-changeLogId": ads_changeLogId,
        // "ads-chgPwdPolicyCategoryCount": ads_chgPwdPolicyCategoryCount,
        // "ads-chgPwdPolicyPasswordLength": ads_chgPwdPolicyPasswordLength,
        // "ads-chgPwdPolicyTokenSize": ads_chgPwdPolicyTokenSize,
        // "ads-chgPwdServicePrincipal": ads_chgPwdServicePrincipal,
        // "ads-confidentialityRequired": ads_confidentialityRequired,
        // "ads-contextEntry": ads_contextEntry,
        // "ads-delegateHost": ads_delegateHost,
        // "ads-delegatePort": ads_delegatePort,
        // "ads-delegateSsl": ads_delegateSsl,
        // "ads-delegateSslTrustManager": ads_delegateSslTrustManager,
        // "ads-delegateTls": ads_delegateTls,
        // "ads-delegateTlsTrustManager": ads_delegateTlsTrustManager,
        // "ads-directoryServiceId": ads_directoryServiceId,
        // "ads-dsAccessControlEnabled": ads_dsAccessControlEnabled,
        // "ads-dsAllowAnonymousAccess": ads_dsAllowAnonymousAccess,
        // "ads-dsDenormalizeOpAttrsEnabled": ads_dsDenormalizeOpAttrsEnabled,
        // "ads-dsPasswordHidden": ads_dsPasswordHidden,
        // "ads-dsReplicaId": ads_dsReplicaId,
        // "ads-dsSyncPeriodMillis": ads_dsSyncPeriodMillis,
        // "ads-dsTestEntries": ads_dsTestEntries,
        // "ads-enabled": ads_enabled,
        // "ads-enabledCiphers": ads_enabledCiphers,
        // "ads-enabledProtocols": ads_enabledProtocols,
        // "ads-extendedOpHandlerClass": ads_extendedOpHandlerClass,
        // "ads-extendedOpId": ads_extendedOpId,
        // "ads-hashAlgorithm": ads_hashAlgorithm,
        // "ads-hashAttribute": ads_hashAttribute,
        // "ads-httpAppCtxPath": ads_httpAppCtxPath,
        // "ads-httpConfFile": ads_httpConfFile,
        // "ads-httpWarFile": ads_httpWarFile,
        // "ads-Id": ads_Id,
        // "ads-indexAttributeId": ads_indexAttributeId,
        // "ads-indexCacheSize": ads_indexCacheSize,
        // "ads-indexFileName": ads_indexFileName,
        // "ads-indexHasReverse": ads_indexHasReverse,
        // "ads-indexNumDupLimit": ads_indexNumDupLimit,
        // "ads-indexWorkingDir": ads_indexWorkingDir,
        // "ads-interceptorClassName": ads_interceptorClassName,
        // "ads-interceptorId": ads_interceptorId,
        // "ads-interceptorOrder": ads_interceptorOrder,
        // "ads-jdbmPartitionOptimizerEnabled": ads_jdbmPartitionOptimizerEnabled,
        // "ads-journalFileName": ads_journalFileName,
        // "ads-journalId": ads_journalId,
        // "ads-journalRotation": ads_journalRotation,
        // "ads-journalWorkingDir": ads_journalWorkingDir,
        // "ads-keystoreFile": ads_keystoreFile,
        // "ads-krbAllowableClockSkew": ads_krbAllowableClockSkew,
        // "ads-krbBodyChecksumVerified": ads_krbBodyChecksumVerified,
        // "ads-krbEmptyAddressesAllowed": ads_krbEmptyAddressesAllowed,
        // "ads-krbEncryptionTypes": ads_krbEncryptionTypes,
        // "ads-krbForwardableAllowed": ads_krbForwardableAllowed,
        // "ads-krbKdcPrincipal": ads_krbKdcPrincipal,
        // "ads-krbMaximumRenewableLifetime": ads_krbMaximumRenewableLifetime,
        // "ads-krbMaximumTicketLifetime": ads_krbMaximumTicketLifetime,
        // "ads-krbPaEncTimestampRequired": ads_krbPaEncTimestampRequired,
        // "ads-krbPostdatedAllowed": ads_krbPostdatedAllowed,
        // "ads-krbPrimaryRealm": ads_krbPrimaryRealm,
        // "ads-krbProxiableAllowed": ads_krbProxiableAllowed,
        // "ads-krbRenewableAllowed": ads_krbRenewableAllowed,
        // "ads-maxPDUSize": ads_maxPDUSize,
        // "ads-maxSizeLimit": ads_maxSizeLimit,
        // "ads-maxTimeLimit": ads_maxTimeLimit,
        // "ads-needClientAuth": ads_needClientAuth,
        // "ads-ntlmMechProvider": ads_ntlmMechProvider,
        // "ads-partitionCacheSize": ads_partitionCacheSize,
        // "ads-partitionId": ads_partitionId,
        // "ads-partitionSuffix": ads_partitionSuffix,
        // "ads-partitionSyncOnWrite": ads_partitionSyncOnWrite,
        // "ads-pwdAllowUserChange": ads_pwdAllowUserChange,
        // "ads-pwdAttribute": ads_pwdAttribute,
        // "ads-pwdCheckQuality": ads_pwdCheckQuality,
        // "ads-pwdExpireWarning": ads_pwdExpireWarning,
        // "ads-pwdFailureCountInterval": ads_pwdFailureCountInterval,
        // "ads-pwdGraceAuthNLimit": ads_pwdGraceAuthNLimit,
        // "ads-pwdGraceExpire": ads_pwdGraceExpire,
        // "ads-pwdId": ads_pwdId,
        // "ads-pwdInHistory": ads_pwdInHistory,
        // "ads-pwdLockout": ads_pwdLockout,
        // "ads-pwdLockoutDuration": ads_pwdLockoutDuration,
        // "ads-pwdMaxAge": ads_pwdMaxAge,
        // "ads-pwdMaxDelay": ads_pwdMaxDelay,
        // "ads-pwdMaxFailure": ads_pwdMaxFailure,
        // "ads-pwdMaxIdle": ads_pwdMaxIdle,
        // "ads-pwdMaxLength": ads_pwdMaxLength,
        // "ads-pwdMinAge": ads_pwdMinAge,
        // "ads-pwdMinDelay": ads_pwdMinDelay,
        // "ads-pwdMinLength": ads_pwdMinLength,
        // "ads-pwdMustChange": ads_pwdMustChange,
        // "ads-pwdSafeModify": ads_pwdSafeModify,
        // "ads-pwdValidator": ads_pwdValidator,
        // "ads-replAttributes": ads_replAttributes,
        // "ads-replConsumerId": ads_replConsumerId,
        // "ads-replConsumerImpl": ads_replConsumerImpl,
        // "ads-replCookie": ads_replCookie,
        // "ads-replEnabled": ads_replEnabled,
        // "ads-replLogMaxIdle": ads_replLogMaxIdle,
        // "ads-replLogPurgeThresholdCount": ads_replLogPurgeThresholdCount,
        // "ads-replPingerSleep": ads_replPingerSleep,
        // "ads-replProvHostName": ads_replProvHostName,
        // "ads-replProvPort": ads_replProvPort,
        // "ads-replRefreshInterval": ads_replRefreshInterval,
        // "ads-replRefreshNPersist": ads_replRefreshNPersist,
        // "ads-replReqHandler": ads_replReqHandler,
        // "ads-replSearchFilter": ads_replSearchFilter,
        // "ads-replSearchSizeLimit": ads_replSearchSizeLimit,
        // "ads-replSearchTimeOut": ads_replSearchTimeOut,
        // "ads-replStrictCertValidation": ads_replStrictCertValidation,
        // "ads-replUserDn": ads_replUserDn,
        // "ads-replUserPassword": ads_replUserPassword,
        // "ads-replUseTls": ads_replUseTls,
        // "ads-saslHost": ads_saslHost,
        // "ads-saslMechClassName": ads_saslMechClassName,
        // "ads-saslMechName": ads_saslMechName,
        // "ads-saslPrincipal": ads_saslPrincipal,
        // "ads-saslRealms": ads_saslRealms,
        // "ads-searchBaseDN": ads_searchBaseDN,
        // "ads-serverId": ads_serverId,
        // "ads-systemPort": ads_systemPort,
        // "ads-transportAddress": ads_transportAddress,
        // "ads-transportBacklog": ads_transportBacklog,
        // "ads-transportEnableSSL": ads_transportEnableSSL,
        // "ads-transportId": ads_transportId,
        // "ads-transportNbThreads": ads_transportNbThreads,
        // "ads-wantClientAuth": ads_wantClientAuth,
        apacheDnsCharacterString,
        apacheDnsClass,
        apacheDnsDomainName,
        apacheDnsIpAddress,
        apacheDnsMxPreference,
        apacheDnsServicePort,
        apacheDnsServicePriority,
        apacheDnsServiceWeight,
        apacheDnsSoaExpire,
        apacheDnsSoaMinimum,
        apacheDnsSoaMName,
        apacheDnsSoaRefresh,
        apacheDnsSoaRetry,
        apacheDnsSoaRName,
        apacheDnsSoaSerial,
        apacheDnsTtl,
        // authPassword,
        // supportedAuthPasswordSchemes,
        automountInformation,
        corbaIor,
        corbaRepositoryId,
        aRecord,
        associatedDomain,
        associatedName,
        audio,
        buildingName,
        cNAMERecord,
        dITRedirect,
        documentAuthor,
        documentIdentifier,
        documentLocation,
        documentPublisher,
        documentTitle,
        documentVersion,
        favouriteDrink,
        friendlyCountryName,
        homePostalAddress,
        homeTelephoneNumber,
        host,
        info,
        janetMailbox,
        mail,
        mailPreferenceOption,
        manager,
        mDRecord,
        mobileTelephoneNumber,
        mxRecord,
        nSRecord,
        organizationalStatus,
        pagerTelephoneNumber,
        personalTitle,
        roomNumber,
        secretary,
        sOARecord,
        textEncodedORAddress,
        uniqueIdentifier,
        userClass,
        dhcpAddressState,
        dhcpAssignedHostName,
        dhcpAssignedToClient,
        dhcpBootpFlag,
        dhcpClassData,
        dhcpClassesDN,
        dhcpDelayedServiceParameter,
        dhcpDnsStatus,
        dhcpDomainName,
        dhcpErrorLog,
        dhcpExpirationTime,
        dhcpFailOverEndpointState,
        dhcpGroupDN,
        dhcpHashBucketAssignment,
        dhcpHostDN,
        dhcpHWAddress,
        dhcpImplementation,
        dhcpLastTransactionTime,
        dhcpLeaseDN,
        dhcpLeasesDN,
        dhcpMaxClientLeadTime,
        dhcpNetMask,
        dhcpOption,
        dhcpOptionsDN,
        dhcpPermitList,
        dhcpPoolDN,
        dhcpPrimaryDN,
        dhcpRange,
        dhcpRelayAgentInfo,
        dhcpRequestedHostName,
        dhcpReservedForClient,
        dhcpSecondaryDN,
        dhcpServiceDN,
        dhcpSharedNetworkDN,
        dhcpStartTimeOfState,
        dhcpStatements,
        dhcpSubclassesDN,
        dhcpSubnetDN,
        dhcpVersion,
        numSubordinates,
        changeNumber,
        changes,
        changeTime,
        changeType,
        deleteOldRdn,
        newRdn,
        newSuperior,
        nsUniqueId,
        targetDn,
        targetUniqueId,
        attributeMap,
        authenticationMethod,
        bindTimeLimit,
        credentialLevel,
        defaultSearchBase,
        defaultSearchScope,
        defaultServerList,
        dereferenceAliases,
        followReferrals,
        objectclassMap,
        preferredServerList,
        profileTTL,
        searchTimeLimit,
        serviceAuthenticationMethod,
        serviceCredentialLevel,
        serviceSearchDescriptor,
        dgIdentity,
        memberURL,
        eduPersonAffiliation,
        eduPersonAssurance,
        eduPersonEntitlement,
        eduPersonNickName,
        eduPersonOrcid,
        eduPersonOrgDN,
        eduPersonOrgUnitDN,
        eduPersonPrimaryAffiliation,
        eduPersonPrimaryOrgUnitDN,
        eduPersonPrincipalName,
        eduPersonPrincipalNamePrior,
        eduPersonScopedAffiliation,
        eduPersonTargetedID,
        eduPersonUniqueId,
        fedfsAnnotation,
        fedfsDescr,
        fedfsFslUuid,
        fedfsFsnTTL,
        fedfsFsnUuid,
        fedfsNceDN,
        fedfsNfsClassChange,
        fedfsNfsClassFileid,
        fedfsNfsClassHandle,
        fedfsNfsClassReaddir,
        fedfsNfsClassSimul,
        fedfsNfsClassWritever,
        fedfsNfsCurrency,
        fedfsNfsGenFlagGoing,
        fedfsNfsGenFlagSplit,
        fedfsNfsGenFlagWritable,
        fedfsNfsReadOrder,
        fedfsNfsReadRank,
        fedfsNfsTransFlagRdma,
        fedfsNfsURI,
        fedfsNfsValidFor,
        fedfsNfsVarSub,
        fedfsNfsWriteOrder,
        fedfsNfsWriteRank,
        fedfsUuid,
        mailaccess,
        mailbox,
        maildest,
        maildrop,
        openldapMailRoutingAddress,
        sendmailRoutingAddress,
        transport,
        carLicense,
        departmentNumber,
        displayName,
        employeeNumber,
        employeeType,
        preferredLanguage,
        javaClassName,
        javaClassNames,
        javaCodebase,
        javaDoc,
        javaFactory,
        javaReferenceAddress,
        javaSerializedData,
        krbHostServer,
        krbKdcServers,
        krbLdapServers,
        krbMaxRenewableAge,
        krbMaxTicketLife,
        krbPrincipalExpiration,
        krbPrincipalName,
        krbPrincipalReferences,
        krbPrincipalType,
        krbPwdServers,
        krbRealmReferences,
        krbSearchScope,
        krbTicketFlags,
        krbUPEnabled,
        krb5AccountDisabled,
        krb5AccountExpirationTime,
        krb5AccountLockedOut,
        krb5EncryptionType,
        krb5KDCFlags,
        krb5Key,
        krb5KeyVersionNumber,
        krb5MaxLife,
        krb5MaxRenew,
        krb5PasswordEnd,
        krb5PrincipalName,
        krb5PrincipalRealm,
        krb5RealmName,
        krb5ValidEnd,
        krb5ValidStart,
        // NOTE: The commented out pwd* attribute types are already present in the X.500 specifications.
        pwdAccountLockedTime,
        pwdAllowUserChange,
        // pwdAttribute,
        pwdChangedTime,
        pwdCheckQuality,
        // pwdEndTime,
        pwdExpireWarning,
        pwdFailureCountInterval,
        // pwdFailureTime,
        pwdGraceAuthNLimit,
        pwdGraceExpire,
        pwdGraceUseTime,
        // pwdHistory,
        pwdInHistory,
        // pwdHistory,
        pwdLastSuccess,
        pwdLockout,
        // pwdLockoutDuration,
        // pwdMaxAge,
        pwdMaxDelay,
        pwdMaxFailure,
        pwdMaxIdle,
        pwdMaxLength,
        pwdMinAge,
        pwdMinDelay,
        // pwdMinLength,
        pwdMustChange,
        pwdPolicySubentry,
        pwdReset,
        pwdSafeModify,
        // pwdStartTime,
        // ref,
        gpgFingerprint,
        gpgMailbox,
        gpgSubCertID,
        gpgSubFingerprint,
        pgpBaseKeySpaceDN,
        pgpCertID,
        pgpDisabled,
        pgpKey,
        pgpKeyCreateTime,
        pgpKeyExpireTime,
        pgpKeyID,
        pgpKeySize,
        pgpKeyType,
        pgpRevoked,
        pgpSignerID,
        pgpSoftware,
        pgpSubKeyID,
        pgpUserID,
        pgpVersion,
        mailHost,
        qmailHost,
        sendmailMailHost,
        mailLocalAddress,
        mailRoutingAddress,
        associatedX400Domain,
        associatedInternetGateway,
        associatedORAddress,
        associatedX400Gateway,
        mcgamTables,
        oRAddressComponentType,
        custom1,
        custom2,
        custom3,
        custom4,
        homeurl,
        mozillaHomeCountryName,
        mozillaHomeFriendlyCountryName,
        mozillaHomeLocalityName,
        mozillaHomePostalAddress2,
        mozillaHomePostalCode,
        mozillaHomeState,
        mozillaPostalAddress2,
        mozillaSecondEmail,
        nsAIMid,
        workurl,
        xmozillanickname,
        xmozillausehtmlmail,
        authorizedService,
        bootFile,
        bootParameter,
        gecos,
        gidNumber,
        homeDirectory,
        ipHostNumber,
        ipNetmaskNumber,
        ipNetworkNumber,
        ipProtocolNumber,
        ipServicePort,
        ipServiceProtocol,
        loginShell,
        macAddress,
        memberNisNetgroup,
        memberUid,
        nisMapEntry,
        nisMapName,
        nisNetgroupTriple,
        oncRpcNumber,
        shadowExpire,
        shadowFlag,
        shadowInactive,
        shadowLastChange,
        shadowMax,
        shadowMin,
        shadowWarning,
        uidNumber,
        legalName,
        administratorsAddress,
        // emailAddress,
        // etag,
        fullVendorVersion,
        isMemberOf,
        // configContext,
        // monitorContext,
        superiorUUID,
        // syncreplCookie,
        syncTimestamp,
        labeledURI,
        pamExcludeSuffix,
        pamFallback,
        pamFilter,
        pamIDAttr,
        pamIDMapMethod,
        pamIncludeSuffix,
        pamMissingSuffix,
        pamSecure,
        pamService,
        ftpDownloadBandwidth,
        ftpDownloadRatio,
        ftpGid,
        ftpQuotaFiles,
        ftpQuotaMBytes,
        ftpStatus,
        ftpUid,
        ftpUploadBandwidth,
        ftpUploadRatio,
        accountStatus,
        confirmtext,
        deliveryMode,
        deliveryProgramPath,
        dnmember,
        dnmoderator,
        dnsender,
        filtermember,
        filtersender,
        mailAlternateAddress,
        mailForwardingAddress,
        mailMessageStore,
        mailQuotaCount,
        mailQuotaSize,
        mailReplyText,
        mailSizeMax,
        membersonly,
        moderatortext,
        qladnmanager,
        qlaDomainList,
        qlaMailHostList,
        qlaMailMStorePrefix,
        qlaMailQuotaCount,
        qlaMailQuotaSize,
        qlaMailSizeMax,
        qlaQmailGid,
        qlaQmailUid,
        qlaUidPrefix,
        qmailAccountPurge,
        qmailDotMode,
        qmailGID,
        qmailUID,
        rfc822member,
        rfc822moderator,
        rfc822sender,
        senderconfirm,
        dialupAccess,
        freeradiusDhcpv4Attribute,
        freeradiusDhcpv4GatewayAddr,
        freeradiusDhcpv4GatewayIdentifier,
        freeradiusDhcpv4PoolName,
        freeradiusDhcpv6Attribute,
        freeradiusDhcpv6GatewayAddr,
        freeradiusDhcpv6GatewayIdentifier,
        freeradiusDhcpv6PoolNameNA,
        freeradiusDhcpv6PoolNamePD,
        freeradiusDhcpv6PoolNameTA,
        radiusAcctAuthentic,
        radiusAcctInputOctets,
        radiusAcctInterval,
        radiusAcctOutputOctets,
        radiusAcctSessionId,
        radiusAcctSessionTime,
        radiusAcctStartTime,
        radiusAcctStopTime,
        radiusAcctTerminateCause,
        radiusAcctUniqueId,
        radiusAcctUpdateTime,
        radiusArapFeatures,
        radiusArapSecurity,
        radiusArapZoneAccess,
        radiusAttribute,
        radiusAuthType,
        radiusCallbackId,
        radiusCallbackNumber,
        radiusCalledStationId,
        radiusCallingStationId,
        radiusClass,
        radiusClientComment,
        radiusClientIdentifier,
        radiusClientIPAddress,
        radiusClientRequireMa,
        radiusClientSecret,
        radiusClientShortname,
        radiusClientType,
        radiusClientVirtualServer,
        radiusConnectInfoStart,
        radiusConnectInfoStop,
        radiusControlAttribute,
        radiusExpiration,
        radiusFilterId,
        radiusFramedAppleTalkLink,
        radiusFramedAppleTalkNetwork,
        radiusFramedAppleTalkZone,
        radiusFramedCompression,
        radiusFramedIPAddress,
        radiusFramedIPNetmask,
        radiusFramedIPXNetwork,
        radiusFramedMTU,
        radiusFramedProtocol,
        radiusFramedRoute,
        radiusFramedRouting,
        radiusGroupName,
        radiusHint,
        radiusHuntgroupName,
        radiusIdleTimeout,
        radiusLoginIPHost,
        radiusLoginLATGroup,
        radiusLoginLATNode,
        radiusLoginLATPort,
        radiusLoginLATService,
        radiusLoginService,
        radiusLoginTCPPort,
        radiusLoginTime,
        radiusNASIdentifier,
        radiusNASIpAddress,
        radiusNASPort,
        radiusNASPortId,
        radiusNASPortType,
        radiusPasswordRetry,
        radiusPortLimit,
        radiusProfileDN,
        radiusPrompt,
        radiusProxyToRealm,
        radiusRealm,
        radiusReplicateToRealm,
        radiusReplyAttribute,
        radiusReplyMessage,
        radiusRequestAttribute,
        radiusServiceType,
        radiusSessionTimeout,
        radiusSimultaneousUse,
        radiusStripUserName,
        radiusTerminationAction,
        radiusTunnelAssignmentId,
        radiusTunnelClientEndpoint,
        radiusTunnelMediumType,
        radiusTunnelPassword,
        radiusTunnelPreference,
        radiusTunnelPrivateGroupId,
        radiusTunnelServerEndpoint,
        radiusTunnelType,
        radiusUserCategory,
        radiusUserName,
        radiusVSA,
        automountKey,
        automountMapName,
        nisDomain,
        nisPublicKey,
        nisSecretKey,
        dynamicSubtrees,
        entryTtl: {
            ...entryTtl,
            "&no-user-modification": false, // I believe it was in error that this was defined as NUM in the first place.
        },
        calCalAdrURI,
        calCalURI,
        calCAPURI,
        calFBURL,
        calOtherCalAdrURIs,
        calOtherCalURIs,
        calOtherCAPURIs,
        calOtherFBURLs,
        "service-advert-attribute-authenticator": service_advert_attribute_authenticator,
        "service-advert-scopes": service_advert_scopes,
        "service-advert-service-type": service_advert_service_type,
        "service-advert-url-authenticator": service_advert_url_authenticator,
        "template-major-version-number": template_major_version_number,
        "template-minor-version-number": template_minor_version_number,
        "template-url-syntax": template_url_syntax,
        vendorName,
        vendorVersion,
        entryDN,
        ldifLocationURL,
        mailReceipt,
        managedDomains,
        providerCertificate,
        providerCertificateHash,
        providerName,
        providerUnit,
        "printer-aliases": printer_aliases,
        "printer-charge-info-uri": printer_charge_info_uri,
        "printer-charge-info": printer_charge_info,
        "printer-charset-configured": printer_charset_configured,
        "printer-charset-supported": printer_charset_supported,
        "printer-color-supported": printer_color_supported,
        "printer-compression-supported": printer_compression_supported,
        "printer-copies-supported": printer_copies_supported,
        "printer-current-operator": printer_current_operator,
        "printer-delivery-orientation-supported": printer_delivery_orientation_supported,
        "printer-device-id": printer_device_id,
        "printer-device-service-count": printer_device_service_count,
        "printer-document-format-supported": printer_document_format_supported,
        "printer-finishings-supported": printer_finishings_supported,
        "printer-generated-natural-language-supported": printer_generated_natural_language_supported,
        "printer-geo-location": printer_geo_location,
        "printer-info": printer_info,
        "printer-ipp-features-supported": printer_ipp_features_supported,
        "printer-ipp-versions-supported": printer_ipp_versions_supported,
        "printer-job-k-octets-supported": printer_job_k_octets_supported,
        "printer-job-priority-supported": printer_job_priority_supported,
        "printer-location": printer_location,
        "printer-make-and-model": printer_make_and_model,
        "printer-media-local-supported": printer_media_local_supported,
        "printer-media-supported": printer_media_supported,
        "printer-more-info": printer_more_info,
        "printer-multiple-document-jobs-supported": printer_multiple_document_jobs_supported,
        "printer-name": printer_name,
        "printer-natural-language-configured": printer_natural_language_configured,
        "printer-number-up-supported": printer_number_up_supported,
        "printer-output-features-supported": printer_output_features_supported,
        "printer-pages-per-minute-color": printer_pages_per_minute_color,
        "printer-pages-per-minute": printer_pages_per_minute,
        "printer-print-quality-supported": printer_print_quality_supported,
        "printer-resolution-supported": printer_resolution_supported,
        "printer-service-person": printer_service_person,
        "printer-sides-supported": printer_sides_supported,
        "printer-stacking-order-supported": printer_stacking_order_supported,
        "printer-uri": printer_uri,
        "printer-uuid": printer_uuid,
        "printer-xri-supported": printer_xri_supported,
        sabayonProfileName,
        sabayonProfileURL,
        acctFlags,
        domain,
        homeDrive,
        kickoffTime,
        lmPassword,
        logoffTime,
        logonTime,
        ntPassword,
        primaryGroupID,
        profilePath,
        pwdCanChange,
        pwdLastSet,
        // pwdMustChange,
        rid,
        scriptPath,
        smbHome,
        userWorkstations,
        sambaAcctFlags,
        sambaAlgorithmicRidBase,
        sambaBadPasswordCount,
        sambaBadPasswordTime,
        sambaBoolOption,
        sambaDomainName,
        sambaForceLogoff,
        sambaGroupType,
        sambaHomeDrive,
        sambaHomePath,
        sambaIntegerOption,
        sambaKickoffTime,
        sambaLMPassword,
        sambaLockoutDuration,
        sambaLockoutObservationWindow,
        sambaLockoutThreshold,
        sambaLogoffTime,
        sambaLogonHours,
        sambaLogonScript,
        sambaLogonTime,
        sambaLogonToChgPwd,
        sambaMaxPwdAge,
        sambaMinPwdAge,
        sambaMinPwdLength,
        sambaMungedDial,
        sambaNextGroupRid,
        sambaNextRid,
        sambaNextUserRid,
        sambaNTPassword,
        sambaOptionName,
        sambaPasswordHistory,
        sambaPrimaryGroupSID,
        sambaPrivilegeList,
        sambaPrivName,
        sambaProfilePath,
        sambaPwdCanChange,
        sambaPwdHistoryLength,
        sambaPwdLastSet,
        sambaPwdMustChange,
        sambaRefuseMachinePwdChange,
        sambaShareName,
        sambaSID,
        sambaSIDList,
        sambaStringListOption,
        sambaStringOption,
        sambaTrustFlags,
        sambaUserWorkstations,
        // mailHost,
        // mailLocalAddress,
        // mailRoutingAddress,
        sudoCommand,
        sudoHost,
        sudoNotAfter,
        sudoNotBefore,
        sudoOption,
        sudoOrder,
        sudoRunAs,
        sudoRunAsGroup,
        sudoRunAsUser,
        sudoUser,
        distinguishedNameTableKey,
        textTableKey,
        textTableValue,
        uddiAccessPoint,
        uddiAddressLine,
        uddiAuthorizedName,
        uddiBindingKey,
        uddiBusinessKey,
        uddiCategoryBag,
        uddiDescription,
        uddiDiscoveryURLs,
        uddiEMail,
        uddiFromKey,
        uddiHostingRedirector,
        uddiIdentifierBag,
        uddiInstanceDescription,
        uddiInstanceParms,
        uddiIsHidden,
        uddiIsProjection,
        uddiKeyedReference,
        uddiLang,
        uddiName,
        uddiOperator,
        uddiOverviewDescription,
        uddiOverviewURL,
        uddiPersonName,
        uddiPhone,
        uddiServiceKey,
        uddiSortCode,
        uddiTModelKey,
        uddiToKey,
        uddiUseType,
        uddiUUID,
        uddiv3BindingKey,
        uddiv3BriefResponse,
        uddiv3BusinessKey,
        uddiv3DigitalSignature,
        uddiv3EntityCreationTime,
        uddiv3EntityDeletionTime,
        uddiv3EntityKey,
        uddiv3EntityModificationTime,
        uddiv3ExpiresAfter,
        uddiv3MaxEntities,
        uddiv3NodeId,
        uddiv3NotificationInterval,
        uddiv3ServiceKey,
        uddiv3SubscriptionFilter,
        uddiv3SubscriptionKey,
        uddiv3TModelKey,
        // entryUUID,
        vPIMExtendedAbsenceStatus,
        vPIMMaxMessageSize,
        vPIMRfc822Mailbox,
        vPIMSpokenName,
        vPIMSubMailboxes,
        vPIMSupportedAudioMediaTypes,
        vPIMSupportedMessageContext,
        vPIMSupportedUABehaviors,
        vPIMTelephoneNumber,
        vPIMTextName,

        // CMS Attribute Types
        "contentLocation": aa_contentLocation,
        "contentLocations": aa_contentLocations,
        "parentBlock": aa_parentBlock,
        "precedingBlock": aa_precedingBlock,
        "sidechains": aa_sidechains,
        "signerInfo": aa_signerInfo,
        "signerInfos": aa_signerInfos,
        "timeStamped": aa_timeStamped,
        signcryptedEnvelope,
        // "contentType": aa_contentType,
        "countersignature": aa_countersignature,
        // "messageDigest": aa_messageDigest,
        // "signingTime": aa_signingTime,
        "encrypKeyPref": aa_encrypKeyPref,
        // "smimeCapabilities": aa_smimeCapabilities,
        tokenizedParts,

        // Other ITU and IETF X.500 Attribute Types
        cEKReference,
        cEKMaxDecrypts,
        kEKDerivationAlg,
        accessService,
        // dateOfBirth,
        // placeOfBirth,
        // gender,
        // countryOfCitizenship,
        // countryOfResidence,
        deviceOwner,
        clearanceSponsor,
        binarySigningTime,
        // tokenizedParts,
        authenticationInfo,
        accesIdentity,
        chargingIdentity,
        group,
        clearance_RFC3281,
        encAttrs,
        // smimeCapabilities,
        // signerInfo,
        // signerInfos,
        // contentLocation,
        // contentLocations,
        // precedingBlock,
        // timeStamped,
        // sidechains,
        // parentBlock,
        // signcryptedEnvelope,
        // encrypKeyPref,
        firmwarePackageID,
        targetHardwareIDs,
        decryptKeyID,
        implCryptoAlgs,
        implCompressAlgs,
        communityIdentifiers,
        firmwarePackageInfo,
        wrappedFirmwareKey,
        // contentType,
        // messageDigest,
        // signingTime,
        // countersignature,
        "extension-req": extension_req,
        unsignedData,
        multipleSignatures,
        wlanSSID,

        // H.323 Attribute Types
        commUniqueId,
        commOwner,
        commPrivate,
        commURI,
        h323IdentityGKDomain,
        "h323Identityh323-ID": h323Identityh323_ID,
        h323IdentitydialedDigits,
        "h323Identityemail-ID": h323Identityemail_ID,
        "h323IdentityURL-ID": h323IdentityURL_ID,
        h323IdentitytransportID,
        h323IdentitypartyNumber,
        h323IdentitymobileUIM,
        h323IdentityEndpointType,
        h323IdentityServiceLevel,
        h235IdentityEndpointID,
        h235IdentityPassword,
        h320IdentityCC,
        h320IdentityNDC,
        h320IdentitySN,
        h320IdentityServiceLevel,
        h320IdentityExtension,
        sIPIdentitySIPURI,
        sIPIdentityRegistrarAddress,
        sIPIdentityProxyAddress,
        sIPIdentityAddress,
        sIPIdentityPassword,
        sIPIdentityUserName,
        sIPIdentityServiceLevel,
        genericIdentityProtocolIdentifier,
        genericIdentityMessage,
        callPreferenceURI,
        userSMIMECertificate,

        // ERS Attribute Types
        "aa-er-External": aa_er_External,
        "aa-er-Internal": aa_er_Internal,

        // ESS Attribute Types
        receiptRequest: aa_receiptRequest,
        contentIdentifier: aa_contentIdentifier,
        contentHint: aa_contentHint,
        msgSigDigest: aa_msgSigDigest,
        contentReference: aa_contentReference,
        securityLabel: aa_securityLabel,
        equivalentLabels: aa_equivalentLabels,
        mlExpandHistory: aa_mlExpandHistory,
        signingCertificate: aa_signingCertificate,
        signingCertificateV2: aa_signingCertificateV2,

        // UPT Attribute Types
        providerId,
        providedServiceId,
        providedLocations,
        pui,
        specialPassword,
        variablePassword,
        nbOfFailedAuthentications,
        userCredit,
        callInfoRecords,
        activeChargingService,
        allowedServiceFeatures,
        uptNumber,
        defaultChargingReference,
        icRegistrationAddress,
        allowedRegistrationAddress,
        allowedDestinations,
        supplServId,
        supplServiceStatus,
        forwardedToNumber,
        typesOfNotification,
        noReplyConditionTimer,

        // Intelligent Networks Attribute Types
        methodUse,
        securityFacilityId,
        secretKey,
        identifierList,
        bindLevelIfOK,
        lockSession,
        failureCounter,
        maxAttempts,
        currentList,
        stockId,
        source,
        sizeOfRestocking,
        stock,

        // CRMF Attribute Types
        regCtrl_regToken,
        regCtrl_authenticator,
        regCtrl_pkiPublicationInfo,
        regCtrl_pkiArchiveOptions,
        regCtrl_oldCertID,
        regCtrl_protocolEncrKey,
        regInfo_utf8Pairs,
        regInfo_certReq,

        // Telebiometrics Authentication Infrastructure (TAI) Attribute Types
        biometricInformationTemplate,
        bioSecLevelReference,
        bDCReportContentInformation,

        // Printer Service Offer Attribute Types
        // printerType,
        // locationRoom,
        // locationBuilding,
        // costPerPage,
        // languagesSupported,
        // pagesPerMinute,
        // pageSize,
        // dotsPerInch,
        // colourCapable,
        // driverName,
        // queueLength,

        // Trader Definitions Attribute Types
        traderInterface,
        dsaName,
        typeRepos,
        defSearchCard,
        maxSearchCard,
        defMatchCard,
        maxMatchCard,
        defReturnCard,
        maxReturnCard,
        defHopCount,
        maxHopCount,
        defFollowPolicy,
        maxFollowPolicy,
        maxLinkFollowPolicy,
        supportsModifiableProperties,
        supportsDynamicProperties,
        supportsProxyOffers,
        maxList,
        requestIdStem,
        typeManagementConstraint,
        searchConstraint,
        offerAcceptanceConstraint,
        sOfferId,
        serviceInterfaceId,
        serviceTypeId,
        hasDynamicProperties,
        hasModifiableProperties,
        dynamicProps,
        linkName,
        linkId,
        targetTraderInterfaceId,
        defPassOnFollowRule,
        limitingFollowRule,
        proxyOfferId,
        proxyLookUpInterfaceId,
        constraintRecipe,
        ifMatchAll,
        interfaceReference,
        interfaceType,
        ...schemaLevelIIAttributes,
    })
        .map(([ name, spec ]) => attributeFromInformationObject(spec, name))
        .forEach((attr) => {
            ctx.attributeTypes.set(attr.id.toString(), attr);
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributeTypes.set(ldapName.trim(), attr);
                ctx.attributeTypes.set(ldapName.trim().toLowerCase(), attr);
                if (!attr.ldapSyntax) {
                    return;
                }
                const oidSyntax = ctx.ldapSyntaxes.get(attr.ldapSyntax.toString());
                if (!oidSyntax) {
                    return;
                }
                ctx.ldapSyntaxes.set(ldapName, oidSyntax);
            });
        });

    const storedTypes = await ctx.db.attributeTypeDescription.findMany({
        where: {
            entry_id: null,
        },
    });
    for (const storedType of storedTypes) {
        if (
            // Only attributes with a defined syntax may be loaded
            !storedType.attributeSyntax
            // Only user-modifiable attributes may be loaded
            || !storedType.userModifiable
            // Only userApplications attributes may be loaded
            || (storedType.application !== AttributeUsage.USER_APPLICATIONS)
            // If the attribute is already present, ignore.
            || ctx.attributeTypes.has(storedType.identifier)
        ) {
            continue;
        }
        const [ ldapSyntax, validator ] = asn1SyntaxInfo[storedType.attributeSyntax ?? ""] ?? [ undefined, undefined ];
        ctx.attributeTypes.set(storedType.identifier, {
            id: ObjectIdentifier.fromString(storedType.identifier),
            name: storedType.ldapNames?.split("|"),
            parent: storedType.derivation
                ? ObjectIdentifier.fromString(storedType.identifier)
                : undefined,
            equalityMatchingRule: storedType.equalityMatch
                ? ObjectIdentifier.fromString(storedType.equalityMatch)
                : undefined,
            orderingMatchingRule: storedType.orderingMatch
                ? ObjectIdentifier.fromString(storedType.orderingMatch)
                : undefined,
            substringsMatchingRule: storedType.substringsMatch
                ? ObjectIdentifier.fromString(storedType.substringsMatch)
                : undefined,
            singleValued: !(storedType.multiValued ?? true),
            collective: storedType.collective ?? false,
            dummy: storedType.dummy,
            noUserModification: !(storedType.userModifiable ?? true),
            obsolete: storedType.obsolete ?? false,
            usage: AttributeUsage_userApplications,
            ldapSyntax,
            ldapNames: storedType.ldapNames?.split("|"),
            description: storedType.description ?? undefined,
            compatibleMatchingRules: new Set(),
            validator,
        });
    }

    Array.from(ctx.attributeTypes.values())
        .filter((attr) => attr.collective)
        .forEach((attr) => {
            ctx.collectiveAttributes.add(attr.id.toString());
        });

    ctx.attributeTypes.set(entryUUID.id.toString(), entryUUID);
    ctx.attributeTypes.set("entryUUID", entryUUID);
    ctx.matchingRulesSuitableForNaming.add(x500mr.bitStringMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.booleanMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseExactIA5Match["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseExactMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseIgnoreIA5Match["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.caseIgnoreMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.dnsNameMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.generalizedTimeMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.integerMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.intEmailMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.jidMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.numericStringMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.objectIdentifierMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.octetStringMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.presentationAddressMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.telephoneNumberMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uniqueMemberMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uriMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uTCTimeMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(x500mr.uUIDPairMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(addressCapabilitiesMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(capabilityMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(circulationMemberMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(circulationMemberElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(circulationMemberSubstringElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(contentCorrelatorMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(contentIdentifierMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(directoryStringApproxMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(distributionCodeMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(ia5StringApproxMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(informationCategoryMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(integerBitAndMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(integerBitOrMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(iPMIdentifierMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(mSSingleSubstringListElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(mSSingleSubstringListMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(mSStringCaseSensitiveMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(mSStringListElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(mSStringListMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(mSStringMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(mTSIdentifierMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRAddressElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRAddressMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRAddressSubstringElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRDescriptorElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRDescriptorMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRDescriptorSingleElementMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRNameElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRNameExactMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRNameMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(oRNameSubstringElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(pkcs9CaseIgnoreMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(policySpecificationMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(recipientSpecifierElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(recipientSpecifierMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(recipientSpecifierSubstringElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(redirectionOrDLExpansionElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(redirectionOrDLExpansionMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(redirectionOrDLExpansionSubstringElementsMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(signingTimeMatch["&id"].toString());
    ctx.matchingRulesSuitableForNaming.add(uuidMatch["&id"].toString());
    ctx.attributeTypes.get(x500at.accessControlSubentryList["&id"].toString())!.driver = accessControlSubentryListDriver;
    ctx.attributeTypes.get(x500at.aliasedEntryName["&id"].toString())!.driver = aliasedEntryNameDriver;
    ctx.attributeTypes.get(administratorsAddress["&id"].toString())!.driver = administratorsAddressDriver;
    ctx.attributeTypes.get(x500at.altServer["&id"].toString())!.driver = altServerDriver;
    ctx.attributeTypes.get(x500at.attributeTypes["&id"].toString())!.driver = attributeTypesDriver;
    ctx.attributeTypes.get(x500at.collectiveAttributeSubentryList["&id"].toString())!.driver = collectiveAttributeSubentryListDriver;
    ctx.attributeTypes.get(x500at.consumerKnowledge["&id"].toString())!.driver = consumerKnowledgeDriver;
    ctx.attributeTypes.get(x500at.contextDefaultSubentryList["&id"].toString())!.driver = contextDefaultSubentryListDriver;
    ctx.attributeTypes.get(x500at.contextTypes["&id"].toString())!.driver = contextTypesDriver;
    ctx.attributeTypes.get(x500at.createTimestamp["&id"].toString())!.driver = createTimestampDriver;
    ctx.attributeTypes.get(x500at.creatorsName["&id"].toString())!.driver = creatorsNameDriver;
    ctx.attributeTypes.get(x500at.ditBridgeKnowledge["&id"].toString())!.driver = ditBridgeKnowledgeDriver;
    ctx.attributeTypes.get(x500at.dITContentRules["&id"].toString())!.driver = dITContentRulesDriver;
    ctx.attributeTypes.get(x500at.dITContextUse["&id"].toString())!.driver = dITContextUseDriver;
    ctx.attributeTypes.get(x500at.dITStructureRules["&id"].toString())!.driver = dITStructureRulesDriver;
    ctx.attributeTypes.get(dynamicSubtrees["&id"].toString())!.driver = dynamicSubtreesDriver;
    ctx.attributeTypes.get(x500at.dseType["&id"].toString())!.driver = dseTypeDriver;
    ctx.attributeTypes.get(entryDN["&id"].toString())!.driver = entryDNDriver;
    ctx.attributeTypes.get(entryTtl["&id"].toString())!.driver = entryTtlDriver;
    ctx.attributeTypes.get(entryUUID.id.toString())!.driver = entryUUIDDriver;
    ctx.attributeTypes.get(x500at.family_information["&id"].toString())!.driver = family_informationDriver;
    ctx.attributeTypes.get(fullVendorVersion["&id"].toString())!.driver = fullVendorVersionDriver;
    ctx.attributeTypes.get(x500at.friends["&id"].toString())!.driver = friendsDriver;
    ctx.attributeTypes.get(x500at.governingStructureRule["&id"].toString())!.driver = governingStructureRuleDriver;
    ctx.attributeTypes.get(x500at.hasSubordinates["&id"].toString())!.driver = hasSubordinatesDriver;
    ctx.attributeTypes.get(x500at.hierarchyBelow["&id"].toString())!.driver = hierarchyBelowDriver;
    ctx.attributeTypes.get(x500at.hierarchyLevel["&id"].toString())!.driver = hierarchyLevelDriver;
    ctx.attributeTypes.get(x500at.hierarchyParent["&id"].toString())!.driver = hierarchyParentDriver;
    ctx.attributeTypes.get(x500at.hierarchyTop["&id"].toString())!.driver = hierarchyTopDriver;
    ctx.attributeTypes.get(x500at.ldapSyntaxes["&id"].toString())!.driver = ldapSyntaxesDriver;
    ctx.attributeTypes.get(x500at.matchingRules["&id"].toString())!.driver = matchingRulesDriver;
    ctx.attributeTypes.get(x500at.matchingRuleUse["&id"].toString())!.driver = matchingRuleUseDriver;
    ctx.attributeTypes.get(x500at.modifiersName["&id"].toString())!.driver = modifiersNameDriver;
    ctx.attributeTypes.get(x500at.modifyTimestamp["&id"].toString())!.driver = modifyTimestampDriver;
    ctx.attributeTypes.get(x500at.myAccessPoint["&id"].toString())!.driver = myAccessPointDriver;
    ctx.attributeTypes.get(x500at.nameForms["&id"].toString())!.driver = nameFormsDriver;
    ctx.attributeTypes.get(x500at.namingContexts["&id"].toString())!.driver = namingContextsDriver;
    ctx.attributeTypes.get(x500at.nonSpecificKnowledge["&id"].toString())!.driver = nonSpecificKnowledgeDriver;
    ctx.attributeTypes.get(numSubordinates["&id"].toString())!.driver = numSubordinatesDriver;
    ctx.attributeTypes.get(x500at.objectClass["&id"].toString())!.driver = objectClassDriver;
    ctx.attributeTypes.get(x500at.objectClasses["&id"].toString())!.driver = objectClassesDriver;
    ctx.attributeTypes.get(x500at.pwdAdminSubentryList["&id"].toString())!.driver = pwdAdminSubentryListDriver;
    ctx.attributeTypes.get(x500at.pwdFailureDuration["&id"].toString())!.driver = pwdFailureDurationDriver;
    ctx.attributeTypes.get(x500at.secondaryShadows["&id"].toString())!.driver = secondaryShadowsDriver;
    ctx.attributeTypes.get(x500at.serviceAdminSubentryList["&id"].toString())!.driver = serviceAdminSubentryListDriver;
    ctx.attributeTypes.get(x500at.specificKnowledge["&id"].toString())!.driver = specificKnowledgeDriver;
    ctx.attributeTypes.get(x500at.structuralObjectClass["&id"].toString())!.driver = structuralObjectClassDriver;
    ctx.attributeTypes.get(x500at.subschemaSubentryList["&id"].toString())!.driver = subschemaSubentryListDriver;
    ctx.attributeTypes.get(x500at.superiorKnowledge["&id"].toString())!.driver = superiorKnowledgeDriver;
    ctx.attributeTypes.get(superiorUUID["&id"].toString())!.driver = superiorUUIDDriver;
    ctx.attributeTypes.get(x500at.supplierKnowledge["&id"].toString())!.driver = supplierKnowledgeDriver;
    ctx.attributeTypes.get(x500at.supportedControl["&id"].toString())!.driver = supportedControlDriver;
    ctx.attributeTypes.get(x500at.supportedExtension["&id"].toString())!.driver = supportedExtensionDriver;
    ctx.attributeTypes.get(x500at.supportedFeatures["&id"].toString())!.driver = supportedFeaturesDriver;
    ctx.attributeTypes.get(x500at.supportedLDAPVersion["&id"].toString())!.driver = supportedLDAPVersionDriver;
    ctx.attributeTypes.get(x500at.supportedSASLMechanisms["&id"].toString())!.driver = supportedSASLMechanismsDriver;
    ctx.attributeTypes.get(syncTimestamp["&id"].toString())!.driver = syncTimestampDriver;
    ctx.attributeTypes.get(x500at.userPassword["&id"].toString())!.driver = userPasswordDriver;
    ctx.attributeTypes.get(x500at.userPwd["&id"].toString())!.driver = userPwdDriver;
    ctx.attributeTypes.get(userPwdHistory["&id"].toString())!.driver = userPwdHistoryDriver;
    // ctx.attributeTypes.get(userPwdRecentlyExpired["&id"].toString())!.driver = userPwdRecentlyExpiredDriver;
    ctx.attributeTypes.get(vendorName["&id"].toString())!.driver = vendorNameDriver;
    ctx.attributeTypes.get(vendorVersion["&id"].toString())!.driver = vendorVersionDriver;
}

export default loadAttributeTypes;
