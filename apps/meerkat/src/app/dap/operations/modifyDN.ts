import type { Context } from "../../types";
import type {
  ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import type {
  ModifyDNResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNResult.ta";

// modifyDN OPERATION ::= {
//   ARGUMENT  ModifyDNArgument
//   RESULT    ModifyDNResult
//   ERRORS    {nameError |
//              serviceError |
//              referral |
//              securityError |
//              updateError}
//   CODE      id-opcode-modifyDN }

// ModifyDNArgument ::= OPTIONALLY-PROTECTED { ModifyDNArgumentData }

// ModifyDNArgumentData ::= SET {
//   object        [0]  DistinguishedName,
//   newRDN        [1]  RelativeDistinguishedName,
//   deleteOldRDN  [2]  BOOLEAN DEFAULT FALSE,
//   newSuperior   [3]  DistinguishedName OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF      CommonArguments }

// ModifyDNResult ::= CHOICE {
//   null         NULL,
//   information  OPTIONALLY-PROTECTED-SEQ { ModifyDNResultData },
//   ... }

// ModifyDNResultData ::= SEQUENCE {
//   newRDN        RelativeDistinguishedName,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

export
async function modifyDN (
    ctx: Context,
    arg: ModifyDNArgument,
): Promise<ModifyDNResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        null_: null,
    };
}

export default modifyDN;
