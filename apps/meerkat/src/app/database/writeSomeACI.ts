import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseEditor,
} from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import { PrismaPromise, ACIScope } from "@prisma/client";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";

export
const writeSomeACI: (scope: ACIScope) => SpecialAttributeDatabaseEditor = (scope: ACIScope) => {
    return (
        ctx: Readonly<Context>,
        entry: Vertex,
        attribute: Value,
    ): PrismaPromise<any> => {
        // We ignore contexts for this.
        const aci: ACIItem = _decode_ACIItem(attribute.value);
        return ctx.db.aCIItem.create({
            data: {
                entry_id: entry.dse.id,
                tag: directoryStringToString(aci.identificationTag),
                precedence: aci.precedence,
                auth_level_basic_level: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.level
                    : undefined,
                auth_level_basic_local_qualifier: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.localQualifier
                    : undefined,
                auth_level_basic_signed: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.signed
                    : undefined,
                ber: Buffer.from(attribute.value.toBytes()),
                scope,
            },
        });
    };
}

export default writeSomeACI;
