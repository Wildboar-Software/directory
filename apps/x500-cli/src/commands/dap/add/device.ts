import type { Connection, Context } from "../../../types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import * as selat from "@wildboar/x500/src/lib/collections/attributes";
import * as seloc from "@wildboar/x500/src/lib/collections/objectClasses";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeUTF8String,
    _encodePrintableString,
} from "asn1-ts/dist/node/functional";
import do_addEntry from "../add";
import {
    _encode_RDNSequence,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";
import destringifyDN from "../../../utils/destringifyDN";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts";

// device OBJECT-CLASS ::= {
//     SUBCLASS OF   {top}
//     MUST CONTAIN  {commonName}
//     MAY CONTAIN   {description |
//                    localityName |
//                    organizationName |
//                    organizationalUnitName |
//                    owner |
//                    seeAlso |
//                    serialNumber}
//     LDAP-NAME      {"device"}  -- RFC 4519
//     ID            id-oc-device }

export
async function do_addEntry_device (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.device["&id"]!, DER),
            ],
            undefined,
        ),
        ...[ argv.commonName ]
            .flat()
            .map((value: string) => new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String(value, DER),
                ],
                undefined,
            )),
    ];
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
    if (argv.organizationName?.length) {
        const values = [ argv.organizationName ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.organizationName["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.organizationalUnitName?.length) {
        const values = [ argv.organizationalUnitName ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.organizationalUnitName["&id"]!,
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
    if (argv.owner?.length) {
        const values = [ argv.owner ].flat();
        attributes.push(...values.map((value: string) => {
            const owner = destringifyDN(ctx, value);
            return new Attribute(
                selat.owner["&id"]!,
                [
                    _encode_RDNSequence(owner, DER),
                ],
                undefined,
            );
        }));
    }
    if (argv.serialNumber?.length) {
        const values = [ argv.serialNumber ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.serialNumber["&id"]!,
            [
                _encodePrintableString(value, DER),
            ],
            undefined,
        )));
    }
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_device;
