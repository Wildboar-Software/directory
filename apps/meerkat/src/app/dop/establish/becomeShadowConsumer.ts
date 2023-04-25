import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import dnToVertex from "../../dit/dnToVertex";
import {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import saveAccessPoint from "../../database/saveAccessPoint";
import { Knowledge } from "@prisma/client";
import {
    SupplierInformation,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierInformation.ta";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";

export
async function becomeShadowConsumer (
    ctx: Context,
    agreement: ShadowingAgreementInfo,
    initiator: AccessPoint,
    obid: OperationalBindingID,
): Promise<Vertex> {

    // Create the context prefix
    let materialized_path: string = "";
    let currentRoot = ctx.dit.root;
    for (const rdn of agreement.shadowSubject.area.contextPrefix) {
        const sub = await dnToVertex(ctx, currentRoot, [ rdn ]);
        if (!sub) {
            const { id, dseUUID } = await ctx.db.entry.create({
                data: {
                    glue: true,
                    materialized_path,
                    createTimestamp: new Date(),
                    modifyTimestamp: new Date(),
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
    // Already saved before this is function is called.
    // if (agreement.master) {
    //     await saveAccessPoint(ctx, agreement.master, Knowledge.OB_SHADOW_MASTER, currentRoot.dse.id); // TODO: What type should this be?
    // }
    return currentRoot;
}
