import type { Context } from "@wildboar/meerkat-types";

export
async function createDatabaseReport (ctx: Context): Promise<Record<string, any>> {
    return {
        type: "database",
        entries: {
            nonDeleted: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                },
            }),
            deleted: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: {
                        not: null,
                    },
                },
            }),
            glue: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    glue: true,
                },
            }),
            cp: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    cp: true,
                },
            }),
            entry: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    entry: true,
                },
            }),
            subr: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    subr: true,
                },
            }),
            nssr: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    nssr: true,
                },
            }),
            xr: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    xr: true,
                },
            }),
            subentry: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    subentry: true,
                },
            }),
            shadow: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    shadow: true,
                },
            }),
            immSupr: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    immSupr: true,
                },
            }),
            rhob: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    rhob: true,
                },
            }),
            sa: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    sa: true,
                },
            }),
            dsSubentry: await ctx.db.entry.count({
                where: {
                    deleteTimestamp: null,
                    dsSubentry: true,
                },
            }),
            // DSE types that are calculated.
            alias: await ctx.db.alias.count(),
            admPoint: await ctx.db.entryAdministrativeRole.count({
                distinct: ["entry_id"],
            }),
            objectClasses: await ctx.db.entryObjectClass.groupBy({
                by: ["object_class"],
                _count: true,
            }),
        },
        values: {
            total: await ctx.db.attributeValue.count(),
            byType: await ctx.db.attributeValue.groupBy({
                by: ["type"],
                _count: {},
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
            numberFromDatabase: await ctx.db.nameForm.count(),
        },
        contexts: {
            total: await ctx.db.contextValue.count(),
            byType: await ctx.db.contextValue.groupBy({
                by: ["type"],
                _count: {},
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
