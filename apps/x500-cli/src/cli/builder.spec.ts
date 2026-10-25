import { CommanderError } from "commander";
import { describe, expect, it } from "vitest";
import {
    addProtocolOptions,
    createX500Program,
    registerCommand,
    type CliArguments,
    type CliCommand,
} from "./builder.js";

async function parse (
    args: string[],
    spec: CliCommand,
    options: { protocol?: boolean; parent?: boolean } = {},
): Promise<CliArguments> {
    const program = createX500Program();
    program.configureOutput({
        writeOut: () => {},
        writeErr: () => {},
    });
    const parent = options.parent
        ? program.command("dap").description("Directory Access Protocol")
        : program;
    if (options.parent) {
        addProtocolOptions(parent);
    }
    let captured: CliArguments | undefined;
    registerCommand(parent, {
        ...spec,
        handler: async (argv) => {
            captured = argv;
            await spec.handler(argv);
        },
    }, { protocol: options.protocol });
    await program.parseAsync(args, { from: "user" });
    if (!captured) {
        throw new Error("Command handler did not run.");
    }
    return captured;
}

describe("commander command registration", () => {
    it("parses positionals, aliases, arrays, and choices", async () => {
        const argv = await parse([
            "read",
            "cn=Ada",
            "-m",
            "--user-attribute",
            "2.5.4.3",
            "--userAttribute",
            "2.5.4.4",
            "--priority",
            "high",
            "--time-limit",
            "5",
        ], {
            command: "read <object>",
            describe: "Read an entry",
            builder: (args) => args
                .positional("object", { type: "string", describe: "The entry" })
                .option("modifyRights", { alias: "m", type: "boolean", describe: "Rights" })
                .option("userAttribute", { alias: "u", type: "array", describe: "Attributes" })
                .option("priority", {
                    type: "string",
                    choices: ["low", "medium", "high"],
                    description: "Priority",
                })
                .option("timeLimit", { type: "number", description: "Seconds" })
                .strict(),
            handler: () => {},
        });

        expect(argv.object).toBe("cn=Ada");
        expect(argv.modifyRights).toBe(true);
        expect(argv.m).toBe(true);
        expect(argv.userAttribute).toEqual(["2.5.4.3", "2.5.4.4"]);
        expect(argv.u).toEqual(["2.5.4.3", "2.5.4.4"]);
        expect(argv.priority).toBe("high");
        expect(argv.timeLimit).toBe(5);
    });

    it("accepts a multi-character alias as its own long flag", async () => {
        const argv = await parse([
            "person",
            "cn=Ada",
            "--cn",
            "Ada Lovelace",
            "--sn",
            "Lovelace",
        ], {
            command: "person <object>",
            builder: (args) => args
                .positional("object", { type: "string" })
                .option("commonName", { alias: "cn", type: "array" })
                .option("surname", { alias: "sn", type: "string" })
                .strict(),
            handler: () => {},
        });
        expect(argv.object).toBe("cn=Ada");
        expect(argv.commonName).toEqual(["Ada Lovelace"]);
        expect(argv.cn).toEqual(["Ada Lovelace"]);
        expect(argv.surname).toBe("Lovelace");
        expect(argv.sn).toBe("Lovelace");
    });

    it("keeps hyphenated option names and coerces repeated array values", async () => {
        const argv = await parse([
            "org",
            "cn=Acme",
            "--target-ae-title",
            "cn=dsa",
            "--target-naddr",
            "idm://one",
            "--target-naddr",
            "idm://two",
            "--prefer-chaining",
        ], {
            command: "org <object>",
            builder: (args) => args
                .positional("object", { type: "string" })
                .option("target-ae-title", { type: "string", description: "AE title" })
                .option("target-naddr", { type: "array", string: true, description: "NSAPs" })
                .option("preferChaining", { type: "boolean", description: "Chain" })
                .strict(),
            handler: () => {},
        });

        expect(argv["target-ae-title"]).toBe("cn=dsa");
        expect(argv.targetAeTitle).toBe("cn=dsa");
        expect(argv["target-naddr"]).toEqual(["idm://one", "idm://two"]);
        expect(argv.preferChaining).toBe(true);
    });

    it("accepts protocol options before or after the subcommand", async () => {
        const spec: CliCommand = {
            command: "read <object>",
            builder: (args) => args
                .positional("object", { type: "string" })
                .strict(),
            handler: () => {},
        };
        const before = await parse([
            "dap",
            "--bind-dn",
            "cn=admin",
            "-W",
            "secret",
            "--no-tls",
            "read",
            "cn=Ada",
        ], spec, { parent: true, protocol: true });
        expect(before.object).toBe("cn=Ada");
        expect(before.bindDN).toBe("cn=admin");
        expect(before.D).toBe("cn=admin");
        expect(before.password).toBe("secret");
        expect(before.noTLS).toBe(true);

        const after = await parse([
            "dap",
            "read",
            "cn=Ada",
            "--accessPoint",
            "idm://localhost:4632",
            "-V",
        ], spec, { parent: true, protocol: true });
        expect(after.object).toBe("cn=Ada");
        expect(after.accessPoint).toBe("idm://localhost:4632");
        expect(after.verbose).toBe(true);
        expect(after.noTLS).toBe(false);
    });

    it("treats a bare word in the command string as a required positional", async () => {
        const argv = await parse([
            "become",
            "nssr",
            "c=US",
            "cn=dsa",
            "--p-selector",
            "01ff",
        ], {
            command: "become nssr <object> <ae-title>",
            builder: (args) => args
                .positional("object", { type: "string", description: "Object" })
                .positional("ae-title", { type: "string", description: "AE title" })
                .option("p-selector", { alias: "p", type: "string", describe: "P-selector" })
                .strict(),
            handler: () => {},
        });
        expect(argv.nssr).toBe("nssr");
        expect(argv.object).toBe("c=US");
        expect(argv["ae-title"]).toBe("cn=dsa");
        expect(argv["p-selector"]).toBe("01ff");
        expect(argv.pSelector).toBe("01ff");
    });

    it("coerces numeric positionals and rejects conflicting options", async () => {
        const argv = await parse(["svc", "cn=sub", "7", "1.2.3"], {
            command: "svc <object> <id> <dmdId>",
            builder: (args) => args
                .positional("id", { type: "number" })
                .positional("dmdId", { type: "string" })
                .strict(),
            handler: () => {},
        });
        expect(argv.object).toBe("cn=sub");
        expect(argv.id).toBe(7);
        expect(argv.dmdId).toBe("1.2.3");

        await expect(parse(["supply", "shadow", "cp", "cn=ae", "--supplier-initiated", "--consumer-initiated"], {
            command: "supply shadow <cp> <ae-title>",
            builder: (args) => args
                .option("supplier-initiated", { type: "boolean", conflicts: "consumer-initiated" })
                .option("consumer-initiated", { type: "boolean", conflicts: "supplier-initiated" })
                .strict(),
            handler: () => {},
        })).rejects.toMatchObject({ code: "commander.conflictingOption" });
    });

    it("requires demanded options and rejects unknown options in strict commands", async () => {
        await expect(parse(["group", "cn=staff"], {
            command: "group <object>",
            builder: (args) => args
                .option("commonName", { alias: "cn", type: "array" })
                .demandOption("commonName")
                .strict(),
            handler: () => {},
        })).rejects.toBeInstanceOf(CommanderError);

        await expect(parse(["read", "cn=Ada", "--not-a-real-option"], {
            command: "read <object>",
            builder: (args) => args.strict(),
            handler: () => {},
        })).rejects.toMatchObject({ code: "commander.unknownOption" });
    });

    it("rejects values outside the declared choices", async () => {
        await expect(parse(["search", "cn=base", "sideways"], {
            command: "search <object> <subset>",
            builder: (args) => args
                .positional("subset", { type: "string", choices: ["base", "one", "sub"] })
                .strict(),
            handler: () => {},
        })).rejects.toBeInstanceOf(CommanderError);

        await expect(parse(["search", "cn=base", "sub", "--hierarchy-selections", "nope"], {
            command: "search <object> <subset>",
            builder: (args) => args
                .options("hierarchySelections", {
                    alias: "h",
                    type: "array",
                    choices: ["self", "children", "all"],
                })
                .strict(),
            handler: () => {},
        })).rejects.toBeInstanceOf(CommanderError);
    });

    it("lets an -h alias remain an option instead of printing help", async () => {
        const argv = await parse(["search", "cn=base", "sub", "-h", "self", "-h", "children"], {
            command: "search <object> <subset>",
            builder: (args) => args
                .positional("subset", { choices: ["base", "one", "sub"] })
                .option("hierarchySelections", {
                    alias: "h",
                    type: "array",
                    choices: ["self", "children", "all"],
                }),
            handler: () => {},
        });
        expect(argv.subset).toBe("sub");
        expect(argv.hierarchySelections).toEqual(["self", "children"]);
    });

    it("lets a later command replace an earlier command of the same name", async () => {
        const program = createX500Program();
        program.configureOutput({
            writeOut: () => {},
            writeErr: () => {},
        });
        const seen: string[] = [];
        registerCommand(program, {
            command: "sr <object>",
            describe: "first",
            handler: async () => {
                seen.push("first");
            },
        });
        registerCommand(program, {
            command: "sr <object>",
            describe: "second",
            handler: async (argv) => {
                seen.push(String(argv.object));
            },
        });
        await program.parseAsync(["sr", "kept"], { from: "user" });
        expect(seen).toEqual(["kept"]);
        expect(program.commands.filter((command) => command.name() === "sr")).toHaveLength(1);
    });

    it("coerces numeric array options", async () => {
        const argv = await parse(["sr", "cn=sub", "--superior-structure-rule", "1", "--superiorStructureRule", "4"], {
            command: "sr <object>",
            builder: (args) => args
                .option("superiorStructureRule", {
                    type: "array",
                    number: true,
                    description: "Superior rules",
                })
                .strict(),
            handler: () => {},
        });
        expect(argv.superiorStructureRule).toEqual([1, 4]);
    });

    it("marks an option as an array when .array() is called after it is defined", async () => {
        const argv = await parse(["country", "c=US", "US", "--description", "one", "--description", "two"], {
            command: "country <object> <countryName>",
            builder: (args) => args
                .option("description", { type: "string", description: "Text" })
                .array("description"),
            handler: () => {},
        });
        expect(argv.countryName).toBe("US");
        expect(argv.description).toEqual(["one", "two"]);
    });
});
