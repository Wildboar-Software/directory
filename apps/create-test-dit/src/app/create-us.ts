import type { Connection, Context } from "./types";
import {
    FALSE_BIT,
    unpackBits,
    OBJECT_IDENTIFIER,
    ObjectIdentifier,
    TRUE_BIT,
} from "asn1-ts";
import { randomBytes, randomInt } from "crypto";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import {
    AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import * as selat from "@wildboar/x500/src/lib/collections/attributes";
import * as seloc from "@wildboar/x500/src/lib/collections/objectClasses";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { SecurityParameters } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import {
    ProtectionRequest_none,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_none,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import {
    DER,
    _encodeObjectIdentifier,
    _encodePrintableString,
    _encodeUTF8String,
} from "asn1-ts/dist/node/functional";
import { idempotentAddEntry } from "./utils";
import {
    createMockCertificate,
    createMockCRL,
    createMockPersonAttributes,
    createMockUsername,
    createMockEmail,
} from "./mock-entries";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import {
    _encode_Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import {
    CertificatePair,
    _encode_CertificatePair,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificatePair.ta";
import {
    _encode_CertificateList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificateList.ta";
import {
    PolicySyntax,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/PolicySyntax.ta";
import {
    InfoSyntax,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/InfoSyntax.ta";
import {
    InfoSyntax_pointer,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/InfoSyntax-pointer.ta";
import {
    AlgorithmIdentifier,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import {
    sha256WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha256WithRSAEncryption.va";
import {
    SupportedAlgorithm,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SupportedAlgorithm.ta";
import {
    PolicyInformation,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/PolicyInformation.ta";
import {
    dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicObject.oa";
import {
    eduPerson,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPerson.oa";
import {
    eduPersonAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonAffiliation.oa";
import {
    gidNumber,
    homeDirectory,
    loginShell,
    posixAccount,
    uidNumber,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixAccount.oa";
import {
    uid,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uid.oa";
import {
    shadowAccount, shadowLastChange, shadowMax, shadowMin,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowAccount.oa";
import {
    openLDAPdisplayableObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPdisplayableObject.oa";
import {
    mailQuotaSize, qmailUser,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUser.oa";
import {
    displayName,
    kickoffTime,
    rid,
    sambaAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/sambaAccount.oa";
import {
    sambaDomainName,
    sambaProfilePath,
    sambaSamAccount, sambaSID,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSamAccount.oa";
import {
    mhs_user,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-user.oa";
// import {
//     edi_name,
//     edi_user,
// } from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-user.oa";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa";
import { mail } from "@wildboar/parity-schema/src/lib/modules/Cosine/mail.oa";
import {
    naturalPerson,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/naturalPerson.oa";
import {
    emailAddress,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/emailAddress.oa";
import {
    unstructuredName,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/unstructuredName.oa";
import {
    unstructuredAddress,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/unstructuredAddress.oa";
import {
    dateOfBirth,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/dateOfBirth.oa";
import {
    placeOfBirth,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/placeOfBirth.oa";
import {
    gender,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/gender.oa";
import {
    countryOfCitizenship,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/countryOfCitizenship.oa";
import {
    countryOfResidence,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/countryOfResidence.oa";
import {
    pseudonym,
} from "@wildboar/pkcs/src/lib/modules/PKCS-9/pseudonym.oa";
import {
    mhs_or_addresses,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-or-addresses.oa";
import {
    ORAddress,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORAddress.ta";
import {
    BuiltInStandardAttributes,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/BuiltInStandardAttributes.ta";
import {
    PersonalName,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/PersonalName.ta";
import {
    BuiltInDomainDefinedAttribute,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/BuiltInDomainDefinedAttribute.ta";
import {
    ExtensionAttribute,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/ExtensionAttribute.ta";


const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
    Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
// serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
const serviceControls = new ServiceControls(
    serviceControlOptions,
    undefined,
    60,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
);

function securityParameters (): SecurityParameters {
    return new SecurityParameters(
        undefined,
        undefined, // DSA name
        {
            generalizedTime: new Date(),
        },
        unpackBits(randomBytes(16)),
        ProtectionRequest_none,
        addEntry["&operationCode"]!,
        ErrorProtectionRequest_none,
        undefined,
    );
}

function createAddEntryArgument (
    dn: DistinguishedName,
    attributes: Attribute[],
): AddEntryArgument {
    return {
        unsigned: new AddEntryArgumentData(
            {
                rdnSequence: dn,
            },
            attributes,
            undefined,
            [],
            serviceControls,
            securityParameters(),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        ),
    };
}

const baseObject: DistinguishedName = [
    [
        new AttributeTypeAndValue(
            selat.countryName["&id"],
            _encodePrintableString("US", DER),
        ),
    ],
];

export
async function seedUS (
    ctx: Context,
    conn: Connection,
): Promise<void> {

    const deepDN: DistinguishedName = [ ...baseObject ];

    { // C=US,ST=FL
        const name: string = "FL";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.stateOrProvinceName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        deepDN.push(rdn);
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.locality["&id"], DER)],
            ),
            new Attribute(
                selat.stateOrProvinceName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
        ];
        const arg = createAddEntryArgument(deepDN, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL", arg);
    }

    { // C=US,ST=FL,L=HIL
        const name: string = "HIL";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.localityName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        deepDN.push(rdn);
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.locality["&id"], DER)],
            ),
            new Attribute(
                selat.localityName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
        ];
        const arg = createAddEntryArgument(deepDN, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL", arg);
    }

    { // C=US,ST=FL,L=HIL,L=Tampa
        const name: string = "Tampa";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.localityName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        deepDN.push(rdn);
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.locality["&id"], DER)],
            ),
            new Attribute(
                selat.localityName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
        ];
        const arg = createAddEntryArgument(deepDN, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Tampa", arg);
    }

    { // C=US,ST=FL,L=HIL,L=Tampa,L=Westchase
        const name: string = "Westchase";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.localityName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        deepDN.push(rdn);
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.locality["&id"], DER)],
            ),
            new Attribute(
                selat.localityName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
        ];
        const arg = createAddEntryArgument(deepDN, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Tampa,L=Westchase", arg);
    }

    const gucciGang: DistinguishedName[] = [];
    const peepantsGang: DistinguishedName[] = [];

    // Create random people
    for (let i = 1; i < 1000; i++) {
        // TODO: pgpKeyInfo
        // TODO: simpleSecurityObject
        // TODO: uidObject
        const otherObjectClasses: OBJECT_IDENTIFIER[] = [];
        const isNatural: boolean = !(i % 2);
        // const isPGPUser: boolean = !(i % 3);
        const isPosixUser: boolean = !(i % 3);
        const isShadowUser: boolean = !(i % 4);
        const isEducated: boolean = !(i % 5);
        const isOpenLDAPDisplayable: boolean = !(i % 6);
        const hasUserSecurityInfo: boolean = !(i % 7);
        const isQmailUser: boolean = !(i % 8);
        const isPkiUser: boolean = !(i % 9);
        const isMHSUser: boolean = !(i % 10);
        const isSambaAccount: boolean = !(i % 11);
        const isSambaSamAccount: boolean = !(i % 12);
        const isInPeepantsGang: boolean = !(i % 13);
        const isInGucciGang: boolean = !(i % 15);
        const isPkiCA: boolean = !(i % 19);
        const isDynamic: boolean = !(i % 21);
        if (isNatural) {
            otherObjectClasses.push(naturalPerson["&id"]);
        }
        if (isPosixUser) {
            otherObjectClasses.push(posixAccount["&id"]);
        }
        if (isShadowUser) {
            otherObjectClasses.push(shadowAccount["&id"]);
        }
        // Usage of this schema is unclear entirely.
        // if (isPGPUser) {
        //     otherObjectClasses.push(pgpKeyInfo["&id"]);
        // }
        if (isDynamic) {
            otherObjectClasses.push(dynamicObject["&id"]);
        }
        if (isEducated) {
            otherObjectClasses.push(eduPerson["&id"]);
        }
        if (isQmailUser) {
            otherObjectClasses.push(qmailUser["&id"]);
        }
        if (isOpenLDAPDisplayable) {
            otherObjectClasses.push(openLDAPdisplayableObject["&id"]);
        }
        if (hasUserSecurityInfo) {
            otherObjectClasses.push(seloc.userSecurityInformation["&id"]);
        }
        if (isPkiCA) {
            otherObjectClasses.push(seloc.pkiCA["&id"]);
            otherObjectClasses.push(seloc.certificationAuthority["&id"]);
            otherObjectClasses.push(seloc.certificationAuthority_V2["&id"]);
        }
        if (isPkiUser) {
            otherObjectClasses.push(seloc.pkiUser["&id"]);
            otherObjectClasses.push(seloc.strongAuthenticationUser["&id"]);
        }
        if (isSambaAccount) {
            otherObjectClasses.push(sambaAccount["&id"]);
        }
        if (isSambaSamAccount) {
            otherObjectClasses.push(sambaSamAccount["&id"]);
        }
        if (isMHSUser) {
            otherObjectClasses.push(mhs_user["&id"]);
            // edi-user is a structural object class.
            // otherObjectClasses.push(edi_user["&id"]);
        }
        const [ rdn, attributes, cn ] = createMockPersonAttributes(otherObjectClasses);
        const dn: DistinguishedName = [
            ...deepDN,
            rdn,
        ];
        if (isNatural) {
            attributes.push(new Attribute(
                emailAddress["&id"],
                [emailAddress.encoderFor["&Type"]!(createMockEmail(), DER)],
            ));
            attributes.push(new Attribute(
                unstructuredName["&id"],
                [unstructuredName.encoderFor["&Type"]!({ directoryString: { uTF8String: "Big Chungus" } }, DER)],
            ));
            attributes.push(new Attribute(
                unstructuredAddress["&id"],
                [unstructuredAddress.encoderFor["&Type"]!({ uTF8String: "123 Drury lane, Atlanta, GA 12345" }, DER)],
            ));
            attributes.push(new Attribute(
                dateOfBirth["&id"],
                [dateOfBirth.encoderFor["&Type"]!(new Date(), DER)],
            ));
            attributes.push(new Attribute(
                placeOfBirth["&id"],
                [placeOfBirth.encoderFor["&Type"]!({ uTF8String: "Disney World" }, DER)],
            ));
            attributes.push(new Attribute(
                gender["&id"],
                [gender.encoderFor["&Type"]!((randomInt(999) % 2) ? "M" : "F", DER)],
            ));
            attributes.push(new Attribute(
                countryOfCitizenship["&id"],
                [countryOfCitizenship.encoderFor["&Type"]!("US", DER)],
            ));
            attributes.push(new Attribute(
                countryOfResidence["&id"],
                [countryOfResidence.encoderFor["&Type"]!("SE", DER)],
            ));
            attributes.push(new Attribute(
                pseudonym["&id"],
                [pseudonym.encoderFor["&Type"]!({ uTF8String: "Monkeyman 5000" }, DER)],
            ));
        }
        if (isPosixUser) {
            const userid: string = createMockUsername();
            attributes.push(new Attribute(
                uid["&id"],
                [uid.encoderFor["&Type"]!({ uTF8String: userid }, DER)],
            ));
            attributes.push(new Attribute(
                uidNumber["&id"],
                [uidNumber.encoderFor["&Type"]!(1001, DER)],
            ));
            attributes.push(new Attribute(
                gidNumber["&id"],
                [gidNumber.encoderFor["&Type"]!(1001, DER)],
            ));
            attributes.push(new Attribute(
                homeDirectory["&id"],
                [homeDirectory.encoderFor["&Type"]!(`/home/${userid}`, DER)],
            ));
            attributes.push(new Attribute(
                loginShell["&id"],
                [loginShell.encoderFor["&Type"]!("/bin/bash", DER)],
            ));
        }
        if (isShadowUser) {
            const uidAlreadyPresent: boolean = attributes.some((a) => a.type_.isEqualTo(uid["&id"]));
            if (!uidAlreadyPresent) {
                const userid: string = createMockUsername();
                attributes.push(new Attribute(
                    uid["&id"],
                    [uid.encoderFor["&Type"]!({ uTF8String: userid }, DER)],
                ));
            }
            attributes.push(new Attribute(
                shadowMin["&id"],
                [shadowMin.encoderFor["&Type"]!(10, DER)],
            ));
            attributes.push(new Attribute(
                shadowMax["&id"],
                [shadowMax.encoderFor["&Type"]!(1999, DER)],
            ));
            attributes.push(new Attribute(
                shadowLastChange["&id"],
                [shadowLastChange.encoderFor["&Type"]!(358720449, DER)],
            ));
        }
        if (isDynamic) {
            const ttl = randomInt(600, 1500);
            attributes.push(new Attribute(
                entryTtl["&id"],
                [entryTtl.encoderFor["&Type"]!(ttl, DER)],
            ));
        }
        if (isEducated) {
            attributes.push(new Attribute(
                eduPersonAffiliation["&id"],
                [eduPersonAffiliation.encoderFor["&Type"]!({ uTF8String: "University of Florida" }, DER)],
            ));
        }
        if (isOpenLDAPDisplayable) {
            const userid = createMockUsername();
            attributes.push(new Attribute(
                displayName["&id"],
                [displayName.encoderFor["&Type"]!({ uTF8String: userid }, DER)],
            ));
        }
        if (isQmailUser) {
            attributes.push(new Attribute(
                mail["&id"],
                [mail.encoderFor["&Type"]!(createMockEmail(), DER)],
            ));
            attributes.push(new Attribute(
                mailQuotaSize["&id"],
                [mailQuotaSize.encoderFor["&Type"]!(350520, DER)],
            ));
        }
        if (isSambaAccount) {
            const uidAlreadyPresent: boolean = attributes.some((a) => a.type_.isEqualTo(uid["&id"]));
            if (!uidAlreadyPresent) {
                const userid: string = createMockUsername();
                attributes.push(new Attribute(
                    uid["&id"],
                    [uid.encoderFor["&Type"]!({ uTF8String: userid }, DER)],
                ));
            }
            attributes.push(new Attribute(
                rid["&id"],
                [rid.encoderFor["&Type"]!(randomInt(1000, 10000), DER)],
            ));
            attributes.push(new Attribute(
                kickoffTime["&id"],
                [kickoffTime.encoderFor["&Type"]!(randomInt(1000, 10000), DER)],
            ));
        }
        if (isSambaSamAccount) {
            const userid: string = createMockUsername();
            attributes.push(new Attribute(
                sambaSID["&id"],
                [sambaSID.encoderFor["&Type"]!("S-1-5-21-1004336348-1177238915-682003330-512", DER)],
            ));
            attributes.push(new Attribute(
                sambaDomainName["&id"],
                [sambaDomainName.encoderFor["&Type"]!({ uTF8String: "WILDBOAR" }, DER)],
            ));
            attributes.push(new Attribute(
                sambaProfilePath["&id"],
                [sambaProfilePath.encoderFor["&Type"]!({ uTF8String: `C:\\\\Users\\${userid}` }, DER)],
            ));
        }
        if (isMHSUser) {
            const orAddress = new ORAddress(
                new BuiltInStandardAttributes(
                    {
                        iso_3166_alpha2_code: "US",
                    },
                    {
                        printable: "Your friendly totally non-monopoly ISP",
                    },
                    undefined,
                    undefined,
                    {
                        printable: "asdf",
                    },
                    "Wildboar Software",
                    undefined,
                    new PersonalName(
                        "Wilbur",
                        "Jonathan",
                        undefined,
                        undefined,
                    ),
                    undefined,
                ),
                [
                    new BuiltInDomainDefinedAttribute(
                        "citizenId",
                        "1235982850",
                    ),
                ],
                [
                    new ExtensionAttribute(
                        1, // common-name
                        _encodePrintableString("Bigboi", DER),
                    ),
                ],
            );
            attributes.push(new Attribute(
                mhs_or_addresses["&id"],
                [mhs_or_addresses.encoderFor["&Type"]!(orAddress, DER)],
            ));
            // attributes.push(new Attribute(
            //     edi_name["&id"],
            //     [edi_name.encoderFor["&Type"]!({ uTF8String: "$$$$Bigmunniii$$$$" }, DER)],
            // ));
        }
        if (hasUserSecurityInfo) {
            const alg = new AlgorithmIdentifier(
                sha256WithRSAEncryption,
                undefined,
            );
            const supportedAlg = new SupportedAlgorithm(
                alg,
                new Uint8ClampedArray([ TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
                [
                    new PolicyInformation(
                        new ObjectIdentifier([ 2, 5, 3, 4, 6, 7, 1 ]),
                        undefined,
                    ),
                ],
            );
            attributes.push(new Attribute(
                selat.supportedAlgorithms["&id"],
                [selat.supportedAlgorithms.encoderFor["&Type"]!(supportedAlg, DER)],
            ));
        }
        if (isPkiCA) {
            const randomCert = createMockCertificate(dn, dn);
            attributes.push(new Attribute(
                selat.cACertificate["&id"],
                [
                    _encode_Certificate(randomCert, DER),
                ],
            ));
            const pair = new CertificatePair(
                randomCert,
                randomCert,
            );
            attributes.push(new Attribute(
                selat.crossCertificatePair["&id"],
                [
                    _encode_CertificatePair(pair, DER),
                ],
            ));
            const randomCRL = createMockCRL();
            attributes.push(new Attribute(
                selat.certificateRevocationList["&id"],
                [
                    _encode_CertificateList(randomCRL, DER),
                ],
            ));
            attributes.push(new Attribute(
                selat.eepkCertificateRevocationList["&id"],
                [
                    _encode_CertificateList(randomCRL, DER),
                ],
            ));
            attributes.push(new Attribute(
                selat.authorityRevocationList["&id"],
                [
                    _encode_CertificateList(randomCRL, DER),
                ],
            ));
        }
        if (isPkiUser) {
            const randomCert = createMockCertificate();
            attributes.push(new Attribute(
                selat.userCertificate["&id"],
                [
                    _encode_Certificate(randomCert, DER),
                ],
            ));
        }
        if (isInPeepantsGang) {
            peepantsGang.push(dn);
        }
        if (isInGucciGang) {
            gucciGang.push(dn);
        }
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=HIL,L=Tampa,L=Westchase,CN=${cn}`, arg);
    }

    { // Create C=US,CN=Directory Engineers
        const name: string = "Directory Engineers";
        const dn: DistinguishedName = [
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String(name, DER),
                ),
            ],
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.groupOfNames["&id"], DER),
                ],
            ),
            new Attribute(
                selat.commonName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.member["&id"],
                /**
                 * NOTE: `member` does not have an `encoderFor["&Type"]`
                 * function because it is a subtype of `distinguishedName`.
                 */
                gucciGang.map((gangMember) => selat.distinguishedName.encoderFor["&Type"]!(gangMember, DER)),
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,CN=Directory Engineers", arg);
    }

    { // C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software
        const name: string = "Wildboar Software";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.organizationName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const dn: DistinguishedName = [
            ...deepDN.slice(0, -1),
            rdn,
        ];
        const certPol = new PolicySyntax(
            new ObjectIdentifier([ 2, 5, 2, 4, 7, 2, 1 ]),
            {
                content: {
                    uTF8String: "I just give you certificates in exchange for a bribe",
                },
            },
        );
        const cps: InfoSyntax = {
            pointer: new InfoSyntax_pointer(
                [
                    {
                        uniformResourceIdentifier: "https://wildboarsoftware.com",
                    },
                ],
                undefined,
            ),
        };
        const privPol = new PolicySyntax(
            new ObjectIdentifier([ 2, 5, 2, 4, 7, 2, 3 ]),
            {
                content: {
                    uTF8String: "I just give you certificates if you ask really nicely",
                },
            },
        );
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.organization["&id"], DER),
                    _encodeObjectIdentifier(seloc.cpCps["&id"], DER),
                    _encodeObjectIdentifier(seloc.privilegePolicy["&id"], DER),
                ],
            ),
            new Attribute(
                selat.organizationName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.certificatePolicy["&id"],
                [selat.certificatePolicy.encoderFor["&Type"]!(certPol, DER)],
            ),
            new Attribute(
                selat.certificationPracticeStmt["&id"],
                [selat.certificationPracticeStmt.encoderFor["&Type"]!(cps, DER)],
            ),
            new Attribute(
                selat.privPolicy["&id"],
                [selat.privPolicy.encoderFor["&Type"]!(privPol, DER)],
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software", arg);
    }

    { // C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software,CN=Code Peasants
        const name: string = "Code Peasants";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const dn: DistinguishedName = [
            ...deepDN.slice(0, -1),
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Wildboar Software", DER),
                ),
            ],
            rdn,
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.organizationalRole["&id"], DER)],
            ),
            new Attribute(
                selat.commonName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.roleOccupant["&id"],
                /**
                 * NOTE: `roleOccupant` does not have an `encoderFor["&Type"]`
                 * function because it is a subtype of `distinguishedName`.
                 */
                peepantsGang.map((gangMember) => selat.distinguishedName.encoderFor["&Type"]!(gangMember, DER)),
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software,CN=Code Peasants", arg);
    }

    { // C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software,CN=CRL Dist Point #001
        const name: string = "CRL Dist Point #001";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const dn: DistinguishedName = [
            ...deepDN.slice(0, -1),
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Wildboar Software", DER),
                ),
            ],
            rdn,
        ];
        const randomCRL = createMockCRL();
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.cRLDistributionPoint["&id"], DER)],
            ),
            new Attribute(
                selat.commonName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
        ];
        attributes.push(new Attribute(
            selat.certificateRevocationList["&id"],
            [
                _encode_CertificateList(randomCRL, DER),
            ],
        ));
        attributes.push(new Attribute(
            selat.eepkCertificateRevocationList["&id"],
            [
                _encode_CertificateList(randomCRL, DER),
            ],
        ));
        attributes.push(new Attribute(
            selat.authorityRevocationList["&id"],
            [
                _encode_CertificateList(randomCRL, DER),
            ],
        ));
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software,CN=CRL Dist Point #001", arg);
    }
}

export default seedUS;
