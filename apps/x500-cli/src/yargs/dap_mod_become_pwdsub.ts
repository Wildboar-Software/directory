import type { Context } from "../types.js";
import type { CommandModule } from "yargs";
import bind from "../net/bind.js";
import { do_modify_become_pwdsub as command } from "../commands/dap/mod/become/pwdsub.js";

export
interface PwdSubArgs {
    object?: string;
    pwdModifyEntryAllowed?: boolean;
    pwdChangeAllowed?: boolean;
    pwdMaxAge?: number;
    pwdExpiryAge?: number;
    pwdMinLength?: number;
    pwdAlphabet?: string;
    pwdDictionaries?: string[];
    pwdExpiryWarning?: number;
    pwdGraces?: number;
    pwdFailureDuration?: number;
    pwdLockoutDuration?: number;
    pwdMaxFailures?: number;
    pwdMaxTimeInHistory?: number;
    pwdMinTimeInHistory?: number;
    pwdHistorySlots?: number;
    pwdRecentlyExpiredDuration?: number;
    pwdEncAlg?: string;
}

export // eslint-disable-next-line @typescript-eslint/ban-types
function create (ctx: Context): CommandModule<{}, PwdSubArgs> {
    return {
        command: "pwdsub <object>",
        describe: "Make a DSE into a passwordAdminSubentry",
        builder: (y) => {
            return y
                .positional("object", {
                    type: "string",
                    description: "The object to be modified",
                })
                .option("pwdModifyEntryAllowed", {
                    type: "boolean",
                    description: "Whether passwords can be changed via modifyEntry",
                })
                .option("pwdChangeAllowed", {
                    type: "boolean",
                    description: "Whether passwords can be changed via changePassword",
                })
                .option("pwdMaxAge", {
                    type: "number",
                    description: "The number of seconds after which a password will be no longer available",
                })
                .option("pwdExpiryAge", {
                    type: "number",
                    description: "The number of seconds after which a modified password will expire",
                })
                .option("pwdMinLength", {
                    type: "number",
                    description: "The minimum length, in characters, which is acceptable for a password",
                })
                // .option("pwdVocabulary", {
                //     type: "",
                //     description: "",
                // })
                .option("pwdAlphabet", {
                    type: "string",
                    description: "The sets of characters that shall be used in creating a password",
                })
                .option("pwdDictionaries", {
                    type: "array",
                    string: true,
                    description: "Dictionaries containing words that are forbidden from being passwords on their own",
                })
                .option("pwdExpiryWarning", {
                    type: "number",
                    description: "specifies a period in seconds before password expiration during which a warning indication shall be returned whenever an authenticating requester binds",
                })
                .option("pwdGraces", {
                    type: "number",
                    description: "The number of times an expired password can be used to authenticate",
                })
                .option("pwdFailureDuration", {
                    type: "number",
                    description: "The number of seconds a response to a failed bind or compare attempt should be delayed",
                })
                .option("pwdLockoutDuration", {
                    type: "number",
                    description: "The number of seconds that the password cannot be used to authenticate due to too many successive failed bind or compare attempts (more than the limit specified by pwdMaxFailures operational attribute or its default)",
                })
                .option("pwdMaxFailures", {
                    type: "number",
                    description: "The number of consecutive failed bind or compare attempts after which the password may not be used to authenticate",
                })
                .option("pwdMaxTimeInHistory", {
                    type: "number",
                    description: "The minimum time, in number of seconds, during which a replaced password shall be kept within the userPwdHistory operational attribute",
                })
                .option("pwdMinTimeInHistory", {
                    type: "number",
                    description: "The minimum time, in number of seconds, during which a replaced password shall be kept within the userPwdHistory operational attribute",
                })
                .option("pwdHistorySlots", {
                    type: "number",
                    description: "The number of slots in the history which can be used to store replaced passwords",
                })
                .option("pwdRecentlyExpiredDuration", {
                    type: "number",
                    description: "The period in seconds during which an expired password is kept in the userPwdRecentlyExpired attribute",
                })
                .option("pwdEncAlg", {
                    type: "string",
                    description: "Dot-delimited object identifier of the password encryption algorithm",
                })
                .help()
                .strict()
                ;
        },
        handler: async (argv) => {
            const connection = await bind(ctx, argv);
            await command(ctx, connection, argv);
            await connection.close();
        },
    };
}

export default create;
