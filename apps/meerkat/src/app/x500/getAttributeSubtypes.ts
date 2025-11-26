import type { Context } from "../types/index.js";
import type {
    AttributeType,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary Gets all subtypes of an attribute type
 * @description
 *
 * This function gets all subtypes of an attribute type recursively, returning
 * an array of object identifiers that represent all direct and indirect
 * subtypes.
 *
 * @param ctx The context object
 * @param type_ The object identifier of the attribute type whose subtypes are sought
 * @returns The object identifiers of all known subtypes of the attribute type
 *
 * @function
 */
export
function getAttributeSubtypes (
    ctx: Context,
    type_: AttributeType,
): AttributeType[] {
    const directSubtypes: AttributeType[] = Array.from(ctx.attributeTypes.entries())
        .filter(([ k, v ]) => (
            (k.indexOf(".") > -1) // Dedupes entries by only using OIDs, not descriptors.
            && v.parent?.isEqualTo(type_)
        ))
        .map(([ , v ]) => v.id);
    return [
        ...directSubtypes,
        ...directSubtypes
            .flatMap((subtype) => getAttributeSubtypes(ctx, subtype)),
    ];
}

export default getAttributeSubtypes;
