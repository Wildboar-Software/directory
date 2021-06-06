import type { Context } from "../../types";
import type {
  CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
  CompareResult, CompareResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";

// compare OPERATION ::= {
//   ARGUMENT  CompareArgument
//   RESULT    CompareResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-compare }

// CompareArgument ::= OPTIONALLY-PROTECTED { CompareArgumentData }

// CompareArgumentData ::= SET {
//   object       [0]  Name,
//   purported    [1]  AttributeValueAssertion,
//   ...,
//   ...,
//   COMPONENTS OF     CommonArguments }

// CompareResult ::= OPTIONALLY-PROTECTED { CompareResultData }

// CompareResultData ::= SET {
//   name                 Name OPTIONAL,
//   matched         [0]  BOOLEAN,
//   fromEntry       [1]  BOOLEAN DEFAULT TRUE,
//   matchedSubtype  [2]  AttributeType OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF        CommonResults }

export
async function compare (
    ctx: Context,
    arg: CompareArgument,
): Promise<CompareResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        unsigned: new CompareResultData(
        undefined,
        true,
        undefined,
        undefined,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
        ),
    };
}

export default compare;
