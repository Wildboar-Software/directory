import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { getAttributeSize } from "./getAttributeSize";

/**
 * @summary Higher-order function that gets a filter predicate that filters attributes by size
 * @description
 *
 * This higher-order function takes an attribute size limit and returns a
 * function that can be used directly in `Array.filter()` to filter out
 * attributes that exceed the size limit. This is for implementing the
 * `attributeSizeLimit` service control.
 *
 * @param attributeSizeLimit The maximum size in bytes of the attribute
 * @returns A function that takes an attribute and returns a boolean indicating
 *  whether the attribute falls within the permitted size.
 *
 * @function
 */
export
function getAttrbuteSizeFilter (attributeSizeLimit: number): (attr: Attribute) => boolean {
    return function (attr: Attribute): boolean {
        return (getAttributeSize(attr) <= attributeSizeLimit);
    };
}

export default getAttrbuteSizeFilter;
