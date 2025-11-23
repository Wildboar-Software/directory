import type { IndexableOID, Value } from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/InformationFramework";
import {
    Context,
} from "@wildboar/x500/InformationFramework";
import groupByOID from "../utils/groupByOID.js";

/**
 * @summary Convert values into X.500 directory attributes
 * @description
 *
 * This function converts values as Meerkat DSA uses them internally into
 * X.500 directory attributes.
 *
 * @param values The values to be converted into Attributes
 * @returns X.500 directory attributes
 *
 * @function
 */
export
function attributesFromValues (values: Value[]): Attribute[] {
    const valuesByType: Record<IndexableOID, Value[]> = groupByOID<Value>(values, (value) => value.type);
    const attrs: Attribute[] = [];
    for (const atavs of Object.values(valuesByType)) {
        const valuesWithoutContexts: Value[] = [];
        const valuesWithContexts: Value[] = [];
        for (const atav of atavs) {
            if (atav.contexts && (atav.contexts.length > 0)) {
                valuesWithContexts.push(atav);
            } else {
                valuesWithoutContexts.push(atav);
            }
        }
        const vwc = valuesWithContexts
            .map((atav) => new Attribute_valuesWithContext_Item(
                atav.value,
                Array.from(atav.contexts?.values() ?? []).map((context) => new Context(
                    context.contextType,
                    context.contextValues,
                    context.fallback,
                )),
            ));
        attrs.push(new Attribute(
            atavs[0].type,
            valuesWithoutContexts.map((atav) => atav.value),
            (vwc.length > 0) ? vwc : undefined,
        ));
    }
    return attrs;
}

export default attributesFromValues;
