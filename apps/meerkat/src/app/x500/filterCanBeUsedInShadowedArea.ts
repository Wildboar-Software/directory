import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    id_at_objectClass,
} from "@wildboar/x500/InformationFramework";
import type {
    Filter,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    FilterItem,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    ShadowingAgreementInfo,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/InformationFramework";
import { Context, IndexableOID } from "@wildboar/meerkat-types";
import { ClassAttributeSelection } from "@wildboar/x500/DirectoryShadowAbstractService";
import getAncestorObjectClasses from "./getAncestorObjectClasses.js";
import { ALL_USER_ATTRIBUTES_KEY } from "../constants.js";

/**
 * @summary Determine whether an attribute type may be used in a shadowed area
 * @description
 *
 * This function determines whether a given attribute may be created, modified,
 * or deleted within a shadowed area, on accordance with the shadowing agreement
 * that corresponds to that particular shadowed area.
 *
 * @param type_ The attribute type whose usage is in question
 * @param agreement The shadowing agreement
 * @param allInSome Whether any attribute selection in the shadowing agreement allowed all user attributes
 * @param explicitlyIncluded Whether the attribute was explicitly included
 * @param explicitlyExcluded Whether the attribute was explicitly excluded
 * @returns A boolean indicating whether the type can be used in a shadowed area
 *
 * @function
 */
export
function typeCanBeUsedInShadowedArea (
    type_: OBJECT_IDENTIFIER,
    agreement: ShadowingAgreementInfo,
    allInSome: boolean,
    explicitlyIncluded: Set<string>,
    explicitlyExcluded: Set<string>,
): boolean {
    return (
        (
            explicitlyIncluded.has(type_.toString())
            || (allInSome && !explicitlyExcluded.has(type_.toString()))
        )
        && (
            // Either
            !agreement.shadowSubject.contextSelection // ... no contexts asserted, or
            || ("allContexts" in agreement.shadowSubject.contextSelection) // ... all contexts asserted, or
            || ( // ... no relevant contexts asserted.
                ("selectedContexts" in agreement.shadowSubject.contextSelection)
                && (
                    !agreement.shadowSubject.contextSelection.selectedContexts
                        .some((sc) => (
                            sc.type_.isEqualTo(type_)
                            || sc.type_.isEqualTo(id_oa_allAttributeTypes)
                        ))
                )
            )
        )
    );
}

/**
 * @summary Determine whether a filter item can be evaluated against shadowed information
 * @description
 *
 * This function determines whether the shadowed information is sufficient to
 * correctly and authoritatively answer the query presented by a filter item.
 *
 * @param ctx The context object
 * @param item The filter object whose usage is in question
 * @param agreement The shadowing agreement
 * @param includedUserAttributes The set of included user attributes, mutated by reference
 * @param excludedUserAttributes The set of excluded user attributes, mutated by reference
 * @param applicableObjectClasses The set of applicable object classes
 * @returns A boolean indicating whether the filter item can be satisfied by the shadowed information
 *
 * @function
 */
export
function filterItemCanBeUsedInShadowedArea (
    ctx: Context,
    item: FilterItem,
    agreement: ShadowingAgreementInfo,
    includedUserAttributes: Set<IndexableOID>,
    excludedUserAttributes: Set<IndexableOID>,
    applicableObjectClasses?: OBJECT_IDENTIFIER[], // Object classes found in the same AND or OR set.
): boolean {
    const objectClasses: Set<string> = new Set(
        applicableObjectClasses?.map((aoc) => aoc.toString()),
    );
    const applicableAttributeSelections = (objectClasses.size === 0)
        ? agreement.shadowSubject.attributes
        : agreement.shadowSubject.attributes
            .filter((asel) => (
                !asel.class_
                || objectClasses.has(asel.class_.toString())
            ));

    /**
     * The reason this variable is necessary is that, if an attribute type is
     * explicitly excluded, we don't want to immediately delete it from the
     * includedUserAttributes set, because there might have been another
     * subfilter that included it. We wait until the end of this function to
     * merge the locally-included attributes with the includedUserAttributes.
     */
    const localIncludedAttrs: Set<IndexableOID> = new Set();
    let allInAll: boolean = false;
    let allInSome: boolean = false;
    for (const attr_sel of agreement.shadowSubject.attributes) {
        const selected = attr_sel.classAttributes
            ?? ClassAttributeSelection._default_value_for_classAttributes;
        if (!("allAttributes" in selected)) {
            continue;
        }
        if (attr_sel.class_) {
            allInSome = true;
            for (const oc of getAncestorObjectClasses(ctx, attr_sel.class_.toString())) {
                const oc_spec = ctx.objectClasses.get(oc);
                for (const attr of oc_spec?.mandatoryAttributes.values() ?? []) {
                    localIncludedAttrs.add(attr);
                }
                for (const attr of oc_spec?.optionalAttributes.values() ?? []) {
                    localIncludedAttrs.add(attr);
                }
            }
        } else {
            includedUserAttributes.add(ALL_USER_ATTRIBUTES_KEY);
            allInAll = true; // FIXME: Shouldn't all-in-all set all-in-some?
        }
    }

    const explicitlyExcluded: Set<string> = new Set(
        applicableAttributeSelections
            .flatMap((sel) => {
                if (!(
                    sel.classAttributes
                    && ("exclude" in sel.classAttributes)
                    && (sel.classAttributes.exclude.length > 0)
                )) {
                    return [];
                }
                return sel.classAttributes.exclude.map((attr) => attr.toString());
            }),
    );

    const explicitlyIncluded: Set<string> = new Set(
        applicableAttributeSelections
            .flatMap((sel) => {
                if (!(
                    sel.classAttributes
                    && ("include" in sel.classAttributes)
                    && (sel.classAttributes.include.length > 0)
                )) {
                    return [];
                }
                return sel.classAttributes.include.map((attr) => attr.toString());
            }),
    );


    for (const exc of explicitlyExcluded.values()) {
        // Include has priority, so you don't need to check exclude.
        // (Exclude only has priority over all attributes.)
        localIncludedAttrs.delete(exc);
        excludedUserAttributes.add(exc);
    }
    // Include has priority, so it comes AFTER exclude.
    for (const inc of explicitlyIncluded.values()) {
        localIncludedAttrs.add(inc);
        excludedUserAttributes.delete(inc);
    }
    for (const attr of localIncludedAttrs) {
        includedUserAttributes.add(attr);
    }

    // If we're selecting all contexts and all attributes for all classes, and
    // there are no exclusions to override, the filter will always work.
    if (
        allInAll
        && (
            !agreement.shadowSubject.contextSelection
            || ("allContexts" in agreement.shadowSubject.contextSelection)
        )
        && (explicitlyExcluded.size === 0)
    ) {
        return true;
    }

    if ("equality" in item) {
        return typeCanBeUsedInShadowedArea(
            item.equality.type_,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else if ("substrings" in item) {
        return typeCanBeUsedInShadowedArea(
            item.substrings.type_,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else if ("greaterOrEqual" in item) {
        return typeCanBeUsedInShadowedArea(
            item.greaterOrEqual.type_,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else if ("lessOrEqual" in item) {
        return typeCanBeUsedInShadowedArea(
            item.lessOrEqual.type_,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else if ("present" in item) {
        return typeCanBeUsedInShadowedArea(
            item.present,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else if ("approximateMatch" in item) {
        return typeCanBeUsedInShadowedArea(
            item.approximateMatch.type_,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else if ("extensibleMatch" in item) {
        if (!item.extensibleMatch.type_) {
            return false;
        }
        return typeCanBeUsedInShadowedArea(
            item.extensibleMatch.type_,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else if ("contextPresent" in item) {
        return typeCanBeUsedInShadowedArea(
            item.contextPresent.type_,
            agreement,
            allInSome,
            explicitlyIncluded,
            explicitlyExcluded,
        );
    }
    else {
        return false;
    }
}

/**
 * @summary Determine whether a filter can be evaluated against shadowed information
 * @description
 *
 * This function determines whether the shadowed information is sufficient to
 * correctly and authoritatively answer the query presented by a filter.
 *
 * @param ctx The context object
 * @param filter The filter whose usage is in question
 * @param agreement The shadowing agreement
 * @param includedUserAttributes The set of included user attributes, mutated by reference
 * @param excludedUserAttributes The set of excluded user attributes, mutated by reference
 * @param applicableObjectClasses The applicable object classes
 * @returns A boolean, indicating whether the filter is suitable for use with the shadowed information
 *
 * @function
 */
export
function filterCanBeUsedInShadowedArea (
    ctx: Context,
    filter: Filter,
    agreement: ShadowingAgreementInfo,
    includedUserAttributes: Set<IndexableOID>,
    excludedUserAttributes: Set<IndexableOID>,
    applicableObjectClasses?: OBJECT_IDENTIFIER[],
): boolean {
    const objectClasses: Set<string> = new Set(
        applicableObjectClasses?.map((aoc) => aoc.toString()),
    );
    const applicableAttributeSelections = (objectClasses.size === 0)
        ? agreement.shadowSubject.attributes
        : agreement.shadowSubject.attributes
            .filter((asel) => (
                !asel.class_
                || objectClasses.has(asel.class_.toString())
            ));

    const allInAll: boolean = applicableAttributeSelections
        .some((attr) => (
            (attr.class_ === undefined)
            && (
                !attr.classAttributes
                || ("allAttributes" in attr.classAttributes)
            )
        ));

    const someExclusions: boolean = applicableAttributeSelections
        .some((sel) => (
            sel.classAttributes
            && ("exclude" in sel.classAttributes)
            && (sel.classAttributes.exclude.length > 0)
        ));

    // If we're selecting all contexts and all attributes for all classes, and
    // there are no exclusions to override, the filter will always work.
    if (
        allInAll
        && (
            !agreement.shadowSubject.contextSelection
            || ("allContexts" in agreement.shadowSubject.contextSelection)
        )
        && !someExclusions
    ) {
        return true;
    }

    if ("item" in filter) {
        return filterItemCanBeUsedInShadowedArea(
            ctx,
            filter.item,
            agreement,
            includedUserAttributes,
            excludedUserAttributes,
            applicableObjectClasses,
        );
    } else if ("and" in filter) {
        const newObjectClasses = filter.and
            .map((sub) => (
                ("item" in sub)
                && ("equality" in sub.item)
                && (sub.item.equality.type_.isEqualTo(id_at_objectClass))
                && sub.item.equality.assertion.objectIdentifier
            ))
            .filter((oid: false | OBJECT_IDENTIFIER): oid is OBJECT_IDENTIFIER => !!oid);
        return filter.and.every((sub) => filterCanBeUsedInShadowedArea(
            ctx,
            sub,
            agreement,
            includedUserAttributes,
            excludedUserAttributes,
            newObjectClasses,
        ));
    } else if ("or" in filter) {
        const newObjectClasses = filter.or
            .map((sub) => (
                ("item" in sub)
                && ("equality" in sub.item)
                && (sub.item.equality.type_.isEqualTo(id_at_objectClass))
                && sub.item.equality.assertion.objectIdentifier
            ))
            .filter((oid: false | OBJECT_IDENTIFIER): oid is OBJECT_IDENTIFIER => !!oid);
        // This is intentionally .every().
        return filter.or.every((sub) => filterCanBeUsedInShadowedArea(
            ctx,
            sub,
            agreement,
            includedUserAttributes,
            excludedUserAttributes,
            newObjectClasses,
        ));
    } else if ("not" in filter) {
        // This is intentionally NOT inverted.
        return filterCanBeUsedInShadowedArea(
            ctx,
            filter.not,
            agreement,
            includedUserAttributes,
            excludedUserAttributes,
            applicableObjectClasses,
        );
    } else {
        return false;
    }
}

export default filterCanBeUsedInShadowedArea;
