import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import * as x500nf from "@wildboar/x500/src/lib/collections/nameForms";
import nameFormFromInformationObject from "./nameFormFromInformationObject";

// X.400 Name Forms
import {
    routingCollectiveNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/routingCollectiveNameForm.oa";
import {
    connectionGroupNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingDirectoryObjects/connectionGroupNameForm.oa";
import {
    mHSCountryNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCountryNameForm.oa";
import {
    mHSADMDNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSADMDNameForm.oa";
import {
    mHSPRMDNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPRMDNameForm.oa";
import {
    mHSOrganizationNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganizationNameForm.oa";
import {
    mHSOrganizationalUnitNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSOrganizationalUnitNameForm.oa";
import {
    mHSCommonNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSCommonNameForm.oa";
import {
    mHSSurnameNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSSurnameNameForm.oa";
import {
    mHSGivenNameNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGivenNameNameForm.oa";
import {
    mHSInitialsNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSInitialsNameForm.oa";
import {
    mHSGenerationQualifierNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSGenerationQualifierNameForm.oa";
import {
    mHSNetworkAddressNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNetworkAddressNameForm.oa";
import {
    mHSExtendedNetworkAddressNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSExtendedNetworkAddressNameForm.oa";
import {
    mHSTerminalIdentifierNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalIdentifierNameForm.oa";
import {
    mHSTerminalTypeNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSTerminalTypeNameForm.oa";
import {
    mHSNumericUserIdentifierNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSNumericUserIdentifierNameForm.oa";
import {
    mHSPDSNameNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPDSNameNameForm.oa";
import {
    mHSPhysicalDeliveryCountryNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPhysicalDeliveryCountryNameForm.oa";
import {
    mHSPostalCodeNameForm,
} from "@wildboar/x400/src/lib/modules/MHSRoutingORAddressSubtree/mHSPostalCodeNameForm.oa";

// X.700 Name Froms
import {
    registeredInformationNameForm,
} from "@wildboar/x700/src/lib/modules/DefinitionDirectoryASN1Module/registeredInformationNameForm.oa";

// IANA LDAP Parity Name Forms
import {
    accountNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/accountNameForm.oa";
import {
    documentNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentNameForm.oa";
import {
    documentSeriesNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/documentSeriesNameForm.oa";
import {
    domainNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/domainNameForm.oa";
import {
    friendlyCountryNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/friendlyCountryNameForm.oa";
import {
    pilotPersonNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pilotPersonNameForm.oa";
import {
    roomNameForm,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/roomNameForm.oa";
import {
    duaConfigProfileNameForm,
} from "@wildboar/parity-schema/src/lib/modules/DUAConf/duaConfigProfileNameForm.oa";
import {
    fedfsFsnNameForm,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsFsnNameForm.oa";
import {
    fedfsNfsFslNameForm,
} from "@wildboar/parity-schema/src/lib/modules/FedFSSchema/fedfsNfsFslNameForm.oa";
import {
    inetOrgPersonNameForm,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPersonNameForm.oa";
import {
    groupOfEntriesNameForm,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/groupOfEntriesNameForm.oa";
import {
    providerNameForm,
} from "@wildboar/parity-schema/src/lib/modules/RFC6109CertifiedElectronicMail/providerNameForm.oa";
import {
    printerServiceNameForm,
} from "@wildboar/parity-schema/src/lib/modules/RFC7612Printer/printerServiceNameForm.oa";
import {
    tableNameForm,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/tableNameForm.oa";
import {
    textTableEntryNameForm,
} from "@wildboar/parity-schema/src/lib/modules/TableFramework/textTableEntryNameForm.oa";
import {
    uddiAddressNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiAddressNameForm.oa";
import {
    uddiBindingTemplateNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBindingTemplateNameForm.oa";
import {
    uddiBusinessEntityNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessEntityNameForm.oa";
import {
    uddiBusinessServiceNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiBusinessServiceNameForm.oa";
import {
    uddiContactNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiContactNameForm.oa";
import {
    uddiPublisherAssertionNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiPublisherAssertionNameForm.oa";
import {
    uddiTModelInstanceInfoNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelInstanceInfoNameForm.oa";
import {
    uddiTModelNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiTModelNameForm.oa";
import {
    uddiv3EntityObituaryNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3EntityObituaryNameForm.oa";
import {
    uddiv3SubscriptionNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UDDI-Schema/uddiv3SubscriptionNameForm.oa";

import {
    traderPolicyEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderPolicyEntryNF.oa";
import {
    serviceOfferEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/serviceOfferEntryNF.oa";
import {
    traderLinkEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/traderLinkEntryNF.oa";
import {
    proxyOfferEntryNF,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/proxyOfferEntryNF.oa";
import {
    uptProviderNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/uptProviderNameForm.oa";
import {
    partnerNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/partnerNameForm.oa";
import {
    adminUnitNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/adminUnitNameForm.oa";
import {
    agreedServiceNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/agreedServiceNameForm.oa";
import {
    userProfileNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfileNameForm.oa";
import {
    userProfileAliasNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/userProfileAliasNameForm.oa";
import {
    calledUptUserNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/calledUptUserNameForm.oa";
import {
    callingUptUserNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callingUptUserNameForm.oa";
import {
    callForwardingNameForm,
} from "@wildboar/parity-schema/src/lib/modules/UPT-DataModel/callForwardingNameForm.oa";

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
