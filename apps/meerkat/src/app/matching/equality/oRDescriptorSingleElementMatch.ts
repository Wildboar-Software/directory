import type { ASN1Element } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import { EqualityMatcher, teletexToString } from "@wildboar/x500";
import { _decode_MSString } from "@wildboar/x400/MSMatchingRules";
import { _encode_ORName } from "@wildboar/x400/MTSAbstractService";
import { _decode_ORDescriptor } from "@wildboar/x400/IPMSInformationObjects";
import { msStringToString } from "./orAddressUtilities";
import { oRNameSingleElementMatch } from "./oRNameSingleElementMatch";

// ORDescriptor ::= SET {
//     formal-name       ORName OPTIONAL,
//     free-form-name    [0]  FreeFormName OPTIONAL,
//     telephone-number  [1]  TelephoneNumber OPTIONAL
// }

// FreeFormName ::= TeletexString(SIZE (0..ub-free-form-name))

// TelephoneNumber ::= PrintableString(SIZE (0..ub-telephone-number))

export
const oRDescriptorSingleElementMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: string = msStringToString(_decode_MSString(assertion));
    const v = _decode_ORDescriptor(value);
    if (v.free_form_name) {
        const vname = teletexToString(v.free_form_name).trim().replace(/\s+/g, " ").toUpperCase();
        return (vname.indexOf(a) >= 0);
    }
    if (v.telephone_number) {
        const vname = v.telephone_number.trim().replace(/\s+/g, " ").toUpperCase();
        return (vname.indexOf(a) >= 0);
    }
    if (v.formal_name) {
        const vname = _encode_ORName(v.formal_name, DER);
        return oRNameSingleElementMatch(vname, assertion)
    }
    return false;
};

export default oRDescriptorSingleElementMatch;
