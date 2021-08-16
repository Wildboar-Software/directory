import yargs from "yargs/yargs";
import ctx from "./ctx";
import loadAttributeTypes from "./utils/loadAttributeTypes";
import loadLDAPSyntaxes from "./utils/loadLDAPSyntaxes";
import do_read from "./commands/dap/read";
import do_list from "./commands/dap/list";
import do_compare from "./commands/dap/compare";
import do_administerPassword from "./commands/dap/apw";
import do_changePassword from "./commands/dap/cpw";
import do_removeEntry from "./commands/dap/remove";
import do_modifyDN from "./commands/dap/moddn";
import dap_add_country from "./yargs/dap_add_country";
import dap_add_organization from "./yargs/dap_add_organization";
import dap_add_organizationalUnit from "./yargs/dap_add_organizationalUnit";
import dap_add_organizationalPerson from "./yargs/dap_add_organizationalPerson";
import dap_add_locality from "./yargs/dap_add_locality";
import dap_add_person from "./yargs/dap_add_person";
import do_seedCountries from "./commands/util/seed-countries";
import bind from "./net/bind";

loadLDAPSyntaxes(ctx);
loadAttributeTypes(ctx);

yargs(process.argv.slice(2))
    .scriptName("x500")
    .command("seed-countries [base]", "seed directory with countries", (yargs) => {
        return yargs
            .positional("base", {
                describe: "The base object under which to place the countries.",
            });
    }, async (argv) => {
        const connection = await bind(ctx, argv);
        await do_seedCountries(ctx, connection, argv);
    })
    .command("dap read [object]", "read entry", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object to read",
            });
    }, async (argv) => {
        const connection = await bind(ctx, argv);
        await do_read(ctx, connection, argv);
    })
    .command("dap remove [object]", "remove entry", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object to be removed",
            });
    }, async (argv) => {
        const connection = await bind(ctx, argv);
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
        const connection = await bind(ctx, argv);
        await do_modifyDN(ctx, connection, argv);
    })
    .command("dap list [object]", "list entries", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object whose subordinates are to be read.",
            });
    }, async (argv) => {
        const connection = await bind(ctx, argv);
        await do_list(ctx, connection, argv);
    })
    .command("dap apw [object]", "administer password", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object whose password is to be changed.",
            });
    }, async (argv) => {
        const connection = await bind(ctx, argv);
        await do_administerPassword(ctx, connection, argv);
    })
    .command("dap cpw [object]", "change password", (yargs) => {
        return yargs
            .positional("object", {
                describe: "The object whose password is to be changed.",
            });
    }, async (argv) => {
        const connection = await bind(ctx, argv);
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
        const connection = await bind(ctx, argv);
        await do_compare(ctx, connection, argv);
    })
    .command(dap_add_country(ctx))
    .command(dap_add_locality(ctx))
    .command(dap_add_person(ctx))
    .command(dap_add_organization(ctx))
    .command(dap_add_organizationalUnit(ctx))
    .command(dap_add_organizationalPerson(ctx))
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
