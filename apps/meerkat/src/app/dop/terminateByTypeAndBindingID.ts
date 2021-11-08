import type { Context } from "@wildboar/meerkat-types";
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
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgumentData.ta";
import {
    terminateOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/terminateOperationalBinding.oa";
import { DER } from "asn1-ts/dist/node/functional";

// TODO: I haven't figured out how to meaningfully name / differentiate between this and `terminateByID()`.

export
async function terminateByTypeAndBindingID (
    ctx: Context,
    targetSystem: AccessPoint,
    bindingType: OBJECT_IDENTIFIER,
    bindingID: OperationalBindingID,
): Promise<ResultOrError> {
    const conn = await connect(ctx, targetSystem, dop_ip["&id"]!);
    if (!conn) {
        throw new Error();
    }
    const data = new TerminateOperationalBindingArgumentData(
        bindingType,
        bindingID,
        undefined,
        undefined,
        undefined,
    );
    const arg: TerminateOperationalBindingArgument = {
        unsigned: data,
    };
    return conn.writeOperation({
        opCode: terminateOperationalBinding["&operationCode"]!,
        argument: _encode_TerminateOperationalBindingArgument(arg, DER),
    });
}

export default terminateByTypeAndBindingID;