import type { Entry as DatabaseEntry } from "@prisma/client";
import { ObjectIdentifier, BERElement } from "asn1-ts";
import type { Context, Entry as MemoryEntry } from "../types";
import rdnFromJson from "../x500/rdnFromJson";
import { ACIScope, ACIItem as DatabaseACIItem, AttributeValue } from "@prisma/client";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    id_oa_subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-subtreeSpecification.va";
import {
    SubtreeSpecification,
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";

function toACIItem (dbaci: DatabaseACIItem): ACIItem {
    const el = new BERElement();
    el.fromBytes(dbaci.ber);
    return _decode_ACIItem(el);
}

function toSubtreeSpecification (dbsts: AttributeValue): SubtreeSpecification {
    const el = new BERElement();
    el.fromBytes(dbsts.ber);
    return _decode_SubtreeSpecification(el);
}

export
async function entryFromDatabaseEntry (
    ctx: Context,
    superior: MemoryEntry | undefined,
    dbe: DatabaseEntry,
    oneLevel: boolean = false,
): Promise<MemoryEntry> {
    const acis = await ctx.db.aCIItem.findMany({
        where: {
            entry_id: dbe.id,
        },
    });
    const subtreeAttributes: SubtreeSpecification[] | undefined = dbe.subentry
        ? (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: dbe.id,
                type: id_oa_subtreeSpecification.toString(),
            },
        })).map(toSubtreeSpecification)
        : undefined;
    const entryACI = acis.filter((aci) => aci.scope === ACIScope.ENTRY).map(toACIItem);
    const prescriptiveACI = dbe.subentry
        ? acis.filter((aci) => aci.scope === ACIScope.PRESCRIPTIVE).map(toACIItem)
        : [];
    const subentryACI = dbe.admPoint
        ? acis.filter((aci) => aci.scope === ACIScope.SUBENTRY).map(toACIItem)
        : [];
    // hierarchy?: HierarchyInfo;
    const ret: MemoryEntry = {
        ...dbe,
        parent: superior,
        uuid: dbe.entryUUID,
        rdn: (dbe.rdn && (typeof dbe.rdn === "object") && !(Array.isArray(dbe.rdn)))
            ? rdnFromJson(dbe.rdn as Record<string, string>)
            : [],
        children: [],
        dseType: {
            root: dbe.root ?? false,
            glue: dbe.glue ?? false,
            cp: dbe.cp ?? false,
            entry: dbe.entry ?? false,
            alias: dbe.alias ?? false,
            subr: dbe.subr ?? false,
            nssr: dbe.nssr ?? false,
            supr: dbe.supr ?? false,
            xr: dbe.xr ?? false,
            admPoint: dbe.admPoint ?? false,
            subentry: dbe.subentry ?? false,
            shadow: dbe.shadow ?? false,
            immSupr: dbe.immSupr ?? false,
            rhob: dbe.rhob ?? false,
            sa: dbe.sa ?? false,
            dsSubentry: dbe.dsSubentry ?? false,
            familyMember: dbe.familyMember ?? false,
            ditBridge: dbe.ditBridge ?? false,
        },
        objectClass: new Set(dbe.objectClass),
        creatorsName: {
            rdnSequence: [], // FIXME:
        },
        modifiersName: {
            rdnSequence: [], // FIXME:
        },
        createdTimestamp: dbe.createdTimestamp,
        modifyTimestamp: dbe.modifyTimestamp,
        accessControlScheme: dbe.accessControlScheme
            ? new ObjectIdentifier(dbe.accessControlScheme.split(".").map((arc) => Number.parseInt(arc)))
            : undefined,
        entryACI,
        prescriptiveACI,
        subentryACI,
        administrativeRoles: new Set(dbe.administrativeRole),
        subtrees: subtreeAttributes,
        // hierarchy: ( // FIXME: Depends on jsonToDN()
        //     dbe.hierarchyTop !== undefined
        //     && dbe.hierarchyLevel !== undefined
        // )
        //     ? {
        //         top: dbe.hierarchyTop,
        //     }
        //     : undefined,
    };

    ret.children = oneLevel
        ? []
        : await Promise.all(
            (await ctx.db.entry.findMany({
                where: {
                    immediate_superior_id: dbe.id,
                },
            })).map((child) => entryFromDatabaseEntry(ctx, ret, child)),
        );
    return ret;
}

export default entryFromDatabaseEntry;
