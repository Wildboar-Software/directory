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

// Drivers
import accessControlSchemeDriver from "../database/drivers/accessControlScheme";
import accessControlSubentryListDriver from "../database/drivers/accessControlSubentryList";
import administrativeRoleDriver from "../database/drivers/administrativeRole";
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
import entryACIDriver from "../database/drivers/entryACI";
import entryUUIDDriver from "../database/drivers/entryUUID";
import family_informationDriver from "../database/drivers/family_information";
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
import supplierKnowledgeDriver from "../database/drivers/supplierKnowledge";
import supportedControlDriver from "../database/drivers/supportedControl";
import supportedExtensionDriver from "../database/drivers/supportedExtension";
import supportedFeaturesDriver from "../database/drivers/supportedFeatures";
import supportedLDAPVersionDriver from "../database/drivers/supportedLDAPVersion";
import supportedSASLMechanismsDriver from "../database/drivers/supportedSASLMechanisms";
import uniqueIdentifierDriver from "../database/drivers/uniqueIdentifier";
import userPasswordDriver from "../database/drivers/userPassword";
import userPwdDriver from "../database/drivers/userPwd";
import userPwdHistoryDriver from "../database/drivers/userPwdHistory";

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
        ...x500at,
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
    ctx.attributeTypes.get(x500at.accessControlScheme["&id"].toString())!.driver = accessControlSchemeDriver;
    ctx.attributeTypes.get(x500at.accessControlSubentryList["&id"].toString())!.driver = accessControlSubentryListDriver;
    ctx.attributeTypes.get(x500at.aliasedEntryName["&id"].toString())!.driver = aliasedEntryNameDriver;
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
    ctx.attributeTypes.get(x500at.dseType["&id"].toString())!.driver = dseTypeDriver;
    ctx.attributeTypes.get(x500at.entryACI["&id"].toString())!.driver = entryACIDriver;
    ctx.attributeTypes.get(entryUUID.id.toString())!.driver = entryUUIDDriver;
    ctx.attributeTypes.get(x500at.family_information["&id"].toString())!.driver = family_informationDriver;
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
    ctx.attributeTypes.get(x500at.supplierKnowledge["&id"].toString())!.driver = supplierKnowledgeDriver;
    ctx.attributeTypes.get(x500at.supportedControl["&id"].toString())!.driver = supportedControlDriver;
    ctx.attributeTypes.get(x500at.supportedExtension["&id"].toString())!.driver = supportedExtensionDriver;
    ctx.attributeTypes.get(x500at.supportedFeatures["&id"].toString())!.driver = supportedFeaturesDriver;
    ctx.attributeTypes.get(x500at.supportedLDAPVersion["&id"].toString())!.driver = supportedLDAPVersionDriver;
    ctx.attributeTypes.get(x500at.supportedSASLMechanisms["&id"].toString())!.driver = supportedSASLMechanismsDriver;
    ctx.attributeTypes.get(x500at.uniqueIdentifier["&id"].toString())!.driver = uniqueIdentifierDriver;
    ctx.attributeTypes.get(x500at.userPassword["&id"].toString())!.driver = userPasswordDriver;
    ctx.attributeTypes.get(x500at.userPwd["&id"].toString())!.driver = userPwdDriver;
    ctx.attributeTypes.get(userPwdHistory["&id"].toString())!.driver = userPwdHistoryDriver;
    // ctx.attributeTypes.get(userPwdRecentlyExpired["&id"].toString())!.driver = userPwdRecentlyExpiredDriver;
}

export default loadAttributeTypes;
