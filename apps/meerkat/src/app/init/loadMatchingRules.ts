import type { Context, MatchingRuleInfo } from "@wildboar/meerkat-types";
import type {
    MATCHING_RULE,
} from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type OrderingMatcher from "@wildboar/x500/src/lib/types/OrderingMatcher";
import type SubstringsMatcher from "@wildboar/x500/src/lib/types/SubstringsMatcher";
import * as x500mr from "@wildboar/x500/src/lib/collections/matchingRules";
import {
    caseIgnoreMatch,
} from "@wildboar/x500/src/lib/matching/equality/caseIgnoreMatch";
import {
    caseExactMatch,
} from "@wildboar/x500/src/lib/matching/equality/caseExactMatch";
import {
    acceptableCertPoliciesMatch,
} from "@wildboar/x500/src/lib/matching/equality/acceptableCertPoliciesMatch";
import {
    accessPointMatch,
} from "@wildboar/x500/src/lib/matching/equality/accessPointMatch";
import {
    algorithmIdentifierMatch,
} from "@wildboar/x500/src/lib/matching/equality/algorithmIdentifierMatch";
import {
    attDescriptor,
} from "@wildboar/x500/src/lib/matching/equality/attDescriptor";
import {
    attributeCertificateExactMatch,
} from "@wildboar/x500/src/lib/matching/equality/attributeCertificateExactMatch";
import {
    attributeCertificateMatch,
} from "@wildboar/x500/src/lib/matching/equality/attributeCertificateMatch";
import {
    authAttIdMatch,
} from "@wildboar/x500/src/lib/matching/equality/authAttIdMatch";
import {
    basicAttConstraintsMatch,
} from "@wildboar/x500/src/lib/matching/equality/basicAttConstraintsMatch";
import {
    bitStringMatch,
} from "@wildboar/x500/src/lib/matching/equality/bitStringMatch";
import {
    booleanMatch,
} from "@wildboar/x500/src/lib/matching/equality/booleanMatch";
import {
    caseExactIA5Match,
} from "@wildboar/x500/src/lib/matching/equality/caseExactIA5Match";
import {
    caseIgnoreIA5Match,
} from "@wildboar/x500/src/lib/matching/equality/caseIgnoreIA5Match";
import {
    caseIgnoreListMatch,
} from "@wildboar/x500/src/lib/matching/equality/caseIgnoreListMatch";
import {
    certificateExactMatch,
} from "@wildboar/x500/src/lib/matching/equality/certificateExactMatch";
import {
    certificateListExactMatch,
} from "@wildboar/x500/src/lib/matching/equality/certificateListExactMatch";
import {
    certificateListMatch,
} from "@wildboar/x500/src/lib/matching/equality/certificateListMatch";
import {
    certificateMatch,
} from "@wildboar/x500/src/lib/matching/equality/certificateMatch";
import {
    certificatePairExactMatch,
} from "@wildboar/x500/src/lib/matching/equality/certificatePairExactMatch";
import {
    certificatePairMatch,
} from "@wildboar/x500/src/lib/matching/equality/certificatePairMatch";
import {
    delegatedNameConstraintsMatch,
} from "@wildboar/x500/src/lib/matching/equality/delegatedNameConstraintsMatch";
import {
    delegationPathMatch,
} from "@wildboar/x500/src/lib/matching/equality/delegationPathMatch";
import {
    directoryStringFirstComponentMatch,
} from "@wildboar/x500/src/lib/matching/equality/directoryStringFirstComponentMatch";
import {
    distinguishedNameMatch,
} from "@wildboar/x500/src/lib/matching/equality/distinguishedNameMatch";
import {
    dnsNameMatch,
} from "@wildboar/x500/src/lib/matching/equality/dnsNameMatch";
import {
    dualStringMatch,
} from "@wildboar/x500/src/lib/matching/equality/dualStringMatch";
import {
    enhancedCertificateMatch,
} from "@wildboar/x500/src/lib/matching/equality/enhancedCertificateMatch";
import {
    extensionPresenceMatch,
} from "@wildboar/x500/src/lib/matching/equality/extensionPresenceMatch";
import {
    facsimileNumberMatch,
} from "@wildboar/x500/src/lib/matching/equality/facsimileNumberMatch";
// import {
//     generalWordMatch,
// } from "@wildboar/x500/src/lib/matching/equality/generalWordMatch";
import {
    generalizedTimeMatch,
} from "@wildboar/x500/src/lib/matching/equality/generalizedTimeMatch";
import {
    holderIssuerMatch,
} from "@wildboar/x500/src/lib/matching/equality/holderIssuerMatch";
// import {
//     ignoreIfAbsentMatch,
// } from "@wildboar/x500/src/lib/matching/equality/ignoreIfAbsentMatch";
import {
    intEmailMatch,
} from "@wildboar/x500/src/lib/matching/equality/intEmailMatch";
import {
    integerFirstComponentMatch,
} from "@wildboar/x500/src/lib/matching/equality/integerFirstComponentMatch";
import {
    integerMatch,
} from "@wildboar/x500/src/lib/matching/equality/integerMatch";
import {
    jidMatch,
} from "@wildboar/x500/src/lib/matching/equality/jidMatch";
import {
    keywordMatch,
} from "@wildboar/x500/src/lib/matching/equality/keywordMatch";
import {
    masterAndShadowAccessPointsMatch,
} from "@wildboar/x500/src/lib/matching/equality/masterAndShadowAccessPointsMatch";
// import {
//     nullMatch,
// } from "@wildboar/x500/src/lib/matching/equality/nullMatch";
import {
    numericStringMatch,
} from "@wildboar/x500/src/lib/matching/equality/numericStringMatch";
import {
    objectIdentifierFirstComponentMatch,
} from "@wildboar/x500/src/lib/matching/equality/objectIdentifierFirstComponentMatch";
import {
    objectIdentifierMatch,
} from "@wildboar/x500/src/lib/matching/equality/objectIdentifierMatch";
import {
    octetStringMatch,
} from "@wildboar/x500/src/lib/matching/equality/octetStringMatch";
import {
    pkiPathMatch,
} from "@wildboar/x500/src/lib/matching/equality/pkiPathMatch";
import {
    policyMatch,
} from "@wildboar/x500/src/lib/matching/equality/policyMatch";
import {
    presentationAddressMatch,
} from "@wildboar/x500/src/lib/matching/equality/presentationAddressMatch";
import {
    protocolInformationMatch,
} from "@wildboar/x500/src/lib/matching/equality/protocolInformationMatch";
import {
    pwdEncAlgMatch,
} from "@wildboar/x500/src/lib/matching/equality/pwdEncAlgMatch";
import {
    roleSpecCertIdMatch,
} from "@wildboar/x500/src/lib/matching/equality/roleSpecCertIdMatch";
import {
    sOAIdentifierMatch,
} from "@wildboar/x500/src/lib/matching/equality/sOAIdentifierMatch";
import {
    storedPrefixMatch,
} from "@wildboar/x500/src/lib/matching/equality/storedPrefixMatch";
import {
    supplierAndConsumersMatch,
} from "@wildboar/x500/src/lib/matching/equality/supplierAndConsumersMatch";
import {
    supplierOrConsumerInformationMatch,
} from "@wildboar/x500/src/lib/matching/equality/supplierOrConsumerInformationMatch";
// import {
//     systemProposedMatch,
// } from "@wildboar/x500/src/lib/matching/equality/systemProposedMatch";
import {
    telephoneNumberMatch,
} from "@wildboar/x500/src/lib/matching/equality/telephoneNumberMatch";
import {
    timeSpecificationMatch,
} from "@wildboar/x500/src/lib/matching/equality/timeSpecificationMatch";
import {
    uTCTimeMatch,
} from "@wildboar/x500/src/lib/matching/equality/uTCTimeMatch";
import {
    uUIDPairMatch,
} from "@wildboar/x500/src/lib/matching/equality/uUIDPairMatch";
import {
    uniqueMemberMatch,
} from "@wildboar/x500/src/lib/matching/equality/uniqueMemberMatch";
import {
    uriMatch,
} from "@wildboar/x500/src/lib/matching/equality/uriMatch";
// import {
//     userPwdHistoryMatch,
// } from "@wildboar/x500/src/lib/matching/equality/userPwdHistoryMatch";
// import {
//     userPwdMatch,
// } from "@wildboar/x500/src/lib/matching/equality/userPwdMatch";
import {
    wordMatch,
} from "@wildboar/x500/src/lib/matching/equality/wordMatch";
// import {
//     zonalMatch,
// } from "@wildboar/x500/src/lib/matching/equality/zonalMatch";
import {
    caseExactOrderingMatch,
} from "@wildboar/x500/src/lib/matching/ordering/caseExactOrderingMatch";
import {
    caseIgnoreOrderingMatch,
} from "@wildboar/x500/src/lib/matching/ordering/caseIgnoreOrderingMatch";
import {
    generalizedTimeOrderingMatch,
} from "@wildboar/x500/src/lib/matching/ordering/generalizedTimeOrderingMatch";
import {
    integerOrderingMatch,
} from "@wildboar/x500/src/lib/matching/ordering/integerOrderingMatch";
import {
    numericStringOrderingMatch,
} from "@wildboar/x500/src/lib/matching/ordering/numericStringOrderingMatch";
import {
    octetStringOrderingMatch,
} from "@wildboar/x500/src/lib/matching/ordering/octetStringOrderingMatch";
import {
    uTCTimeOrderingMatch,
} from "@wildboar/x500/src/lib/matching/ordering/uTCTimeOrderingMatch";
import {
    caseExactSubstringsMatch,
} from "@wildboar/x500/src/lib/matching/substring/caseExactSubstringsMatch";
import {
    caseIgnoreIA5SubstringsMatch,
} from "@wildboar/x500/src/lib/matching/substring/caseIgnoreIA5SubstringsMatch";
// import {
//     caseIgnoreListSubstringsMatch,
// } from "@wildboar/x500/src/lib/matching/substring/caseIgnoreListSubstringsMatch";
import {
    caseIgnoreSubstringsMatch,
} from "@wildboar/x500/src/lib/matching/substring/caseIgnoreSubstringsMatch";
import {
    numericStringSubstringsMatch,
} from "@wildboar/x500/src/lib/matching/substring/numericStringSubstringsMatch";
import {
    octetStringSubstringsMatch,
} from "@wildboar/x500/src/lib/matching/substring/octetStringSubstringsMatch";
import {
    telephoneNumberSubstringsMatch,
} from "@wildboar/x500/src/lib/matching/substring/telephoneNumberSubstringsMatch";
import approx_acceptableCertPoliciesMatch from "../matching/approx/acceptableCertPoliciesMatch";
import approx_algorithmIdentifierMatch from "../matching/approx/algorithmIdentifierMatch";
import approx_attDescriptor from "../matching/approx/attDescriptor";
import approx_bitStringMatch from "../matching/approx/bitStringMatch";
import approx_caseIgnoreIA5Match from "../matching/approx/caseIgnoreIA5Match";
import approx_caseIgnoreListMatch from "../matching/approx/caseIgnoreListMatch";
import approx_caseIgnoreMatch from "../matching/approx/caseIgnoreMatch";
import approx_directoryStringFirstComponentMatch from "../matching/approx/directoryStringFirstComponentMatch";
import approx_distinguishedNameMatch from "../matching/approx/distinguishedNameMatch";
import approx_dualStringMatch from "../matching/approx/dualStringMatch";
import approx_generalizedTimeMatch from "../matching/approx/generalizedTimeMatch";
import approx_integerFirstComponentMatch from "../matching/approx/integerFirstComponentMatch";
import approx_integerMatch from "../matching/approx/integerMatch";
import approx_intEmailMatch from "../matching/approx/intEmailMatch";
import approx_jidMatch from "../matching/approx/jidMatch";
import approx_objectIdentifierMatch from "../matching/approx/objectIdentifierMatch";
import approx_pwdEncAlgMatch from "../matching/approx/pwdEncAlgMatch";
import approx_uniqueMemberMatch from "../matching/approx/uniqueMemberMatch";
import approx_uriMatch from "../matching/approx/uriMatch";
import approx_uTCTimeMatch from "../matching/approx/uTCTimeMatch";
import entryUUID from "../schema/attributes/entryUUID";
import uuidMatch from "../matching/equality/uuidMatch";
import uuidOrderingMatch from "../matching/ordering/uuidOrderingMatch";

function toInfo <Matcher> (
    mr: MATCHING_RULE,
    matcher: Matcher,
): MatchingRuleInfo<Matcher> {
    return {
        id: mr["&id"]!,
        name: mr["&ldapName"],
        description: mr["&ldapDesc"],
        obsolete: false,
        matcher,
        ldapAssertionSyntax: mr["&ldapSyntax"],
    };
}

export
function loadMatchingRules (ctx: Context): void {
    const equalityInfo: [ MATCHING_RULE, EqualityMatcher ][] = [
        [ x500mr.acceptableCertPoliciesMatch, acceptableCertPoliciesMatch ],
        [ x500mr.accessPointMatch, accessPointMatch ],
        [ x500mr.algorithmIdentifierMatch, algorithmIdentifierMatch ],
        // [ x500mr.approximateStringMatch, approximateStringMatch ],
        [ x500mr.attDescriptor, attDescriptor ],
        [ x500mr.attributeCertificateExactMatch, attributeCertificateExactMatch ],
        [ x500mr.attributeCertificateMatch, attributeCertificateMatch ],
        [ x500mr.authAttIdMatch, authAttIdMatch ],
        [ x500mr.basicAttConstraintsMatch, basicAttConstraintsMatch ],
        [ x500mr.bitStringMatch, bitStringMatch ],
        [ x500mr.booleanMatch, booleanMatch ],
        [ x500mr.caseExactIA5Match, caseExactIA5Match ],
        [ x500mr.caseExactMatch, caseExactMatch ],
        [ x500mr.caseIgnoreIA5Match, caseIgnoreIA5Match ],
        [ x500mr.caseIgnoreListMatch, caseIgnoreListMatch ],
        [ x500mr.caseIgnoreMatch, caseIgnoreMatch ],
        [ x500mr.certificateExactMatch, certificateExactMatch ],
        [ x500mr.certificateListExactMatch, certificateListExactMatch ],
        [ x500mr.certificateListMatch, certificateListMatch ],
        [ x500mr.certificateMatch, certificateMatch ],
        [ x500mr.certificatePairExactMatch, certificatePairExactMatch ],
        [ x500mr.certificatePairMatch, certificatePairMatch ],
        [ x500mr.delegatedNameConstraintsMatch, delegatedNameConstraintsMatch ],
        [ x500mr.delegationPathMatch, delegationPathMatch ],
        [ x500mr.directoryStringFirstComponentMatch, directoryStringFirstComponentMatch ],
        [ x500mr.distinguishedNameMatch, distinguishedNameMatch ],
        [ x500mr.dnsNameMatch, dnsNameMatch ],
        [ x500mr.dualStringMatch, dualStringMatch ],
        [ x500mr.enhancedCertificateMatch, enhancedCertificateMatch ],
        [ x500mr.extensionPresenceMatch, extensionPresenceMatch ],
        [ x500mr.facsimileNumberMatch, facsimileNumberMatch ],
        // [ x500mr.generalWordMatch, generalWordMatch ],
        [ x500mr.generalizedTimeMatch, generalizedTimeMatch ],
        [ x500mr.holderIssuerMatch, holderIssuerMatch ],
        // [ x500mr.ignoreIfAbsentMatch, ignoreIfAbsentMatch ],
        [ x500mr.intEmailMatch, intEmailMatch ],
        [ x500mr.integerFirstComponentMatch, integerFirstComponentMatch ],
        [ x500mr.integerMatch, integerMatch ],
        [ x500mr.jidMatch, jidMatch ],
        [ x500mr.keywordMatch, keywordMatch ],
        [ x500mr.masterAndShadowAccessPointsMatch, masterAndShadowAccessPointsMatch ],
        // [ x500mr.nullMatch, nullMatch ],
        [ x500mr.numericStringMatch, numericStringMatch ],
        [ x500mr.objectIdentifierFirstComponentMatch, objectIdentifierFirstComponentMatch ],
        [ x500mr.objectIdentifierMatch, objectIdentifierMatch ],
        [ x500mr.octetStringMatch, octetStringMatch ],
        [ x500mr.pkiPathMatch, pkiPathMatch ],
        [ x500mr.policyMatch, policyMatch ],
        [ x500mr.presentationAddressMatch, presentationAddressMatch ],
        [ x500mr.protocolInformationMatch, protocolInformationMatch ],
        [ x500mr.pwdEncAlgMatch, pwdEncAlgMatch ],
        [ x500mr.roleSpecCertIdMatch, roleSpecCertIdMatch ],
        [ x500mr.sOAIdentifierMatch, sOAIdentifierMatch ],
        [ x500mr.storedPrefixMatch, storedPrefixMatch ],
        [ x500mr.supplierAndConsumersMatch, supplierAndConsumersMatch ],
        [ x500mr.supplierOrConsumerInformationMatch, supplierOrConsumerInformationMatch ],
        // [ x500mr.systemProposedMatch, systemProposedMatch ],
        [ x500mr.telephoneNumberMatch, telephoneNumberMatch ],
        [ x500mr.timeSpecificationMatch, timeSpecificationMatch ],
        [ x500mr.uTCTimeMatch, uTCTimeMatch ],
        [ x500mr.uUIDPairMatch, uUIDPairMatch ],
        [ x500mr.uniqueMemberMatch, uniqueMemberMatch ],
        [ x500mr.uriMatch, uriMatch ],
        // [ x500mr.userPwdHistoryMatch, userPwdHistoryMatch ],
        // [ x500mr.userPwdMatch, userPwdMatch ],
        [ x500mr.wordMatch, wordMatch ],
        // [ x500mr.zonalMatch, zonalMatch ],
    ];
    const orderingInfo: [ MATCHING_RULE, OrderingMatcher ][] = [
        [ x500mr.caseExactOrderingMatch, caseExactOrderingMatch ],
        [ x500mr.caseIgnoreOrderingMatch, caseIgnoreOrderingMatch ],
        [ x500mr.generalizedTimeOrderingMatch, generalizedTimeOrderingMatch ],
        [ x500mr.integerOrderingMatch, integerOrderingMatch ],
        [ x500mr.numericStringOrderingMatch, numericStringOrderingMatch ],
        [ x500mr.octetStringOrderingMatch, octetStringOrderingMatch ],
        [ x500mr.uTCTimeOrderingMatch, uTCTimeOrderingMatch ],
    ];
    const substringsInfo: [ MATCHING_RULE, SubstringsMatcher ][] = [
        [ x500mr.caseExactSubstringsMatch, caseExactSubstringsMatch ],
        [ x500mr.caseIgnoreIA5SubstringsMatch, caseIgnoreIA5SubstringsMatch ],
        // [ x500mr.caseIgnoreListSubstringsMatch, caseIgnoreListSubstringsMatch ],
        [ x500mr.caseIgnoreSubstringsMatch, caseIgnoreSubstringsMatch ],
        [ x500mr.numericStringSubstringsMatch, numericStringSubstringsMatch ],
        [ x500mr.octetStringSubstringsMatch, octetStringSubstringsMatch ],
        [ x500mr.telephoneNumberSubstringsMatch, telephoneNumberSubstringsMatch ],
    ];

    equalityInfo
        .forEach(([ mr, matcher ]) => {
            ctx.equalityMatchingRules.set(mr["&id"].toString(), toInfo(mr, matcher));
        });
    orderingInfo
        .forEach(([ mr, matcher ]) => {
            ctx.orderingMatchingRules.set(mr["&id"].toString(), toInfo(mr, matcher));
        });
    substringsInfo
        .forEach(([ mr, matcher ]) => {
            ctx.substringsMatchingRules.set(mr["&id"].toString(), toInfo(mr, matcher));
        });

    ctx.approxMatchingRules.set(
        x500mr.acceptableCertPoliciesMatch["&id"]!.toString(),
        approx_acceptableCertPoliciesMatch,
    );
    ctx.approxMatchingRules.set(
        x500mr.algorithmIdentifierMatch["&id"]!.toString(),
        approx_algorithmIdentifierMatch,
    );
    ctx.approxMatchingRules.set(
        x500mr.attDescriptor["&id"]!.toString(),
        approx_attDescriptor,
    );
    ctx.approxMatchingRules.set(
        x500mr.bitStringMatch["&id"]!.toString(),
        approx_bitStringMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.caseExactIA5Match["&id"]!.toString(),
        approx_caseIgnoreIA5Match(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.caseIgnoreIA5Match["&id"]!.toString(),
        approx_caseIgnoreIA5Match(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.caseExactMatch["&id"]!.toString(),
        approx_caseIgnoreMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.caseIgnoreMatch["&id"]!.toString(),
        approx_caseIgnoreMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.caseIgnoreListMatch["&id"]!.toString(),
        approx_caseIgnoreListMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.directoryStringFirstComponentMatch["&id"]!.toString(),
        approx_directoryStringFirstComponentMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.distinguishedNameMatch["&id"]!.toString(),
        approx_distinguishedNameMatch,
    );
    ctx.approxMatchingRules.set(
        x500mr.dualStringMatch["&id"]!.toString(),
        approx_dualStringMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.generalizedTimeMatch["&id"]!.toString(),
        approx_generalizedTimeMatch(86_400_000),
    );
    ctx.approxMatchingRules.set(
        x500mr.integerFirstComponentMatch["&id"]!.toString(),
        approx_integerFirstComponentMatch(10),
    );
    ctx.approxMatchingRules.set(
        x500mr.integerMatch["&id"]!.toString(),
        approx_integerMatch(10),
    );
    ctx.approxMatchingRules.set(
        x500mr.intEmailMatch["&id"]!.toString(),
        approx_intEmailMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.jidMatch["&id"]!.toString(),
        approx_jidMatch(2),
    );
    ctx.approxMatchingRules.set(
        x500mr.objectIdentifierMatch["&id"]!.toString(),
        approx_objectIdentifierMatch,
    );
    ctx.approxMatchingRules.set(
        x500mr.pwdEncAlgMatch["&id"]!.toString(),
        approx_pwdEncAlgMatch,
    );
    ctx.approxMatchingRules.set(
        x500mr.uniqueMemberMatch["&id"]!.toString(),
        approx_uniqueMemberMatch,
    );
    ctx.approxMatchingRules.set(
        x500mr.uriMatch["&id"]!.toString(),
        approx_uriMatch,
    );
    ctx.approxMatchingRules.set(
        x500mr.uTCTimeMatch["&id"]!.toString(),
        approx_uTCTimeMatch(86_400_000),
    );
    ctx.equalityMatchingRules.set(
        entryUUID.equalityMatchingRule!.toString(),
        {
            id: entryUUID.equalityMatchingRule!,
            matcher: uuidMatch,
            obsolete: false,
            name: ["uuidMatch"],
        },
    );
    ctx.orderingMatchingRules.set(
        entryUUID.orderingMatchingRule!.toString(),
        {
            id: entryUUID.orderingMatchingRule!,
            matcher: uuidOrderingMatch,
            obsolete: false,
            name: ["uuidMatch"],
        },
    );
}

export default loadMatchingRules;
