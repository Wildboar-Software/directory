import type {
    PagedResultsRequestStatistics,
} from "@wildboar/meerkat-types";
import type {
    PagedResultsRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest.ta";
import type {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";

export
function getStatisticsFromPagedResultsRequest (prr: PagedResultsRequest): PagedResultsRequestStatistics {
    const newRequest: PagedResultsRequest_newRequest | undefined = ("newRequest" in prr)
        ? prr.newRequest
        : undefined;
    return {
        newRequest: "newRequest" in prr,
        queryReference: "queryReference" in prr,
        abandonQuery: "abandonQuery" in prr,
        pageSize: newRequest?.pageSize,
        sortKeys: newRequest?.sortKeys
            ?.map((sk) => ({
                type: sk.type_.toString(),
                orderingRule: sk.orderingRule?.toString(),
            })),
        reverse: newRequest?.reverse,
        unmerged: newRequest?.unmerged,
        pageNumber: newRequest?.pageNumber,
    };
}

export default getStatisticsFromPagedResultsRequest;
