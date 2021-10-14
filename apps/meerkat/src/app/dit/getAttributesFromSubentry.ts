import type { Vertex } from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    AttributeTypeAndValue,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    contextAssertionDefaults,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionDefaults.oa";
import {
    searchRules,
} from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";
import {
    _encode_TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import {
    _encode_SearchRuleDescription,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import { pwdAttribute } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAttribute.oa"
import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa"
import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa"
import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa"
import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa"
import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa"
import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa"
import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa"
import { pwdDictionaries } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa"
import { pwdExpiryWarning } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryWarning.oa"
import { pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGraces.oa"
import { pwdFailureDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa"
import { pwdLockoutDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdLockoutDuration.oa"
import { pwdMaxFailures } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxFailures.oa"
import { pwdMaxTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxTimeInHistory.oa"
import { pwdMinTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinTimeInHistory.oa"
import { pwdHistorySlots } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdHistorySlots.oa"
import { pwdRecentlyExpiredDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdRecentlyExpiredDuration.oa"
import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa"
import { DER } from "asn1-ts/dist/node/functional";

export
function getAttributesFromSubentry (
    subentry: Vertex,
): Attribute[] {
    if (!subentry.dse.subentry) {
        return [];
    }
    const cn: AttributeTypeAndValue | undefined = subentry.dse.rdn
        .find((atav) => (atav.type_.isEqualTo(commonName!["&id"])));
    const subentryAttributes: Attribute[] = [
        new Attribute(
            subtreeSpecification["&id"],
            subentry.dse.subentry.subtreeSpecification
                .map((sts) => subtreeSpecification.encoderFor["&Type"]!(sts, DER)),
            undefined,
        ),
    ];
    if (cn) {
        subentryAttributes.push(new Attribute(
            commonName["&id"],
            [cn.value],
            undefined,
        ));
    }
    if (subentry.dse.entryACI) {
        subentryAttributes.push(new Attribute(
            entryACI["&id"],
            subentry.dse.entryACI
                .map((aci) => entryACI.encoderFor["&Type"]!(aci, DER)),
            undefined,
        ));
    }
    if (subentry.dse.subentry.prescriptiveACI) {
        subentryAttributes.push(new Attribute(
            prescriptiveACI["&id"],
            subentry.dse.subentry.prescriptiveACI
                .map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
            undefined,
        ));
    }
    if (subentry.dse.subentry.collectiveAttributes) {
        subentryAttributes.push(...subentry.dse.subentry.collectiveAttributes);
    }
    if (subentry.dse.subentry.contextAssertionDefaults) {
        subentryAttributes.push(new Attribute(
            contextAssertionDefaults["&id"],
            subentry.dse.subentry.contextAssertionDefaults
                .map((cad) => _encode_TypeAndContextAssertion(cad, DER)),
            undefined,
        ));
    }
    if (subentry.dse.subentry.searchRules) {
        subentryAttributes.push(new Attribute(
            searchRules["&id"],
            subentry.dse.subentry.searchRules
                .map((sr) => _encode_SearchRuleDescription(sr, DER)),
            undefined,
        ));
    }

    if (subentry.dse.subentry.pwdAttribute) {
        subentryAttributes.push(new Attribute(
            pwdAttribute["&id"],
            [
                pwdAttribute.encoderFor["&Type"]!(subentry.dse.subentry.pwdAttribute, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdModifyEntryAllowed) {
        subentryAttributes.push(new Attribute(
            pwdModifyEntryAllowed["&id"],
            [
                pwdModifyEntryAllowed.encoderFor["&Type"]!(subentry.dse.subentry.pwdModifyEntryAllowed, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdChangeAllowed) {
        subentryAttributes.push(new Attribute(
            pwdChangeAllowed["&id"],
            [
                pwdChangeAllowed.encoderFor["&Type"]!(subentry.dse.subentry.pwdChangeAllowed, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdMaxAge) {
        subentryAttributes.push(new Attribute(
            pwdMaxAge["&id"],
            [
                pwdMaxAge.encoderFor["&Type"]!(subentry.dse.subentry.pwdMaxAge, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdExpiryAge) {
        subentryAttributes.push(new Attribute(
            pwdExpiryAge["&id"],
            [
                pwdExpiryAge.encoderFor["&Type"]!(subentry.dse.subentry.pwdExpiryAge, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdMinLength) {
        subentryAttributes.push(new Attribute(
            pwdMinLength["&id"],
            [
                pwdMinLength.encoderFor["&Type"]!(subentry.dse.subentry.pwdMinLength, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdVocabulary) {
        subentryAttributes.push(new Attribute(
            pwdVocabulary["&id"],
            [
                pwdVocabulary.encoderFor["&Type"]!(subentry.dse.subentry.pwdVocabulary, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdAlphabet) {
        subentryAttributes.push(new Attribute(
            pwdAlphabet["&id"],
            [
                pwdAlphabet.encoderFor["&Type"]!(subentry.dse.subentry.pwdAlphabet, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdDictionaries) {
        subentryAttributes.push(new Attribute(
            pwdDictionaries["&id"],
            [
                pwdDictionaries.encoderFor["&Type"]!(subentry.dse.subentry.pwdDictionaries, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdExpiryWarning) {
        subentryAttributes.push(new Attribute(
            pwdExpiryWarning["&id"],
            [
                pwdExpiryWarning.encoderFor["&Type"]!(subentry.dse.subentry.pwdExpiryWarning, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdGraces) {
        subentryAttributes.push(new Attribute(
            pwdGraces["&id"],
            [
                pwdGraces.encoderFor["&Type"]!(subentry.dse.subentry.pwdGraces, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdFailureDuration) {
        subentryAttributes.push(new Attribute(
            pwdFailureDuration["&id"],
            [
                pwdFailureDuration.encoderFor["&Type"]!(subentry.dse.subentry.pwdFailureDuration, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdLockoutDuration) {
        subentryAttributes.push(new Attribute(
            pwdLockoutDuration["&id"],
            [
                pwdLockoutDuration.encoderFor["&Type"]!(subentry.dse.subentry.pwdLockoutDuration, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdMaxFailures) {
        subentryAttributes.push(new Attribute(
            pwdMaxFailures["&id"],
            [
                pwdMaxFailures.encoderFor["&Type"]!(subentry.dse.subentry.pwdMaxFailures, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdMaxTimeInHistory) {
        subentryAttributes.push(new Attribute(
            pwdMaxTimeInHistory["&id"],
            [
                pwdMaxTimeInHistory.encoderFor["&Type"]!(subentry.dse.subentry.pwdMaxTimeInHistory, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdMinTimeInHistory) {
        subentryAttributes.push(new Attribute(
            pwdMinTimeInHistory["&id"],
            [
                pwdMinTimeInHistory.encoderFor["&Type"]!(subentry.dse.subentry.pwdMinTimeInHistory, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdHistorySlots) {
        subentryAttributes.push(new Attribute(
            pwdHistorySlots["&id"],
            [
                pwdHistorySlots.encoderFor["&Type"]!(subentry.dse.subentry.pwdHistorySlots, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdRecentlyExpiredDuration) {
        subentryAttributes.push(new Attribute(
            pwdRecentlyExpiredDuration["&id"],
            [
                pwdRecentlyExpiredDuration.encoderFor["&Type"]!(subentry.dse.subentry.pwdRecentlyExpiredDuration, DER),
            ],
            undefined,
        ));
    }
    if (subentry.dse.subentry.pwdEncAlg) {
        subentryAttributes.push(new Attribute(
            pwdEncAlg["&id"],
            [
                pwdEncAlg.encoderFor["&Type"]!(subentry.dse.subentry.pwdEncAlg, DER),
            ],
            undefined,
        ));
    }

    return subentryAttributes;
}

export default getAttributesFromSubentry;
