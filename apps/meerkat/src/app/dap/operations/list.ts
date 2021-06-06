import type { Context } from "../../types";
import type {
  ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import type {
  ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
  ListResultData_listInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";

// list OPERATION ::= {
//   ARGUMENT  ListArgument
//   RESULT    ListResult
//   ERRORS    {nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-list }

// ListArgument ::= OPTIONALLY-PROTECTED { ListArgumentData }

// ListArgumentData ::= SET {
//   object        [0]  Name,
//   pagedResults  [1]  PagedResultsRequest OPTIONAL,
//   listFamily    [2]  BOOLEAN DEFAULT FALSE,
//   ...,
//   ...,
//   COMPONENTS OF      CommonArguments
//   }

// ListResult ::= OPTIONALLY-PROTECTED { ListResultData }

// ListResultData ::= CHOICE {
//   listInfo                     SET {
//     name                         Name OPTIONAL,
//     subordinates            [1]  SET OF SEQUENCE {
//       rdn                          RelativeDistinguishedName,
//       aliasEntry              [0]  BOOLEAN DEFAULT FALSE,
//       fromEntry               [1]  BOOLEAN DEFAULT TRUE,
//       ... },
//     partialOutcomeQualifier [2]  PartialOutcomeQualifier OPTIONAL,
//     ...,
//     ...,
//     COMPONENTS OF                CommonResults
//     },
//   uncorrelatedListInfo    [0]  SET OF ListResult,
//   ... }

// PartialOutcomeQualifier ::= SET {
//   limitProblem                  [0]  LimitProblem OPTIONAL,
//   unexplored                    [1]  SET SIZE (1..MAX) OF ContinuationReference OPTIONAL,
//   unavailableCriticalExtensions [2]  BOOLEAN DEFAULT FALSE,
//   unknownErrors                 [3]  SET SIZE (1..MAX) OF ABSTRACT-SYNTAX.&Type OPTIONAL,
//   queryReference                [4]  OCTET STRING OPTIONAL,
//   overspecFilter                [5]  Filter OPTIONAL,
//   notification                  [6]  SEQUENCE SIZE (1..MAX) OF
//                                        Attribute{{SupportedAttributes}} OPTIONAL,
//   entryCount                         CHOICE {
//     bestEstimate                  [7]  INTEGER,
//     lowEstimate                   [8]  INTEGER,
//     exact                         [9]  INTEGER,
//     ...} OPTIONAL
//   --                            [10] Not to be used -- }

// LimitProblem ::= INTEGER {
//   timeLimitExceeded           (0),
//   sizeLimitExceeded           (1),
//   administrativeLimitExceeded (2) }

export
async function list (
    ctx: Context,
    arg: ListArgument,
): Promise<ListResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        unsigned: {
        listInfo: new ListResultData_listInfo(
            undefined,
            [],
            undefined,
            [],
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        },
    };
}

export default list;
