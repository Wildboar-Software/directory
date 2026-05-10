import type { ASN1Element, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type {
    AllowedAttributeAssignments,
    AllowedAttributeAssignments_Item,
    AllowedAttributeAssignments_Item_attributes_Item as AAAAttrItem,
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
/**
 * @summary Convert context values to strings for efficient many-to-many comparisons.
 * @description
 * 
 * For a given context type, this function returns an iterable iterator of
 * string representations of context values having the property that two
 * matching context values will produce the same string. The purpose of this
 * is so that these strings can be indexed in a `Set` or `Map` for efficient
 * many-to-many comparisons, duplication checks, mapping to other data, etc.
 * 
 * This function does not handle errors that arise from decoding malformed
 * values.
 * 
 * This function has special handling for these context types:
 * 
 * - `temporalContext`: Time values need to be normalized before comparison,
 *   because the same time may be represented with different time zones, and
 *   time periods can be represented in a lot of ways.
 * - `ldapAttributeOptionContext`: LDAP attribute option values can appear in
 *   any order and with any casing, so we have to sort and case-normalize them
 *   before comparison.
 * - `localeContext`: It's too difficult to explain, but it needs normalization
 * - `languageContext`: The specification does not say to case-normalize, but I
 *   think it is maybe the right thing to do here.
 * 
 * All other context types are assumed to require byte-for-byte equality: in
 * these cases, the strings are simply the hex-encoded bytes of the value.
 * 
 * @param contextType The context type to get the value keys for.
 * @param values The values to get the keys for.
 * @returns An iterable iterator of the value keys.
 * @yields A string representation of the context value suitable for matching two
 *  context values.
 * 
 * @function
 */
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
/**
 * @summary Checks a list of contexts against those allowed
 * @description
 * 
 * This function checks if the `presented` contexts match the `allowed`
 * contexts. If a context type appears in `presented` but not in `allowed`,
 * then the function returns `false`. If `matchAllTypes` is `true`, then
 * all context types in `presented` must also appear in `allowed`: both
 * context lists must have the same types. If `matchAllValues` is `true`,
 * then, for a given context type present in both `allowed` and `presented`,
 * all values for that context in `allowed` must also appear in `presented`;
 * if `matchAllValues` is `false` or unset, the `presented` context may have
 * a subset of the values in the corresponding `allowed` context. In any
 * case, `fallback` must always match to return `true`.
 * 
 * @param allowed The context types and values that are allowed.
 * @param presented The context types and values that are being checked.
 * @param matchAllValues Whether all allowed context values are required to be present.
 * @param matchAllTypes Whether all allowed context types are required to be present.
 * @returns `true` if the presented context types and values are allowed,
 *  `false` if not, and `undefined` if the allowed context types or values are
 *  duplicated or malformed in some other way.
 * 
 * @function
 */
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

/**
 * @summary Compares values of an attribute to those allowed by a supposed superset.
 * 
 * This function compares values of an attribute to those allowed by a supposed
 * superset of allowed attribute assignments. This function does so by using a
 * given equality matcher to compare the attribute values to the allowed values.
 *
 * This function is only safe to use when you know that the `allowed` and
 * `attr` attributes have a small number of combinations of values; while this
 * function is more accurate than `useIndexingToCompareValues`, it is
 * vulnerable to denial-of-service attacks from larger user-supplied inputs.
 * 
 * Hence, this function should never be exposed in the public API.
 * 
 * This function handles errors thrown when attempting to decode or match
 * values. Values that decode incorrectly (or throw some other error when used
 * in a match) are effectively ignored.
 * 
 * If the superset specifies that an attribute value with contexts, all of its
 * context types and context values must be present to count as being allowed.
 * 
 * @param allowed The attribute whose values are allowed.
 * @param attr The attribute whose values are being checked.
 * @param equalityMatcher The equality matcher to use.
 * @param getEqualityMatcher An optional function to get the equality matcher for
 *  the attribute type.
 * @returns `true` if all values of the attribute are allowed, `false` if not.
 * 
 * @function
 */
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

/**
 * @summary Index all attribute values and their contexts
 * @description
 * 
 * Convert all attribute values to strings so that they can be used as keys
 * in a `Map`. This returned `Map` has the corresponding context lists for
 * these attribute values. If duplicate attribute values are found, those
 * without contexts override those with contexts.
 * 
 * @param allowed The attribute whose values are allowed.
 * @returns A map of attribute value keys to context lists.
 * 
 * @function
 */
function indexAllAllowedValues(allowed: Attribute): Map<string, Context[]> {
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
    return allowedAndContextLists;
}

/**
 * @summary Compares values of an attribute to those allowed by a supposed superset.
 * @description
 * 
 * This function compares values of an attribute to those allowed by a supposed
 * superset of allowed attribute assignments. This function does so by
 * converting all allowed values to strings and pre-indexing them to avoid
 * O(n^2) time complexity.
 * 
 * Malformed allowed values are ignored, but malformed attribute values are
 * treated as errors.
 * 
 * If the superset specifies that an attribute value with contexts, all of its
 * context types and context values must be present to count as being allowed.
 * 
 * @param allowed The attribute whose values are allowed.
 * @param attr The attribute whose values are being checked.
 * @returns `true` if all values of the attribute are allowed, `false` if not.
 * 
 * @function
 */
function useIndexingToCompareValues(
    allowed: Attribute,
    attr: Attribute,
): boolean {
    const allowedAndContextLists: Map<string, Context[]> = indexAllAllowedValues(allowed);
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

/**
 * @summary Determines if all values of an attribute are allowed.
 * @description
 * 
 * This function determines if all values of an attribute are allowed by a
 * supposed superset of allowed attribute assignments.
 * 
 * This function does not ensure that all allowed values are present.
 * 
 * @param allowed The attribute whose values are allowed.
 * @param attr The attribute whose values are being checked.
 * @param getEqualityMatcher An optional function to get the equality matcher for
 *  the attribute type.
 * @returns `true` if all values of the attribute are allowed, `false` if not.
 * 
 * @function
 */
export function checkIfAllValuesAreAllowed(
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
    // ...otherwise, to avoid O(n^2) complexity, we convert the attribute
    // values to strings and pre-index them.
    return useIndexingToCompareValues(allowed, attr);
}

/**
 * @summary Index all attribute types and values allowed by a supposed superset.
 * @description
 * 
 * Convert all attribute types and values to strings so that they can be used
 * as keys in a `Set` and `Map`. This returned `Set` has the attribute types
 * that are allowed and the returned `Map` has the attribute values allowed
 * for each attribute type.
 * 
 * @param allowed The attribute whose values are allowed.
 * @returns A set of attribute types that are allowed and a map of attribute
 *  types to their allowed values.
 * 
 * @function
 */
function indexAAAItems(
    allowed: AAAAttrItem[],
): [Set<IndexableOID>, Map<IndexableOID, Attribute>] {
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
    return [allowedTypes, allowedValues];
}

// TODO: Move to @wildboar/x500
/**
 * @summary Check if attributes comply with a list of allowed attribute types and values
 * @description
 * 
 * This function is intended for use with the `allowedAttributeAssignments`
 * X.509v3 extension to check if a list of attribute values comply with the
 * allowed attribute types and values.
 * 
 * @param allowed The attribute types and values allowed
 * @param attributes The presented attribute values
 * @returns `true` if all the presented attribute values are allowed, `false` if not.
 * 
 * @function
 */
export function checkAttributeAssignments(
    allowed: AAAAttrItem[],
    attributes: Attribute[],
): boolean {
    const [allowedTypes, allowedValues] = indexAAAItems(allowed);
    for (const attr of attributes) {
        const key = attr.type_.toString();
        if (allowedTypes.has(key)) {
            // The whole type is allowed, so any subset of values is fine.
            continue;
        }
        const allowedAttr = allowedValues.get(key);
        if (!allowedAttr) {
            return false; // No attribute values were explicitly allowed by the superset.
        }
        if (!checkIfAllValuesAreAllowed(allowedAttr, attr)) {
            return false;
        }
    }
    return true;
}

/**
 * @summary Determines if a single holder domain has an improper subset of allowed attribute assignments.
 * @param supersetTrie The trie of holder domains and the attribute assignments
 *  allowed to each of them.
 * @param aaaItem A single holder domain attribute assignment allowance to check.
 * @returns `true` if the attribute assignment allowance is an improper subset
 *  of the supposed superset, `false` if not.
 */
function checkIfHolderDomainIsImproperSubset(
    supersetTrie: GeneralNameTrie<AAAAttrItem[]>,
    aaaItem: AllowedAttributeAssignments_Item,
): boolean {
    /** The attributes allowed by the supposed superset. */
    const nodes = Array.from(supersetTrie.descendOptionalValues(aaaItem.holderDomain));
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
    const [allowedTypes, allowedValues] = indexAAAItems(allowed);
    for (const allowance of aaaItem.attributes) {
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
            if (!checkIfAllValuesAreAllowed(allowedAttr, attr)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * @summary Determines if a purported subset is an improper subset of a supposed superset.
 * @description
 * 
 * This function determines if a purported subset of allowed attribute
 * assignments is an improper subset of a supposed superset of them. The
 * purpose of this function is for comparing two values of the
 * `allowedAttributeAssignments` X.509v3 extension to ensure that an
 * Attribute Authority (AA) has not illicitly authorized a subordinate AA to
 * assign attributes that the issuer itself cannot assign; this is done by
 * checking that the subject AA's `allowedAttributeAssignments` is a subset of
 * the issuer AA's `allowedAttributeAssignments`.
 * 
 * One AAA value is a subset of another if and only if each holder domain in
 * the list has an improper subset of all AAA values granted by the superset.
 * So we index the superset into a trie of holder domains and what attribute
 * types and values are authorized beneath each vertex, then we iterate over
 * each holder domain in the subset and check if it only contains allowed
 * attributes, given where it falls in the trie.
 * 
 * @param superset The supposed superset of the purported subset.
 * @param subset The purported subset of the supposed superset.
 * @returns `true` if the purported subset is an improper subset of the
 *  supposed superset, `false` if not, and `undefined` in the case of a
 *  malformed `GeneralName`.
 * 
 * @function
 */
export
function aaaIsImproperSubset (
    superset: AllowedAttributeAssignments,
    subset: AllowedAttributeAssignments,
): boolean | undefined { // TODO: I think you could have more informative return types here.
    const supersetTrie = new GeneralNameTrie<AAAAttrItem[]>();
    for (const s of superset) {
        if (!supersetTrie.setValue(s.holderDomain, s.attributes)) {
            return undefined; // There was a malformed GeneralName.
        }
    }

    for (const s of subset) {
        const isHolderDomainCompliant = checkIfHolderDomainIsImproperSubset(
            supersetTrie,
            s,
        );
        if (!isHolderDomainCompliant) {
            return false;
        }
    }

    // None of the `subset` items were a superset of the purported `superset`,
    // meaning that the purported `subset` is indeed an improper subset.
    return true;
}

export default aaaIsImproperSubset;
