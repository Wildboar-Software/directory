import { Context, Vertex, ClientAssociation, OperationReturn, Value } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ObjectIdentifier, TRUE_BIT, unpackBits } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
import {
    _decode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    CompareArgumentData,
    _encode_CompareArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta";
import {
    CompareResult,
    _encode_CompareResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import {
    CompareResultData,
    _encode_CompareResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResultData.ta";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unsupportedMatchingUse,
    ServiceProblem_unwillingToPerform,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    readValues,
} from "../database/entry/readValues";
import evaluateContextAssertion from "@wildboar/x500/src/lib/utils/evaluateContextAssertion";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_COMPARE,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_compare,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-compare.va";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import type { OperationDispatcherState } from "./OperationDispatcher";
import { DER } from "asn1-ts/dist/node/functional";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments";
import getStatisticsFromAttributeValueAssertion from "../telemetry/getStatisticsFromAttributeValueAssertion";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";
import failover from "../utils/failover";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import getACIItems from "../authz/getACIItems";
import accessControlSchemesThatUseACIItems from "../authz/accessControlSchemesThatUseACIItems";
import getAttributeSubtypes from "../x500/getAttributeSubtypes";
import {
    ServiceControlOptions_noSubtypeMatch,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import {
    FamilyGrouping_entryOnly,
    FamilyGrouping_compoundEntry,
    FamilyGrouping_strands,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyGrouping.ta";
import readFamily from "../database/family/readFamily";
import readEntryOnly from "../database/family/readEntryOnly";
import readCompoundEntry from "../database/family/readCompoundEntry";
import readStrands from "../database/family/readStrands";
import bacSettings from "../authz/bacSettings";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import preprocessTuples from "../authz/preprocessTuples";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import {
    AttributeProblem_noSuchAttributeOrValue,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import isOperationalAttributeType from "../x500/isOperationalAttributeType";
import { verifySIGNED } from "../pki/verifySIGNED";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { generateSignature } from "../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";

/**
 * @summary The compare operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `compare` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 10.2. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 19.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function compare (
    ctx: Context,
    assn: ClientAssociation,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument = _decode_CompareArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     */
     if ("signed" in argument) {
        const certPath = argument.signed.toBeSigned.securityParameters?.certification_path;
        verifySIGNED(
            ctx,
            assn,
            certPath,
            state.invokeId,
            state.chainingArguments.aliasDereferenced,
            argument.signed,
            _encode_CompareArgumentData,
            signErrors,
        );
    }
    // #endregion Signature validation
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const noSubtypeMatch: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_noSubtypeMatch] === TRUE_BIT);
    const typeAndSubtypes: AttributeType[] = noSubtypeMatch
        ? [ data.purported.type_ ]
        : [
            data.purported.type_,
            ...getAttributeSubtypes(ctx, data.purported.type_),
        ];
    const targetDN = getDistinguishedName(target);
    const user = state.chainingArguments.originator
        ? new NameAndOptionalUID(
            state.chainingArguments.originator,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = getACIItems(
        accessControlScheme,
        target.immediateSuperior,
        target,
        relevantSubentries,
        Boolean(target.dse.subentry),
    );
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
        accessControlScheme,
        acdfTuples,
        user,
        state.chainingArguments.authenticationLevel ?? assn.authLevel,
        targetDN,
        isMemberOfGroup,
        NAMING_MATCHER,
    );
    if (
        accessControlScheme
        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
    ) {
        const { authorized: authorizedToEntry } = bacACDF(
            relevantTuples,
            user,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_READ,
            ],
            bacSettings,
            true,
        );
        if (!authorizedToEntry) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_read"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
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
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        for (const type_ of typeAndSubtypes) {
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    ctx.i18n.t("err:abandoned"),
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            const { authorized: authorizedToCompareAttributeType } = bacACDF(
                relevantTuples,
                user,
                {
                    attributeType: type_,
                    operational: isOperationalAttributeType(ctx, type_),
                },
                [
                    PERMISSION_CATEGORY_COMPARE,
                    PERMISSION_CATEGORY_READ, // Not mandated by the spec, but required by Meerkat.
                ],
                bacSettings,
                true,
            );
            if (!authorizedToCompareAttributeType) {
                const { authorized: authorizedToDiscloseAttribute } = bacACDF(
                    relevantTuples,
                    user,
                    {
                        attributeType: type_,
                        operational: isOperationalAttributeType(ctx, type_),
                    },
                    [ PERMISSION_CATEGORY_DISCLOSE_ON_ERROR ],
                    bacSettings,
                    true,
                );
                if (authorizedToDiscloseAttribute) {
                    throw new errors.SecurityError(
                        ctx.i18n.t("err:not_authz_read_or_compare_attr", {
                            oid: type_.toString(),
                        }),
                        new SecurityErrorData(
                            SecurityProblem_insufficientAccessRights,
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
                            state.chainingArguments.aliasDereferenced,
                            undefined,
                        ),
                        signErrors,
                    );
                }
                // Otherwise, we must pretend that the compared attribute simply does not exist.
                throw new errors.AttributeError(
                    ctx.i18n.t("err:no_such_attribute_or_value"),
                    new AttributeErrorData(
                        {
                            rdnSequence: targetDN,
                        },
                        [
                            new AttributeErrorData_problems_Item(
                                AttributeProblem_noSuchAttributeOrValue,
                                data.purported.type_,
                                undefined,
                            ),
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
    }
    const matcher = EQUALITY_MATCHER(data.purported.type_);
    if (!matcher) {
        throw new errors.ServiceError(
            ctx.i18n.t("err:no_equality_matching_rule_defined_for_type", {
                oid: data.purported.type_.toString(),
            }),
            new ServiceErrorData(
                ServiceProblem_unsupportedMatchingUse,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    const familyGrouping = data.familyGrouping ?? CompareArgumentData._default_value_for_familyGrouping;
    const familySubsetGetter: (vertex: Vertex) => IterableIterator<Vertex[]> = (() => {
        switch (familyGrouping) {
        case (FamilyGrouping_entryOnly): return readEntryOnly;
        case (FamilyGrouping_compoundEntry): return readCompoundEntry;
        case (FamilyGrouping_strands): return readStrands;
        default: {
            throw new errors.ServiceError(
                ctx.i18n.t("err:unsupported_familygrouping"),
                new ServiceErrorData(
                    ServiceProblem_unwillingToPerform,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        }
    })();
    const eis = new EntryInformationSelection(
        {
            select: [ data.purported.type_ ],
        },
        undefined,
        {
            select: [ data.purported.type_ ],
        },
        undefined,
        true, // We need the contexts for evaluation.
        undefined,
    );
    const family = await readFamily(ctx, target);
    const familySubsets = familySubsetGetter(family);
    const readMemberValues = async (member: Vertex): Promise<Value[]> => {
        const {
            userValues,
            operationalValues,
            collectiveValues,
        } = await readValues(ctx, member, {
            selection: eis,
            relevantSubentries,
            operationContexts: data.operationContexts,
            noSubtypeSelection: noSubtypeMatch,
        });
        return [
            ...userValues,
            ...operationalValues,
            ...collectiveValues,
        ];
    }
    const acs = data.purported.assertedContexts;
    let matchedType: AttributeType | undefined;
    let matched: boolean = false;
    for (const familySubset of familySubsets) {
        const familySubsetValues: Value[] = (await Promise.all(
            familySubset.map(readMemberValues),
        )).flat();
        for (const value of familySubsetValues) {
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    ctx.i18n.t("err:abandoned"),
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                    signErrors,
                );
            }
            try {
                if (!matcher(data.purported.assertion, value.value)) {
                    continue;
                }
            } catch {
                continue;
            }

            if (
                accessControlScheme
                && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
            ) {
                const {
                    authorized,
                } = bacACDF(
                    relevantTuples,
                    user,
                    {
                        value: new AttributeTypeAndValue(
                            value.type,
                            value.value,
                        ),
                        operational: isOperationalAttributeType(ctx, value.type),
                    },
                    [
                        PERMISSION_CATEGORY_COMPARE,
                        PERMISSION_CATEGORY_READ, // Not mandated by the spec, but required by Meerkat.
                    ],
                    bacSettings,
                    true,
                );
                if (!authorized) {
                    continue;
                }
            }
            if (acs) { // If ACS is present, operationContexts are ignored.
                if ("allContexts" in acs) {
                    matchedType = value.type;
                    matched = true;
                    break;
                }
                if (!value.contexts || (value.contexts.length === 0)) {
                    matchedType = value.type;
                    matched = true;
                    break;
                }
                // The comments below quote from ITU Recommendation X.501, Section 8.9.
                // assertedContexts is true if:
                // each ContextAssertion in selectedContexts is true...
                matched = acs.selectedContexts
                    .every((sc): boolean => evaluateContextAssertion(
                        sc,
                        Object.values(value.contexts ?? {}),
                        (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.matcher,
                        (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.absentMatch ?? true,
                    ));
                if (matched) {
                    matchedType = value.type;
                    break;
                } else {
                    continue;
                }
            // operationContexts is used if assertedContexts is not used.
            }
            else if (data.operationContexts) {
                if ("allContexts" in data.operationContexts) {
                    matchedType = value.type;
                    matched = true;
                    break;
                } else if ("selectedContexts" in data.operationContexts) {
                    /**
                     * Note that (I think) some generic
                     * `evaluateTypeAndContextAssertion()` function could not be
                     * used in this case, because `preference` merely needs to check
                     * that any context is matched.
                     */
                    // assertedContexts is true if:
                    // each ContextAssertion in selectedContexts is true...
                    matched = data
                        .operationContexts
                        .selectedContexts
                        .filter((sc): boolean => (sc.type_.isEqualTo(data.purported.type_)))
                        .every((sc): boolean => {
                            if ("all" in sc.contextAssertions) {
                                return sc.contextAssertions.all
                                    .every((ca): boolean => evaluateContextAssertion(
                                        ca,
                                        Object.values(value.contexts ?? {}),
                                        (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.matcher,
                                        (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.absentMatch ?? true,
                                    ));
                            } else if ("preference" in sc.contextAssertions) {
                                return sc.contextAssertions.preference
                                    .some((ca): boolean => evaluateContextAssertion(
                                        ca,
                                        Object.values(value.contexts ?? {}),
                                        (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.matcher,
                                        (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.absentMatch ?? true,
                                    ));
                            } else {
                                return false;
                            }
                        });
                    if (matched) {
                        matchedType = value.type;
                        break;
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            matched = true;
            break;
        }
        if (matched) {
            break;
        }
    }
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }

    const resultData: CompareResultData = new CompareResultData(
        {
            rdnSequence: targetDN,
        },
        matched,
        !target.dse.shadow,
        matchedType,
        [],
        createSecurityParameters(
            ctx,
            assn.boundNameAndUID?.dn,
            id_opcode_compare,
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    const result: CompareResult = (data.securityParameters?.target === ProtectionRequest_signed)
        ? (() => {
            const resultDataBytes = _encode_CompareResultData(resultData, DER).toBytes();
            const key = ctx.config.signing?.key;
            if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
                return {
                    unsigned: resultData,
                };
            }
            const signingResult = generateSignature(key, resultDataBytes);
            if (!signingResult) {
                return {
                    unsigned: resultData,
                };
            }
            const [ sigAlg, sigValue ] = signingResult;
            return {
                signed: new SIGNED(
                    resultData,
                    sigAlg,
                    unpackBits(sigValue),
                    undefined,
                    undefined,
                ),
            };
        })()
        : {
            unsigned: resultData,
        };

    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        id_opcode_compare,
                    ),
                    undefined,
                ),
                _encode_CompareResult(result, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_compare),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                ava: getStatisticsFromAttributeValueAssertion(data.purported),
            }), undefined),
        },
    };
}

export default compare;
