import type { Context } from "@wildboar/meerkat-types";
import {
    LDAPResult_resultCode,
    LDAPResult_resultCode_compareTrue,
    LDAPResult_resultCode_adminLimitExceeded,
    LDAPResult_resultCode_sizeLimitExceeded,
    LDAPResult_resultCode_timeLimitExceeded,
    LDAPResult_resultCode_unavailableCriticalExtension,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    LimitProblem,
    LimitProblem_administrativeLimitExceeded,
    LimitProblem_sizeLimitExceeded,
    LimitProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";
import decodeLDAPDN from "../ldap/decodeLDAPDN";
import type {
    AddEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResult.ta";
import type {
    CompareResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import {
    CompareResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResultData.ta";
import type {
    ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
    ListResultData_listInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo.ta";
import {
    ListResultData_listInfo_subordinates_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData-listInfo-subordinates-Item.ta";
import type {
    ModifyDNResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNResult.ta";
import type {
    ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
import type {
    RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
import type {
    ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    ReadResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResultData.ta";
import type {
    SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
    SearchResultData_searchInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData-searchInfo.ta";
import type { SearchResultEntry } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import type { SearchResultDone } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultDone.ta";
import type { SearchResultReference } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultReference.ta";
import type { ModifyResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyResponse.ta";
import type { AddResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
import type { DelResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/DelResponse.ta";
import type { ModifyDNResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyDNResponse.ta";
import type { CompareResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareResponse.ta";
import ldapResultToDAPError from "./ldapResultToDAPError";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import getEntryInfoFromSearchResultEntry from "../ldap/getEntryInfoFromSearchResultEntry";
import ldapReferenceToContinuationReference from "../ldap/ldapReferenceToContinuationReference";
import getRDN from "../x500/getRDN";

function ldapResultCodeToLimitProblem (code: LDAPResult_resultCode): LimitProblem | undefined {
    return ({
        [LDAPResult_resultCode_adminLimitExceeded]: LimitProblem_administrativeLimitExceeded,
        [LDAPResult_resultCode_sizeLimitExceeded]: LimitProblem_sizeLimitExceeded,
        [LDAPResult_resultCode_timeLimitExceeded]: LimitProblem_timeLimitExceeded,
    })[code];
}

export
function ldapResponseToAddEntryResult (res: AddResponse): AddEntryResult {
    ldapResultToDAPError(res);
    return {
        null_: null,
    };
}

export
function ldapResponseToCompareResult (ctx: Context, res: CompareResponse): CompareResult {
    res.matchedDN
    ldapResultToDAPError(res);
    return {
        unsigned: new CompareResultData(
            {
                rdnSequence: decodeLDAPDN(ctx, res.matchedDN),
            },
            (res.resultCode === LDAPResult_resultCode_compareTrue),
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

export
function ldapResponseToListResult (
    ctx: Context,
    done: SearchResultDone,
    results: SearchResultEntry[],
    refs?: SearchResultReference[],
): ListResult {
    const limitProblem = ldapResultCodeToLimitProblem(done.resultCode);
    if (
        (typeof limitProblem === "number")
        || (done.resultCode === LDAPResult_resultCode_unavailableCriticalExtension)
    ) {
        return {
            unsigned: {
                listInfo: new ListResultData_listInfo(
                    {
                        rdnSequence: decodeLDAPDN(ctx, done.matchedDN),
                    },
                    results.map((result) => new ListResultData_listInfo_subordinates_Item(
                        getRDN(decodeLDAPDN(ctx, result.objectName)) ?? [],
                        undefined,
                        undefined,
                    )),
                    new PartialOutcomeQualifier(
                        limitProblem,
                        refs?.map((ref) => ldapReferenceToContinuationReference(ref)),
                        (done.resultCode === LDAPResult_resultCode_unavailableCriticalExtension),
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            },
        };
    }
    ldapResultToDAPError(done);
    return {
        unsigned: {
            listInfo: new ListResultData_listInfo(
                {
                    rdnSequence: decodeLDAPDN(ctx, done.matchedDN),
                },
                results.map((result) => new ListResultData_listInfo_subordinates_Item(
                    getRDN(decodeLDAPDN(ctx, result.objectName)) ?? [],
                    undefined,
                    undefined,
                )),
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

export
function ldapResponseToModifyDNResult (res: ModifyDNResponse): ModifyDNResult {
    ldapResultToDAPError(res);
    return {
        null_: null,
    };
}

export
function ldapResponseToModifyEntryResult (res: ModifyResponse): ModifyEntryResult {
    ldapResultToDAPError(res);
    return {
        null_: null,
    };
}

export
function ldapResponseToReadResult (ctx: Context, result: SearchResultEntry, done: SearchResultDone): ReadResult {
    ldapResultToDAPError(done);
    return {
        unsigned: new ReadResultData(
            getEntryInfoFromSearchResultEntry(ctx, result),
            undefined,
            [],
            undefined,
            undefined,
            undefined,
            undefined,
        ),
    };
}

export
function ldapResponseToRemoveEntryResult (res: DelResponse): RemoveEntryResult {
    ldapResultToDAPError(res);
    return {
        null_: null,
    };
}

export
function ldapResponseToSearchResult (
    ctx: Context,
    typesOnly: boolean,
    done: SearchResultDone,
    results: SearchResultEntry[],
    refs?: SearchResultReference[],
): SearchResult {
    const limitProblem = ldapResultCodeToLimitProblem(done.resultCode);
    if (
        (typeof limitProblem === "number")
        || (done.resultCode === LDAPResult_resultCode_unavailableCriticalExtension)
    ) {
        return {
            unsigned: {
                searchInfo: new SearchResultData_searchInfo(
                    {
                        rdnSequence: decodeLDAPDN(ctx, done.matchedDN),
                    },
                    results.map((result) => getEntryInfoFromSearchResultEntry(ctx, result, typesOnly)),
                    new PartialOutcomeQualifier(
                        limitProblem,
                        refs?.map((ref) => ldapReferenceToContinuationReference(ref)),
                        (done.resultCode === LDAPResult_resultCode_unavailableCriticalExtension),
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
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
    ldapResultToDAPError(done);
    return {
        unsigned: {
            searchInfo: new SearchResultData_searchInfo(
                {
                    rdnSequence: decodeLDAPDN(ctx, done.matchedDN),
                },
                results.map((result) => getEntryInfoFromSearchResultEntry(ctx, result, typesOnly)),
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
