import type { Connection, Context } from "./types";
import {
    FALSE_BIT,
    unpackBits,
    OBJECT_IDENTIFIER,
    ObjectIdentifier,
    TRUE_BIT,
} from "asn1-ts";
import { randomBytes } from "crypto";
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
import { createMockCertificate, createMockCRL, createMockPersonAttributes } from "./mock-entries";
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
        const otherObjectClasses: OBJECT_IDENTIFIER[] = [];
        const hasUserSecurityInfo: boolean = !(i % 7);
        const isPkiUser: boolean = !(i % 9);
        const isInPeepantsGang: boolean = !(i % 13);
        const isInGucciGang: boolean = !(i % 15);
        const isPkiCA: boolean = !(i % 19);
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
        const [ rdn, attributes, cn ] = createMockPersonAttributes(otherObjectClasses);
        const dn: DistinguishedName = [
            ...deepDN,
            rdn,
        ];
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
                gucciGang.map((gangMember) => selat.member.encoderFor["&Type"]!(gangMember, DER)),
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
                peepantsGang.map((gangMember) => selat.roleOccupant.encoderFor["&Type"]!(gangMember, DER)),
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
