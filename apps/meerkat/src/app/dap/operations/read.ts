import type { Context } from "../../types";
import type {
  ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import type {
  ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
  ReadResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResultData.ta";
import {
  EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";

// read OPERATION ::= {
//   ARGUMENT  ReadArgument
//   RESULT    ReadResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-read }

// ReadArgument ::= OPTIONALLY-PROTECTED { ReadArgumentData }

// ReadArgumentData ::= SET {
//   object               [0]  Name,
//   selection            [1]  EntryInformationSelection DEFAULT {},
//   modifyRightsRequest  [2]  BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF             CommonArguments }

// ReadResult ::= OPTIONALLY-PROTECTED { ReadResultData }

// ReadResultData ::= SET {
//   entry         [0]  EntryInformation,
//   modifyRights  [1]  ModifyRights OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF      CommonResults }

// ModifyRights ::= SET OF SEQUENCE {
//   item      CHOICE {
//     entry      [0]  NULL,
//     attribute  [1]  AttributeType,
//     value      [2]  AttributeValueAssertion,
//     ...},
//   permission   [3]  BIT STRING {
//     add     (0),
//     remove  (1),
//     rename  (2),
//     move    (3)},
//   ... }

export
async function read (
    ctx: Context,
    arg: ReadArgument,
): Promise<ReadResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        unsigned: new ReadResultData(
        new EntryInformation(
            {
            rdnSequence: [],
            },
            false,
            [],
            true,
            true,
            false,
            [],
        ),
        undefined,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
        )
    };
}

export default read;
