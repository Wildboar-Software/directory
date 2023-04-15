import type { Context } from "@wildboar/meerkat-types";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { OperationalBindingInitiator } from "@prisma/client";
import { id_op_binding_non_specific_hierarchical } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";

/**
 * @summary Get active hierarchical operational bindings
 * @description
 *
 * This function returns information about the hierarchical operational bindings
 * that are still active, including NHOBs.
 *
 * @param ctx The context object
 * @param localDSAIsSuperior Whether the local DSA is the superior DSA
 * @returns A promise that resolves Prisma models of an operational binding
 *
 * @function
 */
export
function getRelevantOperationalBindings (ctx: Context, localDSAIsSuperior: boolean = true) {
    const now = new Date();
    return ctx.db.operationalBinding.findMany({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: {
                in: [
                    id_op_binding_hierarchical.toString(),
                    id_op_binding_non_specific_hierarchical.toString(),
                ],
            },
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            AND: [
                {
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
            ],
        },
        select: {
            id: true,
            uuid: true,
            binding_type: true,
            binding_identifier: true,
            binding_version: true,
            initiator: true,
            initiator_ber: true,
            access_point: {
                select: {
                    id: true,
                    ber: true,
                },
            },
            agreement_ber: true,
            validity_start: true,
            validity_end: true,
        },
    });
}

export default getRelevantOperationalBindings;
