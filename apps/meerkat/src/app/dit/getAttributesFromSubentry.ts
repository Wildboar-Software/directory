import type { Vertex, Context } from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { readAttributes } from "../database/entry/readAttributes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import {
    entryUUID,
} from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa";
import {
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa";
import { TRUE } from "asn1-ts";

/**
 * @summary Reads a specific subset of attributes from a subentry
 * @description
 *
 * This function reads a specific subset of attributes from a subentry. It's
 * purpose is for constructing subentry information when establishing
 * hierarchical operational bindings.
 *
 * @param subentry The subentry vertex whose attributes are to be read
 * @returns An array of attributes from the subentry
 *
 * @function
 */
export
async function getAttributesFromSubentry (ctx: Context, subentry: Vertex): Promise<Attribute[]> {
    if (!subentry.dse.subentry) {
        return [];
    }

    const {
        userAttributes,
        operationalAttributes,
    } = await readAttributes(ctx, subentry, {
        selection: new EntryInformationSelection(
            {
                select: [
                    x500at.commonName["&id"],
                    x500at.pwdAttribute["&id"],
                    x500at.objectClass["&id"],
                ],
            },
            undefined,
            {
                select: [
                    x500at.attributeTypes["&id"],
                    x500at.contextAssertionDefaults["&id"],
                    x500at.contextTypes["&id"],
                    x500at.createTimestamp["&id"],
                    x500at.dITContentRules["&id"],
                    x500at.dITContextUse["&id"],
                    x500at.dITStructureRules["&id"],
                    x500at.dseType["&id"],
                    x500at.entryACI["&id"],
                    x500at.friends["&id"],
                    x500at.governingStructureRule["&id"],
                    x500at.ldapSyntaxes["&id"],
                    x500at.matchingRules["&id"],
                    x500at.matchingRuleUse["&id"],
                    x500at.modifyTimestamp["&id"],
                    x500at.nameForms["&id"],
                    x500at.objectClasses["&id"],
                    x500at.prescriptiveACI["&id"],
                    x500at.pwdAlphabet["&id"],
                    x500at.pwdChangeAllowed["&id"],
                    x500at.pwdDictionaries["&id"],
                    x500at.pwdEncAlg["&id"],
                    x500at.pwdExpiryAge["&id"],
                    x500at.pwdExpiryWarning["&id"],
                    x500at.pwdFailureDuration["&id"],
                    x500at.pwdGraces["&id"],
                    x500at.pwdHistorySlots["&id"],
                    x500at.pwdLockoutDuration["&id"],
                    x500at.pwdMaxAge["&id"],
                    x500at.pwdMaxFailures["&id"],
                    x500at.pwdMaxTimeInHistory["&id"],
                    x500at.pwdMinLength["&id"],
                    x500at.pwdMinTimeInHistory["&id"],
                    x500at.pwdModifyEntryAllowed["&id"],
                    x500at.pwdRecentlyExpiredDuration["&id"],
                    x500at.pwdVocabulary["&id"],
                    x500at.searchRules["&id"],
                    x500at.structuralObjectClass["&id"],
                    x500at.subschemaTimestamp["&id"],
                    x500at.subtreeSpecification["&id"],
                    entryUUID["&id"],
                    entryDN["&id"],
                    superiorUUID["&id"],
                ],
            },
            {
                allContexts: null,
            },
            TRUE,
            undefined,
        ),
    });

    return [
        ...userAttributes,
        ...operationalAttributes,
        ...subentry.dse.subentry.collectiveAttributes ?? [],
    ];
}

export default getAttributesFromSubentry;
