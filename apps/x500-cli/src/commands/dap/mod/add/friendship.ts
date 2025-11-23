import type { Connection, Context } from "../../../../types";
import { DER } from "@wildboar/asn1/functional";
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
import printCode from "../../../../printers/Code";
import destringifyDN from "../../../../utils/destringifyDN";
import type {
    ModAddFriendshipArgs,
} from "../../../../yargs/dap_mod_add_friendship";
import {
    friends,
} from "@wildboar/x500/SchemaAdministration";
import {
    FriendsDescription,
} from "@wildboar/x500/SchemaAdministration";
import { ObjectIdentifier } from "@wildboar/asn1";

export
async function do_modify_add_friendship (
    ctx: Context,
    conn: Connection,
    argv: ModAddFriendshipArgs,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);
    const f = new FriendsDescription(
        ObjectIdentifier.fromString(argv.anchor!),
        argv.name?.map((n) => ({
            uTF8String: n,
        })),
        argv.description
            ? {
                uTF8String: argv.description,
            }
            : undefined,
        argv.obsolete,
        argv.friend?.map(ObjectIdentifier.fromString) ?? [],
    );

    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                friends["&id"],
                [
                    friends.encoderFor["&Type"]!(f, DER),
                ],
                undefined,
            ),
        },
    ];
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
}

export default do_modify_add_friendship;
