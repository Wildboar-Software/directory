import { ObjectIdentifier } from "asn1-ts";

/**
 * Specified in IETF RFC 4512. This is a special object class that may have
 * any attribute.
 */
export
const extensibleObject = new ObjectIdentifier([
    1, 3, 6, 1, 4, 1, 1466, 101, 120, 111,
]);

export default extensibleObject;
