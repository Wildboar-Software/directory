import type { ASN1Element } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { EqualityMatcher, teletexToString } from "@wildboar/x500";
import { _encode_ORName } from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORName.ta";
import { _decode_ORDescriptor } from "@wildboar/x400/src/lib/modules/IPMSInformationObjects/ORDescriptor.ta";
import { Context } from "@wildboar/meerkat-types";
import getORNameElementsMatch from "./oRNameElementsMatch";

// ORDescriptor ::= SET {
//     formal-name       ORName OPTIONAL,
//     free-form-name    [0]  FreeFormName OPTIONAL,
//     telephone-number  [1]  TelephoneNumber OPTIONAL
// }

// FreeFormName ::= TeletexString(SIZE (0..ub-free-form-name))

// TelephoneNumber ::= PrintableString(SIZE (0..ub-telephone-number))

export
function getORDescriptorElementsMatcher (ctx: Context): EqualityMatcher {
    const orNameMatcher = getORNameElementsMatch(ctx);
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = _decode_ORDescriptor(assertion);
        const v = _decode_ORDescriptor(value);
        if (!!a.formal_name && !!v.formal_name) {
            const aname = _encode_ORName(a.formal_name, DER);
            const vname = _encode_ORName(v.formal_name, DER);
            return orNameMatcher(aname, vname);
        }
        if (!!a.free_form_name && !!v.free_form_name) {
            const aname = teletexToString(a.free_form_name).trim().replace(/\s+/g, " ").toUpperCase();
            const vname = teletexToString(v.free_form_name).trim().replace(/\s+/g, " ").toUpperCase();
            return (aname === vname);
        }
        if (!!a.telephone_number && !!v.telephone_number) {
            const aname = a.telephone_number.trim().replace(/\s+/g, " ").toUpperCase();
            const vname = v.telephone_number.trim().replace(/\s+/g, " ").toUpperCase();
            return (aname === vname);
        }
        return false;
    };
}

export default getORDescriptorElementsMatcher;
