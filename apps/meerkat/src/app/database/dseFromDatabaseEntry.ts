import type { Entry as DatabaseEntry } from "@prisma/client";
import { ObjectIdentifier, BERElement } from "asn1-ts";
import type { Context, DSE } from "@wildboar/meerkat-types";
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
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import attributesFromValues from "../x500/attributesFromValues";
import attributeFromDatabaseAttribute from "./attributeFromDatabaseAttribute";
import { uriToNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import * as os from "os";
import { Knowledge } from "@prisma/client";
import {
    _decode_DitBridgeKnowledge,
    _decode_MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DitBridgeKnowledge.ta";
import getRDNFromEntryId from "./getRDNFromEntryId";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import readDITContentRuleDescriptions from "./readers/readDITContentRuleDescriptions";
import readDITContextUseDescriptions from "./readers/readDITContextUseDescriptions";
import readDITStructureRuleDescriptions from "./readers/readDITStructureRuleDescriptions";
import readFriendsDescriptions from "./readers/readFriendsDescriptions";
import readMatchingRuleUseDescriptions from "./readers/readMatchingRuleUseDescriptions";

function toACIItem (dbaci: DatabaseACIItem): ACIItem {
    const el = new BERElement();
    el.fromBytes(dbaci.ber);
    return _decode_ACIItem(el);
}

// TODO: Handle decoding errors.

export
async function dseFromDatabaseEntry (
    ctx: Context,
    dbe: DatabaseEntry,
): Promise<DSE> {
    const acis = await ctx.db.aCIItem.findMany({
        where: {
            entry_id: dbe.id,
        },
    });
    const entryACI = acis.filter((aci) => aci.scope === ACIScope.ENTRY).map(toACIItem);
    const prescriptiveACI = dbe.subentry
        ? acis.filter((aci) => aci.scope === ACIScope.PRESCRIPTIVE).map(toACIItem)
        : [];
    const subentryACI = acis.filter((aci) => aci.scope === ACIScope.SUBENTRY).map(toACIItem);
    const rdn = await getRDNFromEntryId(ctx, dbe.id);
    const objectClasses = await ctx.db.entryObjectClass.findMany({
        where: {
            entry_id: dbe.id,
        },
        select: {
            object_class: true,
        },
    });
    const ret: DSE = {
        id: dbe.id,
        uuid: dbe.entryUUID,
        rdn,
        objectClass: new Set(objectClasses.map(({ object_class }) => object_class)),
        uniqueIdentifier: dbe.uniqueIdentifier
            ? (() => {
                const el = new BERElement();
                el.value = dbe.uniqueIdentifier;
                return el.bitString;
            })()
            : undefined,
        structuralObjectClass: dbe.structuralObjectClass
            ? ObjectIdentifier.fromString(dbe.structuralObjectClass)
            : undefined,
        governingStructureRule: dbe.governingStructureRule ?? undefined,
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
    };

    if (dbe.immediate_superior_id === null) { // root and possibly supr
        ret.root = {
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

        const superiorKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SUPERIOR,
            },
        });
        const superiorKnowledge = superiorKnowledgeRows
            .map((sk) => {
                const el = new BERElement();
                el.fromBytes(sk.ber);
                return _decode_AccessPoint(el);
            });
        if (superiorKnowledge.length) {
            ret.supr = {
                superiorKnowledge,
            };
        }

        const bridges = await ctx.db.ditBridgeKnowledge.findMany();
        const ditBridgeKnowledge = bridges
            .map((b) => {
                const el = new BERElement();
                el.fromBytes(b.ber);
                return _decode_DitBridgeKnowledge(el);
            });

        if (ditBridgeKnowledge.length) {
            ret.ditBridge = {
                ditBridgeKnowledge,
            };
        }
    }

    if (dbe.glue) {
        ret.glue = {};
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
        ret.cp = {
            consumerKnowledge,
            supplierKnowledge,
            secondaryShadows,
        };
    }

    if (ret.objectClass.has(alias["&id"].toString())) {
        const aliasedEntry = await ctx.db.alias.findUnique({
            where: {
                alias_entry_id: dbe.id,
            },
            select: {
                aliased_entry_name: true,
            },
        });
        if (Array.isArray(aliasedEntry?.aliased_entry_name)) {
            ret.alias = {
                aliasedEntryName: aliasedEntry!.aliased_entry_name
                    .map((rdn: Record<string, string>) => rdnFromJson(rdn)),
            };
        } else {
            ctx.log.warn("Alias entry found without corresponding alias attribute.");
        }
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
        ret.subr = {
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
        ret.nssr = {
            nonSpecificKnowledge,
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
        ret.xr = {
            specificKnowledge,
        };
    }

    const administrativeRoles = await ctx.db.entryAdministrativeRole.findMany({
        where: {
            entry_id: dbe.id,
        },
        select: {
            administrativeRole: true,
        },
    });
    if (administrativeRoles.length > 0) {
        const accessControlScheme = await ctx.db.entryAccessControlScheme.findUnique({
            where: {
                entry_id: dbe.id,
            },
            select: {
                accessControlScheme: true,
            },
        });
        ret.admPoint = {
            administrativeRole: new Set(administrativeRoles.map((ar) => ar.administrativeRole)),
            accessControlScheme: accessControlScheme
                ? ObjectIdentifier.fromString(accessControlScheme.accessControlScheme)
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

        const collectiveAttributeTypes: string[] = Array.from(ctx.collectiveAttributes);

        const collectiveAttributes: Attribute[] = attributesFromValues(
            await Promise.all(
                (await ctx.db.attributeValue.findMany({
                    where: {
                        entry_id: dbe.id,
                        type: {
                            in: collectiveAttributeTypes,
                        },
                    },
                    include: {
                        ContextValue: true,
                    },
                }))
                    .map((attr) => attributeFromDatabaseAttribute(ctx, attr)),
            ),
        );

        ret.subentry = {
            commonName: "",
            subtreeSpecification,
            prescriptiveACI,
            collectiveAttributes,
            ditStructureRules: await readDITStructureRuleDescriptions(ctx, dbe.id),
            ditContentRules: await readDITContentRuleDescriptions(ctx, dbe.id),
            ditContextUse: await readDITContextUseDescriptions(ctx, dbe.id),
            friendships: await readFriendsDescriptions(ctx, dbe.id),
            matchingRuleUse: await readMatchingRuleUseDescriptions(ctx, dbe.id),
        };
    }

    if (dbe.shadow) {
        ret.shadow = {
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
        ret.immSupr = {
            specificKnowledge,
        };
    }

    if (dbe.rhob) {
        ret.rhob = {};
    }

    if (dbe.sa) {
        ret.sa = true;
    }

    if (dbe.dsSubentry) {
        ret.dsSubentry = true;
    }

    if (!ret.alias && !ret.subentry) {
        const collectiveExclusions = await ctx.db.entryCollectiveExclusion.findMany({
            where: {
                entry_id: dbe.id,
            },
            select: {
                collectiveExclusion: true,
            }
        });
        ret.entry = {
            collectiveExclusions: new Set(
                collectiveExclusions.map((ce) => ce.collectiveExclusion),
            ),
        };
    }

    if (dbe.keep_children_in_database) {
        return ret;
    }
    return ret;
}

export default dseFromDatabaseEntry;
