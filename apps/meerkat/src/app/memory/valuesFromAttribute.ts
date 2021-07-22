import type { StoredAttributeValueWithContexts, StoredContext } from "../types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

export
function valuesFromAttribute (attr: Attribute): StoredAttributeValueWithContexts[] {
    return [
        ...attr.values.map((value): StoredAttributeValueWithContexts => ({
            id: attr.type_,
            value,
            contexts: new Map([]),
        })),
        ...attr.valuesWithContext?.map((vwc): StoredAttributeValueWithContexts => ({
            id: attr.type_,
            value: vwc.value,
            contexts: new Map(
                vwc.contextList.map((context): [ string, StoredContext ] => [
                    context.contextType.toString(),
                    {
                        id: context.contextType,
                        fallback: context.fallback ?? false,
                        values: context.contextValues,
                    },
                ]),
            ),
        })) ?? [],
    ]
}

export default valuesFromAttribute;
