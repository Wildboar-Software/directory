import type { Context, Value } from "@wildboar/meerkat-types";
import type { ContextValue } from "@prisma/client";
import { ObjectIdentifier, BERElement } from "asn1-ts";
import groupByOID from "../utils/groupByOID";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";

// TODO: Use the Node-API to speed up this function a lot.
// - Create BERElement even faster.
// - Parse Object Identifier even faster.
// - Single-pass context creation
/**
 * @summary Converts a value from the database into an in-memory value
 * @param ctx The context object
 * @param attr The attribute to be read
 *
 * @function
 * @async
 */
export
function attributeFromDatabaseAttribute (
    ctx: Context,
    attr: { type: string, ber: Buffer, ContextValue?: ContextValue[] },
): Value {
    const value = new BERElement();
    value.fromBytes(attr.ber);
    const contexts = groupByOID(attr.ContextValue ?? [], (cv) => cv.type);
    return {
        type: ObjectIdentifier.fromString(attr.type),
        value,
        contexts: Object.entries(contexts)
            .map(([ key, value ]) => new X500Context(
                ObjectIdentifier.fromString(key),
                value.map((v) => {
                    const el = new BERElement();
                    el.fromBytes(v.ber);
                    return el;
                }),
                value[0].fallback,
            )),
    };
}

export default attributeFromDatabaseAttribute;
