import yargs from "yargs/yargs";
import type { Argv } from "yargs";
import ctx from "./ctx.js";
import loadAttributeTypes from "./utils/loadAttributeTypes.js";
import loadObjectClasses from "./utils/loadObjectClasses.js";
import loadLDAPSyntaxes from "./utils/loadLDAPSyntaxes.js";
import loadContextTypes from "./utils/loadContextTypes.js";
import do_read from "./commands/dap/read.js";
import do_compare from "./commands/dap/compare.js";
import do_administerPassword from "./commands/dap/apw.js";
import do_changePassword from "./commands/dap/cpw.js";
import do_removeEntry from "./commands/dap/remove.js";
import do_modifyDN from "./commands/dap/moddn.js";
import config_add_pref from "./yargs/config_add_pref.js";
import config_add_cred_simple from "./yargs/config_add_cred_simple.js";
import config_add_dsa from "./yargs/config_add_dsa.js";
import config_add_context from "./yargs/config_add_context.js";
import config_rm_pref from "./yargs/config_rm_pref.js";
import config_rm_cred from "./yargs/config_rm_cred.js";
import config_rm_dsa from "./yargs/config_rm_dsa.js";
import config_rm_context from "./yargs/config_rm_context.js";
import dap_add_subentry from "./yargs/dap_add_subentry.js";
import dap_add_country from "./yargs/dap_add_country.js";
import dap_add_organization from "./yargs/dap_add_organization.js";
import dap_add_organizationalUnit from "./yargs/dap_add_organizationalUnit.js";
import dap_add_organizationalPerson from "./yargs/dap_add_organizationalPerson.js";
import dap_add_organizationalRole from "./yargs/dap_add_organizationalRole.js";
import dap_add_locality from "./yargs/dap_add_locality.js";
import dap_add_person from "./yargs/dap_add_person.js";
import dap_add_group from "./yargs/dap_add_group.js";
import dap_add_residentialPerson from "./yargs/dap_add_residentialPerson.js";
import dap_add_process from "./yargs/dap_add_process.js";
import dap_add_device from "./yargs/dap_add_device.js";
import dap_add_dmd from "./yargs/dap_add_dmd.js";
import dap_add_inetOrgPerson from "./yargs/dap_add_inetOrgPerson.js";
import dap_list from "./yargs/dap_list.js";
import dap_mod_add_acs from "./yargs/dap_mod_add_acs.js";
import dap_mod_add_aci from "./yargs/dap_mod_add_aci.js";
import dap_mod_add_cr from "./yargs/dap_mod_add_cr.js";
import dap_mod_add_cur from "./yargs/dap_mod_add_cur.js";
import dap_mod_add_friendship from "./yargs/dap_mod_add_friendship.js";
import dap_mod_add_mru from "./yargs/dap_mod_add_mru.js";
import dap_mod_add_nf from "./yargs/dap_mod_add_nf.js";
import dap_mod_add_oc from "./yargs/dap_mod_add_oc.js";
import dap_mod_add_sr from "./yargs/dap_mod_add_sr.js";
import dap_mod_become_admpoint from "./yargs/dap_mod_become_admpoint.js";
import dap_mod_become_collectivesub from "./yargs/dap_mod_become_collectivesub.js";
import dap_mod_become_pwdsub from "./yargs/dap_mod_become_pwdsub.js";
import dap_mod_become_subschema from "./yargs/dap_mod_become_subschema.js";
import dap_mod_become_svcsub from "./yargs/dap_mod_become_svcsub.js";
import dap_mod_become_acsub from "./yargs/dap_mod_become_acsub.js";
import dap_read from "./yargs/dap_read.js";
import dap_search from "./yargs/dap_search.js";
import do_seedCountries from "./commands/util/seed-countries.js";
import bind from "./net/bind.js";
import getConfig from "./getConfig.js";
import config_path from "./yargs/config_path.js";
import config_view from "./yargs/config_view.js";
import config_init from "./yargs/config_init.js";
import config_set_context from "./yargs/config_set_context.js";
import config_current_context from "./yargs/config_current_context.js";
import dop_become_nssr from "./yargs/dop_become_nssr.js";
import dop_join_nssr from "./yargs/dop_join_nssr.js";
import dop_shadow from "./yargs/dop_shadow.js";
import dop_terminate from "./yargs/dop_terminate.js";

export
interface ProtocolArgs {
    bindDN?: string;
    password?: string;
    passwordFile?: string;
    promptPassword?: boolean;
    accessPoint?: string;
    noTLS?: boolean;
    verbose?: boolean;
}

function add_protocol_args (args: Argv): Argv<ProtocolArgs> {
    return args
        // TODO: Move these inside of DAP, DOP, DSP, DISP, MMP, and seed-countries
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
        });
}

async function main () {
    loadLDAPSyntaxes(ctx);
    loadAttributeTypes(ctx);
    loadObjectClasses(ctx);
    loadContextTypes(ctx);
    ctx.config = await getConfig(ctx);
    try {
        yargs(process.argv.slice(2))
            .scriptName("x500")
            .command("dap", "Directory Access Protocol", (dapYargs) => {
                add_protocol_args(dapYargs)
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
                            .command(dap_add_inetOrgPerson(ctx))
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
                    .command(dap_list(ctx))
                    .command("mod", "Modify an entry", (addYargs) => {
                        addYargs
                            .command("add", "Add attributes or values", (addYargs) => {
                                addYargs
                                    .command(dap_mod_add_aci(ctx))
                                    .command(dap_mod_add_acs(ctx))
                                    .command(dap_mod_add_cr(ctx))
                                    .command(dap_mod_add_cur(ctx))
                                    .command(dap_mod_add_friendship(ctx))
                                    .command(dap_mod_add_mru(ctx))
                                    .command(dap_mod_add_nf(ctx))
                                    .command(dap_mod_add_oc(ctx))
                                    .command(dap_mod_add_sr(ctx))
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
                    .command("move <src> <dest>", "Move an entry", (modDNYargs) => {
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
                        await do_modifyDN(ctx, connection, argv, true);
                        await connection.close();
                    })
                    .command("rename <src> <dest>", "Rename an entry", (modDNYargs) => {
                        return modDNYargs
                            .positional("src", {
                                describe: "The object to be moved (the source)",
                            })
                            .positional("dest", {
                                describe: "The new relative distinguished name of the object",
                            })
                            ;
                    }, async (argv) => {
                        const connection = await bind(ctx, argv);
                        await do_modifyDN(ctx, connection, argv, false);
                        await connection.close();
                    })
                    .command(dap_read(ctx))
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
            .command("dop", "Directory Operational Binding Management Protocol", (dopYargs) => {
                add_protocol_args(dopYargs)
                .command(dop_become_nssr(ctx))
                .command(dop_join_nssr(ctx))
                .command(dop_shadow(ctx, "consume"))
                .command(dop_shadow(ctx, "supply"))
                .command(dop_terminate(ctx))
                .demandCommand()
            })
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
            .command("seed-org <orgname>", "seed directory with an organization", (seedYargs) => {
                return seedYargs
                    .positional("orgname", {
                        describe: "The base object under which to place the countries.",
                    })
                    ;
            }, async (argv) => {
                const connection = await bind(ctx, argv);
                await do_seedCountries(ctx, connection, argv);
                await connection.close();
            })
            .command("config", "Configuration", (configYargs) => {
                configYargs
                    .command(config_init(ctx))
                    .command(config_path(ctx))
                    .command(config_view(ctx))
                    .command(config_current_context(ctx))
                    .command(config_set_context(ctx))
                    .command("add", "Add something to the X.500 configuration file", (addYargs) => {
                        return addYargs
                            .command(config_add_pref(ctx))
                            .command("cred", "Add a credential to the configuration file", (y) => y.command(config_add_cred_simple(ctx)))
                            .command(config_add_dsa(ctx))
                            .command(config_add_context(ctx))
                            .demandCommand();
                    })
                    .command("rm", "Remove something from the configuration file", (rmYargs) => {
                        return rmYargs
                            .command(config_rm_pref(ctx))
                            .command(config_rm_cred(ctx))
                            .command(config_rm_dsa(ctx))
                            .command(config_rm_context(ctx))
                            .demandCommand();
                    })
                    .demandCommand()
                    ;
            })
            .demandCommand()
            .help()
            .wrap(100)
            .argv // This is a getter, and calling it is necessary to get yargs to run.
            ;
    } catch (e) {
        const properties = (typeof e === "object" && !!e) ? { ...e } : {};
        ctx.log.error("err", properties);
    }
}

main();
