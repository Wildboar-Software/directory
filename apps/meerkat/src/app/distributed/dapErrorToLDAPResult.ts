import type { Context } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    // LDAPResult_resultCode_success,
    // LDAPResult_resultCode_operationsError,
    // LDAPResult_resultCode_protocolError,
    LDAPResult_resultCode_timeLimitExceeded,
    // LDAPResult_resultCode_sizeLimitExceeded,
    // LDAPResult_resultCode_compareFalse,
    // LDAPResult_resultCode_compareTrue,
    LDAPResult_resultCode_authMethodNotSupported,
    // LDAPResult_resultCode_strongerAuthRequired,
    LDAPResult_resultCode_referral,
    LDAPResult_resultCode_adminLimitExceeded,
    LDAPResult_resultCode_unavailableCriticalExtension,
    LDAPResult_resultCode_confidentialityRequired,
    LDAPResult_resultCode_saslBindInProgress,
    LDAPResult_resultCode_noSuchAttribute,
    LDAPResult_resultCode_undefinedAttributeType,
    LDAPResult_resultCode_inappropriateMatching,
    LDAPResult_resultCode_constraintViolation,
    LDAPResult_resultCode_attributeOrValueExists,
    LDAPResult_resultCode_invalidAttributeSyntax,
    LDAPResult_resultCode_noSuchObject,
    LDAPResult_resultCode_aliasProblem,
    // LDAPResult_resultCode_invalidDNSyntax,
    LDAPResult_resultCode_aliasDereferencingProblem,
    LDAPResult_resultCode_inappropriateAuthentication,
    LDAPResult_resultCode_invalidCredentials,
    LDAPResult_resultCode_insufficientAccessRights,
    LDAPResult_resultCode_busy,
    LDAPResult_resultCode_unavailable,
    LDAPResult_resultCode_unwillingToPerform,
    LDAPResult_resultCode_loopDetect,
    LDAPResult_resultCode_namingViolation,
    LDAPResult_resultCode_objectClassViolation,
    LDAPResult_resultCode_notAllowedOnNonLeaf,
    LDAPResult_resultCode_notAllowedOnRDN,
    LDAPResult_resultCode_entryAlreadyExists,
    LDAPResult_resultCode_objectClassModsProhibited,
    LDAPResult_resultCode_affectsMultipleDSAs,
    LDAPResult_resultCode_other,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    canceled,
    cannotCancel,
    tooLate,
    noSuchOperation,
} from "@wildboar/ldap/src/lib/resultCodes";
import {
    AbandonProblem_cannotAbandon,
    AbandonProblem_noSuchOperation,
    AbandonProblem_tooLate,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonProblem.ta";
import {
    AttributeProblem_noSuchAttributeOrValue,
    AttributeProblem_invalidAttributeSyntax,
    AttributeProblem_undefinedAttributeType,
    AttributeProblem_inappropriateMatching,
    AttributeProblem_constraintViolation,
    AttributeProblem_attributeOrValueAlreadyExists,
    // AttributeProblem_contextViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    NameProblem_aliasDereferencingProblem,
    NameProblem_aliasProblem,
    NameProblem_invalidAttributeSyntax,
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import {
    SecurityProblem_inappropriateAuthentication,
    SecurityProblem_invalidCredentials,
    SecurityProblem_insufficientAccessRights,
    // SecurityProblem_invalidSignature,
    SecurityProblem_protectionRequired,
    SecurityProblem_noInformation,
    // SecurityProblem_blockedCredentials,
    // SecurityProblem_spkmError,
    SecurityProblem_unsupportedAuthenticationMethod,
    // SecurityProblem_passwordExpired,
    // SecurityProblem_inappropriateAlgorithms,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    // ServiceProblem_chainingRequired,
    // ServiceProblem_unableToProceed,
    // ServiceProblem_invalidReference,
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_administrativeLimitExceeded,
    ServiceProblem_loopDetected,
    ServiceProblem_unavailableCriticalExtension,
    // ServiceProblem_outOfScope,
    // ServiceProblem_ditError,
    // ServiceProblem_invalidQueryReference,
    // ServiceProblem_requestedServiceNotAvailable,
    ServiceProblem_unsupportedMatchingUse,
    // ServiceProblem_ambiguousKeyAttributes,
    ServiceProblem_saslBindInProgress,
    // ServiceProblem_notSupportedByLDAP,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    UpdateProblem_namingViolation,
    UpdateProblem_objectClassViolation,
    UpdateProblem_notAllowedOnNonLeaf,
    UpdateProblem_notAllowedOnRDN,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_affectsMultipleDSAs,
    UpdateProblem_objectClassModificationProhibited,
    // UpdateProblem_noSuchSuperior,
    // UpdateProblem_notAncestor,
    // UpdateProblem_parentNotAncestor,
    // UpdateProblem_hierarchyRuleViolation,
    // UpdateProblem_familyRuleViolation,
    // UpdateProblem_insufficientPasswordQuality,
    // UpdateProblem_passwordInHistory,
    // UpdateProblem_noPasswordSlot,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import encodeLDAPDN from "../ldap/encodeLDAPDN";
import type {
    AccessPointInformation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";

function ldapErr (code: number, message: string): LDAPResult {
    return new LDAPResult(
        code,
        new Uint8Array(),
        Buffer.from(message, "utf-8"),
        undefined,
    );
}

function ldapErrWithDN (ctx: Context, code: number, message: string, dn: DistinguishedName): LDAPResult {
    return new LDAPResult(
        code,
        encodeLDAPDN(ctx, dn),
        Buffer.from(message, "utf-8"),
        undefined,
    );
}

function apiToURL (
    api: AccessPointInformation,
): string[] {
    return [
        ...api.address.nAddresses.map(naddrToURI),
        ...api.additionalPoints
            ?.flatMap((ap) => ap.address.nAddresses.map(naddrToURI)) ?? [],
    ]
        .filter((naddr): naddr is string => !!naddr)
        .filter((url) => url.toUpperCase().startsWith("LDAP"));
}

export
function dapErrorToLDAPResult (
    ctx: Context,
    e: Error,
    isCancel: boolean,
): LDAPResult | undefined {
    if (e instanceof errors.AbandonError) {
        // stats.outcome.error.pagingAbandoned = (e.data.problem === 0);
        if (isCancel) {
            return ldapErr(canceled, e.message);
        }
        return undefined;
    } else if (e instanceof errors.AbandonFailedError) {
        // stats.outcome.error.problem = e.data.problem;
        if (!isCancel) {
            return undefined;
        }
        switch (e.data.problem) {
        case (AbandonProblem_cannotAbandon):
            return ldapErr(cannotCancel, e.message);
        case (AbandonProblem_noSuchOperation):
            return ldapErr(noSuchOperation, e.message);
        case (AbandonProblem_tooLate):
            return ldapErr(tooLate, e.message);
        default:
            return ldapErr(LDAPResult_resultCode_other, e.message);
        }
    } else if (e instanceof errors.AttributeError) {
        // stats.outcome.error.attributeProblems = e.data.problems.map((ap) => ({
        //     type: ap.type_.toString(),
        //     problem: ap.problem,
        // }));
        for (const problem of e.data.problems) {
            switch (problem.problem) {
                case (AttributeProblem_noSuchAttributeOrValue):
                    return ldapErr(LDAPResult_resultCode_noSuchAttribute, e.message);
                case (AttributeProblem_invalidAttributeSyntax):
                    return ldapErr(LDAPResult_resultCode_invalidAttributeSyntax, e.message);
                case (AttributeProblem_undefinedAttributeType):
                    return ldapErr(LDAPResult_resultCode_undefinedAttributeType, e.message);
                case (AttributeProblem_inappropriateMatching):
                    return ldapErr(LDAPResult_resultCode_inappropriateMatching, e.message);
                case (AttributeProblem_constraintViolation):
                    return ldapErr(LDAPResult_resultCode_constraintViolation, e.message);
                case (AttributeProblem_attributeOrValueAlreadyExists):
                    return ldapErr(LDAPResult_resultCode_attributeOrValueExists, e.message);
                // case (AttributeProblem_contextViolation):
                default:
                    continue;
            }
        }
        return ldapErr(LDAPResult_resultCode_other, e.message);
    } else if (e instanceof errors.NameError) {
        switch (e.data.problem) {
            case (NameProblem_noSuchObject):
                return ldapErrWithDN(
                    ctx,
                    LDAPResult_resultCode_noSuchObject,
                    e.message,
                    e.data.matched.rdnSequence,
                );
            case (NameProblem_invalidAttributeSyntax):
                return ldapErr(LDAPResult_resultCode_invalidAttributeSyntax, e.message);
            case (NameProblem_aliasProblem):
                return ldapErr(LDAPResult_resultCode_aliasProblem, e.message);
            case (NameProblem_aliasDereferencingProblem):
                return ldapErr(LDAPResult_resultCode_aliasDereferencingProblem, e.message);
            default:
                return ldapErr(LDAPResult_resultCode_other, e.message);
        }
        // stats.outcome.error.matchedNameLength = e.data.matched.rdnSequence.length;
    } else if (e instanceof errors.ReferralError) {
        // stats.outcome.error.candidate = getContinuationReferenceStatistics(e.data.candidate);
        const urls: string[] = e.data.candidate.accessPoints.flatMap(apiToURL);
        return new LDAPResult(
            LDAPResult_resultCode_referral,
            new Uint8Array(),
            Buffer.from(e.message, "utf-8"),
            urls.map((url) => Buffer.from(url, "utf-8")),
        );
    } else if (e instanceof errors.SecurityError) {
        switch (e.data.problem) {
            case (SecurityProblem_inappropriateAuthentication):
                return ldapErr(LDAPResult_resultCode_inappropriateAuthentication, e.message);
            case (SecurityProblem_invalidCredentials):
                return ldapErr(LDAPResult_resultCode_invalidCredentials, e.message);
            case (SecurityProblem_insufficientAccessRights):
                return ldapErr(LDAPResult_resultCode_insufficientAccessRights, e.message);
            // case (SecurityProblem_invalidSignature):
            case (SecurityProblem_protectionRequired):
                return ldapErr(LDAPResult_resultCode_confidentialityRequired, e.message);
            case (SecurityProblem_noInformation):
                return ldapErr(LDAPResult_resultCode_other, e.message);
            // case (SecurityProblem_blockedCredentials):
            // case (SecurityProblem_spkmError):
            case (SecurityProblem_unsupportedAuthenticationMethod):
                return ldapErr(LDAPResult_resultCode_authMethodNotSupported, e.message);
            // case (SecurityProblem_passwordExpired):
            // case (SecurityProblem_inappropriateAlgorithms):
            default:
                return ldapErr(LDAPResult_resultCode_other, e.message);
        }
        // stats.outcome.error.problem = e.data.problem;
    } else if (e instanceof errors.ServiceError) {
        switch (e.data.problem) {
            case (ServiceProblem_busy):
                return ldapErr(LDAPResult_resultCode_busy, e.message);
            case (ServiceProblem_unavailable):
                return ldapErr(LDAPResult_resultCode_unavailable, e.message);
            case (ServiceProblem_unwillingToPerform):
                return ldapErr(LDAPResult_resultCode_unwillingToPerform, e.message);
            // case (ServiceProblem_chainingRequired):
            // case (ServiceProblem_unableToProceed):
            // case (ServiceProblem_invalidReference):
            case (ServiceProblem_timeLimitExceeded):
                return ldapErr(LDAPResult_resultCode_timeLimitExceeded, e.message);
            case (ServiceProblem_administrativeLimitExceeded):
                return ldapErr(LDAPResult_resultCode_adminLimitExceeded, e.message);
            case (ServiceProblem_loopDetected):
                return ldapErr(LDAPResult_resultCode_loopDetect, e.message);
            case (ServiceProblem_unavailableCriticalExtension):
                return ldapErr(LDAPResult_resultCode_unavailableCriticalExtension, e.message);
            // case (ServiceProblem_outOfScope):
            // case (ServiceProblem_ditError):
            // case (ServiceProblem_invalidQueryReference):
            // case (ServiceProblem_requestedServiceNotAvailable):
            case (ServiceProblem_unsupportedMatchingUse):
                return ldapErr(LDAPResult_resultCode_inappropriateMatching, e.message);
            // case (ServiceProblem_ambiguousKeyAttributes):
            case (ServiceProblem_saslBindInProgress):
                return ldapErr(LDAPResult_resultCode_saslBindInProgress, e.message);
            // case (ServiceProblem_notSupportedByLDAP):
            default:
                return ldapErr(LDAPResult_resultCode_other, e.message);
        }
        // stats.outcome.error.problem = e.data.problem;
    } else if (e instanceof errors.UpdateError) {
        switch (e.data.problem) {
            case(UpdateProblem_namingViolation):
                return ldapErr(LDAPResult_resultCode_namingViolation, e.message);
            case(UpdateProblem_objectClassViolation):
                return ldapErr(LDAPResult_resultCode_objectClassViolation, e.message);
            case(UpdateProblem_notAllowedOnNonLeaf):
                return ldapErr(LDAPResult_resultCode_notAllowedOnNonLeaf, e.message);
            case(UpdateProblem_notAllowedOnRDN):
                return ldapErr(LDAPResult_resultCode_notAllowedOnRDN, e.message);
            case(UpdateProblem_entryAlreadyExists):
                return ldapErr(LDAPResult_resultCode_entryAlreadyExists, e.message);
            case(UpdateProblem_affectsMultipleDSAs):
                return ldapErr(LDAPResult_resultCode_affectsMultipleDSAs, e.message);
            case(UpdateProblem_objectClassModificationProhibited):
                return ldapErr(LDAPResult_resultCode_objectClassModsProhibited, e.message);
            // case(UpdateProblem_noSuchSuperior):
            // case(UpdateProblem_notAncestor):
            // case(UpdateProblem_parentNotAncestor):
            // case(UpdateProblem_hierarchyRuleViolation):
            // case(UpdateProblem_familyRuleViolation):
            // case(UpdateProblem_insufficientPasswordQuality):
            // case(UpdateProblem_passwordInHistory):
            // case(UpdateProblem_noPasswordSlot):
            default:
                return ldapErr(LDAPResult_resultCode_other, e.message);
        }
        // stats.outcome.error.problem = e.data.problem;
        // stats.outcome.error.attributeInfo = e.data.attributeInfo?.map((ai) => {
        //     if ("attributeType" in ai) {
        //         return ai.attributeType.toString();
        //     } else if ("attribute" in ai) {
        //         return ai.attribute.type_.toString();
        //     } else {
        //         return null;
        //     }
        // }).filter((ainfo): ainfo is string => !!ainfo);
    }
    return new LDAPResult(
        LDAPResult_resultCode_other,
        new Uint8Array(),
        Buffer.from(e.message, "utf-8"),
        undefined,
    );
}

export default dapErrorToLDAPResult;
