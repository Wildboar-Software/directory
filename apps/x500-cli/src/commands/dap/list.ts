import type { Connection, Context } from "../../types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    list,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import {
    ListArgument,
    _encode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    ListArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta";
import {
    ListResult,
    _decode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../utils/destringifyDN";
import stringifyDN from "../../utils/stringifyDN";
import printError from "../../printers/Error_";

const DEFAULT_TIME_LIMIT: number = 10;
const DEFAULT_SIZE_LIMIT: number = 1000;
const DEFAULT_ATTRIBUTE_SIZE_LIMIT: number = 1000;

export
async function do_list (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const reqData: ListArgumentData = new ListArgumentData(
        {
            rdnSequence: objectName,
        },
        undefined,
        argv.listFamily,
        [],
        new ServiceControls(
            undefined,
            undefined,
            DEFAULT_TIME_LIMIT,
            DEFAULT_SIZE_LIMIT,
            undefined,
            DEFAULT_ATTRIBUTE_SIZE_LIMIT,
            undefined,
            undefined,
            undefined,
        ),
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
    const arg: ListArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: list["&operationCode"]!,
        argument: _encode_ListArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result: ListResult = _decode_ListResult(outcome.result);
    const resData = getOptionallyProtectedValue(result);
    if ("signed" in result) {
        ctx.log.info("This response was signed.");
    }
    if ("listInfo" in resData) {
        resData.listInfo.subordinates
            .map((sub) => stringifyDN(ctx, [ sub.rdn ]))
            .forEach((str, i) => console.log(`#${(i + 1).toString().padStart(4, "0")}: ${str}`));
        ctx.log.info("End of list.");
    } else if ("uncorrelatedListInfo" in resData) {
        ctx.log.warn("Uncorrelated info."); // FIXME:
    } else {
        ctx.log.warn("Unrecognized result set format.");
    }
}

export default do_list;
