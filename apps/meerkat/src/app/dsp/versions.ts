import {
    Versions,
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import { TRUE_BIT, FALSE_BIT } from "asn1-ts";

/**
 * @summary Versions of the Directory System Protocol supported by Meerkat DSA.
 * @description
 *
 * The versions of the Directory System Protocol (DSP) supported by Meerkat DSA.
 * Forms part of the `DSABindResult`.
 *
 * @constant
 */
export
const versions: Versions = new Uint8ClampedArray(2);
versions[Versions_v1] = FALSE_BIT; // Version 1 directory services will be unsupported.
versions[Versions_v2] = TRUE_BIT; // Version 2 directory services are supported.

export default versions;
