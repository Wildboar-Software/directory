import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";

/**
 * @summary Convert a `Code` into a human-readable string.
 * @description
 *
 * Converts an X.500 `Code` into a human-readable string. If the code uses the
 * `global` alternative, the object identifier will be displayed in
 * dot-delimited form.
 *
 * @param code The code to convert to a string.
 * @returns The string representation of the code
 *
 * @function
 */
export
function printCode (code: Code): string {
    if ("local" in code) {
        return code.local.toString();
    } else if ("global" in code) {
        return code.global.toString();
    } else {
        return code.toString();
    }
}

export default printCode;
