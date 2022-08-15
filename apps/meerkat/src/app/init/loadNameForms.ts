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
