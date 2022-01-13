import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import readEntryInformation from "./readEntryInformation";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_READ,
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

export
interface ReadPermittedEntryInformationReturn {
    incompleteEntry: boolean;
    information: EntryInformation_information_Item[];
}

export
async function readPermittedEntryInformation (
    ctx: Context,
    target: Vertex,
    user: NameAndOptionalUID | undefined | null,
    relevantTuples: ACDFTupleExtended[],
    accessControlScheme?: OBJECT_IDENTIFIER,
    options?: ReadAttributesOptions,
): Promise<ReadPermittedEntryInformationReturn> {
    const einfo: EntryInformation_information_Item[] = await readEntryInformation(
        ctx,
        target,
        options,
    );
    if (
        !accessControlScheme
        || !accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        return {
            incompleteEntry: false,
            information: einfo,
        };
    }
    const permittedEinfo: EntryInformation_information_Item[] = accessControlScheme
        ? []
        : einfo;
    let incompleteEntry: boolean = true;
    for (const info of einfo) {
        if ("attribute" in info) {
            const {
                authorized: authorizedToAddAttributeType,
            } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: info.attribute.type_,
                },
                [
                    PERMISSION_CATEGORY_READ,
                ],
                bacSettings,
                true,
            );
            if (!authorizedToAddAttributeType) {
                incompleteEntry = true;
                continue;
            }
            const permittedValues = valuesFromAttribute(info.attribute)
                .filter((value) => {
                    const acdfResult = bacACDF(
                        relevantTuples,
                        user,
                        {
                            value: new AttributeTypeAndValue(
                                value.type,
                                value.value,
                            ),
                        },
                        [
                            PERMISSION_CATEGORY_READ,
                        ],
                        bacSettings,
                        true,
                    );
                    if (!acdfResult.authorized) {
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
            const {
                authorized: authorizedToAddAttributeType,
            } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: info.attributeType,
                },
                [
                    PERMISSION_CATEGORY_READ,
                ],
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
    return {
        incompleteEntry,
        information: permittedEinfo,
    };
}

export default readPermittedEntryInformation;
