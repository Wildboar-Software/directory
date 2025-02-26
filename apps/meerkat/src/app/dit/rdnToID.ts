import type { Context } from "@wildboar/meerkat-types";
import { ASN1Construction, OBJECT_IDENTIFIER } from "asn1-ts";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import { getEntryExistsFilter } from "../database/entryExistsFilter";
import getEqualityNormalizer from "../x500/getEqualityNormalizer";
import { Prisma } from "@prisma/client";

/**
 * @summary Determine the database ID of a subordinate by its RDN
 * @description
 *
 * This function takes an immediate superior DSE's database ID and a
 * sought-after relative distinguished name (RDN) and returns a database ID of
 * a subordinate whose RDN matched that which was supplied, if one exists, or
 * `undefined` if none matched.
 *
 * @param ctx The context object
 * @param superior_id The database ID of the immediately superior entry
 * @param rdn The sought-after relative distinguished name (RDN)
 * @returns The database ID of the subordinate having that RDN, if it exists, or
 *  `undefined` otherwise.
 *
 * @function
 * @async
 */
export
async function rdnToID (
    ctx: Context,
    superior_id: number,
    rdn: RDN,
): Promise<number | undefined> {
    const NORMALIZER_GETTER = getEqualityNormalizer(ctx);
    let use_normalized_rdn_search: boolean = true;
    const atav_strs: [type: OBJECT_IDENTIFIER, value: string][] = [];
    for (const atav of rdn) {
        const normalized_value: string | undefined = NORMALIZER_GETTER(atav.type_)?.(ctx, atav.value);
        if (!normalized_value) {
            use_normalized_rdn_search = false;
            break;
        }
        atav_strs.push([ atav.type_, normalized_value ]);
    }
    const exactMatch = await ctx.db.entry.findFirst({
        where: use_normalized_rdn_search
            ? {
                immediate_superior_id: superior_id,
                ...getEntryExistsFilter(),
                AND: atav_strs.map(([ type_, str ]): Prisma.EntryWhereInput => ({
                    RDN: {
                        some: {
                            type_oid: type_.toBytes(),
                            normalized_str: str,
                        },
                    },
                })),
            }
            : {
                immediate_superior_id: superior_id,
                ...getEntryExistsFilter(),
                AND: rdn.map((atav) => ({
                    RDN: {
                        some: {
                            type_oid: atav.type_.toBytes(),
                            tag_class: atav.value.tagClass,
                            constructed: (atav.value.construction === ASN1Construction.constructed),
                            tag_number: atav.value.tagNumber,
                            content_octets: atav.value.value,
                        },
                    },
                })),
            },
        select: {
            id: true,
        },
        orderBy: {
            id: "desc", // Theory: newer IDs are more likely to be queried.
        },
    });
    return exactMatch?.id;
}

export default rdnToID;
