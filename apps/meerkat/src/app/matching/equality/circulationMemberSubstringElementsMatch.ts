import type { Context } from "@wildboar/meerkat-types";
import { ASN1Element, ASN1TagClass, ASN1UniversalType } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import { getORDescriptorSubstringElementsMatcher } from "./oRDescriptorSubstringElementsMatch.js";

// CirculationMember ::= SET {
//     circulation-recipient
//       RecipientSpecifier
//         (WITH COMPONENTS {
//            ...,
//            recipient  (WITH COMPONENTS {
//                          ...,
//                          formal-name  PRESENT
//                        })
//          }),
//     checked                Checkmark OPTIONAL
// }

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
function getCirculationMemberSubstringElementsMatcher (ctx: Context): EqualityMatcher {
    const orDescriptorMatcher = getORDescriptorSubstringElementsMatcher(ctx);
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const assertionCirculationRecipientElement = assertion.set.find((el) => (
            (el.tagClass === ASN1TagClass.universal)
            && (el.tagNumber === ASN1UniversalType.set)
        ));
        const valueCirculationRecipientElement = value.set.find((el) => (
            (el.tagClass === ASN1TagClass.universal)
            && (el.tagNumber === ASN1UniversalType.set)
        ));
        // This should not happen, because it is a required field.
        if (!assertionCirculationRecipientElement || !valueCirculationRecipientElement) {
            return false;
        }
        const assertionRecipientElement = assertionCirculationRecipientElement.set.find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 0)
        ));
        const valueRecipientElement = valueCirculationRecipientElement.set.find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 0)
        ));
        // This should not happen, because it is a required field.
        if (!assertionRecipientElement || !valueRecipientElement) {
            return false;
        }
        return orDescriptorMatcher(assertionRecipientElement, valueRecipientElement);
    };
}

export default getCirculationMemberSubstringElementsMatcher;
