import type { Context } from "../../types";
import * as errors from "../../errors";
import type {
    TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
import type {
    TerminateOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgumentData.ta";
import type {
    TerminateOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResult.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
// import {
//     id_op_binding_non_specific_hierarchical,
// } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
// import {
//     id_op_binding_shadow,
// } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import {
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import type {
    Time,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Time.ta";
import { DERElement } from "asn1-ts";
import removeSubordinate from "../terminate/removeSubordinate";
import removeSuperior from "../terminate/removeSuperior";
import { OperationalBindingInitiator } from "@prisma/client";
import { differenceInMilliseconds } from "date-fns";

function getDateFromOBTime (time: Time): Date {
    if ("utcTime" in time) {
        return time.utcTime;
    } else {
        return time.generalizedTime;
    }
}

export
async function terminateOperationalBinding (
    ctx: Context,
    arg: TerminateOperationalBindingArgument,
): Promise<TerminateOperationalBindingResult> {
    const data: TerminateOperationalBindingArgumentData = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;

    const NOT_SUPPORTED_ERROR = new errors.OperationalBindingError(
        `Operational binding type ${data.bindingType.toString()} not understood.`,
        {
            unsigned: new OpBindingErrorParam(
                OpBindingErrorParam_problem_unsupportedBindingType,
                data.bindingType,
                undefined,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        },
    );

    const opBindings = await ctx.db.operationalBinding.findMany({
        where: {
            binding_identifier: data.bindingID.identifier,
            binding_type: {
                equals: data.bindingType.nodes,
            },
        },
    });

    const now = new Date();
    const terminationTime: Date = data.terminateAt
        ? getDateFromOBTime(data.terminateAt)
        : now;

    // TODO: Verify that the terminated OB belongs to the remote DSA!

    switch (data.bindingType.toString()) {
        case (id_op_binding_hierarchical.toString()): {
            for (const ob of opBindings) {
                const el = new DERElement();
                el.fromBytes(ob.agreement_ber);
                const agreement = _decode_HierarchicalAgreement(el);
                const iAmSuperior: boolean = (
                    // The initiator was the superior and this DSA was the initiator...
                    ((ob.initiator === OperationalBindingInitiator.ROLE_A) && (ob.outbound))
                    // ...or, the initiator was the subordinate, and this DSA was NOT the initiator.
                    || ((ob.initiator === OperationalBindingInitiator.ROLE_B) && (!ob.outbound))
                );
                setTimeout(() => {
                    if (iAmSuperior) {
                        removeSubordinate(ctx, agreement);
                    } else {
                        removeSuperior(ctx, agreement);
                    }
                }, Math.max(differenceInMilliseconds(terminationTime, now), 1000));
                // TODO: When the DSA starts up, set timers to terminate OBs.
            }
            await ctx.db.operationalBinding.updateMany({
                where: {
                    binding_identifier: data.bindingID.identifier,
                    binding_type: {
                        equals: data.bindingType.nodes,
                    },
                },
                data: {
                    terminated_time: terminationTime,
                },
            });
            return {
                null_: null,
            };
        }
        default: {
            throw NOT_SUPPORTED_ERROR;
        }
    }
}

export default terminateOperationalBinding;
