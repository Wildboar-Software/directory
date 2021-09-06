import type { Context, Vertex } from "../types";
import * as errors from "../errors";
import { DER } from "asn1-ts/dist/node/functional";
import {
    ChangePasswordArgument,
    _decode_ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import {
    ChangePasswordResult,
    _encode_ChangePasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordResult.ta";
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
import setEntryPassword from "../database/setEntryPassword";
import attemptPassword from "../authn/attemptPassword";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";

// changePassword OPERATION ::= {
//   ARGUMENT  ChangePasswordArgument
//   RESULT    ChangePasswordResult
//   ERRORS    {securityError |
//              updateError }
//   CODE      id-opcode-changePassword }

// ChangePasswordArgument ::= OPTIONALLY-PROTECTED-SEQ { ChangePasswordArgumentData }

// ChangePasswordArgumentData ::= SEQUENCE {
//   object   [0]  DistinguishedName,
//   oldPwd   [1]  UserPwd,
//   newPwd   [2]  UserPwd,
//   ... }

// ChangePasswordResult ::= CHOICE {
//   null        NULL,
//   information OPTIONALLY-PROTECTED-SEQ { ChangePasswordResultData },
//   ...}

// ChangePasswordResultData ::= SEQUENCE {
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

export
async function changePassword (
    ctx: Context,
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument: ChangePasswordArgument = _decode_ChangePasswordArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const oldPasswordIsCorrect: boolean | undefined = await attemptPassword(ctx, target, {
        userPwd: data.oldPwd,
    });
    if (!oldPasswordIsCorrect) {
        throw new errors.SecurityError(
            "Old password incorrect in changePassword operation.",
            new SecurityErrorData(
                SecurityProblem_noInformation,
                undefined,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    // TODO: Access control.
    await setEntryPassword(ctx, target, data.newPwd);
    /* Note that the specification says that we should update hierarchical
    operational bindings, but really, no other DSA should have the passwords for
    entries in this DSA. Meerkat DSA will take a principled stance and refuse
    to update HOBs when a password changes. */
    const result: ChangePasswordResult = {
        null_: null,
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_ChangePasswordResult(result, DER),
    );
}

export default changePassword;
