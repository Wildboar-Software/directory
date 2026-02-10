import { Buffer } from "node:buffer";
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
    _encodeOctetString,
    _encodePrintableString,
} from "@wildboar/asn1/functional";
import do_addEntry from "../add.js";
import {
    _encode_RDNSequence,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../../utils/destringifyDN.js";
import {
    PostalAddress,
    _encode_PostalAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    FacsimileTelephoneNumber,
    _encode_FacsimileTelephoneNumber,
} from "@wildboar/x500/SelectedAttributeTypes";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts.js";

// organizationalPerson OBJECT-CLASS ::= {
//     SUBCLASS OF  {person}
//     MAY CONTAIN  {LocaleAttributeSet |
//                   PostalAttributeSet |
//                   TelecommunicationAttributeSet |
//                   organizationalUnitName |
//                   title}
//     LDAP-NAME    {"organizationalPerson"}  -- RFC 4519
//     ID           id-oc-organizationalPerson }

export
async function do_addEntry_organizationalPerson (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"]!,
            argv.commonName
                .flat()
                .map((value: string) => _encodeUTF8String(value, DER)),
            undefined,
        ),
        new Attribute(
            selat.surname["&id"]!,
            argv.surname
                .flat()
                .map((value: string) => _encodeUTF8String(value, DER)),
            undefined,
        ),
    ];
    if (argv.description?.length) {
        const values: string[] = [ argv.description ].flat();
        attributes.push(new Attribute(
            selat.description["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.seeAlso?.length) {
        const values: string[] = [ argv.seeAlso ].flat();
        attributes.push(new Attribute(
            selat.seeAlso["&id"],
            values.map((value) => _encode_RDNSequence(destringifyDN(ctx, value), DER)),
        ));
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
    if (argv.stateOrProvinceName?.length) {
        const values: string[] = [ argv.stateOrProvinceName ].flat();
        attributes.push(new Attribute(
            selat.stateOrProvinceName["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.localityName?.length) {
        const values: string[] = [ argv.localityName ].flat();
        attributes.push(new Attribute(
            selat.localityName["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.streetAddress?.length) {
        const values: string[] = [ argv.streetAddress ].flat();
        attributes.push(new Attribute(
            selat.streetAddress["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.physicalDeliveryOfficeName?.length) {
        const values: string[] = [ argv.physicalDeliveryOfficeName ].flat();
        attributes.push(new Attribute(
            selat.physicalDeliveryOfficeName["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.postalAddress?.length) {
        const values: string[] = [ argv.postalAddress ].flat();
        attributes.push(new Attribute(
            selat.postalAddress["&id"]!,
            values.map((value) => {
                const postalAddress: PostalAddress = value
                    .split("$")
                    .map((line) => ({
                        uTF8String: line.trim(),
                    }));
                return _encode_PostalAddress(postalAddress, DER);
            }),
        ));
    }
    if (argv.postalCode?.length) {
        const values: string[] = [ argv.postalCode ].flat();
        attributes.push(new Attribute(
            selat.postalCode["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.postOfficeBox?.length) {
        const values: string[] = [ argv.postOfficeBox ].flat();
        attributes.push(new Attribute(
            selat.postOfficeBox["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.telephoneNumber?.length) {
        const values: string[] = [ argv.telephoneNumber ].flat();
        attributes.push(new Attribute(
            selat.telephoneNumber["&id"]!,
            values.map((value) => _encodePrintableString(value, DER)),
        ));
    }
    if (argv.facsimileTelephoneNumber?.length) {
        const values: string[] = [ argv.facsimileTelephoneNumber ].flat();
        attributes.push(new Attribute(
            selat.facsimileTelephoneNumber["&id"]!,
            values.map((value) => {
                const fax: FacsimileTelephoneNumber = new FacsimileTelephoneNumber(
                    value,
                    undefined,
                );
                return  _encode_FacsimileTelephoneNumber(fax, DER);
            }),
        ));
    }
    if (argv.organizationalUnitName?.length) {
        const values: string[] = [ argv.organizationalUnitName ].flat();
        attributes.push(new Attribute(
            selat.organizationalUnitName["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.title?.length) {
        const values: string[] = [ argv.title ].flat();
        attributes.push(new Attribute(
            selat.title["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_organizationalPerson;
