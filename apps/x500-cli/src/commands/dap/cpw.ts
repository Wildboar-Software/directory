import type { Connection, Context } from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    changePassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import {
    ChangePasswordArgument,
    _encode_ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import {
    ChangePasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgumentData.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import printCode from "../../printers/Code";
import destringifyDN from "../../utils/destringifyDN";
import MutableWriteable from "../../utils/MutableWriteable";
import * as readline from "readline";

const mutedOut = new MutableWriteable();

export
async function do_changePassword (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    let oldPassword: string | undefined = argv.oldPassword;
    if (!oldPassword) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        rl.question("Old Password: ", (answer: string): void => {
            oldPassword = answer;
            rl.close();
        });
        mutedOut.muted = true;
    }

    let newPassword: string | undefined = argv.newPassword;
    if (!newPassword) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        rl.question("New Password: ", (answer: string): void => {
            newPassword = answer;
            rl.close();
        });
        mutedOut.muted = true;
    }

    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const reqData = new ChangePasswordArgumentData(
        objectName,
        { // TODO: Support encryption.
            clear: oldPassword!,
        },
        {
            clear: newPassword!,
        },
    );
    const arg: ChangePasswordArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: changePassword["&operationCode"]!,
        argument: _encode_ChangePasswordArgument(arg, DER),
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

export default do_changePassword;
