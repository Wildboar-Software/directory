import { Context, Vertex } from "@wildboar/meerkat-types";
import { RelativeDistinguishedName } from "@wildboar/pki-stub";
import { Prisma } from "@prisma/client";
import { ASN1Construction, INTEGER } from "@wildboar/asn1";
import getEqualityNormalizer from "../x500/getEqualityNormalizer.js";

// TODO: Use this in modifyDN
export
async function renameEntry (
    ctx: Context,
    target: Vertex,
    superior: Vertex,
    newRDN: RelativeDistinguishedName,
    newGoverningStructureRule?: INTEGER,
): Promise<void> {
    const oldMaterializedPathPrefix: string = (!target.immediateSuperior || target.immediateSuperior.dse.root)
        ? (target.dse.id.toString() + ".")
        : `${target.dse.materializedPath}.${target.dse.id}.`;
    const newMaterializedPath: string = superior.dse.root
        ? ""
        : (superior.dse.materializedPath.length
            ? `${superior.dse.materializedPath}${superior.dse.id.toString() + "."}`
            : superior.dse.id.toString() + ".");
    const materializedPathsToUpdate = await ctx.db.entry.findMany({
        where: {
            materialized_path: {
                startsWith: oldMaterializedPathPrefix,
            },
        },
        select: {
            id: true,
            materialized_path: true,
        },
    });
    await ctx.db.$transaction([
        ctx.db.entry.update({
            where: {
                id: target.dse.id,
            },
            data: {
                immediate_superior_id: superior.dse.id,
                governingStructureRule: Number.isSafeInteger(Number(newGoverningStructureRule))
                    ? Number(newGoverningStructureRule)
                    : undefined,
                materialized_path: newMaterializedPath,
            },
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        }),
        ctx.db.distinguishedValue.deleteMany({
            where: {
                entry_id: target.dse.id,
            },
        }),
        ctx.db.distinguishedValue.createMany({
            data: newRDN.map((atav, i): Prisma.DistinguishedValueCreateManyInput => ({
                entry_id: target.dse.id,
                type_oid: atav.type_.toBytes(),
                tag_class: atav.value.tagClass,
                constructed: (atav.value.construction === ASN1Construction.constructed),
                tag_number: atav.value.tagNumber,
                content_octets: atav.value.value,
                order_index: i,
                normalized_str: getEqualityNormalizer(ctx)?.(atav.type_)?.(ctx, atav.value),
            })),
        }),
        ...materializedPathsToUpdate.map((mp) => ctx.db.entry.update({
            where: {
                id: mp.id,
            },
            data: {
                materialized_path: mp.materialized_path.replace(
                    oldMaterializedPathPrefix,
                    newMaterializedPath.length
                        ? `${newMaterializedPath}.${target.dse.id}.`
                        : target.dse.id.toString() + ".",
                ),
            },
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        })),
    ]);
    if (target.immediateSuperior?.subordinates?.length && (target.immediateSuperior !== superior)) {
        const entryIndex = target.immediateSuperior.subordinates
            .findIndex((child) => (child.dse.uuid === target.dse.uuid));
        target.immediateSuperior.subordinates.splice(entryIndex, 1); // Remove from the current parent.
        superior?.subordinates?.push(target); // Move to the new parent.
    }
}
