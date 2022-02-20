import type { OBJECT_IDENTIFIER } from "asn1-ts";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import type {
    Filter,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import type {
    FilterItem,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FilterItem.ta";
import type {
    ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";

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

export
function filterItemCanBeUsedInShadowedArea (
    item: FilterItem,
    agreement: ShadowingAgreementInfo,
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

    const allInAll: boolean = agreement.shadowSubject.attributes
        .some((attr) => (
            (attr.class_ === undefined)
            && (
                !attr.classAttributes
                || ("allAttributes" in attr.classAttributes)
            )
        ));

    const allInSome: boolean = agreement.shadowSubject.attributes
        .some((attr) => (
            !attr.classAttributes
            || ("allAttributes" in attr.classAttributes)
        ));

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

// This will remain undocumented for now, since it is very likely to change.
// As this function is extremely complicated, it is almost impossible to get it
// correct, and this is almost GUARANTEED to be incorrect.
// For this reason, the response will err "false."
export
function filterCanBeUsedInShadowedArea (
    filter: Filter,
    agreement: ShadowingAgreementInfo,
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
        return filterItemCanBeUsedInShadowedArea(filter.item, agreement, applicableObjectClasses);
    } else if ("and" in filter) {
        const newObjectClasses = filter.and
            .map((sub) => (
                ("item" in sub)
                && ("equality" in sub.item)
                && (sub.item.equality.type_.isEqualTo(id_at_objectClass))
                && sub.item.equality.assertion.objectIdentifier
            ))
            .filter((oid: false | OBJECT_IDENTIFIER): oid is OBJECT_IDENTIFIER => !!oid);
        return filter.and.every((sub) => filterCanBeUsedInShadowedArea(sub, agreement, newObjectClasses));
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
        return filter.or.every((sub) => filterCanBeUsedInShadowedArea(sub, agreement, newObjectClasses));
    } else if ("not" in filter) {
        // This is intentionally NOT inverted.
        return filterCanBeUsedInShadowedArea(filter.not, agreement, applicableObjectClasses);
    } else {
        return false;
    }
}

export default filterCanBeUsedInShadowedArea;
