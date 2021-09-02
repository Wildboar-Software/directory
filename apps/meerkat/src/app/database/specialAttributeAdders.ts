import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseEditor,
    PendingUpdates,
} from "../types";
import { DER } from "asn1-ts/dist/node/functional";
// import {
//     ACIItem,
//     _decode_ACIItem,
// } from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
// import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
// import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
// import { parent } from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
// import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    _encode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    _decode_MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import { Knowledge } from "@prisma/client";
import rdnToJson from "../x500/rdnToJson";

/* DATABASE WRITERS */

// const writeSomeACI: (scope: ACIScope) => SpecialAttributeDatabaseEditor = (scope: ACIScope) => {
//     return (
//         ctx: Readonly<Context>,
//         entry: Vertex,
//         attribute: StoredAttributeValueWithContexts,
//     ): PrismaPromise<any> => {
//         // We ignore contexts for this.
//         const aci: ACIItem = _decode_ACIItem(attribute.value);
//         return ctx.db.aCIItem.create({
//             data: {
//                 entry_id: entry.dse.id,
//                 tag: directoryStringToString(aci.identificationTag),
//                 precedence: aci.precedence,
//                 auth_level_basic_level: ("basicLevels" in aci.authenticationLevel)
//                     ? aci.authenticationLevel.basicLevels.level
//                     : undefined,
//                 auth_level_basic_local_qualifier: ("basicLevels" in aci.authenticationLevel)
//                     ? aci.authenticationLevel.basicLevels.localQualifier
//                     : undefined,
//                 auth_level_basic_signed: ("basicLevels" in aci.authenticationLevel)
//                     ? aci.authenticationLevel.basicLevels.signed
//                     : undefined,
//                 ber: Buffer.from(attribute.value.toBytes()),
//                 scope,
//             },
//         });
//     };
// }

// const writeEntryACI = writeSomeACI(ACIScope.ENTRY);
// const writePrescriptiveACI = writeSomeACI(ACIScope.PRESCRIPTIVE);
// const writeSubentryACI = writeSomeACI(ACIScope.SUBENTRY);

export const addObjectClass: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const newOIDs = [
        ...Array.from(vertex.dse.objectClass),
        value.value.objectIdentifier.toString(),
    ];
    pendingUpdates.entryUpdate.objectClass = newOIDs.join(" ");
};

// TODO:
// export const commonName: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.entryUpdate.commonName = value.ds
// };

// TODO: Hierarchy

export const addAccessControlScheme: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.entryUpdate.accessControlScheme = value.value.objectIdentifier.toString();
};

// TODO:
// export const jid: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

export const addAdministrativeRole: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.entryUpdate.administrativeRole = [
        ...Array.from(vertex.dse.admPoint?.administrativeRole ?? []),
        value.value.objectIdentifier.toString(),
    ].join(" ");
};

// TODO: All of these.

// export const clearance: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const DITStructureRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ContentRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ContextUseRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const FriendshipUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const MatchingRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const AttributeTypeDescriptionUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ObjectClassDescriptionUsage: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ContextDescriptionUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const SearchRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const AccessPoint: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

export const addSubtreeSpecification: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const subtree = _decode_SubtreeSpecification(value.value);
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.create({
        data: {
            entry_id: vertex.dse.id,
            base: subtree.base
                ? subtree.base.map((rdn) => rdnToJson(rdn))
                : undefined,
            minimum: subtree.minimum,
            maximum: subtree.maximum,
            ber: Buffer.from(value.value.toBytes()),
            // specific_exclusions: // FIXME:
            // specification_filter: // FIXME:
            // specific_exclusions: subtree.specificExclusions?.map((sx) => {
            //     if ("")
            // })
        },
    }));
};

export const addNonSpecificKnowledge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.nonSpecificKnowledge.create({
        data: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
        },
    }));
};

export const addSpecificKnowledge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const mosaps = _decode_MasterAndShadowAccessPoints(value.value);
    pendingUpdates.otherWrites.push(
        ctx.db.accessPoint.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                knowledge_type: Knowledge.SPECIFIC,
            },
        }),
        ctx.db.accessPoint.createMany({
            data: mosaps.map((mosap) => ({
                entry_id: vertex.dse.id,
                ae_title: mosap.ae_title.rdnSequence.map(rdnToJson),
                knowledge_type: Knowledge.SPECIFIC,
                category: mosap.category,
                chainingRequired: mosap.chainingRequired,
                ber: Buffer.from(_encode_MasterOrShadowAccessPoint(mosap, DER).toBytes()),
            })),
        }),
    );
};

// TODO:

// export const userPwd: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const userPassword: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdStartTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdExpiryTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdEndTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdFails: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdFailureTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdGracesUsed: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdModifyEntryAllowed: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdChangeAllowed: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdMaxAge: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdExpiryAge: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdMinLength: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const noDictionaryWords: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const noPersonNames: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const noGeographicalNames: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdDictionaries: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdExpiryWarning: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdGraces: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdFailureDuration: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdLockoutDuration: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdMaxFailures: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdMaxTimeInHistory: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdMinTimeInHistory: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdHistorySlots: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const pwdRecentlyExpiredDuration: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };



// TODO: objectClass
// TODO: commonName
// TODO: hierarchyLevel
// TODO: hierarchyBelow
// TODO: hierarchyParent
// TODO: hierarchyTop
// TODO: accessControlScheme
// TODO: jid
// TODO: objectIdentifier
// TODO: countryName
// TODO: countryCode3c
// TODO: countryCode3n
// TODO: utmCoordinates_id
// TODO: utmCoordinates
// TODO: organizationIdentifier
// TODO: communicationsNetwork
// TODO: oidC1
// TODO: oidC2
// TODO: oidC
// TODO: urnC
// TODO: tagOid
// TODO: uiiInUrn
// TODO: epcInUrn
// TODO: contentType
// TODO: messageDigest
// TODO: administrativeRole
// TODO: dc
// TODO: clearance
// TODO: DITStructureRuleUse
// TODO: ContentRuleUse
// TODO: ContextUseRuleUse
// TODO: FriendshipUse
// TODO: MatchingRuleUse
// TODO: AttributeTypeDescriptionUse
// TODO: ObjectClassDescriptionUsage
// TODO: ContextDescriptionUse
// TODO: SearchRuleUse
// TODO: AccessPoint (Multiple such attributes)
// TODO: SubtreeSpecification
// TODO: nonSpecificKnowledge
// TODO: specificKnowledge
// TODO: userPwd
// TODO: userPassword
// TODO: pwdStartTime
// TODO: pwdExpiryTime
// TODO: pwdEndTime
// TODO: pwdFails
// TODO: pwdFailureTime
// TODO: pwdGracesUsed
// TODO: pwdModifyEntryAllowed
// TODO: pwdChangeAllowed
// TODO: pwdMaxAge
// TODO: pwdExpiryAge
// TODO: pwdMinLength
// TODO: noDictionaryWords
// TODO: noPersonNames
// TODO: noGeographicalNames
// TODO: pwdDictionaries
// TODO: pwdExpiryWarning
// TODO: pwdGraces
// TODO: pwdFailureDuration
// TODO: pwdLockoutDuration
// TODO: pwdMaxFailures
// TODO: pwdMaxTimeInHistory
// TODO: pwdMinTimeInHistory
// TODO: pwdHistorySlots
// TODO: pwdRecentlyExpiredDuration
