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
    _encodePrintableString,
    _encodeOctetString,
} from "@wildboar/asn1/functional";
import {
    _encode_RDNSequence,
} from "@wildboar/x500/InformationFramework";
import {
    PostalAddress,
    _encode_PostalAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    FacsimileTelephoneNumber,
    _encode_FacsimileTelephoneNumber,
} from "@wildboar/x500/SelectedAttributeTypes";
import do_addEntry from "../add.js";
import type { ArgumentsCamelCase } from "yargs";
import type { CommonAddOptions } from "../../../yargs/add_common_add_opts.js";

// residentialPerson OBJECT-CLASS ::= {
//     SUBCLASS OF   {person}
//     MUST CONTAIN  {localityName}
//     MAY CONTAIN   {LocaleAttributeSet |
//                    PostalAttributeSet |
//                    preferredDeliveryMethod |
//                    TelecommunicationAttributeSet |
//                    businessCategory}
//     LDAP-NAME     {"residentialPerson"}  -- RFC 4519
//     ID            id-oc-residentialPerson }

export
async function do_addEntry_residentialPerson (
    ctx: Context,
    conn: Connection,
    argv: ArgumentsCamelCase<CommonAddOptions> & Record<string, any>,
): Promise<void> {
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"]!,
            [
                _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                _encodeObjectIdentifier(seloc.residentialPerson["&id"]!, DER),
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
        ...[ argv.surname ]
            .flat()
            .map((value: string) => new Attribute(
                selat.surname["&id"]!,
                [
                    _encodeUTF8String(value, DER),
                ],
                undefined,
            )),
        ...[ argv.localityName ]
            .flat()
            .map((value: string) => new Attribute(
                selat.localityName["&id"]!,
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
    if (argv.businessCategory?.length) {
        const values = [ argv.businessCategory ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.businessCategory["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
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
    if (argv.physicalDeliveryOfficeName?.length) {
        const values = [ argv.physicalDeliveryOfficeName ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.physicalDeliveryOfficeName["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.postalAddress?.length) {
        const values = [ argv.postalAddress ].flat();
        attributes.push(...values.map((value: string) => {
            const postalAddress: PostalAddress = value
                .split("$")
                .map((line) => ({
                    uTF8String: line,
                }));
            return new Attribute(
                selat.postalAddress["&id"]!,
                [
                    _encode_PostalAddress(postalAddress, DER),
                ],
                undefined,
            );
        }));
    }
    if (argv.postalCode?.length) {
        const values = [ argv.postalCode ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.postalCode["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
    }
    if (argv.postOfficeBox?.length) {
        const values = [ argv.postOfficeBox ].flat();
        attributes.push(...values.map((value: string) => new Attribute(
            selat.postOfficeBox["&id"]!,
            [
                _encodeUTF8String(value, DER),
            ],
            undefined,
        )));
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
    if (argv.facsimileTelephoneNumber?.length) {
        const values = [ argv.facsimileTelephoneNumber ].flat();
        attributes.push(...values.map((value: string) => {
            const fax: FacsimileTelephoneNumber = new FacsimileTelephoneNumber(
                value,
                undefined,
            );
            return new Attribute(
                selat.facsimileTelephoneNumber["&id"]!,
                [
                    _encode_FacsimileTelephoneNumber(fax, DER),
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
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_residentialPerson;
