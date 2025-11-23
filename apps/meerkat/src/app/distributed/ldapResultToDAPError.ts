import * as errors from "@wildboar/meerkat-types";
import type { INTEGER } from "@wildboar/asn1";
import {
    LDAPResult,
} from "@wildboar/ldap";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_compareFalse,
    LDAPResult_resultCode_compareTrue,
    // LDAPResult_resultCode_operationsError,
    // LDAPResult_resultCode_protocolError,
    LDAPResult_resultCode_timeLimitExceeded,
    // LDAPResult_resultCode_sizeLimitExceeded,
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
    // LDAPResult_resultCode_other,
} from "@wildboar/ldap";
// import {
//     AttributeProblem_noSuchAttributeOrValue,
//     AttributeProblem_invalidAttributeSyntax,
//     AttributeProblem_undefinedAttributeType,
//     AttributeProblem_inappropriateMatching,
//     AttributeProblem_constraintViolation,
//     AttributeProblem_attributeOrValueAlreadyExists,
//     AttributeProblem_contextViolation,
// } from "@wildboar/x500/DirectoryAbstractService";
import {
    NameProblem_aliasDereferencingProblem,
    NameProblem_aliasProblem,
    // NameProblem_invalidAttributeSyntax,
    NameProblem_noSuchObject,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_inappropriateAuthentication,
    SecurityProblem_invalidCredentials,
    SecurityProblem_insufficientAccessRights,
    // SecurityProblem_invalidSignature,
    SecurityProblem_protectionRequired,
    // SecurityProblem_noInformation,
    // SecurityProblem_blockedCredentials,
    // SecurityProblem_spkmError,
    SecurityProblem_unsupportedAuthenticationMethod,
    // SecurityProblem_passwordExpired,
    // SecurityProblem_inappropriateAlgorithms,
} from "@wildboar/x500/DirectoryAbstractService";
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
    // ServiceProblem_unsupportedMatchingUse,
    // ServiceProblem_ambiguousKeyAttributes,
    ServiceProblem_saslBindInProgress,
    // ServiceProblem_notSupportedByLDAP,
} from "@wildboar/x500/DirectoryAbstractService";
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
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ReferralData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    NameErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    UpdateErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import ldapReferenceToContinuationReference from "../ldap/ldapReferenceToContinuationReference";

function serviceErrorData (problem: INTEGER): ServiceErrorData {
    return new ServiceErrorData(
        problem,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function securityErrorData (problem: INTEGER): SecurityErrorData {
    return new SecurityErrorData(
        problem,
        undefined,
        undefined,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function attributeErrorData (): AttributeErrorData {
    return new AttributeErrorData(
        {
            rdnSequence: [],
        },
        [],
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function nameErrorData (problem: INTEGER): NameErrorData {
    return new NameErrorData(
        problem,
        {
            rdnSequence: [],
        },
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function updateErrorData (problem: INTEGER): UpdateErrorData {
    return new UpdateErrorData(
        problem,
        undefined,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function successfulResultCode (code: number): boolean {
    return (
        (code === LDAPResult_resultCode_success)
        || (code === LDAPResult_resultCode_compareFalse)
        || (code === LDAPResult_resultCode_compareTrue)
        || (code === LDAPResult_resultCode_saslBindInProgress)
        /**
         * Referral is regarded by LDAP as a successful result code, but this
         * function will not regard it as such, because the operation dispatcher
         * expects referrals to come from thrown errors, not from results.
         */
        // || (code === LDAPResult_resultCode_referral)
    );
}

/**
 * @summary Converts an LDAP result into an X.500 error.
 * @description
 *
 * Converts an LDAP result into an X.500 error. Throws the error rather than
 * returning it.
 *
 * @param res The LDAP result
 *
 * @function
 */
export
function ldapResultToDAPError (res: LDAPResult): void {
    if (successfulResultCode(res.resultCode)) {
        return;
    }
    /**
     * These errors should not be signed because they were not really given by
     * this DSA.
     */
    const signErrors: boolean = false;
    switch (res.resultCode) {
        case (LDAPResult_resultCode_timeLimitExceeded):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_timeLimitExceeded),
                signErrors,
            );
        case (LDAPResult_resultCode_authMethodNotSupported):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_unsupportedAuthenticationMethod),
                signErrors,
            );
        case (LDAPResult_resultCode_referral):
            if (!res.referral) {
                // This status should not appear without a referral field.
                throw new Error("3ecdadf7-0aa0-4b89-8eaa-bb9f1ff3de0f");
            }
            throw new errors.ReferralError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                new ReferralData(
                    ldapReferenceToContinuationReference(res.referral),
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
                signErrors,
            );
        case (LDAPResult_resultCode_adminLimitExceeded):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_administrativeLimitExceeded),
                signErrors,
            );
        case (LDAPResult_resultCode_unavailableCriticalExtension):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_unavailableCriticalExtension),
                signErrors,
            );
        case (LDAPResult_resultCode_confidentialityRequired):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_protectionRequired),
                signErrors,
            );
        case (LDAPResult_resultCode_saslBindInProgress):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_saslBindInProgress),
                signErrors,
            );
        case (LDAPResult_resultCode_noSuchAttribute):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
                signErrors,
            );
        case (LDAPResult_resultCode_undefinedAttributeType):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
                signErrors,
            );
        case (LDAPResult_resultCode_inappropriateMatching):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
                signErrors,
            );
        case (LDAPResult_resultCode_constraintViolation):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
                signErrors,
            );
        case (LDAPResult_resultCode_attributeOrValueExists):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
                signErrors,
            );
        case (LDAPResult_resultCode_invalidAttributeSyntax):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
                signErrors,
            );
        case (LDAPResult_resultCode_noSuchObject):
            throw new errors.NameError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                nameErrorData(NameProblem_noSuchObject),
                signErrors,
            );
        case (LDAPResult_resultCode_aliasProblem):
            throw new errors.NameError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                nameErrorData(NameProblem_aliasProblem),
                signErrors,
            );
        case (LDAPResult_resultCode_aliasDereferencingProblem):
            throw new errors.NameError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                nameErrorData(NameProblem_aliasDereferencingProblem),
                signErrors,
            );
        case (LDAPResult_resultCode_inappropriateAuthentication):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_inappropriateAuthentication),
                signErrors,
            );
        case (LDAPResult_resultCode_invalidCredentials):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_invalidCredentials),
                signErrors,
            );
        case (LDAPResult_resultCode_insufficientAccessRights):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_insufficientAccessRights),
                signErrors,
            );
        case (LDAPResult_resultCode_busy):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_busy),
                signErrors,
            );
        case (LDAPResult_resultCode_unavailable):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_unavailable),
                signErrors,
            );
        case (LDAPResult_resultCode_unwillingToPerform):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_unwillingToPerform),
                signErrors,
            );
        case (LDAPResult_resultCode_loopDetect):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_loopDetected),
                signErrors,
            );
        case (LDAPResult_resultCode_namingViolation):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_namingViolation),
                signErrors,
            );
        case (LDAPResult_resultCode_objectClassViolation):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_objectClassViolation),
                signErrors,
            );
        case (LDAPResult_resultCode_notAllowedOnNonLeaf):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_notAllowedOnNonLeaf),
                signErrors,
            );
        case (LDAPResult_resultCode_notAllowedOnRDN):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_notAllowedOnRDN),
                signErrors,
            );
        case (LDAPResult_resultCode_entryAlreadyExists):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_entryAlreadyExists),
                signErrors,
            );
        case (LDAPResult_resultCode_objectClassModsProhibited):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_objectClassModificationProhibited),
                signErrors,
            );
        case (LDAPResult_resultCode_affectsMultipleDSAs):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_affectsMultipleDSAs),
                signErrors,
            );
        default:
            throw new Error("948540e3-6b8f-4da7-921d-c7a20d1ea0a9");
    }
}

export default ldapResultToDAPError;
