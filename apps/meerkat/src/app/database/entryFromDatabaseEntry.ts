import type { Entry as DatabaseEntry } from "@prisma/client";
import { ObjectIdentifier, BERElement } from "asn1-ts";
import type { Context, Vertex } from "../types";
import rdnFromJson from "../x500/rdnFromJson";
import { ACIScope, ACIItem as DatabaseACIItem } from "@prisma/client";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import {
    _decode_SupplierInformation,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierInformation.ta";
import {
    _decode_ConsumerInformation,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/ConsumerInformation.ta";
import {
    _decode_SupplierAndConsumers,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierAndConsumers.ta";
import {
    _decode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import { uriToNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import * as os from "os";
import { Knowledge } from "@prisma/client";
import { _decode_DitBridgeKnowledge, _decode_MasterAndShadowAccessPoints } from "@wildboar/x500/src/lib/modules/DistributedOperations/DitBridgeKnowledge.ta";

function toACIItem (dbaci: DatabaseACIItem): ACIItem {
    const el = new BERElement();
    el.fromBytes(dbaci.ber);
    return _decode_ACIItem(el);
}

// TODO: Handle decoding errors.

export
async function entryFromDatabaseEntry (
    ctx: Context,
    superior: Vertex | undefined,
    dbe: DatabaseEntry,
    oneLevel: boolean = false,
): Promise<Vertex> {
    const acis = await ctx.db.aCIItem.findMany({
        where: {
            entry_id: dbe.id,
        },
    });
    const entryACI = acis.filter((aci) => aci.scope === ACIScope.ENTRY).map(toACIItem);
    const prescriptiveACI = dbe.subentry
        ? acis.filter((aci) => aci.scope === ACIScope.PRESCRIPTIVE).map(toACIItem)
        : [];
    const subentryACI = dbe.admPoint
        ? acis.filter((aci) => aci.scope === ACIScope.SUBENTRY).map(toACIItem)
        : [];
    const ret: Vertex = {
        immediateSuperior: superior,
        subordinates: [],
        dse: {
            id: dbe.id,
            uuid: dbe.entryUUID,
            rdn: (dbe.rdn && (typeof dbe.rdn === "object") && !(Array.isArray(dbe.rdn)))
                ? rdnFromJson(dbe.rdn as Record<string, string>)
                : [],
            objectClass: new Set(dbe.objectClass),
            creatorsName: {
                rdnSequence: Array.isArray(dbe.creatorsName)
                    ? dbe.creatorsName.map((rdn: Record<string, string>) => rdnFromJson(rdn))
                    : [],
            },
            modifiersName: {
                rdnSequence: Array.isArray(dbe.modifiersName)
                    ? dbe.modifiersName.map((rdn: Record<string, string>) => rdnFromJson(rdn))
                    : [],
            },
            createdTimestamp: dbe.createdTimestamp,
            modifyTimestamp: dbe.modifyTimestamp,
            entryACI,
        },
        // hierarchy: ( // FIXME: Depends on jsonToDN()
        //     dbe.hierarchyTop !== undefined
        //     && dbe.hierarchyLevel !== undefined
        // )
        //     ? {
        //         top: dbe.hierarchyTop,
        //     }
        //     : undefined,
    };

    if (dbe.root) {
        ret.dse.root = {
            myAccessPoint: new AccessPoint(
                {
                    rdnSequence: [],
                },
                new PresentationAddress(
                    undefined,
                    undefined,
                    undefined,
                    [
                        uriToNSAP(`idm://${os.hostname()}`, false), // FIXME:
                    ],
                ),
                undefined,
            )
        };
    }

    if (dbe.glue) {
        ret.dse.glue = {};
    }

    if (dbe.cp) {
        const supplierRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SUPPLIER,
            },
        });
        const consumerRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.CONSUMER,
            },
        });
        const secondaryRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SECONDARY_SHADOW,
            },
            include: {
                consumers: true,
            },
        });
        const supplierKnowledge = supplierRows
            .map((s) => {
                const el = new BERElement();
                el.fromBytes(s.ber);
                return _decode_SupplierInformation(el);
            });
        const consumerKnowledge = consumerRows
            .map((c) => {
                const el = new BERElement();
                el.fromBytes(c.ber);
                return _decode_ConsumerInformation(el);
            });
        const secondaryShadows = secondaryRows
            .map((s) => {
                const el = new BERElement();
                el.fromBytes(s.ber);
                return _decode_SupplierAndConsumers(el);
            });
        ret.dse.cp = {
            consumerKnowledge,
            supplierKnowledge,
            secondaryShadows,
        };
    }

    if (dbe.entry) {
        ret.dse.entry = {};
    }

    if (dbe.alias && dbe.aliased_entry_dn && Array.isArray(dbe.aliased_entry_dn)) {
        ret.dse.alias = {
            aliasedEntryName: dbe.aliased_entry_dn
                .map((rdn: Record<string, string>) => rdnFromJson(rdn)),
        };
    }

    if (dbe.subr) {
        const subordinateKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SPECIFIC,
            },
        });
        const specificKnowledge = subordinateKnowledgeRows
            .map((s) => {
                const el = new BERElement();
                el.fromBytes(s.ber);
                return _decode_MasterOrShadowAccessPoint(el);
            });
        ret.dse.subr = {
            specificKnowledge,
        };
    }

    if (dbe.nssr) {
        const nssrs = await ctx.db.nonSpecificKnowledge.findMany({
            where: {
                entry_id: dbe.id,
            },
        });
        const nonSpecificKnowledge = nssrs
            .map((n) => {
                const el = new BERElement();
                el.fromBytes(n.ber);
                return _decode_MasterAndShadowAccessPoints(el);
            });
        ret.dse.nssr = {
            nonSpecificKnowledge,
        };
    }

    if (dbe.supr) {
        const subordinateKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SUPERIOR,
            },
        });
        const superiorKnowledge = subordinateKnowledgeRows
            .map((sk) => {
                const el = new BERElement();
                el.fromBytes(sk.ber);
                return _decode_AccessPoint(el);
            });
        ret.dse.supr = {
            superiorKnowledge,
        };
    }

    if (dbe.xr) {
        const subordinateKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SPECIFIC,
            },
        });
        const specificKnowledge = subordinateKnowledgeRows
            .map((s) => {
                const el = new BERElement();
                el.fromBytes(s.ber);
                return _decode_MasterOrShadowAccessPoint(el);
            });
        ret.dse.xr = {
            specificKnowledge,
        };
    }

    if (dbe.admPoint) {
        ret.dse.admPoint = {
            administrativeRole: new Set(dbe.administrativeRole),
            accessControlScheme: dbe.accessControlScheme
                ? ObjectIdentifier.fromString(dbe.accessControlScheme)
                : undefined,
            subentryACI,
        };
    }

    if (dbe.subentry) {
        const subtreeRows = await ctx.db.subtreeSpecification.findMany({
            where: {
                entry_id: dbe.id,
            },
        });
        const subtreeSpecification = subtreeRows
            .map((s) => {
                const el = new BERElement();
                el.fromBytes(s.ber);
                return _decode_SubtreeSpecification(el);
            });
        ret.dse.subentry = {
            commonName: "",
            subtreeSpecification,
            prescriptiveACI,
        };
    }

    if (dbe.shadow) {
        ret.dse.shadow = {
            attributeCompleteness: dbe.attribute_completeness ?? false,
            attributeValuesIncomplete: dbe.attribute_values_incomplete ?? true,
            subordinateCompleteness: dbe.subordinate_completeness ?? false,
        };
    }

    if (dbe.immSupr) {
        const subordinateKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SPECIFIC,
            },
        });
        const specificKnowledge = subordinateKnowledgeRows
            .map((s) => {
                const el = new BERElement();
                el.fromBytes(s.ber);
                return _decode_MasterOrShadowAccessPoint(el);
            });
        ret.dse.immSupr = {
            specificKnowledge,
        };
    }

    if (dbe.rhob) {
        ret.dse.rhob = {};
    }

    if (dbe.sa) {
        ret.dse.sa = true;
    }

    if (dbe.dsSubentry) {
        ret.dse.dsSubentry = true;
    }

    if (dbe.ditBridge) {
        const bridges = await ctx.db.ditBridgeKnowledge.findMany({
            where: {
                entry_id: dbe.id,
            },
        });
        const ditBridgeKnowledge = bridges
            .map((b) => {
                const el = new BERElement();
                el.fromBytes(b.ber);
                return _decode_DitBridgeKnowledge(el);
            });
        ret.dse.ditBridge = {
            ditBridgeKnowledge,
        };
    }

    if (dbe.keep_children_in_database) {
        return ret;
    }
    ret.subordinates = oneLevel
        ? null
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
