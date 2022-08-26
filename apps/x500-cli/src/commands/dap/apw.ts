import type { Connection, Context } from "../../types";
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
import {
    _decode_AdministerPasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordResult.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import destringifyDN from "../../utils/destringifyDN";
import MutableWriteable from "../../utils/MutableWriteable";
import * as readline from "readline";
import printError from "../../printers/Error_";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

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
