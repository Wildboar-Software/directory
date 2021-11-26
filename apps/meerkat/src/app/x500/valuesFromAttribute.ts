import type { Value, StoredContext } from "@wildboar/meerkat-types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

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
