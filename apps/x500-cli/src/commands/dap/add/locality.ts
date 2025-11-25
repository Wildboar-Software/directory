import type { Connection, Context } from "../../../types.js";
import destringifyDN from "../../../utils/destringifyDN.js";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { attributes as selat } from "@wildboar/x500";
import { objectClasses as seloc } from "@wildboar/x500";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
} from "@wildboar/asn1/functional";
import {
    _encode_RDNSequence,
} from "@wildboar/x500/InformationFramework";
import do_addEntry from "../add.js";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts.js";

export
async function do_addEntry_locality (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.locality["&id"]!, DER),
            ],
            undefined,
        ),
    ];
    if (argv.stateOrProvinceName?.length) {
        const values = [ argv.stateOrProvinceName ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.stateOrProvinceName["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.localityName?.length) {
        const values = [ argv.localityName ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.localityName["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.streetAddress?.length) {
        const values = [ argv.streetAddress ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.streetAddress["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
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
    if (argv.seeAlso?.length) {
        const values = [ argv.seeAlso ].flat();
        attributes.push(...values.map((value: string) => {
            const seeAlso = destringifyDN(ctx, value);
            return new Attribute(
                selat.seeAlso["&id"]!,
                [
                    _encode_RDNSequence(seeAlso, DER),
                ],
                undefined,
            );
        }));
    }
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_locality;
