import type {
    Context,
    MatchingRuleInfo,
    SortKeyGetter,
    SortKey,
} from "@wildboar/meerkat-types";
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
import type { ASN1Element } from "asn1-ts";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";

// X.400 Matching Rules
import {
    addressCapabilitiesMatch,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/addressCapabilitiesMatch.oa";
import {
    capabilityMatch,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/capabilityMatch.oa";
import {
    oRNameExactMatch,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/oRNameExactMatch.oa";
import {
    mSStringMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringMatch.oa";
import {
    mSStringOrderingMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringOrderingMatch.oa";
import {
    mSSubstringsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSSubstringsMatch.oa";
import {
    mSSingleSubstringMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSSingleSubstringMatch.oa";
import {
    mSStringCaseSensitiveMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringCaseSensitiveMatch.oa";
import {
    mSStringListMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringListMatch.oa";
import {
    mSStringListElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSStringListElementsMatch.oa";
import {
    mSSingleSubstringListMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSSingleSubstringListMatch.oa";
import {
    mSSingleSubstringListElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mSSingleSubstringListElementsMatch.oa";
// import {
//     valueCountMatch,
// } from "@wildboar/x400/src/lib/modules/MSMatchingRules/valueCountMatch.oa";
import {
    oRAddressMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRAddressMatch.oa";
import {
    oRAddressElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRAddressElementsMatch.oa";
import {
    oRAddressSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRAddressSubstringElementsMatch.oa";
import {
    oRNameMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRNameMatch.oa";
import {
    oRNameElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRNameElementsMatch.oa";
import {
    oRNameSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRNameSubstringElementsMatch.oa";
import {
    oRNameSingleElementMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/oRNameSingleElementMatch.oa";
import {
    redirectionOrDLExpansionMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionOrDLExpansionMatch.oa";
import {
    redirectionOrDLExpansionElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionOrDLExpansionElementsMatch.oa";
import {
    redirectionOrDLExpansionSingleElementMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionOrDLExpansionSingleElementMatch.oa";
import {
    redirectionOrDLExpansionSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionOrDLExpansionSubstringElementsMatch.oa";
import {
    redirectionReasonMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/redirectionReasonMatch.oa";
import {
    mTSIdentifierMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/mTSIdentifierMatch.oa";
import {
    contentCorrelatorMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/contentCorrelatorMatch.oa";
import {
    contentIdentifierMatch,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/contentIdentifierMatch.oa";
import {
    iPMIdentifierMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/iPMIdentifierMatch.oa";
import {
    iPMLocationMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/iPMLocationMatch.oa";
import {
    oRDescriptorMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/oRDescriptorMatch.oa";
import {
    oRDescriptorElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/oRDescriptorElementsMatch.oa";
import {
    oRDescriptorSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/oRDescriptorSubstringElementsMatch.oa";
import {
    oRDescriptorSingleElementMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/oRDescriptorSingleElementMatch.oa";
import {
    recipientSpecifierMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/recipientSpecifierMatch.oa";
import {
    recipientSpecifierElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/recipientSpecifierElementsMatch.oa";
import {
    recipientSpecifierSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/recipientSpecifierSubstringElementsMatch.oa";
import {
    recipientSpecifierSingleElementMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/recipientSpecifierSingleElementMatch.oa";
import {
    circulationMemberMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberMatch.oa";
import {
    circulationMemberElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberElementsMatch.oa";
import {
    circulationMemberSubstringElementsMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberSubstringElementsMatch.oa";
import {
    circulationMemberSingleElementMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberSingleElementMatch.oa";
import {
    circulationMemberCheckmarkMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/circulationMemberCheckmarkMatch.oa";
import {
    distributionCodeMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/distributionCodeMatch.oa";
import {
    informationCategoryMatch,
} from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/informationCategoryMatch.oa";
import {
    addressCapabilitiesMatch as addressCapabilitiesMatchMatcher,
} from "../matching/equality/addressCapabilitiesMatch";
import {
    capabilityMatch as capabilityMatchMatcher,
} from "../matching/equality/capabilityMatch";
import {
    circulationMemberCheckmarkMatch as circulationMemberCheckmarkMatchMatcher,
} from "../matching/equality/circulationMemberCheckmarkMatch";
import {
    getCirculationMemberElementsMatcher,
} from "../matching/equality/circulationMemberElementsMatch";
import {
    getCirculationMemberMatcher,
} from "../matching/equality/circulationMemberMatch";
import {
    circulationMemberSingleElementMatch as circulationMemberSingleElementMatchMatcher,
} from "../matching/equality/circulationMemberSingleElementMatch";
import {
    getCirculationMemberSubstringElementsMatcher,
} from "../matching/equality/circulationMemberSubstringElementsMatch";
import {
    contentCorrelatorMatch as contentCorrelatorMatchMatcher,
} from "../matching/equality/contentCorrelatorMatch";
import {
    contentIdentifierMatch as contentIdentifierMatchMatcher,
} from "../matching/equality/contentIdentifierMatch";
import {
    distributionCodeMatch as distributionCodeMatchMatcher,
} from "../matching/equality/distributionCodeMatch";
import {
    informationCategoryMatch as informationCategoryMatchMatcher,
} from "../matching/equality/informationCategoryMatch";
import {
    getIPMIdentifierMatcher,
} from "../matching/equality/iPMIdentifierMatch";
import {
    iPMLocationMatch as iPMLocationMatchMatcher,
} from "../matching/equality/iPMLocationMatch";
import {
    mSSingleSubstringListElementsMatch as mSSingleSubstringListElementsMatchMatcher,
} from "../matching/equality/mSSingleSubstringListElementsMatch";
import {
    mSSingleSubstringListMatch as mSSingleSubstringListMatchMatcher,
} from "../matching/equality/mSSingleSubstringListMatch";
import {
    mSStringCaseSensitiveMatch as mSStringCaseSensitiveMatchMatcher,
} from "../matching/equality/msStringCaseSensitiveMatch";
import {
    mSStringListElementsMatch as mSStringListElementsMatchMatcher,
} from "../matching/equality/msStringListElementsMatch";
import {
    mSStringListMatch as mSStringListMatchMatcher,
} from "../matching/equality/mSStringListMatch";
import {
    mSStringMatch as mSStringMatchMatcher,
} from "../matching/equality/mSStringMatch";
import {
    mSSubstringsMatch as mSSubstringsMatchMatcher,
} from "../matching/equality/mSSubstringsMatch";
import {
    mTSIdentifierMatch as mTSIdentifierMatchMatcher,
} from "../matching/equality/mTSIdentifierMatch";
import { oRAddressElementsMatch as oRAddressElementsMatchMatcher } from "../matching/equality/oRAddressElementsMatch";
import {
    oRAddressMatch as oRAddressMatchMatcher,
} from "../matching/equality/oRAddressMatch";
import {
    oRAddressSubstringElementsMatch as oRAddressSubstringElementsMatchMatcher,
} from "../matching/equality/oRAddressSubstringElementsMatch";
import {
    getORDescriptorElementsMatcher,
} from "../matching/equality/oRDescriptorElementsMatch";
import {
    getORDescriptorMatcher,
} from "../matching/equality/oRDescriptorMatch";
import {
    oRDescriptorSingleElementMatch as oRDescriptorSingleElementMatchMatcher,
} from "../matching/equality/oRDescriptorSingleElementMatch";
import {
    getORDescriptorSubstringElementsMatcher,
} from "../matching/equality/oRDescriptorSubstringElementsMatch";
import {
    getORNameElementsMatcher,
} from "../matching/equality/oRNameElementsMatch";
import {
    getORNameExactMatcher,
} from "../matching/equality/oRNameExactMatch";
import {
    getORNameMatcher
} from "../matching/equality/oRNameMatch";
import {
    oRNameSingleElementMatch as oRNameSingleElementMatchMatcher,
} from "../matching/equality/oRNameSingleElementMatch";
import {
    getORNameSubstringElementsMatcher,
} from "../matching/equality/oRNameSubstringElementsMatch";
import {
    getRecipientSpecifierElementsMatcher,
} from "../matching/equality/recipientSpecifierElementsMatch";
import {
    getRecipientSpecifierMatcher,
} from "../matching/equality/recipientSpecifierMatch";
import {
    recipientSpecifierSingleElementMatch as recipientSpecifierSingleElementMatchMatcher,
} from "../matching/equality/recipientSpecifierSingleElementMatch";
import {
    getRecipientSpecifierSubstringElementsMatcher,
} from "../matching/equality/recipientSpecifierSubstringElementsMatch";
import {
    getRedirectionOrDLExpansionElementsMatch
} from "../matching/equality/redirectionOrDLExpansionElementsMatch";
import {
    getRedirectionOrDLExpansionMatch,
} from "../matching/equality/redirectionOrDLExpansionMatch";
import {
    redirectionOrDLExpansionSingleElementMatch as redirectionOrDLExpansionSingleElementMatchMatcher,
} from "../matching/equality/redirectionOrDLExpansionSingleElementMatch";
import {
    getRedirectionOrDLExpansionSubstringElementsMatch,
} from "../matching/equality/redirectionOrDLExpansionSubstringElementsMatch";
import {
    redirectionReasonMatch as redirectionReasonMatchMatcher,
} from "../matching/equality/redirectionReasonMatch";
import {
    mSStringOrderingMatch as mSStringOrderingMatchMatcher,
} from "../matching/ordering/mSStringOrderingMatch";
import {
    mSSingleSubstringMatch as mSSingleSubstringMatchMatcher,
} from "../matching/substring/mSSingleSubstringMatch";

// PKCS #9 Matching Rules
import {
    pkcs9CaseIgnoreMatch,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/pkcs9CaseIgnoreMatch.oa";
import {
    signingTimeMatch,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/signingTimeMatch.oa";
import {
    pkcs9CaseIgnoreMatch as pkcs9CaseIgnoreMatchMatcher,
} from "../matching/equality/pkcs9CaseIgnoreMatch";
import {
    signingTimeMatch as signingTimeMatchMatcher,
} from "../matching/equality/signingTimeMatch";

const caseIgnoreSortKeyGetter: SortKeyGetter = (element: ASN1Element): SortKey | null => {
    const ds = _decode_UnboundedDirectoryString(element);
    const str = directoryStringToString(ds).toUpperCase();
    const buf = Buffer.from([ 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
    buf.set(Buffer.from(str, "utf-8").slice(0, 7), 1);
    return buf.readBigUInt64BE();
};

const caseExactSortKeyGetter: SortKeyGetter = (element: ASN1Element): SortKey | null => {
    const ds = _decode_UnboundedDirectoryString(element);
    const str = directoryStringToString(ds);
    const buf = Buffer.from([ 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
    buf.set(Buffer.from(str, "utf-8").slice(0, 7), 1);
    return buf.readBigUInt64BE();
};

// A separate UUID sort key getter is not necessary, because it does the same thing as OCTET STRING.

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

/**
 * @summary Initialize Meerkat DSA's internal index of known matching rules.
 * @description
 *
 * Initialize Meerkat DSA's internal index of known matching rules.
 *
 * @param ctx The context object
 *
 * @function
 */
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
        [ addressCapabilitiesMatch, addressCapabilitiesMatchMatcher ],
        [ capabilityMatch, capabilityMatchMatcher ],
        [ oRNameExactMatch, getORNameExactMatcher(ctx) ],
        [ mSStringMatch, mSStringMatchMatcher ],
        [ mSSubstringsMatch, mSSubstringsMatchMatcher ],
        [ mSStringCaseSensitiveMatch, mSStringCaseSensitiveMatchMatcher ],
        [ mSStringListMatch, mSStringListMatchMatcher ],
        [ mSStringListElementsMatch, mSStringListElementsMatchMatcher ],
        [ mSSingleSubstringListMatch, mSSingleSubstringListMatchMatcher ],
        [ mSSingleSubstringListElementsMatch, mSSingleSubstringListElementsMatchMatcher ],
        [ oRAddressMatch, oRAddressMatchMatcher ],
        [ oRAddressElementsMatch, oRAddressElementsMatchMatcher ],
        [ oRAddressSubstringElementsMatch, oRAddressSubstringElementsMatchMatcher ],
        [ oRNameMatch, getORNameMatcher(ctx) ],
        [ oRNameElementsMatch, getORNameElementsMatcher(ctx) ],
        [ oRNameSubstringElementsMatch, getORNameSubstringElementsMatcher(ctx) ],
        [ oRNameSingleElementMatch, oRNameSingleElementMatchMatcher ],
        [ redirectionOrDLExpansionMatch, getRedirectionOrDLExpansionMatch(ctx) ],
        [ redirectionOrDLExpansionElementsMatch, getRedirectionOrDLExpansionElementsMatch(ctx) ],
        [ redirectionOrDLExpansionSingleElementMatch, redirectionOrDLExpansionSingleElementMatchMatcher ],
        [ redirectionOrDLExpansionSubstringElementsMatch, getRedirectionOrDLExpansionSubstringElementsMatch(ctx) ],
        [ redirectionReasonMatch, redirectionReasonMatchMatcher ],
        [ mTSIdentifierMatch, mTSIdentifierMatchMatcher ],
        [ contentCorrelatorMatch, contentCorrelatorMatchMatcher ],
        [ contentIdentifierMatch, contentIdentifierMatchMatcher ],
        [ iPMIdentifierMatch, getIPMIdentifierMatcher(ctx) ],
        [ iPMLocationMatch, iPMLocationMatchMatcher ],
        [ oRDescriptorMatch, getORDescriptorMatcher(ctx) ],
        [ oRDescriptorElementsMatch, getORDescriptorElementsMatcher(ctx) ],
        [ oRDescriptorSubstringElementsMatch, getORDescriptorSubstringElementsMatcher(ctx) ],
        [ oRDescriptorSingleElementMatch, oRDescriptorSingleElementMatchMatcher ],
        [ recipientSpecifierMatch, getRecipientSpecifierMatcher(ctx) ],
        [ recipientSpecifierElementsMatch, getRecipientSpecifierElementsMatcher(ctx) ],
        [ recipientSpecifierSubstringElementsMatch, getRecipientSpecifierSubstringElementsMatcher(ctx) ],
        [ recipientSpecifierSingleElementMatch, recipientSpecifierSingleElementMatchMatcher ],
        [ circulationMemberMatch, getCirculationMemberMatcher(ctx) ],
        [ circulationMemberElementsMatch, getCirculationMemberElementsMatcher(ctx) ],
        [ circulationMemberSubstringElementsMatch, getCirculationMemberSubstringElementsMatcher(ctx) ],
        [ circulationMemberSingleElementMatch, circulationMemberSingleElementMatchMatcher ],
        [ circulationMemberCheckmarkMatch, circulationMemberCheckmarkMatchMatcher ],
        [ distributionCodeMatch, distributionCodeMatchMatcher ],
        [ informationCategoryMatch, informationCategoryMatchMatcher ],
        [ pkcs9CaseIgnoreMatch, pkcs9CaseIgnoreMatchMatcher ],
        [ signingTimeMatch, signingTimeMatchMatcher ],
    ];
    const orderingInfo: [ MATCHING_RULE, OrderingMatcher ][] = [
        [ x500mr.caseExactOrderingMatch, caseExactOrderingMatch ],
        [ x500mr.caseIgnoreOrderingMatch, caseIgnoreOrderingMatch ],
        [ x500mr.generalizedTimeOrderingMatch, generalizedTimeOrderingMatch ],
        [ x500mr.integerOrderingMatch, integerOrderingMatch ],
        [ x500mr.numericStringOrderingMatch, numericStringOrderingMatch ],
        [ x500mr.octetStringOrderingMatch, octetStringOrderingMatch ],
        [ x500mr.uTCTimeOrderingMatch, uTCTimeOrderingMatch ],
        [ mSStringOrderingMatch, mSStringOrderingMatchMatcher ],
    ];
    const substringsInfo: [ MATCHING_RULE, SubstringsMatcher ][] = [
        [ x500mr.caseExactSubstringsMatch, caseExactSubstringsMatch ],
        [ x500mr.caseIgnoreIA5SubstringsMatch, caseIgnoreIA5SubstringsMatch ],
        // [ x500mr.caseIgnoreListSubstringsMatch, caseIgnoreListSubstringsMatch ],
        [ x500mr.caseIgnoreSubstringsMatch, caseIgnoreSubstringsMatch ],
        [ x500mr.numericStringSubstringsMatch, numericStringSubstringsMatch ],
        [ x500mr.octetStringSubstringsMatch, octetStringSubstringsMatch ],
        [ x500mr.telephoneNumberSubstringsMatch, telephoneNumberSubstringsMatch ],
        [ mSSingleSubstringMatch, mSSingleSubstringMatchMatcher ],
    ];

    equalityInfo
        .forEach(([ mr, matcher ]) => {
            const info = toInfo(mr, matcher);
            ctx.equalityMatchingRules.set(mr["&id"].toString(), info);
            mr["&ldapName"]?.forEach((name) => {
                ctx.equalityMatchingRules.set(name, info);
                ctx.equalityMatchingRules.set(name.toLowerCase(), info);
            });
        });
    orderingInfo
        .forEach(([ mr, matcher ]) => {
            const info = toInfo(mr, matcher);
            ctx.orderingMatchingRules.set(mr["&id"].toString(), info);
            mr["&ldapName"]?.forEach((name) => {
                ctx.orderingMatchingRules.set(name, info);
                ctx.orderingMatchingRules.set(name.toLowerCase(), info);
            });
        });
    substringsInfo
        .forEach(([ mr, matcher ]) => {
            const info = toInfo(mr, matcher);
            ctx.substringsMatchingRules.set(mr["&id"].toString(), info);
            mr["&ldapName"]?.forEach((name) => {
                ctx.substringsMatchingRules.set(name, info);
                ctx.substringsMatchingRules.set(name.toLowerCase(), info);
            });
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
            name: ["uuidOrderingMatch"],
        },
    );

    ctx.orderingMatchingRules.get(x500mr.caseExactOrderingMatch["&id"]!.toString())!.sortKeyGetter = caseExactSortKeyGetter;
    ctx.orderingMatchingRules.get(x500mr.caseIgnoreOrderingMatch["&id"]!.toString())!.sortKeyGetter = caseIgnoreSortKeyGetter;
}

export default loadMatchingRules;
