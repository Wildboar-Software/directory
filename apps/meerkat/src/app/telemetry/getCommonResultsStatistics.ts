import type {
    CommonResults,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CommonResults.ta";

type CommonResultsLike = { [K in keyof CommonResults]: CommonResults[K] };

export
function getCommonResultsStatistics (cr: CommonResultsLike | undefined) {
    return {};
}

export default getCommonResultsStatistics;
