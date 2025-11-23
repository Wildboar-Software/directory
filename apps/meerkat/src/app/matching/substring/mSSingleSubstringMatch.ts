import { SubstringsMatcher, SubstringSelection } from "@wildboar/x500";
import {
    _decode_MSString,
} from "@wildboar/x400/MSMatchingRules";
import { msStringToString } from "../equality/orAddressUtilities.js";
import type { ASN1Element } from "@wildboar/asn1";

export
const mSSingleSubstringMatch: SubstringsMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
    selection?: SubstringSelection,
): boolean => {
    const sel: SubstringSelection = selection ?? SubstringSelection.any_;
    const a = msStringToString(_decode_MSString(assertion)).toUpperCase();
    const v: string = msStringToString(_decode_MSString(value)).toUpperCase();
    switch (sel) {
        case (SubstringSelection.initial): {
            return v.startsWith(a);
        }
        case (SubstringSelection.any_): {
            return (v.indexOf(a) > -1);
        }
        case (SubstringSelection.final): {
            return v.endsWith(a);
        }
        default: {
            return false;
        }
    }
    return true;
}

export default mSSingleSubstringMatch;
