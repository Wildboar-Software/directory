import { SubstringsMatcher, SubstringSelection } from "@wildboar/x500";
import type { ASN1Element } from "asn1-ts";

export
const caseExactIA5SubstringsMatch: SubstringsMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
    selection?: SubstringSelection,
): boolean => {
    const sel: SubstringSelection = selection ?? SubstringSelection.any_;
    const a: string = assertion.ia5String.trim().replace(/\s+/g, " ");
    const v: string = value.ia5String.trim().replace(/\s+/g, " ");
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

export default caseExactIA5SubstringsMatch;
