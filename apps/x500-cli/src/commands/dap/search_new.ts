import type { Connection, Context } from "@wildboar/meerkat-types";
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
import printCode from "../../printers/Code";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../utils/destringifyDN";
import stringifyDN from "../../utils/stringifyDN";
import {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";

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
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const reqData: SearchArgumentData = new SearchArgumentData(
        {
            rdnSequence: objectName,
        },
        subsetFromString(argv.subset),
        undefined,
        true,
        undefined,
        // {
        //     newRequest: new PagedResultsRequest_newRequest(
        //         10,
        //         undefined,
        //         undefined,
        //         undefined,
        //         3,
        //     ),
        // },
        undefined,
        undefined,
        undefined,
        false,
        undefined,
        undefined,
        undefined,
        undefined,
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
        if (outcome.errcode) {
            ctx.log.error(printCode(outcome.errcode));
        } else {
            ctx.log.error("Uncoded error.");
        }
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
        resData.searchInfo.entries
            .forEach((e) => {
                const dn = stringifyDN(ctx, e.name.rdnSequence);
                ctx.log.info(`DN: ${dn}`);
                e.information
                    ?.forEach((einfo) => {
                        if ("attributeType" in einfo) {
                            ctx.log.info(`Attribute Type: ${einfo.attributeType.toString()}`);
                        } else if ("attribute" in einfo) {
                            const oid: string = einfo.attribute.type_.toString();
                            const spec = ctx.attributes.get(oid);
                            const name: string = spec?.ldapNames?.[0] ?? oid;
                            const syntaxOID = spec?.ldapSyntax;
                            if (!syntaxOID) {
                                return; // FIXME:
                            }
                            const syntax = ctx.ldapSyntaxes.get(syntaxOID.toString());
                            if (!syntax?.encoder) {
                                return; // FIXME:
                            }
                            const encoder = syntax.encoder;
                            // encoder()
                            einfo.attribute.values
                                .map((value) => {
                                    const stringValue = encoder(value);
                                    ctx.log.info(`${name}: ${stringValue}`);
                                });
                            einfo.attribute.valuesWithContext
                                ?.map((vwc) => {
                                    const stringValue = encoder(vwc.value);
                                    ctx.log.info(`${name} (C): ${stringValue}`);
                                });
                        }
                    });
                ctx.log.info("-----");
            })
        ctx.log.info("End of search.");
    } else if ("uncorrelatedSearchInfo" in resData) {
        ctx.log.warn("Uncorrelated info."); // FIXME:
    } else {
        ctx.log.warn("Unrecognized result set format.");
    }
}

export default search_new;
