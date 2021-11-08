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
    contextAssertionSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import {
    id_soc_subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/id-soc-subschema.va";

const CAD_SUBENTRY: string = contextAssertionSubentry["&id"].toString();
// TODO: Explore making this a temporalContext
const DEFAULT_CAD: ContextSelection = {
    allContexts: null,
};

export
interface ReadEntryAttributesReturn {
    userAttributes: Value[];
    operationalAttributes: Value[];
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

// This is so friends of friends, recursively, can be added.
function addFriends (
    relevantSubentries: Vertex[],
    selectedUserAttributes: Set<IndexableOID>,
    type_: OBJECT_IDENTIFIER,
): void {
    const friendship = relevantSubentries
        .filter((sub) => (
            sub.dse.objectClass.has(id_soc_subschema.toString())
            && sub.dse.subentry?.friendships
        ))
        .sort((a, b) => {
            const adn = getDistinguishedName(a);
            const bdn = getDistinguishedName(b);
            return (bdn.length - adn.length);
        }) // Select the nearest subschema
        [0]?.dse.subentry!.friendships?.find((fr) => fr.anchor.isEqualTo(type_));
    if (friendship) {
        for (const friend of friendship.friends) {
            if (!selectedUserAttributes.has(friend.toString())) {
                addFriends(relevantSubentries, selectedUserAttributes, friend);
            }
        }
    }
}

export
async function readValues (
    ctx: Context,
    entry: Vertex,
    eis?: EntryInformationSelection,
    relevantSubentries?: Vertex[],
    operationContexts?: ContextSelection,
): Promise<ReadEntryAttributesReturn> {
    const cadSubentries: Vertex[] = relevantSubentries
        ?.filter((subentry) => (
            subentry.dse.subentry
            && subentry.dse.objectClass.has(CAD_SUBENTRY)
            && subentry.dse.subentry?.contextAssertionDefaults?.length
        )) ?? [];
    /**
     * EIS contexts > operationContexts > CAD subentries > locally-defined default > no context assertion.
     * Per ITU X.501 (2016), Section 8.9.2.2.
     */
    const contextSelection: ContextSelection = eis?.contextSelection
        ?? operationContexts
        ?? (cadSubentries.length
            ? {
                selectedContexts: cadSubentries
                    .flatMap((subentry) => subentry.dse.subentry!.contextAssertionDefaults!),
            }
            : undefined)
        ?? DEFAULT_CAD;
    const selectedUserAttributes: Set<IndexableOID> | null = (eis?.attributes && ("select" in eis.attributes))
        ? new Set(eis.attributes.select.map((oid) => oid.toString()))
        : null;
    if (selectedUserAttributes && relevantSubentries) {
        for (const attr of Array.from(selectedUserAttributes ?? [])) {
            addFriends(relevantSubentries, selectedUserAttributes, ObjectIdentifier.fromString(attr));
        }
    }
    const selectedOperationalAttributes: Set<IndexableOID> | null | undefined = eis?.extraAttributes
        ? (("select" in eis.extraAttributes)
            ? new Set(eis.extraAttributes.select.map((oid) => oid.toString()))
            : null)
        : undefined;
    if (selectedOperationalAttributes && relevantSubentries) {
        for (const attr of Array.from(selectedOperationalAttributes ?? [])) {
            addFriends(relevantSubentries, selectedOperationalAttributes, ObjectIdentifier.fromString(attr));
        }
    }
    const operationalAttributes: Value[] = [];
    // TODO: I feel like this could be optimized to query fewer attributes.
    const userAttributes: Value[] = await Promise.all(
        (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.dse.id,
                type: selectedUserAttributes
                    ? {
                        in: Array.from(selectedUserAttributes),
                    }
                    : undefined,
            },
            include: {
                ContextValue: (contextSelection || ("selectedContexts" in contextSelection))
                    ? {
                        select: {
                            type: true,
                            ber: true,
                        },
                    }
                    : undefined,
            },
            distinct: (eis?.infoTypes === typesOnly)
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
        // : Array.from(userAttributeDatabaseReaders.values());
        : uniqueAttributeTypes
            .filter((spec) => (!spec.usage || (spec.usage === AttributeUsage_userApplications)) && spec.driver)
            .map((spec) => spec.driver!.readValues);
    const operationalAttributeReadersToExecute: SpecialAttributeDatabaseReader[] = (
        selectedOperationalAttributes !== undefined
    )
        ? ((selectedOperationalAttributes === null)
            // ? Array.from(operationalAttributeDatabaseReaders.values())
            ? uniqueAttributeTypes
                .filter((spec) => (spec.usage && (spec.usage !== AttributeUsage_userApplications)) && spec.driver)
                .map((spec) => spec.driver!.readValues)
            : Array.from(selectedOperationalAttributes)
                .map((oid) => ctx.attributeTypes.get(oid)?.driver?.readValues)
                .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler))
        : [];

    for (const reader of userAttributeReaderToExecute) {
        try {
            userAttributes.push(...await reader(ctx, entry, relevantSubentries));
        } catch (e) {
            continue;
        }
    }
    for (const reader of operationalAttributeReadersToExecute) {
        try {
            operationalAttributes.push(...await reader(ctx, entry, relevantSubentries));
        } catch (e) {
            continue;
        }
    }

    /**
     * NOTE: Only an entry should have collective values. If collective values
     * are applied to a subentry, the subentry could have duplicated collective
     * values listed as both its collective values and user values.
     */
    const collectiveValues: Value[] = ((relevantSubentries && entry.dse.entry && !entry.dse.subentry)
        ? readCollectiveValues(ctx, entry, relevantSubentries)
        : [])
            .filter((attr) => {
                if (!selectedUserAttributes) {
                    return true;
                }
                // Collective attributes cannot be operational attributes.
                return selectedUserAttributes.has(attr.type.toString());
            });

    // FIXME: Fully implement this!
    return {
        userAttributes,
        operationalAttributes,
        collectiveValues,
    };
}

export default readValues;
