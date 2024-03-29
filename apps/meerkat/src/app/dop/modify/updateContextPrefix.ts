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
import dnToVertex from "../../dit/dnToVertex";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import { DER } from "asn1-ts/dist/node/functional";
import createEntry from "../../database/createEntry";
import addAttributes from "../../database/entry/addAttributes";
import removeAttribute from "../../database/entry/removeAttribute";
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
import deleteEntry from "../../database/deleteEntry";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import { id_op_binding_shadow } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { updateShadowConsumer } from "../../disp/createShadowUpdate";
import { MeerkatContext } from "../../ctx";

async function partiallyResolveDN (ctx: Context, dn: DistinguishedName): Promise<Vertex> {
    let current: Vertex = ctx.dit.root;
    let i: number = 0;
    let rdn: RelativeDistinguishedName = dn[i];
    while (rdn) {
        const vertex = await dnToVertex(ctx, current, [ rdn ]);
        if (!vertex) {
            break;
        }
        current = vertex;
        rdn = dn[++i];
    }
    return current;
}

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
    ctx: MeerkatContext,
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
    const agreementDN = mod.contextPrefixInfo.map((v) => v.rdn);
    let current_new = await partiallyResolveDN(ctx, agreementDN);
    while (
        current_new
        && current_new.immediateSuperior
        && !current_new.immediateSuperior.dse.entry
    ) {
        current_new = current_new.immediateSuperior;
    }
    const highestDseThatSuperiorDSAMayModify: Vertex = current_new;

    // Can you trust mod.contextPrefixInfo.length? Yes, because the superior DSA may move its entries.
    let immSuprAccessPoints: MasterAndShadowAccessPoints | undefined = undefined;
    let superiorDSAMayModify: boolean = false;
    let currentRoot: Vertex = ctx.dit.root;
    for (let i = 0; i < agreementDN.length; i++) {
        const already_existing_dse = await dnToVertex(ctx, currentRoot, agreementDN.slice(i, i + 1));
        if (already_existing_dse?.dse.id === highestDseThatSuperiorDSAMayModify.dse.id) {
            superiorDSAMayModify = true;
        }
        if (!superiorDSAMayModify && already_existing_dse) {
            currentRoot = already_existing_dse;
            continue;
        }
        if (already_existing_dse) {
            await deleteEntry(ctx, already_existing_dse);
        }
        const vertex = mod.contextPrefixInfo[i];
        const last: boolean = (mod.contextPrefixInfo.length === (i + 1));
        immSuprAccessPoints = vertex.accessPoints;
        const immSupr: boolean = Boolean(immSuprAccessPoints && last);
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
        currentRoot = createdEntry;
    }

    if (mod.immediateSuperiorInfo && currentRoot) {
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
                    entry_id: currentRoot!.dse.id,
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
            subentry: true,
        },
        data: {
            deleteTimestamp: new Date(),
        },
    });
    await ctx.db.entry.updateMany({
        where: {
            immediate_superior_id: oldImmediateSuperior.dse.id,
        },
        data: {
            immediate_superior_id: currentRoot!.dse.id,
        },
    });
    await ctx.db.accessPoint.updateMany({
        where: {
            entry_id: oldImmediateSuperior.dse.id,
        },
        data: {
            entry_id: currentRoot!.dse.id,
        },
    });

    (immSuprAccessPoints ?? [])
        .map((mosap) => new AccessPoint(
            mosap.ae_title,
            mosap.address,
            mosap.protocolInformation,
        ))
        .forEach(async (ap) => { // NOTE: All of these can run in parallel.
            const ber = _encode_AccessPoint(ap, DER).toBytes();
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

    const now = new Date();
    const possibly_related_sobs = await ctx.db.operationalBinding.findMany({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            entry_id: {
                in: (() => {
                    const dse_ids: number[] = [];
                    let current: Vertex | undefined = currentRoot;
                    while (current) {
                        dse_ids.push(current.dse.id);
                        current = current.immediateSuperior;
                    }
                    return dse_ids;
                })(),
            },
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            AND: [
                {
                    OR: [
                        {
                            validity_end: null,
                        },
                        {
                            validity_end: {
                                gte: now,
                            },
                        },
                    ],
                },
                {
                    OR: [ // This DSA is the supplier if one of these conditions are true.
                        { // This DSA initiated an OB in which it is the supplier.
                            initiator: OperationalBindingInitiator.ROLE_A,
                            outbound: true,
                        },
                        { // This DSA accepted an OB from a consumer.
                            initiator: OperationalBindingInitiator.ROLE_B,
                            outbound: false,
                        },
                    ],
                },
            ],
        },
        select: {
            id: true,
            binding_identifier: true,
            agreement_ber: true,
        },
    });
    // TODO: Cascade the incremental updates to secondary shadows instead of performing a total refresh.
    await Promise.all(possibly_related_sobs.map((sob) => updateShadowConsumer(ctx, sob.id, true)));
}

export default updateContextPrefix;
