import type { Context } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { getRDNFromEntryId } from "./getRDNFromEntryId";

/**
 * @summary Get the distinguished name (DN) of a DSE
 * @description
 *
 * This function retrieves the distinguished name of a DSE from the
 * database, converting it to the strongly-typed `DN` from the `@wildboar/x500`
 * NPM package.
 *
 * @param ctx The context object
 * @param id The database ID of the entry to be queried
 * @returns The distinguished name of the entry
 *
 * @function
 * @async
 */
export
async function getDNFromEntryId (ctx: Context, id: number): Promise<DistinguishedName> {
    const dn: DistinguishedName = [];
    let currentId: number | undefined | null = id;
    while (typeof currentId === "number") {
        const current = await ctx.db.entry.findUnique({
            where: {
                id: currentId,
            },
            select: {
                immediate_superior_id: true,
            },
        });
        if (!current) {
            break;
        }
        const rdn = await getRDNFromEntryId(ctx, currentId);
        if (rdn.length === 0) {
            break;
        }
        dn.push(rdn);
        currentId = current.immediate_superior_id;
    }
    dn.reverse();
    return dn;
}

export default getDNFromEntryId;
