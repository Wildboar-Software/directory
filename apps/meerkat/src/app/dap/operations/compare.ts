import type { Context } from "../../types";
import type {
    CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    CompareResult, CompareResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import {
    NameError,
    ServiceError,
    objectDoesNotExistErrorData,
    CONTEXTS_NOT_ENABLED_ERROR,
} from "../errors";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unsupportedMatchingUse,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    EXT_BIT_USE_OF_CONTEXTS,
} from "../../x500/extensions";
import isAttributeSubtype from "../../x500/isAttributeSubtype";
import { OBJECT_IDENTIFIER, TRUE_BIT } from "asn1-ts";
import findEntry from "../../x500/findEntry";
import getDistinguishedName from "../../x500/getDistinguishedName";
import evaluateContextAssertion from "../../x500/evaluateContextAssertion";

// compare OPERATION ::= {
//   ARGUMENT  CompareArgument
//   RESULT    CompareResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-compare }

// CompareArgument ::= OPTIONALLY-PROTECTED { CompareArgumentData }

// CompareArgumentData ::= SET {
//   object       [0]  Name,
//   purported    [1]  AttributeValueAssertion,
//   ...,
//   ...,
//   COMPONENTS OF     CommonArguments }

// CompareResult ::= OPTIONALLY-PROTECTED { CompareResultData }

// CompareResultData ::= SET {
//   name                 Name OPTIONAL,
//   matched         [0]  BOOLEAN,
//   fromEntry       [1]  BOOLEAN DEFAULT TRUE,
//   matchedSubtype  [2]  AttributeType OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF        CommonResults }

export
async function compare (
    ctx: Context,
    arg: CompareArgument,
): Promise<CompareResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;

    const useOfContexts = (data.criticalExtensions?.[EXT_BIT_USE_OF_CONTEXTS] === TRUE_BIT);
    if (
        !useOfContexts
        && (
            data.purported.assertedContexts
            || data.operationContexts
        )
    ) {
        throw CONTEXTS_NOT_ENABLED_ERROR;
    }

    // const dn = nameToString(data.object);
    // const namedEntry = Array.from(ctx.database.data.entries.values())
    //     .find((e) => (nameToString(e.dn) === dn));
    // const entry = namedEntry?.aliasedEntryId
    //     ? ctx.database.data.entries.get(namedEntry.aliasedEntryId)
    //     : namedEntry;
    const entry = findEntry(ctx, ctx.database.data.dit, data.object.rdnSequence);
    if (!entry) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, data.object),
        );
    }
    const MR_OID: string = data.purported.type_.toString();
    const matcher = ctx.equalityMatchingRules.get(MR_OID);
    if (!matcher) {
        throw new ServiceError(
            `Matching rule identified by OID ${MR_OID} not understood.`,
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
    const TYPE_OID: string = data.purported.type_.toString();
    const acs = data.purported.assertedContexts;
    let matchedType: OBJECT_IDENTIFIER | undefined;
    const matched = Array.from(ctx.database.data.values.values())
        .some((v) => {
            if (v.entry !== entry.uuid) {
                return false;
            }
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
                    .every((sc): boolean => evaluateContextAssertion(ctx, sc, v));
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
                        .filter((sc): boolean => (sc.type_.toString() === TYPE_OID))
                        .every((sc): boolean => {
                            if ("all" in sc.contextAssertions) {
                                return sc.contextAssertions.all
                                    .every((ca): boolean => evaluateContextAssertion(ctx, ca, v));
                            } else if ("preference" in sc.contextAssertions) {
                                // REVIEW: I _think_ this is fine. See X.511, Section 7.6.3.
                                return sc.contextAssertions.preference
                                    .some((ca): boolean => evaluateContextAssertion(ctx, ca, v));
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

    return {
        unsigned: new CompareResultData(
            entry.aliasedEntry // If we made it this far, it's because this resolved.
                ? {
                    rdnSequence: getDistinguishedName(entry.aliasedEntry),
                }
                : undefined,
            matched,
            !entry.dseType.shadow,
            matchedType,
            [],
            undefined,
            undefined,
            undefined,
            undefined,
        ),
    };
}

export default compare;
