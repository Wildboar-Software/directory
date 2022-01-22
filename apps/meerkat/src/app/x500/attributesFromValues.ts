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
        const valuesWithoutContexts: Value[] = [];
        const valuesWithContexts: Value[] = [];
        for (const atav of atavs) {
            if (atav.contexts && (atav.contexts.length > 0)) {
                valuesWithContexts.push(atav);
            } else {
                valuesWithoutContexts.push(atav);
            }
        }
        return new Attribute(
            atavs[0].type,
            valuesWithoutContexts
                .map((atav) => atav.value),
            valuesWithContexts
                .map((atav) => new Attribute_valuesWithContext_Item(
                    atav.value,
                    Array.from(atav.contexts?.values() ?? []).map((context) => new Context(
                        context.contextType,
                        context.contextValues,
                        context.fallback,
                    )),
                )),
        );
    });
}

export default attributesFromValues;
