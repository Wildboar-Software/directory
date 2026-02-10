import { Buffer } from "node:buffer";
import process from "node:process";
import type { Context } from "../types.js";
import type { ASN1Element, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import { compareCode } from "@wildboar/x500";
import { securityError } from "@wildboar/x500/DirectoryAbstractService";
import { serviceError } from "@wildboar/x500/DirectoryAbstractService";
import { nameError } from "@wildboar/x500/DirectoryAbstractService";
import { attributeError } from "@wildboar/x500/DirectoryAbstractService";
import { updateError } from "@wildboar/x500/DirectoryAbstractService";
import { referral } from "@wildboar/x500/DirectoryAbstractService";
import { abandoned } from "@wildboar/x500/DirectoryAbstractService";
import { abandonFailed } from "@wildboar/x500/DirectoryAbstractService";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    SecurityProblem_inappropriateAuthentication,
    SecurityProblem_invalidCredentials,
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidSignature,
    SecurityProblem_protectionRequired,
    SecurityProblem_noInformation,
    SecurityProblem_blockedCredentials,
    // SecurityProblem_invalidQOPMatch,
    SecurityProblem_spkmError,
    SecurityProblem_unsupportedAuthenticationMethod,
    SecurityProblem_passwordExpired,
    SecurityProblem_inappropriateAlgorithms,
    AbandonProblem_noSuchOperation,
    AbandonProblem_tooLate,
    AbandonProblem_cannotAbandon,
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_chainingRequired,
    ServiceProblem_unableToProceed,
    ServiceProblem_invalidReference,
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_administrativeLimitExceeded,
    ServiceProblem_loopDetected,
    ServiceProblem_unavailableCriticalExtension,
    ServiceProblem_outOfScope,
    ServiceProblem_ditError,
    ServiceProblem_invalidQueryReference,
    ServiceProblem_requestedServiceNotAvailable,
    ServiceProblem_unsupportedMatchingUse,
    ServiceProblem_ambiguousKeyAttributes,
    ServiceProblem_saslBindInProgress,
    ServiceProblem_notSupportedByLDAP,
    NameProblem_noSuchObject,
    NameProblem_aliasProblem,
    NameProblem_invalidAttributeSyntax,
    NameProblem_aliasDereferencingProblem,
    UpdateProblem_namingViolation,
    UpdateProblem_objectClassViolation,
    UpdateProblem_notAllowedOnNonLeaf,
    UpdateProblem_notAllowedOnRDN,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_affectsMultipleDSAs,
    UpdateProblem_objectClassModificationProhibited,
    UpdateProblem_noSuchSuperior,
    UpdateProblem_notAncestor,
    UpdateProblem_parentNotAncestor,
    UpdateProblem_hierarchyRuleViolation,
    UpdateProblem_familyRuleViolation,
    UpdateProblem_insufficientPasswordQuality,
    UpdateProblem_passwordInHistory,
    UpdateProblem_noPasswordSlot,
    AttributeProblem_noSuchAttributeOrValue,
    AttributeProblem_invalidAttributeSyntax,
    AttributeProblem_undefinedAttributeType,
    AttributeProblem_inappropriateMatching,
    AttributeProblem_constraintViolation,
    AttributeProblem_attributeOrValueAlreadyExists,
    AttributeProblem_contextViolation,
} from "@wildboar/x500/DirectoryAbstractService";
import stringifyDN from "../utils/stringifyDN.js";
import printAttributeValue from "./AttributeValue.js";
import { naddrToURI } from "@wildboar/x500";
import {
    MasterOrShadowAccessPoint_category_master,
} from "@wildboar/x500/DistributedOperations";
import {
    AbandonedProblem_pagingAbandoned,
} from "@wildboar/x500/DirectoryAbstractService";
import chalk from "chalk";

const colorize: (str: string) => string = process.env.NO_COLOR
    ? (str: string): string => str
    : chalk.red;

const securityErrorProblemNames: Map<number, string> = new Map(
    Object.entries({
        SecurityProblem_inappropriateAuthentication,
        SecurityProblem_invalidCredentials,
        SecurityProblem_insufficientAccessRights,
        SecurityProblem_invalidSignature,
        SecurityProblem_protectionRequired,
        SecurityProblem_noInformation,
        SecurityProblem_blockedCredentials,
        // SecurityProblem_invalidQOPMatch,
        SecurityProblem_spkmError,
        SecurityProblem_unsupportedAuthenticationMethod,
        SecurityProblem_passwordExpired,
        SecurityProblem_inappropriateAlgorithms,
    })
        .map(([ name, value ]) => [ value as number, name.split("_")[1] ]),
);
const serviceErrorProblemNames: Map<number, string> = new Map(
    Object.entries({
        ServiceProblem_busy,
        ServiceProblem_unavailable,
        ServiceProblem_unwillingToPerform,
        ServiceProblem_chainingRequired,
        ServiceProblem_unableToProceed,
        ServiceProblem_invalidReference,
        ServiceProblem_timeLimitExceeded,
        ServiceProblem_administrativeLimitExceeded,
        ServiceProblem_loopDetected,
        ServiceProblem_unavailableCriticalExtension,
        ServiceProblem_outOfScope,
        ServiceProblem_ditError,
        ServiceProblem_invalidQueryReference,
        ServiceProblem_requestedServiceNotAvailable,
        ServiceProblem_unsupportedMatchingUse,
        ServiceProblem_ambiguousKeyAttributes,
        ServiceProblem_saslBindInProgress,
        ServiceProblem_notSupportedByLDAP,
    })
        .map(([ name, value ]) => [ value as number, name.split("_")[1] ]),
);
const nameErrorProblemNames: Map<number, string> = new Map(
    Object.entries({
        NameProblem_noSuchObject,
        NameProblem_aliasProblem,
        NameProblem_invalidAttributeSyntax,
        NameProblem_aliasDereferencingProblem,
    })
        .map(([ name, value ]) => [ value as number, name.split("_")[1] ]),
);
const attributeErrorProblemNames: Map<number, string> = new Map(
    Object.entries({
        AttributeProblem_noSuchAttributeOrValue,
        AttributeProblem_invalidAttributeSyntax,
        AttributeProblem_undefinedAttributeType,
        AttributeProblem_inappropriateMatching,
        AttributeProblem_constraintViolation,
        AttributeProblem_attributeOrValueAlreadyExists,
        AttributeProblem_contextViolation,
    })
        .map(([ name, value ]) => [ value as number, name.split("_")[1] ]),
);
const updateErrorProblemNames: Map<number, string> = new Map(
    Object.entries({
        UpdateProblem_namingViolation,
        UpdateProblem_objectClassViolation,
        UpdateProblem_notAllowedOnNonLeaf,
        UpdateProblem_notAllowedOnRDN,
        UpdateProblem_entryAlreadyExists,
        UpdateProblem_affectsMultipleDSAs,
        UpdateProblem_objectClassModificationProhibited,
        UpdateProblem_noSuchSuperior,
        UpdateProblem_notAncestor,
        UpdateProblem_parentNotAncestor,
        UpdateProblem_hierarchyRuleViolation,
        UpdateProblem_familyRuleViolation,
        UpdateProblem_insufficientPasswordQuality,
        UpdateProblem_passwordInHistory,
        UpdateProblem_noPasswordSlot,
    })
        .map(([ name, value ]) => [ value as number, name.split("_")[1] ]),
);
const abandonFailedProblemNames: Map<number, string> = new Map(
    Object.entries({
        AbandonProblem_noSuchOperation,
        AbandonProblem_tooLate,
        AbandonProblem_cannotAbandon,
    })
        .map(([ name, value ]) => [ value as number, name.split("_")[1] ]),
);

const UNKNOWN_PROBLEM: string = "UNKNOWN PROBLEM";
const ALIAS_DEREFED: string = "An alias was dereferenced in the operation that produced this error.";

export
function printError (ctx: Context, e: { errcode?: Code, error: ASN1Element }): void {
    if (!e.errcode) {
        ctx.log.error("Error with no error code.");
        return;
    }

    if (compareCode(e.errcode, securityError["&errorCode"]!)) {
        const param = securityError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "SECURITY ERROR: "
            + (securityErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        // This is never explained in the X.511 specifications.
        // if (data.encPwdInfo?.algorithms?.length) {

        // }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, serviceError["&errorCode"]!)) {
        const param = serviceError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "SERVICE ERROR: "
            + (serviceErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, nameError["&errorCode"]!)) {
        const param = nameError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "NAME ERROR: "
            + (nameErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.matched.rdnSequence.length) {
            console.error(colorize("This is the name that matched: " + stringifyDN(ctx, data.matched.rdnSequence)));
        } else {
            console.error(colorize("This is the name that matched: <Root DSE>"));
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, attributeError["&errorCode"]!)) {
        const param = attributeError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "This is the object to which the operation applied: "
            + stringifyDN(ctx, data.object.rdnSequence),
        ));
        for (let i = 0; i < data.problems.length; i++) {
            const problem = data.problems[i];
            const probStr: string = (attributeErrorProblemNames.get(problem.problem as number) ?? UNKNOWN_PROBLEM);
            const TYPE_OID: string = problem.type_.toString();
            const spec = ctx.attributes.get(TYPE_OID);
            if (spec?.name) {
                console.error(`${spec.name} (${TYPE_OID})`);
            } else {
                console.error(TYPE_OID);
            }
            const type_: string = (spec?.name) ? `${spec.name} (${TYPE_OID})` : TYPE_OID;
            if (problem.value) {
                console.error(colorize(
                    `Problem #${(i + 1)}: ${probStr} for this value of attribute type ${type_}: `
                    + printAttributeValue(ctx, problem.value, spec),
                ));
            } else {
                console.error(`Problem #${(i + 1)}: ${probStr} for attribute type ${type_}`);
            }
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, updateError["&errorCode"]!)) {
        const param = updateError.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "UPDATE ERROR: "
            + (updateErrorProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        const attributeInfo = data.attributeInfo ?? [];
        for (let i = 0; i < attributeInfo.length; i++) {
            const info = attributeInfo[i];
            const type_: OBJECT_IDENTIFIER | undefined = ("attributeType" in info)
                ? info.attributeType
                : ("attribute" in info)
                    ? info.attribute.type_
                    : undefined;
            if (type_) {
                console.error(`Problem #${(i + 1)}: Attribute type ${type_}`);
            } else {
                console.error(`Problem #${(i + 1)}: Syntax not understood.`);
            }
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, referral["&errorCode"]!)) {
        const param = referral.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize("The performing DSA has referred you to the following DSA(s) to continue your request: "));
        for (const api of data.candidate.accessPoints) {
            console.error(colorize(`DSA Application Entity: ${stringifyDN(ctx, api.ae_title.rdnSequence)}`));
            console.error(colorize("Network access points:"));
            for (let i = 0; i < api.address.nAddresses.length; i++) {
                const naddr = api.address.nAddresses[i];
                const uri: string | undefined = naddrToURI(naddr);
                if (!uri) {
                    console.error(colorize("\t" + `${i + 1}. ${Buffer.from(naddr).toString("hex")}`));
                    continue;
                }
                console.error(colorize("\t" + `${i + 1}. ${uri}`));
            }
            if (api.chainingRequired) {
                console.error(colorize("The referring DSA has reported that chaining is required for use of this DSA."));
            }
            if (api.category && (api.category !== MasterOrShadowAccessPoint_category_master)) {
                console.error(colorize("The referring DSA has reported that this DSA is not a master DSA."));
            }
            if (!api.additionalPoints?.length) {
                continue;
            }
            console.error(colorize("Additional access points:"));
            for (const aap of api.additionalPoints ?? []) {
                console.error(colorize("\t" + `DSA Application Entity: ${stringifyDN(ctx, aap.ae_title.rdnSequence)}`));
                console.error(colorize("\tNetwork access points:"));
                for (let i = 0; i < aap.address.nAddresses.length; i++) {
                    const naddr = aap.address.nAddresses[i];
                    const uri: string | undefined = naddrToURI(naddr);
                    if (!uri) {
                        console.error(colorize("\t\t" + `${i + 1}. ${Buffer.from(naddr).toString("hex")}`));
                        continue;
                    }
                    console.error(colorize("\t\t" + `${i + 1}. ${uri}`));
                }
                if (aap.chainingRequired) {
                    console.error(colorize("\tThe referring DSA has reported that chaining is required for use of this DSA."));
                }
                if (aap.category && (aap.category !== MasterOrShadowAccessPoint_category_master)) {
                    console.error(colorize("\tThe referring DSA has reported that this DSA is not a master DSA."));
                }
                console.error(colorize("\t-----"));
            }
            console.error(colorize("-----"));
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, abandoned["&errorCode"]!)) {
        const param = abandoned.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        if (data.problem === AbandonedProblem_pagingAbandoned) {
            console.error(colorize("Paging abandoned."));
        } else {
            console.error(colorize("Abandoned."));
        }
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    if (compareCode(e.errcode, abandonFailed["&errorCode"]!)) {
        const param = abandonFailed.decoderFor["&ParameterType"]!(e.error);
        const data = getOptionallyProtectedValue(param);
        console.error(colorize(
            "ABANDON FAILED ERROR: "
            + (abandonFailedProblemNames.get(data.problem as number) ?? UNKNOWN_PROBLEM),
        ));
        if (data.aliasDereferenced) {
            console.error(colorize(ALIAS_DEREFED));
        }
        if (data.performer) {
            console.error(colorize("This error was produced by: " + stringifyDN(ctx, data.performer)));
        }
        if ("signed" in param) {
            const alg = param.signed.algorithmIdentifier.algorithm.toString();
            console.log(`This error was digitally signed with algorithm ${alg}.`);
        }
        return;
    }
    // TODO: Support DOP, DSP, and DISP errors
    ctx.log.error("UNRECOGNIZED ERROR");
}

export default printError;
