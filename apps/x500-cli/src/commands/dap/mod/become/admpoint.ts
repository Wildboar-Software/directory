import type { Connection, Context } from "../../../../types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import {
    modifyEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { id_ar_autonomousArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import { id_ar_accessControlSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import { id_ar_accessControlInnerArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";
import { id_ar_subschemaAdminSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import { id_ar_collectiveAttributeSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeSpecificArea.va";
import { id_ar_collectiveAttributeInnerArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeInnerArea.va";
import { id_ar_contextDefaultSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-contextDefaultSpecificArea.va";
import { id_ar_serviceSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-serviceSpecificArea.va";
import { id_ar_pwdAdminSpecificArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-pwdAdminSpecificArea.va";
import printCode from "../../../../printers/Code";
import destringifyDN from "../../../../utils/destringifyDN";

export
async function do_modify_become_admpoint (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    // TODO: ManageDSAIT
    const administrativeRoles: OBJECT_IDENTIFIER[] = [];
    if (argv.autonomousArea) {
        administrativeRoles.push(id_ar_autonomousArea);
    }
    if (argv.accessControlSpecificArea) {
        administrativeRoles.push(id_ar_accessControlSpecificArea);
    }
    if (argv.accessControlInnerArea) {
        administrativeRoles.push(id_ar_accessControlInnerArea);
    }
    if (argv.subschemaAdminSpecificArea) {
        administrativeRoles.push(id_ar_subschemaAdminSpecificArea);
    }
    if (argv.collectiveAttributeSpecificArea) {
        administrativeRoles.push(id_ar_collectiveAttributeSpecificArea);
    }
    if (argv.collectiveAttributeInnerArea) {
        administrativeRoles.push(id_ar_collectiveAttributeInnerArea);
    }
    if (argv.contextDefaultSpecificArea) {
        administrativeRoles.push(id_ar_contextDefaultSpecificArea);
    }
    if (argv.serviceSpecificArea) {
        administrativeRoles.push(id_ar_serviceSpecificArea);
    }
    if (argv.pwdAdminSpecificArea) {
        administrativeRoles.push(id_ar_pwdAdminSpecificArea);
    }
    const modifications: EntryModification[] = [
            {
                replaceValues: new Attribute(
                    administrativeRole["&id"],
                    administrativeRoles
                        .map((oid) => _encodeObjectIdentifier(oid, DER)),
                    undefined,
                ),
            },
    ];
    if (argv.accessControlScheme) {
        const accessControlSchemeOID = ObjectIdentifier
            .fromString(argv.accessControlScheme);
        modifications.push({
            replaceValues: new Attribute(
                accessControlScheme["&id"],
                [
                    _encodeObjectIdentifier(accessControlSchemeOID, DER)
                ],
                undefined,
            ),
        });
    }
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

export default do_modify_become_admpoint;
