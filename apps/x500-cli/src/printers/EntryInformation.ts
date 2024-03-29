import type { Context } from "../types";
import { TRUE, FALSE } from "asn1-ts";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import printValue from "./Value";
import stringifyDN from "../utils/stringifyDN";
import printAttributeValue from "./AttributeValue";
import chalk from "chalk";
import { EOL } from "node:os";

const colorize: (str: string) => string = process.env.NO_COLOR
    ? (str: string): string => str
    : (str: string) => chalk.bold(chalk.underline(str));

export
function printEntryInformation (
    ctx: Context,
    entry: EntryInformation,
): string {
    let ret: string = colorize(`----- ${stringifyDN(ctx, entry.name.rdnSequence)} -----`) + EOL;
    const unusualThings: string[] = [];
    if (entry.fromEntry === FALSE) {
        unusualThings.push("fromEntry: FALSE");
    }
    if (entry.incompleteEntry === TRUE) {
        unusualThings.push("incompleteEntry: TRUE");
    }
    if (entry.partialName === TRUE) {
        unusualThings.push("partialName: TRUE");
    }
    if (entry.derivedEntry === TRUE) {
        unusualThings.push("derivedEntry: TRUE");
    }
    if (unusualThings.length) {
        ret += ("-----" + EOL);
        ret += unusualThings.join(EOL);
        ret += (EOL + "-----" + EOL);
    }
    // TODO: Use for loop instead.
    entry.information?.forEach((info) => {
        if ("attribute" in info) {
            const TYPE_OID: string = info.attribute.type_.toString();
            const spec = ctx.attributes.get(TYPE_OID);
            if (spec?.name) {
                ret += (`${spec.name} (${TYPE_OID})` + EOL);
            } else {
                ret += TYPE_OID + EOL;
            }
            info.attribute.values
                .forEach((v) => ret += ("\t" + printAttributeValue(ctx, v, spec) + EOL));
            info.attribute.valuesWithContext?.forEach((vwc) => {
                ret += ("\t" + vwc.value.toString() + EOL);
                vwc.contextList
                    .forEach((c) => {
                        const CONTEXT_TYPE_OID: string = c.contextType.toString();
                        const cspec = ctx.contextTypes.get(CONTEXT_TYPE_OID);
                        if (cspec?.name) {
                            ret += (`\t\t${cspec.name} (${CONTEXT_TYPE_OID})` + (c.fallback ? " FALLBACK" : "") + EOL);
                        } else {
                            ret += ("\t\t" + CONTEXT_TYPE_OID + (c.fallback ? " FALLBACK" : "") + EOL);
                        }
                        c.contextValues
                            .forEach((cv) => {
                                if (cspec?.valuePrinter) {
                                    const printed = cspec.valuePrinter(ctx, cv);
                                    if (printed) {
                                        ret += ("\t\t\t" + printed + EOL);
                                        return;
                                    } else {
                                        ret += ("\t\t\t" + printValue(cv) + EOL);
                                        return;
                                    }
                                } else {
                                    ret += ("\t\t\t" + printValue(cv) + EOL);
                                    return;
                                }
                            });
                    });
            });
        } else if ("attributeType" in info) {
            const TYPE_OID: string = info.attributeType.toString();
            const spec = ctx.attributes.get(TYPE_OID);
            if (spec?.name) {
                ret += (`${spec.name} (${TYPE_OID})${EOL}`);
            } else {
                ret += (TYPE_OID + EOL);
            }
        }
    });
    return ret;
}

export default printEntryInformation;
