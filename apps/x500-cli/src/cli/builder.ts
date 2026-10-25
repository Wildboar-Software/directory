import {
    Argument,
    Command,
    InvalidArgumentError,
    Option,
    type ParseOptionsResult,
} from "commander";

/**
 * Arguments passed to a command handler.
 *
 * Option names are recorded under the spelling used in the command definition
 * and under the camelCase key commander stores. Hyphenated names such as
 * `target-ae-title` therefore stay readable as `argv["target-ae-title"]`.
 */
export type CliArguments<T extends Record<string, any> = Record<string, any>> = T & Record<string, any>;

export interface CliCommand<T = CliArguments> {
    command: string;
    describe?: string;
    builder?: (argv: CliBuilder) => CliBuilder;
    handler: (argv: T) => void | Promise<void>;
}

export interface PositionalConfig {
    type?: "string" | "number" | "boolean" | "array";
    describe?: string;
    description?: string;
    choices?: readonly string[];
}

export interface OptionConfig {
    alias?: string;
    type?: "string" | "number" | "boolean" | "array";
    describe?: string;
    description?: string;
    choices?: readonly string[];
    default?: unknown;
    demandOption?: boolean | string;
    string?: boolean;
    number?: boolean;
    array?: boolean;
    conflicts?: string | readonly string[];
}

interface ParsedPositional {
    name: string;
    required: boolean;
}

interface OptionMeta {
    originalName: string;
    aliases: string[];
}

const optionMeta = new WeakMap<Option, OptionMeta>();

/**
 * Same hyphen folding commander uses for option attribute names.
 */
function camelcase (name: string): string {
    return name.split("-").reduce((str, word) => {
        return str + word[0].toUpperCase() + word.slice(1);
    });
}

function normalizeFlag (flag: string): string {
    return flag.replace(/^-+/, "").replace(/-/g, "").toLowerCase();
}

function parseNumber (value: string): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        throw new InvalidArgumentError(`Expected a number, received '${value}'.`);
    }
    return parsed;
}

function collectValues <T> (value: T, previous: T[] | undefined): T[] {
    if (!Array.isArray(previous)) {
        return [value];
    }
    return previous.concat(value);
}

function descriptionOf (config: { description?: string; describe?: string }): string {
    return config.description ?? config.describe ?? "";
}

function optionKind (config: OptionConfig): "array" | "boolean" | "number" | "string" {
    if (config.type === "array" || config.array) {
        return "array";
    }
    if (config.type === "number") {
        return "number";
    }
    if (config.type === "boolean") {
        return "boolean";
    }
    if (config.type === "string" || config.choices?.length) {
        return "string";
    }
    return "boolean";
}

function optionFlags (name: string, alias: string | undefined, takesValue: boolean): string {
    const long = takesValue ? `--${name} <${name}>` : `--${name}`;
    if (!alias) {
        return long;
    }
    const prefix = alias.length === 1 ? `-${alias}` : `--${alias}`;
    return `${prefix}, ${long}`;
}

function addConfiguredOption (command: Command, name: string, config: OptionConfig): void {
    const long = `--${name}`;
    if (command.options.some((option) => option.long === long)) {
        return;
    }
    const kind = optionKind(config);
    let alias = config.alias;
    if (alias?.length === 1 && command.options.some((option) => option.short === `-${alias}`)) {
        alias = undefined;
    }
    const option = new Option(optionFlags(name, alias, kind !== "boolean"), descriptionOf(config));
    if (kind === "number") {
        option.argParser(parseNumber);
    } else if (kind === "array") {
        const choices = config.choices;
        if (choices?.length) {
            option.argChoices = [...choices];
        }
        if (config.number) {
            option.argParser((value: string, previous: number[] | undefined) => {
                return collectValues(parseNumber(value), previous);
            });
        } else {
            option.argParser((value: string, previous: string[] | undefined) => {
                if (choices?.length && !choices.includes(value)) {
                    throw new InvalidArgumentError(`Allowed choices are ${choices.join(", ")}.`);
                }
                return collectValues(value, previous);
            });
        }
    } else if (kind === "string" && config.choices?.length) {
        option.choices([...config.choices]);
    }
    if (config.default !== undefined) {
        option.default(config.default);
    }
    if (config.demandOption && config.default === undefined) {
        option.makeOptionMandatory(true);
    }
    if (config.conflicts) {
        const names = Array.isArray(config.conflicts) ? config.conflicts : [config.conflicts];
        option.conflicts(names.map((conflict) => camelcase(conflict)));
    }
    optionMeta.set(option, {
        originalName: name,
        aliases: alias ? [alias] : [],
    });
    command.addOption(option);
}

const protocolOptions: { name: string; config: OptionConfig }[] = [
    {
        name: "bindDN",
        config: {
            alias: "D",
            type: "string",
            description: "The distinguished name with which to bind.",
        },
    },
    {
        name: "password",
        config: {
            alias: "W",
            type: "string",
            description: "The clear-text password. (Be careful. Your command history may be saved or logged.)",
        },
    },
    {
        name: "passwordFile",
        config: {
            alias: "Y",
            type: "string",
            description: "The path to a file containing the clear-text bind password, which does not have to be UTF-8 encoded.",
        },
    },
    {
        name: "promptPassword",
        config: {
            alias: "P",
            type: "boolean",
            description: "Whether to interactively prompt for the bind password.",
        },
    },
    {
        name: "accessPoint",
        config: {
            alias: "H",
            type: "string",
            description: "The URL of the access point. (Must start with idm:// or idms://.)",
        },
    },
    {
        name: "noTLS",
        config: {
            alias: "Z",
            type: "boolean",
            description: "If TRUE, fails if TLS URL is used and prevents automatic StartTLS.",
            default: false,
        },
    },
    {
        name: "verbose",
        config: {
            alias: "V",
            type: "boolean",
            description: "Verbose output",
        },
    },
];

export
function addProtocolOptions (command: Command): void {
    if (command.options.some((option) => option.long === "--bindDN")) {
        return;
    }
    for (const option of protocolOptions) {
        addConfiguredOption(command, option.name, option.config);
    }
}

function assignName (argv: Record<string, any>, name: string, value: unknown): void {
    argv[name] = value;
    const camel = camelcase(name);
    if (camel !== name) {
        argv[camel] = value;
    }
}

function collectArgv (leaf: Command): Record<string, any> {
    const chain: Command[] = [];
    for (let command: Command | null = leaf; command; command = command.parent) {
        chain.unshift(command);
    }
    const argv: Record<string, any> = {};
    const explicit = new Set<string>();
    for (const command of chain) {
        for (const option of command.options) {
            const attribute = option.attributeName();
            const source = command.getOptionValueSource(attribute);
            if (!source) {
                continue;
            }
            if (source === "default" && (explicit.has(attribute) || argv[attribute] !== undefined)) {
                continue;
            }
            if (source !== "default") {
                explicit.add(attribute);
            }
            const value = command.getOptionValue(attribute);
            const meta = optionMeta.get(option);
            assignName(argv, meta?.originalName ?? attribute, value);
            if (meta) {
                for (const alias of meta.aliases) {
                    argv[alias] = value;
                }
            }
            if (attribute !== (meta?.originalName ?? attribute)) {
                argv[attribute] = value;
            }
        }
    }
    return argv;
}

/**
 * Split a command spec into a command name and positionals. The first word is
 * the command name and every later word is a positional, which is how these
 * command strings were already written. `become nssr <object>` is the `become`
 * command with a required positional named `nssr`.
 */
export
function parseCommandSpec (command: string): { name: string; positionals: ParsedPositional[] } {
    const parts = command.replace(/\s{2,}/g, " ").trim().split(/\s+(?![^[]*]|[^<]*>)/);
    const name = parts.shift();
    if (!name) {
        throw new Error(`No command found in: ${command}`);
    }
    return {
        name,
        positionals: parts.map((part) => ({
            name: part.replace(/^[<[]|[>\]]$/g, ""),
            required: !part.startsWith("["),
        })),
    };
}

export
class CliBuilder {
    readonly optionList: { name: string; config: OptionConfig }[] = [];
    readonly positionalMeta = new Map<string, PositionalConfig>();
    readonly requiredOptions = new Set<string>();
    strictMode = false;

    positional (name: string, config: PositionalConfig = {}): this {
        this.positionalMeta.set(name, config);
        return this;
    }

    option (name: string, config: OptionConfig = {}): this {
        const existing = this.optionList.findIndex((option) => option.name === name);
        if (existing >= 0) {
            this.optionList[existing] = { name, config };
        } else {
            this.optionList.push({ name, config });
        }
        if (config.demandOption) {
            this.requiredOptions.add(name);
        }
        return this;
    }

    options (name: string, config: OptionConfig = {}): this {
        return this.option(name, config);
    }

    array (name: string): this {
        const existing = this.optionList.find((option) => option.name === name);
        if (existing) {
            existing.config = { ...existing.config, array: true, type: "array" };
        }
        return this;
    }

    demandOption (name: string): this {
        this.requiredOptions.add(name);
        return this;
    }

    help (): this {
        return this;
    }

    strict (): this {
        this.strictMode = true;
        return this;
    }

    apply (command: Command, positionals: readonly ParsedPositional[]): void {
        for (const positional of positionals) {
            const meta = this.positionalMeta.get(positional.name);
            const argument = new Argument(
                positional.required ? `<${positional.name}>` : `[${positional.name}]`,
                meta ? descriptionOf(meta) : "",
            );
            if (meta?.choices?.length) {
                argument.choices([...meta.choices]);
            } else if (meta?.type === "number") {
                argument.argParser(parseNumber);
            }
            command.addArgument(argument);
        }
        let usesHelpAlias = false;
        for (const option of this.optionList) {
            if (option.config.alias === "h") {
                usesHelpAlias = true;
            }
            addConfiguredOption(command, option.name, option.config);
        }
        for (const name of this.requiredOptions) {
            const defined = this.optionList.find((candidate) => candidate.name === name);
            if (defined?.config.default !== undefined) {
                continue;
            }
            const option = command.options.find((candidate) => candidate.long === `--${name}`);
            option?.makeOptionMandatory(true);
        }
        if (usesHelpAlias) {
            command.helpOption("--help", "Show help");
        }
    }
}

export interface RegisterOptions {
    protocol?: boolean;
}

export
function registerCommand (parent: Command, spec: CliCommand<any>, options: RegisterOptions = {}): Command {
    const parsed = parseCommandSpec(spec.command);
    // A later registration of the same command name replaces the earlier one.
    // Command.commands is mutable at runtime; the public type marks it readonly.
    const commands = parent.commands as Command[];
    const duplicateAt = commands.findIndex((existing) => existing.name() === parsed.name);
    if (duplicateAt >= 0) {
        commands.splice(duplicateAt, 1);
    }
    const command = parent.command(parsed.name);
    if (spec.describe) {
        command.description(spec.describe);
    }
    if (options.protocol) {
        addProtocolOptions(command);
    }
    const builder = new CliBuilder();
    const returned = spec.builder?.(builder) ?? builder;
    const active = returned instanceof CliBuilder ? returned : builder;
    active.apply(command, parsed.positionals);
    if (!active.strictMode) {
        command.allowUnknownOption(true);
        command.allowExcessArguments(true);
    }
    command.action(async (...actionArgs: unknown[]) => {
        const invoked = actionArgs[actionArgs.length - 1] as Command;
        const values = actionArgs.slice(0, parsed.positionals.length);
        const argv = collectArgv(invoked);
        parsed.positionals.forEach((positional, index) => {
            assignName(argv, positional.name, values[index]);
        });
        await spec.handler(argv);
    });
    return command;
}

/**
 * Command whose option parser accepts both camelCase and hyphenated spellings
 * of a flag (`--bindDN` and `--bind-dn`, `--noTLS` and `--no-tls`).
 */
export
class X500Command extends Command {
    createCommand (name?: string): Command {
        return new X500Command(name);
    }

    parseOptions (argv: string[]): ParseOptionsResult {
        const byNormalized = new Map<string, Option>();
        for (const option of this.options) {
            if (option.long) {
                byNormalized.set(normalizeFlag(option.long), option);
            }
        }
        const rewritten: string[] = [];
        let ended = false;
        for (const arg of argv) {
            if (ended || arg === "--") {
                ended = true;
                rewritten.push(arg);
                continue;
            }
            if (!arg.startsWith("--") || arg === "--") {
                rewritten.push(arg);
                continue;
            }
            const equalsAt = arg.indexOf("=");
            const raw = equalsAt === -1 ? arg : arg.slice(0, equalsAt);
            const option = byNormalized.get(normalizeFlag(raw));
            if (!option?.long) {
                rewritten.push(arg);
                continue;
            }
            if (option.isBoolean()) {
                const value = equalsAt === -1 ? undefined : arg.slice(equalsAt + 1);
                if (value !== "false") {
                    rewritten.push(option.long);
                }
                continue;
            }
            rewritten.push(equalsAt === -1 ? option.long : `${option.long}${arg.slice(equalsAt)}`);
        }
        return super.parseOptions(rewritten);
    }
}

export
function createX500Program (): X500Command {
    const program = new X500Command();
    program
        .name("x500")
        .configureHelp({ helpWidth: 100 })
        .showHelpAfterError()
        .exitOverride();
    return program;
}
