import { ASN1Element, ASN1TagClass } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";
import { Context } from "@wildboar/meerkat-types";
import getORDescriptorMatcher from "./oRDescriptorMatch";

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
function getRecipientSpecifierMatcher (ctx: Context): EqualityMatcher {
    const orDescriptorMatcher = getORDescriptorMatcher(ctx);
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const assertionRecipientElement = assertion.set.find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 0)
        ));
        const valueRecipientElement = value.set.find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 0)
        ));
        if (!valueRecipientElement || !assertionRecipientElement) { // This should not happen, because it is a required field.
            return false;
        }
        return orDescriptorMatcher(assertionRecipientElement, valueRecipientElement);
    };
}

export default getRecipientSpecifierMatcher;
