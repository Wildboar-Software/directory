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
    _encodeOctetString,
    _encodePrintableString,
} from "asn1-ts/dist/node/functional";
import do_addEntry from "../add";
import {
    _encode_RDNSequence,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";
import destringifyDN from "../../../utils/destringifyDN";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts";

// person OBJECT-CLASS ::= {
//     SUBCLASS OF   {top}
//     MUST CONTAIN  {commonName |
//                    surname}
//     MAY CONTAIN   {description |
//                    telephoneNumber |
//                    userPassword |
//                    seeAlso}
//     LDAP-NAME     {"person"}  -- RFC 4519
//     ID            id-oc-person }

export
async function do_addEntry_person (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.person["&id"]!, DER),
            ],
            undefined,
        ),
        ...argv.commonName
            .map((value: string) => new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String(value, DER),
                ],
                undefined,
            )),
        ...argv.surname
            .map((value: string) => new Attribute(
                selat.surname["&id"]!,
                [
                    _encodeUTF8String(value, DER),
                ],
                undefined,
            )),
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
    if (typeof argv.userPassword === "string") {
        attributes.push(new Attribute(
            selat.userPassword["&id"]!,
            [
                _encodeOctetString(Buffer.from(argv.userPassword, "utf-8"), DER),
            ],
            undefined,
        ));
    }
    if (argv.telephoneNumber?.length) {
        const values = [ argv.telephoneNumber ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.telephoneNumber["&id"]!,
            [
                _encodePrintableString(value, DER),
            ],
            undefined,
        )));
    }
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_person;
