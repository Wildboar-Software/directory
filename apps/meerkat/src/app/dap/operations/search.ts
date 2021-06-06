import type { Context } from "../../types";
import type {
  SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import type {
  SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
  SearchResultData_searchInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";

// search OPERATION ::= {
//   ARGUMENT  SearchArgument
//   RESULT    SearchResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              abandoned |
//              securityError}
//   CODE      id-opcode-search }

// SearchArgument ::= OPTIONALLY-PROTECTED { SearchArgumentData }

// SearchArgumentData ::= SET {
//   baseObject            [0]  Name,
//   subset                [1]  INTEGER {
//     baseObject    (0),
//     oneLevel      (1),
//     wholeSubtree  (2)} DEFAULT baseObject,
//   filter                [2]  Filter DEFAULT and:{},
//   searchAliases         [3]  BOOLEAN DEFAULT TRUE,
//   selection             [4]  EntryInformationSelection DEFAULT {},
//   pagedResults          [5]  PagedResultsRequest OPTIONAL,
//   matchedValuesOnly     [6]  BOOLEAN DEFAULT FALSE,
//   extendedFilter        [7]  Filter OPTIONAL,
//   checkOverspecified    [8]  BOOLEAN DEFAULT FALSE,
//   relaxation            [9]  RelaxationPolicy OPTIONAL,
//   extendedArea          [10] INTEGER OPTIONAL,
//   hierarchySelections   [11] HierarchySelections DEFAULT {self},
//   searchControlOptions  [12] SearchControlOptions DEFAULT {searchAliases},
//   joinArguments         [13] SEQUENCE SIZE (1..MAX) OF JoinArgument OPTIONAL,
//   joinType              [14] ENUMERATED {
//     innerJoin      (0),
//     leftOuterJoin  (1),
//     fullOuterJoin  (2)} DEFAULT leftOuterJoin,
//   ...,
//   ...,
//   COMPONENTS OF              CommonArguments }

// HierarchySelections ::= BIT STRING {
//   self                  (0),
//   children              (1),
//   parent                (2),
//   hierarchy             (3),
//   top                   (4),
//   subtree               (5),
//   siblings              (6),
//   siblingChildren       (7),
//   siblingSubtree        (8),
//   all                   (9) }

// SearchControlOptions ::= BIT STRING {
//   searchAliases         (0),
//   matchedValuesOnly     (1),
//   checkOverspecified    (2),
//   performExactly        (3),
//   includeAllAreas       (4),
//   noSystemRelaxation    (5),
//   dnAttribute           (6),
//   matchOnResidualName   (7),
//   entryCount            (8),
//   useSubset             (9),
//   separateFamilyMembers (10),
//   searchFamily          (11) }

// JoinArgument ::= SEQUENCE {
//   joinBaseObject  [0]  Name,
//   domainLocalID   [1]  DomainLocalID OPTIONAL,
//   joinSubset      [2]  ENUMERATED {
//     baseObject   (0),
//     oneLevel     (1),
//     wholeSubtree (2),
//     ... } DEFAULT baseObject,
//   joinFilter      [3]  Filter OPTIONAL,
//   joinAttributes  [4]  SEQUENCE SIZE (1..MAX) OF JoinAttPair OPTIONAL,
//   joinSelection   [5]  EntryInformationSelection,
//   ... }

// DomainLocalID ::= UnboundedDirectoryString

// JoinAttPair ::= SEQUENCE {
//   baseAtt      AttributeType,
//   joinAtt      AttributeType,
//   joinContext  SEQUENCE SIZE (1..MAX) OF JoinContextType OPTIONAL,
//   ... }

// JoinContextType ::= CONTEXT.&id({SupportedContexts})

// SearchResult ::= OPTIONALLY-PROTECTED { SearchResultData }

// SearchResultData ::= CHOICE {
//   searchInfo                    SET {
//     name                          Name OPTIONAL,
//     entries                  [0]  SET OF EntryInformation,
//     partialOutcomeQualifier  [2]  PartialOutcomeQualifier OPTIONAL,
//     altMatching              [3]  BOOLEAN DEFAULT FALSE,
//     ...,
//     ...,
//     COMPONENTS OF                 CommonResults
//     },
//   uncorrelatedSearchInfo   [0]  SET OF SearchResult,
//   ... }

export
async function search (
    ctx: Context,
    arg: SearchArgument,
): Promise<SearchResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    return {
        unsigned: {
        searchInfo: new SearchResultData_searchInfo(
            undefined,
            [],
            undefined,
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

export default search;
