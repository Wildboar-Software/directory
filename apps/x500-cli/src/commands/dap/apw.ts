import type { Connection, Context } from "../../types.js";
import { DER } from "@wildboar/asn1/functional";
import {
    administerPassword,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AdministerPasswordArgument,
    _encode_AdministerPasswordArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AdministerPasswordArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _decode_AdministerPasswordResult,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../utils/destringifyDN.js";
import MutableWriteable from "../../utils/MutableWriteable.js";
import * as readline from "readline";
import printError from "../../printers/Error_.js";
import { getOptionallyProtectedValue } from "@wildboar/x500";

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
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result = _decode_AdministerPasswordResult(outcome.result);
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

export default do_administerPassword;
