import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import { directoryStringToString } from "@wildboar/x500";
import { metaphone } from "../metaphone";

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
