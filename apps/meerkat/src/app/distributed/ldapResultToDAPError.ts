import * as errors from "../errors";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
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
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
// import {
//     AttributeProblem_noSuchAttributeOrValue,
//     AttributeProblem_invalidAttributeSyntax,
//     AttributeProblem_undefinedAttributeType,
//     AttributeProblem_inappropriateMatching,
//     AttributeProblem_constraintViolation,
//     AttributeProblem_attributeOrValueAlreadyExists,
//     AttributeProblem_contextViolation,
// } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    NameProblem_aliasDereferencingProblem,
    NameProblem_aliasProblem,
    // NameProblem_invalidAttributeSyntax,
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
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
    // ServiceProblem_unsupportedMatchingUse,
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
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    ReferralData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReferralData.ta";
import {
    NameErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import ldapReferenceToContinuationReference from "../ldap/ldapReferenceToContinuationReference";

function serviceErrorData (problem: number): ServiceErrorData {
    return new ServiceErrorData(
        problem,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function securityErrorData (problem: number): SecurityErrorData {
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

function nameErrorData (problem: number): NameErrorData {
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

function updateErrorData (problem: number): UpdateErrorData {
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


export
function ldapResultToDAPError (res: LDAPResult): void {
    if (successfulResultCode(res.resultCode)) {
        return;
    }
    switch (res.resultCode) {
        case (LDAPResult_resultCode_timeLimitExceeded):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_timeLimitExceeded),
            );
        case (LDAPResult_resultCode_authMethodNotSupported):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_unsupportedAuthenticationMethod),
            );
        case (LDAPResult_resultCode_referral):
            if (!res.referral) {
                // This status should not appear without a referral field.
                throw new Error();
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
            );
        case (LDAPResult_resultCode_adminLimitExceeded):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_administrativeLimitExceeded),
            );
        case (LDAPResult_resultCode_unavailableCriticalExtension):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_unavailableCriticalExtension),
            );
        case (LDAPResult_resultCode_confidentialityRequired):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_protectionRequired),
            );
        case (LDAPResult_resultCode_saslBindInProgress):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_saslBindInProgress),
            );
        case (LDAPResult_resultCode_noSuchAttribute):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
            );
        case (LDAPResult_resultCode_undefinedAttributeType):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
            );
        case (LDAPResult_resultCode_inappropriateMatching):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
            );
        case (LDAPResult_resultCode_constraintViolation):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
            );
        case (LDAPResult_resultCode_attributeOrValueExists):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
            );
        case (LDAPResult_resultCode_invalidAttributeSyntax):
            throw new errors.AttributeError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                attributeErrorData(),
            );
        case (LDAPResult_resultCode_noSuchObject):
            throw new errors.NameError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                nameErrorData(NameProblem_noSuchObject),
            );
        case (LDAPResult_resultCode_aliasProblem):
            throw new errors.NameError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                nameErrorData(NameProblem_aliasProblem),
            );
        case (LDAPResult_resultCode_aliasDereferencingProblem):
            throw new errors.NameError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                nameErrorData(NameProblem_aliasDereferencingProblem),
            );
        case (LDAPResult_resultCode_inappropriateAuthentication):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_inappropriateAuthentication),
            );
        case (LDAPResult_resultCode_invalidCredentials):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_invalidCredentials),
            );
        case (LDAPResult_resultCode_insufficientAccessRights):
            throw new errors.SecurityError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                securityErrorData(SecurityProblem_insufficientAccessRights),
            );
        case (LDAPResult_resultCode_busy):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_busy),
            );
        case (LDAPResult_resultCode_unavailable):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_unavailable),
            );
        case (LDAPResult_resultCode_unwillingToPerform):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_unwillingToPerform),
            );
        case (LDAPResult_resultCode_loopDetect):
            throw new errors.ServiceError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                serviceErrorData(ServiceProblem_loopDetected),
            );
        case (LDAPResult_resultCode_namingViolation):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_namingViolation),
            );
        case (LDAPResult_resultCode_objectClassViolation):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_objectClassViolation),
            );
        case (LDAPResult_resultCode_notAllowedOnNonLeaf):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_notAllowedOnNonLeaf),
            );
        case (LDAPResult_resultCode_notAllowedOnRDN):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_notAllowedOnRDN),
            );
        case (LDAPResult_resultCode_entryAlreadyExists):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_entryAlreadyExists),
            );
        case (LDAPResult_resultCode_objectClassModsProhibited):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_objectClassModificationProhibited),
            );
        case (LDAPResult_resultCode_affectsMultipleDSAs):
            throw new errors.UpdateError(
                Buffer.from(res.diagnosticMessage).toString("utf-8"),
                updateErrorData(UpdateProblem_affectsMultipleDSAs),
            );
        default:
            throw new Error();
    }
}

export default ldapResultToDAPError;
