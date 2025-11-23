import { Context, Vertex } from "@wildboar/meerkat-types";
import { clearance } from "@wildboar/x500/EnhancedSecurity";
import { uniqueIdentifier } from "@wildboar/x500/SelectedAttributeTypes";
import { attributeValueFromDB } from "./attributeValueFromDB.js";

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

export
async function read_clearance (ctx: Context, vertex: Vertex): Promise<typeof clearance["&Type"][]> {
    if (!ctx.config.rbac.getClearancesFromDSAIT) {
        return [];
    }
    const clearance_bers = await ctx.db.attributeValue.findMany({
        where: {
            entry_id: vertex.dse.id,
            type_oid: clearance["&id"].toBytes(),
        },
        select: {
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    });
    return clearance_bers
        .map(attributeValueFromDB)
        .map(clearance.decoderFor["&Type"]!)
        ;
}
