import type { Context, StoredAttributeValueWithContexts, Entry, IndexableOID } from "../types";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly,
    EntryInformationSelection_infoTypes_attributeTypesAndValues,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import evaluateTypeAndContextAssertion from "./evaluateTypeAndContextAssertion";
import { attributesFromStoredValues } from "./attributesFromStoredValues";

/**
 * @deprecated
 */
export
function selectFromEntry (
    ctx: Context,
    eis: EntryInformationSelection,
    entry: Entry,
    attributes: StoredAttributeValueWithContexts[],
): EntryInformation_information_Item[] {
    const attrs = attributes;
    const selectedAttributes: Set<IndexableOID> | null = (eis.attributes && ("select" in eis.attributes))
        ? new Set(eis.attributes.select.map((a) => a.toString()))
        : null;
    const extraAttributes: boolean = Boolean(eis.extraAttributes);
    const selectedExtraAttributes: Set<IndexableOID> | null = (eis.extraAttributes && ("select" in eis.extraAttributes))
        ? new Set(eis.extraAttributes.select.map((a) => a.toString()))
        : null;

    const attributeTypesAndValues = attrs.filter((attr): boolean => {
        const TYPE_OID: string = attr.id.toString();
        const spec = ctx.attributes.get(TYPE_OID);
        if (!spec) { // We reject attributes that we do not understand.
            return false;
        }

        const isPermittedUserAttribute: boolean = (
            (spec.usage === AttributeUsage_userApplications)
            && (
                !selectedAttributes
                || selectedAttributes.has(TYPE_OID)
            )
        );

        const isPermittedOperationalAttribute: boolean = (
            (spec.usage !== AttributeUsage_userApplications)
            && extraAttributes // Extra attributes are permitted.
            && ( // And either
                !selectedExtraAttributes // We are not selecting specific ones, or
                || selectedExtraAttributes.has(TYPE_OID) // this attribute type is selected
            )
        );

        if (
            !isPermittedUserAttribute
            && !isPermittedOperationalAttribute
        ) {
            return false;
        }

        if (eis.contextSelection && ("selectedContexts" in eis.contextSelection)) {
            const everyContextSelectionEvaluatedTrue: boolean = eis.contextSelection.selectedContexts
                .every((taca) => evaluateTypeAndContextAssertion(ctx, taca, attr));
            if (!everyContextSelectionEvaluatedTrue) {
                return false;
            }
        }

        /**
         * Actually, I think familyReturn should be handled outside of this
         * function, since what constitutes a "contributing member" or
         * "participating member" is dependent on the operation. For now, this
         * function well only be applied to each entry individually.
         */
        // TODO: check familyReturn extension
        // TODO: familyReturn

        return true;
    });

    if (
        (eis.infoTypes === undefined)
        || (eis.infoTypes === EntryInformationSelection_infoTypes_attributeTypesOnly)
    ) {
        return attributeTypesAndValues.map((atav) => ({
            attributeType: atav.id,
        }));
    } else if (eis.infoTypes === EntryInformationSelection_infoTypes_attributeTypesAndValues) {
        const attrs = attributesFromStoredValues(attributeTypesAndValues);
        return (eis.returnContexts === true) // This _defaults_ to FALSE.
            ? attrs.map((attribute) => ({
                attribute,
            }))
            : attrs.map((attr) => ({
                attribute: new Attribute(
                    attr.type_,
                    [
                        ...attr.values,
                        ...attr.valuesWithContext?.map((vwc) => vwc.value) ?? [],
                    ],
                    undefined,
                ),
            }));
    } else {
        throw new Error();
    }
}

export default selectFromEntry;
