import type { Value, StoredContext } from "@wildboar/meerkat-types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

export
function valuesFromAttribute (attr: Attribute): Value[] {
    return [
        ...attr.values.map((value): Value => ({
            id: attr.type_,
            value,
            contexts: new Map([]),
        })),
        ...attr.valuesWithContext?.map((vwc): Value => ({
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
