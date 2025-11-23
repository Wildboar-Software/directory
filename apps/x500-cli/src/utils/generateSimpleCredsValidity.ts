import { randomBytes } from "crypto";
import { unpackBits } from "@wildboar/asn1";
import {
    SimpleCredentials_validity,
} from "@wildboar/x500/DirectoryAbstractService";

export
function generateSimpleCredsValidity (): SimpleCredentials_validity {
    return new SimpleCredentials_validity(
        {
            gt: new Date(),
        },
        undefined,
        unpackBits(randomBytes(16)),
        unpackBits(randomBytes(16)),
    );
}

export default generateSimpleCredsValidity;
