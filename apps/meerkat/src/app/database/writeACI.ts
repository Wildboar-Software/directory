import type { Context } from "../types";
import {
    ACIItem,
    _encode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import type { ACIScope } from "@prisma/client";
import { DER } from "asn1-ts/dist/node/functional";

export
async function writeACI (
    ctx: Context,
    vertexId: number,
    aci: ACIItem,
    scope: ACIScope,
): Promise<void> {
    const basicLevels = ("basicLevels" in aci.authenticationLevel)
        ? aci.authenticationLevel.basicLevels
        : undefined;
    await ctx.db.aCIItem.create({
        data: {
            entry_id: vertexId,
            tag: directoryStringToString(aci.identificationTag),
            precedence: aci.precedence,
            ber: Buffer.from(_encode_ACIItem(aci, DER).toBytes()),
            scope,
            auth_level_basic_level: basicLevels?.level,
            auth_level_basic_local_qualifier: basicLevels?.localQualifier,
            auth_level_basic_signed: basicLevels?.signed,
        },
    });
}

export default writeACI;
