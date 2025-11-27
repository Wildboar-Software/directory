import type { Context } from "../types/index.js";
import { getEntryExistsFilter } from "../database/entryExistsFilter.js";

export
async function createDatabaseReport (ctx: Context): Promise<Record<string, any>> {
    return {
        type: "database",
        entries: {
            nonDeleted: await ctx.db.entry.count({
                where: getEntryExistsFilter(),
            }),
            deleted: await ctx.db.entry.count({
                where: {
                    OR: [
                        {
                            deleteTimestamp: {
                                not: null,
                            },
                        },
                        {
                            expiresTimestamp: {
                                lte: new Date(),
                            },
                        },
                    ],
                },
            }),
            glue: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    glue: true,
                },
            }),
            cp: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    cp: true,
                },
            }),
            entry: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    entry: true,
                },
            }),
            subr: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    subr: true,
                },
            }),
            nssr: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    nssr: true,
                },
            }),
            xr: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    xr: true,
                },
            }),
            subentry: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    subentry: true,
                },
            }),
            shadow: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    shadow: true,
                },
            }),
            immSupr: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    immSupr: true,
                },
            }),
            rhob: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    rhob: true,
                },
            }),
            sa: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    sa: true,
                },
            }),
            dsSubentry: await ctx.db.entry.count({
                where: {
                    ...getEntryExistsFilter(),
                    dsSubentry: true,
                },
            }),
            // DSE types that are calculated.
            alias: await ctx.db.alias.count(),
            // admPoint: await ctx.db.entryAdministrativeRole.count({
            //     // Unsupported: See: https://github.com/prisma/prisma/issues/4228
            //     // distinct: ["entry_id"],
            // }),
            objectClasses: await ctx.db.entryObjectClass.groupBy({
                by: ["object_class"],
                _count: true,
            }),
        },
        values: {
            total: await ctx.db.attributeValue.count(),
            byType: await ctx.db.attributeValue.groupBy({
                by: ["type_oid"],
                _count: true,
            }),
        },
        attributeTypes: {
            all: Array.from(ctx.attributeTypes.keys())
                .filter((k) => (k.indexOf(".") > -1)), // human friendly names like "commonName" are indexed too.
            numberFromDatabase: await ctx.db.attributeTypeDescription.count(),
        },
        objectClasses: {
            all: Array.from(ctx.objectClasses.keys())
                .filter((k) => (k.indexOf(".") > -1)), // human friendly names like "person" are indexed too.
            numberFromDatabase: await ctx.db.objectClassDescription.count(),
        },
        matchingRules: {
            all: Array.from(ctx.equalityMatchingRules.keys())
                .filter((k) => (k.indexOf(".") > -1)), // human friendly names like "commonName" are indexed too.
        },
        friendships: {
            numberFromDatabase: await ctx.db.friendship.count(),
        },
        nameForms: {
            all: Array.from(ctx.nameForms.keys())
                .filter((k) => (k.indexOf(".") > -1)), // human friendly names like "commonName" are indexed too.
            numberFromDatabase: await ctx.db.nameForm.count(),
        },
        contexts: {
            total: await ctx.db.contextValue.count(),
            byType: await ctx.db.contextValue.groupBy({
                by: ["type"],
                _count: true,
            }),
            // TODO: Which contexts are most likely to have attribute types.
        },
        accessPoints: {
            all: await ctx.db.accessPoint.findMany({
                select: {
                    knowledge_type: true,
                    ae_title: true,
                    category: true,
                    chainingRequired: true,
                    supplier_is_master: true,
                    active: true,
                    NSAP: {
                        select: {
                            url: true,
                        },
                    },
                },
            }),
        },
        operationalBindings: {
            all: (await ctx.db.operationalBinding.findMany({
                select: {
                    outbound: true,
                    binding_type: true,
                    initiator: true,
                    validity_start: true,
                    validity_end: true,
                    knowledge_type: true,
                    subordinates: true,
                    supply_contexts: true,
                    supplier_initiated: true,
                    periodic_beginTime: true,
                    periodic_windowSize: true,
                    periodic_updateInterval: true,
                    othertimes: true,
                    secondary_shadows: true,
                    source_ip: true,
                    source_tcp_port: true,
                    source_credentials_type: true,
                    requested_time: true,
                    responded_time: true,
                    terminated_time: true,
                    accepted: true,
                    last_update: true,
                    last_ob_problem: true,
                    last_shadow_problem: true,
                },
            }))
                .map((ob) => ({
                    ...ob,
                    validity_start: ob.validity_start.toISOString(),
                    validity_end: ob.validity_end?.toISOString(),
                    requested_time: ob.requested_time.toISOString(),
                    responded_time: ob.responded_time?.toISOString(),
                    terminated_time: ob.terminated_time?.toISOString(),
                    last_update: ob.last_update?.toISOString(),
                })),
        },
    };
}

export default createDatabaseReport;
