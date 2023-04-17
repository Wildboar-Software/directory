import { Context, Vertex, OperationalBindingError } from "@wildboar/meerkat-types";
import type {
    SuperiorToSubordinateModification,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SuperiorToSubordinateModification.ta";
import {
    MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/SubordinateToSuperior.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import dnToVertex from "../../dit/dnToVertex";
import { Knowledge } from "@prisma/client";
import deleteEntry from "../../database/deleteEntry";
import { DER } from "asn1-ts/dist/node/functional";
import createEntry from "../../database/createEntry";
import getDistinguishedName from "../../x500/getDistinguishedName";
import addAttributes from "../../database/entry/addAttributes";
import removeAttribute from "../../database/entry/removeAttribute";
// import {
//     objectClass,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
// import {
//     entryACI,
// } from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    subentryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/subentryACI.oa";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_invalidBindingType,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    operationalBindingError,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/operationalBindingError.oa";
import {
    AccessPoint,
    _encode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import saveAccessPoint from "../../database/saveAccessPoint";
import dseFromDatabaseEntry from "../../database/dseFromDatabaseEntry";
import { strict as assert } from "assert";
import { NHOBSuperiorToSubordinate } from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSuperiorToSubordinate.ta";

/**
 * @summary Apply an update to a context prefix given by a superior DSA
 * @description
 *
 * This function takes an update to a context prefix given by a superior DSA
 * and applies all of its changes to the local DSEs.
 *
 * @param ctx The context object
 * @param uuid The UUID of the operational binding
 * @param oldAgreementImmediateSuperior The old hierarchical agreement's immediateSuperior
 * @param mod The update to the context prefix
 * @param signErrors Whether to cryptographically sign errors
 *
 * @function
 * @async
 */
export
async function updateContextPrefix (
    ctx: Context,
    uuid: string,
    oldAgreementImmediateSuperior: DistinguishedName,
    mod: SuperiorToSubordinateModification | NHOBSuperiorToSubordinate, // These two types are identical.
    signErrors: boolean,
): Promise<void> {
    const oldDN: DistinguishedName = oldAgreementImmediateSuperior;
    const oldImmediateSuperior = await dnToVertex(ctx, ctx.dit.root, oldDN);
    if (!oldImmediateSuperior) {
        throw new OperationalBindingError(
            ctx.i18n.t("err:could_not_find_supr", { uuid }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidBindingType,
                id_op_binding_hierarchical,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    undefined,
                    undefined,
                    operationalBindingError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                false,
                undefined,
            ),
            signErrors,
        );
    }
    let currentOld: Vertex | undefined = oldImmediateSuperior;
    while (
        currentOld
        && currentOld.immediateSuperior
        && !currentOld.immediateSuperior.dse.entry
    ) {
        currentOld = currentOld.immediateSuperior;
    }
    const highestDseThatSuperiorDSAMayModify: Vertex | undefined = oldImmediateSuperior;
    if (!highestDseThatSuperiorDSAMayModify) {
        throw new Error("29d3463f-f151-4ded-a926-3381a43ac628");
    }
    const highestModifiableDN = getDistinguishedName(highestDseThatSuperiorDSAMayModify);

    let currentRoot = highestDseThatSuperiorDSAMayModify;
    // Can you trust mod.contextPrefixInfo.length? Yes, because the superior DSA may move its entries.
    let immSuprAccessPoints: MasterAndShadowAccessPoints | undefined = undefined;
    for (let i = highestModifiableDN.length - 1; i < mod.contextPrefixInfo.length; i++) {
        const vertex = mod.contextPrefixInfo[i];
        const last: boolean = (mod.contextPrefixInfo.length === (i + 1));
        immSuprAccessPoints = vertex.accessPoints;
        const immSupr: boolean = Boolean(immSuprAccessPoints && last);
        const existingEntry = await dnToVertex(ctx, currentRoot, [ vertex.rdn ]);
        if (!existingEntry) {
            const createdEntry = await createEntry(
                ctx,
                currentRoot,
                vertex.rdn,
                {
                    glue: (!vertex.admPointInfo && !vertex.accessPoints),
                    rhob: Boolean(vertex.admPointInfo),
                    immSupr,
                },
                vertex.admPointInfo ?? [],
                [],
            );
            for (const ap of vertex.accessPoints ?? []) {
                await saveAccessPoint(ctx, ap, Knowledge.SPECIFIC, createdEntry.dse.id);
            }
            const dbe = await ctx.db.entry.findUnique({
                where: {
                    id: createdEntry.dse.id,
                },
                include: {
                    RDN: {
                        select: {
                            type_oid: true,
                            tag_class: true,
                            constructed: true,
                            tag_number: true,
                            content_octets: true,
                        },
                    },
                    EntryObjectClass: {
                        select: {
                            object_class: true,
                        },
                    },
                },
            });
            assert(dbe);
            createdEntry.dse = await dseFromDatabaseEntry(ctx, dbe); // To get it to reload the saved access points.
            for (const subentry of (vertex.subentries ?? [])) {
                await createEntry(
                    ctx,
                    createdEntry,
                    subentry.rdn,
                    {
                        subentry: true,
                        rhob: true,
                    },
                    subentry.info ?? [],
                    [],
                );
            }
            const oldRDN: RDN = oldAgreementImmediateSuperior[i];
            const oldVertex = await dnToVertex(ctx, currentRoot, [ oldRDN ]);
            if (oldVertex) {
                await deleteEntry(ctx, oldVertex);
            }
            currentRoot = createdEntry;
        } else {
            currentRoot = existingEntry;
            if (vertex.admPointInfo) {
                const deletions = (
                    await Promise.all(
                        vertex.admPointInfo
                            .map((attr) => removeAttribute(ctx, currentRoot, attr.type_, []))
                    )
                ).flat();
                await ctx.db.$transaction([
                    ctx.db.attributeValue.deleteMany({
                        where: {
                            entry_id: currentRoot.dse.id,
                        },
                    }),
                    ...deletions,
                    ...await addAttributes(ctx, currentRoot, vertex.admPointInfo, undefined, false, signErrors),
                ]);
                for (const subentry of vertex.subentries ?? []) {
                    const oldSubentry = await dnToVertex(ctx, currentRoot, [ subentry.rdn ]);
                    if (!oldSubentry) {
                        await createEntry(
                            ctx,
                            currentRoot,
                            subentry.rdn,
                            {
                                subentry: true,
                                rhob: true,
                            },
                            subentry.info ?? [],
                            [],
                        );
                        continue;
                    }
                    const subentryDeletions = (
                        await Promise.all(
                            [
                                commonName["&id"],
                                subtreeSpecification["&id"],
                                prescriptiveACI["&id"],
                            ]
                                .map((type_) => removeAttribute(ctx, oldSubentry, type_, [])),
                        )
                    ).flat();
                    const subentryInfoDeletions = (
                        await Promise.all(
                            subentry.info
                                .map((attr) => removeAttribute(ctx, oldSubentry, attr.type_, []))
                        )
                    ).flat();
                    await ctx.db.$transaction([
                        ctx.db.attributeValue.deleteMany({
                            where: {
                                entry_id: oldSubentry.dse.id,
                            },
                        }),
                        ...subentryDeletions,
                        ...subentryInfoDeletions,
                        ...await addAttributes(ctx, currentRoot, subentry.info, undefined, false, signErrors),
                    ]);
                }
            } else { // This point is no longer an administrative point, or never was.
                const deletions = (
                    await Promise.all(
                        [
                            administrativeRole["&id"],
                            accessControlScheme["&id"],
                            subentryACI["&id"],
                        ]
                            .map((type_) => removeAttribute(ctx, currentRoot, type_)),
                    )
                ).flat();
                await ctx.db.$transaction(deletions);
            }
            if (currentRoot.dse.shadow) {
                continue; // We don't modify shadow entries.
            }
        }
    }

    if (mod.immediateSuperiorInfo) {
        const deletions = (
            await Promise.all(
                mod.immediateSuperiorInfo
                    // .filter((attr) => (
                    //     attr.type_.isEqualTo(objectClass["&id"])
                    //     || attr.type_.isEqualTo(entryACI["&id"])
                    // ))
                    .map((attr) => removeAttribute(ctx, currentRoot, attr.type_))
            )
        ).flat();
        await ctx.db.$transaction([
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: currentRoot.dse.id,
                    // type_oid: {
                    //     notIn: [
                    //         objectClass["&id"].toBytes(),
                    //         entryACI["&id"].toBytes(),
                    //     ],
                    // },
                },
            }),
            ...deletions,
            ...await addAttributes(ctx, currentRoot, mod.immediateSuperiorInfo, undefined, false, signErrors),
        ]);
    }

    // This should not be present in a Sup2SubModification.
    // if (sup2sub.entryInfo) {
    //     const values = sup2sub.entryInfo.flatMap((attr) => valuesFromAttribute(attr));
    //     await writeEntryAttributes(ctx, subr, values);
    // }

    await ctx.db.entry.updateMany({
        where: {
            immediate_superior_id: oldImmediateSuperior.dse.id,
        },
        data: {
            immediate_superior_id: currentRoot.dse.id,
        },
    });

    (immSuprAccessPoints ?? [])
        .map((mosap) => new AccessPoint(
            mosap.ae_title,
            mosap.address,
            mosap.protocolInformation,
        ))
        .forEach(async (ap) => { // NOTE: All of these can run in parallel.
            const ber = Buffer.from(_encode_AccessPoint(ap, DER).toBytes().buffer);
            const alreadySavedAccessPoint = await ctx.db.accessPoint.findFirst({
                where: {
                    ber,
                    knowledge_type: Knowledge.SUPERIOR,
                    active: true,
                },
                select: {
                    id: true,
                },
            });
            if (alreadySavedAccessPoint) {
                return;
            }
            saveAccessPoint(ctx, ap, Knowledge.SUPERIOR, ctx.dit.root.dse.id); // INTENTIONAL_NO_AWAIT
        });
}

export default updateContextPrefix;
