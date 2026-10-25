import process from "node:process";
import { pathToFileURL } from "node:url";
import { CommanderError, type Command } from "commander";
import ctx from "./ctx.js";
import loadAttributeTypes from "./utils/loadAttributeTypes.js";
import loadObjectClasses from "./utils/loadObjectClasses.js";
import loadLDAPSyntaxes from "./utils/loadLDAPSyntaxes.js";
import loadContextTypes from "./utils/loadContextTypes.js";
import do_compare from "./commands/dap/compare.js";
import do_administerPassword from "./commands/dap/apw.js";
import do_changePassword from "./commands/dap/cpw.js";
import do_removeEntry from "./commands/dap/remove.js";
import do_modifyDN from "./commands/dap/moddn.js";
import config_add_pref from "./cli/config_add_pref.js";
import config_add_cred_simple from "./cli/config_add_cred_simple.js";
import config_add_dsa from "./cli/config_add_dsa.js";
import config_add_context from "./cli/config_add_context.js";
import config_rm_pref from "./cli/config_rm_pref.js";
import config_rm_cred from "./cli/config_rm_cred.js";
import config_rm_dsa from "./cli/config_rm_dsa.js";
import config_rm_context from "./cli/config_rm_context.js";
import dap_add_subentry from "./cli/dap_add_subentry.js";
import dap_add_country from "./cli/dap_add_country.js";
import dap_add_organization from "./cli/dap_add_organization.js";
import dap_add_organizationalUnit from "./cli/dap_add_organizationalUnit.js";
import dap_add_organizationalPerson from "./cli/dap_add_organizationalPerson.js";
import dap_add_organizationalRole from "./cli/dap_add_organizationalRole.js";
import dap_add_locality from "./cli/dap_add_locality.js";
import dap_add_person from "./cli/dap_add_person.js";
import dap_add_group from "./cli/dap_add_group.js";
import dap_add_residentialPerson from "./cli/dap_add_residentialPerson.js";
import dap_add_process from "./cli/dap_add_process.js";
import dap_add_device from "./cli/dap_add_device.js";
import dap_add_dmd from "./cli/dap_add_dmd.js";
import dap_add_inetOrgPerson from "./cli/dap_add_inetOrgPerson.js";
import dap_list from "./cli/dap_list.js";
import dap_mod_add_acs from "./cli/dap_mod_add_acs.js";
import dap_mod_add_aci from "./cli/dap_mod_add_aci.js";
import dap_mod_add_cr from "./cli/dap_mod_add_cr.js";
import dap_mod_add_cur from "./cli/dap_mod_add_cur.js";
import dap_mod_add_friendship from "./cli/dap_mod_add_friendship.js";
import dap_mod_add_mru from "./cli/dap_mod_add_mru.js";
import dap_mod_add_nf from "./cli/dap_mod_add_nf.js";
import dap_mod_add_oc from "./cli/dap_mod_add_oc.js";
import dap_mod_add_sr from "./cli/dap_mod_add_sr.js";
import dap_mod_become_admpoint from "./cli/dap_mod_become_admpoint.js";
import dap_mod_become_collectivesub from "./cli/dap_mod_become_collectivesub.js";
import dap_mod_become_pwdsub from "./cli/dap_mod_become_pwdsub.js";
import dap_mod_become_subschema from "./cli/dap_mod_become_subschema.js";
import dap_mod_become_svcsub from "./cli/dap_mod_become_svcsub.js";
import dap_mod_become_acsub from "./cli/dap_mod_become_acsub.js";
import dap_read from "./cli/dap_read.js";
import dap_search from "./cli/dap_search.js";
import do_seedCountries from "./commands/util/seed-countries.js";
import bind from "./net/bind.js";
import getConfig from "./getConfig.js";
import config_path from "./cli/config_path.js";
import config_view from "./cli/config_view.js";
import config_init from "./cli/config_init.js";
import config_set_context from "./cli/config_set_context.js";
import config_current_context from "./cli/config_current_context.js";
import dop_become_nssr from "./cli/dop_become_nssr.js";
import dop_join_nssr from "./cli/dop_join_nssr.js";
import dop_shadow from "./cli/dop_shadow.js";
import dop_terminate from "./cli/dop_terminate.js";
import {
    addProtocolOptions,
    createX500Program,
    registerCommand,
    type CliCommand,
} from "./cli/builder.js";
import type { Context } from "./types.js";

function registerProtocolCommand (parent: Command, spec: CliCommand<any>): Command {
    return registerCommand(parent, spec, { protocol: true });
}

export
function createProgram (appCtx: Context): Command {
    const program = createX500Program();

    const dap = program
        .command("dap")
        .description("Directory Access Protocol");
    addProtocolOptions(dap);

    const add = dap
        .command("add")
        .description("Add an entry");
    addProtocolOptions(add);
    registerProtocolCommand(add, dap_add_subentry(appCtx));
    registerProtocolCommand(add, dap_add_country(appCtx));
    registerProtocolCommand(add, dap_add_locality(appCtx));
    registerProtocolCommand(add, dap_add_person(appCtx));
    registerProtocolCommand(add, dap_add_organization(appCtx));
    registerProtocolCommand(add, dap_add_organizationalUnit(appCtx));
    registerProtocolCommand(add, dap_add_organizationalPerson(appCtx));
    registerProtocolCommand(add, dap_add_organizationalRole(appCtx));
    registerProtocolCommand(add, dap_add_group(appCtx));
    registerProtocolCommand(add, dap_add_residentialPerson(appCtx));
    registerProtocolCommand(add, dap_add_process(appCtx));
    registerProtocolCommand(add, dap_add_device(appCtx));
    registerProtocolCommand(add, dap_add_dmd(appCtx));
    registerProtocolCommand(add, dap_add_inetOrgPerson(appCtx));

    registerProtocolCommand(dap, {
        command: "apw <object>",
        describe: "Administer password",
        builder: (args) => args
            .positional("object", {
                describe: "The object whose password is to be changed.",
            })
            .option("newPassword", {
                type: "string",
                description: "The new password. If omitted, the command prompts for it.",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_administerPassword(appCtx, connection, argv);
            await connection.close();
        },
    });
    registerProtocolCommand(dap, {
        command: "cpw <object>",
        describe: "Change password",
        builder: (args) => args
            .positional("object", {
                describe: "The object whose password is to be changed.",
            })
            .option("oldPassword", {
                type: "string",
                description: "The current password. If omitted, the command prompts for it.",
            })
            .option("newPassword", {
                type: "string",
                description: "The new password. If omitted, the command prompts for it.",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_changePassword(appCtx, connection, argv);
            await connection.close();
        },
    });
    registerProtocolCommand(dap, {
        command: "compare <object> <type> <value>",
        describe: "Compare an entry against an assertion",
        builder: (args) => args
            .positional("object", {
                describe: "The object whose subordinates are to be read.",
            })
            .positional("type", {
                describe: "The attribute type of the purported value.",
            })
            .positional("value", {
                describe: "The purported value.",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_compare(appCtx, connection, argv);
            await connection.close();
        },
    });
    registerProtocolCommand(dap, dap_list(appCtx));

    const mod = dap
        .command("mod")
        .description("Modify an entry");
    addProtocolOptions(mod);
    const modAdd = mod
        .command("add")
        .description("Add attributes or values");
    addProtocolOptions(modAdd);
    registerProtocolCommand(modAdd, dap_mod_add_aci(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_acs(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_cr(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_cur(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_friendship(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_mru(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_nf(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_oc(appCtx));
    registerProtocolCommand(modAdd, dap_mod_add_sr(appCtx));
    const become = mod
        .command("become")
        .description("Add an auxiliary object class or administrative role");
    addProtocolOptions(become);
    registerProtocolCommand(become, dap_mod_become_acsub(appCtx));
    registerProtocolCommand(become, dap_mod_become_admpoint(appCtx));
    registerProtocolCommand(become, dap_mod_become_collectivesub(appCtx));
    registerProtocolCommand(become, dap_mod_become_pwdsub(appCtx));
    registerProtocolCommand(become, dap_mod_become_subschema(appCtx));
    registerProtocolCommand(become, dap_mod_become_svcsub(appCtx));

    registerProtocolCommand(dap, {
        command: "move <src> <dest>",
        describe: "Move an entry",
        builder: (args) => args
            .positional("src", {
                describe: "The object to be moved (the source)",
            })
            .positional("dest", {
                describe: "The new distinguished name of the object (the destination)",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_modifyDN(appCtx, connection, argv, true);
            await connection.close();
        },
    });
    registerProtocolCommand(dap, {
        command: "rename <src> <dest>",
        describe: "Rename an entry",
        builder: (args) => args
            .positional("src", {
                describe: "The object to be moved (the source)",
            })
            .positional("dest", {
                describe: "The new relative distinguished name of the object",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_modifyDN(appCtx, connection, argv, false);
            await connection.close();
        },
    });
    registerProtocolCommand(dap, dap_read(appCtx));
    registerProtocolCommand(dap, {
        command: "remove <object>",
        describe: "Remove an entry",
        builder: (args) => args
            .positional("object", {
                describe: "The object to be removed",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_removeEntry(appCtx, connection, argv);
            await connection.close();
        },
    });
    registerProtocolCommand(dap, dap_search(appCtx));

    const dop = program
        .command("dop")
        .description("Directory Operational Binding Management Protocol");
    addProtocolOptions(dop);
    registerProtocolCommand(dop, dop_become_nssr(appCtx));
    registerProtocolCommand(dop, dop_join_nssr(appCtx));
    registerProtocolCommand(dop, dop_shadow(appCtx, "consume"));
    registerProtocolCommand(dop, dop_shadow(appCtx, "supply"));
    registerProtocolCommand(dop, dop_terminate(appCtx));

    registerProtocolCommand(program, {
        command: "seed-countries <base>",
        describe: "seed directory with countries",
        builder: (args) => args
            .positional("base", {
                describe: "The base object under which to place the countries.",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_seedCountries(appCtx, connection, argv);
            await connection.close();
        },
    });
    registerProtocolCommand(program, {
        command: "seed-org <orgname>",
        describe: "seed directory with an organization",
        builder: (args) => args
            .positional("orgname", {
                describe: "The base object under which to place the countries.",
            }),
        handler: async (argv) => {
            const connection = await bind(appCtx, argv);
            await do_seedCountries(appCtx, connection, argv);
            await connection.close();
        },
    });

    const config = program
        .command("config")
        .description("Configuration");
    registerCommand(config, config_init(appCtx));
    registerCommand(config, config_path(appCtx));
    registerCommand(config, config_view(appCtx));
    registerCommand(config, config_current_context(appCtx));
    registerCommand(config, config_set_context(appCtx));
    const configAdd = config
        .command("add")
        .description("Add something to the X.500 configuration file");
    registerCommand(configAdd, config_add_pref(appCtx));
    const cred = configAdd
        .command("cred")
        .description("Add a credential to the configuration file");
    registerCommand(cred, config_add_cred_simple(appCtx));
    registerCommand(configAdd, config_add_dsa(appCtx));
    registerCommand(configAdd, config_add_context(appCtx));
    const configRm = config
        .command("rm")
        .description("Remove something from the configuration file");
    registerCommand(configRm, config_rm_pref(appCtx));
    registerCommand(configRm, config_rm_cred(appCtx));
    registerCommand(configRm, config_rm_dsa(appCtx));
    registerCommand(configRm, config_rm_context(appCtx));

    return program;
}

async function main (): Promise<void> {
    loadLDAPSyntaxes(ctx);
    loadAttributeTypes(ctx);
    loadObjectClasses(ctx);
    loadContextTypes(ctx);
    ctx.config = await getConfig(ctx);
    try {
        await createProgram(ctx).parseAsync(process.argv);
    } catch (e) {
        if (e instanceof CommanderError) {
            process.exitCode = e.exitCode;
            return;
        }
        const properties = (typeof e === "object" && !!e) ? { ...e } : {};
        ctx.log.error("err", properties);
        process.exitCode = 1;
    }
}

const invokedDirectly = process.argv[1] !== undefined
    && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
    void main();
}
