import type { Context } from "../types";
import { BERElement, ObjectIdentifier } from "asn1-ts";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";

export
async function getRDNFromEntryId (ctx: Context, id: number): Promise<RDN> {
    return (await ctx.db.rDN.findMany({
        where: {
            entry_id: id,
        },
        select: {
            type: true,
            value: true,
        },
    }))
        .map((atav) => new AttributeTypeAndValue(
            ObjectIdentifier.fromString(atav.type),
            (() => {
                const el = new BERElement();
                el.fromBytes(atav.value);
                return el;
            })(),
        ));
}

export default getRDNFromEntryId;
