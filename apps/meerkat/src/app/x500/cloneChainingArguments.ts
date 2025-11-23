import {
    ChainingArguments,
} from "@wildboar/x500/DistributedOperations";

/**
 * @summary Clone a `ChainingArguments` object, and possibly update some of its fields
 * @description
 *
 * This function clones a `ChainingArguments` object, and can be used to change
 * some of the fields in the new clone via the `delta` parameter.
 *
 * @param chaining The chaining arguments to be cloned
 * @param delta Overrrides to apply to the fields of the new `ChainingArguments`
 * @returns A new `ChainingArguments` object
 *
 * @function
 */
export
function cloneChainingArgs (chaining: ChainingArguments, delta?: Partial<ChainingArguments>): ChainingArguments {
    return new ChainingArguments(
        delta?.originator ?? chaining.originator,
        delta?.targetObject ?? chaining.targetObject,
        delta?.operationProgress ?? chaining.operationProgress,
        delta?.traceInformation ?? chaining.traceInformation,
        delta?.aliasDereferenced ?? chaining.aliasDereferenced,
        delta?.aliasedRDNs ?? chaining.aliasedRDNs,
        delta?.returnCrossRefs ?? chaining.returnCrossRefs,
        delta?.referenceType ?? chaining.referenceType,
        delta?.info ?? chaining.info,
        delta?.timeLimit ?? chaining.timeLimit,
        delta?.securityParameters ?? chaining.securityParameters,
        delta?.entryOnly ?? chaining.entryOnly,
        delta?.uniqueIdentifier ?? chaining.uniqueIdentifier,
        delta?.authenticationLevel ?? chaining.authenticationLevel,
        delta?.exclusions ?? chaining.exclusions,
        delta?.excludeShadows ?? chaining.excludeShadows,
        delta?.nameResolveOnMaster ?? chaining.nameResolveOnMaster,
        delta?.operationIdentifier ?? chaining.operationIdentifier,
        delta?.searchRuleId ?? chaining.searchRuleId,
        delta?.chainedRelaxation ?? chaining.chainedRelaxation,
        delta?.relatedEntry ?? chaining.relatedEntry,
        delta?.dspPaging ?? chaining.dspPaging,
        delta?.excludeWriteableCopies ?? chaining.excludeWriteableCopies,
    );
}

export default cloneChainingArgs;
