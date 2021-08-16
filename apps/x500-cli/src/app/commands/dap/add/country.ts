import type { Connection, Context } from "../../../../types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import * as selat from "@wildboar/x500/src/lib/collections/attributes";
import * as seloc from "@wildboar/x500/src/lib/collections/objectClasses";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
} from "asn1-ts/dist/node/functional";
import do_addEntry from "../add";

export
async function do_addEntry_country (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.country["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.countryName["&id"]!,
            [
                _encodeUTF8String(argv.countryName, DER),
            ],
            undefined,
        ),
    ];
    if (argv.description?.length) {
        const values = [ argv.description ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.description["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_country;
