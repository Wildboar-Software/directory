import { Context, StoredContext, Vertex, ClientConnection } from "../types";
import { DERElement, OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import * as errors from "../errors";
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
    ServiceError,
} from "../errors";
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
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
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
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getIsGroupMember from "../bac/getIsGroupMember";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";

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
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_CompareArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const typeAndSuperTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, data.purported.type_));
    const targetDN = getDistinguishedName(target);
    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = admPoints
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
                "Not permitted to modify entry with changePassword operation.",
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        for (const type_ of typeAndSuperTypes) {
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
                    `Not permitted to compare or read attribute type ${type_.toString()}.`,
                    new SecurityErrorData(
                        SecurityProblem_insufficientAccessRights,
                        undefined,
                        undefined,
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
        }
    }
    const matcher = typeAndSuperTypes
        .map((type_) => ctx.attributes.get(type_.toString()))
        .find((spec) => spec?.equalityMatcher)?.equalityMatcher;
    if (!matcher) {
        throw new ServiceError(
            `Equality matching rule used by type ${data.purported.type_.toString()} not understood.`,
            new ServiceErrorData(
                ServiceProblem_unsupportedMatchingUse,
                [],
                undefined,
                undefined,
                undefined,
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
    } = await readValues(ctx, target, eis);
    const values = [
        ...userAttributes,
        ...operationalAttributes,
    ];
    const acs = data.purported.assertedContexts;
    let matchedType: AttributeType | undefined;
    let matched: boolean = false;
    for (const value of values) {
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
                    (ctype: OBJECT_IDENTIFIER) => ctx.contextMatchers.get(ctype.toString()),
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
                                    (ctype: OBJECT_IDENTIFIER) => ctx.contextMatchers.get(ctype.toString()),
                                ));
                        } else if ("preference" in sc.contextAssertions) {
                            // REVIEW: I _think_ this is fine. See X.511, Section 7.6.3.
                            return sc.contextAssertions.preference
                                .some((ca): boolean => evaluateContextAssertion(
                                    ca,
                                    Object.values(value.contexts).map(contextFromStoredContext),
                                    (ctype: OBJECT_IDENTIFIER) => ctx.contextMatchers.get(ctype.toString()),
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

    const result: CompareResult = {
        unsigned: new CompareResultData(
            {
                rdnSequence: targetDN,
            },
            matched,
            !target.dse.shadow,
            matchedType,
            [],
            undefined,
            undefined,
            undefined,
            undefined,
        ),
    };

    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_CompareResult(result, () => new DERElement()),
    );
}

export default compare;
