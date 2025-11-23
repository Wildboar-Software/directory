import type {
    CommonResults,
} from "@wildboar/x500/DirectoryAbstractService";

type CommonResultsLike = { [K in keyof CommonResults]: CommonResults[K] };

export
function getCommonResultsStatistics (cr: CommonResultsLike | undefined) {
    return {};
}

export default getCommonResultsStatistics;
