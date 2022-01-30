import type { Entry as DatabaseEntry } from "@prisma/client";
import type { Context, Vertex } from "@wildboar/meerkat-types";
import dseFromDatabaseEntry from "./dseFromDatabaseEntry";
import { MAX_RESULTS } from "../constants";

export
async function vertexFromDatabaseEntry (
    ctx: Context,
    superior: Vertex | undefined,
    dbe: DatabaseEntry,
    oneLevel: boolean = false,
): Promise<Vertex> {
    const ret: Vertex = {
        immediateSuperior: superior,
        materializedPath: dbe.materialized_path,
        subordinates: [],
        dse: await dseFromDatabaseEntry(ctx, dbe),
    };
    if (dbe.keep_children_in_database) {
        return ret;
    }
    try {
        ret.subordinates = oneLevel
            ? null
            : await Promise.all(
                (await ctx.db.entry.findMany({
                    take: MAX_RESULTS,
                    where: {
                        deleteTimestamp: null,
                        immediate_superior_id: dbe.id,
                    },
                })).map((child) => vertexFromDatabaseEntry(ctx, ret, child)),
            );
    } catch (e) {
        ctx.log.error(ctx.i18n.t("log:failed_to_decode_subordinates", {
            uuid: ret.dse.uuid,
            e: e,
        }));
    }
    return ret;
}

export default vertexFromDatabaseEntry;
