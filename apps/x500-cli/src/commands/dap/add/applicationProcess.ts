import type { Connection, Context } from "@wildboar/meerkat-types";
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
import {
    _encode_RDNSequence,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";
import destringifyDN from "../../../utils/destringifyDN";

// applicationProcess OBJECT-CLASS ::= {
//     SUBCLASS OF   {top}
//     MUST CONTAIN  {commonName}
//     MAY CONTAIN   {description |
//                    localityName |
//                    organizationalUnitName |
//                    seeAlso}
//     LDAP-NAME     {"applicationProcess"}   -- RFC 4519
//     ID            id-oc-applicationProcess }

export
async function do_addEntry_applicationProcess (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.applicationProcess["&id"]!, DER),
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
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_applicationProcess;
