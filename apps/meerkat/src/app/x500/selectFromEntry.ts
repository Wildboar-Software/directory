import type { Context, StoredAttributeValueWithContexts, Entry, IndexableOID } from "../types";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
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
import evaluateTypeAndContextAssertion from "./evaluateTypeAndContextAssertion";

// Return type determined by EntryInformationSelection.infoTypes
type SelectedInfo = {
    attributeTypesOnly: AttributeType[];
} | {
    attributeTypesAndValues: StoredAttributeValueWithContexts[];
};

export
function selectFromEntry (
    ctx: Context,
    eis: EntryInformationSelection,
    entry: Entry,
    attributes?: StoredAttributeValueWithContexts[],
): SelectedInfo {
    const attrs = attributes ?? (ctx.database.data.values.filter((v) => v.entry === entry.id));
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
        return {
            attributeTypesOnly: attributeTypesAndValues.map((atav) => atav.id),
        };
    } else if (eis.infoTypes === EntryInformationSelection_infoTypes_attributeTypesAndValues) {
        return {
            attributeTypesAndValues: (eis.returnContexts === true) // This _defaults_ to FALSE.
                ? attributeTypesAndValues
                : attributeTypesAndValues.map((attr) => ({
                    ...attr,
                    contexts: new Map(),
                })),
        };
    } else {
        throw new Error();
    }
}
