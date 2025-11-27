import { MeerkatContext } from "../../ctx.js";
import type { Vertex } from "../../types/index.js";
import {
    ShadowingAgreementInfo,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import dnToVertex from "../../dit/dnToVertex.js";
import {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import saveAccessPoint from "../../database/saveAccessPoint.js";
import { Knowledge } from "../../generated/client.js";
import {
    SupplierInformation,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import scheduleShadowUpdates from "../../disp/scheduleShadowUpdates.js";
import { ASN1Construction } from "@wildboar/asn1";
import getEqualityNormalizer from "../../x500/getEqualityNormalizer.js";

/**
 * @summary Become a shadow supplier by creating a local context prefix and scheduling updates
 * @description
 *
 * This function is called to make the local DSA assume the role of a shadow
 * consumer with respect to a given shadowing agreement. In particular, it
 * creates the local context prefix, updates supplier knowledge references, and
 * schedules the recurring shadow updates if there are any.
 *
 * @param ctx The context object
 * @param agreement The shadowing agreement
 * @param initiator The correspondent access point
 * @param obid The shadowing operational binding identifier
 * @param ob_db_id The database ID of the operational binding
 * @param ob_time The start time of the operational binding
 * @returns The context prefix vertex of the newly established naming context
 *
 * @async
 * @function
 */
export
async function becomeShadowConsumer (
    ctx: MeerkatContext,
    agreement: ShadowingAgreementInfo,
    initiator: AccessPoint,
    obid: OperationalBindingID,
    ob_db_id: number,
    ob_time: Date,
): Promise<Vertex> {

    // Create the context prefix
    let materialized_path: string = "";
    let currentRoot = ctx.dit.root;
    const NORMALIZER_GETTER = getEqualityNormalizer(ctx);
    for (const rdn of agreement.shadowSubject.area.contextPrefix) {
        const sub = await dnToVertex(ctx, currentRoot, [ rdn ]);
        if (!sub) {
            const { id, dseUUID } = await ctx.db.entry.create({
                data: {
                    immediate_superior_id: currentRoot.dse.id,
                    glue: true,
                    materialized_path,
                    createTimestamp: new Date(),
                    modifyTimestamp: new Date(),
                    RDN: {
                        createMany: {
                            data: rdn.map((atav, i) => ({
                                type_oid: atav.type_.toBytes(),
                                tag_class: atav.value.tagClass,
                                constructed: (atav.value.construction === ASN1Construction.constructed),
                                tag_number: atav.value.tagNumber,
                                content_octets: atav.value.value,
                                order_index: i,
                                normalized_str: NORMALIZER_GETTER(atav.type_)?.(ctx, atav.value),
                            })),
                        },
                    },
                },
                select: {
                    id: true,
                    dseUUID: true,
                },
            });
            const vertex: Vertex = {
                immediateSuperior: currentRoot,
                dse: {
                    id,
                    materializedPath: materialized_path,
                    objectClass: new Set(),
                    rdn,
                    uuid: dseUUID,
                },
                subordinates: null,
            };
            currentRoot = vertex;
        } else {
            currentRoot = sub;
        }
        materialized_path += `${currentRoot.dse.id}.`;
    }

    // Make the last DSE in the context prefix a cp and shadow.
    // The specifications are not clear at all what this DSE should be.
    await ctx.db.entry.update({
        where: {
            id: currentRoot.dse.id,
        },
        data: {
            glue: false,
            cp: true,
            // shadow: true,
        },
        select: {
            id: true,
        },
    });
    currentRoot.dse.glue = false;

    // By updating the OB here, you avoid a race condition where the DISP request
    // is sent before the OB is "complete."
    await ctx.db.operationalBinding.update({
        where: {
            id: ob_db_id,
        },
        data: {
            entry_id: currentRoot.dse.id,
        },
        select: {
            id: true,
        },
    });

    // Specifically, how does supplier-is-master get populated?
    // DEVIATION: If agreement.master is set, we assume the supplier is not master.
    const supplier_is_master: boolean = !agreement.master;
    const supplier = new SupplierInformation(
        initiator.ae_title,
        initiator.address,
        initiator.protocolInformation,
        obid,
        supplier_is_master,
        agreement.master,
    );
    await saveAccessPoint(ctx, supplier, Knowledge.SUPPLIER, currentRoot.dse.id);

    if (currentRoot.dse.cp) {
        if (!currentRoot.dse.cp.supplierKnowledge) {
            currentRoot.dse.cp.supplierKnowledge = [];
        }
        currentRoot.dse.cp.supplierKnowledge.push(supplier);
    } else {
        currentRoot.dse.cp = {};
        currentRoot.dse.cp.supplierKnowledge = [ supplier ];
    }
    scheduleShadowUpdates(ctx, agreement, ob_db_id, Number(obid.identifier), ob_time, false);
    // Already saved before this is function is called.
    // if (agreement.master) {
    //     await saveAccessPoint(ctx, agreement.master, Knowledge.OB_SHADOW_MASTER, currentRoot.dse.id); // TODO: What type should this be?
    // }
    return currentRoot;
}
