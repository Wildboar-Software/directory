import type {
    Context,
    Vertex,
    IndexableOID,
    Value,
    SpecialAttributeDatabaseReader,
} from "../../types";
import { ObjectIdentifier } from "asn1-ts";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
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

// Special Attributes
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { createTimestamp } from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";
import { modifyTimestamp } from "@wildboar/x500/src/lib/modules/InformationFramework/modifyTimestamp.oa";
import { creatorsName } from "@wildboar/x500/src/lib/modules/InformationFramework/creatorsName.oa";
import { modifiersName } from "@wildboar/x500/src/lib/modules/InformationFramework/modifiersName.oa";
import { pwdStartTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa";
import { pwdExpiryTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryTime.oa";
import { pwdEndTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEndTime.oa";
import { pwdFails } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa";
import { pwdFailureTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
import { pwdGracesUsed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGracesUsed.oa";
// import { userPwdHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
// import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa";
import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa";
import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa";
import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa";
// import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";
// import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa";
import { pwdDictionaries } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa";
import { pwdExpiryWarning } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryWarning.oa";
import { pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGraces.oa";
import { pwdFailureDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
import { pwdLockoutDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdLockoutDuration.oa";
import { pwdMaxFailures } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxFailures.oa";
import { pwdMaxTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxTimeInHistory.oa";
import { pwdMinTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinTimeInHistory.oa";
import { pwdHistorySlots } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdHistorySlots.oa";
import { pwdRecentlyExpiredDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdRecentlyExpiredDuration.oa";
// import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";
import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { uniqueIdentifier } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uniqueIdentifier.oa";
import { dITStructureRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import { nameForms } from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import { dITContentRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import { objectClasses } from "@wildboar/x500/src/lib/modules/SchemaAdministration/objectClasses.oa";
import { attributeTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/attributeTypes.oa";
import { friends } from "@wildboar/x500/src/lib/modules/SchemaAdministration/friends.oa";
import { contextTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/contextTypes.oa";
import { dITContextUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
import { matchingRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRules.oa";
import { matchingRuleUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRuleUse.oa";
import { ldapSyntaxes } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/ldapSyntaxes.oa";
import { governingStructureRule } from "@wildboar/x500/src/lib/modules/SchemaAdministration/governingStructureRule.oa";
import { structuralObjectClass } from "@wildboar/x500/src/lib/modules/SchemaAdministration/structuralObjectClass.oa";
import { subschemaSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/subschemaSubentryList.oa";

// Attribute Adders
import * as readers from "../specialAttributeValueReaders";
import { OBJECT_IDENTIFIER } from "asn1-ts";

const CAD_SUBENTRY: string = contextAssertionSubentry["&id"].toString();
// TODO: Explore making this a temporalContext
const DEFAULT_CAD: ContextSelection = {
    allContexts: null,
};

const userAttributeDatabaseReaders: Map<IndexableOID, SpecialAttributeDatabaseReader> = new Map([
    [ objectClass["&id"]!.toString(), readers.readObjectClass ],
    [ userPwd["&id"]!.toString(), readers.readUserPwd ],
    [ userPassword["&id"]!.toString(), readers.readUserPassword ],
    [ uniqueIdentifier["&id"].toString(), readers.readUniqueIdentifier ], // Has significance for Basic Access Control
]);

const operationalAttributeDatabaseReaders: Map<IndexableOID, SpecialAttributeDatabaseReader> = new Map([
    [ createTimestamp["&id"]!.toString(), readers.readCreateTimestamp ],
    [ modifyTimestamp["&id"]!.toString(), readers.readModifyTimestamp ],
    [ creatorsName["&id"]!.toString(), readers.readCreatorsName ],
    [ modifiersName["&id"]!.toString(), readers.readModifiersName ],
    [ administrativeRole["&id"]!.toString(), readers.readAdministrativeRole ],
    [ subtreeSpecification["&id"]!.toString(), readers.readSubtreeSpecification ],
    [ accessControlScheme["&id"]!.toString(), readers.readAccessControlScheme ],

    // [ id_aca_entryACI.toString(), writeEntryACI ],
    // [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    // [ id_aca_subentryACI.toString(), writeSubentryACI ],

    [ pwdStartTime["&id"]!.toString(), readers.readPwdStartTime ],
    [ pwdExpiryTime["&id"]!.toString(), readers.readPwdExpiryTime ],
    [ pwdEndTime["&id"]!.toString(), readers.readPwdEndTime ],
    [ pwdFails["&id"]!.toString(), readers.readPwdFails ],
    [ pwdFailureTime["&id"]!.toString(), readers.readPwdFailureTime ],
    [ pwdGracesUsed["&id"]!.toString(), readers.readPwdGracesUsed ],
    // [ userPwdHistory["&id"]!.toString(), readers.readUserPwdHistory ],
    // [ userPwdRecentlyExpired["&id"]!.toString(), readers.readUserPwdRecentlyExpired ],
    [ pwdModifyEntryAllowed["&id"]!.toString(), readers.readPwdModifyEntryAllowed ],
    [ pwdChangeAllowed["&id"]!.toString(), readers.readPwdChangeAllowed ],
    [ pwdMaxAge["&id"]!.toString(), readers.readPwdMaxAge ],
    [ pwdExpiryAge["&id"]!.toString(), readers.readPwdExpiryAge ],
    [ pwdMinLength["&id"]!.toString(), readers.readPwdMinLength ],
    // [ pwdVocabulary["&id"]!.toString(), readers.readPwdVocabulary ],
    // [ pwdAlphabet["&id"]!.toString(), readers.readPwdAlphabet ],
    [ pwdDictionaries["&id"]!.toString(), readers.readPwdDictionaries ],
    [ pwdExpiryWarning["&id"]!.toString(), readers.readPwdExpiryWarning ],
    [ pwdGraces["&id"]!.toString(), readers.readPwdGraces ],
    [ pwdFailureDuration["&id"]!.toString(), readers.readPwdFailureDuration ],
    [ pwdLockoutDuration["&id"]!.toString(), readers.readPwdLockoutDuration ],
    [ pwdMaxFailures["&id"]!.toString(), readers.readPwdMaxFailures ],
    [ pwdMaxTimeInHistory["&id"]!.toString(), readers.readPwdMaxTimeInHistory ],
    [ pwdMinTimeInHistory["&id"]!.toString(), readers.readPwdMinTimeInHistory ],
    [ pwdHistorySlots["&id"]!.toString(), readers.readPwdHistorySlots ],
    [ pwdRecentlyExpiredDuration["&id"]!.toString(), readers.readPwdRecentlyExpiredDuration ],
    // [ pwdEncAlg["&id"]!.toString(), readers.readPwdEncAlg ],

    [ userPwd["&id"]!.toString(), readers.readUserPwd ],
    [ userPassword["&id"]!.toString(), readers.readUserPassword ],

    [ uniqueIdentifier["&id"].toString(), readers.readUniqueIdentifier ], // Has significance for Basic Access Control

    [ dITStructureRules["&id"].toString(), readers.readDITStructureRules ],
    [ nameForms["&id"].toString(), readers.readNameForms ],
    [ dITContentRules["&id"].toString(), readers.readDITContentRules ],
    [ objectClasses["&id"].toString(), readers.readObjectClasses ],
    [ attributeTypes["&id"].toString(), readers.readAttributeTypes ],
    [ friends["&id"].toString(), readers.readFriends ],
    [ contextTypes["&id"].toString(), readers.readContextTypes ],
    [ dITContextUse["&id"].toString(), readers.readDITContextUse ],
    [ matchingRules["&id"].toString(), readers.readMatchingRules ],
    [ matchingRuleUse["&id"].toString(), readers.readMatchingRuleUse ],
    [ ldapSyntaxes["&id"].toString(), readers.readLdapSyntaxes ],

    [ governingStructureRule["&id"].toString(), readers.readGoverningStructureRule ],
    [ structuralObjectClass["&id"].toString(), readers.readStructuralObjectClass ],
    [ subschemaSubentryList["&id"].toString(), readers.readSubschemaSubentryList ],
]);

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

    const userAttributeReaderToExecute: SpecialAttributeDatabaseReader[] = selectedUserAttributes
        ? Array.from(selectedUserAttributes)
            .map((oid) => userAttributeDatabaseReaders.get(oid))
            .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler)
        : Array.from(userAttributeDatabaseReaders.values());
    const operationalAttributeReadersToExecute: SpecialAttributeDatabaseReader[] = (
        selectedOperationalAttributes !== undefined
    )
        ? ((selectedOperationalAttributes === null)
            ? Array.from(operationalAttributeDatabaseReaders.values())
            : Array.from(selectedOperationalAttributes)
                .map((oid) => operationalAttributeDatabaseReaders.get(oid))
                .filter((handler): handler is SpecialAttributeDatabaseReader => !!handler))
        : [];

    for (const reader of userAttributeReaderToExecute) {
        try {
            userAttributes.push(...await reader(ctx, entry));
        } catch (e) {
            continue;
        }
    }
    for (const reader of operationalAttributeReadersToExecute) {
        try {
            operationalAttributes.push(...await reader(ctx, entry));
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
                return selectedUserAttributes.has(attr.id.toString());
            });

    // FIXME: Fully implement this!
    return {
        userAttributes,
        operationalAttributes,
        collectiveValues,
    };
}

export default readValues;

