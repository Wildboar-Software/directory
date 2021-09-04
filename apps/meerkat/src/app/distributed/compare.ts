import { Context, StoredContext, Vertex } from "../types";
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
import { DERElement, OBJECT_IDENTIFIER } from "asn1-ts";
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
import isAttributeSubtype from "../x500/isAttributeSubtype";
import evaluateContextAssertion from "@wildboar/x500/src/lib/utils/evaluateContextAssertion";
import getDistinguishedName from "../x500/getDistinguishedName";
import getAttributeParentTypes from "../x500/getAttributeParentTypes";

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
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_CompareArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const typeAndSuperTypes: AttributeType[] = Array.from(getAttributeParentTypes(ctx, data.purported.type_));
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
    const targetDN = getDistinguishedName(target);

    // TODO: This could result in reading a lot of data into memory...
    const {
        userAttributes,
        operationalAttributes,
    } = await readValues(ctx, target);
    const values = [
        ...userAttributes,
        ...operationalAttributes,
    ];
    const acs = data.purported.assertedContexts;
    let matchedType: AttributeType | undefined;
    const matched: boolean = values
        .some((v) => {
            matchedType = isAttributeSubtype(ctx, v.id, data.purported.type_);
            if (!matchedType) {
                return false;
            }
            if (!matcher(data.purported.assertion, v.value)) {
                return false;
            }

            if (acs) { // If ACS is present, operationContexts are ignored.
                if ("allContexts" in acs) {
                    return true;
                }
                if (v.contexts.size === 0) {
                    return true;
                }
                // The comments below quote from ITU Recommendation X.501, Section 8.9.
                // assertedContexts is true if:
                // each ContextAssertion in selectedContexts is true...
                return acs.selectedContexts
                    .every((sc): boolean => evaluateContextAssertion(
                        sc,
                        Object.values(v.contexts).map(contextFromStoredContext),
                        (ctype: OBJECT_IDENTIFIER) => ctx.contextMatchers.get(ctype.toString()),
                    ));
            // operationContexts is used if assertedContexts is not used.
            } else if (data.operationContexts) {
                if ("allContexts" in data.operationContexts) {
                    return true;
                } else if ("selectedContexts" in data.operationContexts) {
                    // assertedContexts is true if:
                    // each ContextAssertion in selectedContexts is true...
                    return data
                        .operationContexts
                        .selectedContexts // FIXME: Replace with evaluateTypeAndContextAssertion
                        .filter((sc): boolean => (sc.type_.isEqualTo(data.purported.type_)))
                        .every((sc): boolean => {
                            if ("all" in sc.contextAssertions) {
                                return sc.contextAssertions.all
                                    .every((ca): boolean => evaluateContextAssertion(
                                        ca,
                                        Object.values(v.contexts).map(contextFromStoredContext),
                                        (ctype: OBJECT_IDENTIFIER) => ctx.contextMatchers.get(ctype.toString()),
                                    ));
                            } else if ("preference" in sc.contextAssertions) {
                                // REVIEW: I _think_ this is fine. See X.511, Section 7.6.3.
                                return sc.contextAssertions.preference
                                    .some((ca): boolean => evaluateContextAssertion(
                                        ca,
                                        Object.values(v.contexts).map(contextFromStoredContext),
                                        (ctype: OBJECT_IDENTIFIER) => ctx.contextMatchers.get(ctype.toString()),
                                    ));
                            } else {
                                return false; // FIXME: Not understood. What to do?
                            }
                        });
                } else {
                    return false; // FIXME: Not understood: what to do?
                }
            }
            return true;
        });

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
