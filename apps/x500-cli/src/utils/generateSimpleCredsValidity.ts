import { randomBytes } from "crypto";
import { unpackBits } from "asn1-ts";
import {
    SimpleCredentials_validity,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials-validity.ta";

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
