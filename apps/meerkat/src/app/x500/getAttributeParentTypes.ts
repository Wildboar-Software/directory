import type { Context } from "../types/index.js";
import type {
    AttributeType,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary Get the supertypes of an attribute type
 * @description
 *
 * This function yields the queried object identifier of the attribute type
 * specified by the `type_` argument, then all of its supertypes, if there are
 * any.
 *
 * @param ctx The context object
 * @param type_ The object identifier of the attribute type whose supertypes are queried
 * @yields The supertypes of the attribute type given by `type_`
 *
 * @function
 */
export
function *getAttributeParentTypes (
    ctx: Context,
    type_: AttributeType,
): IterableIterator<AttributeType> {
    yield type_;
    let current: AttributeType | undefined = type_;
    while (current) {
        const spec = ctx.attributeTypes.get(current.toString());
        if (!spec?.parent) {
            return;
        }
        yield spec.parent;
        current = spec.parent;
    }
}

export default getAttributeParentTypes;
