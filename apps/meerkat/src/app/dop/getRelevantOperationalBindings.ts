import type { Context } from "@wildboar/meerkat-types";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { OperationalBindingInitiator } from "@prisma/client";

export
function getRelevantOperationalBindings (ctx: Context, localDSAIsSuperior: boolean = true) {
    const now = new Date();
    return ctx.db.operationalBinding.findMany({
        where: {
            binding_type: id_op_binding_hierarchical.toString(),
            validity_start: {
                gte: now,
            },
            validity_end: {
                lte: now,
            },
            accepted: true,
            OR: [
                { // Local DSA initiated role A (meaning local DSA is superior.)
                    initiator: OperationalBindingInitiator.ROLE_A,
                    outbound: localDSAIsSuperior,
                },
                { // Remote DSA initiated role B (meaning local DSA is superior again.)
                    initiator: OperationalBindingInitiator.ROLE_B,
                    outbound: !localDSAIsSuperior,
                },
            ],
        },
        select: {
            uuid: true,
            binding_identifier: true,
            binding_version: true,
            access_point: true,
            agreement_ber: true,
        },
    });
}

export default getRelevantOperationalBindings;
