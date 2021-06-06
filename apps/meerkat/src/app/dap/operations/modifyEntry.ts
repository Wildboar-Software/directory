import type { Context } from "../../types";
import type {
  ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import type {
  ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";

// modifyEntry OPERATION ::= {
//   ARGUMENT  ModifyEntryArgument
//   RESULT    ModifyEntryResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              securityError |
//              updateError}
//   CODE      id-opcode-modifyEntry }

// ModifyEntryArgument ::= OPTIONALLY-PROTECTED { ModifyEntryArgumentData }

// ModifyEntryArgumentData ::= SET {
//   object     [0]  Name,
//   changes    [1]  SEQUENCE OF EntryModification,
//   selection  [2]  EntryInformationSelection OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF   CommonArguments }

// ModifyEntryResult ::= CHOICE {
//   null         NULL,
//   information  OPTIONALLY-PROTECTED-SEQ { ModifyEntryResultData },
//   ... }

// ModifyEntryResultData ::= SEQUENCE {
//   entry    [0]  EntryInformation OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

// EntryModification ::= CHOICE {
//   addAttribute     [0]  Attribute{{SupportedAttributes}},
//   removeAttribute  [1]  AttributeType,
//   addValues        [2]  Attribute{{SupportedAttributes}},
//   removeValues     [3]  Attribute{{SupportedAttributes}},
//   alterValues      [4]  AttributeTypeAndValue,
//   resetValue       [5]  AttributeType,
//   replaceValues    [6]  Attribute{{SupportedAttributes}},
//   ... }

export
async function modifyEntry (
    ctx: Context,
    arg: ModifyEntryArgument,
): Promise<ModifyEntryResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        null_: null,
    };
}

export default modifyEntry;
