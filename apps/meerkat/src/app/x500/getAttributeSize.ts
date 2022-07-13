import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";

const BYTES_FOR_TAG: number = 2;

// TODO: This would be a great addition to the X.500 library.
// Note that this measures in terms of BER/DER encoding, and it is somewhat inaccurate.
// TODO: Rewrite this so it uses for loops, or maybe make a native module for it.
export
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
