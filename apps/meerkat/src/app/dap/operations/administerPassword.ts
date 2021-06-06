import type { Context } from "../../types";
import type {
  AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import type {
  AdministerPasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordResult.ta";

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
    arg: AdministerPasswordArgument,
): Promise<AdministerPasswordResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        null_: null,
    };
}

export default administerPassword;
