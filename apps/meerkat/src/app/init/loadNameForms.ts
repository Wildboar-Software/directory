import type { Context } from "../types/index.js";
import { ObjectIdentifier } from "@wildboar/asn1";
import { nameForms as x500nf } from "@wildboar/x500";
import nameFormFromInformationObject from "./nameFormFromInformationObject.js";

// X.400 Name Forms
import {
    routingCollectiveNameForm,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    connectionGroupNameForm,
} from "@wildboar/x400/MHSRoutingDirectoryObjects";
import {
    mHSCountryNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSADMDNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPRMDNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSOrganizationNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSOrganizationalUnitNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSCommonNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSSurnameNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSGivenNameNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSInitialsNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSGenerationQualifierNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSNetworkAddressNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSExtendedNetworkAddressNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSTerminalIdentifierNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSTerminalTypeNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSNumericUserIdentifierNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPDSNameNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPhysicalDeliveryCountryNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";
import {
    mHSPostalCodeNameForm,
} from "@wildboar/x400/MHSRoutingORAddressSubtree";

// X.700 Name Froms
import {
    registeredInformationNameForm,
} from "@wildboar/x700/DefinitionDirectoryASN1Module";

// IANA LDAP Parity Name Forms
import {
    accountNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/accountNameForm.oa.js";
import {
    documentNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentNameForm.oa.js";
import {
    documentSeriesNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentSeriesNameForm.oa.js";
import {
    domainNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/domainNameForm.oa.js";
import {
    friendlyCountryNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/friendlyCountryNameForm.oa.js";
import {
    pilotPersonNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotPersonNameForm.oa.js";
import {
    roomNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/roomNameForm.oa.js";
import {
    duaConfigProfileNameForm,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/duaConfigProfileNameForm.oa.js";
import {
    fedfsFsnNameForm,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsnNameForm.oa.js";
import {
    fedfsNfsFslNameForm,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsFslNameForm.oa.js";
import {
    inetOrgPersonNameForm,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPersonNameForm.oa.js";
import {
    groupOfEntriesNameForm,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/groupOfEntriesNameForm.oa.js";
import {
    providerNameForm,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerNameForm.oa.js";
import {
    printerServiceNameForm,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerServiceNameForm.oa.js";
import {
    tableNameForm,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/tableNameForm.oa.js";
import {
    textTableEntryNameForm,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableEntryNameForm.oa.js";
import {
    uddiAddressNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAddressNameForm.oa.js"
import {
    uddiBindingTemplateNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBindingTemplateNameForm.oa.js"
import {
    uddiBusinessEntityNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessEntityNameForm.oa.js"
import {
    uddiBusinessServiceNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessServiceNameForm.oa.js"
import {
    uddiContactNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiContactNameForm.oa.js"
import {
    uddiPublisherAssertionNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPublisherAssertionNameForm.oa.js"
import {
    uddiTModelInstanceInfoNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelInstanceInfoNameForm.oa.js"
import {
    uddiTModelNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelNameForm.oa.js"
import {
    uddiv3EntityObituaryNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityObituaryNameForm.oa.js"
import {
    uddiv3SubscriptionNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3SubscriptionNameForm.oa.js"

import {
    traderPolicyEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderPolicyEntryNF.oa.js";
import {
    serviceOfferEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceOfferEntryNF.oa.js";
import {
    traderLinkEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderLinkEntryNF.oa.js";
import {
    proxyOfferEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyOfferEntryNF.oa.js";
import {
    uptProviderNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/uptProviderNameForm.oa.js"
import {
    partnerNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/partnerNameForm.oa.js"
import {
    adminUnitNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/adminUnitNameForm.oa.js"
import {
    agreedServiceNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/agreedServiceNameForm.oa.js"
import {
    userProfileNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfileNameForm.oa.js"
import {
    userProfileAliasNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfileAliasNameForm.oa.js"
import {
    calledUptUserNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/calledUptUserNameForm.oa.js"
import {
    callingUptUserNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callingUptUserNameForm.oa.js"
import {
    callForwardingNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callForwardingNameForm.oa.js"
import { nameForms as schemaLevelIINameForms } from "@wildboar/schema-level-ii";

/**
 * @summary Initialize Meerkat DSA's internal index of known name forms.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known name forms.
 *
 * @param ctx The context object
 *
 * @function
 */
export
async function loadNameForms (ctx: Context): Promise<void> {
    const nameFormInfoObjects = {
        ...x500nf,

        // X.400 Name Forms
        routingCollectiveNameForm,
        connectionGroupNameForm,
        mHSCountryNameForm,
        mHSADMDNameForm,
        mHSPRMDNameForm,
        mHSOrganizationNameForm,
        mHSOrganizationalUnitNameForm,
        mHSCommonNameForm,
        mHSSurnameNameForm,
        mHSGivenNameNameForm,
        mHSInitialsNameForm,
        mHSGenerationQualifierNameForm,
        mHSNetworkAddressNameForm,
        mHSExtendedNetworkAddressNameForm,
        mHSTerminalIdentifierNameForm,
        mHSTerminalTypeNameForm,
        mHSNumericUserIdentifierNameForm,
        mHSPDSNameNameForm,
        mHSPhysicalDeliveryCountryNameForm,
        mHSPostalCodeNameForm,

        // X.700 Name Forms
        registeredInformationNameForm,

        // IANA LDAP Parity Name Forms
        accountNameForm,
        documentNameForm,
        documentSeriesNameForm,
        domainNameForm,
        friendlyCountryNameForm,
        pilotPersonNameForm,
        roomNameForm,
        duaConfigProfileNameForm,
        fedfsFsnNameForm,
        fedfsNfsFslNameForm,
        inetOrgPersonNameForm,
        groupOfEntriesNameForm,
        providerNameForm,
        printerServiceNameForm,
        tableNameForm,
        textTableEntryNameForm,
        uddiAddressNameForm,
        uddiBindingTemplateNameForm,
        uddiBusinessEntityNameForm,
        uddiBusinessServiceNameForm,
        uddiContactNameForm,
        uddiPublisherAssertionNameForm,
        uddiTModelInstanceInfoNameForm,
        uddiTModelNameForm,
        uddiv3EntityObituaryNameForm,
        uddiv3SubscriptionNameForm,

        // X.952 and UPT Name Forms
        traderPolicyEntryNF,
        serviceOfferEntryNF,
        traderLinkEntryNF,
        proxyOfferEntryNF,
        uptProviderNameForm,
        partnerNameForm,
        adminUnitNameForm,
        agreedServiceNameForm,
        userProfileNameForm,
        userProfileAliasNameForm,
        calledUptUserNameForm,
        callingUptUserNameForm,
        callForwardingNameForm,
        ...schemaLevelIINameForms,
    };
    Object.entries(nameFormInfoObjects)
        .map(([ name, io ]) => nameFormFromInformationObject(io, io["&ldapName"] ?? [ name ]))
        .forEach((nf) => {
            ctx.nameForms.set(nf.id.toString(), nf);
        });
    const nameForms = await ctx.db.nameForm.findMany({
        where: {
            entry_id: null,
        },
    });
    for (const nameForm of nameForms) {
        ctx.nameForms.set(nameForm.identifier, {
            id: ObjectIdentifier.fromString(nameForm.identifier),
            name: nameForm.name?.split("|"),
            description: nameForm.description ?? undefined,
            obsolete: nameForm.obsolete,
            namedObjectClass: ObjectIdentifier.fromString(nameForm.namedObjectClass),
            mandatoryAttributes: nameForm.mandatoryAttributes
                .split(" ")
                .map(ObjectIdentifier.fromString),
            optionalAttributes: nameForm.optionalAttributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString) ?? [],
        });
    }
}

export default loadNameForms;
