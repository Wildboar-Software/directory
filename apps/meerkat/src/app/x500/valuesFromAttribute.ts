import type { Value, StoredContext } from "@wildboar/meerkat-types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

/**
 * @summary Convert an X.500 directory attribute into individual values
 * @description
 *
 * This function takes an X.500 attribute and "breaks it up" into individual
 * values that can be used internally by Meerkat DSA.
 *
 * @param attr An X.500 attribute
 * @returns An array of values as used internally by Meerkat DSA
 *
 * @function
 */
export
function valuesFromAttribute (attr: Attribute): Value[] {
    return [
        ...attr.values.map((value): Value => ({
            type: attr.type_,
            value,
        })),
        ...attr.valuesWithContext?.map((vwc): Value => ({
            type: attr.type_,
            value: vwc.value,
            contexts: vwc.contextList.map((context): StoredContext => ({
                contextType: context.contextType,
                fallback: context.fallback ?? false,
                contextValues: context.contextValues,
            })),
        })) ?? [],
    ]
}

export default valuesFromAttribute;
