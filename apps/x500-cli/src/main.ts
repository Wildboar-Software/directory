import yargs from "yargs/yargs";
import type { Argv } from "yargs";
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
import dap_mod_add_aci from "./yargs/dap_mod_add_aci";
import dap_mod_add_cr from "./yargs/dap_mod_add_cr";
import dap_mod_add_cur from "./yargs/dap_mod_add_cur";
import dap_mod_add_friendship from "./yargs/dap_mod_add_friendship";
import dap_mod_add_mru from "./yargs/dap_mod_add_mru";
import dap_mod_add_nf from "./yargs/dap_mod_add_nf";
import dap_mod_add_oc from "./yargs/dap_mod_add_oc";
import dap_mod_add_sr from "./yargs/dap_mod_add_sr";
import dap_mod_become_admpoint from "./yargs/dap_mod_become_admpoint";
import dap_mod_become_collectivesub from "./yargs/dap_mod_become_collectivesub";
import dap_mod_become_pwdsub from "./yargs/dap_mod_become_pwdsub";
import dap_mod_become_subschema from "./yargs/dap_mod_become_subschema";
import dap_mod_become_svcsub from "./yargs/dap_mod_become_svcsub";
import dap_mod_become_acsub from "./yargs/dap_mod_become_acsub";
import dap_search from "./yargs/dap_search";
import do_seedCountries from "./commands/util/seed-countries";
import bind from "./net/bind";
import getConfig, { DEFAULT_CONFIGURATION_FILE } from "./getConfig";
import { PREFERRED_CONFIG_FILE_LOCATION } from "./configFileLocations";
import * as fs from "fs/promises";
import { strict as assert } from "assert";
import type { ConfigAccessPoint } from "@wildboar/x500-cli-config";
import { saveConfig } from "./saveConfig";
import MutableWriteable from "./utils/MutableWriteable";
import * as readline from "readline";

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

function createConfigurationFile () {
    return fs.writeFile(PREFERRED_CONFIG_FILE_LOCATION, DEFAULT_CONFIGURATION_FILE);
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
            .command("config", "Configuration", (configYargs) => {
                configYargs
                    .command(
                        "init",
                        "Initialize an X.500 configuration file (directory.yaml) on your system",
                        () => {},
                        createConfigurationFile,
                    )
                    .command("add", "Add something to the X.500 configuration file", (addYargs) => {
                        return addYargs
                            .command("dsa <name>", "Add a DSA to the X.500 configuration file", (dsaYargs) => {
                                return dsaYargs
                                    .positional("name", {
                                        type: "string",
                                        description: "A case-sensitive name for the DSA",
                                    })
                                    .option("accessPoint", {
                                        alias: "a",
                                        type: "array",
                                        string: true,
                                        description: "Comma-separated access point URLs, optionally preceded by 'master', 'shadow', or 'wcopy' and a colon to indicate the category. e.g. shadow:idms://dsa01.example.com:109,ldap://dsa01.example.com:389",
                                    })
                                    .demandOption("name")
                                    .demandOption("accessPoint")
                                    ;
                            }, async (dsaYargs) => {
                                if (!ctx.config) {
                                    ctx.log.warn("There is no configuration file to be edited. Creating one.");
                                    await createConfigurationFile();
                                    ctx.config = await getConfig(ctx);
                                }
                                assert(ctx.config);
                                ctx.config.dsas.push({
                                    name: dsaYargs.name,
                                    accessPoints: dsaYargs.accessPoint.map((a) => {
                                        const category: string | undefined = Object.entries({
                                            "master:": "master",
                                            "shadow:": "shadow",
                                            "wcopy:": "writeableCopy",
                                        }).find(([ prefix, ]) => a.startsWith(prefix))?.[1];
                                        const urlStrings = (category === undefined)
                                            ? a.split(",")
                                            : a.slice(a.indexOf(":") + 1).split(",");
                                        const urls = urlStrings.map((str) => new URL(str));
                                        for (const url of urls) {
                                            if (url.username || url.password) {
                                                console.warn("You supplied a username and password via a URL, but these will be ignored.");
                                            }
                                        }
                                        return {
                                            category,
                                            urls: urlStrings,
                                        };
                                    }) as [ConfigAccessPoint, ...ConfigAccessPoint[]],
                                });
                                await saveConfig(ctx.config);
                            })
                            .command("pref <name>", "Add a preference profile to the X.500 configuration file", (prefYargs) => {
                                return prefYargs
                                    .positional("name", {
                                        type: "string",
                                        description: "A case-sensitive name for the preference profile",
                                    })
                                    .option("logLevel", {
                                        alias: "l",
                                        type: "string",
                                        choices: [
                                            "debug",
                                            "info",
                                            "warn",
                                            "error",
                                            "silent",
                                        ],
                                        description: "The logging level of the client",
                                    })
                                    .option("sizeLimit", {
                                        alias: "s",
                                        type: "number",
                                        description: "A positive integer; the default sizeLimit supplied in search` or `list operations",
                                    })
                                    .option("timeLimit", {
                                        alias: "t",
                                        type: "number",
                                        description: "A positive integer; the default timeLimit supplied in directory operations",
                                    })
                                    .option("attributeSizeLimit", {
                                        alias: "a",
                                        type: "number",
                                        description: "A positive integer; the default attributeSizeLimit supplied in directory operations.",
                                    })
                                    .option("readOnly", {
                                        alias: "r",
                                        type: "boolean",
                                        description: "A boolean indicating whether no write operations should be permitted",
                                    })
                                    .option("disable-start-tls", {
                                        alias: "d",
                                        type: "boolean",
                                        description: "A boolean indicating whether the client should refrain from upgrading the connection security via StartTLS",
                                    })
                                    .option("callingAETitle", {
                                        alias: "c",
                                        type: "string",
                                        description: "The distinguished name of the calling application entity (AE) title, as used by IDM and ISO transports",
                                    })
                                    .option("other", {
                                        alias: "x",
                                        type: "array",
                                        string: true,
                                        description: "Key=value pairs for other values that should appear in the configuration file. Value will always be a string."
                                    })
                                    .demandOption("name")
                                    ;
                            }, async (prefYargs) => {
                                if (!ctx.config) {
                                    ctx.log.warn("There is no configuration file to be edited. Creating one.");
                                    await createConfigurationFile();
                                    ctx.config = await getConfig(ctx);
                                }
                                assert(ctx.config);
                                ctx.config["preference-profiles"] = ctx.config["preference-profiles"] ?? [];
                                ctx.config["preference-profiles"].push({
                                    name: prefYargs.name,
                                    logLevel: prefYargs.logLevel,
                                    sizeLimit: prefYargs.sizeLimit,
                                    timeLimit: prefYargs.timeLimit,
                                    attributeSizeLimit: prefYargs.attributeSizeLimit,
                                    readOnly: prefYargs.readOnly,
                                    ["disable-start-tls"]: prefYargs["disable-start-tls"],
                                    callingAETitle: prefYargs.callingAETitle,
                                    ...Object.fromEntries((prefYargs.other ?? [])
                                        .map((o) => [ o.slice(0, o.indexOf("=")), o.slice(o.indexOf("=") + 1) ])),
                                });
                                await saveConfig(ctx.config);
                            })
                            .command("cred", "Add a credential to the X.500 configuration file", (credYargs) => {
                                return credYargs
                                    .command("simple <name> <binddn>", "Add a simple credential", (simpleYargs) => {
                                        return simpleYargs
                                            .positional("name", {
                                                type: "string",
                                                description: "A case-sensitive name for the credential",
                                            })
                                            .positional("binddn", {
                                                type: "string",
                                                description: "The bind distinguished name",
                                            })
                                            .option("password", {
                                                alias: "p",
                                                type: "boolean",
                                                description: "Prompt for a password",
                                            })
                                            .demandOption("name")
                                            .demandOption("binddn")
                                            ;
                                    }, async (simpleYargs) => {
                                        if (!ctx.config) {
                                            ctx.log.warn("There is no configuration file to be edited. Creating one.");
                                            await createConfigurationFile();
                                            ctx.config = await getConfig(ctx);
                                        }
                                        assert(ctx.config);
                                        if (simpleYargs.password) {
                                            const mutedOut = new MutableWriteable();
                                            const rl = readline.createInterface({
                                                input: process.stdin,
                                                output: mutedOut,
                                                terminal: true,
                                            });
                                            rl.question("Password: ", async (answer: string): Promise<void> => {
                                                console.log();
                                                ctx.config!.credentials.push({
                                                    name: simpleYargs.name,
                                                    credential: {
                                                        type: "simple",
                                                        name: simpleYargs.binddn,
                                                        password: {
                                                            unprotected: answer,
                                                        },
                                                    },
                                                });
                                                rl.close();
                                                await saveConfig(ctx.config!);
                                            });
                                            mutedOut.muted = true;
                                        } else {
                                            ctx.config.credentials.push({
                                                name: simpleYargs.name,
                                                credential: {
                                                    type: "simple",
                                                    name: simpleYargs.binddn,
                                                },
                                            });
                                            await saveConfig(ctx.config);
                                        }
                                    })
                                    .demandCommand();
                            })
                            .command("context <name>", "Add a context to the X.500 configuration file", (ctxtYargs) => {
                                return ctxtYargs
                                    .positional("name", {
                                        type: "string",
                                        description: "A case-sensitive name for the context",
                                    })
                                    .option("pref", {
                                        alias: "p",
                                        type: "string",
                                        description: "The case-sensitive name of the preference profile to use for this context",
                                    })
                                    .option("dsa", {
                                        alias: "d",
                                        type: "string",
                                        description: "The case-sensitive name of the DSA to use for this context"
                                    })
                                    .option("cred", {
                                        alias: "c",
                                        type: "string",
                                        description: "The case-sensitive name of the credential to use for this context"
                                    })
                                    .demandOption("name")
                                    .demandOption("dsa")
                                    ;
                            }, async (ctxtYargs) => {
                                if (!ctx.config) {
                                    ctx.log.warn("There is no configuration file to be edited. Creating one.");
                                    await createConfigurationFile();
                                    ctx.config = await getConfig(ctx);
                                }
                                assert(ctx.config);
                                ctx.config.contexts.push({
                                    name: ctxtYargs.name,
                                    context: {
                                        dsa: ctxtYargs.dsa,
                                        credential: ctxtYargs.cred,
                                        preferences: ctxtYargs.pref,
                                    },
                                });
                                await saveConfig(ctx.config);
                            })
                            .demandCommand();
                    })
                    // .command("rm", "Remove something from the configuration file", (rmYargs) => {

                    // })
                    .demandCommand()
                    ;
            })
            .demandCommand()
            .help()
            .wrap(100)
            .argv // This is a getter, and calling it is necessary to get yargs to run.
            ;
    } catch (e) {
        ctx.log.error("err");
        ctx.log.error(e);
    }
}

main();
