import type { Connection, Context } from "../../../types.js";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { attributes as selat } from "@wildboar/x500";
import { objectClasses as seloc } from "@wildboar/x500";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
    _encodePrintableString,
} from "@wildboar/asn1/functional";
import do_addEntry from "../add.js";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts.js";

export
async function do_addEntry_country (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
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
                _encodePrintableString(argv.countryName, DER),
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
