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
import type {
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
 *  for the target DSE, in order of descending administrative point
 * @param selectedUserAttributes
 * @param type_
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

// Converts "preference" assertions to "all" assertions of the preferred context.
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

function *filterByTypeAndContextAssertion (
    ctx: Context,
    values: Value[],
    selectedContexts: Record<IndexableOID, TypeAndContextAssertion[]> | null,
): IterableIterator<Value> {
    if (!selectedContexts) {
        yield *values;
        return;
    }
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
    const cads: TypeAndContextAssertion[] = options?.relevantSubentries
        ? getContextAssertionDefaults(ctx, entry, options.relevantSubentries)
        : [];
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
    const selectedUserAttributes: Set<IndexableOID> | null = (
        options?.selection?.attributes
        && ("select" in options.selection.attributes)
    )
        ? new Set(options?.selection.attributes.select.map((oid) => oid.toString()))
        : null;
    if (selectedUserAttributes && options?.relevantSubentries && !options?.dontSelectFriends) {
        for (const attr of Array.from(selectedUserAttributes.values() ?? [])) {
            addFriends(options.relevantSubentries, selectedUserAttributes, ObjectIdentifier.fromString(attr));
        }
    }
    const selectedOperationalAttributes: Set<IndexableOID> | null | undefined = options?.selection?.extraAttributes
        ? (("select" in options.selection.extraAttributes)
            ? new Set(options.selection.extraAttributes.select.map((oid) => oid.toString()))
            : null)
        : undefined;
    if (selectedOperationalAttributes && options?.relevantSubentries && !options?.dontSelectFriends) {
        for (const attr of Array.from(selectedOperationalAttributes.values() ?? [])) {
            addFriends(options.relevantSubentries, selectedOperationalAttributes, ObjectIdentifier.fromString(attr));
        }
    }
    let userAttributes: Value[] = await Promise.all(
        (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.dse.id,
                type: selectedUserAttributes
                    ? {
                        in: options?.noSubtypeSelection
                            ? Array.from(selectedUserAttributes)
                            : Array.from(selectedUserAttributes)
                                .flatMap((type_) => {
                                    const subtypes = getAttributeSubtypes(ctx, ObjectIdentifier.fromString(type_));
                                    return [
                                        type_,
                                        ...subtypes.map((st) => st.toString()),
                                    ];
                                }),
                    }
                    : undefined,
                operational: false,
            },
            select: {
                type: true,
                ber: true,
                ContextValue: (
                    contextSelection
                    || options?.selection?.returnContexts
                    // || ("selectedContexts" in contextSelection) // Why was this condition ever here?
                )
                    ? {
                        select: {
                            type: true,
                            ber: true,
                        },
                    }
                    : undefined,
            },
            distinct: (options?.selection?.infoTypes === typesOnly)
                ? ["type"]
                : undefined,
        }))
            .map((a) => attributeFromDatabaseAttribute(ctx, a)),
    );

    let operationalAttributes: Value[] = (selectedOperationalAttributes === undefined)
        ? []
        : await Promise.all(
            (await ctx.db.attributeValue.findMany({
                where: {
                    entry_id: entry.dse.id,
                    type: selectedOperationalAttributes
                        ? {
                            in: options?.noSubtypeSelection
                                ? Array.from(selectedOperationalAttributes)
                                : Array.from(selectedOperationalAttributes)
                                    .flatMap((type_) => {
                                        const subtypes = getAttributeSubtypes(ctx, ObjectIdentifier.fromString(type_));
                                        return [
                                            type_,
                                            ...subtypes.map((st) => st.toString()),
                                        ];
                                    }),
                        }
                        : undefined,
                    operational: true,
                },
                select: {
                    type: true,
                    ber: true,
                },
                distinct: (options?.selection?.infoTypes === typesOnly)
                    ? ["type"]
                    : undefined,
            }))
                .map((a) => attributeFromDatabaseAttribute(ctx, a)),
    );

    const uniqueAttributeTypes = Array.from(new Set(ctx.attributeTypes.values()));

    const userAttributeReaderToExecute: SpecialAttributeDatabaseReader[] = selectedUserAttributes
        ? Array.from(selectedUserAttributes)
            .map((oid) => ctx.attributeTypes.get(oid)?.driver?.readValues)
            .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler)
        : uniqueAttributeTypes
            .filter((spec) => (!spec.usage || (spec.usage === AttributeUsage_userApplications)) && spec.driver)
            .map((spec) => spec.driver!.readValues);
    const operationalAttributeReadersToExecute: SpecialAttributeDatabaseReader[] = (
        selectedOperationalAttributes !== undefined
    )
        ? ((selectedOperationalAttributes === null)
            ? uniqueAttributeTypes
                .filter((spec) => (spec.usage && (spec.usage !== AttributeUsage_userApplications)) && spec.driver)
                .map((spec) => spec.driver!.readValues)
            : Array.from(selectedOperationalAttributes)
                .map((oid) => ctx.attributeTypes.get(oid)?.driver?.readValues)
                .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler))
        : [];

    for (const reader of userAttributeReaderToExecute) {
        try {
            userAttributes.push(...await reader(ctx, entry, options?.relevantSubentries));
        } catch (e) {
            continue;
        }
    }
    for (const reader of operationalAttributeReadersToExecute) {
        try {
            operationalAttributes.push(...await reader(ctx, entry, options?.relevantSubentries));
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
        ? readCollectiveValues(ctx, entry, options?.relevantSubentries)
        : [])
            .filter((attr) => {
                if (!selectedUserAttributes) {
                    return true;
                }
                // Collective attributes cannot be operational attributes.
                return selectedUserAttributes.has(attr.type.toString());
            });

    const newAssertions: TypeAndContextAssertion[] = [];
    if ("selectedContexts" in contextSelection) {
        const valuesByType: Record<IndexableOID, Value[]> = groupByOID([
            ...userAttributes,
            ...operationalAttributes,
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

    userAttributes = Array.from(filterByTypeAndContextAssertion(ctx, userAttributes, selectedContexts));
    operationalAttributes = Array.from(filterByTypeAndContextAssertion(ctx, operationalAttributes, selectedContexts));
    collectiveValues = Array.from(filterByTypeAndContextAssertion(ctx, collectiveValues, selectedContexts));

    if (!options?.selection?.returnContexts) {
        userAttributes = userAttributes.map((value) => ({
            ...value,
            contexts: undefined,
        }));
        operationalAttributes = operationalAttributes.map((value) => ({
            ...value,
            contexts: undefined,
        }));
        collectiveValues = collectiveValues.map((value) => ({
            ...value,
            contexts: undefined,
        }));
    }

    return {
        userValues: userAttributes,
        operationalValues: operationalAttributes,
        collectiveValues,
    };
}

export default readValues;

