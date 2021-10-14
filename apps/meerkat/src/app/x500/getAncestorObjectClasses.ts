import type { Context, IndexableOID } from "@wildboar/meerkat-types";

export
function getAncestorObjectClasses (
    ctx: Context,
    oc: IndexableOID,
): IndexableOID[] {
    return Array.from(ctx.objectClasses.get(oc)?.superclasses ?? [])
        .flatMap((oid) => getAncestorObjectClasses(ctx, oid));
}

export default getAncestorObjectClasses;
