import type { ClientAssociation, Context, Vertex } from "@wildboar/meerkat-types";
import {
    Attribute,
    type EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import readEntryInformation from "./readEntryInformation";
import { TRUE, type OBJECT_IDENTIFIER } from "asn1-ts";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import attributesFromValues from "../../x500/attributesFromValues";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import accessControlSchemesThatUseACIItems from "../../authz/accessControlSchemesThatUseACIItems";
import type { ReadAttributesOptions } from "./readAttributes";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import bacSettings from "../../authz/bacSettings";
import isOperationalAttributeType from "../../x500/isOperationalAttributeType";
import accessControlSchemesThatUseRBAC from "../../authz/accessControlSchemesThatUseRBAC";
import { EntryInformationSelection } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { attributeValueSecurityLabelContext } from "@wildboar/x500/src/lib/collections/contexts";
import { rbacACDF } from "../../authz/rbacACDF";
import { Attribute_valuesWithContext_Item } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import { attributeTypesOnly } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";

export
interface ReadPermittedEntryInformationReturn {
    incompleteEntry: boolean;
    information: EntryInformation_information_Item[];
    discloseIncompleteEntry: boolean;
}

/**
 * @summary Read the entry information of an entry that is permitted by access controls
 * @description
 *
 * ITU Recommendation X.511 defines the `EntryInformation` type, whose
 * `information` component is a `SET` of `CHOICE`, where the alternatives of
 * each choice are either an attribute, or merely an attribute type.
 *
 * ```asn1
 * EntryInformation ::= SEQUENCE {
 *   name                  Name,
 *   fromEntry             BOOLEAN DEFAULT TRUE,
 *   information           SET SIZE (1..MAX) OF CHOICE {
 *     attributeType         AttributeType,
 *     attribute             Attribute{{SupportedAttributes}},
 *     ...} OPTIONAL,
 *   incompleteEntry  [3]  BOOLEAN DEFAULT FALSE,
 *   partialName      [4]  BOOLEAN DEFAULT FALSE,
 *   derivedEntry     [5]  BOOLEAN DEFAULT FALSE,
 *   ... }
 * ```
 *
 * Reading this information may be subject to access controls. As such, some of
 * it may get filtered out from what is ultimately returned to the user. Whether
 * any of this information is filtered out may be indicated to the user via the
 * `incompleteEntry` flag shown in the ASN.1 definition above, but this too is
 * subject to access controls. Access controls may prevent the DSA from even
 * disclosing that any information was withheld at all.
 *
 * As such, this function returns three things:
 *
 * - The information, as an array of the `CHOICE` types in the ASN.1 definition
 *   above
 * - Whether any information was omitted (`incompleteEntry`)
 * - Whether the user may _know_ that any information was omitted
 *
 * ## Implementation
 *
 * - `readPermittedEntryInformation()` calls
 *   - `readEntryInformation()`, which calls
 *     - `readAttributes()`, which calls
 *       - `readValues()`
 *
 * @param ctx The context object
 * @param assn The client association
 * @param target The DSE whose entry information is to be read
 * @param user The distinguished name and unique identifier of the user
 *  attempting to read the entry
 * @param relevantTuples The extended, pre-processed ACDF tuples used by
 *  access control schemes that use ACI items
 * @param accessControlScheme The object identifier of the access control scheme
 *  that is in effect
 * @param options Options
 * @returns The entry information, whether some of it was omitted, and whether
 *  the user was permitted to know about any omission.
 *
 * @function
 * @async
 */
export
async function readPermittedEntryInformation (
    ctx: Context,
    assn: ClientAssociation | undefined,
    target: Vertex,
    user: NameAndOptionalUID | undefined | null,
    relevantTuples: ACDFTupleExtended[],
    accessControlScheme?: OBJECT_IDENTIFIER,
    options?: ReadAttributesOptions,
): Promise<ReadPermittedEntryInformationReturn> {
    const acs = accessControlScheme?.toString();
    const einfo: EntryInformation_information_Item[] = await readEntryInformation(
        ctx,
        target,
        {
            ...options,
            // If we are using RBAC, we need types, values, and contexts.
            selection: (acs && accessControlSchemesThatUseRBAC.has(acs) && assn)
                ? new EntryInformationSelection(
                    options?.selection?.attributes,
                    undefined, // We want full attributes, not just types.
                    options?.selection?.extraAttributes,
                    options?.selection?.contextSelection,
                    TRUE, // We also need all contexts.
                    options?.selection?.familyReturn,
                )
                : options?.selection,
        },
    );
    if (!acs) {
        return {
            incompleteEntry: false,
            information: einfo,
            discloseIncompleteEntry: true,
        };
    }
    let incompleteEntry: boolean = true;
    let discloseIncompleteEntry: boolean = false;
    let permittedEinfo: EntryInformation_information_Item[] = [];
    if (accessControlSchemesThatUseACIItems.has(acs)) {
        for (const info of einfo) {
            if ("attribute" in info) {
                const { authorized: authorizedToAddAttributeType } = bacACDF(
                    relevantTuples,
                    user,
                    {
                        attributeType: info.attribute.type_,
                        operational: isOperationalAttributeType(ctx, info.attribute.type_),
                    },
                    [
                        PERMISSION_CATEGORY_READ,
                    ],
                    bacSettings,
                    true,
                );
                if (!authorizedToAddAttributeType) {
                    incompleteEntry = true;
                    // Optimization: we only need to check this if we haven't
                    // already established that we can disclose incompleteness.
                    if (!discloseIncompleteEntry) {
                        const { authorized: authorizedToKnowAboutExcludedAttribute } = bacACDF(
                            relevantTuples,
                            user,
                            {
                                attributeType: info.attribute.type_,
                                operational: isOperationalAttributeType(ctx, info.attribute.type_),
                            },
                            [
                                PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
                            ],
                            bacSettings,
                            true,
                        );
                        if (authorizedToKnowAboutExcludedAttribute) {
                            discloseIncompleteEntry = true;
                        }
                    }
                    continue;
                }
                const permittedValues = valuesFromAttribute(info.attribute)
                    .filter((value) => {
                        const atav = new AttributeTypeAndValue(
                            value.type,
                            value.value,
                        );
                        const acdfResult = bacACDF(
                            relevantTuples,
                            user,
                            {
                                value: atav,
                                operational: isOperationalAttributeType(ctx, atav.type_),
                            },
                            [ PERMISSION_CATEGORY_READ ],
                            bacSettings,
                            true,
                        );
                        if (!acdfResult.authorized) {
                            // Optimization: we only need to check this if we haven't
                            // already established that we can disclose incompleteness.
                            if (!discloseIncompleteEntry) {
                                const { authorized: authorizedToKnowAboutExcludedAttributeValue } = bacACDF(
                                    relevantTuples,
                                    user,
                                    {
                                        value: atav,
                                        operational: isOperationalAttributeType(ctx, atav.type_),
                                    },
                                    [ PERMISSION_CATEGORY_DISCLOSE_ON_ERROR ],
                                    bacSettings,
                                    true,
                                );
                                if (authorizedToKnowAboutExcludedAttributeValue) {
                                    discloseIncompleteEntry = true;
                                }
                            }
                            incompleteEntry = true;
                        }
                        return acdfResult.authorized;
                    });
                const attribute = attributesFromValues(permittedValues)[0];
                if (attribute) {
                    permittedEinfo.push({ attribute });
                } else {
                    permittedEinfo.push({
                        attributeType: info.attribute.type_,
                    });
                }
            } else if ("attributeType" in info) {
                const { authorized: authorizedToAddAttributeType } = bacACDF(
                    relevantTuples,
                    user,
                    {
                        attributeType: info.attributeType,
                        operational: isOperationalAttributeType(ctx, info.attributeType),
                    },
                    [ PERMISSION_CATEGORY_READ ],
                    bacSettings,
                    true,
                );
                if (authorizedToAddAttributeType) {
                    permittedEinfo.push(info);
                }
            } else {
                continue;
            }
        }
    } else {
        permittedEinfo = einfo;
    }

    if (!accessControlSchemesThatUseRBAC.has(acs) || !assn) {
        return {
            incompleteEntry,
            discloseIncompleteEntry,
            information: permittedEinfo,
        };
    }

    const typesOnly: boolean = (options?.selection?.infoTypes === attributeTypesOnly);
    const permittedEinfoViaRbac: EntryInformation_information_Item[] = [];
    for (const info of permittedEinfo) {
        if (!("attribute" in info)) {
            // This should actually never happen.
            continue;
        }
        const attr = info.attribute;
        const newVwc: Attribute_valuesWithContext_Item[] = [];
        for (const vwc of attr.valuesWithContext ?? []) {
            const labelContext = vwc.contextList
                .find((c) => c.contextType.isEqualTo(attributeValueSecurityLabelContext["&id"]) && (c.contextValues.length > 0));
            if (labelContext) {
                const label = attributeValueSecurityLabelContext.decoderFor["&Type"]!(labelContext.contextValues[0]);
                const authorized: boolean = rbacACDF(
                    ctx,
                    assn,
                    target,
                    label,
                    attr.type_,
                    vwc.value,
                    vwc.contextList,
                    [PERMISSION_CATEGORY_READ],
                );
                if (authorized) {
                    newVwc.push(vwc);
                }
                // If selecting typesonly, flag the attribute type as blacklisted.
                // Otherwise, just remove the value.
            }
        }

        if ((newVwc.length === 0) && (attr.values.length === 0)) {
            // All values were filtered out. Permission to the whole attribute type is denied.
            continue;
        }
        if (typesOnly) {
            permittedEinfoViaRbac.push({ attributeType: attr.type_ });
        } else {
            if (options?.selection?.returnContexts) {
                permittedEinfoViaRbac.push({
                    attribute: new Attribute(
                        attr.type_,
                        attr.values,
                        newVwc.length > 0 ? newVwc : undefined,
                    ),
                });
            } else {
                permittedEinfoViaRbac.push({
                    attribute: new Attribute(
                        attr.type_,
                        [ ...attr.values, ...newVwc.map((v) => v.value) ],
                        undefined,
                    ),
                });
            }
        }
    }

    return {
        incompleteEntry,
        discloseIncompleteEntry,
        information: permittedEinfoViaRbac,
    };
}

export default readPermittedEntryInformation;
