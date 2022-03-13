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
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
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
import attributesFromValues from "../x500/attributesFromValues";
import attributeFromDatabaseAttribute from "./attributeFromDatabaseAttribute";
import { Knowledge } from "@prisma/client";
import {
    _decode_DitBridgeKnowledge,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DitBridgeKnowledge.ta";
import getRDNFromEntryId from "./getRDNFromEntryId";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import { parent } from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import readDITContentRuleDescriptions from "./readers/readDITContentRuleDescriptions";
import readDITContextUseDescriptions from "./readers/readDITContextUseDescriptions";
import readDITStructureRuleDescriptions from "./readers/readDITStructureRuleDescriptions";
import readFriendsDescriptions from "./readers/readFriendsDescriptions";
import readMatchingRuleUseDescriptions from "./readers/readMatchingRuleUseDescriptions";
import { _decode_Clearance } from "@wildboar/x500/src/lib/modules/EnhancedSecurity/Clearance.ta";
import {
    contextAssertionDefaults,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionDefaults.oa";
import {
    _decode_TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
// import {
//     accessControlSubentry,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import {
    contextAssertionSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
// import {
//     pwdAdminSubentry,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
// import {
//     serviceAdminSubentry,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import _ from "lodash";


function toACIItem (dbaci: DatabaseACIItem): ACIItem {
    const el = new BERElement();
    el.fromBytes(dbaci.ber);
    return _decode_ACIItem(el);
}

const ALIAS: string = alias["&id"].toString();
const PARENT: string = parent["&id"].toString();
const CHILD: string = child["&id"].toString();
// const SUBENTRY_AC: string = accessControlSubentry["&id"].toString();
const SUBENTRY_CA: string = collectiveAttributeSubentry["&id"].toString();
const SUBENTRY_CAD: string = contextAssertionSubentry["&id"].toString();
// const SUBENTRY_PWD: string = pwdAdminSubentry["&id"].toString();
// const SUBENTRY_SVC: string = serviceAdminSubentry["&id"].toString();
const SUBSCHEMA: string = subschema["&id"].toString();

let collectiveAttributeTypes: string[] = [];

/**
 * @summary Produce an in-memory DSE from the Prisma `Entry` model
 * @description
 *
 * This function takes the `Entry` model used in the Prisma client, which can
 * only have fields of types that are native to a relational database (strings,
 * numbers, null, etc.) and converts them to the stronger ASN.1 types, and
 * generally "hydrates" the raw data queried from the database to assemble a
 * DSE populated with important operational attributes in memory.
 *
 * @param ctx The context object
 * @param dbe The DSE as returned by the Prisma
 * @returns The DSE
 *
 * @function
 * @async
 */
export
async function dseFromDatabaseEntry (
    ctx: Context,
    dbe: (DatabaseEntry & { // You can supply these relations ahead of time...
        // which will save multiple queries to the database.
        UniqueIdentifier?: {
            uniqueIdentifier: Buffer;
        }[];
        ACIItem?: {
            scope: ACIScope;
            ber: Buffer;
        }[];
        Clearance?: {
            ber: Buffer;
        }[];
        SubtreeSpecification?: {
            ber: Buffer;
        }[];
        EntryObjectClass?: {
            object_class: string;
        }[];
        EntryAdministrativeRole?: {
            administrativeRole: string;
        }[];
        RDN?: {
            type: string;
            value: Buffer;
        }[];
        EntryCollectiveExclusion?: {
            collectiveExclusion: string;
        }[];
    }),
): Promise<DSE> {
    const acis = ctx.config.bulkInsertMode
        ? []
        : (dbe.ACIItem
            ? dbe.ACIItem
            : (await ctx.db.aCIItem.findMany({
                where: {
                    entry_id: dbe.id,
                    active: true,
                },
                select: {
                    scope: true,
                    ber: true,
                },
            })));
    const entryACI = acis.filter((aci) => aci.scope === ACIScope.ENTRY).map(toACIItem);
    const prescriptiveACI = dbe.subentry
        ? acis.filter((aci) => aci.scope === ACIScope.PRESCRIPTIVE).map(toACIItem)
        : [];
    const subentryACI = dbe.admPoint
        ? acis.filter((aci) => aci.scope === ACIScope.SUBENTRY).map(toACIItem)
        : [];
    const rdn = dbe.RDN?.map((atav) => new AttributeTypeAndValue(
        ObjectIdentifier.fromString(atav.type),
        (() => {
            const el = new BERElement();
            el.fromBytes(atav.value);
            return el;
        })(),
    )) ?? await getRDNFromEntryId(ctx, dbe.id);
    //
    const objectClasses = dbe.EntryObjectClass ?? (await ctx.db.entryObjectClass.findMany({
        where: {
            entry_id: dbe.id,
        },
        select: {
            object_class: true,
        },
    }));
    const clearances = dbe.Clearance ?? (await ctx.db.clearance.findMany({
        where: {
            entry_id: dbe.id,
            active: true,
        },
        select: {
            ber: true,
        },
    }));
    const administrativeRoles = dbe.EntryAdministrativeRole
        ?? (await ctx.db.entryAdministrativeRole.findMany({
            where: {
                entry_id: dbe.id,
            },
            select: {
                administrativeRole: true,
            },
        }));
    const uniqueIdentifiers = (dbe.UniqueIdentifier
        ?? (await ctx.db.uniqueIdentifier.findMany({
            where: {
                entry_id: dbe.id,
            },
            select: {
                uniqueIdentifier: true,
            },
        })))
        .map(({ uniqueIdentifier }) => {
            const el = new BERElement();
            el.value = uniqueIdentifier;
            return el.bitString;
        });
    const ret: DSE = {
        id: dbe.id,
        materializedPath: dbe.materialized_path,
        uuid: dbe.dseUUID,
        entryUUID: dbe.entryUUID ?? undefined,
        rdn,
        objectClass: new Set(objectClasses.map(({ object_class }) => object_class)),
        clearances: clearances.map((c) => {
            const el = new BERElement();
            el.fromBytes(c.ber);
            return _decode_Clearance(el);
        }),
        uniqueIdentifier: uniqueIdentifiers,
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
        createTimestamp: dbe.createTimestamp ?? undefined,
        modifyTimestamp: dbe.modifyTimestamp ?? undefined,
        entryACI,
        glue: dbe.glue,
    };

    if (
        ret.objectClass.has(PARENT)
        || ret.objectClass.has(CHILD)
    ) {
        ret.familyMember = true;
    }

    if (dbe.immediate_superior_id === null) { // root and possibly supr
        ret.root = true;
        const superiorKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SUPERIOR,
                active: true,
            },
            select: {
                ber:true,
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

    if (dbe.cp) {
        const supplierRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SUPPLIER,
                active: true,
            },
            select: {
                ber: true,
            },
        });
        const consumerRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.CONSUMER,
                active: true,
            },
            select: {
                ber: true,
            },
        });
        const secondaryRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SECONDARY_SUPPLIER,
                active: true,
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

    if (ret.objectClass.has(ALIAS)) {
        const alias_ = await ctx.db.alias.findUnique({
            where: {
                alias_entry_id: dbe.id,
            },
            select: {
                aliased_entry_name: true,
            },
        });
        // We check that it is an array just to avoid any problems with this
        // value being malformed in the database.
        if (Array.isArray(alias_?.aliased_entry_name)) {
            ret.alias = {
                aliasedEntryName: alias_!.aliased_entry_name
                    .map((rdn: Record<string, string>) => rdnFromJson(rdn)),
            };
        } else {
            ctx.log.warn(ctx.i18n.t("log:alias_but_no_aen", {
                id: dbe.entryUUID,
            }));
        }
    }

    if (dbe.subr) {
        const subordinateKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SPECIFIC,
                active: true,
            },
            select: {
                ber: true,
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
        const nssrs = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.NON_SPECIFIC,
                active: true,
            },
            select: {
                nsk_group: true,
                ber: true,
            },
        });
        const nsk_groups = _.groupBy(nssrs, (n) => n.nsk_group);
        const nonSpecificKnowledge = Object.values(nsk_groups)
            .map((masaps) => masaps.map((mosap) => {
                const el = new BERElement();
                el.fromBytes(mosap.ber);
                return _decode_MasterOrShadowAccessPoint(el);
            }));
        ret.nssr = {
            nonSpecificKnowledge,
        };
    }

    if (dbe.xr) {
        const subordinateKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SPECIFIC,
                active: true,
            },
            select: {
                ber: true,
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

    if (administrativeRoles.length > 0) {
        const accessControlScheme = await ctx.db.entryAccessControlScheme.findFirst({
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
        const subtreeRows = dbe.SubtreeSpecification ?? (await ctx.db.subtreeSpecification.findMany({
            where: {
                entry_id: dbe.id,
            },
            select: {
                ber: true,
            },
        }));
        const subtreeSpecification = subtreeRows
            .map((s) => {
                const el = new BERElement();
                el.fromBytes(s.ber);
                return _decode_SubtreeSpecification(el);
            });

        ret.subentry = {
            subtreeSpecification,
            prescriptiveACI,
        };
        if (ret.objectClass.has(SUBENTRY_CA)) {
            if (collectiveAttributeTypes.length === 0) {
                collectiveAttributeTypes = Array.from(ctx.collectiveAttributes);
            }
            ret.subentry.collectiveAttributes = attributesFromValues(
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
                    .map((attr) => attributeFromDatabaseAttribute(ctx, attr)));
        }
        if (ret.objectClass.has(SUBSCHEMA)) {
            ret.subentry.ditStructureRules = await readDITStructureRuleDescriptions(ctx, dbe.id);
            ret.subentry.ditContentRules = await readDITContentRuleDescriptions(ctx, dbe.id);
            ret.subentry.ditContextUse = await readDITContextUseDescriptions(ctx, dbe.id);
            ret.subentry.friendships = await readFriendsDescriptions(ctx, dbe.id);
            ret.subentry.matchingRuleUse = await readMatchingRuleUseDescriptions(ctx, dbe.id);
        }
        if (ret.objectClass.has(SUBENTRY_CAD)) {
            const cads = await ctx.db.attributeValue.findMany({
                where: {
                    entry_id: dbe.id,
                    type: contextAssertionDefaults["&id"].toString(),
                },
                select: {
                    ber: true,
                },
            });
            if (!ret.subentry.contextAssertionDefaults) {
                ret.subentry.contextAssertionDefaults = [];
            }
            ret.subentry.contextAssertionDefaults.push(...cads.map((cad) => {
                const el = new BERElement();
                el.fromBytes(cad.ber);
                return _decode_TypeAndContextAssertion(el);
            }));
        }
        // TODO: Load Service Administration Data.
    }

    if (dbe.shadow) {
        ret.shadow = {
            attributeCompleteness: dbe.attribute_completeness ?? false,
            attributeValuesIncomplete: new Set(
                (await ctx.db.entryAttributeValuesIncomplete.findMany({
                    where: {
                        entry_id: dbe.id,
                    },
                    select: {
                        attribute_type: true,
                    },
                })).map((x) => x.attribute_type),
            ),
            subordinateCompleteness: dbe.subordinate_completeness ?? false,
        };
    }

    if (dbe.immSupr) {
        const subordinateKnowledgeRows = await ctx.db.accessPoint.findMany({
            where: {
                entry_id: dbe.id,
                knowledge_type: Knowledge.SPECIFIC,
                active: true,
            },
            select: {
                ber: true,
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
        const collectiveExclusions = dbe.EntryCollectiveExclusion
            ?? (await ctx.db.entryCollectiveExclusion.findMany({
                where: {
                    entry_id: dbe.id,
                },
                select: {
                    collectiveExclusion: true,
                },
            }));
        ret.entry = {
            collectiveExclusions: new Set(
                collectiveExclusions.map((ce) => ce.collectiveExclusion),
            ),
        };
    }

    if (typeof dbe.hierarchyPath === "string") {
        ret.hierarchy = {
            // Subtract two from the following, because:
            // -1 for there being a trailing period (necessary).
            // -1 for hierarchyLevel being zero-indexed.
            level: dbe.hierarchyPath?.split(".").slice(0, -1).length ?? 0,
            parent: Array.isArray(dbe.hierarchyParentDN)
                ? dbe.hierarchyParentDN.map(rdnFromJson)
                : undefined,
            top: Array.isArray(dbe.hierarchyTopDN)
                ? dbe.hierarchyTopDN.map(rdnFromJson)
                : undefined,
        };
    }

    return ret;
}

export default dseFromDatabaseEntry;
