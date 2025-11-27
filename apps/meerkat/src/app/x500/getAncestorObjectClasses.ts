import type { Context, IndexableOID } from "../types/index.js";

/**
 * @summary Get an object class' superclasses all the way up to `top`
 * @description
 *
 * Get an object class' superclasses all the way up to `top`. The superclasses
 * may or may not include `top`.
 *
 * @param ctx The context object
 * @param oc The object whose superclasses are sought
 * @returns An array of strings containing the dot-delimited representation of
 *  object identifiers of all of the object classes that are superclasses of the
 *  current object class
 *
 * @function
 */
export
function getAncestorObjectClasses (
    ctx: Context,
    oc: IndexableOID,
): IndexableOID[] {
    return [
        oc,
        ...Array.from(ctx.objectClasses.get(oc)?.superclasses ?? [])
            .flatMap((oid) => getAncestorObjectClasses(ctx, oid)),
    ];
}

export default getAncestorObjectClasses;
