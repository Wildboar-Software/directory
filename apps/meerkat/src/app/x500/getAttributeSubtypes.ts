import type { Context } from "@wildboar/meerkat-types";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

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
