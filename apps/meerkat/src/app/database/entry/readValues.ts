import type {
    Context,
    Vertex,
    IndexableOID,
    Value,
    SpecialAttributeDatabaseReader,
} from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import attributeFromDatabaseAttribute from "../attributeFromDatabaseAttribute";
import readCollectiveValues from "./readCollectiveValues";
import getDistinguishedName from "../../x500/getDistinguishedName";
import type {
    ContextSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ContextSelection.ta";
import {
    id_soc_subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/id-soc-subschema.va";
import groupByOID from "../../utils/groupByOID";
import {
    TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import {
    ContextAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ContextAssertion.ta";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";
import getAttributeParentTypes from "../../x500/getAttributeParentTypes";
import evaluateContextAssertion from "@wildboar/x500/src/lib/utils/evaluateContextAssertion";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import getAttributeSubtypes from "../../x500/getAttributeSubtypes";
import getContextAssertionDefaults from "../../dit/getContextAssertionDefaults";
import { ResultAttribute } from "@wildboar/x500/src/lib/modules/ServiceAdministration/ResultAttribute.ta";

// TODO: Explore making this a temporalContext
const DEFAULT_CAD: ContextSelection = {
    allContexts: null,
};

export
interface ReadValuesOptions {
    readonly selection?: EntryInformationSelection;
    readonly relevantSubentries?: Vertex[];
    readonly operationContexts?: ContextSelection;
    readonly noSubtypeSelection?: boolean;
    readonly dontSelectFriends?: boolean;

    /**
     * This is used by service administrative areas to further constrain the
     * returned attribute types.
     */
    readonly outputAttributeTypes?: Map<IndexableOID, ResultAttribute>;
}

export
interface ReadValuesReturn {
    userValues: Value[];
    operationalValues: Value[];
    collectiveValues: Value[];
    // incompleteEntry: boolean;
    // derivedEntry: boolean; // If joins or families are used.
};

// EntryInformationSelection ::= SET {
//     attributes                     CHOICE {
//       allUserAttributes         [0]  NULL,
//       select                    [1]  SET OF AttributeType
//       -- empty set implies no attributes are requested -- } DEFAULT allUserAttributes:NULL,
//     infoTypes               [2]  INTEGER {
//       attributeTypesOnly        (0),
//       attributeTypesAndValues   (1)} DEFAULT attributeTypesAndValues,
//     extraAttributes                CHOICE {
//       allOperationalAttributes  [3]  NULL,
//       select                    [4]  SET SIZE (1..MAX) OF AttributeType } OPTIONAL,
//     contextSelection               ContextSelection OPTIONAL,
//     returnContexts                 BOOLEAN DEFAULT FALSE,
//     familyReturn                   FamilyReturn DEFAULT
//                                      {memberSelect contributingEntriesOnly} }

// ContextSelection ::= CHOICE {
//     allContexts       NULL,
//     selectedContexts  SET SIZE (1..MAX) OF TypeAndContextAssertion,
//     ... }

// TypeAndContextAssertion ::= SEQUENCE {
//     type               AttributeType,
//     contextAssertions  CHOICE {
//       preference         SEQUENCE OF ContextAssertion,
//       all                SET OF ContextAssertion,
//       ...},
//     ... }

/**
 * @summary Add friend attribute types to the selected attribute types
 * @description
 *
 * Note that this implementation DOES NOT recurse, because, per ITU
 * Recommendation X.501 (2016), Section 8.7:
 *
 * > If an anchor attribute A has a friend B, and B has a friend C, it cannot be
 * > deduced that C is a friend of A.
 *
 * Therefore, there is no need to determine the friends of the friends
 * recursively; a single sweep is sufficient.
 *
 * It is also important that friend resolution occurs _before_ subtype
 * resolution, because subtypes of friends are also friends.
 *
 * @param relevantSubentries The subentries whose subtree specification selects
 *  for the DSE indicated by the argument `vertex` in order of descending
 *  administrative point
 * @param selectedUserAttributes The set of dot-delimited object identifier
 *  strings of all attribute types that are selected
 * @param type_ The object identifier of the attribute type
 *
 * @function
 */
function addFriends (
    relevantSubentries: Vertex[],
    selectedUserAttributes: Set<IndexableOID>,
    type_: OBJECT_IDENTIFIER,
): void {
    const friendship = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(id_soc_subschema.toString()) && sub.dse.subentry)
        .sort((a, b) => {
            const adn = getDistinguishedName(a);
            const bdn = getDistinguishedName(b);
            return (bdn.length - adn.length);
        }) // Select the nearest subschema
        [0]?.dse.subentry!.friendships?.find((fr) => fr.anchor.isEqualTo(type_) && !fr.obsolete);
    if (friendship) {
        for (const friend of friendship.friends) {
            if (!selectedUserAttributes.has(friend.toString())) {
                selectedUserAttributes.add(friend.toString());
                // Keeping this in here, commented out, to show you that you SHALL NOT do this:
                // addFriends(relevantSubentries, selectedUserAttributes, friend);
            }
        }
    }
}

const ALL_ATTRIBUTE_TYPES: string = id_oa_allAttributeTypes.toString();

/**
 * @summary Evaluate all context assertions until a preference is determined
 * @description
 *
 * Converts "preference" assertions to "all" assertions of the preferred
 * context.
 *
 * @param ctx The context object
 * @param valuesOfSameType Values of the same attribute type
 * @param preference The context assertoins in order of decreasing preference
 * @returns The first `ContextAssertion` that matched, or `null` if none matched
 * @function
 */
function determinePreference (
    ctx: Context,
    valuesOfSameType: Value[],
    preference: ContextAssertion[],
): ContextAssertion | null {
    const contexts = valuesOfSameType
        .flatMap((value) => value.contexts ?? [])
        .map((context) => new X500Context(
            context.contextType,
            context.contextValues,
            context.fallback,
        ));
    for (const ca of preference) {
        const matched: boolean = evaluateContextAssertion(ca, contexts,
            (contextType: OBJECT_IDENTIFIER) => ctx.contextTypes.get(contextType.toString())?.matcher,
            (contextType: OBJECT_IDENTIFIER) => ctx.contextTypes.get(contextType.toString())?.absentMatch ?? false,
        );
        if (matched) {
            return ca;
        }
    }
    return null;
}

/**
 * @summary Filters values by context assertions
 * @description
 *
 * This function filters attribute values per context assertions.
 *
 * @param ctx The context object
 * @param values The values to be filtered
 * @param selectedContexts Index of `TypeAndContextAssertion` by attribute OIDs
 * @yields Values that survived the context assertions, if any.
 *
 * @generator
 * @function
 */
function *filterByTypeAndContextAssertion (
    ctx: Context,
    values: Value[],
    selectedContexts: Record<IndexableOID, TypeAndContextAssertion[]>,
): IterableIterator<Value> {
    for (const value of values) {
        // A ContextAssertion is true for a particular attribute value if:
        // ...the attribute value contains no contexts of the asserted contextType
        if (!(value.contexts) || value.contexts.length === 0) {
            yield value;
            continue;
        }
        // const TYPE_OID: string = value.type.toString();
        const typeAndContextAssertions = [
            // TYPE_OID, // This is already included from `getParentAttributeTypes()`
            ALL_ATTRIBUTE_TYPES,
            ...Array.from(getAttributeParentTypes(ctx, value.type)).map((oid) => oid.toString()),
        ]
            .flatMap((oid) => selectedContexts[oid] ?? []);
        if (typeAndContextAssertions.length === 0) {
            yield value; // There are no context assertions for this attribute type.
            continue;
        }
        const contexts = (value.contexts ?? []).map((c) => new X500Context(
            c.contextType,
            c.contextValues,
            c.fallback,
        ));
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
                continue; // Already handled.
            } else {
                continue;
            }
        }
        if (everyTacaMatched) {
            yield value;
        }
    }
}

let cachedUserAttributeDrivers: SpecialAttributeDatabaseReader[] | undefined;
let cachedOperationalAttributeDrivers: SpecialAttributeDatabaseReader[] | undefined;

/**
 * @summary Read the values of an entry
 * @description
 *
 * Reads the values of an entry, grouped into user values, operational values,
 * and collective values.
 *
 * This implementation handles:
 *
 * - Entry information selection
 * - Context assertions from:
 *   - The entry information selection
 *   - `operationContexts`
 *   - context assertion defaults
 * - Friendships
 * - `dontSelectFriends`
 * - `noSubtypeSelection`
 * - Collective attributes
 * - Search Rule Output Types and their context assertions
 *
 * @param ctx The context object
 * @param entry The DSE whose attributes are to be read
 * @param options Options
 * @returns The values, grouped into user, operational, and collective values
 *
 * @function
 * @async
 */
export
async function readValues (
    ctx: Context,
    entry: Vertex,
    options?: ReadValuesOptions,
): Promise<ReadValuesReturn> {
    const outputTypes = options?.outputAttributeTypes;
    const cads: TypeAndContextAssertion[] = options?.relevantSubentries
        ? await getContextAssertionDefaults(ctx, entry, options.relevantSubentries)
        : [];

    // Convert context values in search rule result attributes into context assertions.
    if (outputTypes) {
        for (const resultAttr of outputTypes.values()) {
            if (!resultAttr.contexts?.length) {
                continue; // If there are no contexts, move on.
            }
            const contexts = resultAttr.contexts;
            const contextsWithValues = contexts.filter((c) => c.contextValue?.length);
            if (contextsWithValues.length === 0) {
                continue;
            }
            /**
             * Note that we do not have to merge these contexts with the user
             * supplied contexts. This implementation can handle multiple
             * TACAs of the same attribute type, so we just add more TACAs.
             */
            cads.push(new TypeAndContextAssertion(
                resultAttr.attributeType,
                {
                    all: contexts
                        .filter((c) => c.contextValue?.length)
                        .map((c) => new ContextAssertion(
                            c.contextType,
                            c.contextValue ?? [],
                        )),
                },
            ));
        }
    }

    /**
     * EIS contexts > operationContexts > CAD subentries > locally-defined default > no context assertion.
     * Per ITU X.501 (2016), Section 8.9.2.2.
     */
    const contextSelection: ContextSelection = options?.selection?.contextSelection
        ?? options?.operationContexts
        ?? (cads.length
            ? {
                selectedContexts: cads,
            }
            : undefined)
        ?? DEFAULT_CAD;
    let selectedUserAttributes: Set<IndexableOID> | null = (
        options?.selection?.attributes
        && ("select" in options.selection.attributes)
    )
        ? new Set(options?.selection.attributes.select.map((oid) => oid.toString()))
        : null;

    if (outputTypes) {
        if (selectedUserAttributes) {
            for (const attr of selectedUserAttributes.values()) {
                if (!outputTypes.has(attr)) {
                    selectedUserAttributes.delete(attr);
                }
            }
        } else {
            selectedUserAttributes = new Set(outputTypes.keys());
        }
    }

    if (selectedUserAttributes && options?.relevantSubentries && !options?.dontSelectFriends) {
        for (const attr of Array.from(selectedUserAttributes.values() ?? [])) {
            addFriends(options.relevantSubentries, selectedUserAttributes, ObjectIdentifier.fromString(attr));
        }
    }
    let selectedOperationalAttributes: Set<IndexableOID> | null | undefined = options?.selection?.extraAttributes
        ? (("select" in options.selection.extraAttributes)
            ? new Set(options.selection.extraAttributes.select.map((oid) => oid.toString()))
            : null)
        : undefined;

    if (outputTypes) {
        if (selectedOperationalAttributes) {
            for (const attr of selectedOperationalAttributes.values()) {
                if (!outputTypes.has(attr)) {
                    selectedOperationalAttributes.delete(attr);
                }
            }
        } else if (selectedOperationalAttributes === null) {
            selectedOperationalAttributes = new Set(outputTypes.keys());
        }
    }

    if (selectedOperationalAttributes && options?.relevantSubentries && !options?.dontSelectFriends) {
        for (const attr of Array.from(selectedOperationalAttributes.values() ?? [])) {
            addFriends(options.relevantSubentries, selectedOperationalAttributes, ObjectIdentifier.fromString(attr));
        }
    }

    // We cache these so we do not have to recompute this every time an entry is read.
    if (!cachedUserAttributeDrivers || !cachedOperationalAttributeDrivers) {
        const uniqueAttributeTypes = Array.from(new Set(ctx.attributeTypes.values()));
        cachedUserAttributeDrivers = uniqueAttributeTypes
            .filter((spec) => (!spec.usage || (spec.usage === AttributeUsage_userApplications)) && spec.driver)
            .map((spec) => spec.driver!.readValues);
        cachedOperationalAttributeDrivers = uniqueAttributeTypes
            .filter((spec) => (spec.usage && (spec.usage !== AttributeUsage_userApplications)) && spec.driver)
            .map((spec) => spec.driver!.readValues)
    }

    const userAttributeReaderToExecute: SpecialAttributeDatabaseReader[] = selectedUserAttributes
        ? Array.from(selectedUserAttributes)
            .map((oid) => ctx.attributeTypes.get(oid)?.driver?.readValues)
            .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler)
        : cachedUserAttributeDrivers;

    const operationalAttributeReadersToExecute: SpecialAttributeDatabaseReader[] = (
        selectedOperationalAttributes !== undefined
    )
        ? ((selectedOperationalAttributes === null)
            ? cachedOperationalAttributeDrivers
            : Array.from(selectedOperationalAttributes)
                .map((oid) => ctx.attributeTypes.get(oid)?.driver?.readValues)
                .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler))
        : [];

    /**
     * This variable exists to avoid an unnecessary database query.
     */
    const allUserAttributesUseDrivers = (selectedUserAttributes?.size === userAttributeReaderToExecute.length);
    let userValues: Value[] = allUserAttributesUseDrivers
        ? []
        : (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.dse.id,
                type_oid: selectedUserAttributes
                    ? {
                        in: options?.noSubtypeSelection
                            ? Array.from(selectedUserAttributes).map((o) => ObjectIdentifier.fromString(o).toBytes())
                            : Array.from(selectedUserAttributes)
                                .flatMap((type_) => {
                                    const subtypes = getAttributeSubtypes(ctx, ObjectIdentifier.fromString(type_));
                                    return [
                                        ObjectIdentifier.fromString(type_).toBytes(),
                                        ...subtypes.map((st) => st.toBytes()),
                                    ];
                                }),
                    }
                    : undefined,
                operational: false,
            },
            select: {
                type_oid: true,
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
                ContextValue: (
                    contextSelection
                    || options?.selection?.returnContexts
                    // || ("selectedContexts" in contextSelection) // Why was this condition ever here?
                )
                    ? {
                        select: {
                            type: true,
                            ber: true,
                            fallback: true,
                        },
                    }
                    : undefined,
            },
            distinct: (options?.selection?.infoTypes === typesOnly)
                ? ["type_oid"]
                : undefined,
        })).map((a) => attributeFromDatabaseAttribute(ctx, a));

    /**
     * This variable exists to avoid an unnecessary database query.
     */
    const allOperationalAttributesUseDrivers = (
        selectedOperationalAttributes?.size === operationalAttributeReadersToExecute.length);
    let operationalValues: Value[] = (
        (selectedOperationalAttributes === undefined)
        || allOperationalAttributesUseDrivers
    )
        ? []
        : (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.dse.id,
                type_oid: selectedOperationalAttributes
                    ? {
                        in: options?.noSubtypeSelection
                            ? Array.from(selectedOperationalAttributes).map((o) => ObjectIdentifier.fromString(o).toBytes())
                            : Array.from(selectedOperationalAttributes)
                                .flatMap((type_) => {
                                    const subtypes = getAttributeSubtypes(ctx, ObjectIdentifier.fromString(type_));
                                    return [
                                        ObjectIdentifier.fromString(type_).toBytes(),
                                        ...subtypes.map((st) => st.toBytes()),
                                    ];
                                }),
                    }
                    : undefined,
                operational: true,
            },
            select: {
                type_oid: true,
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
            },
            distinct: (options?.selection?.infoTypes === typesOnly)
                ? ["type_oid"]
                : undefined,
        })).map((a) => attributeFromDatabaseAttribute(ctx, a)
    );

    for (const reader of userAttributeReaderToExecute) {
        try {
            userValues.push(...await reader(ctx, entry, options?.relevantSubentries));
        } catch (e) {
            continue;
        }
    }
    for (const reader of operationalAttributeReadersToExecute) {
        try {
            operationalValues.push(...await reader(ctx, entry, options?.relevantSubentries));
        } catch (e) {
            continue;
        }
    }

    /**
     * NOTE: Only an entry should have collective values. If collective values
     * are applied to a subentry, the subentry could have duplicated collective
     * values listed as both its collective values and user values.
     */
    let collectiveValues: Value[] = ((options?.relevantSubentries && entry.dse.entry && !entry.dse.subentry)
        ? await readCollectiveValues(ctx, entry, options?.relevantSubentries)
        : [])
            .filter((attr) => {
                if (!selectedUserAttributes) {
                    return true;
                }
                // Collective attributes cannot be operational attributes.
                return selectedUserAttributes.has(attr.type.toString());
            });

    if (outputTypes) {
        collectiveValues = collectiveValues.filter((v) => outputTypes.has(v.type.toString()));
    }

    const newAssertions: TypeAndContextAssertion[] = [];
    if ("selectedContexts" in contextSelection) {
        const valuesByType: Record<IndexableOID, Value[]> = groupByOID([
            ...userValues,
            ...operationalValues,
            ...collectiveValues,
        ], (value) => value.type);
        // This loop is just to handle TypeAndContextAssertion.[#].preference.
        const deselected: Set<IndexableOID> = new Set();
        for (const taca of contextSelection.selectedContexts) {
            if (!("preference" in taca.contextAssertions)) {
                continue;
            }
            const typeAndParentTypes = Array.from(getAttributeParentTypes(ctx, taca.type_));
            const types = [
                ...typeAndParentTypes,
                id_oa_allAttributeTypes,
            ];
            const relevantValues: Value[] = types.flatMap((type) => valuesByType[type.toString()] ?? []);
            const ca = determinePreference(ctx, relevantValues, taca.contextAssertions.preference);
            if (!ca) {
                deselected.add(taca.type_.toString());
                continue;
            }
            newAssertions.push(new TypeAndContextAssertion(
                taca.type_,
                {
                    all: [ ca ],
                },
            ));
        }
    }

    const selectedContexts = ("selectedContexts" in contextSelection)
        ? groupByOID<TypeAndContextAssertion>([
            ...contextSelection.selectedContexts,
            ...newAssertions,
        ], (c) => c.type_)
        : null;

    // TODO: Filter out non-permitted contexts
    if (selectedContexts) {
        userValues = Array.from(filterByTypeAndContextAssertion(ctx, userValues, selectedContexts));
        operationalValues = Array.from(filterByTypeAndContextAssertion(ctx, operationalValues, selectedContexts));
        collectiveValues = Array.from(filterByTypeAndContextAssertion(ctx, collectiveValues, selectedContexts));
    }

    if (!options?.selection?.returnContexts) {
        for (const attr of userValues) {
            delete attr.contexts;
        }
        for (const attr of operationalValues) {
            delete attr.contexts;
        }
        for (const attr of collectiveValues) {
            delete attr.contexts;
        }
    }

    return {
        userValues,
        operationalValues,
        collectiveValues,
    };
}

export default readValues;

