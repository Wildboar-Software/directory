import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/SelectedAttributeTypes";
import { directoryStringToString } from "@wildboar/x500";
import { metaphone } from "../metaphone.js";

export
const matcher: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = directoryStringToString(_decode_UnboundedDirectoryString(assertion)).trim();
    const v = directoryStringToString(_decode_UnboundedDirectoryString(value)).trim();
    return (metaphone(a) === metaphone(v));
};

export default matcher;
