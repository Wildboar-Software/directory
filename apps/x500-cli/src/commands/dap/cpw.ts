import type { Connection, Context } from "../../types";
import { DER } from "@wildboar/asn1/functional";
import {
    changePassword,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ChangePasswordArgument,
    _encode_ChangePasswordArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ChangePasswordArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _decode_ChangePasswordResult,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../utils/destringifyDN";
import MutableWriteable from "../../utils/MutableWriteable";
import * as readline from "readline";
import printError from "../../printers/Error_";
import { getOptionallyProtectedValue } from "@wildboar/x500";

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
        await new Promise<void>((resolve) => {
            rl.question("Old Password: ", (answer: string): void => {
                mutedOut.muted = true;
                oldPassword = answer;
                rl.close();
                mutedOut.muted = false;
                resolve();
            });
        });
    }

    let newPassword: string | undefined = argv.newPassword;
    if (!newPassword) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        await new Promise<void>((resolve) => {
            rl.question("New Password: ", (answer: string): void => {
                mutedOut.muted = true;
                newPassword = answer;
                rl.close();
                resolve();
                mutedOut.muted = false;
            });
        });
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
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result = _decode_ChangePasswordResult(outcome.result);
    if (!("information" in result)) {
        ctx.log.info("Password changed.");
        return;
    }
    const info = result.information;
    const data = getOptionallyProtectedValue(info);
    if (data.aliasDereferenced) {
        ctx.log.info("Alias dereferenced.");
    }
    ctx.log.info("Password changed.");
}

export default do_changePassword;
