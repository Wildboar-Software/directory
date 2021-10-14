import type { Connection, Context } from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    administerPassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import {
    AdministerPasswordArgument,
    _encode_AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import {
    AdministerPasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgumentData.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import printCode from "../../printers/Code";
import destringifyDN from "../../utils/destringifyDN";
import MutableWriteable from "../../utils/MutableWriteable";
import * as readline from "readline";

const mutedOut = new MutableWriteable();

export
async function do_administerPassword (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    let password: string | undefined = argv.newPassword;
    if (!password) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        await new Promise<void>((resolve) => {
            rl.question("New Password: ", (answer: string): void => {
                password = answer;
                rl.close();
                resolve();
            });
        });
        mutedOut.muted = true;
    }

    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const reqData = new AdministerPasswordArgumentData(
        objectName,
        { // TODO: Support encryption.
            clear: password!,
        },
    );
    const arg: AdministerPasswordArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: administerPassword["&operationCode"]!,
        argument: _encode_AdministerPasswordArgument(arg, DER),
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
    ctx.log.info("Password changed.");
}

export default do_administerPassword;
