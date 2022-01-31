import type { Context } from "@wildboar/meerkat-types";
import type DOPAssociation from "../DOPConnection";
import * as errors from "@wildboar/meerkat-types";
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
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
    OpBindingErrorParam_problem_invalidID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import type {
    Time,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Time.ta";
import {
    _decode_PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import { BERElement } from "asn1-ts";
import { differenceInMilliseconds } from "date-fns";
import compareSocketToNSAP from "@wildboar/x500/src/lib/distributed/compareSocketToNSAP";
import { Knowledge } from "@prisma/client";
import terminate from "../terminateByID";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-err-operationalBindingError.va";
import { setTimeout as safeSetTimeout } from "safe-timers";

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
    conn: DOPAssociation,
    arg: TerminateOperationalBindingArgument,
): Promise<TerminateOperationalBindingResult> {
    const data: TerminateOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    const NOT_SUPPORTED_ERROR = new errors.OperationalBindingError(
        `Operational binding type ${data.bindingType.toString()} not understood.`,
        {
            unsigned: new OpBindingErrorParam(
                OpBindingErrorParam_problem_unsupportedBindingType,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    undefined,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        },
    );

    /**
     * We first identify all of the access points that correspond to the socket
     * that originated this request. These access points are used to filter out
     * the operational bindings that the remote DSA may modify, terminate, or
     * even know about. (Otherwise, a rogue DSA would be able to modify the
     * operational bindings of other DSAs.)
     */
    const permittedAPs = (await ctx.db.accessPoint.findMany({
        where: {
            knowledge_type: Knowledge.OB_REQUEST,
            active: true,
        },
    }))
        .filter((ap) => {
            const el = new BERElement();
            el.fromBytes(ap.ber);
            // This is a simpler way to get the address out of the AP type.
            const address = el.set.find((component) => (component.tagNumber === 1));
            if (!address) {
                return false;
            }
            const pa = _decode_PresentationAddress(address);
            return pa.nAddresses.some((naddr) => compareSocketToNSAP(conn.idm.s, naddr));
        })
        .map((ap) => ap.id);

    if (permittedAPs.length === 0) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            },
        );
    }

    const opBindingWhere = {
        binding_identifier: Number(data.bindingID.identifier),
        binding_type: {
            equals: data.bindingType.toString(),
        },
        access_point_id: {
            in: permittedAPs,
        },
    };

    const opBindings = await ctx.db.operationalBinding.findMany({
        where: opBindingWhere,
    });

    if (opBindings.length === 0) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            {
                unsigned: new OpBindingErrorParam(
                    OpBindingErrorParam_problem_invalidID,
                    data.bindingType,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        id_err_operationalBindingError,
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    undefined,
                    undefined,
                ),
            },
        );
    }

    const now = new Date();
    const terminationTime: Date = data.terminateAt
        ? getDateFromOBTime(data.terminateAt)
        : now;

    switch (data.bindingType.toString()) {
        case (id_op_binding_hierarchical.toString()): {
            for (const ob of opBindings) {
                safeSetTimeout(
                    () => terminate(ctx, ob.id),
                    Math.max(differenceInMilliseconds(terminationTime, now), 1000),
                );
            }
            await ctx.db.operationalBinding.updateMany({
                where: opBindingWhere,
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
