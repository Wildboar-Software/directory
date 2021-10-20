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
    const valuesByType: Record<IndexableOID, Value[]> = groupByOID<Value>(values, (value) => value.type);
    return Object.values(valuesByType).map((atavs) => {
        return new Attribute(
            atavs[0].type,
            atavs
                .filter((atav) => (!atav.contexts || (atav.contexts.size === 0)))
                .map((atav) => atav.value),
            atavs
                .filter((atav) => (atav.contexts && (atav.contexts.size > 0)))
                .map((atav) => new Attribute_valuesWithContext_Item(
                    atav.value,
                    Array.from(atav.contexts?.values() ?? []).map((context) => new Context(
                        context.id,
                        context.values,
                        context.fallback,
                    )),
                )),
        );
    });
}

export default attributesFromValues;
