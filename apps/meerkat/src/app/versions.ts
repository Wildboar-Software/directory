import {
    Versions,
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/DirectoryAbstractService";
import { TRUE_BIT } from "@wildboar/asn1";

/**
 * @summary Versions of the Directory Protocols supported by Meerkat DSA.
 * @description
 *
 * The versions of the directory protocols supported by Meerkat DSA.
 * Forms part of the `DSABindResult` and `DirectoryBindResult`.
 *
 * @constant
 */
export
const versions: Versions = new Uint8ClampedArray(2);
versions[Versions_v1] = TRUE_BIT;
versions[Versions_v2] = TRUE_BIT;

export default versions;
