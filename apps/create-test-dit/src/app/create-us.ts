import type { Connection, Context } from "./types.js";
import {
    FALSE_BIT,
    OBJECT_IDENTIFIER,
    ObjectIdentifier,
    TRUE_BIT,
} from "@wildboar/asn1";
import { randomInt } from "crypto";
import {
    addEntry,
    AddEntryArgument,
    AddEntryArgumentData,
    ServiceControls,
    ServiceControlOptions,
    SecurityParameters,
    ProtectionRequest_none,
    ErrorProtectionRequest_none,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    DistinguishedName, _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import { attributes as selat } from "@wildboar/x500";
import { objectClasses as seloc } from "@wildboar/x500";
import {
    DER,
    _encodeObjectIdentifier,
    _encodePrintableString,
    _encodeUTF8String,
} from "@wildboar/asn1/functional";
import sleep, { idempotentAddEntry } from "./utils.js";
import {
    createMockCertificate,
    createMockCRL,
    createMockPersonAttributes,
    createMockOrganizationAttributes,
    createMockUsername,
    createMockEmail,
} from "./mock-entries.js";
import { RelativeDistinguishedName } from "@wildboar/pki-stub";
import {
    _encode_Certificate,
    CertificatePair,
    _encode_CertificatePair,
    _encode_CertificateList,
    PolicySyntax,
    InfoSyntax,
    InfoSyntax_pointer,
    SupportedAlgorithm,
} from "@wildboar/x500/AuthenticationFramework";
import {
    AlgorithmIdentifier,
} from "@wildboar/pki-stub";
import {
    sha256WithRSAEncryption,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    PolicyInformation,
} from "@wildboar/x500/CertificateExtensions";
import {
    dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicObject.oa.js";
import {
    eduPerson,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPerson.oa.js";
import {
    eduPersonAffiliation,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPersonAffiliation.oa.js";
import {
    posixAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixAccount.oa.js";
import { gidNumber } from "@wildboar/parity-schema/src/lib/modules/NIS/gidNumber.oa.js";
import { homeDirectory } from "@wildboar/parity-schema/src/lib/modules/NIS/homeDirectory.oa.js";
import { loginShell } from "@wildboar/parity-schema/src/lib/modules/NIS/loginShell.oa.js";
import { uidNumber } from "@wildboar/parity-schema/src/lib/modules/NIS/uidNumber.oa.js";
import {
    uid,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    shadowAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowAccount.oa.js";
import { shadowLastChange } from "@wildboar/parity-schema/src/lib/modules/NIS/shadowLastChange.oa.js";
import { shadowMax } from "@wildboar/parity-schema/src/lib/modules/NIS/shadowMax.oa.js";
import { shadowMin } from "@wildboar/parity-schema/src/lib/modules/NIS/shadowMin.oa.js";
import {
    openLDAPdisplayableObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPdisplayableObject.oa.js";
import {
    qmailUser,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUser.oa.js";
import { mailQuotaSize } from "@wildboar/parity-schema/src/lib/modules/QMailSchema/mailQuotaSize.oa.js";
import { sambaAccount } from "@wildboar/parity-schema/src/lib/modules/SambaSchema/sambaAccount.oa.js";
import { displayName } from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/displayName.oa.js";
import { kickoffTime } from "@wildboar/parity-schema/src/lib/modules/SambaSchema/kickoffTime.oa.js";
import { rid } from "@wildboar/parity-schema/src/lib/modules/SambaSchema/rid.oa.js";
import { sambaSamAccount } from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSamAccount.oa.js";
import { sambaSID } from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSID.oa.js";
import { sambaProfilePath } from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaProfilePath.oa.js";
import { sambaDomainName } from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaDomainName.oa.js";
import {
    mhs_user,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
// import {
//     edi_name,
//     edi_user,
// } from "@wildboar/x400/EDIMUseOfDirectory";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa.js";
import { mail } from "@wildboar/parity-schema/src/lib/modules/Cosine/mail.oa.js";
import {
    naturalPerson,
    emailAddress,
    unstructuredName,
    unstructuredAddress,
    dateOfBirth,
    placeOfBirth,
    gender,
    countryOfCitizenship,
    countryOfResidence,
    pseudonym,
} from "@wildboar/pkcs/PKCS-9";
import {
    mhs_or_addresses,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    ORAddress,
    BuiltInStandardAttributes,
    PersonalName,
    BuiltInDomainDefinedAttribute,
    ExtensionAttribute,
} from "@wildboar/x400/MTSAbstractService";
import { map } from "@tyler/duckhawk";
import { id_ar_serviceSpecificArea } from "@wildboar/x500/InformationFramework";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/InformationFramework";
import {
    SearchRuleDescription,
    type ATTRIBUTE,
    _encode_SearchRuleDescription,
} from "@wildboar/x500/InformationFramework";
import {
    RequestAttribute,
    ImposedSubset_oneLevel,
    EntryLimit,
} from "@wildboar/x500/ServiceAdministration";
import {
    ResultAttribute,
} from "@wildboar/x500/ServiceAdministration";
import { OCALA_USERS, OCALA_USERS_SERVICES } from "./aci.js";
import { _encode_ACIItem } from "@wildboar/x500/BasicAccessControl";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/InformationFramework";
import {
    Guide,
    PresentationAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import { Attribute_valuesWithContext_Item, Context as X500Context } from "@wildboar/pki-stub";
import { languageContext, temporalContext } from "@wildboar/x500/SelectedAttributeTypes";
import { TimeSpecification } from "@wildboar/x500/SelectedAttributeTypes";
import { TimeSpecification_time_absolute } from "@wildboar/x500/SelectedAttributeTypes";
import { addDays } from "date-fns";
import { uriToNSAP } from "@wildboar/x500";
import {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";

const id_wildboar           = ObjectIdentifier.fromParts([ 1, 3, 6, 1, 4, 1, 56490 ]);
const id_serviceTypes       = ObjectIdentifier.fromParts([ 59 ], id_wildboar);
const id_svc_whitePages     = ObjectIdentifier.fromParts([ 1 ], id_serviceTypes);
const id_svc_yellowPages    = ObjectIdentifier.fromParts([ 2 ], id_serviceTypes);
const id_svc_greyPages      = ObjectIdentifier.fromParts([ 3 ], id_serviceTypes);

function simpleSearchBy (attr: ATTRIBUTE): RequestAttribute {
    return new RequestAttribute(
        attr["&id"],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function simpleSearchFor (attr: ATTRIBUTE): ResultAttribute {
    return new ResultAttribute(
        attr["&id"],
        undefined,
        undefined,
    );
}

const searchBySurname = simpleSearchBy(selat.surname);
const searchByGivenName = simpleSearchBy(selat.givenName);
const searchByCommonName = simpleSearchBy(selat.commonName);
const searchByInitials = simpleSearchBy(selat.initials);
const searchByGenerationQualifier = simpleSearchBy(selat.generationQualifier);
const searchByLocalityName = simpleSearchBy(selat.localityName);
const searchByStateOrProvinceName = simpleSearchBy(selat.stateOrProvinceName);
const searchByBusinessCategory = simpleSearchBy(selat.businessCategory);
const searchByTelephoneNumber = simpleSearchBy(selat.telephoneNumber);

const searchForTelephoneNumber = simpleSearchFor(selat.telephoneNumber);
const searchForPostalAddress = simpleSearchFor(selat.postalAddress);
const searchForPhysicalDeliveryOfficeName = simpleSearchFor(selat.physicalDeliveryOfficeName);
const searchForPostalCode = simpleSearchFor(selat.postalCode);
const searchForPostOfficeBox = simpleSearchFor(selat.postOfficeBox);
const searchForStreetAddress = simpleSearchFor(selat.streetAddress);
const searchForStateOrProvinceName = simpleSearchFor(selat.stateOrProvinceName);
const searchForSurname = simpleSearchFor(selat.surname);
const searchForGivenName = simpleSearchFor(selat.givenName);
const searchForCommonName = simpleSearchFor(selat.commonName);
const searchForInitials = simpleSearchFor(selat.initials);
const searchForGenerationQualifier = simpleSearchFor(selat.generationQualifier);
const searchForLocalityName = simpleSearchFor(selat.localityName);
const searchForBusinessCategory = simpleSearchFor(selat.businessCategory);
const searchForOrganizationName = simpleSearchFor(selat.organizationName);
const searchForDescription = simpleSearchFor(selat.description);

const PersonNameRequestAttributes: RequestAttribute[] = [
    searchByCommonName,
    searchBySurname,
    searchByGivenName,
    searchByInitials,
    searchByGenerationQualifier,
];

const PersonNameResultAttributes: ResultAttribute[] = [
    searchForCommonName,
    searchForSurname,
    searchForGivenName,
    searchForInitials,
    searchForGenerationQualifier,
];

const AddressResultAttributes: ResultAttribute[] = [
    searchForPostalAddress,
    searchForPhysicalDeliveryOfficeName,
    searchForPostalCode,
    searchForPostOfficeBox,
    searchForStreetAddress,
    searchForLocalityName,
    searchForStateOrProvinceName,
];

const whitePages = new SearchRuleDescription(
    1,
    id_wildboar,
    id_svc_whitePages,
    undefined,
    [
        ...PersonNameRequestAttributes,
        searchByLocalityName,
        searchByStateOrProvinceName,
    ],
    undefined,
    [
        ...PersonNameResultAttributes,
        ...AddressResultAttributes,
        searchForTelephoneNumber,
    ],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    new Uint8ClampedArray([ FALSE_BIT, TRUE_BIT, FALSE_BIT ]),
    ImposedSubset_oneLevel,
    new EntryLimit(10, 50),
    [
        {
            uTF8String: "Ocala White Pages",
        },
    ],
    {
        uTF8String: "Find the address and phone number of a person by name",
    },
);

const yellowPages = new SearchRuleDescription(
    2,
    id_wildboar,
    id_svc_yellowPages,
    undefined,
    [
        searchByLocalityName,
        searchByStateOrProvinceName,
        searchByBusinessCategory,
    ],
    undefined,
    [
        ...AddressResultAttributes,
        searchForTelephoneNumber,
        searchForOrganizationName,
        searchForCommonName,
        searchForDescription,
        searchForBusinessCategory,
    ],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    new Uint8ClampedArray([ FALSE_BIT, TRUE_BIT, FALSE_BIT ]),
    ImposedSubset_oneLevel,
    new EntryLimit(50, 100),
    [
        {
            uTF8String: "Ocala Yellow Pages",
        },
    ],
    {
        uTF8String: "Find local businesses by category",
    },
);

const greyPages = new SearchRuleDescription(
    3,
    id_wildboar,
    id_svc_greyPages,
    undefined,
    [searchByTelephoneNumber],
    undefined,
    [
        ...PersonNameResultAttributes,
        ...AddressResultAttributes,
        searchForTelephoneNumber,
        searchForOrganizationName,
        searchForDescription,
        searchForBusinessCategory,
    ],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    new Uint8ClampedArray([ FALSE_BIT, TRUE_BIT, FALSE_BIT ]),
    ImposedSubset_oneLevel,
    new EntryLimit(5, 10),
    [
        {
            uTF8String: "Ocala Grey Pages",
        },
    ],
    {
        uTF8String: "Reverse phonebook: look up a person or organization by their phone number",
    },
);

const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
    Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
// serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
const serviceControls = new ServiceControls(
    serviceControlOptions,
    undefined,
    /* I had to bump the timeout really high, because, when creating the local
    test DIT, it seems that either Meerkat DSA or the database would get
    overwhelmed and take over one minute to insert (with bulk insert mode
    disabled). */
    300,
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
        undefined,
        undefined,
        ProtectionRequest_none,
        addEntry["&operationCode"]!,
        ErrorProtectionRequest_none,
        undefined,
    );
}

function createAddEntryArgument (
    dn: DistinguishedName,
    attributes: Attribute[],
    targetSystem?: AccessPoint,
): AddEntryArgument {
    return {
        unsigned: new AddEntryArgumentData(
            {
                rdnSequence: dn,
            },
            attributes,
            targetSystem,
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

function cn_rdn (cn: string): RelativeDistinguishedName {
    return [
        new AttributeTypeAndValue(
            selat.commonName["&id"]!,
            _encodeUTF8String(cn, DER),
        ),
    ];
}

function get_child_device (parent: DistinguishedName, name: string): AddEntryArgument {
    return createAddEntryArgument([
        ...parent,
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ],
    ], [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(seloc.device["&id"]!, DER),
                _encodeObjectIdentifier(seloc.child["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"]!,
            [_encodeUTF8String(name, DER)],
            undefined,
        ),
    ]);
}

function get_child_ap (parent: DistinguishedName, name: string): AddEntryArgument {
    return createAddEntryArgument([
        ...parent,
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ],
    ], [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(seloc.applicationProcess["&id"]!, DER),
                _encodeObjectIdentifier(seloc.child["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"]!,
            [_encodeUTF8String(name, DER)],
            undefined,
        ),
    ]);
}

const HILLSBOROUGH_ACCESS_POINT = new AccessPoint(
    {
        rdnSequence: [
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"],
                    _encodeUTF8String("dsa2", DER),
                ),
            ],
        ],
    },
    new PresentationAddress(
        undefined,
        undefined,
        undefined,
        // [uriToNSAP("idm://dsa2:4632", false)],
        [uriToNSAP("itot://dsa2:1102", true)],
    ),
    undefined,
);


const TEMPLE_TERRACE_ACCESS_POINT = new AccessPoint(
    {
        rdnSequence: [
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"],
                    _encodeUTF8String("dsa1", DER),
                ),
            ],
        ],
    },
    new PresentationAddress(
        undefined,
        undefined,
        undefined,
        // [uriToNSAP("idm://dsa1:4632", false)],
        [uriToNSAP("itot://dsa1:1102", true)],
    ),
    undefined,
);

const BRANDON_ACCESS_POINT = TEMPLE_TERRACE_ACCESS_POINT;

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
        const arg = createAddEntryArgument(deepDN, attributes, ctx.single ? undefined : HILLSBOROUGH_ACCESS_POINT);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL", arg);
    }

    { // C=US,ST=FL,L=HIL,L=Temple Terrace
        const name: string = "Temple Terrace";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.localityName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.locality["&id"], DER)],
            ),
            new Attribute(
                selat.localityName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.description["&id"],
                [_encodeUTF8String("The terrace where you will find the temple", DER)],
            ),
        ];
        const arg = createAddEntryArgument([ ...deepDN, rdn ], attributes, ctx.single ? undefined : TEMPLE_TERRACE_ACCESS_POINT);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Temple Terrace", arg);

        for (let i = 0; i < 10; i++) {
            const name: string = `Organization ${i}`;
            const org_rdn: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String(name, DER),
                ),
            ];
            const attributes: Attribute[] = [
                new Attribute(
                    selat.objectClass["&id"],
                    [_encodeObjectIdentifier(seloc.organization["&id"], DER)],
                ),
                new Attribute(
                    selat.organizationName["&id"],
                    [_encodeUTF8String(name, DER)],
                ),
            ];
            const arg = createAddEntryArgument([ ...deepDN, rdn, org_rdn ], attributes);
            await idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=HIL,L=Temple Terrace,O=Organization ${i}`, arg);
        }
    }

    { // C=US,ST=FL,L=HIL,L=Plant City
        const name: string = "Plant City";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.localityName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
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
        const arg = createAddEntryArgument([ ...deepDN, rdn ], attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Plant City", arg);

        for (let i = 0; i < 10; i++) {
            const name: string = `Organization ${i}`;
            const org_rdn: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String(name, DER),
                ),
            ];
            const attributes: Attribute[] = [
                new Attribute(
                    selat.objectClass["&id"],
                    [_encodeObjectIdentifier(seloc.organization["&id"], DER)],
                ),
                new Attribute(
                    selat.organizationName["&id"],
                    [_encodeUTF8String(name, DER)],
                ),
            ];
            const arg = createAddEntryArgument([ ...deepDN, rdn, org_rdn ], attributes);
            await idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=HIL,L=Plant City,O=Organization ${i}`, arg);
        }
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

    const marion_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            selat.localityName["&id"]!,
            _encodeUTF8String("MAR", DER),
        ),
    ];
    { // C=US,ST=FL,L=MAR
        const name: string = "MAR";
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
        const arg = createAddEntryArgument([ ...deepDN.slice(0, 2), marion_rdn ], attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=MAR", arg);
    }

    const ocala_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            selat.localityName["&id"]!,
            _encodeUTF8String("Ocala", DER),
        ),
    ];
    { // C=US,ST=FL,L=MAR,L=Ocala
        const name: string = "Ocala";
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.locality["&id"], DER)],
            ),
            new Attribute(
                selat.administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_serviceSpecificArea, DER),
                    _encodeObjectIdentifier(id_ar_accessControlInnerArea, DER),
                ],
            ),
            new Attribute(
                selat.localityName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            // This is the ACI that permits Ocala users to invoke the search rules.
            new Attribute(
                selat.subentryACI["&id"],
                [_encode_ACIItem(OCALA_USERS_SERVICES, DER)],
            ),
            new Attribute(
                selat.searchGuide["&id"],
                [
                    selat.searchGuide.encoderFor["&Type"]!(new Guide(
                        seloc.person["&id"],
                        {
                            type_: {
                                equality: selat.telephoneNumber["&id"],
                            },
                        },
                    ), DER),
                    selat.searchGuide.encoderFor["&Type"]!(new Guide(
                        seloc.organization["&id"],
                        {
                            type_: {
                                equality: selat.businessCategory["&id"],
                            },
                        },
                    ), DER),
                ],
            ),
        ];
        const arg = createAddEntryArgument([ ...deepDN.slice(0, 2), marion_rdn, ocala_rdn ], attributes);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=MAR,L=Ocala", arg);
    }

    {
        const name: string = "Service and Access Control";
        const subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const dn: DistinguishedName = [
            ...deepDN.slice(0, 2),
            marion_rdn,
            ocala_rdn,
            subentry_rdn,
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.subentry["&id"], DER),
                    _encodeObjectIdentifier(seloc.serviceAdminSubentry["&id"], DER),
                    _encodeObjectIdentifier(seloc.accessControlSubentry["&id"], DER),
                ],
            ),
            new Attribute(
                selat.commonName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.subtreeSpecification["&id"],
                [_encode_SubtreeSpecification(new SubtreeSpecification(), DER)],
            ),
            new Attribute(
                selat.searchRules["&id"],
                [
                    _encode_SearchRuleDescription(whitePages, DER),
                    _encode_SearchRuleDescription(yellowPages, DER),
                    _encode_SearchRuleDescription(greyPages, DER),
                ],
            ),
            new Attribute(
                selat.prescriptiveACI["&id"],
                [
                    _encode_ACIItem(OCALA_USERS, DER),
                ],
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=MAR,L=Ocala,CN=${name}`, arg);
    }

    { // C=US,ST=FL,L=HIL,L=Tampa,L=Brandon
        const name: string = "Brandon";
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.localityName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.locality["&id"], DER)],
            ),
            new Attribute(
                selat.localityName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.description["&id"],
                [_encodeUTF8String("Named after some dang guy", DER)],
            ),
        ];
        const arg = createAddEntryArgument([ ...deepDN, rdn ], attributes, ctx.single ? undefined : BRANDON_ACCESS_POINT);
        await idempotentAddEntry(ctx, conn, "C=US,ST=FL,L=HIL,L=Tampa,L=Brandon", arg);

        for (let i = 0; i < 10; i++) {
            const name: string = `Organization ${i}`;
            const org_rdn: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String(name, DER),
                ),
            ];
            const attributes: Attribute[] = [
                new Attribute(
                    selat.objectClass["&id"],
                    [_encodeObjectIdentifier(seloc.organization["&id"], DER)],
                ),
                new Attribute(
                    selat.organizationName["&id"],
                    [_encodeUTF8String(name, DER)],
                ),
            ];
            const arg = createAddEntryArgument([ ...deepDN, rdn, org_rdn ], attributes);
            await idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=HIL,L=Tampa,L=Brandon,O=Organization ${i}`, arg);
        }
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
    const newEntryArgs: [cn: string, arg: AddEntryArgument][] = [];
    // Create random people
    for (let i = 1; i < 10_000; i++) {
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
                [
                    new Attribute_valuesWithContext_Item(
                        unstructuredName.encoderFor["&Type"]!({ directoryString: { uTF8String: "Der Grosse Chungus" } }, DER),
                        [
                            new X500Context(
                                languageContext["&id"],
                                [languageContext.encoderFor["&Type"]!("deu", DER)],
                            ),
                            new X500Context(
                                temporalContext["&id"],
                                [temporalContext.encoderFor["&Type"]!(new TimeSpecification(
                                    {
                                        absolute: new TimeSpecification_time_absolute(
                                            new Date(),
                                            addDays(new Date(), 21),
                                        ),
                                    },
                                    undefined,
                                    undefined,
                                ), DER)],
                            ),
                        ],
                    ),
                ],
            ));
            attributes.push(new Attribute(
                unstructuredAddress["&id"],
                [unstructuredAddress.encoderFor["&Type"]!({ uTF8String: "123 Drury lane, Atlanta, GA 12345" }, DER)],
                [
                    new Attribute_valuesWithContext_Item(
                        unstructuredAddress.encoderFor["&Type"]!({ uTF8String: "123 Meyerplatz O., Ulm" }, DER),
                        [
                            new X500Context(
                                languageContext["&id"],
                                [languageContext.encoderFor["&Type"]!("deu", DER)],
                            ),
                            new X500Context(
                                temporalContext["&id"],
                                [temporalContext.encoderFor["&Type"]!(new TimeSpecification(
                                    {
                                        absolute: new TimeSpecification_time_absolute(
                                            new Date(),
                                            addDays(new Date(), 21),
                                        ),
                                    },
                                    undefined,
                                    undefined,
                                ), DER)],
                            ),
                        ],
                    ),
                ],
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
                        ObjectIdentifier.fromParts([ 2, 5, 3, 4, 6, 7, 1 ]),
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
        newEntryArgs.push([cn, arg]);
    }

    await map(
        newEntryArgs,
        ([cn, arg]) => idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=HIL,L=Tampa,L=Westchase,CN=${cn}`, arg),
        {
            concurrency: 20,
        },
    );

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
            ObjectIdentifier.fromParts([ 2, 5, 2, 4, 7, 2, 1 ]),
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
            ObjectIdentifier.fromParts([ 2, 5, 2, 4, 7, 2, 3 ]),
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

    await sleep(3000);

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

    newEntryArgs.length = 0;

    const ocalaDN: DistinguishedName = [
        ...deepDN.slice(0, 2),
        marion_rdn,
        ocala_rdn,
    ];

    // People within C=US,ST=FL,L=MAR,L=Ocala
    for (let i = 1; i < 100; i++) {
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
            ...ocalaDN,
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
                        ObjectIdentifier.fromParts([ 2, 5, 3, 4, 6, 7, 1 ]),
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
        newEntryArgs.push([cn, arg]);
    }

    await map(
        newEntryArgs,
        ([cn, arg]) => idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=MAR,L=Ocala,CN=${cn}`, arg),
        {
            concurrency: 10,
        },
    );

    newEntryArgs.length = 0;

    // Organizations within C=US,ST=FL,L=MAR,L=Ocala
    for (let i = 1; i < 5; i++) {
        const [ rdn, attributes, orgName ] = createMockOrganizationAttributes();
        const dn: DistinguishedName = [
            ...ocalaDN,
            rdn,
        ];
        const arg = createAddEntryArgument(dn, attributes);
        newEntryArgs.push([orgName, arg]);
    }

    await map(
        newEntryArgs,
        ([orgName, arg]) => idempotentAddEntry(ctx, conn, `C=US,ST=FL,L=MAR,L=Ocala,O=${orgName}`, arg),
        {
            concurrency: 10,
        },
    );

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

    const gov_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            selat.organizationName["&id"]!,
            _encodeUTF8String("Government", DER),
        ),
    ];
    {
        const name: string = "Government";
        const rdn: RelativeDistinguishedName = gov_rdn;
        const dn: DistinguishedName = [
            ...baseObject,
            rdn,
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.organization["&id"], DER)],
            ),
            new Attribute(
                selat.organizationName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, "C=US,O=Government", arg);
    }
    const dod_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            selat.organizationalUnitName["&id"]!,
            _encodeUTF8String("Dept. of Defense", DER),
        ),
    ];

    const jb_dn: DistinguishedName = [ ...baseObject, gov_rdn, cn_rdn("Joseph R. Biden") ];
    const kh_dn: DistinguishedName = [ ...baseObject, gov_rdn, cn_rdn("Kamala Harris") ];
    const government_persons: [ string, string, DistinguishedName? ][] = [
        [ "Joseph R. Biden", "Biden", undefined ],
        [ "Kamala Harris", "Harris", jb_dn ],
        [ "Patty Murray", "Murray", kh_dn ],
    ];
    for (const gov_person of government_persons) {
        const name: string = gov_person[0];
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const dn: DistinguishedName = [
            ...baseObject,
            gov_rdn,
            rdn,
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.person["&id"], DER)],
            ),
            new Attribute(
                selat.commonName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.surname["&id"],
                [_encodeUTF8String(gov_person[1], DER)],
            ),
        ];
        if (gov_person[2]) {
            attributes.push(new Attribute(
                selat.hierarchyParent["&id"],
                [_encode_DistinguishedName(gov_person[2], DER)],
            ));
        }
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, `C=US,O=Government,CN=${gov_person[0]}`, arg);
    }

    const depts: [string, string][] = [
        [ "State",	"Antony Blinken" ],
        [ "Treasury",	"Janet Yellen" ],
        [ "Defense",	"Lloyd Austin" ],
        [ "Justice",	"Merrick Garland" ],
        [ "Interior",	"Deb Haaland" ],
        [ "Agriculture",	"Tom Vilsack" ],
        [ "Commerce",	"Gina Raimondo" ],
        [ "Labor",	"Marty Walsh" ],
        [ "Health and Human Services",	"Xavier Becerra" ],
        [ "Housing and Urban Development",	"Marcia Fudge" ],
        [ "Transportation",	"Pete Buttigieg" ],
        [ "Energy",	"Jennifer Granholm" ],
        [ "Education",	"Miguel Cardona" ],
        [ "Veterans Affairs",	"Denis McDonough" ],
        [ "Homeland Security",	"Alejandro Mayorkas" ],
    ];
    for (const dept of depts) {
        const dept_name: string = `Dept. of ${dept[0]}`;
        const dept_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.organizationalUnitName["&id"]!,
                _encodeUTF8String(dept_name, DER),
            ),
        ];
        {
            const dn: DistinguishedName = [
                ...baseObject,
                gov_rdn,
                dept_rdn,
            ];
            const attributes: Attribute[] = [
                new Attribute(
                    selat.objectClass["&id"],
                    [_encodeObjectIdentifier(seloc.organizationalUnit["&id"], DER)],
                ),
                new Attribute(
                    selat.organizationalUnitName["&id"],
                    [_encodeUTF8String(dept_name, DER)],
                ),
            ];
            const arg = createAddEntryArgument(dn, attributes);
            await idempotentAddEntry(ctx, conn, `C=US,O=Government,OU=${dept_name}`, arg);
        }
        {
            const secretary_name = dept[1];
            const secretary_surname = secretary_name.split(" ").pop()!;
            const secretary_rdn: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String(secretary_name, DER),
                ),
            ];
            const dn: DistinguishedName = [
                ...baseObject,
                gov_rdn,
                dept_rdn,
                secretary_rdn,
            ];
            const attributes: Attribute[] = [
                new Attribute(
                    selat.objectClass["&id"],
                    [_encodeObjectIdentifier(seloc.person["&id"], DER)],
                ),
                new Attribute(
                    selat.commonName["&id"],
                    [_encodeUTF8String(secretary_name, DER)],
                ),
                new Attribute(
                    selat.surname["&id"],
                    [_encodeUTF8String(secretary_surname, DER)],
                ),
                new Attribute(
                    selat.hierarchyParent["&id"],
                    [_encode_DistinguishedName([ ...baseObject, gov_rdn, cn_rdn("Patty Murray") ], DER)],
                ),
            ];
            const arg = createAddEntryArgument(dn, attributes);
            await idempotentAddEntry(ctx, conn, `C=US,O=Government,OU=${dept_name},CN=${secretary_name}`, arg);
        }
    }

    const dod_persons: [ string, string, DistinguishedName ][] = [
        [ "Kathleen Hicks", "Hicks", [ ...baseObject, gov_rdn, dod_rdn, cn_rdn("Lloyd Austin") ] ],
        [ "Avril Haines", "Haines", [ ...baseObject, gov_rdn, dod_rdn, cn_rdn("Kathleen Hicks") ] ],
        [ "Mark Milley", "Milley", [ ...baseObject, gov_rdn, dod_rdn, cn_rdn("Kathleen Hicks") ] ],
        [ "Christopher Grady", "Grady", [ ...baseObject, gov_rdn, dod_rdn, cn_rdn("Mark Milley") ] ],
    ];
    for (const dod_person of dod_persons) {
        const name = dod_person[0];
        const surname = dod_person[1];
        const rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                _encodeUTF8String(name, DER),
            ),
        ];
        const dn: DistinguishedName = [
            ...baseObject,
            gov_rdn,
            dod_rdn,
            rdn,
        ];
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [_encodeObjectIdentifier(seloc.person["&id"], DER)],
            ),
            new Attribute(
                selat.commonName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.surname["&id"],
                [_encodeUTF8String(surname, DER)],
            ),
            new Attribute(
                selat.hierarchyParent["&id"],
                [_encode_DistinguishedName(dod_person[2], DER)],
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, `C=US,O=Government,OU=Dept. of Defense,CN=${name}`, arg);
    }

    const joe_biden_devices: string[] = [
        "iPhone 1",
        "Android 1",
        "Windows Phone",
        "Gaming Desktop",
        "Tamagotchi",
    ];
    const joe_gaming_processes: string[] = [
        "Antivirus",
        "Discord",
    ];
    for (const dev of joe_biden_devices) {
        await idempotentAddEntry(
            ctx,
            conn,
            `C=US,O=Government,CN=Joseph R. Biden,CN=${dev}`,
            get_child_device(jb_dn, dev),
        );
    }
    for (const proc of joe_gaming_processes) {
        const dev_dn: DistinguishedName = [ ...jb_dn, cn_rdn("Gaming Desktop") ];
        await idempotentAddEntry(
            ctx,
            conn,
            `C=US,O=Government,CN=Joseph R. Biden,CN=Gaming Desktop,CN=${proc}`,
            get_child_ap(dev_dn, proc),
        );
    }

    const kamala_harris_devices: string[] = [
        "Gaming Desktop",
        "Even Bigger Gaming Desktop",
        "Oculus Rift",
        "Tamagotchi",
    ];
    const kamala_gaming_processes: string[] = [
        "Discord",
    ];
    for (const dev of kamala_harris_devices) {
        await idempotentAddEntry(
            ctx,
            conn,
            `C=US,O=Government,CN=Kamala Harris,CN=${dev}`,
            get_child_device(kh_dn, dev),
        );
    }
    for (const proc of kamala_gaming_processes) {
        const dev_dn: DistinguishedName = [ ...kh_dn, cn_rdn("Gaming Desktop") ];
        await idempotentAddEntry(
            ctx,
            conn,
            `C=US,O=Government,CN=Kamala Harris,CN=Gaming Desktop,CN=${proc}`,
            get_child_ap(dev_dn, proc),
        );
    }
}

export default seedUS;
