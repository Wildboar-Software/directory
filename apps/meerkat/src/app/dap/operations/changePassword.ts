import type { Context } from "../../types";
import type {
  ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import type {
  ChangePasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordResult.ta";

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
    arg: ChangePasswordArgument,
): Promise<ChangePasswordResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        null_: null,
    };
}

export default changePassword;
