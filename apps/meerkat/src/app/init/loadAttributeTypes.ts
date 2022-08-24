import type { Context } from "@wildboar/meerkat-types";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import * as x500mr from "@wildboar/x500/src/lib/collections/matchingRules";
import attributeFromInformationObject from "./attributeFromInformationObject";
import { AttributeUsage } from "@prisma/client";
import entryUUID from "../schema/attributes/entryUUID";
import { userPwdHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
import asn1SyntaxInfo from "../x500/asn1SyntaxToInfo";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { ObjectIdentifier } from "asn1-ts";
// TODO: Apparently, I forgot to add these to `x500at`... whoops.
import { uid } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import { dc } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dc.oa";

// Drivers
import accessControlSchemeDriver from "../database/drivers/accessControlScheme";
import accessControlSubentryListDriver from "../database/drivers/accessControlSubentryList";
import administrativeRoleDriver from "../database/drivers/administrativeRole";
import administratorsAddressDriver from "../database/drivers/administratorsAddress";
import aliasedEntryNameDriver from "../database/drivers/aliasedEntryName";
import altServerDriver from "../database/drivers/altServer";
import attributeTypesDriver from "../database/drivers/attributeTypes";
import clearanceDriver from "../database/drivers/clearance";
import collectiveAttributeSubentryListDriver from "../database/drivers/collectiveAttributeSubentryList";
import collectiveExclusionsDriver from "../database/drivers/collectiveExclusions";
import consumerKnowledgeDriver from "../database/drivers/consumerKnowledge";
import contextDefaultSubentryListDriver from "../database/drivers/contextDefaultSubentryList";
import contextTypesDriver from "../database/drivers/contextTypes";
import createTimestampDriver from "../database/drivers/createTimestamp";
import creatorsNameDriver from "../database/drivers/creatorsName";
import ditBridgeKnowledgeDriver from "../database/drivers/ditBridgeKnowledge";
import dITContentRulesDriver from "../database/drivers/dITContentRules";
import dITContextUseDriver from "../database/drivers/dITContextUse";
import dITStructureRulesDriver from "../database/drivers/dITStructureRules";
import dseTypeDriver from "../database/drivers/dseType";
import dynamicSubtreesDriver from "../database/drivers/dynamicSubtrees";
import entryACIDriver from "../database/drivers/entryACI";
import entryDNDriver from "../database/drivers/entryDN";
import entryTtlDriver from "../database/drivers/entryTtl";
import entryUUIDDriver from "../database/drivers/entryUUID";
import family_informationDriver from "../database/drivers/family_information";
import fullVendorVersionDriver from "../database/drivers/fullVendorVersion";
import friendsDriver from "../database/drivers/friends";
import governingStructureRuleDriver from "../database/drivers/governingStructureRule";
import hasSubordinatesDriver from "../database/drivers/hasSubordinates";
import hierarchyBelowDriver from "../database/drivers/hierarchyBelow";
import hierarchyLevelDriver from "../database/drivers/hierarchyLevel";
import hierarchyParentDriver from "../database/drivers/hierarchyParent";
import hierarchyTopDriver from "../database/drivers/hierarchyTop";
import ldapSyntaxesDriver from "../database/drivers/ldapSyntaxes";
import matchingRulesDriver from "../database/drivers/matchingRules";
import matchingRuleUseDriver from "../database/drivers/matchingRuleUse";
import modifiersNameDriver from "../database/drivers/modifiersName";
import modifyTimestampDriver from "../database/drivers/modifyTimestamp";
import myAccessPointDriver from "../database/drivers/myAccessPoint";
import nameFormsDriver from "../database/drivers/nameForms";
import namingContextsDriver from "../database/drivers/namingContexts";
import nonSpecificKnowledgeDriver from "../database/drivers/nonSpecificKnowledge";
import objectClassDriver from "../database/drivers/objectClass";
import objectClassesDriver from "../database/drivers/objectClasses";
import prescriptiveACIDriver from "../database/drivers/prescriptiveACI";
import pwdAdminSubentryListDriver from "../database/drivers/pwdAdminSubentryList";
import pwdEncAlgDriver from "../database/drivers/pwdEncAlg";
import pwdFailureDurationDriver from "../database/drivers/pwdFailureDuration";
import searchRulesDriver from "../database/drivers/searchRules";
import secondaryShadowsDriver from "../database/drivers/secondaryShadows";
import serviceAdminSubentryListDriver from "../database/drivers/serviceAdminSubentryList";
import specificKnowledgeDriver from "../database/drivers/specificKnowledge";
import structuralObjectClassDriver from "../database/drivers/structuralObjectClass";
import subentryACIDriver from "../database/drivers/subentryACI";
import subschemaSubentryListDriver from "../database/drivers/subschemaSubentryList";
import subtreeSpecificationDriver from "../database/drivers/subtreeSpecification";
import superiorKnowledgeDriver from "../database/drivers/superiorKnowledge";
import superiorUUIDDriver from "../database/drivers/superiorUUID";
import supplierKnowledgeDriver from "../database/drivers/supplierKnowledge";
import supportedControlDriver from "../database/drivers/supportedControl";
import supportedExtensionDriver from "../database/drivers/supportedExtension";
import supportedFeaturesDriver from "../database/drivers/supportedFeatures";
import supportedLDAPVersionDriver from "../database/drivers/supportedLDAPVersion";
import supportedSASLMechanismsDriver from "../database/drivers/supportedSASLMechanisms";
import syncTimestampDriver from "../database/drivers/syncTimestamp";
import uniqueIdentifierDriver from "../database/drivers/uniqueIdentifier";
import userPasswordDriver from "../database/drivers/userPassword";
import userPwdDriver from "../database/drivers/userPwd";
import userPwdHistoryDriver from "../database/drivers/userPwdHistory";
import vendorNameDriver from "../database/drivers/vendorName";
import vendorVersionDriver from "../database/drivers/vendorVersion";

// X.400 Attribute Types
import {
    mhs_acceptable_eits,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-acceptable-eits.oa";
import {
    mhs_deliverable_classes,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-deliverable-classes.oa";
import {
    mhs_deliverable_content_types,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-deliverable-content-types.oa";
import {
    mhs_dl_archive_service,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-dl-archive-service.oa";
import {
    mhs_dl_members,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-dl-members.oa";
import {
    mhs_dl_policy,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-dl-policy.oa";
import {
    mhs_dl_related_lists,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-dl-related-lists.oa";
import {
    mhs_dl_submit_permissions,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-dl-submit-permissions.oa";
import {
    mhs_dl_subscription_service,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-dl-subscription-service.oa";
import {
    mhs_exclusively_acceptable_eits,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-exclusively-acceptable-eits.oa";
import {
    mhs_maximum_content_length,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-maximum-content-length.oa";
import {
    mhs_message_store_dn,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-message-store-dn.oa";
import {
    mhs_or_addresses,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-or-addresses.oa";
import {
    mhs_or_addresses_with_capabilities,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-or-addresses-with-capabilities.oa";
import {
    mhs_supported_attributes,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-supported-attributes.oa";
import {
    mhs_supported_automatic_actions,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-supported-automatic-actions.oa";
import {
    mhs_supported_content_types,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-supported-content-types.oa";
import {
    mhs_supported_matching_rules,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-supported-matching-rules.oa";
import {
    mhs_unacceptable_eits,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-unacceptable-eits.oa";
import {
    routingCollectiveName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/routingCollectiveName.oa";
import {
    connectionGroupName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/connectionGroupName.oa";
import {
    entryConnectionGroupName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/entryConnectionGroupName.oa";
import {
    transitExitConnectionGroupName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/transitExitConnectionGroupName.oa";
import {
    localExitConnectionGroupName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/localExitConnectionGroupName.oa";
import {
    oRAddressSubtrees,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/oRAddressSubtrees.oa";
import {
    mHSMessageTransferAgentName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/mHSMessageTransferAgentName.oa";
import {
    enumeratedFlag,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/enumeratedFlag.oa";
import {
    connectionType,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/connectionType.oa";
import {
    groupMTAPassword,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/groupMTAPassword.oa";
import {
    memberMTA,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/memberMTA.oa";
import {
    securityContext,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/securityContext.oa";
import {
    mTAName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/mTAName.oa";
import {
    globalDomainIdentifier,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/globalDomainIdentifier.oa";
import {
    mTAPassword,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/mTAPassword.oa";
import {
    specificPasswords,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/specificPasswords.oa";
import {
    callingPSAPs,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/callingPSAPs.oa";
import {
    routingAdvice,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/routingAdvice.oa";
import {
    expressionMatches,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/expressionMatches.oa";
import {
    nextLevelComplete,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/nextLevelComplete.oa";
import {
    recipientMDAssignedAlternateRecipient,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/recipientMDAssignedAlternateRecipient.oa";
import {
    oRAddressElementName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/oRAddressElementName.oa";
import {
    mHSCountryName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCountryName.oa";
import {
    mHSADMDName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSADMDName.oa";
import {
    mHSPRMDName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPRMDName.oa";
import {
    mHSOrganizationName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganizationName.oa";
import {
    mHSOrganizationalUnitName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganizationalUnitName.oa";
import {
    mHSCommonNameAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCommonNameAttribute.oa";
import {
    mHSSurnameAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSSurnameAttribute.oa";
import {
    mHSGivenNameAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGivenNameAttribute.oa";
import {
    mHSInitialsAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSInitialsAttribute.oa";
import {
    mHSGenerationQualifierAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGenerationQualifierAttribute.oa";
import {
    mHSNetworkAddressAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNetworkAddressAttribute.oa";
import {
    mHSExtendedNetworkAddressAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSExtendedNetworkAddressAttribute.oa";
import {
    mHSTerminalIdentifierAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalIdentifierAttribute.oa";
import {
    mHSTerminalTypeAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalTypeAttribute.oa";
import {
    mHSNumericUserIdentifierAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNumericUserIdentifierAttribute.oa";
import {
    mHSPDSNameAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPDSNameAttribute.oa";
import {
    mHSPostalCodeAttribute,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPostalCodeAttribute.oa";
import {
    edi_name,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-name.oa";
import {
    edi_routing_address,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-routing-address.oa";
import {
    edi_capabilities,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-capabilities.oa";

// X.700 Attribute Types
import {
    actions,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/actions.oa";
import {
    additionalInformation,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/additionalInformation.oa";
import {
    andAttributeIds,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/andAttributeIds.oa";
import {
    asn1ModuleContents,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/asn1ModuleContents.oa";
import {
    asn1Version,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/asn1Version.oa";
import {
    attributeGroups,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/attributeGroups.oa";
import {
    attributes,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/attributes.oa";
import {
    behaviour,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/behaviour.oa";
import {
    characterizedBy,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/characterizedBy.oa";
import {
    conditionalPackages,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/conditionalPackages.oa";
import {
    context,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/context.oa";
import {
    create,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/create.oa";
import {
    definedAs,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/definedAs.oa";
import {
    delete_,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/delete.oa";
import {
    derivedFrom,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/derivedFrom.oa";
import {
    derivedOrWithSyntaxChoice,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/derivedOrWithSyntaxChoice.oa";
import {
    description as x700description,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/description.oa";
import {
    documentName,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/documentName.oa";
import {
    documentObjectIdentifier,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/documentObjectIdentifier.oa";
import {
    fixed,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/fixed.oa";
import {
    groupElements,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/groupElements.oa";
import {
    informationStatus,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/informationStatus.oa";
import {
    matchesFor,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/matchesFor.oa";
import {
    modeConfirmed,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/modeConfirmed.oa";
import {
    moduleReference,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/moduleReference.oa";
import {
    namedBySuperiorObjectClass,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/namedBySuperiorObjectClass.oa";
import {
    nameForm,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/nameForm.oa";
import {
    notifications,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/notifications.oa";
import {
    optionallyRegisteredAs,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/optionallyRegisteredAs.oa";
import {
    parameters,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/parameters.oa";
import {
    registeredAs,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/registeredAs.oa";
import {
    specification,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/specification.oa";
import {
    subordinateObjectClass,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/subordinateObjectClass.oa";
import {
    syntaxOrAttribute,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/syntaxOrAttribute.oa";
import {
    templateDefinition,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/templateDefinition.oa";
import {
    templateName,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/templateName.oa";
import {
    withAttribute,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/withAttribute.oa";
import {
    withInformationSyntax,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/withInformationSyntax.oa";
import {
    withReplySyntax,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/withReplySyntax.oa";
import {
    mappedRelationshipClass,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/mappedRelationshipClass.oa";
import {
    operationsMapping,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/operationsMapping.oa";
import {
    qualifiedBy,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/qualifiedBy.oa";
import {
    relationshipObject,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/relationshipObject.oa";
import {
    roleMappingSpecificationSet,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/roleMappingSpecificationSet.oa";
import {
    roleSpecifier,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/roleSpecifier.oa";
import {
    supports,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/supports.oa";
import {
    supportedCmipProfiles,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/supportedCmipProfiles.oa";
import {
    supportedCmipVersion,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/supportedCmipVersion.oa";
import {
    supportedCmisFunctionalUnits,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/supportedCmisFunctionalUnits.oa";
import {
    supportedSmaseFunctionalUnits,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/supportedSmaseFunctionalUnits.oa";
import {
    supportsMKMglobalNames,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/supportsMKMglobalNames.oa";

// Platform Certificate Attribute Types
import {
    tCGPlatformSpecification,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/tCGPlatformSpecification.oa";
import {
    tCGCredentialType,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/tCGCredentialType.oa";
import {
    platformManufacturerStr,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/platformManufacturerStr.oa";
import {
    platformModel,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/platformModel.oa";
import {
    platformVersion,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/platformVersion.oa";
import {
    platformSerial,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/platformSerial.oa";
import {
    platformManufacturerId,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/platformManufacturerId.oa";
import {
    tBBSecurityAssertions,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/tBBSecurityAssertions.oa";
import {
    platformConfiguration,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/platformConfiguration.oa";
import {
    platformConfigUri,
} from "@wildboar/pc/src/lib/modules/PlatformCertificateProfile/platformConfigUri.oa";

// PKCS #9 Attribute Types
import {
    pKCS7PDU,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/pKCS7PDU.oa";
import {
    userPKCS12,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/userPKCS12.oa";
import {
    pKCS15Token,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/pKCS15Token.oa";
import {
    encryptedPrivateKeyInfo,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/encryptedPrivateKeyInfo.oa";
import {
    emailAddress,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/emailAddress.oa";
import {
    unstructuredName,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/unstructuredName.oa";
import {
    unstructuredAddress,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/unstructuredAddress.oa";
// import {
//     dateOfBirth,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/dateOfBirth.oa";
// import {
//     placeOfBirth,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/placeOfBirth.oa";
// import {
//     gender,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/gender.oa";
// import {
//     countryOfCitizenship,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/countryOfCitizenship.oa";
// import {
//     countryOfResidence,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/countryOfResidence.oa";
// import { // This has the same ID as pseudonym from X.520, but different matching rules!
//     pseudonym,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/pseudonym.oa";
// import {
//     contentType,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/contentType.oa";
// import {
//     messageDigest,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/messageDigest.oa";
// import {
//     signingTime,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/signingTime.oa";
import {
    randomNonce,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/randomNonce.oa";
import {
    counterSignature,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/counterSignature.oa";
import {
    challengePassword,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/challengePassword.oa";
import {
    extensionRequest,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/extensionRequest.oa";
import {
    extendedCertificateAttributes,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/extendedCertificateAttributes.oa";
import {
    friendlyName,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/friendlyName.oa";
import {
    localKeyId,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/localKeyId.oa";
import {
    signingDescription,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/signingDescription.oa";
// import {
//     smimeCapabilities,
// } from "@wildboar/pkcs/src/lib/modules/PKCS-9/smimeCapabilities.oa";

// IANA / LDAP Parity Schema
// import {
//     ads_allowAnonymousAccess,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-allowAnonymousAccess.oa";
// import {
//     ads_authenticatorClass,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticatorClass.oa";
// import {
//     ads_authenticatorId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-authenticatorId.oa";
// import {
//     ads_baseDn,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-baseDn.oa";
// import {
//     ads_certificatePassword,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-certificatePassword.oa";
// import {
//     ads_changeLogExposed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changeLogExposed.oa";
// import {
//     ads_changeLogId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-changeLogId.oa";
// import {
//     ads_chgPwdPolicyCategoryCount,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdPolicyCategoryCount.oa";
// import {
//     ads_chgPwdPolicyPasswordLength,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdPolicyPasswordLength.oa";
// import {
//     ads_chgPwdPolicyTokenSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdPolicyTokenSize.oa";
// import {
//     ads_chgPwdServicePrincipal,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-chgPwdServicePrincipal.oa";
// import {
//     ads_confidentialityRequired,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-confidentialityRequired.oa";
// import {
//     ads_contextEntry,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-contextEntry.oa";
// import {
//     ads_delegateHost,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateHost.oa";
// import {
//     ads_delegatePort,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegatePort.oa";
// import {
//     ads_delegateSsl,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateSsl.oa";
// import {
//     ads_delegateSslTrustManager,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateSslTrustManager.oa";
// import {
//     ads_delegateTls,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateTls.oa";
// import {
//     ads_delegateTlsTrustManager,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-delegateTlsTrustManager.oa";
// import {
//     ads_directoryServiceId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-directoryServiceId.oa";
// import {
//     ads_dsAccessControlEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsAccessControlEnabled.oa";
// import {
//     ads_dsAllowAnonymousAccess,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsAllowAnonymousAccess.oa";
// import {
//     ads_dsDenormalizeOpAttrsEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsDenormalizeOpAttrsEnabled.oa";
// import {
//     ads_dsPasswordHidden,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsPasswordHidden.oa";
// import {
//     ads_dsReplicaId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsReplicaId.oa";
// import {
//     ads_dsSyncPeriodMillis,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsSyncPeriodMillis.oa";
// import {
//     ads_dsTestEntries,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-dsTestEntries.oa";
// import {
//     ads_enabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-enabled.oa";
// import {
//     ads_enabledCiphers,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-enabledCiphers.oa";
// import {
//     ads_enabledProtocols,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-enabledProtocols.oa";
// import {
//     ads_extendedOpHandlerClass,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-extendedOpHandlerClass.oa";
// import {
//     ads_extendedOpId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-extendedOpId.oa";
// import {
//     ads_hashAlgorithm,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-hashAlgorithm.oa";
// import {
//     ads_hashAttribute,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-hashAttribute.oa";
// import {
//     ads_httpAppCtxPath,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpAppCtxPath.oa";
// import {
//     ads_httpConfFile,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpConfFile.oa";
// import {
//     ads_httpWarFile,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-httpWarFile.oa";
// import {
//     ads_Id,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-Id.oa";
// import {
//     ads_indexAttributeId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexAttributeId.oa";
// import {
//     ads_indexCacheSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexCacheSize.oa";
// import {
//     ads_indexFileName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexFileName.oa";
// import {
//     ads_indexHasReverse,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexHasReverse.oa";
// import {
//     ads_indexNumDupLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexNumDupLimit.oa";
// import {
//     ads_indexWorkingDir,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-indexWorkingDir.oa";
// import {
//     ads_interceptorClassName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptorClassName.oa";
// import {
//     ads_interceptorId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptorId.oa";
// import {
//     ads_interceptorOrder,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-interceptorOrder.oa";
// import {
//     ads_jdbmPartitionOptimizerEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-jdbmPartitionOptimizerEnabled.oa";
// import {
//     ads_journalFileName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalFileName.oa";
// import {
//     ads_journalId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalId.oa";
// import {
//     ads_journalRotation,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalRotation.oa";
// import {
//     ads_journalWorkingDir,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-journalWorkingDir.oa";
// import {
//     ads_keystoreFile,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-keystoreFile.oa";
// import {
//     ads_krbAllowableClockSkew,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbAllowableClockSkew.oa";
// import {
//     ads_krbBodyChecksumVerified,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbBodyChecksumVerified.oa";
// import {
//     ads_krbEmptyAddressesAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbEmptyAddressesAllowed.oa";
// import {
//     ads_krbEncryptionTypes,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbEncryptionTypes.oa";
// import {
//     ads_krbForwardableAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbForwardableAllowed.oa";
// import {
//     ads_krbKdcPrincipal,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbKdcPrincipal.oa";
// import {
//     ads_krbMaximumRenewableLifetime,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbMaximumRenewableLifetime.oa";
// import {
//     ads_krbMaximumTicketLifetime,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbMaximumTicketLifetime.oa";
// import {
//     ads_krbPaEncTimestampRequired,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbPaEncTimestampRequired.oa";
// import {
//     ads_krbPostdatedAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbPostdatedAllowed.oa";
// import {
//     ads_krbPrimaryRealm,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbPrimaryRealm.oa";
// import {
//     ads_krbProxiableAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbProxiableAllowed.oa";
// import {
//     ads_krbRenewableAllowed,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-krbRenewableAllowed.oa";
// import {
//     ads_maxPDUSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-maxPDUSize.oa";
// import {
//     ads_maxSizeLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-maxSizeLimit.oa";
// import {
//     ads_maxTimeLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-maxTimeLimit.oa";
// import {
//     ads_needClientAuth,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-needClientAuth.oa";
// import {
//     ads_ntlmMechProvider,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-ntlmMechProvider.oa";
// import {
//     ads_partitionCacheSize,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionCacheSize.oa";
// import {
//     ads_partitionId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionId.oa";
// import {
//     ads_partitionSuffix,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionSuffix.oa";
// import {
//     ads_partitionSyncOnWrite,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-partitionSyncOnWrite.oa";
// import {
//     ads_pwdAllowUserChange,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdAllowUserChange.oa";
// import {
//     ads_pwdAttribute,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdAttribute.oa";
// import {
//     ads_pwdCheckQuality,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdCheckQuality.oa";
// import {
//     ads_pwdExpireWarning,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdExpireWarning.oa";
// import {
//     ads_pwdFailureCountInterval,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdFailureCountInterval.oa";
// import {
//     ads_pwdGraceAuthNLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdGraceAuthNLimit.oa";
// import {
//     ads_pwdGraceExpire,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdGraceExpire.oa";
// import {
//     ads_pwdId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdId.oa";
// import {
//     ads_pwdInHistory,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdInHistory.oa";
// import {
//     ads_pwdLockout,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdLockout.oa";
// import {
//     ads_pwdLockoutDuration,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdLockoutDuration.oa";
// import {
//     ads_pwdMaxAge,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxAge.oa";
// import {
//     ads_pwdMaxDelay,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxDelay.oa";
// import {
//     ads_pwdMaxFailure,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxFailure.oa";
// import {
//     ads_pwdMaxIdle,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxIdle.oa";
// import {
//     ads_pwdMaxLength,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMaxLength.oa";
// import {
//     ads_pwdMinAge,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMinAge.oa";
// import {
//     ads_pwdMinDelay,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMinDelay.oa";
// import {
//     ads_pwdMinLength,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMinLength.oa";
// import {
//     ads_pwdMustChange,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdMustChange.oa";
// import {
//     ads_pwdSafeModify,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdSafeModify.oa";
// import {
//     ads_pwdValidator,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-pwdValidator.oa";
// import {
//     ads_replAttributes,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replAttributes.oa";
// import {
//     ads_replConsumerId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replConsumerId.oa";
// import {
//     ads_replConsumerImpl,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replConsumerImpl.oa";
// import {
//     ads_replCookie,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replCookie.oa";
// import {
//     ads_replEnabled,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replEnabled.oa";
// import {
//     ads_replLogMaxIdle,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replLogMaxIdle.oa";
// import {
//     ads_replLogPurgeThresholdCount,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replLogPurgeThresholdCount.oa";
// import {
//     ads_replPingerSleep,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replPingerSleep.oa";
// import {
//     ads_replProvHostName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replProvHostName.oa";
// import {
//     ads_replProvPort,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replProvPort.oa";
// import {
//     ads_replRefreshInterval,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replRefreshInterval.oa";
// import {
//     ads_replRefreshNPersist,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replRefreshNPersist.oa";
// import {
//     ads_replReqHandler,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replReqHandler.oa";
// import {
//     ads_replSearchFilter,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replSearchFilter.oa";
// import {
//     ads_replSearchSizeLimit,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replSearchSizeLimit.oa";
// import {
//     ads_replSearchTimeOut,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replSearchTimeOut.oa";
// import {
//     ads_replStrictCertValidation,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replStrictCertValidation.oa";
// import {
//     ads_replUserDn,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replUserDn.oa";
// import {
//     ads_replUserPassword,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replUserPassword.oa";
// import {
//     ads_replUseTls,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-replUseTls.oa";
// import {
//     ads_saslHost,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslHost.oa";
// import {
//     ads_saslMechClassName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslMechClassName.oa";
// import {
//     ads_saslMechName,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslMechName.oa";
// import {
//     ads_saslPrincipal,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslPrincipal.oa";
// import {
//     ads_saslRealms,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-saslRealms.oa";
// import {
//     ads_searchBaseDN,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-searchBaseDN.oa";
// import {
//     ads_serverId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-serverId.oa";
// import {
//     ads_systemPort,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-systemPort.oa";
// import {
//     ads_transportAddress,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportAddress.oa";
// import {
//     ads_transportBacklog,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportBacklog.oa";
// import {
//     ads_transportEnableSSL,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportEnableSSL.oa";
// import {
//     ads_transportId,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportId.oa";
// import {
//     ads_transportNbThreads,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-transportNbThreads.oa";
// import {
//     ads_wantClientAuth,
// } from "@wildboar/parity-schema/src/lib/modules/ApacheDirectoryConfig/ads-wantClientAuth.oa";
import {
    apacheDnsCharacterString,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsCharacterString.oa";
import {
    apacheDnsClass,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsClass.oa";
import {
    apacheDnsDomainName,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsDomainName.oa";
import {
    apacheDnsIpAddress,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsIpAddress.oa";
import {
    apacheDnsMxPreference,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsMxPreference.oa";
import {
    apacheDnsServicePort,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServicePort.oa";
import {
    apacheDnsServicePriority,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServicePriority.oa";
import {
    apacheDnsServiceWeight,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsServiceWeight.oa";
import {
    apacheDnsSoaExpire,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaExpire.oa";
import {
    apacheDnsSoaMinimum,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaMinimum.oa";
import {
    apacheDnsSoaMName,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaMName.oa";
import {
    apacheDnsSoaRefresh,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaRefresh.oa";
import {
    apacheDnsSoaRetry,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaRetry.oa";
import {
    apacheDnsSoaRName,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaRName.oa";
import {
    apacheDnsSoaSerial,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsSoaSerial.oa";
import {
    apacheDnsTtl,
} from "@wildboar/parity-schema/src/lib/modules/ApacheDNS-Schema/apacheDnsTtl.oa";
// import {
//     authPassword,
// } from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPassword.oa";
// import {
//     supportedAuthPasswordSchemes,
// } from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/supportedAuthPasswordSchemes.oa";
import {
    automountInformation,
} from "@wildboar/parity-schema/src/lib/modules/AutoFS-Schema/automountInformation.oa";
import {
    corbaIor,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaIor.oa";
import {
    corbaRepositoryId,
} from "@wildboar/parity-schema/src/lib/modules/CORBA/corbaRepositoryId.oa";
import {
    aRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/aRecord.oa";
import {
    associatedDomain,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/associatedDomain.oa";
import {
    associatedName,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/associatedName.oa";
import {
    audio,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/audio.oa";
import {
    buildingName,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/buildingName.oa";
import {
    cNAMERecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/cNAMERecord.oa";
import {
    dITRedirect,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/dITRedirect.oa";
import {
    documentAuthor,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentAuthor.oa";
import {
    documentIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentIdentifier.oa";
import {
    documentLocation,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentLocation.oa";
import {
    documentPublisher,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentPublisher.oa";
import {
    documentTitle,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentTitle.oa";
import {
    documentVersion,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentVersion.oa";
import {
    favouriteDrink,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/favouriteDrink.oa";
import {
    friendlyCountryName,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/friendlyCountryName.oa";
import {
    homePostalAddress,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/homePostalAddress.oa";
import {
    homeTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/homeTelephoneNumber.oa";
import {
    host,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/host.oa";
import {
    info,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/info.oa";
import {
    janetMailbox,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/janetMailbox.oa";
import {
    mail,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mail.oa";
import {
    mailPreferenceOption,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mailPreferenceOption.oa";
import {
    manager,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/manager.oa";
import {
    mDRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mDRecord.oa";
import {
    mobileTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mobileTelephoneNumber.oa";
import {
    mxRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mxRecord.oa";
import {
    nSRecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/nSRecord.oa";
import {
    organizationalStatus,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/organizationalStatus.oa";
import {
    pagerTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pagerTelephoneNumber.oa";
import {
    personalTitle,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/personalTitle.oa";
import {
    roomNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/roomNumber.oa";
import {
    secretary,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/secretary.oa";
import {
    sOARecord,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/sOARecord.oa";
import {
    textEncodedORAddress,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/textEncodedORAddress.oa";
import {
    uniqueIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/uniqueIdentifier.oa";
import {
    userClass,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/userClass.oa";
import {
    dhcpAddressState,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpAddressState.oa";
import {
    dhcpAssignedHostName,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpAssignedHostName.oa";
import {
    dhcpAssignedToClient,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpAssignedToClient.oa";
import {
    dhcpBootpFlag,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpBootpFlag.oa";
import {
    dhcpClassData,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpClassData.oa";
import {
    dhcpClassesDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpClassesDN.oa";
import {
    dhcpDelayedServiceParameter,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpDelayedServiceParameter.oa";
import {
    dhcpDnsStatus,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpDnsStatus.oa";
import {
    dhcpDomainName,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpDomainName.oa";
import {
    dhcpErrorLog,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpErrorLog.oa";
import {
    dhcpExpirationTime,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpExpirationTime.oa";
import {
    dhcpFailOverEndpointState,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpFailOverEndpointState.oa";
import {
    dhcpGroupDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpGroupDN.oa";
import {
    dhcpHashBucketAssignment,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHashBucketAssignment.oa";
import {
    dhcpHostDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHostDN.oa";
import {
    dhcpHWAddress,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpHWAddress.oa";
import {
    dhcpImplementation,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpImplementation.oa";
import {
    dhcpLastTransactionTime,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLastTransactionTime.oa";
import {
    dhcpLeaseDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLeaseDN.oa";
import {
    dhcpLeasesDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpLeasesDN.oa";
import {
    dhcpMaxClientLeadTime,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpMaxClientLeadTime.oa";
import {
    dhcpNetMask,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpNetMask.oa";
import {
    dhcpOption,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpOption.oa";
import {
    dhcpOptionsDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpOptionsDN.oa";
import {
    dhcpPermitList,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPermitList.oa";
import {
    dhcpPoolDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPoolDN.oa";
import {
    dhcpPrimaryDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpPrimaryDN.oa";
import {
    dhcpRange,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpRange.oa";
import {
    dhcpRelayAgentInfo,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpRelayAgentInfo.oa";
import {
    dhcpRequestedHostName,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpRequestedHostName.oa";
import {
    dhcpReservedForClient,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpReservedForClient.oa";
import {
    dhcpSecondaryDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSecondaryDN.oa";
import {
    dhcpServiceDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpServiceDN.oa";
import {
    dhcpSharedNetworkDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSharedNetworkDN.oa";
import {
    dhcpStartTimeOfState,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpStartTimeOfState.oa";
import {
    dhcpStatements,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpStatements.oa";
import {
    dhcpSubclassesDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubclassesDN.oa";
import {
    dhcpSubnetDN,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpSubnetDN.oa";
import {
    dhcpVersion,
} from "@wildboar/parity-schema/src/lib/modules/DHCP-Schema/dhcpVersion.oa";
// import { // Not supported because it would be too computationally expensive to compute access to all subordinates.
//     numSubordinates,
// } from "@wildboar/parity-schema/src/lib/modules/DS389CoreSchema/numSubordinates.oa";
import {
    changeNumber,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeNumber.oa";
import {
    changes,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changes.oa";
import {
    changeTime,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeTime.oa";
import {
    changeType,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/changeType.oa";
import {
    deleteOldRdn,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/deleteOldRdn.oa";
import {
    newRdn,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/newRdn.oa";
import {
    newSuperior,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/newSuperior.oa";
import {
    nsUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/nsUniqueId.oa";
import {
    targetDn,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/targetDn.oa";
import {
    targetUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/DSEE/targetUniqueId.oa";
import {
    attributeMap,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/attributeMap.oa";
import {
    authenticationMethod,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/authenticationMethod.oa";
import {
    bindTimeLimit,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/bindTimeLimit.oa";
import {
    credentialLevel,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/credentialLevel.oa";
import {
    defaultSearchBase,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/defaultSearchBase.oa";
import {
    defaultSearchScope,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/defaultSearchScope.oa";
import {
    defaultServerList,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/defaultServerList.oa";
import {
    dereferenceAliases,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/dereferenceAliases.oa";
import {
    followReferrals,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/followReferrals.oa";
import {
    objectclassMap,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/objectclassMap.oa";
import {
    preferredServerList,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/preferredServerList.oa";
import {
    profileTTL,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/profileTTL.oa";
import {
    searchTimeLimit,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/searchTimeLimit.oa";
import {
    serviceAuthenticationMethod,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/serviceAuthenticationMethod.oa";
import {
    serviceCredentialLevel,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/serviceCredentialLevel.oa";
import {
    serviceSearchDescriptor,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/serviceSearchDescriptor.oa";
import {
    dgIdentity,
} from "@wildboar/parity-schema/src/lib/modules/DynGroup/dgIdentity.oa";
import {
    memberURL,
} from "@wildboar/parity-schema/src/lib/modules/DynGroup/memberURL.oa";
import {
    eduPersonAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonAffiliation.oa";
import {
    eduPersonAssurance,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonAssurance.oa";
import {
    eduPersonEntitlement,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonEntitlement.oa";
import {
    eduPersonNickName,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonNickName.oa";
import {
    eduPersonOrcid,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonOrcid.oa";
import {
    eduPersonOrgDN,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonOrgDN.oa";
import {
    eduPersonOrgUnitDN,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonOrgUnitDN.oa";
import {
    eduPersonPrimaryAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrimaryAffiliation.oa";
import {
    eduPersonPrimaryOrgUnitDN,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrimaryOrgUnitDN.oa";
import {
    eduPersonPrincipalName,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrincipalName.oa";
import {
    eduPersonPrincipalNamePrior,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonPrincipalNamePrior.oa";
import {
    eduPersonScopedAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonScopedAffiliation.oa";
import {
    eduPersonTargetedID,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonTargetedID.oa";
import {
    eduPersonUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonUniqueId.oa";
import {
    fedfsAnnotation,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsAnnotation.oa";
import {
    fedfsDescr,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsDescr.oa";
import {
    fedfsFslUuid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFslUuid.oa";
import {
    fedfsFsnTTL,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsnTTL.oa";
import {
    fedfsFsnUuid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsnUuid.oa";
import {
    fedfsNceDN,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNceDN.oa";
import {
    fedfsNfsClassChange,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassChange.oa";
import {
    fedfsNfsClassFileid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassFileid.oa";
import {
    fedfsNfsClassHandle,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassHandle.oa";
import {
    fedfsNfsClassReaddir,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassReaddir.oa";
import {
    fedfsNfsClassSimul,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassSimul.oa";
import {
    fedfsNfsClassWritever,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsClassWritever.oa";
import {
    fedfsNfsCurrency,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsCurrency.oa";
import {
    fedfsNfsGenFlagGoing,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsGenFlagGoing.oa";
import {
    fedfsNfsGenFlagSplit,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsGenFlagSplit.oa";
import {
    fedfsNfsGenFlagWritable,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsGenFlagWritable.oa";
import {
    fedfsNfsReadOrder,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsReadOrder.oa";
import {
    fedfsNfsReadRank,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsReadRank.oa";
import {
    fedfsNfsTransFlagRdma,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsTransFlagRdma.oa";
import {
    fedfsNfsURI,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsURI.oa";
import {
    fedfsNfsValidFor,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsValidFor.oa";
import {
    fedfsNfsVarSub,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsVarSub.oa";
import {
    fedfsNfsWriteOrder,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsWriteOrder.oa";
import {
    fedfsNfsWriteRank,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsWriteRank.oa";
import {
    fedfsUuid,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsUuid.oa";
import {
    mailaccess,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailaccess.oa";
import {
    mailbox,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailbox.oa";
import {
    maildest,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/maildest.oa";
import {
    maildrop,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/maildrop.oa";
import {
    mailRoutingAddress,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/mailRoutingAddress.oa";
import {
    transport,
} from "@wildboar/parity-schema/src/lib/modules/InetMailSchema/transport.oa";
import {
    carLicense,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/carLicense.oa";
import {
    departmentNumber,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/departmentNumber.oa";
import {
    displayName,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/displayName.oa";
import {
    employeeNumber,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/employeeNumber.oa";
import {
    employeeType,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/employeeType.oa";
import {
    preferredLanguage,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/preferredLanguage.oa";
import {
    javaClassName,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaClassName.oa";
import {
    javaClassNames,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaClassNames.oa";
import {
    javaCodebase,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaCodebase.oa";
import {
    javaDoc,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaDoc.oa";
import {
    javaFactory,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaFactory.oa";
import {
    javaReferenceAddress,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaReferenceAddress.oa";
import {
    javaSerializedData,
} from "@wildboar/parity-schema/src/lib/modules/Java/javaSerializedData.oa";
import {
    krbHostServer,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbHostServer.oa";
import {
    krbKdcServers,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbKdcServers.oa";
import {
    krbLdapServers,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbLdapServers.oa";
import {
    krbMaxRenewableAge,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbMaxRenewableAge.oa";
import {
    krbMaxTicketLife,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbMaxTicketLife.oa";
import {
    krbPrincipalExpiration,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalExpiration.oa";
import {
    krbPrincipalName,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalName.oa";
import {
    krbPrincipalReferences,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalReferences.oa";
import {
    krbPrincipalType,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPrincipalType.oa";
import {
    krbPwdServers,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbPwdServers.oa";
import {
    krbRealmReferences,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbRealmReferences.oa";
import {
    krbSearchScope,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbSearchScope.oa";
import {
    krbTicketFlags,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbTicketFlags.oa";
import {
    krbUPEnabled,
} from "@wildboar/parity-schema/src/lib/modules/KerberosSchema/krbUPEnabled.oa";
import {
    krb5AccountDisabled,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5AccountDisabled.oa";
import {
    krb5AccountExpirationTime,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5AccountExpirationTime.oa";
import {
    krb5AccountLockedOut,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5AccountLockedOut.oa";
import {
    krb5EncryptionType,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5EncryptionType.oa";
import {
    krb5KDCFlags,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5KDCFlags.oa";
import {
    krb5Key,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5Key.oa";
import {
    krb5KeyVersionNumber,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5KeyVersionNumber.oa";
import {
    krb5MaxLife,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5MaxLife.oa";
import {
    krb5MaxRenew,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5MaxRenew.oa";
import {
    krb5PasswordEnd,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5PasswordEnd.oa";
import {
    krb5PrincipalName,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5PrincipalName.oa";
import {
    krb5PrincipalRealm,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5PrincipalRealm.oa";
import {
    krb5RealmName,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5RealmName.oa";
import {
    krb5ValidEnd,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5ValidEnd.oa";
import {
    krb5ValidStart,
} from "@wildboar/parity-schema/src/lib/modules/KerberosV5KeyDistributionCenter/krb5ValidStart.oa";
import {
    pwdAccountLockedTime,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdAccountLockedTime.oa";
import {
    pwdAllowUserChange,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdAllowUserChange.oa";
// import {
//     pwdAttribute,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdAttribute.oa";
import {
    pwdChangedTime,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdChangedTime.oa";
import {
    pwdCheckQuality,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdCheckQuality.oa";
// import {
//     pwdEndTime,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdEndTime.oa";
import {
    pwdExpireWarning,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdExpireWarning.oa";
import {
    pwdFailureCountInterval,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdFailureCountInterval.oa";
// import {
//     pwdFailureTime,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdFailureTime.oa";
import {
    pwdGraceAuthNLimit,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceAuthNLimit.oa";
import {
    pwdGraceExpire,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceExpire.oa";
import {
    pwdGraceUseTime,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceUseTime.oa";
// import {
//     pwdHistory,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdHistory.oa";
import {
    pwdInHistory,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdInHistory.oa";
// import {
//     pwdLastSuccess,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLastSuccess.oa";
// import {
//     pwdLockout,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLockout.oa";
// import {
//     pwdLockoutDuration,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLockoutDuration.oa";
// import {
//     pwdMaxAge,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxAge.oa";
import {
    pwdMaxDelay,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxDelay.oa";
import {
    pwdMaxFailure,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxFailure.oa";
import {
    pwdMaxIdle,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxIdle.oa";
import {
    pwdMaxLength,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMaxLength.oa";
import {
    pwdMinAge,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMinAge.oa";
import {
    pwdMinDelay,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMinDelay.oa";
// import {
//     pwdMinLength,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMinLength.oa";
import {
    pwdMustChange,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdMustChange.oa";
import {
    pwdPolicySubentry,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdPolicySubentry.oa";
import {
    pwdReset,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdReset.oa";
import {
    pwdSafeModify,
} from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdSafeModify.oa";
// import {
//     pwdStartTime,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdStartTime.oa";
// import {
//     ref,
// } from "@wildboar/parity-schema/src/lib/modules/LDAPReferral/ref.oa";
import {
    gpgFingerprint,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgFingerprint.oa";
import {
    gpgMailbox,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgMailbox.oa";
import {
    gpgSubCertID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgSubCertID.oa";
import {
    gpgSubFingerprint,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/gpgSubFingerprint.oa";
import {
    pgpBaseKeySpaceDN,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpBaseKeySpaceDN.oa";
import {
    pgpCertID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpCertID.oa";
import {
    pgpDisabled,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpDisabled.oa";
import {
    pgpKey,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKey.oa";
import {
    pgpKeyCreateTime,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyCreateTime.oa";
import {
    pgpKeyExpireTime,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyExpireTime.oa";
import {
    pgpKeyID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyID.oa";
import {
    pgpKeySize,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeySize.oa";
import {
    pgpKeyType,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyType.oa";
import {
    pgpRevoked,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpRevoked.oa";
import {
    pgpSignerID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpSignerID.oa";
import {
    pgpSoftware,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpSoftware.oa";
import {
    pgpSubKeyID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpSubKeyID.oa";
import {
    pgpUserID,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpUserID.oa";
import {
    pgpVersion,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpVersion.oa";
import {
    mailHost,
} from "@wildboar/parity-schema/src/lib/modules/Misc/mailHost.oa";
// import {
//     mailLocalAddress,
// } from "@wildboar/parity-schema/src/lib/modules/Misc/mailLocalAddress.oa";
import { // Duplicate attribute type name. Using the other one, because it is multi-valued and subtypes `mail`.
    mailRoutingAddress as openldapMailRoutingAddress,
} from "@wildboar/parity-schema/src/lib/modules/Misc/mailRoutingAddress.oa";
import {
    associatedDomain as associatedX400Domain,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedDomain.oa";
import {
    associatedInternetGateway,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedInternetGateway.oa";
import {
    associatedORAddress,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedORAddress.oa";
import {
    associatedX400Gateway,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/associatedX400Gateway.oa";
import {
    mcgamTables,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/mcgamTables.oa";
import {
    oRAddressComponentType,
} from "@wildboar/parity-schema/src/lib/modules/MIXERAddressMapping/oRAddressComponentType.oa";
import {
    custom1,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom1.oa";
import {
    custom2,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom2.oa";
import {
    custom3,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom3.oa";
import {
    custom4,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/custom4.oa";
import {
    homeurl,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/homeurl.oa";
import {
    mozillaHomeCountryName,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeCountryName.oa";
import {
    mozillaHomeFriendlyCountryName,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeFriendlyCountryName.oa";
import {
    mozillaHomeLocalityName,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeLocalityName.oa";
import {
    mozillaHomePostalAddress2,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomePostalAddress2.oa";
import {
    mozillaHomePostalCode,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomePostalCode.oa";
import {
    mozillaHomeState,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaHomeState.oa";
import {
    mozillaPostalAddress2,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaPostalAddress2.oa";
import {
    mozillaSecondEmail,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/mozillaSecondEmail.oa";
import {
    nsAIMid,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/nsAIMid.oa";
import {
    workurl,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/workurl.oa";
import {
    xmozillanickname,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/xmozillanickname.oa";
import {
    xmozillausehtmlmail,
} from "@wildboar/parity-schema/src/lib/modules/MozillaSchema/xmozillausehtmlmail.oa";
import {
    authorizedService,
} from "@wildboar/parity-schema/src/lib/modules/NameServiceAdditionalSchema/authorizedService.oa";
import {
    bootFile,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootFile.oa";
import {
    bootParameter,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootParameter.oa";
import {
    gecos,
} from "@wildboar/parity-schema/src/lib/modules/NIS/gecos.oa";
import {
    gidNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/gidNumber.oa";
import {
    homeDirectory,
} from "@wildboar/parity-schema/src/lib/modules/NIS/homeDirectory.oa";
import {
    ipHostNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipHostNumber.oa";
import {
    ipNetmaskNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipNetmaskNumber.oa";
import {
    ipNetworkNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipNetworkNumber.oa";
import {
    ipProtocolNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipProtocolNumber.oa";
import {
    ipServicePort,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipServicePort.oa";
import {
    ipServiceProtocol,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipServiceProtocol.oa";
import {
    loginShell,
} from "@wildboar/parity-schema/src/lib/modules/NIS/loginShell.oa";
import {
    macAddress,
} from "@wildboar/parity-schema/src/lib/modules/NIS/macAddress.oa";
import {
    memberNisNetgroup,
} from "@wildboar/parity-schema/src/lib/modules/NIS/memberNisNetgroup.oa";
import {
    memberUid,
} from "@wildboar/parity-schema/src/lib/modules/NIS/memberUid.oa";
import {
    nisMapEntry,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisMapEntry.oa";
import {
    nisMapName,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisMapName.oa";
import {
    nisNetgroupTriple,
} from "@wildboar/parity-schema/src/lib/modules/NIS/nisNetgroupTriple.oa";
import {
    oncRpcNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/oncRpcNumber.oa";
import {
    shadowExpire,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowExpire.oa";
import {
    shadowFlag,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowFlag.oa";
import {
    shadowInactive,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowInactive.oa";
import {
    shadowLastChange,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowLastChange.oa";
import {
    shadowMax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowMax.oa";
import {
    shadowMin,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowMin.oa";
import {
    shadowWarning,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowWarning.oa";
import {
    uidNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/uidNumber.oa";
import {
    legalName,
} from "@wildboar/parity-schema/src/lib/modules/NSCommonSchema/legalName.oa";
import {
    administratorsAddress,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/administratorsAddress.oa";
// import {
//     emailAddress,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/emailAddress.oa";
// import { // TODO: Eventually support this, when you track the change number.
//     etag,
// } from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/etag.oa";
import {
    fullVendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/fullVendorVersion.oa";
import {
    isMemberOf,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/isMemberOf.oa";
// import {
//     configContext,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/configContext.oa";
// import {
//     monitorContext,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/monitorContext.oa";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa";
// import {
//     syncreplCookie,
// } from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncreplCookie.oa";
import {
    syncTimestamp,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncTimestamp.oa";
import {
    labeledURI,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/labeledURI.oa";
import {
    pamExcludeSuffix,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamExcludeSuffix.oa";
import {
    pamFallback,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamFallback.oa";
import {
    pamFilter,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamFilter.oa";
import {
    pamIDAttr,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamIDAttr.oa";
import {
    pamIDMapMethod,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamIDMapMethod.oa";
import {
    pamIncludeSuffix,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamIncludeSuffix.oa";
import {
    pamMissingSuffix,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamMissingSuffix.oa";
import {
    pamSecure,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamSecure.oa";
import {
    pamService,
} from "@wildboar/parity-schema/src/lib/modules/PAMSchema/pamService.oa";
import {
    ftpDownloadBandwidth,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpDownloadBandwidth.oa";
import {
    ftpDownloadRatio,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpDownloadRatio.oa";
import {
    ftpGid,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpGid.oa";
import {
    ftpQuotaFiles,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpQuotaFiles.oa";
import {
    ftpQuotaMBytes,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpQuotaMBytes.oa";
import {
    ftpStatus,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpStatus.oa";
import {
    ftpUid,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpUid.oa";
import {
    ftpUploadBandwidth,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpUploadBandwidth.oa";
import {
    ftpUploadRatio,
} from "@wildboar/parity-schema/src/lib/modules/PureFTPdSchema/ftpUploadRatio.oa";
import {
    accountStatus,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/accountStatus.oa";
import {
    confirmtext,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/confirmtext.oa";
import {
    deliveryMode,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/deliveryMode.oa";
import {
    deliveryProgramPath,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/deliveryProgramPath.oa";
import {
    dnmember,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/dnmember.oa";
import {
    dnmoderator,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/dnmoderator.oa";
import {
    dnsender,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/dnsender.oa";
import {
    filtermember,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/filtermember.oa";
import {
    filtersender,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/filtersender.oa";
import {
    mailAlternateAddress,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailAlternateAddress.oa";
import {
    mailForwardingAddress,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailForwardingAddress.oa";
import {
    mailHost as qmailHost,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailHost.oa";
import {
    mailMessageStore,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailMessageStore.oa";
import {
    mailQuotaCount,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailQuotaCount.oa";
import {
    mailQuotaSize,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailQuotaSize.oa";
import {
    mailReplyText,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailReplyText.oa";
import {
    mailSizeMax,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailSizeMax.oa";
import {
    membersonly,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/membersonly.oa";
import {
    moderatortext,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/moderatortext.oa";
import {
    qladnmanager,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qladnmanager.oa";
import {
    qlaDomainList,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaDomainList.oa";
import {
    qlaMailHostList,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailHostList.oa";
import {
    qlaMailMStorePrefix,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailMStorePrefix.oa";
import {
    qlaMailQuotaCount,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailQuotaCount.oa";
import {
    qlaMailQuotaSize,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailQuotaSize.oa";
import {
    qlaMailSizeMax,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaMailSizeMax.oa";
import {
    qlaQmailGid,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaQmailGid.oa";
import {
    qlaQmailUid,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaQmailUid.oa";
import {
    qlaUidPrefix,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qlaUidPrefix.oa";
import {
    qmailAccountPurge,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailAccountPurge.oa";
import {
    qmailDotMode,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailDotMode.oa";
import {
    qmailGID,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailGID.oa";
import {
    qmailUID,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUID.oa";
import {
    rfc822member,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/rfc822member.oa";
import {
    rfc822moderator,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/rfc822moderator.oa";
import {
    rfc822sender,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/rfc822sender.oa";
import {
    senderconfirm,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/senderconfirm.oa";
import {
    dialupAccess,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/dialupAccess.oa";
import {
    freeradiusDhcpv4Attribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4Attribute.oa";
import {
    freeradiusDhcpv4GatewayAddr,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4GatewayAddr.oa";
import {
    freeradiusDhcpv4GatewayIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4GatewayIdentifier.oa";
import {
    freeradiusDhcpv4PoolName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv4PoolName.oa";
import {
    freeradiusDhcpv6Attribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6Attribute.oa";
import {
    freeradiusDhcpv6GatewayAddr,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6GatewayAddr.oa";
import {
    freeradiusDhcpv6GatewayIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6GatewayIdentifier.oa";
import {
    freeradiusDhcpv6PoolNameNA,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6PoolNameNA.oa";
import {
    freeradiusDhcpv6PoolNamePD,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6PoolNamePD.oa";
import {
    freeradiusDhcpv6PoolNameTA,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/freeradiusDhcpv6PoolNameTA.oa";
import {
    radiusAcctAuthentic,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctAuthentic.oa";
import {
    radiusAcctInputOctets,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctInputOctets.oa";
import {
    radiusAcctInterval,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctInterval.oa";
import {
    radiusAcctOutputOctets,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctOutputOctets.oa";
import {
    radiusAcctSessionId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctSessionId.oa";
import {
    radiusAcctSessionTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctSessionTime.oa";
import {
    radiusAcctStartTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctStartTime.oa";
import {
    radiusAcctStopTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctStopTime.oa";
import {
    radiusAcctTerminateCause,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctTerminateCause.oa";
import {
    radiusAcctUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctUniqueId.oa";
import {
    radiusAcctUpdateTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAcctUpdateTime.oa";
import {
    radiusArapFeatures,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusArapFeatures.oa";
import {
    radiusArapSecurity,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusArapSecurity.oa";
import {
    radiusArapZoneAccess,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusArapZoneAccess.oa";
import {
    radiusAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAttribute.oa";
import {
    radiusAuthType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusAuthType.oa";
import {
    radiusCallbackId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCallbackId.oa";
import {
    radiusCallbackNumber,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCallbackNumber.oa";
import {
    radiusCalledStationId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCalledStationId.oa";
import {
    radiusCallingStationId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusCallingStationId.oa";
import {
    radiusClass,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClass.oa";
import {
    radiusClientComment,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientComment.oa";
import {
    radiusClientIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientIdentifier.oa";
import {
    radiusClientIPAddress,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientIPAddress.oa";
import {
    radiusClientRequireMa,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientRequireMa.oa";
import {
    radiusClientSecret,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientSecret.oa";
import {
    radiusClientShortname,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientShortname.oa";
import {
    radiusClientType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientType.oa";
import {
    radiusClientVirtualServer,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusClientVirtualServer.oa";
import {
    radiusConnectInfoStart,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusConnectInfoStart.oa";
import {
    radiusConnectInfoStop,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusConnectInfoStop.oa";
import {
    radiusControlAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusControlAttribute.oa";
import {
    radiusExpiration,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusExpiration.oa";
import {
    radiusFilterId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFilterId.oa";
import {
    radiusFramedAppleTalkLink,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedAppleTalkLink.oa";
import {
    radiusFramedAppleTalkNetwork,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedAppleTalkNetwork.oa";
import {
    radiusFramedAppleTalkZone,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedAppleTalkZone.oa";
import {
    radiusFramedCompression,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedCompression.oa";
import {
    radiusFramedIPAddress,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedIPAddress.oa";
import {
    radiusFramedIPNetmask,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedIPNetmask.oa";
import {
    radiusFramedIPXNetwork,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedIPXNetwork.oa";
import {
    radiusFramedMTU,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedMTU.oa";
import {
    radiusFramedProtocol,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedProtocol.oa";
import {
    radiusFramedRoute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedRoute.oa";
import {
    radiusFramedRouting,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusFramedRouting.oa";
import {
    radiusGroupName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusGroupName.oa";
import {
    radiusHint,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusHint.oa";
import {
    radiusHuntgroupName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusHuntgroupName.oa";
import {
    radiusIdleTimeout,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusIdleTimeout.oa";
import {
    radiusLoginIPHost,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginIPHost.oa";
import {
    radiusLoginLATGroup,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATGroup.oa";
import {
    radiusLoginLATNode,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATNode.oa";
import {
    radiusLoginLATPort,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATPort.oa";
import {
    radiusLoginLATService,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginLATService.oa";
import {
    radiusLoginService,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginService.oa";
import {
    radiusLoginTCPPort,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginTCPPort.oa";
import {
    radiusLoginTime,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusLoginTime.oa";
import {
    radiusNASIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASIdentifier.oa";
import {
    radiusNASIpAddress,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASIpAddress.oa";
import {
    radiusNASPort,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASPort.oa";
import {
    radiusNASPortId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASPortId.oa";
import {
    radiusNASPortType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusNASPortType.oa";
import {
    radiusPasswordRetry,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusPasswordRetry.oa";
import {
    radiusPortLimit,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusPortLimit.oa";
import {
    radiusProfileDN,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusProfileDN.oa";
import {
    radiusPrompt,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusPrompt.oa";
import {
    radiusProxyToRealm,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusProxyToRealm.oa";
import {
    radiusRealm,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusRealm.oa";
import {
    radiusReplicateToRealm,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusReplicateToRealm.oa";
import {
    radiusReplyAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusReplyAttribute.oa";
import {
    radiusReplyMessage,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusReplyMessage.oa";
import {
    radiusRequestAttribute,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusRequestAttribute.oa";
import {
    radiusServiceType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusServiceType.oa";
import {
    radiusSessionTimeout,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusSessionTimeout.oa";
import {
    radiusSimultaneousUse,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusSimultaneousUse.oa";
import {
    radiusStripUserName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusStripUserName.oa";
import {
    radiusTerminationAction,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTerminationAction.oa";
import {
    radiusTunnelAssignmentId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelAssignmentId.oa";
import {
    radiusTunnelClientEndpoint,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelClientEndpoint.oa";
import {
    radiusTunnelMediumType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelMediumType.oa";
import {
    radiusTunnelPassword,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelPassword.oa";
import {
    radiusTunnelPreference,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelPreference.oa";
import {
    radiusTunnelPrivateGroupId,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelPrivateGroupId.oa";
import {
    radiusTunnelServerEndpoint,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelServerEndpoint.oa";
import {
    radiusTunnelType,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusTunnelType.oa";
import {
    radiusUserCategory,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusUserCategory.oa";
import {
    radiusUserName,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusUserName.oa";
import {
    radiusVSA,
} from "@wildboar/parity-schema/src/lib/modules/RADIUSSchema/radiusVSA.oa";
import {
    automountKey,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/automountKey.oa";
import {
    automountMapName,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/automountMapName.oa";
import {
    nisDomain,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisDomain.oa";
import {
    nisPublicKey,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisPublicKey.oa";
import {
    nisSecretKey,
} from "@wildboar/parity-schema/src/lib/modules/RFC2307bis/nisSecretKey.oa";
import {
    dynamicSubtrees,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicSubtrees.oa";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa";
import {
    calCalAdrURI,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calCalAdrURI.oa";
import {
    calCalURI,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calCalURI.oa";
import {
    calCAPURI,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calCAPURI.oa";
import {
    calFBURL,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calFBURL.oa";
import {
    calOtherCalAdrURIs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherCalAdrURIs.oa";
import {
    calOtherCalURIs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherCalURIs.oa";
import {
    calOtherCAPURIs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherCAPURIs.oa";
import {
    calOtherFBURLs,
} from "@wildboar/parity-schema/src/lib/modules/RFC2739Calendar/calOtherFBURLs.oa";
import {
    service_advert_attribute_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-attribute-authenticator.oa";
import {
    service_advert_scopes,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-scopes.oa";
import {
    service_advert_service_type,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-service-type.oa";
import {
    service_advert_url_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/service-advert-url-authenticator.oa";
import {
    template_major_version_number,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/template-major-version-number.oa";
import {
    template_minor_version_number,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/template-minor-version-number.oa";
import {
    template_url_syntax,
} from "@wildboar/parity-schema/src/lib/modules/RFC2926ServiceLocationProtocolSchema/template-url-syntax.oa";
import {
    vendorName,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorName.oa";
import {
    vendorVersion,
} from "@wildboar/parity-schema/src/lib/modules/RFC3045VendorInfo/vendorVersion.oa";
import {
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa";
import {
    ldifLocationURL,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/ldifLocationURL.oa";
import {
    mailReceipt,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/mailReceipt.oa";
import {
    managedDomains,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/managedDomains.oa";
import {
    providerCertificate,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerCertificate.oa";
import {
    providerCertificateHash,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerCertificateHash.oa";
import {
    providerName,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerName.oa";
import {
    providerUnit,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerUnit.oa";
import {
    printer_aliases,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-aliases.oa";
import {
    printer_charge_info_uri,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charge-info-uri.oa";
import {
    printer_charge_info,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charge-info.oa";
import {
    printer_charset_configured,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charset-configured.oa";
import {
    printer_charset_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-charset-supported.oa";
import {
    printer_color_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-color-supported.oa";
import {
    printer_compression_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-compression-supported.oa";
import {
    printer_copies_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-copies-supported.oa";
import {
    printer_current_operator,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-current-operator.oa";
import {
    printer_delivery_orientation_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-delivery-orientation-supported.oa";
import {
    printer_device_id,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-device-id.oa";
import {
    printer_device_service_count,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-device-service-count.oa";
import {
    printer_document_format_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-document-format-supported.oa";
import {
    printer_finishings_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-finishings-supported.oa";
import {
    printer_generated_natural_language_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-generated-natural-language-supported.oa";
import {
    printer_geo_location,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-geo-location.oa";
import {
    printer_info,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-info.oa";
import {
    printer_ipp_features_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-ipp-features-supported.oa";
import {
    printer_ipp_versions_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-ipp-versions-supported.oa";
import {
    printer_job_k_octets_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-job-k-octets-supported.oa";
import {
    printer_job_priority_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-job-priority-supported.oa";
import {
    printer_location,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-location.oa";
import {
    printer_make_and_model,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-make-and-model.oa";
import {
    printer_media_local_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-media-local-supported.oa";
import {
    printer_media_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-media-supported.oa";
import {
    printer_more_info,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-more-info.oa";
import {
    printer_multiple_document_jobs_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-multiple-document-jobs-supported.oa";
import {
    printer_name,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-name.oa";
import {
    printer_natural_language_configured,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-natural-language-configured.oa";
import {
    printer_number_up_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-number-up-supported.oa";
import {
    printer_output_features_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-output-features-supported.oa";
import {
    printer_pages_per_minute_color,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-pages-per-minute-color.oa";
import {
    printer_pages_per_minute,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-pages-per-minute.oa";
import {
    printer_print_quality_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-print-quality-supported.oa";
import {
    printer_resolution_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-resolution-supported.oa";
import {
    printer_service_person,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-service-person.oa";
import {
    printer_sides_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-sides-supported.oa";
import {
    printer_stacking_order_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-stacking-order-supported.oa";
import {
    printer_uri,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-uri.oa";
import {
    printer_uuid,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-uuid.oa";
import {
    printer_xri_supported,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printer-xri-supported.oa";
import {
    sabayonProfileName,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileName.oa";
import {
    sabayonProfileURL,
} from "@wildboar/parity-schema/src/lib/modules/SabayonSchema/sabayonProfileURL.oa";
import {
    acctFlags,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/acctFlags.oa";
import {
    domain,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/domain.oa";
import {
    homeDrive,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/homeDrive.oa";
import {
    kickoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/kickoffTime.oa";
import {
    lmPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/lmPassword.oa";
import {
    logoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/logoffTime.oa";
import {
    logonTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/logonTime.oa";
import {
    ntPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/ntPassword.oa";
import {
    primaryGroupID,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/primaryGroupID.oa";
import {
    profilePath,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/profilePath.oa";
import {
    pwdCanChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/pwdCanChange.oa";
import {
    pwdLastSet,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/pwdLastSet.oa";
// import {
//     pwdMustChange,
// } from "@wildboar/parity-schema/src/lib/modules/SambaSchema/pwdMustChange.oa";
import {
    rid,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/rid.oa";
import {
    scriptPath,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/scriptPath.oa";
import {
    smbHome,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/smbHome.oa";
import {
    userWorkstations,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/userWorkstations.oa";
import {
    sambaAcctFlags,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaAcctFlags.oa";
import {
    sambaAlgorithmicRidBase,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaAlgorithmicRidBase.oa";
import {
    sambaBadPasswordCount,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaBadPasswordCount.oa";
import {
    sambaBadPasswordTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaBadPasswordTime.oa";
import {
    sambaBoolOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaBoolOption.oa";
import {
    sambaDomainName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaDomainName.oa";
import {
    sambaForceLogoff,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaForceLogoff.oa";
import {
    sambaGroupType,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaGroupType.oa";
import {
    sambaHomeDrive,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaHomeDrive.oa";
import {
    sambaHomePath,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaHomePath.oa";
import {
    sambaIntegerOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaIntegerOption.oa";
import {
    sambaKickoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaKickoffTime.oa";
import {
    sambaLMPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLMPassword.oa";
import {
    sambaLockoutDuration,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLockoutDuration.oa";
import {
    sambaLockoutObservationWindow,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLockoutObservationWindow.oa";
import {
    sambaLockoutThreshold,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLockoutThreshold.oa";
import {
    sambaLogoffTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogoffTime.oa";
import {
    sambaLogonHours,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonHours.oa";
import {
    sambaLogonScript,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonScript.oa";
import {
    sambaLogonTime,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonTime.oa";
import {
    sambaLogonToChgPwd,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaLogonToChgPwd.oa";
import {
    sambaMaxPwdAge,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMaxPwdAge.oa";
import {
    sambaMinPwdAge,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMinPwdAge.oa";
import {
    sambaMinPwdLength,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMinPwdLength.oa";
import {
    sambaMungedDial,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaMungedDial.oa";
import {
    sambaNextGroupRid,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNextGroupRid.oa";
import {
    sambaNextRid,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNextRid.oa";
import {
    sambaNextUserRid,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNextUserRid.oa";
import {
    sambaNTPassword,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaNTPassword.oa";
import {
    sambaOptionName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaOptionName.oa";
import {
    sambaPasswordHistory,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPasswordHistory.oa";
import {
    sambaPrimaryGroupSID,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrimaryGroupSID.oa";
import {
    sambaPrivilegeList,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrivilegeList.oa";
import {
    sambaPrivName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPrivName.oa";
import {
    sambaProfilePath,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaProfilePath.oa";
import {
    sambaPwdCanChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdCanChange.oa";
import {
    sambaPwdHistoryLength,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdHistoryLength.oa";
import {
    sambaPwdLastSet,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdLastSet.oa";
import {
    sambaPwdMustChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaPwdMustChange.oa";
import {
    sambaRefuseMachinePwdChange,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaRefuseMachinePwdChange.oa";
import {
    sambaShareName,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaShareName.oa";
import {
    sambaSID,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSID.oa";
import {
    sambaSIDList,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSIDList.oa";
import {
    sambaStringListOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaStringListOption.oa";
import {
    sambaStringOption,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaStringOption.oa";
import {
    sambaTrustFlags,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaTrustFlags.oa";
import {
    sambaUserWorkstations,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaUserWorkstations.oa";
import {
    mailHost as sendmailMailHost,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/mailHost.oa";
import {
    mailLocalAddress,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/mailLocalAddress.oa";
import {
    mailRoutingAddress as sendmailRoutingAddress,
} from "@wildboar/parity-schema/src/lib/modules/SendmailSchema/mailRoutingAddress.oa";
import {
    sudoCommand,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoCommand.oa";
import {
    sudoHost,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoHost.oa";
import {
    sudoNotAfter,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoNotAfter.oa";
import {
    sudoNotBefore,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoNotBefore.oa";
import {
    sudoOption,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoOption.oa";
import {
    sudoOrder,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoOrder.oa";
import {
    sudoRunAs,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRunAs.oa";
import {
    sudoRunAsGroup,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRunAsGroup.oa";
import {
    sudoRunAsUser,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoRunAsUser.oa";
import {
    sudoUser,
} from "@wildboar/parity-schema/src/lib/modules/SudoSchema/sudoUser.oa";
import {
    distinguishedNameTableKey,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/distinguishedNameTableKey.oa";
import {
    textTableKey,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableKey.oa";
import {
    textTableValue,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableValue.oa";
import {
    uddiAccessPoint,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAccessPoint.oa";
import {
    uddiAddressLine,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAddressLine.oa";
import {
    uddiAuthorizedName,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAuthorizedName.oa";
import {
    uddiBindingKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBindingKey.oa";
import {
    uddiBusinessKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessKey.oa";
import {
    uddiCategoryBag,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiCategoryBag.oa";
import {
    uddiDescription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiDescription.oa";
import {
    uddiDiscoveryURLs,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiDiscoveryURLs.oa";
import {
    uddiEMail,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiEMail.oa";
import {
    uddiFromKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiFromKey.oa";
import {
    uddiHostingRedirector,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiHostingRedirector.oa";
import {
    uddiIdentifierBag,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiIdentifierBag.oa";
import {
    uddiInstanceDescription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiInstanceDescription.oa";
import {
    uddiInstanceParms,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiInstanceParms.oa";
import {
    uddiIsHidden,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiIsHidden.oa";
import {
    uddiIsProjection,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiIsProjection.oa";
import {
    uddiKeyedReference,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiKeyedReference.oa";
import {
    uddiLang,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiLang.oa";
import {
    uddiName,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiName.oa";
import {
    uddiOperator,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiOperator.oa";
import {
    uddiOverviewDescription,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiOverviewDescription.oa";
import {
    uddiOverviewURL,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiOverviewURL.oa";
import {
    uddiPersonName,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPersonName.oa";
import {
    uddiPhone,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPhone.oa";
import {
    uddiServiceKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiServiceKey.oa";
import {
    uddiSortCode,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiSortCode.oa";
import {
    uddiTModelKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelKey.oa";
import {
    uddiToKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiToKey.oa";
import {
    uddiUseType,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiUseType.oa";
import {
    uddiUUID,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiUUID.oa";
import {
    uddiv3BindingKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3BindingKey.oa";
import {
    uddiv3BriefResponse,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3BriefResponse.oa";
import {
    uddiv3BusinessKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3BusinessKey.oa";
import {
    uddiv3DigitalSignature,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3DigitalSignature.oa";
import {
    uddiv3EntityCreationTime,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityCreationTime.oa";
import {
    uddiv3EntityDeletionTime,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityDeletionTime.oa";
import {
    uddiv3EntityKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityKey.oa";
import {
    uddiv3EntityModificationTime,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityModificationTime.oa";
import {
    uddiv3ExpiresAfter,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3ExpiresAfter.oa";
import {
    uddiv3MaxEntities,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3MaxEntities.oa";
import {
    uddiv3NodeId,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3NodeId.oa";
import {
    uddiv3NotificationInterval,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3NotificationInterval.oa";
import {
    uddiv3ServiceKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3ServiceKey.oa";
import {
    uddiv3SubscriptionFilter,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3SubscriptionFilter.oa";
import {
    uddiv3SubscriptionKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3SubscriptionKey.oa";
import {
    uddiv3TModelKey,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3TModelKey.oa";
// import {
//     entryUUID,
// } from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa";
import {
    vPIMExtendedAbsenceStatus,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMExtendedAbsenceStatus.oa";
import {
    vPIMMaxMessageSize,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMMaxMessageSize.oa";
import {
    vPIMRfc822Mailbox,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMRfc822Mailbox.oa";
import {
    vPIMSpokenName,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSpokenName.oa";
import {
    vPIMSubMailboxes,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSubMailboxes.oa";
import {
    vPIMSupportedAudioMediaTypes,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSupportedAudioMediaTypes.oa";
import {
    vPIMSupportedMessageContext,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSupportedMessageContext.oa";
import {
    vPIMSupportedUABehaviors,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMSupportedUABehaviors.oa";
import {
    vPIMTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMTelephoneNumber.oa";
import {
    vPIMTextName,
} from "@wildboar/parity-schema/src/lib/modules/VPIMSchema/vPIMTextName.oa";

// CMS Attribute Types
import {
    aa_contentLocation,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-contentLocation.oa";
import {
    aa_contentLocations,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-contentLocations.oa";
import {
    aa_parentBlock,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-parentBlock.oa";
import {
    aa_precedingBlock,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-precedingBlock.oa";
import {
    aa_sidechains,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-sidechains.oa";
import {
    aa_signerInfo,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-signerInfo.oa";
import {
    aa_signerInfos,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-signerInfos.oa";
import {
    aa_timeStamped,
} from "@wildboar/cms/src/lib/modules/CMSProfileAttributes/aa-timeStamped.oa";
// import {
//     signcryptedEnvelope,
// } from "@wildboar/cms/src/lib/modules/CMSSigncryption/signcryptedEnvelope.oa";
// import {
//     aa_contentType,
// } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/aa-contentType.oa";
import {
    aa_countersignature,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/aa-countersignature.oa";
// import {
//     aa_messageDigest,
// } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/aa-messageDigest.oa";
// import {
//     aa_signingTime,
// } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/aa-signingTime.oa";
import {
    aa_encrypKeyPref,
} from "@wildboar/cms/src/lib/modules/SecureMimeMessageV3dot1-2009/aa-encrypKeyPref.oa";
// import {
//     aa_smimeCapabilities,
// } from "@wildboar/cms/src/lib/modules/SecureMimeMessageV3dot1-2009/aa-smimeCapabilities.oa";
// import {
//     tokenizedParts,
// } from "@wildboar/cms/src/lib/modules/TokenizationManifest/tokenizedParts.oa";

// ITU Schema
import {
    cEKReference,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/cEKReference.oa";
import {
    cEKMaxDecrypts,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/cEKMaxDecrypts.oa";
import {
    kEKDerivationAlg,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/kEKDerivationAlg.oa";
import {
    accessService,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/accessService.oa";
import {
    dateOfBirth,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/dateOfBirth.oa";
import {
    placeOfBirth,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/placeOfBirth.oa";
import {
    gender,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/gender.oa";
import {
    countryOfCitizenship,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/countryOfCitizenship.oa";
import {
    countryOfResidence,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/countryOfResidence.oa";
import {
    deviceOwner,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/deviceOwner.oa";
import {
    clearanceSponsor,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/clearanceSponsor.oa";
import {
    binarySigningTime,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/binarySigningTime.oa";
import {
    tokenizedParts,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/tokenizedParts.oa";
import {
    authenticationInfo,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/authenticationInfo.oa";
import {
    accesIdentity,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/accesIdentity.oa";
import {
    chargingIdentity,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/chargingIdentity.oa";
import {
    group,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/group.oa";
import {
    clearance_RFC3281,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/clearance-RFC3281.oa";
import {
    encAttrs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/encAttrs.oa";
import {
    smimeCapabilities,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/smimeCapabilities.oa";
// import {
//     signerInfo,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signerInfo.oa";
// import {
//     signerInfos,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signerInfos.oa";
// import {
//     contentLocation,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/contentLocation.oa";
// import {
//     contentLocations,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/contentLocations.oa";
// import {
//     precedingBlock,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/precedingBlock.oa";
// import {
//     timeStamped,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/timeStamped.oa";
// import {
//     sidechains,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/sidechains.oa";
// import {
//     parentBlock,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/parentBlock.oa";
import {
    signcryptedEnvelope,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signcryptedEnvelope.oa";
// import {
//     encrypKeyPref,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/encrypKeyPref.oa";
import {
    firmwarePackageID,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/firmwarePackageID.oa";
import {
    targetHardwareIDs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/targetHardwareIDs.oa";
import {
    decryptKeyID,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/decryptKeyID.oa";
import {
    implCryptoAlgs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/implCryptoAlgs.oa";
import {
    implCompressAlgs,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/implCompressAlgs.oa";
import {
    communityIdentifiers,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/communityIdentifiers.oa";
import {
    firmwarePackageInfo,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/firmwarePackageInfo.oa";
import {
    wrappedFirmwareKey,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/wrappedFirmwareKey.oa";
import {
    contentType,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/contentType.oa";
import {
    messageDigest,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/messageDigest.oa";
import {
    signingTime,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/signingTime.oa";
// import {
//     countersignature,
// } from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/countersignature.oa";
import {
    extension_req,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/extension-req.oa";
import {
    unsignedData,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/unsignedData.oa";
import {
    multipleSignatures,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/multipleSignatures.oa";
import {
    wlanSSID,
} from "@wildboar/parity-schema/src/lib/modules/OtherAttributes/wlanSSID.oa";

import {
    commUniqueId,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commUniqueId.oa";
import {
    commOwner,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commOwner.oa";
import {
    commPrivate,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commPrivate.oa";
import {
    commURI,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/commURI.oa";
import {
    h323IdentityGKDomain,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityGKDomain.oa";
import {
    h323Identityh323_ID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323Identityh323-ID.oa";
import {
    h323IdentitydialedDigits,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitydialedDigits.oa";
import {
    h323Identityemail_ID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323Identityemail-ID.oa";
import {
    h323IdentityURL_ID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityURL-ID.oa";
import {
    h323IdentitytransportID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitytransportID.oa";
import {
    h323IdentitypartyNumber,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitypartyNumber.oa";
import {
    h323IdentitymobileUIM,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentitymobileUIM.oa";
import {
    h323IdentityEndpointType,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityEndpointType.oa";
import {
    h323IdentityServiceLevel,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h323IdentityServiceLevel.oa";
import {
    h235IdentityEndpointID,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h235IdentityEndpointID.oa";
import {
    h235IdentityPassword,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h235IdentityPassword.oa";
import {
    h320IdentityCC,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityCC.oa";
import {
    h320IdentityNDC,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityNDC.oa";
import {
    h320IdentitySN,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentitySN.oa";
import {
    h320IdentityServiceLevel,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityServiceLevel.oa";
import {
    h320IdentityExtension,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/h320IdentityExtension.oa";
import {
    sIPIdentitySIPURI,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentitySIPURI.oa";
import {
    sIPIdentityRegistrarAddress,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityRegistrarAddress.oa";
import {
    sIPIdentityProxyAddress,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityProxyAddress.oa";
import {
    sIPIdentityAddress,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityAddress.oa";
import {
    sIPIdentityPassword,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityPassword.oa";
import {
    sIPIdentityUserName,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityUserName.oa";
import {
    sIPIdentityServiceLevel,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/sIPIdentityServiceLevel.oa";
import {
    genericIdentityProtocolIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/genericIdentityProtocolIdentifier.oa";
import {
    genericIdentityMessage,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/genericIdentityMessage.oa";
import {
    callPreferenceURI,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/callPreferenceURI.oa";
import {
    userSMIMECertificate,
} from "@wildboar/parity-schema/src/lib/modules/H323-X500-Schema/userSMIMECertificate.oa";

// ERS
import {
    aa_er_External,
} from "@wildboar/parity-schema/src/lib/modules/ERS/aa-er-External.oa";
import {
    aa_er_Internal,
} from "@wildboar/parity-schema/src/lib/modules/ERS/aa-er-Internal.oa";

// ESS
import {
    aa_receiptRequest,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-receiptRequest.oa";
import {
    aa_contentIdentifier,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-contentIdentifier.oa";
import {
    aa_contentHint,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-contentHint.oa";
import {
    aa_msgSigDigest,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-msgSigDigest.oa";
import {
    aa_contentReference,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-contentReference.oa";
import {
    aa_securityLabel,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-securityLabel.oa";
import {
    aa_equivalentLabels,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-equivalentLabels.oa";
import {
    aa_mlExpandHistory,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-mlExpandHistory.oa";
import {
    aa_signingCertificate,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-signingCertificate.oa";
import {
    aa_signingCertificateV2,
} from "@wildboar/parity-schema/src/lib/modules/ExtendedSecurityServices-2009/aa-signingCertificateV2.oa";

// UPT
import {
    providerId,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/providerId.oa";
import {
    providedServiceId,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/providedServiceId.oa";
import {
    providedLocations,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/providedLocations.oa";
import {
    pui,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/pui.oa";
import {
    specialPassword,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/specialPassword.oa";
import {
    variablePassword,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/variablePassword.oa";
import {
    nbOfFailedAuthentications,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/nbOfFailedAuthentications.oa";
import {
    userCredit,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userCredit.oa";
import {
    callInfoRecords,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callInfoRecords.oa";
import {
    activeChargingService,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/activeChargingService.oa";
import {
    allowedServiceFeatures,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/allowedServiceFeatures.oa";
import {
    uptNumber,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/uptNumber.oa";
import {
    defaultChargingReference,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/defaultChargingReference.oa";
import {
    icRegistrationAddress,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/icRegistrationAddress.oa";
import {
    allowedRegistrationAddress,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/allowedRegistrationAddress.oa";
import {
    allowedDestinations,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/allowedDestinations.oa";
import {
    supplServId,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/supplServId.oa";
import {
    supplServiceStatus,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/supplServiceStatus.oa";
import {
    forwardedToNumber,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/forwardedToNumber.oa";
import {
    typesOfNotification,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/typesOfNotification.oa";
import {
    noReplyConditionTimer,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/noReplyConditionTimer.oa";

// Intelligent Networks Attribute Types
import {
    methodUse,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/methodUse.oa";
import {
    securityFacilityId,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/securityFacilityId.oa";
import {
    secretKey,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/secretKey.oa";
import {
    identifierList,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/identifierList.oa";
import {
    bindLevelIfOK,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/bindLevelIfOK.oa";
import {
    lockSession,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/lockSession.oa";
import {
    failureCounter,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/failureCounter.oa";
import {
    maxAttempts,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/maxAttempts.oa";
import {
    currentList,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/currentList.oa";
import {
    stockId,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/stockId.oa";
import {
    source,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/source.oa";
import {
    sizeOfRestocking,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/sizeOfRestocking.oa";
import {
    stock,
} from "@wildboar/parity-schema/src/lib/modules/IN-CS3-SCF-SDF-datatypes/stock.oa";

// CRMF Attribute Types
import {
    regCtrl_regToken,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-regToken.oa";
import {
    regCtrl_authenticator,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-authenticator.oa";
import {
    regCtrl_pkiPublicationInfo,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-pkiPublicationInfo.oa";
import {
    regCtrl_pkiArchiveOptions,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-pkiArchiveOptions.oa";
import {
    regCtrl_oldCertID,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-oldCertID.oa";
import {
    regCtrl_protocolEncrKey,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regCtrl-protocolEncrKey.oa";
import {
    regInfo_utf8Pairs,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regInfo-utf8Pairs.oa";
import {
    regInfo_certReq,
} from "@wildboar/parity-schema/src/lib/modules/PKIXCRMF-2009/regInfo-certReq.oa";

// Telebiometrics Authentication Infrastructure (TAI) Attribute Types
import {
    biometricInformationTemplate,
} from "@wildboar/parity-schema/src/lib/modules/TAI/biometricInformationTemplate.oa";
import {
    bioSecLevelReference,
} from "@wildboar/parity-schema/src/lib/modules/TAI/bioSecLevelReference.oa";
import {
    bDCReportContentInformation,
} from "@wildboar/parity-schema/src/lib/modules/TAI/bDCReportContentInformation.oa";

// X.952 Printer Service Offer Definitions (Commented out because it turns out this is just an example module.)
// import {
//     printerType,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/printerType.oa";
// import {
//     locationRoom,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/locationRoom.oa";
// import {
//     locationBuilding,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/locationBuilding.oa";
// import {
//     costPerPage,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/costPerPage.oa";
// import {
//     languagesSupported,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/languagesSupported.oa";
// import {
//     pagesPerMinute,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/pagesPerMinute.oa";
// import {
//     pageSize,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/pageSize.oa";
// import {
//     dotsPerInch,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/dotsPerInch.oa";
// import {
//     colourCapable,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/colourCapable.oa";
// import {
//     driverName,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/driverName.oa";
// import {
//     queueLength,
// } from "@wildboar/parity-schema/src/lib/modules/PrinterServiceOfferDefinitions/queueLength.oa";

// X.952 Trader Definitions
import {
    traderInterface,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderInterface.oa";
import {
    dsaName,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/dsaName.oa";
import {
    typeRepos,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/typeRepos.oa";
import {
    defSearchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defSearchCard.oa";
import {
    maxSearchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxSearchCard.oa";
import {
    defMatchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defMatchCard.oa";
import {
    maxMatchCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxMatchCard.oa";
import {
    defReturnCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defReturnCard.oa";
import {
    maxReturnCard,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxReturnCard.oa";
import {
    defHopCount,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defHopCount.oa";
import {
    maxHopCount,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxHopCount.oa";
import {
    defFollowPolicy,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defFollowPolicy.oa";
import {
    maxFollowPolicy,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxFollowPolicy.oa";
import {
    maxLinkFollowPolicy,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxLinkFollowPolicy.oa";
import {
    supportsModifiableProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/supportsModifiableProperties.oa";
import {
    supportsDynamicProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/supportsDynamicProperties.oa";
import {
    supportsProxyOffers,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/supportsProxyOffers.oa";
import {
    maxList,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/maxList.oa";
import {
    requestIdStem,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/requestIdStem.oa";
import {
    typeManagementConstraint,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/typeManagementConstraint.oa";
import {
    searchConstraint,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/searchConstraint.oa";
import {
    offerAcceptanceConstraint,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/offerAcceptanceConstraint.oa";
import {
    sOfferId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/sOfferId.oa";
import {
    serviceInterfaceId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceInterfaceId.oa";
import {
    serviceTypeId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceTypeId.oa";
import {
    hasDynamicProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/hasDynamicProperties.oa";
import {
    hasModifiableProperties,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/hasModifiableProperties.oa";
import {
    dynamicProps,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/dynamicProps.oa";
import {
    linkName,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/linkName.oa";
import {
    linkId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/linkId.oa";
import {
    targetTraderInterfaceId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/targetTraderInterfaceId.oa";
import {
    defPassOnFollowRule,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/defPassOnFollowRule.oa";
import {
    limitingFollowRule,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/limitingFollowRule.oa";
import {
    proxyOfferId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyOfferId.oa";
import {
    proxyLookUpInterfaceId,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyLookUpInterfaceId.oa";
import {
    constraintRecipe,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/constraintRecipe.oa";
import {
    ifMatchAll,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/ifMatchAll.oa";
import {
    interfaceReference,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/interfaceReference.oa";
import {
    interfaceType,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/interfaceType.oa";

// Matching Rules Suitable for Naming
import {
    addressCapabilitiesMatch,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/addressCapabilitiesMatch.oa";
import {
    capabilityMatch,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/capabilityMatch.oa";
import {
    oRNameExactMatch,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/oRNameExactMatch.oa";
import {
    mSStringMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringMatch.oa";
import {
    mSStringCaseSensitiveMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringCaseSensitiveMatch.oa";
import {
    mSStringListMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringListMatch.oa";
import {
    mSStringListElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringListElementsMatch.oa";
import {
    mSSingleSubstringListMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSSingleSubstringListMatch.oa";
import {
    mSSingleSubstringListElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSSingleSubstringListElementsMatch.oa";
import {
    oRAddressMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRAddressMatch.oa";
import {
    oRAddressElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRAddressElementsMatch.oa";
import {
    oRAddressSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRAddressSubstringElementsMatch.oa";
import {
    oRNameMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRNameMatch.oa";
import {
    oRNameElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRNameElementsMatch.oa";
import {
    oRNameSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRNameSubstringElementsMatch.oa";
import {
    redirectionOrDLExpansionMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionOrDLExpansionMatch.oa";
import {
    redirectionOrDLExpansionElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionOrDLExpansionElementsMatch.oa";
import {
    redirectionOrDLExpansionSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionOrDLExpansionSubstringElementsMatch.oa";
import {
    mTSIdentifierMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mTSIdentifierMatch.oa";
import {
    contentCorrelatorMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/contentCorrelatorMatch.oa";
import {
    contentIdentifierMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/contentIdentifierMatch.oa";
import {
    iPMIdentifierMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/iPMIdentifierMatch.oa";
import {
    oRDescriptorMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/oRDescriptorMatch.oa";
import {
    oRDescriptorElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/oRDescriptorElementsMatch.oa";
import {
    oRDescriptorSingleElementMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/oRDescriptorSingleElementMatch.oa";
import {
    recipientSpecifierMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/recipientSpecifierMatch.oa";
import {
    recipientSpecifierElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/recipientSpecifierElementsMatch.oa";
import {
    recipientSpecifierSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/recipientSpecifierSubstringElementsMatch.oa";
import {
    circulationMemberMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberMatch.oa";
import {
    circulationMemberElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberElementsMatch.oa";
import {
    circulationMemberSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberSubstringElementsMatch.oa";
import {
    distributionCodeMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/distributionCodeMatch.oa";
import {
    informationCategoryMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/informationCategoryMatch.oa";
import {
    policySpecificationMatch,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/policySpecificationMatch.oa";
import {
    pkcs9CaseIgnoreMatch,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/pkcs9CaseIgnoreMatch.oa";
import {
    signingTimeMatch,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/signingTimeMatch.oa";
import {
    directoryStringApproxMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/directoryStringApproxMatch.oa";
import {
    ia5StringApproxMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/ia5StringApproxMatch.oa";
import {
    integerBitAndMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/integerBitAndMatch.oa";
import {
    integerBitOrMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/integerBitOrMatch.oa";
import {
    uuidMatch,
} from "@wildboar/parity-schema/src/lib/modules/UUID/uuidMatch.oa";

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
        // numSubordinates,
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
        // pwdLockout,
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
    ctx.attributeTypes.get(x500at.accessControlScheme["&id"].toString())!.driver = accessControlSchemeDriver;
    ctx.attributeTypes.get(x500at.accessControlSubentryList["&id"].toString())!.driver = accessControlSubentryListDriver;
    ctx.attributeTypes.get(x500at.aliasedEntryName["&id"].toString())!.driver = aliasedEntryNameDriver;
    ctx.attributeTypes.get(administratorsAddress["&id"].toString())!.driver = administratorsAddressDriver;
    ctx.attributeTypes.get(x500at.administrativeRole["&id"].toString())!.driver = administrativeRoleDriver;
    ctx.attributeTypes.get(x500at.altServer["&id"].toString())!.driver = altServerDriver;
    ctx.attributeTypes.get(x500at.attributeTypes["&id"].toString())!.driver = attributeTypesDriver;
    ctx.attributeTypes.get(x500at.clearance["&id"].toString())!.driver = clearanceDriver;
    ctx.attributeTypes.get(x500at.collectiveAttributeSubentryList["&id"].toString())!.driver = collectiveAttributeSubentryListDriver;
    ctx.attributeTypes.get(x500at.collectiveExclusions["&id"].toString())!.driver = collectiveExclusionsDriver;
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
    ctx.attributeTypes.get(x500at.entryACI["&id"].toString())!.driver = entryACIDriver;
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
    ctx.attributeTypes.get(x500at.objectClass["&id"].toString())!.driver = objectClassDriver;
    ctx.attributeTypes.get(x500at.objectClasses["&id"].toString())!.driver = objectClassesDriver;
    ctx.attributeTypes.get(x500at.prescriptiveACI["&id"].toString())!.driver = prescriptiveACIDriver;
    ctx.attributeTypes.get(x500at.pwdAdminSubentryList["&id"].toString())!.driver = pwdAdminSubentryListDriver;
    ctx.attributeTypes.get(x500at.pwdEncAlg["&id"].toString())!.driver = pwdEncAlgDriver;
    ctx.attributeTypes.get(x500at.pwdFailureDuration["&id"].toString())!.driver = pwdFailureDurationDriver;
    ctx.attributeTypes.get(x500at.searchRules["&id"].toString())!.driver = searchRulesDriver;
    ctx.attributeTypes.get(x500at.secondaryShadows["&id"].toString())!.driver = secondaryShadowsDriver;
    ctx.attributeTypes.get(x500at.serviceAdminSubentryList["&id"].toString())!.driver = serviceAdminSubentryListDriver;
    ctx.attributeTypes.get(x500at.specificKnowledge["&id"].toString())!.driver = specificKnowledgeDriver;
    ctx.attributeTypes.get(x500at.structuralObjectClass["&id"].toString())!.driver = structuralObjectClassDriver;
    ctx.attributeTypes.get(x500at.subentryACI["&id"].toString())!.driver = subentryACIDriver;
    ctx.attributeTypes.get(x500at.subschemaSubentryList["&id"].toString())!.driver = subschemaSubentryListDriver;
    ctx.attributeTypes.get(x500at.subtreeSpecification["&id"].toString())!.driver = subtreeSpecificationDriver;
    ctx.attributeTypes.get(x500at.superiorKnowledge["&id"].toString())!.driver = superiorKnowledgeDriver;
    ctx.attributeTypes.get(superiorUUID["&id"].toString())!.driver = superiorUUIDDriver;
    ctx.attributeTypes.get(x500at.supplierKnowledge["&id"].toString())!.driver = supplierKnowledgeDriver;
    ctx.attributeTypes.get(x500at.supportedControl["&id"].toString())!.driver = supportedControlDriver;
    ctx.attributeTypes.get(x500at.supportedExtension["&id"].toString())!.driver = supportedExtensionDriver;
    ctx.attributeTypes.get(x500at.supportedFeatures["&id"].toString())!.driver = supportedFeaturesDriver;
    ctx.attributeTypes.get(x500at.supportedLDAPVersion["&id"].toString())!.driver = supportedLDAPVersionDriver;
    ctx.attributeTypes.get(x500at.supportedSASLMechanisms["&id"].toString())!.driver = supportedSASLMechanismsDriver;
    ctx.attributeTypes.get(syncTimestamp["&id"].toString())!.driver = syncTimestampDriver;
    ctx.attributeTypes.get(x500at.uniqueIdentifier["&id"].toString())!.driver = uniqueIdentifierDriver;
    ctx.attributeTypes.get(x500at.userPassword["&id"].toString())!.driver = userPasswordDriver;
    ctx.attributeTypes.get(x500at.userPwd["&id"].toString())!.driver = userPwdDriver;
    ctx.attributeTypes.get(userPwdHistory["&id"].toString())!.driver = userPwdHistoryDriver;
    // ctx.attributeTypes.get(userPwdRecentlyExpired["&id"].toString())!.driver = userPwdRecentlyExpiredDriver;
    ctx.attributeTypes.get(vendorName["&id"].toString())!.driver = vendorNameDriver;
    ctx.attributeTypes.get(vendorVersion["&id"].toString())!.driver = vendorVersionDriver;
}

export default loadAttributeTypes;
