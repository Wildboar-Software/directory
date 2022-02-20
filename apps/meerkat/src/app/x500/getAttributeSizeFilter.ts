import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

const BYTES_FOR_TAG: number = 2;

function getAttributeSize (attr: Attribute): number {
    return (
        attr.values
            .reduce((acc, value) => acc + value.length + BYTES_FOR_TAG, 0)
        + (attr.valuesWithContext
            ?.reduce((acc, vwc) => acc + (
                (vwc.value.length + BYTES_FOR_TAG)
                + BYTES_FOR_TAG
                + vwc.contextList
                    .reduce((acc, context) => acc + (
                        BYTES_FOR_TAG
                        + context.contextType.nodes.length
                        + ((context.fallback === undefined) ? 0 : 3)
                        + BYTES_FOR_TAG
                        + context.contextValues.reduce((acc, cv) => acc + (
                            BYTES_FOR_TAG
                            + cv.length
                        ), 0)
                    ), 0)
            ), 0) ?? 0)
    );
}

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
