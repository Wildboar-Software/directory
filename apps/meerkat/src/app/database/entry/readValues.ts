import type {
    Context,
    Vertex,
    IndexableOID,
    Value,
    SpecialAttributeDatabaseReader,
} from "../../types";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
import attributeFromDatabaseAttribute from "../attributeFromDatabaseAttribute";

// Special Attributes
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";

// Attribute Adders
import * as readers from "../specialAttributeValueReaders";

const userAttributeDatabaseReaders: Map<IndexableOID, SpecialAttributeDatabaseReader> = new Map([
    [ objectClass["&id"]!.toString(), readers.readObjectClass ],
]);

const operationalAttributeDatabaseReaders: Map<IndexableOID, SpecialAttributeDatabaseReader> = new Map([
    [ administrativeRole["&id"]!.toString(), readers.readAdministrativeRole ],
    [ subtreeSpecification["&id"]!.toString(), readers.readSubtreeSpecification ],
    [ accessControlScheme["&id"]!.toString(), readers.readAccessControlScheme ],
    // [ id_aca_entryACI.toString(), writeEntryACI ],
    // [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    // [ id_aca_subentryACI.toString(), writeSubentryACI ],
]);

export
interface ReadEntryAttributesReturn {
    userAttributes: Value[];
    operationalAttributes: Value[];
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

export
async function readValues (
    ctx: Context,
    entry: Vertex,
    eis?: EntryInformationSelection,
): Promise<ReadEntryAttributesReturn> {
    const selectedUserAttributes: Set<IndexableOID> | null = (eis?.attributes && ("select" in eis.attributes))
        ? new Set(eis.attributes.select.map((oid) => oid.toString()))
        : null;
    const selectedOperationalAttributes: Set<IndexableOID> | null | undefined = eis?.extraAttributes
        ? (("select" in eis.extraAttributes)
            ? new Set(eis.extraAttributes.select.map((oid) => oid.toString()))
            : null)
        : undefined;
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
                ContextValue: (
                    Boolean(eis?.returnContexts)
                    || Boolean(eis?.contextSelection && ("selectedContexts" in eis.contextSelection))
                )
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

    const userAttributeReaderToExecute: SpecialAttributeDatabaseReader[] = selectedUserAttributes
        ? Array.from(selectedUserAttributes)
            .map((oid) => userAttributeDatabaseReaders.get(oid))
            .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler)
        : Object.values(userAttributeDatabaseReaders);
    const operationalAttributeReadersToExecute: SpecialAttributeDatabaseReader[] = (
        selectedOperationalAttributes !== undefined
    )
        ? ((selectedOperationalAttributes === null)
            ? Object.values(operationalAttributeDatabaseReaders)
            : Array.from(selectedOperationalAttributes)
                .map((oid) => operationalAttributeDatabaseReaders.get(oid))
                .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler))
        : [];

    for (const reader of userAttributeReaderToExecute) {
        userAttributes.push(...await reader(ctx, entry));
    }
    for (const reader of operationalAttributeReadersToExecute) {
        operationalAttributes.push(...await reader(ctx, entry));
    }

    // FIXME: Fully implement this!
    return {
        userAttributes,
        operationalAttributes,
    };
}

export default readValues;

