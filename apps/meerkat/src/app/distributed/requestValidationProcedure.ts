import type { Context } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import { addSeconds } from "date-fns";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import { OPTIONALLY_PROTECTED } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { ASN1Element, BOOLEAN, INTEGER, OPTIONAL, TRUE_BIT, FALSE } from "asn1-ts";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_noInformation,
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

function createChainingArgumentsFromDUA (
    ctx: Context,
    operationCode: Code,
    operationArgument: ASN1Element,
    authenticationLevel: AuthenticationLevel,
    uniqueIdentifier?: UniqueIdentifier,
): ChainingArguments {
    let originator: OPTIONAL<DistinguishedName>;
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
        originator = data.requestor;
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
            undefined,
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    // else if (compareCode(operationCode, changePassword["&operationCode"]!)) {
    // }
    else if (compareCode(operationCode, compare["&operationCode"]!)) {
        const arg = compare.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = data.requestor;
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
            undefined,
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, modifyDN["&operationCode"]!)) {
        const arg = modifyDN.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = data.requestor;
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
            undefined,
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, modifyEntry["&operationCode"]!)) {
        const arg = modifyEntry.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = data.requestor;
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
            undefined,
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, list["&operationCode"]!)) {
        const arg = list.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = data.requestor;
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
            undefined,
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, read["&operationCode"]!)) {
        const arg = read.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = data.requestor;
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
            undefined,
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, removeEntry["&operationCode"]!)) {
        const arg = removeEntry.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = data.requestor;
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
            undefined,
            operationProgress ?? ChainingArguments._default_value_for_operationProgress,
        ));
    }
    else if (compareCode(operationCode, search["&operationCode"]!)) {
        const arg = search.decoderFor["&ArgumentType"]!(operationArgument);
        const data = getOptionallyProtectedValue(arg);
        originator = data.requestor;
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
            undefined,
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
 * @summary
 * @description
 *
 * Note: this is only used for DAP, LDAP, and DSP requests. DOP and DISP bypass
 * this procedure.
 *
 * @param ctx
 * @param applicationContextOrProtocolID
 * @param operationCode
 * @param operationArgument
 */
export
async function requestValidationProcedure (
    ctx: Context,
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
        // argument,
    } = unsigned;
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
                    undefined,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                chainedArgument.aliasDereferenced,
                undefined,
            ),
        );
    }
    if ("signed" in hydratedArgument) {
        // TODO: Validate signature.
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
                    undefined,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                chainedArgument.aliasDereferenced,
                undefined,
            ),
        );
    }
    return hydratedArgument;
}

export default requestValidationProcedure;
