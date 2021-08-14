import { Context } from "./types";

const ctx: Context = {
    log: console,
    attributes: new Map([]),
    ldapSyntaxes: new Map([]),
};

export default ctx;
