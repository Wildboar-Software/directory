import type { Entry, StoredAttributeValueWithContexts, StoredContext } from "../types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

export
function attributeToStoredValues (entry: Entry, attribute: Attribute): StoredAttributeValueWithContexts[] {
    return [
        ...attribute.values.map((value): StoredAttributeValueWithContexts => ({
            id: attribute.type_,
            value,
            contexts: new Map(),
        })),
        ...attribute.valuesWithContext?.map((vwc): StoredAttributeValueWithContexts => ({
            id: attribute.type_,
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
    ];
}

export default attributeToStoredValues;
