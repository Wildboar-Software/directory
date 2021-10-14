import type { Context, Value } from "@wildboar/meerkat-types";
import type { AttributeValue, ContextValue } from "@prisma/client";
import { ObjectIdentifier, BERElement } from "asn1-ts";

export
async function attributeFromDatabaseAttribute (
    ctx: Context,
    attr: AttributeValue & { ContextValue: ContextValue[] },
): Promise<Value> {
    const value = new BERElement();
    value.fromBytes(attr.ber);
    const contexts: Value["contexts"] = new Map();
    attr.ContextValue.forEach((c) => {
        const CONTEXT_OID: string = c.type;
        const el = new BERElement();
        el.fromBytes(c.ber);
        const group = contexts.get(CONTEXT_OID);
        if (!group) {
            contexts.set(CONTEXT_OID, {
                id: ObjectIdentifier.fromString(c.type),
                fallback: c.fallback,
                values: [ el ],
            });
        } else {
            group.values.push(el);
        }
    });
    return {
        id: new ObjectIdentifier(attr.type.split(".").map((node) => Number.parseInt(node))),
        value,
        contexts,
    };
}

export default attributeFromDatabaseAttribute;
