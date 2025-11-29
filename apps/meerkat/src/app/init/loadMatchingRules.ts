import type {
    Context,
    MatchingRuleInfo,
    SortKeyGetter,
    SortKey,
} from "../types/index.js";
import type {
    MATCHING_RULE,
} from "@wildboar/x500/InformationFramework";
import { type EqualityMatcher } from "@wildboar/x500";
import { type OrderingMatcher } from "@wildboar/x500";
import { type SubstringsMatcher } from "@wildboar/x500";
import { matchingRules as x500mr } from "@wildboar/x500";
import {
    caseIgnoreMatch,
    caseExactMatch,
    acceptableCertPoliciesMatch,
    accessPointMatch,
    algorithmIdentifierMatch,
    attDescriptor,
    attributeCertificateExactMatch,
    attributeCertificateMatch,
    authAttIdMatch,
    basicAttConstraintsMatch,
    bitStringMatch,
    booleanMatch,
    caseExactIA5Match,
    caseIgnoreIA5Match,
    caseIgnoreListMatch,
    certificateExactMatch,
    certificateListExactMatch,
    certificateListMatch,
    certificateMatch,
    certificatePairExactMatch,
    certificatePairMatch,
    delegatedNameConstraintsMatch,
    delegationPathMatch,
    directoryStringFirstComponentMatch,
    distinguishedNameMatch,
    dnsNameMatch,
    dualStringMatch,
    enhancedCertificateMatch,
    extensionPresenceMatch,
    facsimileNumberMatch,
//     generalWordMatch,
    generalizedTimeMatch,
    holderIssuerMatch,
    intEmailMatch,
    integerFirstComponentMatch,
    integerMatch,
    jidMatch,
    masterAndShadowAccessPointsMatch,
    numericStringMatch,
    objectIdentifierFirstComponentMatch,
    objectIdentifierMatch,
    octetStringMatch,
    pkiPathMatch,
    policyMatch,
    presentationAddressMatch,
    protocolInformationMatch,
    pwdEncAlgMatch,
    roleSpecCertIdMatch,
    sOAIdentifierMatch,
    supplierAndConsumersMatch,
    supplierOrConsumerInformationMatch,
    telephoneNumberMatch,
    timeSpecificationMatch,
    uTCTimeMatch,
    uUIDPairMatch,
    uniqueMemberMatch,
    uriMatch,
//     userPwdHistoryMatch,
//     userPwdMatch,
} from "@wildboar/x500/matching/equality";
import {
    wordMatch,
} from "../matching/equality/wordMatch.js";
import {
    caseExactOrderingMatch,
    caseIgnoreOrderingMatch,
    generalizedTimeOrderingMatch,
    integerOrderingMatch,
    numericStringOrderingMatch,
    octetStringOrderingMatch,
    uTCTimeOrderingMatch,
} from "@wildboar/x500/matching/ordering";
import {
    caseExactSubstringsMatch,
    caseIgnoreIA5SubstringsMatch,
    caseIgnoreSubstringsMatch,
    numericStringSubstringsMatch,
    octetStringSubstringsMatch,
    telephoneNumberSubstringsMatch,
    caseIgnoreListSubstringsMatch,
    storedPrefixMatch,
} from "@wildboar/x500/matching/substring";
import approx_acceptableCertPoliciesMatch from "../matching/approx/acceptableCertPoliciesMatch.js";
import approx_algorithmIdentifierMatch from "../matching/approx/algorithmIdentifierMatch.js";
import approx_attDescriptor from "../matching/approx/attDescriptor.js";
import approx_bitStringMatch from "../matching/approx/bitStringMatch.js";
import approx_caseIgnoreIA5Match from "../matching/approx/caseIgnoreIA5Match.js";
import approx_caseIgnoreListMatch from "../matching/approx/caseIgnoreListMatch.js";
import approx_caseIgnoreMatch from "../matching/approx/caseIgnoreMatch.js";
import approx_directoryStringFirstComponentMatch from "../matching/approx/directoryStringFirstComponentMatch.js";
import approx_distinguishedNameMatch from "../matching/approx/distinguishedNameMatch.js";
import approx_dualStringMatch from "../matching/approx/dualStringMatch.js";
import approx_generalizedTimeMatch from "../matching/approx/generalizedTimeMatch.js";
import approx_integerFirstComponentMatch from "../matching/approx/integerFirstComponentMatch.js";
import approx_integerMatch from "../matching/approx/integerMatch.js";
import approx_intEmailMatch from "../matching/approx/intEmailMatch.js";
import approx_jidMatch from "../matching/approx/jidMatch.js";
import approx_objectIdentifierMatch from "../matching/approx/objectIdentifierMatch.js";
import approx_pwdEncAlgMatch from "../matching/approx/pwdEncAlgMatch.js";
import approx_uniqueMemberMatch from "../matching/approx/uniqueMemberMatch.js";
import approx_uriMatch from "../matching/approx/uriMatch.js";
import approx_uTCTimeMatch from "../matching/approx/uTCTimeMatch.js";
import { uuidMatch as uuidMatcher } from "../matching/equality/uuidMatch.js";
import { uuidOrderingMatch as uuidOrderingMatcher } from "../matching/ordering/uuidOrderingMatch.js";
import type { ASN1Element, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { directoryStringToString } from "@wildboar/x500";
import {
    _decode_UnboundedDirectoryString,
} from "@wildboar/x500/SelectedAttributeTypes";

// X.400 Matching Rules
import {
    addressCapabilitiesMatch,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    capabilityMatch,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    oRNameExactMatch,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    mSStringMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSStringOrderingMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSSubstringsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSSingleSubstringMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSStringCaseSensitiveMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSStringListMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSStringListElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSSingleSubstringListMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mSSingleSubstringListElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
// import {
//     valueCountMatch,
// } from "@wildboar/x400/MSMatchingRules";
import {
    oRAddressMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRAddressElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRAddressSubstringElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRNameMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRNameElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRNameSubstringElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    oRNameSingleElementMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionOrDLExpansionMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionOrDLExpansionElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionOrDLExpansionSingleElementMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionOrDLExpansionSubstringElementsMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    redirectionReasonMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    mTSIdentifierMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    contentCorrelatorMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    contentIdentifierMatch,
} from "@wildboar/x400/MSMatchingRules";
import {
    iPMIdentifierMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    iPMLocationMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    oRDescriptorMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    oRDescriptorElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    oRDescriptorSubstringElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    oRDescriptorSingleElementMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    recipientSpecifierMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    recipientSpecifierElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    recipientSpecifierSubstringElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    recipientSpecifierSingleElementMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberSubstringElementsMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberSingleElementMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    circulationMemberCheckmarkMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    distributionCodeMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    informationCategoryMatch,
} from "@wildboar/x400/IPMSMessageStoreAttributes";
import {
    policySpecificationMatch,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/policySpecificationMatch.oa.js";
import {
    addressCapabilitiesMatch as addressCapabilitiesMatchMatcher,
} from "../matching/equality/addressCapabilitiesMatch.js";
import {
    capabilityMatch as capabilityMatchMatcher,
} from "../matching/equality/capabilityMatch.js";
import {
    circulationMemberCheckmarkMatch as circulationMemberCheckmarkMatchMatcher,
} from "../matching/equality/circulationMemberCheckmarkMatch.js";
import {
    getCirculationMemberElementsMatcher,
} from "../matching/equality/circulationMemberElementsMatch.js";
import {
    getCirculationMemberMatcher,
} from "../matching/equality/circulationMemberMatch.js";
import {
    circulationMemberSingleElementMatch as circulationMemberSingleElementMatchMatcher,
} from "../matching/equality/circulationMemberSingleElementMatch.js";
import {
    getCirculationMemberSubstringElementsMatcher,
} from "../matching/equality/circulationMemberSubstringElementsMatch.js";
import {
    contentCorrelatorMatch as contentCorrelatorMatchMatcher,
} from "../matching/equality/contentCorrelatorMatch.js";
import {
    contentIdentifierMatch as contentIdentifierMatchMatcher,
} from "../matching/equality/contentIdentifierMatch.js";
import {
    distributionCodeMatch as distributionCodeMatchMatcher,
} from "../matching/equality/distributionCodeMatch.js";
import {
    informationCategoryMatch as informationCategoryMatchMatcher,
} from "../matching/equality/informationCategoryMatch.js";
import {
    getIPMIdentifierMatcher,
} from "../matching/equality/iPMIdentifierMatch.js";
import {
    iPMLocationMatch as iPMLocationMatchMatcher,
} from "../matching/equality/iPMLocationMatch.js";
import {
    mSSingleSubstringListElementsMatch as mSSingleSubstringListElementsMatchMatcher,
} from "../matching/equality/mSSingleSubstringListElementsMatch.js";
import {
    mSSingleSubstringListMatch as mSSingleSubstringListMatchMatcher,
} from "../matching/equality/mSSingleSubstringListMatch.js";
import {
    mSStringCaseSensitiveMatch as mSStringCaseSensitiveMatchMatcher,
} from "../matching/equality/msStringCaseSensitiveMatch.js";
import {
    mSStringListElementsMatch as mSStringListElementsMatchMatcher,
} from "../matching/equality/msStringListElementsMatch.js";
import {
    mSStringListMatch as mSStringListMatchMatcher,
} from "../matching/equality/mSStringListMatch.js";
import {
    mSStringMatch as mSStringMatchMatcher,
} from "../matching/equality/mSStringMatch.js";
import {
    mSSubstringsMatch as mSSubstringsMatchMatcher,
} from "../matching/equality/mSSubstringsMatch.js";
import {
    mTSIdentifierMatch as mTSIdentifierMatchMatcher,
} from "../matching/equality/mTSIdentifierMatch.js";
import { oRAddressElementsMatch as oRAddressElementsMatchMatcher } from "../matching/equality/oRAddressElementsMatch.js";
import {
    oRAddressMatch as oRAddressMatchMatcher,
} from "../matching/equality/oRAddressMatch.js";
import {
    oRAddressSubstringElementsMatch as oRAddressSubstringElementsMatchMatcher,
} from "../matching/equality/oRAddressSubstringElementsMatch.js";
import {
    getORDescriptorElementsMatcher,
} from "../matching/equality/oRDescriptorElementsMatch.js";
import {
    getORDescriptorMatcher,
} from "../matching/equality/oRDescriptorMatch.js";
import {
    oRDescriptorSingleElementMatch as oRDescriptorSingleElementMatchMatcher,
} from "../matching/equality/oRDescriptorSingleElementMatch.js";
import {
    getORDescriptorSubstringElementsMatcher,
} from "../matching/equality/oRDescriptorSubstringElementsMatch.js";
import {
    getORNameElementsMatcher,
} from "../matching/equality/oRNameElementsMatch.js";
import {
    getORNameExactMatcher,
} from "../matching/equality/oRNameExactMatch.js";
import {
    getORNameMatcher
} from "../matching/equality/oRNameMatch.js";
import {
    oRNameSingleElementMatch as oRNameSingleElementMatchMatcher,
} from "../matching/equality/oRNameSingleElementMatch.js";
import {
    getORNameSubstringElementsMatcher,
} from "../matching/equality/oRNameSubstringElementsMatch.js";
import {
    getRecipientSpecifierElementsMatcher,
} from "../matching/equality/recipientSpecifierElementsMatch.js";
import {
    getRecipientSpecifierMatcher,
} from "../matching/equality/recipientSpecifierMatch.js";
import {
    recipientSpecifierSingleElementMatch as recipientSpecifierSingleElementMatchMatcher,
} from "../matching/equality/recipientSpecifierSingleElementMatch.js";
import {
    getRecipientSpecifierSubstringElementsMatcher,
} from "../matching/equality/recipientSpecifierSubstringElementsMatch.js";
import {
    getRedirectionOrDLExpansionElementsMatch
} from "../matching/equality/redirectionOrDLExpansionElementsMatch.js";
import {
    getRedirectionOrDLExpansionMatch,
} from "../matching/equality/redirectionOrDLExpansionMatch.js";
import {
    redirectionOrDLExpansionSingleElementMatch as redirectionOrDLExpansionSingleElementMatchMatcher,
} from "../matching/equality/redirectionOrDLExpansionSingleElementMatch.js";
import {
    getRedirectionOrDLExpansionSubstringElementsMatch,
} from "../matching/equality/redirectionOrDLExpansionSubstringElementsMatch.js";
import {
    redirectionReasonMatch as redirectionReasonMatchMatcher,
} from "../matching/equality/redirectionReasonMatch.js";
import {
    mSStringOrderingMatch as mSStringOrderingMatchMatcher,
} from "../matching/ordering/mSStringOrderingMatch.js";
import {
    mSSingleSubstringMatch as mSSingleSubstringMatchMatcher,
} from "../matching/substring/mSSingleSubstringMatch.js";

// PKCS #9 Matching Rules
import {
    pkcs9CaseIgnoreMatch,
    signingTimeMatch,
} from "@wildboar/pkcs/PKCS-9";
import {
    pkcs9CaseIgnoreMatch as pkcs9CaseIgnoreMatchMatcher,
} from "../matching/equality/pkcs9CaseIgnoreMatch.js";
import {
    signingTimeMatch as signingTimeMatchMatcher,
} from "../matching/equality/signingTimeMatch.js";

// IANA LDAP Parity Matching Rules
// import {
//     authPasswordExactMatch,
// } from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPasswordExactMatch.oa.js";
// import {
//     authPasswordMatch,
// } from "@wildboar/parity-schema/src/lib/modules/AuthPasswordSchema/authPasswordMatch.oa.js";
import {
    caseExactIA5SubstringsMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/caseExactIA5SubstringsMatch.oa.js";
import {
    directoryStringApproxMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/directoryStringApproxMatch.oa.js";
import {
    ia5StringApproxMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/ia5StringApproxMatch.oa.js";
import {
    integerBitAndMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/integerBitAndMatch.oa.js";
import {
    integerBitOrMatch,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/integerBitOrMatch.oa.js";
// import {
//     allComponentsMatch,
// } from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/allComponentsMatch.oa.js";
// import {
//     componentFilterMatch,
// } from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/componentFilterMatch.oa.js";
// import {
//     directoryComponentsMatch,
// } from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/directoryComponentsMatch.oa.js";
// import {
//     presentMatch,
// } from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/presentMatch.oa.js";
import {
    rdnMatch,
} from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/rdnMatch.oa.js";
import {
    uuidMatch,
} from "@wildboar/parity-schema/src/lib/modules/UUID/uuidMatch.oa.js";
import {
    uuidOrderingMatch,
} from "@wildboar/parity-schema/src/lib/modules/UUID/uuidOrderingMatch.oa.js";
import {
    caseExactIA5SubstringsMatch as caseExactIA5SubstringsMatcher,
} from "../matching/substring/caseExactIA5SubstringsMatch.js";
import {
    matcher as directoryStringApproxMatcher,
} from "../matching/equality/directoryStringApproxMatch.js";
import {
    matcher as ia5StringApproxMatcher,
} from "../matching/equality/ia5StringApproxMatch.js";
import {
    matcher as integerBitAndMatcher,
} from "../matching/equality/integerBitAndMatch.js";
import {
    matcher as integerBitOrMatcher,
} from "../matching/equality/integerBitOrMatch.js";
import { getRDNMatcher } from "../matching/equality/rdnMatch.js";
import {
    getPolicySpecificationMatcher,
} from "../matching/equality/policySpecificationMatch.js";
import * as norms from "../matching/normalizers.js";

const caseIgnoreSortKeyGetter: SortKeyGetter = (element: ASN1Element): SortKey | null => {
    const ds = _decode_UnboundedDirectoryString(element);
    const str = directoryStringToString(ds).toUpperCase();
    const buf = Buffer.from([ 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
    buf.set(Buffer.from(str, "utf-8").subarray(0, 7), 1);
    return buf.readBigUInt64BE();
};

const caseExactSortKeyGetter: SortKeyGetter = (element: ASN1Element): SortKey | null => {
    const ds = _decode_UnboundedDirectoryString(element);
    const str = directoryStringToString(ds);
    const buf = Buffer.from([ 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
    buf.set(Buffer.from(str, "utf-8").subarray(0, 7), 1);
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

const relaxations: [ OBJECT_IDENTIFIER, OBJECT_IDENTIFIER ][] = [
    [ x500mr.caseExactMatch["&id"], x500mr.caseIgnoreMatch["&id"] ],
    [ x500mr.caseExactOrderingMatch["&id"], x500mr.caseIgnoreOrderingMatch["&id"] ],
    [ x500mr.caseExactSubstringsMatch["&id"], x500mr.caseIgnoreSubstringsMatch["&id"] ],
    [ x500mr.caseExactIA5Match["&id"], x500mr.caseIgnoreIA5Match["&id"] ],
    [ x500mr.caseIgnoreMatch["&id"], x500mr.wordMatch["&id"] ],
];

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
        // [ x500mr.approximateStringMatch, approximateStringMatch ], // Supported by @wildboar/x500#evaluateFilter().
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
        // TODO: [ x500mr.generalWordMatch, generalWordMatch ],
        [ x500mr.generalizedTimeMatch, generalizedTimeMatch ],
        [ x500mr.holderIssuerMatch, holderIssuerMatch ],
        // [ x500mr.ignoreIfAbsentMatch, ignoreIfAbsentMatch ], // Not directly usable.
        [ x500mr.intEmailMatch, intEmailMatch ],
        [ x500mr.integerFirstComponentMatch, integerFirstComponentMatch ],
        [ x500mr.integerMatch, integerMatch ],
        [ x500mr.jidMatch, jidMatch ],
        [ x500mr.keywordMatch, wordMatch ],
        [ x500mr.masterAndShadowAccessPointsMatch, masterAndShadowAccessPointsMatch ],
        // [ x500mr.nullMatch, nullMatch ], // Supported by @wildboar/x500#evaluateFilter().
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
        [ x500mr.supplierAndConsumersMatch, supplierAndConsumersMatch ],
        [ x500mr.supplierOrConsumerInformationMatch, supplierOrConsumerInformationMatch ],
        [ x500mr.telephoneNumberMatch, telephoneNumberMatch ],
        [ x500mr.timeSpecificationMatch, timeSpecificationMatch ],
        [ x500mr.uTCTimeMatch, uTCTimeMatch ],
        [ x500mr.uUIDPairMatch, uUIDPairMatch ],
        [ x500mr.uniqueMemberMatch, uniqueMemberMatch ],
        [ x500mr.uriMatch, uriMatch ],
        // TODO: [ x500mr.userPwdHistoryMatch, userPwdHistoryMatch ],
        // TODO: [ x500mr.userPwdMatch, userPwdMatch ],
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
        [ directoryStringApproxMatch, directoryStringApproxMatcher ],
        [ ia5StringApproxMatch, ia5StringApproxMatcher ],
        [ integerBitAndMatch, integerBitAndMatcher ],
        [ integerBitOrMatch, integerBitOrMatcher ],
        [ rdnMatch, getRDNMatcher(ctx) ],
        [ uuidMatch, uuidMatcher ],
        [ policySpecificationMatch, getPolicySpecificationMatcher(ctx) ],
        // dynamicPropValueMatch will not be implemented, because it is too
        // vague, and it is not defined as the equality matching rule for any
        // attribute type.
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
        [ uuidOrderingMatch, uuidOrderingMatcher ],
    ];
    const substringsInfo: [ MATCHING_RULE, SubstringsMatcher ][] = [
        [ x500mr.caseExactSubstringsMatch, caseExactSubstringsMatch ],
        [ x500mr.caseIgnoreIA5SubstringsMatch, caseIgnoreIA5SubstringsMatch ],
        [ x500mr.caseIgnoreListSubstringsMatch, caseIgnoreListSubstringsMatch ],
        [ x500mr.caseIgnoreSubstringsMatch, caseIgnoreSubstringsMatch ],
        [ x500mr.numericStringSubstringsMatch, numericStringSubstringsMatch ],
        [ x500mr.octetStringSubstringsMatch, octetStringSubstringsMatch ],
        [ x500mr.telephoneNumberSubstringsMatch, telephoneNumberSubstringsMatch ],
        [ x500mr.storedPrefixMatch, storedPrefixMatch ],
        [ mSSingleSubstringMatch, mSSingleSubstringMatchMatcher ],
        [ caseExactIA5SubstringsMatch, caseExactIA5SubstringsMatcher ],
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

    ctx.orderingMatchingRules.get(x500mr.caseExactOrderingMatch["&id"]!.toString())!.sortKeyGetter = caseExactSortKeyGetter;
    ctx.orderingMatchingRules.get(x500mr.caseIgnoreOrderingMatch["&id"]!.toString())!.sortKeyGetter = caseIgnoreSortKeyGetter;

    ctx.equalityMatchingRules.get(x500mr.caseIgnoreMatch["&id"].toString())!.normalizer = norms.caseIgnoreMatch;
    ctx.equalityMatchingRules.get(x500mr.caseExactMatch["&id"].toString())!.normalizer = norms.caseExactMatch;
    ctx.equalityMatchingRules.get(x500mr.booleanMatch["&id"].toString())!.normalizer = norms.booleanMatch;
    ctx.equalityMatchingRules.get(x500mr.integerMatch["&id"].toString())!.normalizer = norms.integerMatch;
    ctx.equalityMatchingRules.get(x500mr.objectIdentifierMatch["&id"].toString())!.normalizer = norms.objectIdentifierMatch;
    ctx.equalityMatchingRules.get(x500mr.bitStringMatch["&id"].toString())!.normalizer = norms.bitStringMatch;
    ctx.equalityMatchingRules.get(x500mr.generalizedTimeMatch["&id"].toString())!.normalizer = norms.generalizedTimeMatch;
    ctx.equalityMatchingRules.get(x500mr.uTCTimeMatch["&id"].toString())!.normalizer = norms.utcTimeMatch;
    ctx.equalityMatchingRules.get(x500mr.octetStringMatch["&id"].toString())!.normalizer = norms.octetStringMatch;
    ctx.equalityMatchingRules.get(x500mr.numericStringMatch["&id"].toString())!.normalizer = norms.numericStringMatch;
    ctx.equalityMatchingRules.get(x500mr.telephoneNumberMatch["&id"].toString())!.normalizer = norms.telephoneNumberMatch;
    ctx.equalityMatchingRules.get(x500mr.dnsNameMatch["&id"].toString())!.normalizer = norms.dnsNameMatch;
    ctx.equalityMatchingRules.get(x500mr.intEmailMatch["&id"].toString())!.normalizer = norms.intEmailMatch;
    ctx.equalityMatchingRules.get(x500mr.jidMatch["&id"].toString())!.normalizer = norms.jidMatch;
    ctx.equalityMatchingRules.get(x500mr.directoryStringFirstComponentMatch["&id"].toString())!.normalizer = norms.directoryStringFirstComponentMatch;
    ctx.equalityMatchingRules.get(x500mr.integerFirstComponentMatch["&id"].toString())!.normalizer = norms.integerFirstComponentMatch;
    ctx.equalityMatchingRules.get(x500mr.objectIdentifierFirstComponentMatch["&id"].toString())!.normalizer = norms.objectIdentifierFirstComponentMatch;
    ctx.equalityMatchingRules.get(x500mr.caseIgnoreListMatch["&id"].toString())!.normalizer = norms.caseIgnoreListMatch;
    ctx.equalityMatchingRules.get(x500mr.caseIgnoreIA5Match["&id"].toString())!.normalizer = norms.caseIgnoreIA5Match;
    ctx.equalityMatchingRules.get(x500mr.caseExactIA5Match["&id"].toString())!.normalizer = norms.caseExactIA5Match;
    ctx.equalityMatchingRules.get(rdnMatch["&id"].toString())!.normalizer = norms.rdnMatch;
    ctx.equalityMatchingRules.get(x500mr.distinguishedNameMatch["&id"].toString())!.normalizer = norms.distinguishedNameMatch;
    ctx.equalityMatchingRules.get(uuidMatch["&id"].toString())!.normalizer = norms.uuidMatch;
    ctx.equalityMatchingRules.get(x500mr.dualStringMatch["&id"].toString())!.normalizer = norms.dualStringMatch;
    ctx.equalityMatchingRules.get(x500mr.accessPointMatch["&id"].toString())!.normalizer = norms.accessPointMatch;
    ctx.equalityMatchingRules.get(x500mr.masterAndShadowAccessPointsMatch["&id"].toString())!.normalizer = norms.masterAndShadowAccessPointsMatch;
    ctx.equalityMatchingRules.get(x500mr.presentationAddressMatch["&id"].toString())!.normalizer = norms.presentationAddressMatch;
    ctx.equalityMatchingRules.get(x500mr.protocolInformationMatch["&id"].toString())!.normalizer = norms.protocolInformationMatch;
    ctx.equalityMatchingRules.get(x500mr.uUIDPairMatch["&id"].toString())!.normalizer = norms.uUIDPairMatch;
    ctx.equalityMatchingRules.get(x500mr.facsimileNumberMatch["&id"].toString())!.normalizer = norms.facsimileNumberMatch;
    ctx.equalityMatchingRules.get(signingTimeMatch["&id"].toString())!.normalizer = norms.signingTimeMatch;
    ctx.equalityMatchingRules.get(pkcs9CaseIgnoreMatch["&id"].toString())!.normalizer = norms.pkcs9CaseIgnoreMatch;
    ctx.equalityMatchingRules.get(x500mr.algorithmIdentifierMatch["&id"].toString())!.normalizer = norms.algorithmIdentifierMatch;
    ctx.equalityMatchingRules.get(x500mr.pwdEncAlgMatch["&id"].toString())!.normalizer = norms.pwdEncAlgMatch;
    ctx.equalityMatchingRules.get(x500mr.policyMatch["&id"].toString())!.normalizer = norms.policyMatch;

    for (const [ strict_mr, relaxed_mr ] of relaxations) {
        ctx.systemProposedRelaxations.set(strict_mr.toString(), relaxed_mr);
        ctx.systemProposedTightenings.set(relaxed_mr.toString(), strict_mr);
    }

}

export default loadMatchingRules;
