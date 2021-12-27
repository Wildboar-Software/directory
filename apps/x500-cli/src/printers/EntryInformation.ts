import type { Context } from "../types";
import { TRUE, FALSE } from "asn1-ts";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import printValue from "./Value";
import stringifyDN from "../utils/stringifyDN";
import printAttributeValue from "./AttributeValue";

export
function printEntryInformation (
    ctx: Context,
    entry: EntryInformation,
): void {
    console.log(`>>> Entry: ${stringifyDN(ctx, entry.name.rdnSequence)}`);
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
        console.log("-----");
        unusualThings.forEach((thing) => console.log(thing));
        console.log("-----");
    }
    entry.information?.forEach((info) => {
        if ("attribute" in info) {
            const TYPE_OID: string = info.attribute.type_.toString();
            const spec = ctx.attributes.get(TYPE_OID);
            if (spec?.name) {
                console.log(`${spec.name} (${TYPE_OID})`);
            } else {
                console.log(TYPE_OID);
            }
            info.attribute.values
                .forEach((v) => console.log("\t" + printAttributeValue(ctx, v, spec)));
            info.attribute.valuesWithContext?.forEach((vwc) => {
                console.log("\t" + vwc.value.toString());
                vwc.contextList
                    .forEach((c) => {
                        const CONTEXT_TYPE_OID: string = c.contextType.toString();
                        const cspec = ctx.contextTypes.get(CONTEXT_TYPE_OID);
                        if (cspec?.name) {
                            console.log(`\t\t${cspec.name} (${CONTEXT_TYPE_OID})` + (c.fallback ? " FALLBACK" : ""));
                        } else {
                            console.log("\t\t" + CONTEXT_TYPE_OID + (c.fallback ? " FALLBACK" : ""));
                        }
                        c.contextValues
                            .forEach((cv) => {
                                if (cspec?.valuePrinter) {
                                    const printed = cspec.valuePrinter(ctx, cv);
                                    if (printed) {
                                        console.log("\t\t\t" + printed);
                                        return;
                                    } else {
                                        console.log("\t\t\t" + printValue(cv));
                                        return;
                                    }
                                } else {
                                    console.log("\t\t\t" + printValue(cv));
                                    return;
                                }
                            });
                    });
            });
        } else if ("attributeType" in info) {
            const TYPE_OID: string = info.attributeType.toString();
            const spec = ctx.attributes.get(TYPE_OID);
            if (spec?.name) {
                console.log(`${spec.name} (${TYPE_OID})`);
            } else {
                console.log(TYPE_OID);
            }
        }
    });
}

export default printEntryInformation;
