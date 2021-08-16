import * as fs from "fs";
import * as readline from "readline";
import yargs from "yargs/yargs";
import ctx from "./ctx";
import loadAttributeTypes from "./utils/loadAttributeTypes";
import loadLDAPSyntaxes from "./utils/loadLDAPSyntaxes";
import connect from "./net/connect";
import do_read from "./app/commands/dap/read";
import do_list from "./app/commands/dap/list";
import do_compare from "./app/commands/dap/compare";
import do_administerPassword from "./app/commands/dap/apw";
import do_changePassword from "./app/commands/dap/cpw";
import do_removeEntry from "./app/commands/dap/remove";
import do_modifyDN from "./app/commands/dap/moddn";
import do_addEntry_country from "./app/commands/dap/add/country";
import do_addEntry_locality from "./app/commands/dap/add/locality";
import do_addEntry_organization from "./app/commands/dap/add/organization";
import do_seedCountries from "./app/commands/util/seed-countries";
import { Context, Connection } from "./types";
import MutableWriteable from "./utils/MutableWriteable";

loadLDAPSyntaxes(ctx);
loadAttributeTypes(ctx);

const mutedOut = new MutableWriteable();

async function createConnection (
    ctx: Context,
    argv: Record<string, any>,
): Promise<Connection> {
    let password: Buffer | undefined;
    if (argv.password) {
        password = Buffer.from(argv.password as string);
    } else if (argv.passwordFile) {
        password = fs.readFileSync(argv.passwordFile as string);
    } else if (argv.promptPassword) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        rl.question("Password: ", (answer: string): void => {
            password = Buffer.from(answer, "utf-8");
            rl.close();
        });
        mutedOut.muted = true;
    }
    if (!argv.accessPoint) {
        ctx.log.warn("hostURL not set. Defaulting to idm://localhost:102.");
    }
    const hostURL = argv.accessPoint ?? "idm://localhost:102";
    const bindDN = argv.bindDN ?? "";
    const connection = await connect(ctx, hostURL as string, bindDN as string, password);
    if (!connection) {
        ctx.log.error("Could not create connection.");
        process.exit(1);
    }
    ctx.log.info("Connected.");
    return connection;
}

yargs(process.argv.slice(2))
    .scriptName("x500")
    .command("seed-countries [base]", "seed directory with countries", (yargs) => {
        return yargs
            .positional("base", {
                describe: "The base object under which to place the countries.",
            });
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_seedCountries(ctx, connection, argv);
    })
    .command("dap read [object]", "read entry", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object to read",
            });
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_read(ctx, connection, argv);
    })
    .command("dap remove [object]", "remove entry", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object to be removed",
            });
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_removeEntry(ctx, connection, argv);
    })
    .command("dap moddn [object] [newObject]", "move entry", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object to be moved (the source)",
            })
            .positional("newObject", {
                describe: "The new distinguished name of the object (the destination)",
            });
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_modifyDN(ctx, connection, argv);
    })
    .command("dap list [object]", "list entries", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object whose subordinates are to be read.",
            });
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_list(ctx, connection, argv);
    })
    .command("dap apw [object]", "administer password", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object whose password is to be changed.",
            });
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_administerPassword(ctx, connection, argv);
    })
    .command("dap cpw [object]", "change password", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object whose password is to be changed.",
            });
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_changePassword(ctx, connection, argv);
    })
    .command(
        "dap compare [object] [type] [value]",
        "compare an entry against an assertion",
        (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object whose subordinates are to be read.",
            })
            .positional("type", {
                describe: "The attribute type of the purported value.",
            })
            .positional("value", {
                describe: "The purported value.",
            })
            ;
    }, async (argv) => {
        const connection = await createConnection(ctx, argv);
        await do_compare(ctx, connection, argv);
    })
    // .command("dap add locality", "add a locality", (y) => y, async (argv) => {

    // })
    .command({
        command: "dap add locality",
        describe: "Add a locality",
        builder: (y) => {
            return y
                .option("localityName", {
                    alias: "l",
                    type: "string",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "s",
                    type: "string",
                    description: "The name of the state or province",
                })
                .option("description", {
                    alias: "d",
                    type: "string",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    alias: "a",
                    type: "string",
                    description: "The distinguished name of another related entry",
                })
                .option("streetAddress", {
                    alias: "a",
                    type: "string",
                    description: "The street address",
                })
                .array("localityName")
                .array("stateOrProvinceName")
                .array("description")
                .array("seeAlso")
                .array("streetAddress")
                ;
        },
        handler: async (argv: Record<string, any>): Promise<void> => {
            const connection = await createConnection(ctx, argv);
            await do_addEntry_locality(ctx, connection, argv);
        },
    })
    .command({
        command: "dap add country",
        describe: "Add a country",
        builder: (yargs) => {
            return yargs
                .option("countryName", {
                    alias: "c",
                    type: "string",
                    description: "The ISO-3166 2-letter country code",
                })
                .option("description", {
                    alias: "d",
                    type: "string",
                    description: "An arbitrary description",
                })
                .array("description")
                .demandOption("countryName")
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await createConnection(ctx, argv);
            await do_addEntry_country(ctx, connection, argv);
        },
    })
    .command({
        command: "dap add organization",
        describe: "Add an organization",
        builder: (yargs) => {
            return yargs
                .option("organizationName", {
                    alias: "o",
                    type: "array",
                    description: "The organization name",
                })
                .option("description", {
                    alias: "d",
                    type: "array",
                    description: "An arbitrary description",
                })
                .option("seeAlso", {
                    alias: "a",
                    type: "array",
                    description: "The distinguished name of another related entry",
                })
                .option("businessCategory", {
                    alias: "b",
                    type: "array",
                    description: "A string identifying the category of the organization",
                })
                .option("localityName", {
                    alias: "l",
                    type: "array",
                    description: "The name of the locality"
                })
                .option("stateOrProvinceName", {
                    alias: "s",
                    type: "array",
                    description: "The name of the state or province",
                })
                .option("streetAddress", {
                    alias: "a",
                    type: "array",
                    description: "The street address",
                })
                .option("physicalDeliveryOfficeName", {
                    alias: "d",
                    type: "array",
                    description: "The name of the physical delivery office",
                })
                .option("postalAddress", {
                    alias: "p",
                    type: "array",
                    description: "The full, multi-line postal address",
                })
                .option("postalCode", {
                    alias: "c",
                    type: "array",
                    description: "The postal code",
                })
                .option("postOfficeBox", {
                    alias: "q",
                    type: "array",
                    description: "The post office box identifier",
                })
                .option("telephoneNumber", {
                    alias: "t",
                    type: "array",
                    description: "The telephone number",
                })
                .option("facsimileTelephoneNumber", {
                    alias: "f",
                    type: "array",
                    description: "The fax number",
                })
                .demandOption("organizationName")
                .help()
                ;
        },
        handler: async (argv) => {
            const connection = await createConnection(ctx, argv);
            await do_addEntry_organization(ctx, connection, argv);
        },
    })
    .option("bindDN", {
        alias: "D",
        type: "string",
        description: "The distinguished name with which to bind.",
    })
    .option("password", {
        alias: "w",
        type: "string",
        description: "The clear-text password. (Be careful. Your command history may be saved or logged.)",
    })
    .option("passwordFile", {
        alias: "y",
        type: "string",
        description: "The path to a file containing the clear-text bind password, which does not have to be UTF-8 encoded.",
    })
    .option("promptPassword", {
        alias: "W",
        type: "boolean",
        description: "Whether to interactively prompt for the bind password.",
    })
    .option("accessPoint", {
        alias: "H",
        type: "string",
        description: "The URL of the access point. (Must start with idm:// or idms://.)",
        default: "idm://localhost:102",
    })
    .option("noTLS", {
        alias: "z",
        type: "boolean",
        description: "If TRUE, fails if TLS URL is used and prevents automatic StartTLS.",
        default: false,
    })
    .option("verbose", {
        alias: "v",
        type: "boolean",
        description: "Verbose output",
    })
    .demandCommand()
    .demandOption("bindDN")
    .help()
    .wrap(80)
    .argv // This is a getter, and calling it is necessary to get yargs to run.
    ;
