import { Context, Vertex } from "../types";
import {
    _decode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadResult,
    _encode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    ReadResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResultData.ta";
import { DERElement } from "asn1-ts";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    readEntryInformation,
} from "../database/entry/readEntryInformation";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";

export
async function read (
    ctx: Context,
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_ReadArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const targetDN = getDistinguishedName(target);
    const einfo = await readEntryInformation(ctx, target, data.selection);
    const result: ReadResult = {
        unsigned: new ReadResultData(
            new EntryInformation(
                {
                    rdnSequence: targetDN,
                },
                !target.dse.shadow,
                einfo,
                false, // TODO: Will change once authz is implemented.
                false, // FIXME:
                false, // FIXME,
            ),
            undefined, // TODO: Will change once authz is implemented.
            [],
            undefined,
            undefined,
            undefined,
            undefined,
        ),
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_ReadResult(result, () => new DERElement()),
    );
}

export default read;
