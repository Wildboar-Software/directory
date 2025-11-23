import { Context, ClientAssociation, MistypedArgumentError, UnknownOperationError, MistypedPDUError } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx.js";
import * as errors from "@wildboar/meerkat-types";
import { addSeconds } from "date-fns";
import { ChainingArguments } from "@wildboar/x500/DistributedOperations";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import { OPTIONALLY_PROTECTED } from "@wildboar/x500/EnhancedSecurity";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
    _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ASN1Element,
    BOOLEAN,
    INTEGER,
    OPTIONAL,
    TRUE_BIT,
    FALSE,
    BERElement,
} from "@wildboar/asn1";
import { ServiceErrorData } from "@wildboar/x500/DirectoryAbstractService";
import { SecurityErrorData } from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_invalidSignature,
    SecurityProblem_noInformation,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceProblem_loopDetected,
    ServiceProblem_busy,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    securityError,
} from "@wildboar/x500/DirectoryAbstractService";
import { addEntry } from "@wildboar/x500/DirectoryAbstractService";
import { compare } from "@wildboar/x500/DirectoryAbstractService";
import { modifyDN } from "@wildboar/x500/DirectoryAbstractService";
import { modifyEntry } from "@wildboar/x500/DirectoryAbstractService";
import { list } from "@wildboar/x500/DirectoryAbstractService";
import { read } from "@wildboar/x500/DirectoryAbstractService";
import { removeEntry } from "@wildboar/x500/DirectoryAbstractService";
import { search } from "@wildboar/x500/DirectoryAbstractService";
import { chainedRead } from "@wildboar/x500/DistributedOperations";
import { loopDetected } from "@wildboar/x500";
import {
    AuthenticationLevel,
} from "@wildboar/x500/BasicAccessControl";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/BasicAccessControl";
import {
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import { DomainInfo } from "@wildboar/x500/DistributedOperations";
import { Exclusions } from "@wildboar/x500/DistributedOperations";
import { OperationProgress } from "@wildboar/x500/DistributedOperations";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/DistributedOperations";
import { ReferenceType, ReferenceType_self } from "@wildboar/x500/DistributedOperations";
import { Time } from "@wildboar/x500/DistributedOperations";
import { TraceInformation } from "@wildboar/x500/DistributedOperations";
import { DistinguishedName } from "@wildboar/x500/InformationFramework";
import { UniqueIdentifier } from "@wildboar/x500/SelectedAttributeTypes";
import { MRMapping } from "@wildboar/x500/ServiceAdministration";
import { SearchRuleId } from "@wildboar/x500/ServiceAdministration";
import { TraceItem } from "@wildboar/x500/DistributedOperations";
import { compareCode } from "@wildboar/x500";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import type { Request } from "@wildboar/x500";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import { printInvokeId } from "../utils/printInvokeId.js";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import { verifySIGNED } from "../pki/verifySIGNED.js";
import { isArgumentSigned } from "../x500/isArgumentSigned.js";
import DSPAssociation from "../dsp/DSPConnection.js";
import {
    _decode_AlgorithmIdentifier,
} from "@wildboar/pki-stub";
import { compareDistinguishedName, getDateFromTime, isModificationOperation } from "@wildboar/x500";
import {
    CommonArguments,
    _decode_CommonArguments,
} from "@wildboar/x500/DirectoryAbstractService";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import DAPAssociation from "../dap/DAPConnection.js";
import LDAPAssociation from "../ldap/LDAPConnection.js";
import {
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_strong,
} from "@wildboar/x500/BasicAccessControl";
import { UNTRUSTED_REQ_AUTH_LEVEL } from "../constants.js";
import cloneChainingArgs from "../x500/cloneChainingArguments.js";
import { isTrustedForIBRA } from "./isTrustedForIBRA.js";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID.js";

type Chain = OPTIONALLY_PROTECTED<Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1>;

function getCommonArguments (
    opCode: Code,
    arg: ASN1Element,
): OPTIONAL<CommonArguments> {
    if (!("local" in opCode)) {
        return undefined;
    }
    const signed: boolean | undefined = isArgumentSigned(opCode, arg);
    const unsignedElement = signed
        ? (() => {
            const firstElement = new BERElement()
            firstElement.fromBytes(arg.value);
            return firstElement;
        })()
        : arg;
    return _decode_CommonArguments(unsignedElement);
}

// ChainingArguments ::= SET {
//     originator                 [0]  DistinguishedName OPTIONAL,
//     targetObject               [1]  DistinguishedName OPTIONAL,
//     aliasDereferenced          [4]  BOOLEAN DEFAULT FALSE,
//     aliasedRDNs                [5]  INTEGER OPTIONAL,
//     returnCrossRefs            [6]  BOOLEAN DEFAULT FALSE,
//     referenceType              [7]  ReferenceType DEFAULT superior,
//     info                       [8]  DomainInfo OPTIONAL,
//     timeLimit                  [9]  Time OPTIONAL,
//     securityParameters         [10] SecurityParameters DEFAULT {},
//     entryOnly                  [11] BOOLEAN DEFAULT FALSE,
//     uniqueIdentifier           [12] UniqueIdentifier OPTIONAL,
//     authenticationLevel        [13] AuthenticationLevel OPTIONAL,
//     exclusions                 [14] Exclusions OPTIONAL,
//     excludeShadows             [15] BOOLEAN DEFAULT FALSE,
//     nameResolveOnMaster        [16] BOOLEAN DEFAULT FALSE,
//     operationIdentifier        [17] INTEGER OPTIONAL,
//     searchRuleId               [18] SearchRuleId OPTIONAL,
//     chainedRelaxation          [19] MRMapping OPTIONAL,
//     relatedEntry               [20] INTEGER OPTIONAL,
//     dspPaging                  [21] BOOLEAN DEFAULT FALSE,
//     --                         [22] Not to be used
//     --                         [23] Not to be used
//     excludeWriteableCopies     [24] BOOLEAN DEFAULT FALSE,
//     ... }

/**
 * @summary Produce chaining arguments from a DAP request
 * @description
 *
 * This function produces chaining arguments from the Directory Access Protocol
 * (DAP) request, per the procedures defined in ITU Recommendation X.518 (2016),
 * Section 17.3.3.1.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param operationCode The operation code
 * @param operationArgument The operation argument
 * @param authenticationLevel The authentication level of the bound user
 * @param uniqueIdentifier The unique identifier of the bound user
 * @returns A `ChainingArguments`
 *
 * @function
 */
function createChainingArgumentsFromDUA (
    ctx: Context,
    assn: ClientAssociation,
    operationCode: Code,
    operationArgument: ASN1Element,
    authenticationLevel: AuthenticationLevel, // TODO: Unnecessary argument.
    uniqueIdentifier?: UniqueIdentifier, // TODO: Unnecessary argument.
): ChainingArguments {
    let originator: OPTIONAL<DistinguishedName> = assn.boundNameAndUID?.dn;
    let targetObject: OPTIONAL<DistinguishedName>;
    let operationProgress: OPTIONAL<OperationProgress>;
    const traceInformation: TraceInformation = [];
    let aliasDereferenced: OPTIONAL<BOOLEAN>;
    let aliasedRDNs: OPTIONAL<INTEGER>;
    let returnCrossRefs: OPTIONAL<BOOLEAN>;
    let referenceType: OPTIONAL<ReferenceType>;
    let info: OPTIONAL<DomainInfo>;
    let timeLimit: OPTIONAL<Time>;
    /**
     * Technically, the specification only says to copy the `target` and
     * `errorProtection` parameters from the DAP argument's `securityParameters`.
     * But I don't see any problem with just copying the whole thing.
     */
    let securityParameters: OPTIONAL<SecurityParameters>;
    let entryOnly: OPTIONAL<BOOLEAN>;
    let exclusions: OPTIONAL<Exclusions>;
    let excludeShadows: OPTIONAL<BOOLEAN>;
    let nameResolveOnMaster: OPTIONAL<BOOLEAN>;
    const operationIdentifier: OPTIONAL<INTEGER> = generateUnusedInvokeID(ctx);
    let searchRuleId: OPTIONAL<SearchRuleId>;
    let chainedRelaxation: OPTIONAL<MRMapping>;
    let relatedEntry: OPTIONAL<INTEGER>;
    let dspPaging: OPTIONAL<BOOLEAN>;
    let excludeWriteableCopies: OPTIONAL<BOOLEAN>;

    /**
     * Abandon procedures are supposed to start here, but we do them within the
     * connection classes instead.
     */
    // if (compareCode(operationCode, abandon["&operationCode"]!)) {
    //     // Hack for avoiding unnecessary decoding.
    //     signed = (operationArgument.tagNumber === 0);
    // }
    // else if (compareCode(operationCode, administerPassword["&operationCode"]!)) {
    //     // Hack for avoiding unnecessary decoding.
    //     signed = (operationArgument.tagNumber === 0);
    // }
    // else
    if (compareCode(operationCode, addEntry["&operationCode"]!)) {
        const arg = addEntry.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
            // This is done to avoid modifying the original request. Instead,
            // Meerkat DSA simply checks if the manageDSAIT option is also set
            // anywhere it attempts to calculate whether chaining is allowed.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: data.object.rdnSequence.slice(0, -1),
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    // else if (compareCode(operationCode, changePassword["&operationCode"]!)) {
    //     // Hack for avoiding unnecessary decoding.
    //     signed = (operationArgument.tagNumber === 0);
    // }
    else if (compareCode(operationCode, compare["&operationCode"]!)) {
        const arg = compare.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: [ ...data.object.rdnSequence ],
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, modifyDN["&operationCode"]!)) {
        const arg = modifyDN.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: [ ...data.object ],
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, modifyEntry["&operationCode"]!)) {
        const arg = modifyEntry.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: [ ...data.object.rdnSequence ],
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, list["&operationCode"]!)) {
        const arg = list.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: [ ...data.object.rdnSequence ],
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, read["&operationCode"]!)) {
        const arg = read.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: [ ...data.object.rdnSequence ],
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, removeEntry["&operationCode"]!)) {
        const arg = removeEntry.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: [ ...data.object.rdnSequence ],
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, search["&operationCode"]!)) {
        const arg = search.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = originator ?? data.requestor;
        operationProgress = data.operationProgress;
        timeLimit = data.serviceControls?.timeLimit
            ? {
                generalizedTime: addSeconds(new Date(), Number(data.serviceControls.timeLimit)),
            }
            : undefined;
        nameResolveOnMaster = data.nameResolveOnMaster;
        exclusions = data.exclusions;
        entryOnly = data.entryOnly;
        referenceType = data.referenceType;
        securityParameters = data.securityParameters;
        const manageDSAIT: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
        if (manageDSAIT) {
            operationProgress = new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            );
            referenceType = ReferenceType_self;
            entryOnly = FALSE;
            nameResolveOnMaster = FALSE;
            // DEVIATION: Not setting the chainingProhibited SCO.
        }
        traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            {
                rdnSequence: [ ...data.baseObject.rdnSequence ],
            },
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    return new ChainingArguments(
        originator,
        targetObject,
        operationProgress,
        traceInformation,
        aliasDereferenced,
        aliasedRDNs,
        returnCrossRefs,
        referenceType,
        info,
        timeLimit,
        securityParameters,
        entryOnly,
        uniqueIdentifier,
        authenticationLevel,
        exclusions,
        excludeShadows,
        nameResolveOnMaster,
        operationIdentifier,
        searchRuleId,
        chainedRelaxation,
        relatedEntry,
        dspPaging,
        excludeWriteableCopies,
        [],
    );
}

function getEffectiveRequester (
    trustClientDSAForIBRA: boolean,
    dapSignatureValid: boolean,
    chainingArgsRequester?: DistinguishedName,
    dapSignatureEECertSubject?: DistinguishedName,
): DistinguishedName | undefined {
    if (dapSignatureValid && dapSignatureEECertSubject) {
        return dapSignatureEECertSubject;
    }
    if (trustClientDSAForIBRA) {
        return chainingArgsRequester;
    }
    return undefined;
}

function getEffectiveAuthLevel (
    assn: ClientAssociation,
    dapSecurityParameters: OPTIONAL<SecurityParameters>,
    chainingArgsAuthLevel: AuthenticationLevel,
    trustClientDSAForIBRA: boolean,
    dapSignatureValid: boolean,
): AuthenticationLevel {
    if ((assn instanceof DAPAssociation) || (assn instanceof LDAPAssociation)) {
        if (!("basicLevels" in assn.authLevel)) {
            return assn.authLevel;
        }
        return {
            basicLevels: new AuthenticationLevel_basicLevels(
                assn.authLevel.basicLevels.level,
                assn.authLevel.basicLevels.localQualifier,
                dapSignatureValid,
            ),
        };
    }
    // Otherwise, the association must be a DSP association.
    if (trustClientDSAForIBRA) {
        // Return the lowest auth level and local qualifier from the DSA's
        // asserted requester auth level and the DSA's actual auth level.
        /**
         * The rationale for this behavior is that, if access control depends
         * upon strong authentication, but the operation is chained via a DSA
         * that is only using a password to authenticate, the "chain of
         * authentication" is only as veritable as its weakest link.
         */
        if (
            ("basicLevels" in assn.authLevel)
            && ("basicLevels" in chainingArgsAuthLevel)
            && (assn.authLevel.basicLevels.level < chainingArgsAuthLevel.basicLevels.level)
        ) {
            return {
                basicLevels: new AuthenticationLevel_basicLevels(
                    Math.min(
                        assn.authLevel.basicLevels.level,
                        chainingArgsAuthLevel.basicLevels.level,
                    ),
                    Math.min(
                        assn.authLevel.basicLevels.level,
                        chainingArgsAuthLevel.basicLevels.level,
                    ),
                    chainingArgsAuthLevel.basicLevels.signed,
                ),
            };
        }
        return chainingArgsAuthLevel;
    }
    // Otherwise, we rely on signature-based requestor authentication.
    const signedArgumentEquivalentToStrongAuth: boolean = !!(
        dapSignatureValid
        && dapSecurityParameters?.time
        && dapSecurityParameters.random
    );
    let localQualifier: number | undefined;
    if ("basicLevels" in assn.authLevel) {
        if ("basicLevels" in chainingArgsAuthLevel) {
            localQualifier = Math.min(
                Number(assn.authLevel.basicLevels.localQualifier ?? 0),
                Number(chainingArgsAuthLevel.basicLevels.localQualifier),
            );
        } else {
            localQualifier = assn.authLevel.basicLevels.localQualifier
                ? Number(assn.authLevel.basicLevels.localQualifier)
                : undefined;
        }
    } else if ("basicLevels" in chainingArgsAuthLevel) { // ... but not in assn.authLevel.
        localQualifier = 0;
    } else { // Otherwise basicLevels is not used anywhere.
        return chainingArgsAuthLevel;
    }
    return {
        basicLevels: new AuthenticationLevel_basicLevels(
            signedArgumentEquivalentToStrongAuth
                ? (("basicLevels" in chainingArgsAuthLevel)
                    ? Math.min(
                        AuthenticationLevel_basicLevels_level_strong,
                        Math.max(chainingArgsAuthLevel.basicLevels.level, 0),
                    )
                    : AuthenticationLevel_basicLevels_level_strong)
                : AuthenticationLevel_basicLevels_level_none,
            localQualifier,
            dapSignatureValid,
        ),
    };
}

/**
 * @summary The Request Validation Procedure, defined in ITU Recommendation X.518.
 * @description
 *
 * The Request Validation Procedure, defined in ITU Recommendation X.518 (2016),
 * Section 17.
 *
 * Note: this is only used for DAP, LDAP, and DSP requests. DOP and DISP bypass
 * this procedure.
 *
 * NOTE: That the authenticationLevel provided by the bound DSA is trusted by
 * fiat. There is no way for this DSA to verify that, say, strong authentication
 * was used in the original DAP association.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param req The X.500 directory request
 * @param alreadyChained Whether the request was already chained.
 * @param authenticationLevel The authentication level of the user or DSA.
 * @param uniqueIdentifier The unique identifier of the user or DSA.
 * @returns A chained and optionally-signed equivalent of the argument.
 *
 * @function
 * @async
 */
export
async function requestValidationProcedure (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    req: Request,
    alreadyChained: boolean,
    authenticationLevel: AuthenticationLevel, // TODO: Unnecessary argument.
    uniqueIdentifier?: UniqueIdentifier, // TODO: Unnecessary argument.
): Promise<[ Chain, CommonArguments? ]> {
    if (!req.opCode) {
        throw new UnknownOperationError();
    }
    // All DAP and DSP operations are defined with the "local" alternative.
    if (!("local" in req.opCode)) {
        throw new UnknownOperationError();
    }
    if (!req.argument) {
        throw new MistypedPDUError();
    }
    if (ctx.dsa.hibernatingSince || ctx.dsa.sentinelTriggeredHibernation) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:hibernating"),
            new ServiceErrorData(
                ServiceProblem_busy,
                [],
                undefined, // Intentionally not including more information.
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    if (!isModificationOperation(req.opCode) && ctx.config.bulkInsertMode) {
        ctx.log.error(ctx.i18n.t("err:bulk_insert_mode_no_read"));
        throw new errors.ServiceError(
            ctx.i18n.t("err:bulk_insert_mode_no_read"),
            new ServiceErrorData(
                ServiceProblem_busy,
                [],
                createSecurityParameters(
                    ctx,
                    false,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    const hydratedArgument: Chain = alreadyChained
        ? chainedRead.decoderFor["&ArgumentType"]!(req.argument!) // NOTE: chainedRead has the same decoder as every other chained operation.
        : ((): Chain => {
            const chainingArguments = createChainingArgumentsFromDUA(
                ctx,
                assn,
                req.opCode!,
                req.argument!,
                authenticationLevel,
                uniqueIdentifier,
            );
            return { // NOTE: This MUST be unsigned. See a0ada54c-95ad-41f0-9676-4427426e897a.
                unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                    chainingArguments,
                    req.argument!,
                ),
            };
        })();
    const unsigned = getOptionallyProtectedValue(hydratedArgument);
    const {
        chainedArgument,
        argument, // TODO: rename "dapArgument"
    } = unsigned;

    const commonArgs = getCommonArguments(req.opCode, argument);
    if ((commonArgs?.aliasedRDNs ?? 0) < 0) {
        throw new MistypedArgumentError(ctx.i18n.t("err:aliased_rdns_lt0"));
    }
    const securityParams = commonArgs?.securityParameters;
    const signErrors: boolean = (
        assn.authorizedForSignedErrors
        && (securityParams?.errorProtection === ErrorProtectionRequest_signed)
    );
    const namingMatcher = getNamingMatcherGetter(ctx);
    /**
     * If the requestor does not match the bound DN, throw an error, per ITU
     * Recommendation X.511 (2019), Section 7.3.
     */
    if (
        ((assn instanceof DAPAssociation) || (assn instanceof LDAPAssociation))
        && commonArgs?.requestor
        && assn.boundNameAndUID?.dn
        && !compareDistinguishedName(
            assn.boundNameAndUID.dn,
            commonArgs.requestor,
            namingMatcher,
        )
    ) { // If requestor does not match the bound DN...
        throw new MistypedArgumentError(
            ctx.i18n.t("err:mismatch_requestor_and_bound_dn"));
    }
    if (
        // This only needs to be checked for DSP associations
        (assn instanceof DSPAssociation)
        && chainedArgument.originator
        && commonArgs?.requestor
        && !compareDistinguishedName(
            chainedArgument.originator,
            commonArgs.requestor,
            namingMatcher,
        )
    ) { // If the originator does not match the requestor...
        throw new MistypedArgumentError(
            ctx.i18n.t("err:mismatch_requestor_and_originator"));
    }
    if (
        // This only needs to be checked for DSP associations
        (assn instanceof DSPAssociation)
        && chainedArgument.originator
        && commonArgs?.securityParameters?.certification_path
        && !compareDistinguishedName(
            chainedArgument.originator,
            commonArgs
                .securityParameters
                .certification_path
                .userCertificate
                .toBeSigned
                .subject
                .rdnSequence,
            namingMatcher,
        )
    ) {
        throw new MistypedArgumentError(
            ctx.i18n.t("err:mismatch_originator_and_sec_params_cert_subject"));
    }
    if (
        commonArgs?.requestor
        && commonArgs?.securityParameters?.certification_path
        && !compareDistinguishedName(
            commonArgs.requestor,
            commonArgs
                .securityParameters
                .certification_path
                .userCertificate
                .toBeSigned
                .subject
                .rdnSequence,
            namingMatcher,
        )
    ) {
        throw new MistypedArgumentError(
            ctx.i18n.t("err:mismatch_requestor_and_sec_params_cert_subject"));
    }
    if (
        // This only needs to be checked for DSP associations
        (assn instanceof DSPAssociation)
        // ...and only if this DSA's AE-title has been configured.
        && (ctx.dsa.accessPoint.ae_title.rdnSequence.length > 0)
        && chainedArgument.securityParameters?.name
        && !compareDistinguishedName(
            chainedArgument.securityParameters.name,
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            namingMatcher,
        )
    ) { // If securityParameters.name does not match this DSA's name...
        throw new MistypedArgumentError(
            ctx.i18n.t("err:mismatch_sec_params_name_and_this_dsa"));
    }
    if (
        commonArgs?.securityParameters?.operationCode
        && (
            !("local" in commonArgs.securityParameters.operationCode)
            || (
                Number(commonArgs.securityParameters.operationCode.local)
                !== Number(req.opCode.local)
            )
        )
    ) {
        throw new MistypedArgumentError(
            ctx.i18n.t("err:mismatch_sec_params_opcode_common_args"));
    }
    if (
        chainedArgument?.securityParameters?.operationCode
        && (
            !("local" in chainedArgument.securityParameters.operationCode)
            || (
                Number(chainedArgument.securityParameters.operationCode.local)
                !== Number(req.opCode.local)
            )
        )
    ) {
        throw new MistypedArgumentError(
            ctx.i18n.t("err:mismatch_sec_params_opcode_chaining_args"));
    }
    const secureTime = chainedArgument.securityParameters?.time
        ? getDateFromTime(chainedArgument.securityParameters.time)
        : undefined;
    const now = new Date();
    if (secureTime && (now > secureTime)) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:replay"),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
            ),
            signErrors,
        );
    }
    let authLevelSigned: boolean = false;
    if (isArgumentSigned(req.opCode, argument)) {
        const signedArgElements = argument.sequence;
        const tbsElement = signedArgElements[0];
        const sigAlgElement = signedArgElements[1];
        const sigValueElement = signedArgElements[2];
        if (
            !tbsElement
            || !sigAlgElement
            || !sigValueElement
            || !securityParams?.certification_path
        ) {
            throw new MistypedArgumentError();
        }
        const certPath = securityParams.certification_path;
        const sigAlg = _decode_AlgorithmIdentifier(sigAlgElement);
        try {
            await verifySIGNED(
                ctx,
                assn,
                certPath,
                req.invokeId,
                false,
                new SIGNED(
                    tbsElement,
                    sigAlg,
                    sigValueElement.bitString,
                    undefined,
                    undefined,
                ),
                () => tbsElement,
                // tbsElement,
                signErrors,
            );
            authLevelSigned = true;
        } catch (e) {
            // TODO: Log the error, but don't throw it yet.
        }
    }

    if (
        chainedArgument.targetObject
        && (chainedArgument.operationProgress?.nextRDNToBeResolved !== undefined)
        && (chainedArgument.operationProgress.nextRDNToBeResolved > chainedArgument.targetObject.length)
    ) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:invalid_nextrdntoberesolved", {
                next: chainedArgument.operationProgress?.nextRDNToBeResolved,
            }),
            new SecurityErrorData(
                SecurityProblem_noInformation,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                chainedArgument.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    // This code path will only be taken via DSP, since converting the DAP
    // request to its chained equivalent will not produce a signed DSP request.
    // a0ada54c-95ad-41f0-9676-4427426e897a
    if ("signed" in hydratedArgument) {
        const certPath = hydratedArgument
            .signed
            .toBeSigned
            .chainedArgument
            .securityParameters
            ?.certification_path;
        await verifySIGNED(
            ctx,
            assn,
            certPath,
            req.invokeId,
            false,
            hydratedArgument.signed,
            _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
            signErrors,
        );
    }
    if (alreadyChained) { // Satisfies all requirements of X.518 (2016), Section 17.3.3.3.
        chainedArgument.traceInformation.push(new TraceItem(
            ctx.dsa.accessPoint.ae_title,
            chainedArgument.targetObject
                ? {
                    rdnSequence: chainedArgument.targetObject,
                }
                : undefined,
            chainedArgument.operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    if (loopDetected(chainedArgument.traceInformation)) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:loop_detected"),
            new ServiceErrorData(
                ServiceProblem_loopDetected,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                chainedArgument.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if ((assn instanceof DAPAssociation) || (assn instanceof LDAPAssociation)) {
        if (
            chainedArgument.authenticationLevel
            && ("basicLevels" in chainedArgument.authenticationLevel)
            && authLevelSigned
        ) {
            return [
                {
                    unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                        cloneChainingArgs(chainedArgument, {
                            authenticationLevel: {
                                basicLevels: new AuthenticationLevel_basicLevels(
                                    chainedArgument.authenticationLevel.basicLevels.level,
                                    chainedArgument.authenticationLevel.basicLevels.localQualifier,
                                    authLevelSigned,
                                ),
                            },
                        }),
                        argument,
                    ),
                },
                commonArgs,
            ];
        }
        return [ hydratedArgument, commonArgs ];
    }
    // Everything beyond this point is determining the "effective" authentication
    // level, requester, and unique identifier, for the purposes of access control,
    // using either Identity-Based Requester Authentication (IBRA), or
    // Signature-Based Requester Authentication (SBRA), as defined in ITU
    // Recommendation X.518 (2019), Section 22.1.
    if (
        (assn instanceof DSPAssociation)
        && ("basicLevels" in assn.authLevel)
        && (assn.authLevel.basicLevels.level <= AuthenticationLevel_basicLevels_level_none)
    ) {
        /**
         * If the client DSA itself is not authenticated, we can't trust it for
         * Identity-Based Requester Authentication (IBRA), so we just blank out
         * the access-control-sensitive fields and set the auth level to none.
         */
        const effectiveChainingArguments: ChainingArguments = cloneChainingArgs(chainedArgument, {
            originator: undefined,
            authenticationLevel: UNTRUSTED_REQ_AUTH_LEVEL,
            uniqueIdentifier: undefined,
        });
        return [ {
            unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                effectiveChainingArguments,
                argument,
            ),
        }, commonArgs ];
    }
    const trustClientDSAForIBRA: boolean = assn.boundNameAndUID
        ? isTrustedForIBRA(ctx, assn.boundNameAndUID.dn)
        : false;
    const effectiveAuthLevel = getEffectiveAuthLevel(
        assn,
        commonArgs?.securityParameters,
        /**
         * ITU Recommendation X.518 (2019), Section 10.3 states that, if the
         * `authenticationLevel` component is not present, anonymous auth should
         * be assumed.
         */
        chainedArgument.authenticationLevel
            ?? UNTRUSTED_REQ_AUTH_LEVEL,
        trustClientDSAForIBRA,
        authLevelSigned,
    );
    const effectiveOriginator = getEffectiveRequester(
        trustClientDSAForIBRA,
        authLevelSigned,
        chainedArgument.originator,
        commonArgs
            ?.securityParameters
            ?.certification_path
            ?.userCertificate
            .toBeSigned
            .subject
            .rdnSequence,
    );
    /**
     * The "effective" uniqueIdentifier must be determined, because it is
     * relevant for access control purposes.
     */
    const effectiveUniqueIdentifier = trustClientDSAForIBRA
        ? chainedArgument?.uniqueIdentifier
        : undefined;
    const effectiveChainingArguments: ChainingArguments = cloneChainingArgs(chainedArgument, {
        originator: effectiveOriginator,
        authenticationLevel: effectiveAuthLevel,
        uniqueIdentifier: effectiveUniqueIdentifier,
        operationIdentifier: chainedArgument.operationIdentifier ?? generateUnusedInvokeID(ctx),
    });

    ctx.log.debug(ctx.i18n.t("log:accepted_operation", {
        iid: ("present" in req.invokeId)
            ? req.invokeId.present.toString()
            : "?",
        opid: effectiveChainingArguments.operationIdentifier ?? "?"
    }), {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId(req.invokeId),
    });

    return [
        {
            unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                effectiveChainingArguments,
                argument,
            ),
        },
        commonArgs,
    ];
}

export default requestValidationProcedure;
