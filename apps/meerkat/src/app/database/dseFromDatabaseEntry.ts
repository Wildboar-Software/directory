import type { Entry as DatabaseEntry } from "@prisma/client";
import { ObjectIdentifier, BERElement, ASN1Construction } from "@wildboar/asn1";
import type { Context, DSE } from "@wildboar/meerkat-types";
import rdnFromJson from "../x500/rdnFromJson.js";
import {
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    _decode_SupplierInformation,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    _decode_ConsumerInformation,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    _decode_SupplierAndConsumers,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    _decode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/DistributedOperations";
import attributesFromValues from "../x500/attributesFromValues.js";
import attributeFromDatabaseAttribute from "./attributeFromDatabaseAttribute.js";
import { Knowledge } from "@prisma/client";
import {
    _decode_DitBridgeKnowledge,
} from "@wildboar/x500/DistributedOperations";
import getRDNFromEntryId from "./getRDNFromEntryId.js";
import { alias } from "@wildboar/x500/InformationFramework";
import { parent } from "@wildboar/x500/InformationFramework";
import { child } from "@wildboar/x500/InformationFramework";
import readDITContentRuleDescriptions from "./readers/readDITContentRuleDescriptions.js";
import readDITContextUseDescriptions from "./readers/readDITContextUseDescriptions.js";
import readDITStructureRuleDescriptions from "./readers/readDITStructureRuleDescriptions.js";
import readFriendsDescriptions from "./readers/readFriendsDescriptions.js";
import readMatchingRuleUseDescriptions from "./readers/readMatchingRuleUseDescriptions.js";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    subschema,
} from "@wildboar/x500/SchemaAdministration";
import _ from "lodash";
import { administrativeRole, pwdAttribute } from "@wildboar/x500/InformationFramework";
import { accessControlScheme } from "@wildboar/x500/BasicAccessControl";
import { attributeValueFromDB } from "./attributeValueFromDB.js";


const ALIAS: string = alias["&id"].toString();
const PARENT: string = parent["&id"].toString();
const CHILD: string = child["&id"].toString();
const SUBENTRY_CA: string = collectiveAttributeSubentry["&id"].toString();
const SUBENTRY_PWD: string = pwdAdminSubentry["&id"].toString();
const SUBSCHEMA: string = subschema["&id"].toString();

let collectiveAttributeTypes: Buffer[] = [];

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
        EntryObjectClass?: {
            object_class: string;
        }[];
        RDN?: {
            type_oid: Uint8Array;
            tag_class: number,
            constructed: boolean,
            tag_number: number,
            content_octets: Uint8Array,
        }[];
    }),
): Promise<DSE> {
    const rdn = dbe.RDN?.map((atav) => {
        const type_el = new BERElement();
        const value_el = new BERElement();
        type_el.value = atav.type_oid;
        value_el.tagClass = atav.tag_class;
        value_el.construction = atav.constructed
            ? ASN1Construction.constructed
            : ASN1Construction.primitive;
        value_el.tagNumber = atav.tag_number;
        value_el.value = atav.content_octets;
        return new AttributeTypeAndValue(
            type_el.objectIdentifier,
            value_el,
        );
    }) ?? await getRDNFromEntryId(ctx, dbe.id);
    //
    const objectClasses = dbe.EntryObjectClass ?? (await ctx.db.entryObjectClass.findMany({
        where: {
            entry_id: dbe.id,
        },
        select: {
            object_class: true,
        },
    }));
    const ret: DSE = {
        id: dbe.id,
        materializedPath: dbe.materialized_path,
        uuid: dbe.dseUUID,
        entryUUID: dbe.entryUUID ?? undefined,
        rdn,
        objectClass: new Set(objectClasses.map(({ object_class }) => object_class)),
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

    if (dbe.subentry) {
        ret.subentry = {};
        if (ret.objectClass.has(SUBENTRY_CA)) {
            if (collectiveAttributeTypes.length === 0) {
                collectiveAttributeTypes = Array.from(ctx.collectiveAttributes)
                    .map((oid) => ObjectIdentifier.fromString(oid).toBytes());
            }
            ret.subentry.collectiveAttributes = attributesFromValues(
                (await ctx.db.attributeValue.findMany({
                    where: {
                        entry_id: dbe.id,
                        type_oid: {
                            in: collectiveAttributeTypes,
                        },
                    },
                    select: {
                        type_oid: true,
                        tag_class: true,
                        constructed: true,
                        tag_number: true,
                        content_octets: true,
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
        if (ret.objectClass.has(SUBENTRY_PWD)) {
            const pwd_attr = await ctx.db.attributeValue.findFirst({
                where: {
                    entry_id: dbe.id,
                    type_oid: pwdAttribute["&id"].toBytes(),
                },
                select: {
                    tag_class: true,
                    constructed: true,
                    tag_number: true,
                    content_octets: true,
                },
            });
            if (pwd_attr) {
                const el = attributeValueFromDB(pwd_attr);
                ret.subentry.pwdAttribute = el.objectIdentifier;
            }
        }
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

    if (dbe.entry) {
        ret.entry = {};
    }

    if (typeof dbe.hierarchyPath === "string" && Array.isArray(dbe.hierarchyTopDN) && dbe.hierarchyTop_id) {
        ret.hierarchy = {
            level: dbe.hierarchyLevel ?? 0,
            parent: Array.isArray(dbe.hierarchyParentDN)
                ? dbe.hierarchyParentDN.map(rdnFromJson)
                : undefined,
            top: dbe.hierarchyTopDN.map(rdnFromJson),
            path: dbe.hierarchyPath,
            parent_id: dbe.hierarchyParent_id ?? undefined,
            top_id: dbe.hierarchyTop_id,
        };
    }

    if (dbe.admPoint) {
        const administrativeRoles = await ctx.db.attributeValue.findMany({
            where: {
                entry_id: dbe.id,
                type_oid: administrativeRole["&id"].toBytes(),
            },
            select: {
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
            },
        });
        const acSchemeBER = (await ctx.db.attributeValue.findFirst({
            where: {
                entry_id: dbe.id,
                type_oid: accessControlScheme["&id"].toBytes(),
            },
            select: {
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
            },
        }));
        ret.admPoint = {
            administrativeRole: new Set(administrativeRoles
                .map((ar) => attributeValueFromDB(ar)
                    .objectIdentifier
                    .toString()
                )),
            accessControlScheme: acSchemeBER
                ? attributeValueFromDB(acSchemeBER).objectIdentifier
                : undefined,
        };
    }

    return ret;
}

export default dseFromDatabaseEntry;
