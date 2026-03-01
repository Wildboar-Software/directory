import type { ASN1Element } from "@wildboar/asn1";
import { teletexToString } from "@wildboar/x500";
import { _decode_ORDescriptor } from "@wildboar/x400/IPMSInformationObjects";
import { orAddressIsSubset } from "./oRAddressElementsMatch.js";

// ORDescriptor ::= SET {
//     formal-name       ORName OPTIONAL,
//     free-form-name    [0]  FreeFormName OPTIONAL,
//     telephone-number  [1]  TelephoneNumber OPTIONAL
// }

// FreeFormName ::= TeletexString(SIZE (0..ub-free-form-name))

// TelephoneNumber ::= PrintableString(SIZE (0..ub-telephone-number))

export
function orDescriptorElementsMatcher (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean {
    const a = _decode_ORDescriptor(assertion);
    const v = _decode_ORDescriptor(value);
    if (!!a.formal_name && !!v.formal_name) {
        return orAddressIsSubset(a.formal_name, v.formal_name);
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

export default orDescriptorElementsMatcher;
