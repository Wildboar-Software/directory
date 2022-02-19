import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseEditor,
} from "@wildboar/meerkat-types";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import { PrismaPromise, ACIScope } from "@prisma/client";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";

/**
 * @summary Higher-order function that produces a function that can save an ACI item of a specified scope
 * @description
 *
 * This function takes an ACI item scope (prescriptive, subentry, or entry) and
 * returns an asynchronous function that itself returns a `PrismaPromise` that
 * can be used to save that ACI item to the database with the specified scope.
 *
 * @param scope The scope of the ACI item (e.g. prescriptive, subentry, or entry)
 * @returns A function that can be used to write an ACI item of the specified scope
 *
 * @function
 */
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
                precedence: Number(aci.precedence),
                auth_level_basic_level: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.level
                    : undefined,
                auth_level_basic_local_qualifier: ("basicLevels" in aci.authenticationLevel)
                    ? (aci.authenticationLevel.basicLevels.localQualifier !== undefined)
                        ? Number(aci.authenticationLevel.basicLevels.localQualifier)
                        : undefined
                    : undefined,
                auth_level_basic_signed: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.signed
                    : undefined,
                ber: Buffer.from(attribute.value.toBytes()),
                scope,
                active: true,
            },
        });
    };
}

export default writeSomeACI;
