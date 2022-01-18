import type { Context, Value } from "@wildboar/meerkat-types";
import type { ContextValue } from "@prisma/client";
import { ObjectIdentifier, BERElement } from "asn1-ts";
import groupByOID from "../utils/groupByOID";

export
async function attributeFromDatabaseAttribute (
    ctx: Context,
    attr: { type: string, ber: Buffer, ContextValue?: ContextValue[] },
): Promise<Value> {
    const value = new BERElement();
    value.fromBytes(attr.ber);
    const contexts = groupByOID(attr.ContextValue ?? [], (cv) => cv.type);
    return {
        type: ObjectIdentifier.fromString(attr.type),
        value,
        contexts: Object.entries(contexts)
            .map(([ key, value ]) => {
                return {
                    contextType: ObjectIdentifier.fromString(key),
                    fallback: value[0].fallback,
                    contextValues: value.map((v) => {
                        const el = new BERElement();
                        el.fromBytes(v.ber);
                        return el;
                    }),
                };
            }),
    };
}

export default attributeFromDatabaseAttribute;
