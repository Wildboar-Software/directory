import type { Context, IndexableOID, Vertex } from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import readValues, { ReadValuesOptions } from "./readValues";
import attributesFromValues from "../../x500/attributesFromValues";
import getAttributeSizeFilter from "../../x500/getAttributeSizeFilter";
import getEqualityMatcherGetter from "../../x500/getEqualityMatcherGetter";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import { ContextProfile } from "@wildboar/x500/src/lib/modules/ServiceAdministration/ContextProfile.ta";
import { ResultAttribute } from "@wildboar/x500/src/lib/modules/ServiceAdministration/ResultAttribute.ta";
import { ASN1Element } from "asn1-ts";
import { Attribute_valuesWithContext_Item } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";

export
interface ReadEntryAttributesReturn {
    userAttributes: Attribute[];
    operationalAttributes: Attribute[];
    collectiveAttributes: Attribute[];
};

export
interface ReadAttributesOptions extends ReadValuesOptions {
    readonly attributeSizeLimit?: number;
}

function getAttributeMap (
    ctx: Context,
    outputTypes: Map<IndexableOID, ResultAttribute>,
): (attr: Attribute) => Attribute {
    return function (attr: Attribute): Attribute {
        const key = attr.type_.toString();
        const profile = outputTypes.get(key);
        if (!profile) {
             // This shouldn't happen, because it should have never been read from the DB.
            return new Attribute(attr.type_, []);
        }
        let values: ASN1Element[] = [];
        let valuesWithContext: Attribute_valuesWithContext_Item[] | undefined = [];
        if (profile.outputValues) {
            const matcher = getEqualityMatcherGetter(ctx)(attr.type_);
            if (!matcher) {
                return new Attribute(attr.type_, []); // No EMR defined for this type.
            }
            if ("selectedValues" in profile.outputValues) {
                const namingMatcher = getNamingMatcherGetter(ctx);
                const selectedValues = profile.outputValues.selectedValues;
                for (const value of attr.values) {
                    for (const sel_value of selectedValues) {
                        const matched: boolean = matcher(value, sel_value, namingMatcher);
                        if (matched) {
                            values.push(value);
                        }
                    }
                }
                for (const vwc of attr.valuesWithContext ?? []) {
                    for (const sel_value of selectedValues) {
                        const matched: boolean = matcher(vwc.value, sel_value, namingMatcher);
                        if (matched) {
                            valuesWithContext.push(vwc);
                        }
                    }
                }
            } else {
                values = attr.values;
                valuesWithContext = attr.valuesWithContext;
            }
        }
        if (profile.contexts) {
            const contextProfilesByOID: Map<IndexableOID, ContextProfile> = new Map();
            for (const context of profile.contexts) {
                contextProfilesByOID.set(context.contextType.toString(), context);
            }
            const new_vwc: Attribute_valuesWithContext_Item[] = [];
            for (const vwc of valuesWithContext ?? []) {
                /* Context profiles with contextValue are handled before this
                function is called, by creating TypeAndContextAssertion values
                in `readValues()` and checking those assertions along with the
                user-supplied TACAs. This function just needs to filter out
                context types that are not permitted in the output. */
                const new_context_list = vwc.contextList
                    .filter((c) => contextProfilesByOID.has(c.contextType.toString()));
                if (new_context_list.length > 0) {
                    new_vwc.push(new Attribute_valuesWithContext_Item(
                        vwc.value,
                        new_context_list,
                    ));
                } else {
                    values.push(vwc.value);
                }
            }
            valuesWithContext = new_vwc;
        }
        return new Attribute(
            attr.type_,
            values,
            valuesWithContext,
        );
    };
}

/**
 * @summary Read the attributes of an entry
 * @description
 *
 * Reads the attributes of an entry, grouped into user attributes, operational
 * attributes, and collective attributes.
 *
 * @param ctx The context object
 * @param vertex The DSE whose attributes are to be read
 * @param options Options
 * @returns The attributes, grouped into user attributes, operational attributes
 *  and collective attributes.
 *
 * @function
 * @async
 */
export
async function readAttributes (
    ctx: Context,
    vertex: Vertex,
    options?: ReadAttributesOptions,
): Promise<ReadEntryAttributesReturn> {
    const values = await readValues(ctx, vertex, options, true);
    const sizeLimit = options?.attributeSizeLimit;
    const sizeFilter = getAttributeSizeFilter(sizeLimit ?? Infinity);
    // Unfortunately, Prisma does not currently give us a way to limit values by length.
    let userAttributes = sizeLimit
        ? attributesFromValues(values.userValues).filter(sizeFilter)
        : attributesFromValues(values.userValues);
    let operationalAttributes = sizeLimit
        ? attributesFromValues(values.operationalValues).filter(sizeFilter)
        : attributesFromValues(values.operationalValues);
    let collectiveAttributes = sizeLimit
        ? attributesFromValues(values.collectiveValues).filter(sizeFilter)
        : attributesFromValues(values.collectiveValues);

    const outputTypes = options?.outputAttributeTypes;
    if (outputTypes) {
        // TODO: Document this.
        // DEVIATION: This deviates slightly from the spec by not eliminating
        // attributes that have no values. This is because readEntryInformation
        // uses empty attributes by converting them to attributeTypes.
        // I also just think it is better to return more information.
        const valueFilter = getAttributeMap(ctx, outputTypes);
        userAttributes = userAttributes.map(valueFilter);
        operationalAttributes = operationalAttributes.map(valueFilter);
        collectiveAttributes = collectiveAttributes.map(valueFilter);
    }

    return {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    };
}

export default readAttributes;
