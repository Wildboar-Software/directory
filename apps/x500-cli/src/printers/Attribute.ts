import type {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import Context from "../types.js";
import printAttributeValue from "./AttributeValue.js";
import printValue from "./Value.js";
import { EOL } from "node:os";

export
function print (ctx: Context, attr: Attribute): string {
    let ret: string = "";
    const TYPE_OID: string = attr.type_.toString();
    const spec = ctx.attributes.get(TYPE_OID);
    if (spec?.name) {
        ret += (`${spec.name} (${TYPE_OID})` + EOL);
    } else {
        ret += TYPE_OID + EOL;
    }
    attr.values
        .forEach((v) => ret += ("\t" + printAttributeValue(ctx, v, spec) + EOL));
    attr.valuesWithContext?.forEach((vwc) => {
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
    return ret;
}
