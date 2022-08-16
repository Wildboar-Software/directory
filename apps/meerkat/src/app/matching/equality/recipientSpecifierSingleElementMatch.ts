import { ASN1Element, ASN1TagClass } from "asn1-ts";
import type { EqualityMatcher } from "@wildboar/x500";
import { oRDescriptorSingleElementMatch } from "./oRDescriptorSingleElementMatch";

// RecipientSpecifier ::= SET {
//     recipient              [0]  ORDescriptor,
//     notification-requests  [1]  NotificationRequests DEFAULT {},
//     reply-requested        [2]  BOOLEAN DEFAULT FALSE,
//     recipient-extensions   [3]  RecipientExtensionsField OPTIONAL
// }

// ORDescriptor ::= SET {
//     formal-name       ORName OPTIONAL,
//     free-form-name    [0]  FreeFormName OPTIONAL,
//     telephone-number  [1]  TelephoneNumber OPTIONAL
// }

// FreeFormName ::= TeletexString(SIZE (0..ub-free-form-name))

// TelephoneNumber ::= PrintableString(SIZE (0..ub-telephone-number))

export
const recipientSpecifierSingleElementMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const valueRecipientElement = value.set.find((el) => (
        (el.tagClass === ASN1TagClass.context)
        && (el.tagNumber === 0)
    ));
    if (!valueRecipientElement) { // This should not happen, because it is a required field.
        return false;
    }
    return oRDescriptorSingleElementMatch(assertion, valueRecipientElement);
};

export default recipientSpecifierSingleElementMatch;
