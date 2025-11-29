import type { Context } from "../../types/index.js";
import { ASN1Element, BERElement } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import { getORNameMatcher } from "./oRNameMatch.js";

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

// TODO: This could be made more efficient by not decoding the assertion every time.
export
function getRedirectionOrDLExpansionMatch (ctx: Context): EqualityMatcher {
    const orNameMatcher = getORNameMatcher(ctx);
    return(
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const values = value.sequenceOf.map((el) => {
            const firstComponent = new BERElement();
            firstComponent.fromBytes(el.value);
            return firstComponent;
        });
        for (const v of values) {
            if (orNameMatcher(assertion, v)) {
                return true;
            }
        }
        return false;
    };
}

export default getRedirectionOrDLExpansionMatch;
