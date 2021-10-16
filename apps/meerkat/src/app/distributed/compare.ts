import { Context, StoredContext, Vertex, ClientConnection, OperationReturn } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "@wildboar/meerkat-types";
import {
    _decode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    CompareResult,
    _encode_CompareResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import {
    CompareResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResultData.ta";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unsupportedMatchingUse,
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
import getAttributeParentTypes from "../x500/getAttributeParentTypes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_COMPARE,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
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
import codeToString from "../x500/codeToString";
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

// AttributeValueAssertion ::= SEQUENCE {
//     type              ATTRIBUTE.&id({SupportedAttributes}),
//     assertion         ATTRIBUTE.&equality-match.&AssertionType
//                         ({SupportedAttributes}{@type}),
//     assertedContexts  CHOICE {
//       allContexts       [0]  NULL,
//       selectedContexts  [1]  SET SIZE (1..MAX) OF ContextAssertion } OPTIONAL,
//     ... }

function contextFromStoredContext (sc: StoredContext): X500Context {
    return new X500Context(
        sc.id,
        sc.values,
        sc.fallback,
    );
}

export
async function compare (
    ctx: Context,
    conn: ClientConnection,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument = _decode_CompareArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(state.invokeId.present)
        : undefined;
    const typeAndSuperTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, data.purported.type_));
    const targetDN = getDistinguishedName(target);
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = state.admPoints
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const AC_SCHEME: string = accessControlScheme?.toString() ?? "";
    const relevantACIItems = [ // FIXME: subentries
        ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
            ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? (target.dse.entryACI ?? [])
            : []),
    ];
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
    const relevantTuples: ACDFTupleExtended[] = (await Promise.all(
        acdfTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
            ...tuple,
            await userWithinACIUserClass(
                tuple[0],
                conn.boundNameAndUID!, // FIXME:
                targetDN,
                EQUALITY_MATCHER,
                isMemberOfGroup,
            ),
        ]),
    ))
        .filter((tuple) => (tuple[5] > 0));
    if (accessControlScheme) {
        const {
            authorized: authorizedToEntry,
        } = bacACDF(
            relevantTuples,
            conn.authLevel,
            {
                entry: Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString),
            },
            [
                PERMISSION_CATEGORY_READ,
            ],
            EQUALITY_MATCHER,
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        for (const type_ of typeAndSuperTypes) {
            if (op?.abandonTime) {
                op.events.emit("abandon");
                throw new errors.AbandonError(
                    ctx.i18n.t("err:abandoned"),
                    new AbandonedData(
                        undefined,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            abandoned["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
                );
            }
            const {
                authorized,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                {
                    attributeType: type_,
                },
                [
                    PERMISSION_CATEGORY_COMPARE,
                    PERMISSION_CATEGORY_READ, // Not mandated by the spec, but required by Meerkat.
                ],
                EQUALITY_MATCHER,
            );
            if (!authorized) {
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
                            conn.boundNameAndUID?.dn,
                            undefined,
                            securityError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        state.chainingArguments.aliasDereferenced,
                        undefined,
                    ),
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
                    conn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
        );
    }

    const eis = new EntryInformationSelection(
        {
            select: typeAndSuperTypes,
        },
        undefined,
        {
            select: typeAndSuperTypes,
        },
        undefined,
        false,
        undefined,
    );
    const {
        userAttributes,
        operationalAttributes,
        collectiveValues,
    } = await readValues(ctx, target, eis, relevantSubentries, data.operationContexts);
    const values = [
        ...userAttributes,
        ...operationalAttributes,
        ...collectiveValues,
    ];
    const acs = data.purported.assertedContexts;
    let matchedType: AttributeType | undefined;
    let matched: boolean = false;
    for (const value of values) {
        if (op?.abandonTime) {
            op.events.emit("abandon");
            throw new errors.AbandonError(
                ctx.i18n.t("err:abandoned"),
                new AbandonedData(
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        if (!matcher(data.purported.assertion, value.value)) {
            continue;
        }
        if (accessControlScheme) {
            const {
                authorized,
            } = bacACDF(
                relevantTuples,
                conn.authLevel,
                {
                    value: new AttributeTypeAndValue(
                        value.id,
                        value.value,
                    ),
                },
                [
                    PERMISSION_CATEGORY_COMPARE,
                    PERMISSION_CATEGORY_READ, // Not mandated by the spec, but required by Meerkat.
                ],
                EQUALITY_MATCHER,
            );
            if (!authorized) {
                continue;
            }
        }
        if (acs) { // If ACS is present, operationContexts are ignored.
            if ("allContexts" in acs) {
                matched = true;
                break;
            }
            if (value.contexts.size === 0) {
                matched = true;
                break;
            }
            // The comments below quote from ITU Recommendation X.501, Section 8.9.
            // assertedContexts is true if:
            // each ContextAssertion in selectedContexts is true...
            matched = acs.selectedContexts
                .every((sc): boolean => evaluateContextAssertion(
                    sc,
                    Object.values(value.contexts).map(contextFromStoredContext),
                    (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.matcher,
                    (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.absentMatch ?? true,
                ));
            if (matched) {
                break;
            } else {
                continue;
            }
        // operationContexts is used if assertedContexts is not used.
        } else if (data.operationContexts) {
            if ("allContexts" in data.operationContexts) {
                matched = true;
                break;
            } else if ("selectedContexts" in data.operationContexts) {
                // assertedContexts is true if:
                // each ContextAssertion in selectedContexts is true...
                matched = data
                    .operationContexts
                    .selectedContexts // FIXME: Replace with evaluateTypeAndContextAssertion
                    .filter((sc): boolean => (sc.type_.isEqualTo(data.purported.type_)))
                    .every((sc): boolean => {
                        if ("all" in sc.contextAssertions) {
                            return sc.contextAssertions.all
                                .every((ca): boolean => evaluateContextAssertion(
                                    ca,
                                    Object.values(value.contexts).map(contextFromStoredContext),
                                    (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.matcher,
                                    (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.absentMatch ?? true,
                                ));
                        } else if ("preference" in sc.contextAssertions) {
                            // REVIEW: I _think_ this is fine. See X.511, Section 7.6.3.
                            return sc.contextAssertions.preference
                                .some((ca): boolean => evaluateContextAssertion(
                                    ca,
                                    Object.values(value.contexts).map(contextFromStoredContext),
                                    (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.matcher,
                                    (ctype: OBJECT_IDENTIFIER) => ctx.contextTypes.get(ctype.toString())?.absentMatch ?? true,
                                ));
                        } else {
                            return false; // FIXME: Not understood. What to do?
                        }
                    });
                if (matched) {
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
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }

    const result: CompareResult = {
        unsigned: new CompareResultData(
            {
                rdnSequence: targetDN,
            },
            matched,
            !target.dse.shadow,
            matchedType,
            [],
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                id_opcode_compare,
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            undefined,
            undefined,
        ),
    };

    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    undefined,
                    undefined,
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
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
