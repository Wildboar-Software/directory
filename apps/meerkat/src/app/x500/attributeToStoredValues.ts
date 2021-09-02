import type { Value, StoredContext } from "../types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

export
function attributeToStoredValues (attribute: Attribute): Value[] {
    return [
        ...attribute.values.map((value): Value => ({
            id: attribute.type_,
            value,
            contexts: new Map(),
        })),
        ...attribute.valuesWithContext?.map((vwc): Value => ({
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
