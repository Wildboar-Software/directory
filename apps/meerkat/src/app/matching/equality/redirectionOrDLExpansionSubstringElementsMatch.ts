import type { Context } from "../../types/index.js";
import { ASN1Element, BERElement } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import { getORNameSubstringElementsMatcher } from "./oRNameSubstringElementsMatch.js";

// DLExpansionHistory ::= SEQUENCE SIZE (1..ub-dl-expansions) OF DLExpansion

// DLExpansion ::= SEQUENCE {
//   dl                 ORAddressAndOptionalDirectoryName,
//   dl-expansion-time  Time
// }

// RedirectionHistory ::= SEQUENCE SIZE (1..ub-redirections) OF Redirection

// Redirection ::= SEQUENCE {
//   intended-recipient-name  IntendedRecipientName,
//   redirection-reason       RedirectionReason
// }

// IntendedRecipientName ::= SEQUENCE {
//   intended-recipient  ORAddressAndOptionalDirectoryName,
//   redirection-time    Time
// }

// FIXME: This implementation is wrong.

// The Redirection-or-DL-expansion-substring-elements-match rule determines whether a presented value of element
// substrings is a matching subset of the elements present in the OR-address-and-optional-directory-name component of
// some value of an attribute of type Redirection-history or DL-expansion-history.
// redirectionOrDLExpansionSubstringElementsMatch MATCHING-RULE ::= {
// SYNTAX
// ORAddressAndOptionalDirectoryName
// ID
// id-mr-redirection-or-dl-expansion-substring-elements-match }
// This rule is identical to the Redirection-or-DL-expansion-elements-match rule except that for those elements which are
// matched using the MS-string-match rule, the MS-single-substring-match rule is applied

// I think you'd just want to use `ORNameSubstringElementsMatch`

export
function getRedirectionOrDLExpansionSubstringElementsMatch (ctx: Context): EqualityMatcher {
    const orNameMatcher = getORNameSubstringElementsMatcher(ctx);
    return(
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        return value.sequenceOf.some((el) => {
            const v = new BERElement();
            v.fromBytes(el.value);
            return orNameMatcher(assertion, v);
        });
    };
}

export default getRedirectionOrDLExpansionSubstringElementsMatch;
