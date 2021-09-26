import type { Context, Vertex } from "../../types";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import type {
    ContextSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ContextSelection.ta";
import readEntryInformation from "./readEntryInformation";
import { OBJECT_IDENTIFIER } from "asn1-ts";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_READ,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import attributesFromValues from "../../x500/attributesFromValues";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";

export
interface ReadPermittedEntryInformationReturn {
    incompleteEntry: boolean;
    information: EntryInformation_information_Item[];
}

export
async function readPermittedEntryInformation (
    ctx: Context,
    target: Vertex,
    authLevel: AuthenticationLevel,
    relevantTuples: ACDFTupleExtended[],
    accessControlScheme?: OBJECT_IDENTIFIER,
    eis?: EntryInformationSelection,
    relevantSubentries?: Vertex[],
    operationContexts?: ContextSelection,
): Promise<ReadPermittedEntryInformationReturn> {
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const einfo: EntryInformation_information_Item[] = await readEntryInformation(
        ctx,
        target,
        eis,
        relevantSubentries,
        operationContexts,
    );
    if (!accessControlScheme) {
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
                authLevel,
                {
                    attributeType: info.attribute.type_,
                },
                [
                    PERMISSION_CATEGORY_READ,
                ],
                EQUALITY_MATCHER,
            );
            if (!authorizedToAddAttributeType) {
                incompleteEntry = true;
                continue;
            }
            const permittedValues = valuesFromAttribute(info.attribute)
                .filter((value) => {
                    const {
                        authorized: authorizedToAddAttributeValue,
                    } = bacACDF(
                        relevantTuples,
                        authLevel,
                        {
                            value: new AttributeTypeAndValue(
                                value.id,
                                value.value,
                            ),
                        },
                        [
                            PERMISSION_CATEGORY_READ,
                        ],
                        EQUALITY_MATCHER,
                    );
                    if (!authorizedToAddAttributeValue) {
                        incompleteEntry = true;
                    }
                    return authorizedToAddAttributeValue;
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
                authLevel,
                {
                    attributeType: info.attributeType,
                },
                [
                    PERMISSION_CATEGORY_READ,
                ],
                EQUALITY_MATCHER,
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
