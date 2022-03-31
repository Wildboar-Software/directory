import type { Connection, Context } from "../../types";
import { BIT_STRING, ObjectIdentifier, TRUE, TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    SearchResult,
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../utils/destringifyDN";
import printError from "../../printers/Error_";
import printEntryInformation from "../../printers/EntryInformation";
import selectAll from "../../utils/selectAll";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    SearchControlOptions_searchAliases,
    SearchControlOptions_matchedValuesOnly,
    SearchControlOptions_checkOverspecified,
    SearchControlOptions_performExactly,
    SearchControlOptions_includeAllAreas,
    SearchControlOptions_noSystemRelaxation,
    SearchControlOptions_dnAttribute,
    SearchControlOptions_matchOnResidualName,
    SearchControlOptions_entryCount,
    SearchControlOptions_useSubset,
    SearchControlOptions_separateFamilyMembers,
    SearchControlOptions_searchFamily,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";

function subsetFromString (str: string): SearchArgumentData_subset {
    const str_ = str.toLowerCase();
    if (str_.indexOf("base") > -1) {
        return SearchArgumentData_subset_baseObject;
    } else if (str_.indexOf("one") > -1) {
        return SearchArgumentData_subset_oneLevel;
    } else if (str_.indexOf("tree") > -1) {
        return SearchArgumentData_subset_wholeSubtree;
    } else {
        return SearchArgumentData_subset_baseObject; // Default to the least expensive query.
    }
}

export
async function search_new (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const eis = argv.userAttribute
        ? new EntryInformationSelection(
            {
                select: argv.userAttribute?.map(ObjectIdentifier.fromString),
            },
        )
        : selectAll;
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const searchOptions: BIT_STRING = new Uint8ClampedArray(12);
    if (argv.separateFamilyMembers) {
        searchOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
    }
    const reqData: SearchArgumentData = new SearchArgumentData(
        {
            rdnSequence: objectName,
        },
        subsetFromString(argv.subset),
        undefined,
        TRUE,
        eis,
        undefined,
        undefined,
        undefined,
        TRUE,
        undefined,
        undefined,
        undefined,
        searchOptions,
        undefined,
        undefined,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    );
    const arg: SearchArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: search["&operationCode"]!,
        argument: _encode_SearchArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result: SearchResult = _decode_SearchResult(outcome.result);
    const resData = getOptionallyProtectedValue(result);
    if ("signed" in result) {
        ctx.log.info("This response was signed.");
    }
    if ("searchInfo" in resData) {
        resData.searchInfo.entries.forEach((e) => {
            printEntryInformation(ctx, e);
            console.log();
        });
        ctx.log.info("End of search.");
    } else if ("uncorrelatedSearchInfo" in resData) {
        ctx.log.warn("Uncorrelated info."); // FIXME:
    } else {
        ctx.log.warn("Unrecognized result set format.");
    }
}

export default search_new;
