import type { ASN1Element, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type {
    AllowedAttributeAssignments,
    AllowedAttributeAssignments_Item_attributes_Item,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { Attribute } from "@wildboar/pki-stub";
import type { IndexableOID } from "../types/types.js";
import { GeneralNameTrie } from "../x500/GeneralNameTrie.js";
import { directoryStringToString, type EqualityMatcher } from "@wildboar/x500";
import { Context } from "@wildboar/x500/InformationFramework";
import {
    temporalContext,
    ldapAttributeOptionContext,
    localeContext,
    _encode_Period,
    languageContext,
} from "@wildboar/x500/SelectedAttributeTypes";
import { subHours } from "date-fns";
import { normalizePeriod } from "../x500/normalizePeriod.js";
import { DER } from "@wildboar/asn1/functional";
import { getDistinguishedValueKey } from "../x500/getDistinguishedValueKey.js";

// TODO: Move this to @wildboar/x500?
function* getContextValueKeys(
    contextType: OBJECT_IDENTIFIER,
    values: ASN1Element[],
): IterableIterator<string> {
    // This one needs normalization before comparison, because the same time may
    // be represented with different time zones, and time periods can be
    // represented in a lot of ways.
    if (contextType.isEqualTo(temporalContext["&id"])) {
        for (const v of values) {
            const ts = temporalContext.decoderFor["&Type"]!(v);
            let s = ts.notThisTime ? "1" : "0";
            if ("absolute" in ts.time) {
                const start = ts.time.absolute.startTime
                    ? subHours(ts.time.absolute.startTime, Number(ts.timeZone ?? 0))
                    : undefined;
                const end = ts.time.absolute.endTime
                    ? subHours(ts.time.absolute.endTime, Number(ts.timeZone ?? 0))
                    : undefined;
                const startstr = start?.toISOString() ?? "";
                const endstr = end?.toISOString() ?? "";
                s += `@${startstr} until ${endstr}`;
            } else if ("periodic" in ts.time) {
                s += `${Number(ts.timeZone ?? 0)}:`;
                const normalizedPeriodHexes = ts.time.periodic
                    .map((p) => _encode_Period(normalizePeriod(p), DER).toBytes())
                    .map((p) => Buffer.from(p.buffer, p.byteOffset, p.byteLength).toString("hex"))
                    .sort()
                    .join("%");
                s += `@${normalizedPeriodHexes}`;
            }
            // out.add(s);
            yield s;
        }
        return;
    }
    if (contextType.isEqualTo(ldapAttributeOptionContext["&id"])) {
        for (const v of values) {
            const opl = ldapAttributeOptionContext.decoderFor["&Type"]!(v)
                .map((s) => s.toLowerCase());
            const set = new Set(opl);
            const s = Array.from(set.values()).sort().join(";");
            yield s;
        }
        return;
    }
    if (contextType.isEqualTo(localeContext["&id"])) {
        for (const v of values) {
            const locale = localeContext.decoderFor["&Type"]!(v);
            if ("localeID1" in locale) {
                const s = "1:" + locale.localeID1.toString();
                yield s;
            } else if ("localeID2" in locale) {
                const ds = directoryStringToString(locale.localeID2);
                // The specification does NOT say that the strings are to be
                // compared case-insensitively, so we do not do that here.
                const s = "2:" + ds;
                yield s;
            }
        }
        return;
    }
    /* The syntax of languageContext allows for two-letter codes, but the
    comment next to it indicates that all values should be ISO 639-2 codes,
    which are always three letters long. I am not sure if this is for
    backwards compatibility with older implementations. The specification
    also says that two values are simply compared character-wise, mentioning no
    translation between language codes. As such, this implementation does not
    translate between code sets: it only normalizes to lowercase. */
    if (contextType.isEqualTo(languageContext["&id"])) {
        for (const v of values) {
            const lang = languageContext.decoderFor["&Type"]!(v);
            const s = lang.toLowerCase();
            yield s;
        }
        return;
    }
    // All other context types will be assumed to require byte-for-byte equality.
    for (const v of values) {
        const buf = v.toBytes();
        const s = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString("hex");
        yield s;
    }
    return;
}

// TODO: Move this to @wildboar/x500?
function matchContexts(
    allowed: Context[],
    presented: Context[],
    matchAllValues: boolean = false,
    matchAllTypes: boolean = false,
): boolean | undefined {
    const allowedByType: Map<IndexableOID, Context> = new Map();
    for (const ctx of allowed) {
        const key = ctx.contextType.toString();
        if (allowedByType.has(key)) {
            // Duplicate context types not allowed per ITU X.501 Section 8.8:
            // "All contexts in an attribute value's context list shall be of
            // distinct context types."
            return undefined;
        }
        allowedByType.set(ctx.contextType.toString(), ctx);
    }
    for (const presctx of presented) {
        const key = presctx.contextType.toString();
        const allowedctx = allowedByType.get(key);
        if (!allowedctx) {
            return false; // This context type is not explicitly allowed.
        }
        allowedByType.delete(key);
        const allowedFallback = allowedctx.fallback
            ?? Context._default_value_for_fallback;
        const presentedFallback = presctx.fallback
            ?? Context._default_value_for_fallback;
        if (allowedFallback !== presentedFallback) {
            return false; // Differing fallback.
        }
        const allowedKeys = new Set(getContextValueKeys(
            allowedctx.contextType,
            allowedctx.contextValues,
        ));
        const presentedKeys = new Set(getContextValueKeys(
            presctx.contextType,
            presctx.contextValues,
        ));
        for (const key of presentedKeys) {
            if (!allowedKeys.has(key)) {
                return false; // Differing context values.
            }
            allowedKeys.delete(key);
        }
        if (matchAllValues && allowedKeys.size > 0) {
            return false; // Not all allowed context values were presented.
        }
    }
    if (matchAllTypes && allowedByType.size > 0) {
        return false; // Not all allowed context types were presented.
    }
    return true; // No non-allowed context types or values found.
}

function useMatcherToCompareValues(
    allowed: Attribute,
    attr: Attribute,
    equalityMatcher: EqualityMatcher,
    getEqualityMatcher?: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean {
    for (const value of attr.values) {
        const matched: boolean = allowed.values.some((v) => {
            try {
                return equalityMatcher(value, v, getEqualityMatcher);
            } catch {
                return false;
            }
        });
        if (!matched) {
            return false;
        }
    }
    for (const vwc of attr.valuesWithContext ?? []) {
        const matchedContextless: boolean = allowed.values.some((v) => {
            try {
                return equalityMatcher(vwc.value, v, getEqualityMatcher);
            } catch {
                return false;
            }
        });
        if (matchedContextless) {
            continue; // An attribute value with any contexts is allowed. Pass.
        }
        // Otherwise, we have to check all of the allowed value
        const allowedVWCs = (allowed.valuesWithContext ?? [])
            .filter((avwc) => {
                try {
                    return equalityMatcher(vwc.value, avwc.value, getEqualityMatcher);
                } catch {
                    return false;
                }
            });
        const matchedWithContexts: boolean = allowedVWCs
            .some((avwc) => matchContexts(avwc.contextList, vwc.contextList, true, true));
        if (!matchedWithContexts) {
            return false; // No matching contexts.
        }
    }
    return true;
}

function useIndexingToCompareValues(
    allowed: Attribute,
    attr: Attribute,
): boolean {
    // TODO: Refactor this indexing code out.
    const allowedAndContextLists: Map<string, Context[]> = new Map();
    for (const value of allowed.valuesWithContext ?? []) {
        const key = getDistinguishedValueKey(allowed.type_, value.value);
        if (typeof key !== "string") {
            continue; // Malformed value: ignore it.
        }
        allowedAndContextLists.set(key, value.contextList);
    }
    for (const value of allowed.values) {
        const key = getDistinguishedValueKey(allowed.type_, value);
        if (typeof key !== "string") {
            continue; // Malformed value: ignore it.
        }
        allowedAndContextLists.set(key, []);
    }
    for (const value of attr.values) {
        const key = getDistinguishedValueKey(attr.type_, value);
        if (typeof key !== "string") {
            return false; // Malformed value.
        }
        const contextLists = allowedAndContextLists.get(key);
        if (!contextLists || (contextLists.length > 0)) {
            // Value not allowed, or it is missing required contexts.
            return false;
        }
    }
    for (const vwc of attr.valuesWithContext ?? []) {
        const key = getDistinguishedValueKey(attr.type_, vwc.value);
        if (typeof key !== "string") {
            return false; // Malformed value.
        }
        const contextLists = allowedAndContextLists.get(key);
        if (!contextLists) {
            // Value not allowed.
            return false;
        }
        if (contextLists.length === 0) {
            continue; // The value is allowed with any contexts.
        }
        const matchedWithContexts: boolean | undefined = matchContexts(
            contextLists,
            vwc.contextList,
            true,
            true,
        );
        if (!matchedWithContexts) {
            return false; // Missing required context values.
        }
    }
    return true;
}

function allValuesAllowed(
    allowed: Attribute,
    attr: Attribute,
    getEqualityMatcher?: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean {
    const allowedValuesCount: number = (
        allowed.values.length
        + (allowed.valuesWithContext?.length ?? 0)
    );
    if (allowedValuesCount === 0) {
        return false; // No allowed values.
    }
    const attrValuesCount: number = (
        attr.values.length
        + (attr.valuesWithContext?.length ?? 0)
    );
    // If `true`, comparing all values to all other values will run in O(n)
    // time or that there will not be too many where an O(n^2) time complexity
    // will not be a problem.
    const compareDirectly: boolean = (
        (attrValuesCount === 1)
        || (allowedValuesCount === 1)
        || ((attrValuesCount * allowedValuesCount) < 20)
    );
    if (compareDirectly && getEqualityMatcher) {
        const equalityMatcher = getEqualityMatcher(attr.type_);
        if (equalityMatcher) {
            // Since this will not suffer from O(n^2) complexity, we just use
            // nested loops in this case for better accuracy.
            const matched = useMatcherToCompareValues(
                allowed,
                attr,
                equalityMatcher,
                getEqualityMatcher,
            );
            if (!matched) {
                return false; // Value not allowed.
            }
        }
    }
    return useIndexingToCompareValues(allowed, attr);
}

export
function aaaIsImproperSubset (
    superset: AllowedAttributeAssignments,
    subset: AllowedAttributeAssignments,
): boolean | undefined { // TODO: I think you could have more informative return types here.
    const supersetTrie = new GeneralNameTrie<AllowedAttributeAssignments_Item_attributes_Item[]>();

    for (const s of superset) {
        if (!supersetTrie.setValue(s.holderDomain, s.attributes)) {
            return undefined; // There was a malformed GeneralName.
        }
    }

    for (const s of subset) {

        // TODO: I think you could refactor the section below into its own function.

        // TODO: I am not sure if the code below will handle the superset allowing all
        // holder domains under the root node correctly. Test this.
        /** The attributes allowed by the supposed superset. */
        const nodes = Array.from(supersetTrie.descendOptionalValues(s.holderDomain));
        if (nodes.length === 0) {
            return false; // Holder domain in subset is not even a name form used by the superset.
        }
        if (nodes.every((node) => node === undefined)) {
            // Holder domain has a name form used by the superset,
            // but no attribute assignments were authorized for this value
            // of this name form.
            return false;
        }
        const nodesWithAAAs = nodes.filter((node) => node !== undefined);
        const allowed = nodesWithAAAs.flat();
        const allowedTypes: Set<IndexableOID> = new Set();
        const allowedValues: Map<IndexableOID, Attribute> = new Map();
        for (const allowance of allowed) {
            if ("attributeType" in allowance) {
                allowedTypes.add(allowance.attributeType.toString());
            }
        }
        for (const allowance of allowed) {
            if ("attributeTypeandValues" in allowance) {
                const newAttr = allowance.attributeTypeandValues;
                const key = newAttr.type_.toString();
                /* If only specific values are allowed, the whole type becomes
                disallowed. */
                allowedTypes.delete(key);
                const existingAttr = allowedValues.get(key);
                if (existingAttr) {
                    /* There could be duplicate attribute values associated with
                    different levels in the holder domain. We have to merge
                    these attribute values to obtain the complete set of
                    attribute values allowed for this holder domain. */
                    const hasContexts = (
                        existingAttr.valuesWithContext?.length
                        || newAttr.valuesWithContext?.length
                    );
                    const mergedAttr = new Attribute(
                        newAttr.type_,
                        [
                            ...existingAttr.values,
                            ...newAttr.values,
                        ],
                        hasContexts
                            ? [
                                ...(existingAttr.valuesWithContext ?? []),
                                ...(newAttr.valuesWithContext ?? []),
                            ]
                            : undefined,
                    );
                    allowedValues.set(key, mergedAttr);
                } else {
                    allowedValues.set(key, newAttr);
                }
            }
        }

        // TODO: Check that each attribute of s
        for (const allowance of s.attributes) {
            if ("attributeType" in allowance) {
                const key = allowance.attributeType.toString();
                if (!allowedTypes.has(key)) {
                    return false; // Forbidden attribute type.
                }
            } else if ("attributeTypeandValues" in allowance) {
                const attr = allowance.attributeTypeandValues;
                const key = attr.type_.toString();
                if (allowedTypes.has(key)) {
                    // The whole type is allowed, so any subset of values is fine.
                    continue;
                }
                const allowedAttr = allowedValues.get(key);
                if (!allowedAttr) {
                    return false; // No attribute values were explicitly allowed by the superset.
                }
                if (!allValuesAllowed(allowedAttr, attr)) {
                    return false;
                }
            }
        }
    }

    /*
    One GeneralNameTrie<AllowedAttributeAssignments> is a subset of another IFF:

    Iterate over every node in the "subset" trie. All of the attributes in each
    node must be present in that node's analog (or one of its ancestors) in the
    "superset" trie.

    AllowedAttributeAssignments  ::=  SET OF SEQUENCE {
        attributes              [0]  SET OF CHOICE {
            attributeType           [0]  AttributeType,
            attributeTypeandValues  [1]  Attribute{{SupportedAttributes}},
            ... },
        holderDomain            [1]  GeneralName,
        ... }
    */

    // None of the `subset` items were a superset of the purported `superset`,
    // meaning that the purported `subset` is indeed an improper subset.
    return true;
}

export default aaaIsImproperSubset;
