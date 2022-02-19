import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier, BERElement } from "asn1-ts";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import listSubordinates from "./listSubordinates";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

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
    const exactMatch = await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: superior_id,
            deleteTimestamp: null,
            AND: rdn.map((atav) => ({
                RDN: {
                    some: {
                        type: atav.type_.toString(),
                        value: Buffer.from(atav.value.toBytes()),
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
    if (exactMatch) {
        return exactMatch.id;
    }
    let rdnMatched: boolean = false;
    let cursorId: number | undefined;
    const getNextBatchOfSubordinates = async () => {
        if (rdnMatched) {
            return [];
        }
        return listSubordinates(
            ctx,
            superior_id,
            ctx.config.entriesPerSubordinatesPage,
            undefined,
            cursorId,
            {
                AND: rdn.map((atav) => ({
                    RDN: {
                        some: {
                            type: atav.type_.toString(),
                        },
                    },
                })),
            },
        );
    };
    let subordinatesInBatch = await getNextBatchOfSubordinates();
    while (subordinatesInBatch.length) {
        for (const subordinate of subordinatesInBatch) {
            cursorId = subordinate.id;
            const subordinateRDN = subordinate.RDN.map((atav) => new AttributeTypeAndValue(
                ObjectIdentifier.fromString(atav.type),
                (() => {
                    const el = new BERElement();
                    el.fromBytes(atav.value);
                    return el;
                })(),
            ));
            rdnMatched = compareRDN(
                rdn,
                subordinateRDN,
                getNamingMatcherGetter(ctx),
            );
            if (rdnMatched) {
                return subordinate.id;
            }
        }
        subordinatesInBatch = await getNextBatchOfSubordinates();
    }
}

export default rdnToID;
