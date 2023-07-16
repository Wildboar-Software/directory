import type { Context, IndexableOID, Value, Vertex } from "@wildboar/meerkat-types";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import {
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { BERElement, OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import getDistinguishedName from "../x500/getDistinguishedName";
import { compareDistinguishedName, dnWithinSubtreeSpecification, evaluateContextAssertion, groupByOID, objectClassesWithinRefinement } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { UnitOfReplication } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UnitOfReplication.ta";
import {
    IncrementalStepRefresh, SubordinateChanges,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/IncrementalStepRefresh.ta";
import {
    ClassAttributeSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ClassAttributeSelection.ta";
import {
    getAttributeTypeFromEntryModification,
} from "../x500/getAttributeTypeFromEntryModification";
import { AttributeUsage_userApplications } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    ContextSelection, TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ContextSelection.ta";
import valuesFromAttribute from "../x500/valuesFromAttribute";
import attributesFromValues from "../x500/attributesFromValues";
import { Attribute } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute.ta";
import { ALL_ATTRIBUTE_TYPES, MAX_TRAVERSAL } from "../constants";
import getAttributeParentTypes from "../x500/getAttributeParentTypes";
import { ContentChange, ContentChange_rename } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ContentChange.ta";
import { EntryModification } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import getSDSEContent, { mandatoryReplicatedAttributeTypesSet } from "../disp/getSDSEContent";
import { DistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/DistinguishedName.ta";
import readSubordinates from "../dit/readSubordinates";
import { LocalName } from "@wildboar/x500/src/lib/modules/InformationFramework/LocalName.ta";
import isPrefix from "../x500/isPrefix";
import { nonSpecificKnowledge, specificKnowledge } from "@wildboar/x500/src/lib/collections/attributes";
import { child } from "@wildboar/x500/src/lib/collections/objectClasses";


/**
 * @summary Filters values by context assertions
 * @description
 *
 * This function filters attribute values per context assertions.
 *
 * @param ctx The context object
 * @param attr The attribute to be filtered
 * @param selectedContexts Index of `TypeAndContextAssertion` by attribute OIDs
 * @param filteredTypes A mutable set of string-form OIDs of attribute types
 *  that were filtered out due to these context assertions.
 * @yields Values that survived the context assertions, if any.
 *
 * @generator
 * @function
 */
function filterByTypeAndContextAssertion (
    ctx: Context,
    attr: Attribute,
    selectedContexts: Record<IndexableOID, TypeAndContextAssertion[]> | null,
    filteredTypes: Set<IndexableOID>,
): Attribute {
    if (!selectedContexts) {
        return attr;
    }
    const values = valuesFromAttribute(attr);
    const ret: Value[] = [];
    const typeAndContextAssertions = [
        // TYPE_OID, // This is already included from `getParentAttributeTypes()`
        ALL_ATTRIBUTE_TYPES,
        ...Array.from(getAttributeParentTypes(ctx, attr.type_)).map((oid) => oid.toString()),
    ]
        .flatMap((oid) => selectedContexts[oid] ?? []);
    // If there are no assertions for this type, just return it.
    if (typeAndContextAssertions.length === 0) {
        return attr;
    }
    for (const value of values) {
        // A ContextAssertion is true for a particular attribute value if:
        // ...the attribute value contains no contexts of the asserted contextType
        if (!(value.contexts) || value.contexts.length === 0) {
            ret.push(value);
            continue;
        }
        const contexts = value.contexts;
        let everyTacaMatched: boolean = true;
        for (const taca of typeAndContextAssertions) {
            if ("all" in taca.contextAssertions) {
                const match = taca.contextAssertions.all.every((ca): boolean => evaluateContextAssertion(
                    ca,
                    contexts,
                    (contextType: OBJECT_IDENTIFIER) => ctx.contextTypes.get(contextType.toString())?.matcher,
                    (contextType: OBJECT_IDENTIFIER) => ctx.contextTypes.get(contextType.toString())?.absentMatch ?? false,
                ));
                if (!match) {
                    everyTacaMatched = false;
                    break;
                }
            } else if ("preference" in taca.contextAssertions) {
                /* DEVIATION: This is not specified in X.525. If the context assertion is
                of the `preference` variant, we check that ANY context assertion
                matches the value. This is because the preference will change as
                values are added and removed. */
                const match = taca.contextAssertions.preference.some((ca): boolean => evaluateContextAssertion(
                    ca,
                    contexts,
                    (contextType: OBJECT_IDENTIFIER) => ctx.contextTypes.get(contextType.toString())?.matcher,
                    (contextType: OBJECT_IDENTIFIER) => ctx.contextTypes.get(contextType.toString())?.absentMatch ?? false,
                ));
                if (!match) {
                    everyTacaMatched = false;
                    break;
                }
            } else {
                continue;
            }
        }
        if (everyTacaMatched) {
            ret.push(value);
        } else {
            filteredTypes.add(value.type.toString());
        }
    }
    return attributesFromValues(ret)[0];
}

/**
 *
 * Because of where this function gets called, you do not need to worry about
 * the context prefix, base, or minimum. Only maximum, chops, and refinement
 * matter for this function.
 *
 * @param ctx
 * @param vertex
 * @param agreement
 * @param localName
 * @returns
 */
export
async function getIncrementallyAddedSubtree (
    ctx: Context,
    vertex: Vertex,
    agreement: ShadowingAgreementInfo,
    localName: LocalName,
): Promise<IncrementalStepRefresh> {
    const spexs = agreement.shadowSubject.area.replicationArea.specificExclusions ?? [];
    let chop_after: boolean = false;
    const namingMatcher = getNamingMatcherGetter(ctx);
    for (const chop of spexs) {
        let chopBefore: boolean = true;
        let chopName: LocalName = [];
        if ("chopBefore" in chop) {
            chopName = chop.chopBefore;
            chopBefore = true;
        } else if ("chopAfter" in chop) {
            chopName = chop.chopAfter;
        }
        if (compareDistinguishedName(chopName, localName, namingMatcher)) {
            if (chopBefore) {
                // We return an incremental refresh that gets pruned.
                return new IncrementalStepRefresh(undefined, undefined);
            }
            chop_after = true;
            break;
        }
    }
    const max = Number(agreement.shadowSubject.area.replicationArea.maximum ?? MAX_TRAVERSAL);
    const depth = localName.length;
    const subordinates = (chop_after || (depth >= max))
        ? []
        : await readSubordinates(ctx, vertex);
    const subordinateChanges: SubordinateChanges[] = await Promise.all(
        subordinates
        .map(async (sub) => new SubordinateChanges(
            sub.dse.rdn,
            await getIncrementallyAddedSubtree(ctx, sub, agreement, [ ...localName, sub.dse.rdn ]),
        )),
    );
    const prunedSubordinateChanges = subordinateChanges
        .filter((sc) => (sc.changes.sDSEChanges || sc.changes.subordinateUpdates?.length));
    const refinement = agreement.shadowSubject.area.replicationArea.specificationFilter;
    const withinRefinement: boolean = refinement
        ? objectClassesWithinRefinement(Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString), refinement)
        : true;
    return new IncrementalStepRefresh(
        withinRefinement
            ? {
                add: await getSDSEContent(ctx, vertex, agreement),
            }
            : undefined,
        prunedSubordinateChanges.length > 0
            ? prunedSubordinateChanges
            : undefined,
    );
}

export
type Change = { add: Attribute[] }
    | { remove: null }
    | { modify: EntryModification[] }
    | {
        rename: ContentChange_rename,
        oldDN: DistinguishedName,
        oldImmediateSuperior: Vertex,
    };

/**
 * The fourth element returned in the tuple, if present, is the _effective_
 * immediate superior. If a rename operation is used and an entry that is
 * formerly outside of the shadow subtree is moved into it, the new immediate
 * superior must be used to create the path of SubordinateChanges leading up to
 * the actual incremental change; otherwise, the old immediate superior must be
 * used.
 *
 * @param ctx
 * @param vertex
 * @param change
 * @returns
 */
export
async function getShadowIncrementalSteps (
    ctx: Context,
    vertex: Vertex,
    change: Change,
): Promise<[ number, number, IncrementalStepRefresh, Vertex? ][]> {
    const dse_ids: number[] = [];
    /* If the entry was renamed, we need to consider the SOBs that were superior
    to the old entry as well. */
    if (("rename" in change)) {
        let current: Vertex | undefined = change.oldImmediateSuperior;
        while (current) {
            dse_ids.push(current.dse.id);
            current = current.immediateSuperior;
        }
    }
    let current: Vertex | undefined = vertex;
    while (current) {
        dse_ids.push(current.dse.id);
        current = current.immediateSuperior;
    }

    const now = new Date();
    const sobs = await ctx.db.operationalBinding.findMany({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            entry_id: {
                in: dse_ids,
            },
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            OR: [
                {
                    validity_end: null,
                },
                {
                    validity_end: {
                        gte: now,
                    },
                },
            ],
        },
        select: {
            id: true,
            binding_identifier: true,
            agreement_ber: true,
        },
    });
    const ret: [ number, number, IncrementalStepRefresh, Vertex? ][] = [];
    for (const sob of sobs) {
        const el = new BERElement();
        el.fromBytes(sob.agreement_ber);
        const agreement = _decode_ShadowingAgreementInfo(el);
        const cp_dn = agreement.shadowSubject.area.contextPrefix;
        /**
         * This is named "newDN" to emphasize that, if this vertex has been
         * through a modifyDN operation, its name is already changed by this
         * point.
         */
        const newDN = getDistinguishedName(vertex);
        const objectClasses = Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString);
        const subtree = agreement.shadowSubject.area.replicationArea;
        const NAMING_MATCHER = getNamingMatcherGetter(ctx);
        const subordinates = agreement.shadowSubject.subordinates ?? UnitOfReplication._default_value_for_subordinates;
        const extKnowledge = agreement.shadowSubject.knowledge?.extendedKnowledge;
        let refresh!: IncrementalStepRefresh;
        const oldDN = ("rename" in change)
            ? change.oldDN
            : newDN;
        let selectingSubordinateInfo: boolean = false;
        let selectingOnlyExtKnowledge: boolean = false;
        if (!dnWithinSubtreeSpecification(oldDN, objectClasses, subtree, cp_dn, NAMING_MATCHER)) {
            /**
             * If the old DN was not within the shadow subtree, but the new one
             * is, we treat the entry as being "added," and we must recursively
             * do so for its subordinates as well.
             */
            if (
                ("rename" in change)
                && dnWithinSubtreeSpecification(newDN, objectClasses, subtree, cp_dn, NAMING_MATCHER)
            ) {
                const base_dn = agreement.shadowSubject.area.replicationArea.base
                    ? [ ...cp_dn, ...agreement.shadowSubject.area.replicationArea.base ]
                    : cp_dn;
                const localName = newDN.slice(base_dn.length);
                const refresh = await getIncrementallyAddedSubtree(ctx, vertex, agreement, localName);
                ret.push([ sob.id, sob.binding_identifier, refresh, vertex.immediateSuperior ]);
            }

            // If we are selecting subordinates or extended knowledge, and this DSE qualifies...
            if (
                (subordinates || extKnowledge)
                && (vertex.dse.subr || vertex.dse.nssr)
                && isPrefix(ctx, cp_dn, oldDN)
            ) {
                if (extKnowledge) {
                    selectingOnlyExtKnowledge = true;
                } else {
                    selectingSubordinateInfo = true;
                }
            } else {
                continue;
            }
        }

        if (vertex.dse.familyMember && vertex.dse.objectClass.has(child["&id"].toString())) {
            /* ITU Recommendation X.501 (2019), Section 12.3.5 states that:
            "If a family member is excluded from a subtree by this specification,
            all its subordinate family members are also excluded."

            In this case, this means that we have to recurse up the DIT,
            checking that each superior also falls within the subtree. */
            let current = vertex.immediateSuperior;
            let currentDN = oldDN.slice(0, -1);
            let ancestorExcluded: boolean = false;
            let i: number = 0;
            while (current && (i < 100_000)) {
                i++;
                const currentObjectClasses = Array.from(current.dse.objectClass).map(ObjectIdentifier.fromString);
                if (!dnWithinSubtreeSpecification(currentDN, currentObjectClasses, subtree, cp_dn, NAMING_MATCHER)) {
                    ancestorExcluded = true;
                    break;
                }
                if (!current.dse.objectClass.has(child["&id"].toString())) {
                    break;
                }
                current = current.immediateSuperior;
                currentDN = currentDN.slice(0, -1);
            }
            if (i === 100_000) {
                console.error("BUG: Would have looped infinitely while determining whether to include family member in shadow. Please report this to: https://github.com/Wildboar-Software/directory/issues");
                continue;
            }
            if (ancestorExcluded) {
                continue;
            }
        }

        // NOTE: operational attributes should be in `include`.
        let all_user_attributes: boolean = false;
        const inclusions: Set<IndexableOID> = new Set();
        const exclusions: Set<IndexableOID> = new Set();
        // TODO: Convert `preference` selections into separate selections?
        const contextSelection: ContextSelection | undefined = agreement.shadowSubject.contextSelection;
        const selectedContexts = contextSelection && ("selectedContexts" in contextSelection)
            ? groupByOID<TypeAndContextAssertion>(contextSelection.selectedContexts, (c) => c.type_)
            : null;
        const attValIncomplete: Set<IndexableOID> = new Set();
        if ("add" in change) {
            refresh = new IncrementalStepRefresh(
                {
                    add: await getSDSEContent(
                        ctx,
                        vertex,
                        agreement,
                        selectingOnlyExtKnowledge,
                        selectingSubordinateInfo,
                        agreement.shadowSubject.knowledge?.knowledgeType,
                    ),
                },
                undefined,
            );
        }
        else if ("remove" in change) {
            refresh = new IncrementalStepRefresh(
                {
                    remove: null,
                },
                undefined,
            );
        }
        else if ("rename" in change) {
            // TODO: Make sure vertex has the old DN. Rename names the new DN.
            const sdse_content = await getSDSEContent(ctx, vertex, agreement);
            refresh = new IncrementalStepRefresh(
                {
                    modify: new ContentChange(
                        change.rename,
                        undefined,
                        sdse_content.sDSEType,
                        sdse_content.subComplete,
                        sdse_content.attComplete,
                        sdse_content.attValIncomplete,
                    ),
                },
                undefined,
            );
        }
        else if ("modify" in change) {
            for (const class_attrs of agreement.shadowSubject.attributes) {
                const attrs = class_attrs.classAttributes ?? ClassAttributeSelection._default_value_for_classAttributes;

                // The fact that objectClass contains superclasses implicitly satisfies
                // the application of the attribute selection to subclasses.
                const applies: boolean = !class_attrs.class_ || vertex.dse.objectClass.has(class_attrs.class_.toString());
                if (!applies) {
                    continue;
                }
                if ("allAttributes" in attrs) {
                    all_user_attributes = true;
                }
                else if ("include" in attrs) {
                    for (const x of attrs.include) {
                        const KEY: string = x.toString();
                        inclusions.add(KEY);
                        exclusions.delete(KEY);
                    }
                }
                else if ("exclude" in attrs) {
                    for (const x of attrs.exclude) {
                        exclusions.add(x.toString());
                    }
                }
                else {
                    // TODO:
                }
            }
            const attr_mods = change.modify
                .filter((a) => {
                    const type_ = getAttributeTypeFromEntryModification(a);
                    if (!type_) {
                        return false;
                    }
                    if (selectingOnlyExtKnowledge) {
                        return (
                            !type_.isEqualTo(specificKnowledge["&id"])
                            && !type_.isEqualTo(nonSpecificKnowledge["&id"])
                        );
                    }
                    const KEY = type_.toString();
                    if (exclusions.has(KEY)) {
                        return false;
                    }
                    return (
                        inclusions.has(KEY)
                        || (
                            all_user_attributes
                            && (ctx.attributeTypes.get(KEY)?.usage === AttributeUsage_userApplications)
                        )
                        /* DEVIATION: The spec says that just "access control,
                        timestamps, and knowledge" do not have to be explicitly
                        included, but things like administrative roles and
                        password administration attributes are still necessary
                        too. */
                        || mandatoryReplicatedAttributeTypesSet.has(KEY)
                    );
                })
                .map((mod) => {
                    let attr: Attribute | undefined;
                    if ("addAttribute" in mod) {
                        attr = mod.addAttribute;
                    }
                    if ("removeAttribute" in mod) {
                        return mod;
                    }
                    if ("addValues" in mod) {
                        attr = mod.addValues;
                    }
                    if ("removeValues" in mod) {
                        attr = mod.removeValues;
                    }
                    if ("alterValues" in mod) {
                        return mod;
                    }
                    if ("resetValue" in mod) {
                        return mod;
                    }
                    if ("replaceValues" in mod) {
                        attr = mod.replaceValues;
                    }
                    if (attr) {
                        attr = filterByTypeAndContextAssertion(ctx, attr, selectedContexts, attValIncomplete);
                        if ("addAttribute" in mod) {
                            return {
                                addAttribute: attr,
                            };
                        }
                        if ("addValues" in mod) {
                            return {
                                addValues: attr,
                            };
                        }
                        if ("removeValues" in mod) {
                            return {
                                removeValues: attr,
                            };
                        }
                        if ("replaceValues" in mod) {
                            return {
                                replaceValues: attr,
                            };
                        }
                    }
                    return mod;
                });
            if (attr_mods.length === 0) {
                continue;
            }
            const sdse_content = await getSDSEContent(ctx, vertex, agreement);
            refresh = new IncrementalStepRefresh(
                {
                    modify: new ContentChange(
                        undefined,
                        {
                            changes: attr_mods,
                        },
                        sdse_content.sDSEType,
                        sdse_content.subComplete,
                        (attValIncomplete.size > 0) || ((sdse_content.attValIncomplete?.length ?? 0) > 0),
                        Array.from(attValIncomplete).map(ObjectIdentifier.fromString),
                    ),
                },
                undefined,
            );
        }
        ret.push([ sob.id, sob.binding_identifier, refresh ]);
    }
    return ret;
}
