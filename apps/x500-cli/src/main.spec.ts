import { CommanderError } from "commander";
import { describe, expect, it } from "vitest";
import type { Command } from "commander";
import { createProgram } from "./main.js";
import type { Context } from "./types.js";

async function renderHelp (args: string[]): Promise<string> {
    const program: Command = createProgram({} as Context);
    let output = "";
    program.configureOutput({
        writeOut: (text) => {
            output += text;
        },
        writeErr: (text) => {
            output += text;
        },
    });
    try {
        await program.parseAsync(args, { from: "user" });
    } catch (error) {
        if (!(error instanceof CommanderError) || error.exitCode !== 0) {
            throw error;
        }
    }
    return output;
}

describe("x500 command tree", () => {
    it("lists the top-level commands", async () => {
        const help = await renderHelp(["--help"]);
        expect(help).toContain("Directory Access Protocol");
        expect(help).toContain("Directory Operational Binding Management Protocol");
        expect(help).toContain("seed-countries");
        expect(help).toContain("config");
        expect(help).not.toContain("yargs");
    });

    it("shows protocol options on dap and a nested add command", async () => {
        const dap = await renderHelp(["dap", "--help"]);
        expect(dap).toContain("--bindDN");
        expect(dap).toContain("read");
        expect(dap).toContain("search");

        const country = await renderHelp(["dap", "add", "country", "--help"]);
        expect(country).toContain("--target-ae-title");
        expect(country).toContain("--bindDN");
        expect(country).toContain("countryName");
    });

    it("shows the dop shadow commands as positionals named for the variant word", async () => {
        const help = await renderHelp(["dop", "--help"]);
        expect(help).toContain("become");
        expect(help).toContain("consume");
        expect(help).toContain("supply");
        expect(help).toContain("terminate");
    });

    it("fails closed when a required command is omitted", async () => {
        const program = createProgram({} as Context);
        program.configureOutput({
            writeOut: () => {},
            writeErr: () => {},
        });
        await expect(program.parseAsync([], { from: "user" })).rejects.toMatchObject({
            exitCode: 1,
        });
    });
});
