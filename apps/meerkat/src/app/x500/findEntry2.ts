import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { Context, DIT, Entry } from "../types";
// import type {
//     ContinuationReference,
// } from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import getDistinguishedName from "./getDistinguishedName";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import { OBJECT_IDENTIFIER } from "asn1-ts";
import readChildren from "../dit/readChildren";
import getRDN from "./getRDN";

// TODO: Accept neverDerefAliases, derefInSearching, derefFindingBaseObj, derefAlways

export
interface FindEntryOptions {
    readonly derefAliases: boolean;
}

export
interface FindEntryReturn {
    readonly result?: Entry;
    readonly matchedPrefix: DistinguishedName;
    readonly aliasDereferenced: boolean;
    readonly fallsWithinLocalContextPrefix: boolean;
    readonly verticesVisitedById: Set<number>;
    // loopDetected: boolean;
    // cacheMiss: boolean;
    // readonly continuationReferences: ContinuationReference[];
}

export
interface FindEntryState extends FindEntryReturn {
    readonly ctx: Context,
    readonly needleDN: DistinguishedName,
    readonly haystackRoot: DIT,
    readonly options?: Readonly<FindEntryOptions>;
}

// TODO: Loop detection

export
async function _findEntry (state: FindEntryState): Promise<FindEntryState> {
    const {
        ctx,
        needleDN,
        haystackRoot,
        options,
    } = state;
    const derefAliases = options?.derefAliases ?? true;
    // To minimize modification by reference.
    const needleRDN = getRDN(needleDN);
    if (!needleRDN) {
        return {
            ...state,
            matchedPrefix: getDistinguishedName(haystackRoot),
            aliasDereferenced: false,
        };
    }
    const haystackRDN = haystackRoot.rdn;
    const rdnMatched: boolean = compareRDN(
        needleRDN,
        haystackRDN,
        (attributeType: OBJECT_IDENTIFIER) => ctx.attributes.get(attributeType.toString())?.namingMatcher,
    );

    if (rdnMatched) {
        if (needleDN.length === 1) { // We are done searching.
            if (derefAliases) {
                return {
                    ...state,
                    result: haystackRoot.aliasedEntry
                        ? haystackRoot.aliasedEntry
                        : haystackRoot,
                    matchedPrefix: getDistinguishedName(haystackRoot),
                    aliasDereferenced: false,
                };
            } else {
                return {
                    ...state,
                    result: haystackRoot,
                    matchedPrefix: getDistinguishedName(haystackRoot),
                    aliasDereferenced: false,
                };
            }
        } else { // This RDN matched, but now we have to search its children.
            // derefAliases and no alias => recurse like normal
            // !derefAliases and no alias => recurse like normal
            // derefAliases and alias => deref, then recurse
            // !derefAliases and alias => return
            if (!derefAliases && haystackRoot.aliasedEntry) {
                return {
                    ...state,
                    matchedPrefix: getDistinguishedName(haystackRoot),
                };
            }
            const derefedHaystackRoot = haystackRoot.aliasedEntry
                ? haystackRoot.aliasedEntry
                : haystackRoot;
            const derefedHaystackRootChildren = await readChildren(ctx, derefedHaystackRoot);
            for (const child of derefedHaystackRootChildren) {
                const childResult = await _findEntry({
                    ...state,
                    needleDN: needleDN.slice(1),
                    haystackRoot: child,
                    aliasDereferenced: state.aliasDereferenced || Boolean(haystackRoot.aliasedEntry),
                });
                if (childResult.result) {
                    return childResult;
                }
            }
            return {
                ...state,
                matchedPrefix: getDistinguishedName(derefedHaystackRoot),
                aliasDereferenced: state.aliasDereferenced || Boolean(haystackRoot.aliasedEntry),
            };
        }
    } else { // It did not match.
        return {
            ...state,
            matchedPrefix: haystackRoot.parent
                ? getDistinguishedName(haystackRoot.parent)
                : [],
        };
    }
}

export
async function findEntry2 (
    ctx: Readonly<Context>,
    needleDN: DistinguishedName,
    haystackRoot: Readonly<DIT>,
    options?: FindEntryOptions,
): Promise<FindEntryReturn> {
    return _findEntry({
        ctx,
        needleDN,
        haystackRoot,
        options,
        aliasDereferenced: false,
        matchedPrefix: [],
        verticesVisitedById: new Set(),
        fallsWithinLocalContextPrefix: false,
    });
}

export default findEntry2;
