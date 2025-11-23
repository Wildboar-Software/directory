import type { MeerkatContext } from "../../ctx.js";
import type { Vertex } from "@wildboar/meerkat-types";
import {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import saveAccessPoint from "../../database/saveAccessPoint.js";
import { Knowledge } from "@prisma/client";
import {
    SupplierOrConsumer,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    ConsumerInformation,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    OperationalBindingID,
} from "@wildboar/x500/OperationalBindingManagement";
import scheduleShadowUpdates from "../../disp/scheduleShadowUpdates.js";
import { ShadowingAgreementInfo } from "@wildboar/x500/DirectoryShadowAbstractService";

/**
 * @summary Become a shadow supplier by updating local consumer knowledge and scheduling updates
 * @description
 *
 * This function is called to make the local DSA assume the role of a shadow
 * supplier with respect to a given shadowing agreement. In particular, it
 * updates local consumer references and schedules the recurring shadow updates,
 * if there are any.
 *
 * @param ctx The context object
 * @param obid The shadow operational binding identifier
 * @param cp The context prefix vertex that forms the root of the shadowed subtree
 * @param responder The correspondent access point
 * @param agreement The shadowing agreement
 * @param ob_db_id The operational binding database ID
 * @param ob_time The time the operational binding took effect
 *
 * @async
 * @function
 */
export
async function becomeShadowSupplier (
    ctx: MeerkatContext,
    obid: OperationalBindingID,
    cp: Vertex,
    responder: AccessPoint,
    agreement: ShadowingAgreementInfo,
    ob_db_id: number,
    ob_time: Date,
): Promise<void> {
    const consumer: ConsumerInformation = new SupplierOrConsumer(
        responder.ae_title,
        responder.address,
        responder.protocolInformation,
        obid,
    );
    await saveAccessPoint(ctx, consumer, Knowledge.CONSUMER, cp.dse.id);
    if (cp.dse.cp) {
        if (!cp.dse.cp.consumerKnowledge) {
            cp.dse.cp.consumerKnowledge = [];
        }
        cp.dse.cp.consumerKnowledge.push(consumer);
    } else {
        cp.dse.cp = {
            consumerKnowledge: [ consumer ],
        };
    }
    scheduleShadowUpdates(ctx, agreement, ob_db_id, Number(obid.identifier), ob_time, true);
}
