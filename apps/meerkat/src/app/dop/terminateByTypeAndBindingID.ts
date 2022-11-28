import { ServiceError, ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import type {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import { bindForOBM } from "../net/bindToOtherDSA";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import { OperationOutcome } from "@wildboar/rose-transport";
import {
    TerminateOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResult.ta";

/**
 * @summary Notifies another DSA about a termination of an operational binding.
 * @description
 *
 * This function notifies another DSA about a termination of an operational
 * binding.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param targetSystem The access point of the other affected DSA
 * @param bindingType The object identifier of the binding type
 * @param bindingID The operational binding ID
 * @param aliasDereferenced Whether an alias was dereferenced in the operation leading up to this
 * @returns The DOP terminateOperationalBinding operation outcome
 *
 * @function
 * @async
 */
export
async function terminateByTypeAndBindingID (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    targetSystem: AccessPoint,
    bindingType: OBJECT_IDENTIFIER,
    bindingID: OperationalBindingID,
    aliasDereferenced?: boolean,
    signErrors: boolean = false,
): Promise<OperationOutcome<TerminateOperationalBindingResult>> {
    const conn = await bindForOBM(ctx, assn, undefined, targetSystem, aliasDereferenced, signErrors);
    if (!conn) {
        throw new ServiceError(
            ctx.i18n.t("err:could_not_connect"),
            new ServiceErrorData(
                ServiceProblem_unavailable,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    serviceError["&errorCode"]
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
            ),
            signErrors,
        );
    }
    return conn.terminateOperationalBinding({
        bindingType,
        bindingID,
        _unrecognizedExtensionsList: [],
        cert_path: ctx.config.signing.certPath,
        key: ctx.config.signing.key,
    });
}

export default terminateByTypeAndBindingID;
