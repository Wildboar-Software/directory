import type { Context, ClientAssociation } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import { addSeconds } from "date-fns";
import { DER } from "asn1-ts/dist/node/functional";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import { OPTIONALLY_PROTECTED } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
    _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ASN1Element,
    BOOLEAN,
    INTEGER,
    OPTIONAL,
    TRUE_BIT,
    FALSE,
    packBits,
    DERElement,
    ASN1TagClass,
} from "asn1-ts";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_invalidSignature,
    SecurityProblem_noInformation,
    SecurityProblem_invalidCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    ServiceProblem_loopDetected,
    ServiceProblem_busy,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
// import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
// import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
// import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import { loopDetected } from "@wildboar/x500/src/lib/distributed/loopDetected";
import { AuthenticationLevel } from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import { SecurityParameters } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import { DomainInfo } from "@wildboar/x500/src/lib/modules/DistributedOperations/DomainInfo.ta";
import { Exclusions } from "@wildboar/x500/src/lib/modules/DistributedOperations/Exclusions.ta";
import { OperationProgress } from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { ReferenceType, ReferenceType_self } from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import { Time } from "@wildboar/x500/src/lib/modules/DistributedOperations/Time.ta";
import { TraceInformation } from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceInformation.ta";
import { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { UniqueIdentifier } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UniqueIdentifier.ta";
import { MRMapping } from "@wildboar/x500/src/lib/modules/ServiceAdministration/MRMapping.ta";
import { SearchRuleId } from "@wildboar/x500/src/lib/modules/ServiceAdministration/SearchRuleId.ta";
import { TraceItem } from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceItem.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import { strict as assert } from "assert";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import { printInvokeId } from "../utils/printInvokeId";
import { VCP_RETURN_CODE_OK, verifySignature } from "../pki/verifyCertPath";
import { verifyAnyCertPath } from "../pki/verifyAnyCertPath";
import {
    ProtectionRequest_signed,
    _decode_ProtectionRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";

type Chain = OPTIONALLY_PROTECTED<Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1>;

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
    authenticationLevel: AuthenticationLevel,
    uniqueIdentifier?: UniqueIdentifier,
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
    let securityParameters: OPTIONAL<SecurityParameters>;
    let entryOnly: OPTIONAL<BOOLEAN>;
    let exclusions: OPTIONAL<Exclusions>;
    let excludeShadows: OPTIONAL<BOOLEAN>;
    let nameResolveOnMaster: OPTIONAL<BOOLEAN>;
    let operationIdentifier: OPTIONAL<INTEGER>;
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
    // }
    // else if (compareCode(operationCode, administerPassword["&operationCode"]!)) {
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
    ctx: Context,
    assn: ClientAssociation,
    req: Request,
    alreadyChained: boolean,
    authenticationLevel: AuthenticationLevel,
    uniqueIdentifier?: UniqueIdentifier,
): Promise<Chain> {
    assert(req.opCode);
    assert(req.argument);
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
            return {
                unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                    chainingArguments,
                    req.argument!,
                ),
            };
        })();
    const unsigned = getOptionallyProtectedValue(hydratedArgument);
    const {
        chainedArgument,
        argument,
    } = unsigned;
    const opArgElements = argument.set;
        const securityParameters = opArgElements
        .find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 29)
        ))?.inner;
    const errorProtectionElement = securityParameters?.set
        .find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 8)
        ))?.inner;
    const errorProtection = errorProtectionElement
        ? _decode_ProtectionRequest(errorProtectionElement)
        : undefined;
    const signErrors: boolean = (errorProtection === ProtectionRequest_signed);
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
    if ("signed" in hydratedArgument) {
        const remoteHostIdentifier = `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`;
        const certPath = hydratedArgument.signed.toBeSigned.chainedArgument.securityParameters?.certification_path;
        if (!certPath) {
            throw new errors.MistypedArgumentError(
                ctx.i18n.t("err:cert_path_required_signed", {
                    context: "arg",
                    host: remoteHostIdentifier,
                    aid: assn.id,
                    iid: printInvokeId(req.invokeId),
                }),
            );
        }
        for (const pair of certPath.theCACertificates ?? []) {
            if (!pair.issuedToThisCA) {
                throw new errors.MistypedArgumentError(
                    ctx.i18n.t("err:cert_path_issuedToThisCA", {
                        host: remoteHostIdentifier,
                        aid: assn.id,
                        iid: printInvokeId(req.invokeId),
                    }),
                );
            }
        }
        const vcpResult = verifyAnyCertPath(ctx, certPath);
        if (vcpResult.returnCode !== VCP_RETURN_CODE_OK) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:cert_path_invalid", {
                    host: remoteHostIdentifier,
                    aid: assn.id,
                    iid: printInvokeId(req.invokeId),
                }),
                new SecurityErrorData(
                    SecurityProblem_invalidCredentials,
                    undefined,
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
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
        const signedData = hydratedArgument.signed.originalDER
            ? (() => {
                const el = new DERElement();
                el.fromBytes(hydratedArgument.signed.originalDER);
                const tbs = el.sequence[0];
                return tbs.toBytes();
            })()
            : _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(hydratedArgument.signed.toBeSigned, DER).toBytes();
        const signatureAlg = hydratedArgument.signed.algorithmIdentifier;
        const signatureValue = packBits(hydratedArgument.signed.signature);
        const signatureIsValid: boolean | undefined = verifySignature(
            signedData,
            signatureAlg,
            signatureValue,
            certPath.userCertificate.toBeSigned.subjectPublicKeyInfo,
        );
        if (!signatureIsValid) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:invalid_signature_on_arg", {
                    host: remoteHostIdentifier,
                    aid: assn.id,
                    iid: printInvokeId(req.invokeId),
                }),
                new SecurityErrorData(
                    SecurityProblem_invalidSignature,
                    undefined,
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
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
    if (chainedArgument.operationIdentifier) {
        ctx.log.debug(ctx.i18n.t("log:received_chained_operation", {
            opid: chainedArgument.operationIdentifier,
            cid: assn.id,
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            invokeID: printInvokeId(req.invokeId),
        });
    }
    return hydratedArgument;
}

export default requestValidationProcedure;
