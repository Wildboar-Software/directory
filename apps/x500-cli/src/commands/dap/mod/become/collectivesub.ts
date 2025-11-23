import type { Connection, Context } from "../../../../types";
import { ObjectIdentifier, ASN1Element } from "@wildboar/asn1";
import { DER, _encodeObjectIdentifier } from "@wildboar/asn1/functional";
import {
    modifyEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    EntryModification,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    objectClass,
} from "@wildboar/x500/InformationFramework";
import printCode from "../../../../printers/Code";
import destringifyDN from "../../../../utils/destringifyDN";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/InformationFramework";

export
async function do_modify_become_collectivesub (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                objectClass["&id"],
                [
                    _encodeObjectIdentifier(collectiveAttributeSubentry["&id"], DER)
                ],
                undefined,
            ),
        },
    ];
    const index: Map<string, ASN1Element[]> = new Map();
    for (const cattr of argv.collectiveValue ?? []) {
        const value = destringifyDN(ctx, cattr)[0][0];
        const OID: string = value.type_.toString();
        const otherValues = index.get(OID);
        if (otherValues) {
            otherValues.push(value.value);
        } else {
            index.set(OID, [ value.value ]);
        }
    }
    modifications.push(
        ...Array.from(index.entries())
            .map(([ oid, values ]): EntryModification => ({
                addValues: new Attribute(
                    ObjectIdentifier.fromString(oid),
                    values,
                    undefined,
                ),
            })),
    );
    const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
        {
            rdnSequence: objectName,
        },
        modifications,
        undefined,
        [],
    );
    const arg: ModifyEntryArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: modifyEntry["&operationCode"]!,
        argument: _encode_ModifyEntryArgument(arg, DER),
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
    ctx.log.info("Done.");
}

export default do_modify_become_collectivesub;
