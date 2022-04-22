import yargs from "yargs/yargs";
import ctx from "./ctx";
import loadAttributeTypes from "./utils/loadAttributeTypes";
import loadObjectClasses from "./utils/loadObjectClasses";
import loadLDAPSyntaxes from "./utils/loadLDAPSyntaxes";
import loadContextTypes from "./utils/loadContextTypes";
import do_read from "./commands/dap/read";
import do_list from "./commands/dap/list";
import do_compare from "./commands/dap/compare";
import do_administerPassword from "./commands/dap/apw";
import do_changePassword from "./commands/dap/cpw";
import do_removeEntry from "./commands/dap/remove";
import do_modifyDN from "./commands/dap/moddn";
import dap_add_subentry from "./yargs/dap_add_subentry";
import dap_add_country from "./yargs/dap_add_country";
import dap_add_organization from "./yargs/dap_add_organization";
import dap_add_organizationalUnit from "./yargs/dap_add_organizationalUnit";
import dap_add_organizationalPerson from "./yargs/dap_add_organizationalPerson";
import dap_add_organizationalRole from "./yargs/dap_add_organizationalRole";
import dap_add_locality from "./yargs/dap_add_locality";
import dap_add_person from "./yargs/dap_add_person";
import dap_add_group from "./yargs/dap_add_group";
import dap_add_residentialPerson from "./yargs/dap_add_residentialPerson";
import dap_add_process from "./yargs/dap_add_process";
import dap_add_device from "./yargs/dap_add_device";
import dap_add_dmd from "./yargs/dap_add_dmd";
import dap_mod_add_acs from "./yargs/dap_mod_add_acs";
import dap_mod_become_admpoint from "./yargs/dap_mod_become_admpoint";
import dap_mod_become_collectivesub from "./yargs/dap_mod_become_collectivesub";
import dap_mod_become_pwdsub from "./yargs/dap_mod_become_pwdsub";
import dap_mod_become_subschema from "./yargs/dap_mod_become_subschema";
import dap_mod_become_svcsub from "./yargs/dap_mod_become_svcsub";
import dap_mod_become_acsub from "./yargs/dap_mod_become_acsub";
import dap_search from "./yargs/dap_search";
import do_seedCountries from "./commands/util/seed-countries";
import bind from "./net/bind";
import getConfig from "./getConfig";

async function main () {
    loadLDAPSyntaxes(ctx);
    loadAttributeTypes(ctx);
    loadObjectClasses(ctx);
    loadContextTypes(ctx);
    ctx.config = await getConfig(ctx);
    try {
        yargs(process.argv.slice(2))
            .scriptName("x500")
            .command("seed-countries <base>", "seed directory with countries", (seedYargs) => {
                return seedYargs
                    .positional("base", {
                        describe: "The base object under which to place the countries.",
                    })
                    ;
            }, async (argv) => {
                const connection = await bind(ctx, argv);
                await do_seedCountries(ctx, connection, argv);
                await connection.close();
            })
            .command("dap", "Directory Access Protocol", (dapYargs) => {
                dapYargs
                    .command("add", "Add an entry", (addYargs) => {
                        addYargs
                            .command(dap_add_subentry(ctx))
                            .command(dap_add_country(ctx))
                            .command(dap_add_locality(ctx))
                            .command(dap_add_person(ctx))
                            .command(dap_add_organization(ctx))
                            .command(dap_add_organizationalUnit(ctx))
                            .command(dap_add_organizationalPerson(ctx))
                            .command(dap_add_organizationalRole(ctx))
                            .command(dap_add_group(ctx))
                            .command(dap_add_residentialPerson(ctx))
                            .command(dap_add_process(ctx))
                            .command(dap_add_device(ctx))
                            .command(dap_add_dmd(ctx))
                            .demandCommand()
                            ;
                    })
                    .command("apw <object>", "Administer password", (apwYargs) => {
                        return apwYargs
                            .positional("object", {
                                describe: "The object whose password is to be changed.",
                            })
                            ;
                    }, async (argv) => {
                        const connection = await bind(ctx, argv);
                        await do_administerPassword(ctx, connection, argv);
                        await connection.close();
                    })
                    .command("cpw <object>", "Change password", (cpwYargs) => {
                        return cpwYargs
                            .positional("object", {
                                describe: "The object whose password is to be changed.",
                            })
                            ;
                    }, async (argv) => {
                        const connection = await bind(ctx, argv);
                        await do_changePassword(ctx, connection, argv);
                        await connection.close();
                    })
                    .command(
                        "compare <object> <type> <value>",
                        "Compare an entry against an assertion",
                        (compareYargs) => {
                        return compareYargs
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
                        await connection.close();
                    })
                    .command("list <object>", "List entries", (listYargs) => {
                        listYargs
                            .positional("object", {
                                describe: "The object whose subordinates are to be read.",
                            })
                            // TODO: list new
                            // TODO: list continue
                            // TODO: list abandon
                            ;
                    }, async (argv) => {
                        const connection = await bind(ctx, argv);
                        await do_list(ctx, connection, argv);
                        await connection.close();
                    })
                    .command("mod", "Modify an entry", (addYargs) => {
                        addYargs
                            .command("add", "Add attributes or values", (addYargs) => {
                                addYargs
                                    .command(dap_mod_add_acs(ctx))
                                    .demandCommand();
                            })
                            .command("become", "Add an auxiliary object class or administrative role", (becomeYargs) => {
                                becomeYargs
                                    .command(dap_mod_become_acsub(ctx))
                                    .command(dap_mod_become_admpoint(ctx))
                                    .command(dap_mod_become_collectivesub(ctx))
                                    .command(dap_mod_become_pwdsub(ctx))
                                    .command(dap_mod_become_subschema(ctx))
                                    .command(dap_mod_become_svcsub(ctx))
                                    .demandCommand();
                            })
                            .demandCommand();
                    })
                    .command("moddn <src> <dest>", "Move/Rename an entry", (modDNYargs) => {
                        return modDNYargs
                            .positional("src", {
                                describe: "The object to be moved (the source)",
                            })
                            .positional("dest", {
                                describe: "The new distinguished name of the object (the destination)",
                            })
                            ;
                    }, async (argv) => {
                        const connection = await bind(ctx, argv);
                        await do_modifyDN(ctx, connection, argv);
                        await connection.close();
                    })
                    .command("read <object>", "Read an entry", (readYargs) => {
                        return readYargs
                            .positional("object", {
                                describe: "The object to read",
                            });
                    }, async (argv) => {
                        const connection = await bind(ctx, argv);
                        await do_read(ctx, connection, argv);
                        await connection.close();
                    })
                    .command("remove <object>", "Remove an entry", (removeYargs) => {
                        return removeYargs
                            .positional("object", {
                                describe: "The object to be removed",
                            });
                    }, async (argv) => {
                        const connection = await bind(ctx, argv);
                        await do_removeEntry(ctx, connection, argv);
                        await connection.close();
                    })
                    .command(dap_search(ctx))
                    .demandCommand()
            })
            .option("bindDN", {
                alias: "D",
                type: "string",
                description: "The distinguished name with which to bind.",
            })
            .option("password", {
                alias: "W",
                type: "string",
                description: "The clear-text password. (Be careful. Your command history may be saved or logged.)",
            })
            .option("passwordFile", {
                alias: "Y",
                type: "string",
                description: "The path to a file containing the clear-text bind password, which does not have to be UTF-8 encoded.",
            })
            .option("promptPassword", {
                alias: "P",
                type: "boolean",
                description: "Whether to interactively prompt for the bind password.",
            })
            .option("accessPoint", {
                alias: "H",
                type: "string",
                description: "The URL of the access point. (Must start with idm:// or idms://.)",
            })
            .option("noTLS", {
                alias: "Z",
                type: "boolean",
                description: "If TRUE, fails if TLS URL is used and prevents automatic StartTLS.",
                default: false,
            })
            .option("verbose", {
                alias: "V",
                type: "boolean",
                description: "Verbose output",
            })
            .demandCommand()
            .help()
            .wrap(100)
            // .completion("completion", (current: string, argv: any) => {
            //     return [
            //         "add",
            //         "apw",
            //         "cpw",
            //         "compare",
            //         "list",
            //         "mod",
            //         "moddn",
            //         "read",
            //         "search",
            //     ];
            // })
            .argv // This is a getter, and calling it is necessary to get yargs to run.
            ;
    } catch (e) {
        ctx.log.error("err");
        ctx.log.error(e);
    }
}

main();
