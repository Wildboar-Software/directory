import type { Context, ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import * as errors from "@wildboar/meerkat-types";
import { addSeconds } from "date-fns";
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
    ASN1TagClass,
    BERElement,
} from "asn1-ts";
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
import { abandon } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandon.oa";
import { administerPassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { changePassword } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import { loopDetected } from "@wildboar/x500/src/lib/distributed/loopDetected";
import { AuthenticationLevel, AuthenticationLevel_basicLevels } from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
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
import {
    _decode_ErrorProtectionRequest,
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { verifySIGNED } from "../pki/verifySIGNED";
import { isArgumentSigned } from "../x500/isArgumentSigned";

type Chain = OPTIONALLY_PROTECTED<Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1>;

// TODO: Unit testing
/**
 * @summary Determine whether error signing was requested without decoding the
 *  entire argument.
 * @description
 *
 * This is a performance hack to avoid decoding the whole DAP argument just to
 * determine if signing was requested. Note that this ONLY works for DAP
 * requests--not DSP.
 *
 * @param opCode The operation code
 * @param arg The ASN.1 value of the non-chained argument
 * @returns Whether signing was requested, or `undefined` if it cannot be
 *  determined.
 *
 * @function
 */
function errorSigningRequestedInDAPArgument (
    opCode: Code,
    arg: ASN1Element,
): boolean | undefined {
    if (!("local" in opCode)) {
        return undefined;
    }
    const signed: boolean | undefined = isArgumentSigned(opCode, arg);
    const argElements = signed
        ? (() => {
            const firstElement = new BERElement()
            firstElement.fromBytes(arg.value);
            return firstElement.set;
        })()
        : arg.set; // NOTE: This path will be taken for _unrecognized_ operations, too.
    const securityParameters = argElements
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
        ? _decode_ErrorProtectionRequest(errorProtectionElement)
        : undefined;
    return (errorProtection === ErrorProtectionRequest_signed);
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
    let operationIdentifier: OPTIONAL<INTEGER>;
    let searchRuleId: OPTIONAL<SearchRuleId>;
    let chainedRelaxation: OPTIONAL<MRMapping>;
    let relatedEntry: OPTIONAL<INTEGER>;
    let dspPaging: OPTIONAL<BOOLEAN>;
    let excludeWriteableCopies: OPTIONAL<BOOLEAN>;

    /**
     * Whether the request was signed or not really needs to be determined here,
     * because it influences the authentication level used for making access
     * control decisions in the Find DSE operation and other non-operation
     * evaluation procedures.
     */
    let signed: boolean = false;

    /**
     * Abandon procedures are supposed to start here, but we do them within the
     * connection classes instead.
     */
    if (compareCode(operationCode, abandon["&operationCode"]!)) {
        // Hack for avoiding unnecessary decoding.
        signed = (operationArgument.tagNumber === 0);
    }
    else if (compareCode(operationCode, administerPassword["&operationCode"]!)) {
        // Hack for avoiding unnecessary decoding.
        signed = (operationArgument.tagNumber === 0);
    }
    else if (compareCode(operationCode, addEntry["&operationCode"]!)) {
        const arg = addEntry.decoderFor["&ArgumentType"]!(operationArgument);
        if ("signed" in arg) {
            signed = true;
        }
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
    else if (compareCode(operationCode, changePassword["&operationCode"]!)) {
        // Hack for avoiding unnecessary decoding.
        signed = (operationArgument.tagNumber === 0);
    }
    else if (compareCode(operationCode, compare["&operationCode"]!)) {
        const arg = compare.decoderFor["&ArgumentType"]!(operationArgument);
        if ("signed" in arg) {
            signed = true;
        }
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
        if ("signed" in arg) {
            signed = true;
        }
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
        if ("signed" in arg) {
            signed = true;
        }
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
        if ("signed" in arg) {
            signed = true;
        }
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
        if ("signed" in arg) {
            signed = true;
        }
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
        if ("signed" in arg) {
            signed = true;
        }
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
        if ("signed" in arg) {
            signed = true;
        }
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
        ("basicLevels" in authenticationLevel)
            ? {
                basicLevels: new AuthenticationLevel_basicLevels(
                    authenticationLevel.basicLevels.level,
                    authenticationLevel.basicLevels.localQualifier,
                    signed,
                ),
            }
            : authenticationLevel,
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
        argument,
    } = unsigned;
    const signErrors: boolean = errorSigningRequestedInDAPArgument(req.opCode, argument) ?? false;
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
