import type { Connection, Context } from "../../types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    compare,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import {
    CompareArgument,
    _encode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    CompareArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta";
import {
    CompareResult,
    _decode_CompareResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import printCode from "../../printers/Code";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../utils/destringifyDN";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { DERElement } from "asn1-ts";

export
async function do_compare (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const attrSpec = ctx.attributes.get(argv.type);
    if (!attrSpec) {
        ctx.log.warn(`Attribute type '${argv.type}' not understood.`);
        process.exit(1);
    }
    // TODO: Blocked on @wildboar/ldap:destringifyElement
    const purported: AttributeValueAssertion = new AttributeValueAssertion(
        attrSpec.id,
        new DERElement(), // FIXME:
        {
            allContexts: null,
        },
        undefined,
    );
    const reqData: CompareArgumentData = new CompareArgumentData(
        {
            rdnSequence: objectName,
        },
        purported,
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
    const arg: CompareArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: compare["&operationCode"]!,
        argument: _encode_CompareArgument(arg, DER),
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
    const result: CompareResult = _decode_CompareResult(outcome.result);
    const resData = getOptionallyProtectedValue(result);
    if ("signed" in result) {
        ctx.log.info("This response was signed.");
    }
}

export default do_compare;
