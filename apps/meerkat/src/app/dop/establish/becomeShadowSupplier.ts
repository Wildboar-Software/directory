import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import saveAccessPoint from "../../database/saveAccessPoint";
import { Knowledge } from "@prisma/client";
import {
    SupplierOrConsumer,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/SupplierOrConsumer.ta";
import {
    ConsumerInformation,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/ConsumerInformation.ta";
import {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";

export
async function becomeShadowSupplier (
    ctx: Context,
    obid: OperationalBindingID,
    cp: Vertex,
    responder: AccessPoint,
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
}