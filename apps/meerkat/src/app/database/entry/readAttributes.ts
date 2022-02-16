import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import readValues, { ReadValuesOptions } from "./readValues";
import attributesFromValues from "../../x500/attributesFromValues";
import getAttributeSizeFilter from "../../x500/getAttributeSizeFilter";

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
    const values = await readValues(ctx, vertex, options);
    const sizeFilter = getAttributeSizeFilter(options?.attributeSizeLimit ?? Infinity);
    // Unfortunately, Prisma does not currently give us a way to limit values by length.
    const userAttributes = options?.attributeSizeLimit
        ? attributesFromValues(values.userValues).filter(sizeFilter)
        : attributesFromValues(values.userValues);
    const operationalAttributes = options?.attributeSizeLimit
        ? attributesFromValues(values.operationalValues).filter(sizeFilter)
        : attributesFromValues(values.operationalValues);
    const collectiveAttributes = options?.attributeSizeLimit
        ? attributesFromValues(values.collectiveValues).filter(sizeFilter)
        : attributesFromValues(values.collectiveValues);
    return {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    };
}

export default readAttributes;
