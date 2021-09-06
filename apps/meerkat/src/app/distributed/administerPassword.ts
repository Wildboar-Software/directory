import type { Context, Vertex } from "../types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    AdministerPasswordArgument,
    _decode_AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import {
    AdministerPasswordResult,
    _encode_AdministerPasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordResult.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

// administerPassword OPERATION ::= {
//   ARGUMENT  AdministerPasswordArgument
//   RESULT    AdministerPasswordResult
//   ERRORS    {securityError |
//              updateError}
//   CODE      id-opcode-administerPassword }

// AdministerPasswordArgument ::=
//   OPTIONALLY-PROTECTED-SEQ { AdministerPasswordArgumentData }

// AdministerPasswordArgumentData ::= SEQUENCE {
//   object  [0]  DistinguishedName,
//   newPwd  [1]  UserPwd,
//   ... }

// AdministerPasswordResult ::= CHOICE {
//   null NULL,
//   information OPTIONALLY-PROTECTED-SEQ { AdministerPasswordResultData },
//   ...}

// AdministerPasswordResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

export
async function administerPassword (
    ctx: Context,
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument: AdministerPasswordArgument = _decode_AdministerPasswordArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const result: AdministerPasswordResult = {
        null_: null,
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_AdministerPasswordResult(result, DER),
    );
}

export default administerPassword;
