import { Context, Vertex } from "@wildboar/meerkat-types";
import { uniqueIdentifier } from "@wildboar/x500/src/lib/collections/attributes";
import { attributeValueFromDB } from "./attributeValueFromDB";

export
async function read_unique_id (ctx: Context, vertex: Vertex): Promise<typeof uniqueIdentifier["&Type"] | undefined> {
    const unique_id_ber = (await ctx.db.attributeValue.findFirst({
        where: {
            entry_id: vertex.dse.id,
            type_oid: uniqueIdentifier["&id"].toBytes(),
        },
        select: {
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    }));
    if (!unique_id_ber) {
        return undefined;
    }
    const el = attributeValueFromDB(unique_id_ber);
    return uniqueIdentifier.decoderFor["&Type"]!(el);
}
