import type { Connection, Context } from "../../types";
import { TRUE } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    read,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import {
    ReadArgument,
    _encode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgumentData.ta";
import {
    ReadResult,
    _decode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../utils/destringifyDN";
import stringifyDN from "../../utils/stringifyDN";
import selectAll from "../../utils/selectAll";
import printEntryInformation from "../../printers/EntryInformation";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import printError from "../../printers/Error_";

export
async function do_read (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const reqData: ReadArgumentData = new ReadArgumentData(
        {
            rdnSequence: objectName,
        },
        selectAll,
        TRUE,
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
    const arg: ReadArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: read["&operationCode"]!,
        argument: _encode_ReadArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result: ReadResult = _decode_ReadResult(outcome.result);
    const resData = getOptionallyProtectedValue(result);
    if ("signed" in result) {
        ctx.log.info("This response was signed.");
    }
    if (resData.aliasDereferenced === TRUE) {
        ctx.log.info("An alias was dereferenced.");
    }
    if (resData.performer) {
        console.log("Operation performed by: " + stringifyDN(ctx, resData.performer));
    }
    printEntryInformation(ctx, resData.entry);
    if (resData.modifyRights) {
        console.log("----- Modify Rights -----");
        resData.modifyRights.forEach((mr) => {
            const add = Boolean(mr.permission[0]);
            const delete_ = Boolean(mr.permission[1]);
            const rename = Boolean(mr.permission[2]);
            const move = Boolean(mr.permission[3]);
            const permissions: string[] = [];
            if (add) {
                permissions.push("ADD");
            }
            if (delete_) {
                permissions.push("DELETE");
            }
            if (rename) {
                permissions.push("RENAME");
            }
            if (move) {
                permissions.push("MOVE");
            }
            if ("entry" in mr.item) {
                console.log(`ENTRY:\t\t${permissions.join(", ")}`);
            }
            else if ("attribute" in mr.item) {
                console.log(`Attribute ${mr.item.attribute}:\t\t${permissions.join(", ")}`);
            }
            else if ("value" in mr.item && (mr.item.value instanceof AttributeValueAssertion)) {
                console.log(`Value of type ${mr.item.value.type_}:\t\t${permissions.join(", ")}`);
            }
            else {
                console.log("Not understood item in modifyRights.");
            }
        })
    }
}

export default do_read;
