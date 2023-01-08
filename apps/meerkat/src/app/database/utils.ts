import { Context, Vertex } from "@wildboar/meerkat-types";
import { uniqueIdentifier } from "@wildboar/x500/src/lib/collections/attributes";
import { BERElement } from "asn1-ts";

export
async function read_unique_id (ctx: Context, vertex: Vertex): Promise<typeof uniqueIdentifier["&Type"] | undefined> {
    const unique_id_ber = (await ctx.db.attributeValue.findFirst({
        where: {
            type: uniqueIdentifier["&id"].toString(),
        },
        select: {
            ber: true,
        },
    }))?.ber;
    return unique_id_ber && (() => {
        const el = new BERElement();
        el.fromBytes(unique_id_ber);
        return uniqueIdentifier.decoderFor["&Type"]!(el);
    })();
}
