import type { Connection, Context } from "../../../types";
import { ObjectIdentifier } from "asn1-ts";
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
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import printCode from "../../../printers/Code";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../../utils/destringifyDN";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";

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
        new EntryInformationSelection(
            {
                select: [
                    new ObjectIdentifier([ 2, 5, 4, 3 ]),
                ],
            },
            0,
            {
                allOperationalAttributes: null,
            },
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
    const result: ReadResult = _decode_ReadResult(outcome.result);
    const resData = getOptionallyProtectedValue(result);
    if ("signed" in result) {
        ctx.log.info("This response was signed.");
    }
    ctx.log.info("Entry:");
    resData.entry.information?.forEach((info) => {
        if ("attribute" in info) {
            ctx.log.info(info.attribute.type_.toString());
            info.attribute.values.map((v) => {
                ctx.log.info("\t" + v.toString());
            });
            info.attribute.valuesWithContext?.forEach((vwc) => {
                ctx.log.info("\t" + vwc.value.toString());
                vwc.contextList
                    .forEach((c) => {
                        ctx.log.info("\t\t" + c.contextType.toString() + (c.fallback ? " FALLBACK" : ""));
                        c.contextValues
                            .forEach((cv) => {
                                ctx.log.info("\t\t\t" + cv.toString());
                            });
                    });
            });
        } else if ("attributeType" in info) {
            ctx.log.info("Attribute of type: " + info.attributeType.toString());
        }
    });
}

export default do_read;
