import {
    Versions,
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import { TRUE_BIT } from "asn1-ts";

export
const versions: Versions = new Uint8ClampedArray(2);
versions[Versions_v1] = TRUE_BIT;
versions[Versions_v2] = TRUE_BIT;
export default versions;
