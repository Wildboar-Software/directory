import type {
    InvokeId,
} from "@wildboar/x500/CommonProtocolSpecification";

/**
 * @summary Convert a `InvokeId` into a human-readable string.
 * @description
 *
 * Converts an X.500 `InvokeId` into a human-readable string.
 *
 * @param iid The invoke ID to convert to a string
 * @returns The string representation of the invoke ID
 *
 * @function
 */
export
function printInvokeId (iid: InvokeId): string {
    if ("present" in iid) {
        return iid.present.toString();
    } else {
        return "absent";
    }
}

export default printInvokeId;
