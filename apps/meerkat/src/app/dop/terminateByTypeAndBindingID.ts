import { ServiceError, ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import type {
    OperationalBindingID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import connect from "../net/connect";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import {
    TerminateOperationalBindingArgument,
    _encode_TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
import {
    TerminateOperationalBindingArgumentData,
    _encode_TerminateOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgumentData.ta";
import {
    terminateOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/terminateOperationalBinding.oa";
import { DER } from "asn1-ts/dist/node/functional";
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
import { generateSIGNED } from "../pki/generateSIGNED";

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
 * @returns A result or error
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
): Promise<ResultOrError> {
    const conn = await connect(ctx, targetSystem, dop_ip["&id"]!, {
        tlsOptional: ctx.config.chaining.tlsOptional,
        signErrors,
    });
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
    const data = new TerminateOperationalBindingArgumentData(
        bindingType,
        bindingID,
        undefined,
        undefined,
        undefined,
    );
    const unsignedArg: TerminateOperationalBindingArgument = {
        unsigned: data,
    };
    const signArgument: boolean = true; // TODO: Make configurable.
    if (!signArgument) {
        return conn.writeOperation({
            opCode: terminateOperationalBinding["&operationCode"]!,
            argument: _encode_TerminateOperationalBindingArgument(unsignedArg, DER),
        });
    }
    const arg = generateSIGNED(ctx, data, _encode_TerminateOperationalBindingArgumentData);
    return conn.writeOperation({
        opCode: terminateOperationalBinding["&operationCode"]!,
        argument: _encode_TerminateOperationalBindingArgument(arg, DER),
    });
}

export default terminateByTypeAndBindingID;
