import type { IndexableOID, Value } from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import {
    Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import groupByOID from "../utils/groupByOID";

export
function attributesFromValues (values: Value[]): Attribute[] {
    const valuesByType: Record<IndexableOID, Value[]> = groupByOID<Value>(values, (value) => value.id);
    return Object.values(valuesByType).map((atavs) => {
        return new Attribute(
            atavs[0].id,
            atavs
                .filter((atav) => (atav.contexts.size === 0))
                .map((atav) => atav.value),
            atavs
                .filter((atav) => (atav.contexts.size > 0))
                .map((atav) => new Attribute_valuesWithContext_Item(
                    atav.value,
                    Array.from(atav.contexts.values()).map((context) => new Context(
                        context.id,
                        context.values,
                        context.fallback,
                    )),
                )),
        );
    });
}

export default attributesFromValues;
