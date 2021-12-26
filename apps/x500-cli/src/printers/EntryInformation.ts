import type { Context } from "../types";
import { TRUE, FALSE } from "asn1-ts";
import {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import printValue from "./Value";
import { dn } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/dn.oa";
import stringifyDN from "../utils/stringifyDN";

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
            const spec = ctx.attributes.get(info.attribute.type_.toString());
            if (spec?.name) {
                console.log(`${spec.name} (${info.attribute.type_.toString()})`);
            } else {
                console.log(info.attribute.type_.toString());
            }
            info.attribute.values.forEach((v) => {
                if (spec?.ldapSyntax?.isEqualTo(dn["&id"])) {
                    const dn_ = _decode_DistinguishedName(v);
                    console.log("\t" + stringifyDN(ctx, dn_));
                    return;
                }
                if (spec?.valuePrinter) {
                    const printed = spec.valuePrinter(ctx, v);
                    if (printed) {
                        console.log("\t" + printed);
                        return;
                    } else {
                        console.log("\t" + printValue(v));
                        return;
                    }
                } else {
                    console.log("\t" + printValue(v));
                    return;
                }
            });
            info.attribute.valuesWithContext?.forEach((vwc) => {
                console.log("\t" + vwc.value.toString());
                vwc.contextList
                    .forEach((c) => {
                        const cspec = ctx.contextTypes.get(c.contextType.toString());
                        if (cspec?.name) {
                            console.log(`\t\t${cspec.name} (${c.contextType.toString()})` + (c.fallback ? " FALLBACK" : ""));
                        } else {
                            console.log("\t\t" + c.contextType.toString() + (c.fallback ? " FALLBACK" : ""));
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
            const spec = ctx.attributes.get(info.attributeType.toString());
            if (spec?.name) {
                console.log(`${spec.name} (${info.attributeType.toString()})`);
            } else {
                console.log(info.attributeType.toString());
            }
        }
    });
}

export default printEntryInformation;
