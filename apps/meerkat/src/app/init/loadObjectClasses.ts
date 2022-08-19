import { Context } from "@wildboar/meerkat-types";
import objectClassFromInformationObject from "./objectClassFromInformationObject";
import * as x500oc from "@wildboar/x500/src/lib/collections/objectClasses";
import { ObjectClassKind as PrismaObjectClassKind } from "@prisma/client";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ObjectIdentifier } from "asn1-ts";
import { AssertionError } from "assert";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa";
import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa";
import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa";
import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa";
import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";
import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa";
import { pwdDictionaries } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa";
import { pwdExpiryWarning } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryWarning.oa";
import { pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGraces.oa";
import { pwdFailureDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
import { pwdLockoutDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdLockoutDuration.oa";
import { pwdMaxFailures } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxFailures.oa";
import { pwdMaxTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxTimeInHistory.oa";
import { pwdMinTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinTimeInHistory.oa";
import { pwdHistorySlots } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdHistorySlots.oa";
import { pwdRecentlyExpiredDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdRecentlyExpiredDuration.oa";
import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";

// X.400 Object Classes
import {
    mhs_distribution_list,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-distribution-list.oa";
import {
    mhs_message_store,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-message-store.oa";
import {
    mhs_message_transfer_agent,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-message-transfer-agent.oa";
import {
    mhs_user,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-user.oa";
import {
    mhs_user_agent,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-user-agent.oa";
import {
    routingCollective,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/routingCollective.oa";
import {
    routingMTA,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/routingMTA.oa";
import {
    connectionGroup,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/connectionGroup.oa";
import {
    mTAInformation,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/mTAInformation.oa";
import {
    oRAddressElement,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/oRAddressElement.oa";
import {
    oRAddressSubtreeBase,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/oRAddressSubtreeBase.oa";
import {
    mHSCountry,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCountry.oa";
import {
    mHSADMD,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSADMD.oa";
import {
    mHSPRMD,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPRMD.oa";
import {
    mHSOrganization,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganization.oa";
import {
    mHSOrganizationalUnit,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganizationalUnit.oa";
import {
    mHSCommonName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCommonName.oa";
import {
    mHSSurname,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSSurname.oa";
import {
    mHSGivenName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGivenName.oa";
import {
    mHSInitials,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSInitials.oa";
import {
    mHSGenerationQualifier,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGenerationQualifier.oa";
import {
    mHSNetworkAddress,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNetworkAddress.oa";
import {
    mHSExtendedNetworkAddress,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSExtendedNetworkAddress.oa";
import {
    mHSTerminalIdentifier,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalIdentifier.oa";
import {
    mHSTerminalType,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalType.oa";
import {
    mHSNumericUserIdentifier,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNumericUserIdentifier.oa";
import {
    mHSPDSName,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPDSName.oa";
import {
    mHSPhysicalDeliveryCountry,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPhysicalDeliveryCountry.oa";
import {
    mHSPostalCode,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPostalCode.oa";
import {
    edi_user,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-user.oa";
import {
    edi_user_agent,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-user-agent.oa";
import {
    edi_message_store,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-message-store.oa";

// X.700 Object Classes
import {
    asn1Module,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/asn1Module.oa";
import {
    managementAction,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementAction.oa";
import {
    managementAttributeGroup,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementAttributeGroup.oa";
import {
    managementAttribute,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementAttribute.oa";
import {
    managementBehaviour,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementBehaviour.oa";
import {
    managementDocument,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementDocument.oa";
import {
    managementNameBinding,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementNameBinding.oa";
import {
    managementNotification,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementNotification.oa";
import {
    managementObjectClass,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementObjectClass.oa";
import {
    managementPackage,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementPackage.oa";
import {
    managementParameter,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementParameter.oa";
import {
    managementTemplate,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/managementTemplate.oa";
import {
    registeredInformation,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/registeredInformation.oa";
import {
    managementRelationshipClass,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/managementRelationshipClass.oa";
import {
    managementRelationshipMapping,
} from "@wildboar/x700/src/lib/modules/GrmDefinitionDirectoryASN1Module/managementRelationshipMapping.oa";
import {
    cMISE,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/cMISE.oa";
import {
    sMASE,
} from "@wildboar/x700/src/lib/modules/RepertoireDirectoryASN1Module/sMASE.oa";

// PKCS #9 Object Classes
import {
    pkcsEntity,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/pkcsEntity.oa";
import {
    naturalPerson,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/naturalPerson.oa";

function prismaOCK2OCK (ock: PrismaObjectClassKind): ObjectClassKind {
    switch (ock) {
    case (PrismaObjectClassKind.ABSTRACT): {
        return ObjectClassKind_abstract;
    }
    case (PrismaObjectClassKind.AUXILIARY): {
        return ObjectClassKind_auxiliary;
    }
    case (PrismaObjectClassKind.STRUCTURAL): {
        return ObjectClassKind_structural;
    }
    default: throw new AssertionError();
    }
}

/**
 * @summary Initialize Meerkat DSA's internal index of known object classes.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known object classes.
 *
 * @param ctx The context object
 *
 * @function
 * @async
 */
export
async function loadObjectClasses (ctx: Context): Promise<void> {
    const objectClassInfoObjects = [
        ...Object.values(x500oc),
        mhs_distribution_list,
        mhs_message_store,
        mhs_message_transfer_agent,
        mhs_user,
        mhs_user_agent,
        routingCollective,
        routingMTA,
        connectionGroup,
        mTAInformation,
        oRAddressElement,
        oRAddressSubtreeBase,
        mHSCountry,
        mHSADMD,
        mHSPRMD,
        mHSOrganization,
        mHSOrganizationalUnit,
        mHSCommonName,
        mHSSurname,
        mHSGivenName,
        mHSInitials,
        mHSGenerationQualifier,
        mHSNetworkAddress,
        mHSExtendedNetworkAddress,
        mHSTerminalIdentifier,
        mHSTerminalType,
        mHSNumericUserIdentifier,
        mHSPDSName,
        mHSPhysicalDeliveryCountry,
        mHSPostalCode,
        edi_user,
        edi_user_agent,
        edi_message_store,
        asn1Module,
        managementAction,
        managementAttributeGroup,
        managementAttribute,
        managementBehaviour,
        managementDocument,
        managementNameBinding,
        managementNotification,
        managementObjectClass,
        managementPackage,
        managementParameter,
        managementTemplate,
        registeredInformation,
        managementRelationshipClass,
        managementRelationshipMapping,
        cMISE,
        sMASE,
        pkcsEntity,
        naturalPerson,
    ];
    objectClassInfoObjects
        .map(objectClassFromInformationObject)
        .forEach((oc) => {
            ctx.objectClasses.set(oc.id.toString(), oc);
        });
    const ocs = await ctx.db.objectClassDescription.findMany({
        where: {
            entry_id: null,
        },
    });
    for (const oc of ocs) {
        ctx.objectClasses.set(oc.identifier, {
            id: ObjectIdentifier.fromString(oc.identifier),
            name: oc.ldapNames?.split(" ") ?? undefined,
            superclasses: new Set(oc.subclassOf?.split(" ")),
            kind: prismaOCK2OCK(oc.kind),
            mandatoryAttributes: new Set(oc.mandatories?.split(" ")),
            optionalAttributes: new Set(oc.optionals?.split(" ")),
            obsolete: oc.obsolete,
            ldapNames: oc.ldapNames?.split(" ") ?? undefined,
            ldapDescription: oc.ldapDescription ?? undefined,
        });
    }

    /**
     * ITU Recommendation X.501 (2019), Section 14.9 states that subentries of
     * object class `pwdAdminSubentry` may contain additional attributes that
     * are not present in the ASN.1 specification. This appears to be a mistake
     * in the specification. Here, Meerkat DSA's internal representation of the
     * `pwdAdminSubentry` is overwritten by what is believed to be a correct
     * definition.
     */
    ctx.objectClasses.set(pwdAdminSubentry["&id"].toString(), {
        ...objectClassFromInformationObject(pwdAdminSubentry),
        optionalAttributes: new Set([
            pwdModifyEntryAllowed["&id"].toString(),
            pwdChangeAllowed["&id"].toString(),
            pwdMaxAge["&id"].toString(),
            pwdExpiryAge["&id"].toString(),
            pwdMinLength["&id"].toString(),
            pwdVocabulary["&id"].toString(),
            pwdAlphabet["&id"].toString(),
            pwdDictionaries["&id"].toString(),
            pwdExpiryWarning["&id"].toString(),
            pwdGraces["&id"].toString(),
            pwdFailureDuration["&id"].toString(),
            pwdLockoutDuration["&id"].toString(),
            pwdMaxFailures["&id"].toString(),
            pwdMaxTimeInHistory["&id"].toString(),
            pwdMinTimeInHistory["&id"].toString(),
            pwdHistorySlots["&id"].toString(),
            pwdRecentlyExpiredDuration["&id"].toString(),
            pwdEncAlg["&id"].toString(),
        ]),
    });
}

export default loadObjectClasses;
