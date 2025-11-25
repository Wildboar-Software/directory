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
    _encodeIA5String,
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
import {
    inetOrgPerson,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPerson.oa.js";
import {
    carLicense,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/carLicense.oa.js";
import {
    departmentNumber,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/departmentNumber.oa.js";
import {
    displayName,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/displayName.oa.js";
import {
    employeeNumber,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/employeeNumber.oa.js";
import {
    employeeType,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/employeeType.oa.js";
import {
    preferredLanguage,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/preferredLanguage.oa.js";
import {
    homeTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/homeTelephoneNumber.oa.js";
import {
    mobileTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mobileTelephoneNumber.oa.js";
import {
    mail,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/mail.oa.js";
import {
    secretary,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/secretary.oa.js";
import {
    roomNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/roomNumber.oa.js";
import {
    homePostalAddress,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/homePostalAddress.oa.js";
import {
    manager,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/manager.oa.js";
import {
    pagerTelephoneNumber,
} from "@wildboar/parity-schema/src/lib/modules/Cosine/pagerTelephoneNumber.oa.js";
import {
    labeledURI,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/labeledURI.oa.js";
import {
    uid,
} from "@wildboar/x500/SelectedAttributeTypes";
import * as fs from "fs/promises";
import * as pem from "pem-ts";
import { BERElement } from "@wildboar/asn1";

// inetOrgPerson OBJECT-CLASS ::= {
// 	SUBCLASS OF 	{organizationalPerson}
// 	KIND			structural
// 	MAY CONTAIN		{
// 		audio
//         | businessCategory
//         | carLicense
//         | departmentNumber
//         | displayName
//         | employeeNumber
//         | employeeType
//         | givenName
//         | homeTelephoneNumber
//         | homePostalAddress
//         | initials
//         -- | jpegPhoto
//         | labeledURI
//         | mail
//         | manager
//         | mobileTelephoneNumber
//         | organizationName
//         | pagerTelephoneNumber
//         -- | photo
//         | roomNumber
//         | secretary
//         | uid
//         | userCertificate
//         | uniqueIdentifier
//         | preferredLanguage
//         -- | userSMIMECertificate
//         -- | userPKCS12
// 	}
// 	LDAP-NAME		{"inetOrgPerson"}
// 	LDAP-DESC		"RFC2798: Internet Organizational Person"
// 	ID				{ netscapeDirectory 2 2 }
// }

export
async function do_addEntry_inetOrgPerson (
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
                _encodeObjectIdentifier(inetOrgPerson["&id"], DER),
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
    if (argv.businessCategory?.length) {
        const values: string[] = [ argv.businessCategory ].flat();
        attributes.push(new Attribute(
            selat.businessCategory["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.carLicense?.length) {
        const values: string[] = [ argv.carLicense ].flat();
        attributes.push(new Attribute(
            carLicense["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.departmentNumber?.length) {
        const values: string[] = [ argv.departmentNumber ].flat();
        attributes.push(new Attribute(
            departmentNumber["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.displayName?.length) {
        attributes.push(new Attribute(
            displayName["&id"]!,
            [
                _encodeUTF8String(argv.displayName, DER),
            ],
        ));
    }
    if (argv.employeeNumber?.length) {
        attributes.push(new Attribute(
            employeeNumber["&id"]!,
            [
                _encodeUTF8String(argv.employeeNumber, DER),
            ],
        ));
    }
    if (argv.employeeType?.length) {
        attributes.push(new Attribute(
            employeeType["&id"]!,
            [
                _encodeUTF8String(argv.employeeType, DER),
            ],
        ));
    }
    if (argv.givenName?.length) {
        const values: string[] = [ argv.givenName ].flat();
        attributes.push(new Attribute(
            selat.givenName["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.homeTelephoneNumber?.length) {
        const values: string[] = [ argv.homeTelephoneNumber ].flat();
        attributes.push(new Attribute(
            homeTelephoneNumber["&id"]!,
            values.map((value) => _encodePrintableString(value, DER)),
        ));
    }
    if (argv.homePostalAddress?.length) {
        const values: string[] = [ argv.homePostalAddress ].flat();
        attributes.push(new Attribute(
            homePostalAddress["&id"]!,
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
    if (argv.initials?.length) {
        const values: string[] = [ argv.initials ].flat();
        attributes.push(new Attribute(
            selat.initials["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.labeledURI?.length) {
        const values: string[] = [ argv.labeledURI ].flat();
        attributes.push(new Attribute(
            labeledURI["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.mail?.length) {
        const values: string[] = [ argv.mail ].flat();
        attributes.push(new Attribute(
            mail["&id"]!,
            values.map((value) => _encodeIA5String(value, DER)),
        ));
    }
    if (argv.manager?.length) {
        const values: string[] = [ argv.manager ].flat();
        attributes.push(new Attribute(
            manager["&id"],
            values.map((value) => _encode_RDNSequence(destringifyDN(ctx, value), DER)),
        ));
    }
    if (argv.mobileTelephoneNumber?.length) {
        const values: string[] = [ argv.mobileTelephoneNumber ].flat();
        attributes.push(new Attribute(
            mobileTelephoneNumber["&id"]!,
            values.map((value) => _encodePrintableString(value, DER)),
        ));
    }
    if (argv.organizationName?.length) {
        const values: string[] = [ argv.organizationName ].flat();
        attributes.push(new Attribute(
            selat.organizationName["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.pagerTelephoneNumber?.length) {
        const values: string[] = [ argv.pagerTelephoneNumber ].flat();
        attributes.push(new Attribute(
            pagerTelephoneNumber["&id"]!,
            values.map((value) => _encodePrintableString(value, DER)),
        ));
    }
    if (argv.roomNumber?.length) {
        const values: string[] = [ argv.roomNumber ].flat();
        attributes.push(new Attribute(
            roomNumber["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.secretary?.length) {
        const values: string[] = [ argv.secretary ].flat();
        attributes.push(new Attribute(
            secretary["&id"],
            values.map((value) => _encode_RDNSequence(destringifyDN(ctx, value), DER)),
        ));
    }
    if (argv.uid?.length) {
        const values: string[] = [ argv.uid ].flat();
        attributes.push(new Attribute(
            uid["&id"]!,
            values.map((value) => _encodeUTF8String(value, DER)),
        ));
    }
    if (argv.userCertificate?.length) {
        const values: string[] = [ argv.userCertificate ].flat();
        attributes.push(new Attribute(
            selat.userCertificate["&id"]!,
            await Promise.all(values.map(async (value) => {
                const certFileData: Buffer = await fs.readFile(value);
                if (certFileData.indexOf("-----BEGIN CERTIFICATE-----") > -1) {
                    const pems = pem.PEMObject.parse(certFileData.toString("utf-8"));
                    if (pems.length === 0) {
                        console.error("No certificates in `userCertificate`.");
                        process.exit(5090);
                    }
                    if (pems.length > 1) {
                        console.error("There may be only one certificate in a `userCertificate` file.");
                        process.exit(5099);
                    }
                    const pem0 = pems[0];
                    const el = new BERElement();
                    el.fromBytes(pem0.data);
                    return el;
                } else {
                    const el = new BERElement();
                    el.fromBytes(certFileData);
                    return el;
                }
            })),
        ));
    }
    if (argv.preferredLanguage?.length) {
        attributes.push(new Attribute(
            preferredLanguage["&id"]!,
            [
                _encodeUTF8String(argv.preferredLanguage, DER),
            ],
        ));
    }
    return do_addEntry(ctx, conn, argv, attributes);
}

export default do_addEntry_inetOrgPerson;
