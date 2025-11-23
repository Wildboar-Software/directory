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
    ModAddObjectClassArgs,
} from "../../../../yargs/dap_mod_add_oc";
import {
    objectClasses,
} from "@wildboar/x500/SchemaAdministration";
import {
    ObjectClassDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    ObjectClassInformation,
} from "@wildboar/x500/SchemaAdministration";
import { ObjectIdentifier } from "@wildboar/asn1";
import {
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/InformationFramework";


export
async function do_modify_add_oc (
    ctx: Context,
    conn: Connection,
    argv: ModAddObjectClassArgs,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);
    const oc = new ObjectClassDescription(
        ObjectIdentifier.fromString(argv.identifier!),
        argv.name?.map((n) => ({
            uTF8String: n,
        })),
        argv.description
            ? {
                uTF8String: argv.description,
            }
            : undefined,
        argv.obsolete,
        new ObjectClassInformation(
            argv.subclassOf?.map(ObjectIdentifier.fromString),
            ({
                structural: ObjectClassKind_structural,
                auxiliary: ObjectClassKind_auxiliary,
                abstract: ObjectClassKind_abstract,
            })[argv.kind ?? ""] ?? ObjectClassKind_structural,
            argv.mandatories?.map(ObjectIdentifier.fromString),
            argv.optionals?.map(ObjectIdentifier.fromString),
        ),
    );
    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                objectClasses["&id"],
                [
                    objectClasses.encoderFor["&Type"]!(oc, DER),
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

export default do_modify_add_oc;
