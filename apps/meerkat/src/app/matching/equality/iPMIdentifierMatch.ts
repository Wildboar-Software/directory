import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_IPMIdentifier,
} from "@wildboar/x400/IPMSInformationObjects";
import { _encode_ORName } from "@wildboar/x400/MTSAbstractService";
import { strict as assert } from "node:assert";
import { Context } from "../../types/index.js";
import { getORNameMatcherTyped } from "./oRNameMatch.js";

// IPMIdentifier ::= [APPLICATION 11]  SET {
//     user                      ORName OPTIONAL,
//     user-relative-identifier  LocalIPMIdentifier
// }

// LocalIPMIdentifier ::= PrintableString(SIZE (0..ub-local-ipm-identifier))

export
function getIPMIdentifierMatcher (ctx: Context): EqualityMatcher {
    const orNameMatcher = getORNameMatcherTyped(ctx);
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = _decode_IPMIdentifier(assertion);
        const v = _decode_IPMIdentifier(value);
        if (!!a.user !== !!v.user) {
            return false;
        }
        const auri = a.user_relative_identifier.trim().replace(/\s+/g, " ").toUpperCase();
        const vuri = v.user_relative_identifier.trim().replace(/\s+/g, " ").toUpperCase();
        if (auri !== vuri) {
            return false;
        }
        if (a.user) {
            assert(v.user);
            return orNameMatcher(a.user, v.user);
        }
        return true;
    };
}

export default getIPMIdentifierMatcher;
