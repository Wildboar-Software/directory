import type { Connection, Context } from "./types.js";
import {
    TRUE,
    FALSE,
    FALSE_BIT,
    unpackBits,
    OBJECT_IDENTIFIER,
    ObjectIdentifier,
    ASN1Element,
    INTEGER,
} from "@wildboar/asn1";
import { KeyObject, createHash, createPrivateKey, createSign, randomBytes } from "crypto";
import {
    addEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AddEntryArgument,
    _encode_AddEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeTypeAndValue, _encode_AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import { attributes as selat } from "@wildboar/x500";
import { objectClasses as seloc } from "@wildboar/x500";
import {
    subentry,
} from "@wildboar/x500/InformationFramework";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    accessControlSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    subschema,
} from "@wildboar/x500/SchemaAdministration";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/InformationFramework";
import {
    ServiceControls,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControlOptions,
} from "@wildboar/x500/DirectoryAbstractService";
import { SecurityParameters } from "@wildboar/x500/DirectoryAbstractService";
import {
    ProtectionRequest_none,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_none,
} from "@wildboar/x500/DirectoryAbstractService";
import print from "./printCode.js";
import {
    DER,
    _encodeBoolean,
    _encodeInteger,
    _encodeNull,
    _encodeObjectIdentifier,
    _encodePrintableString,
    _encodeUTF8String,
    // _encodeNumericString,
} from "@wildboar/asn1/functional";
import {
    dITStructureRules,
} from "@wildboar/x500/SchemaAdministration";
import {
    DITStructureRuleDescription,
    _encode_DITStructureRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    dITContentRules,
} from "@wildboar/x500/SchemaAdministration";
import {
    DITContentRuleDescription,
    _encode_DITContentRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    dITContextUse,
} from "@wildboar/x500/SchemaAdministration";
import {
    DITContextUseDescription,
    _encode_DITContextUseDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    DITContextUseInformation,
} from "@wildboar/x500/SchemaAdministration";
import { nameForms as nf } from "@wildboar/x500";
import { objectClasses as oc } from "@wildboar/x500";
import { attributes as at } from "@wildboar/x500";
import { contexts as ct } from "@wildboar/x500";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/InformationFramework";
import {
    prescriptiveACI,
} from "@wildboar/x500/BasicAccessControl";
import {
    ANONYMOUS_BASELINE,
    AUTHENTICATED_USER_BASELINE,
    AUTHENTICATED_USER_SELF_BASELINE,
    GLOBAL_DIRECTORY_ADMIN_BASELINE,
} from "./aci.js";
import { RDNSequence } from "@wildboar/x500/InformationFramework";
import { compareCode } from "@wildboar/x500";
import {
    updateError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    UpdateProblem_entryAlreadyExists, UpdateProblem_namingViolation,
} from "@wildboar/x500/DirectoryAbstractService";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { Name } from "@wildboar/x500/InformationFramework";
import { SIGNED, HASH } from "@wildboar/x500/AuthenticationFramework";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/InformationFramework";
import { idempotentAddEntry } from "./utils.js";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/InformationFramework";
import {
    Context as X500Context,
} from "@wildboar/x500/InformationFramework";
import {
    commonName,
} from "@wildboar/x500/SelectedAttributeTypes";
import { commonAuxiliaryObjectClasses } from "./objectClassSets.js";
import {
    inetOrgPersonNameForm,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPersonNameForm.oa.js";
import {
    rule_based_access_control,
} from "@wildboar/x500/BasicAccessControl";
import { SecurityLabel, SignedSecurityLabelContent, _encode_SignedSecurityLabelContent } from "@wildboar/x500/EnhancedSecurity";
import { SignedSecurityLabel } from "@wildboar/x500/EnhancedSecurity";
import { readFileSync } from "node:fs";
import * as path from "node:path";
import { sha256WithRSAEncryption } from "@wildboar/x500/AlgorithmObjectIdentifiers";
import { AlgorithmIdentifier } from "@wildboar/pki-stub";
import { SecurityClassification_confidential, SecurityClassification_restricted, SecurityClassification_secret, SecurityClassification_top_secret, SecurityClassification_unmarked } from "@wildboar/x500/EnhancedSecurity";
import { id_sha256 } from "@wildboar/x500/AlgorithmObjectIdentifiers";
import { AttributeType } from "@wildboar/x500/InformationFramework";
import { addHours } from "date-fns";

const allNonSecurityContextTypes: OBJECT_IDENTIFIER[] = [
    ct.languageContext["&id"],
    ct.localeContext["&id"],
    ct.temporalContext["&id"],
    ct.ldapAttributeOptionContext["&id"],
];

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
            generalizedTime: addHours(new Date(), 1),
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

// NOTE: There is no collectiveCountryName attribute.
function addCollectiveAttributeSubentryArgument (
    baseObject: DistinguishedName,
    iso2c: string,
): AddEntryArgument {
    const c2 = _encodePrintableString(iso2c, DER);
    const cn = _encodeUTF8String(`${iso2c} Country Collective Attributes`, DER);
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.countryName["&id"]!,
                c2,
            ),
        ],
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                cn,
            ),
        ],
    ];
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(subentry["&id"], DER),
                _encodeObjectIdentifier(collectiveAttributeSubentry["&id"], DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"],
            [cn],
            undefined,
        ),
        new Attribute(
            selat.subtreeSpecification["&id"],
            [
                _encode_SubtreeSpecification(new SubtreeSpecification(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    [],
                ), DER),
            ],
            undefined,
        ),
    ];
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

function addAccessControlSubentryArgument (
    baseObject: DistinguishedName,
    iso2c: string,
): AddEntryArgument {
    const c2 = _encodePrintableString(iso2c, DER);
    const cn = _encodeUTF8String(`${iso2c} Country Access Control`, DER);
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.countryName["&id"]!,
                c2,
            ),
        ],
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                cn,
            ),
        ],
    ];
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(subentry["&id"], DER),
                _encodeObjectIdentifier(accessControlSubentry["&id"], DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"],
            [cn],
            undefined,
        ),
        new Attribute(
            selat.subtreeSpecification["&id"],
            [
                _encode_SubtreeSpecification(new SubtreeSpecification(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    [],
                ), DER),
            ],
            undefined,
        ),
        new Attribute(
            prescriptiveACI["&id"],
            [
                ANONYMOUS_BASELINE,
                AUTHENTICATED_USER_BASELINE,
                AUTHENTICATED_USER_SELF_BASELINE,
                GLOBAL_DIRECTORY_ADMIN_BASELINE,
            ]
                .map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
            undefined,
        ),
    ];
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

function addSubschemaSubentryArgument (
    baseObject: DistinguishedName,
    iso2c: string,
): AddEntryArgument {
    const c2 = _encodePrintableString(iso2c, DER);
    const cn = _encodeUTF8String(`${iso2c} Subschema`, DER);
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.countryName["&id"]!,
                c2,
            ),
        ],
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                cn,
            ),
        ],
    ];
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(subentry["&id"], DER),
                _encodeObjectIdentifier(subschema["&id"], DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"],
            [cn],
            undefined,
        ),
        new Attribute(
            selat.subtreeSpecification["&id"],
            [
                _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
            ],
            undefined,
        ),
        // TODO: Add all attribute types
        // TODO: Add all object classes
        // TODO: Add all name forms
        new Attribute(
            dITStructureRules["&id"],
            [
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    1,
                    nf.countryNameForm["&id"],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    2,
                    nf.sOPNameForm["&id"],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    3,
                    nf.orgNameForm["&id"],
                    [1, 2, 8],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    4,
                    nf.dMDNameForm["&id"],
                    [1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    5,
                    nf.dSANameForm["&id"],
                    [1, 4, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    6,
                    nf.deviceNameForm["&id"],
                    [1, 2, 3, 4, 5, 8, 9, 11, 12, 13],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    7,
                    nf.gONNameForm["&id"],
                    [1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    8,
                    nf.locNameForm["&id"],
                    [1, 2, 8],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    9,
                    nf.orgPersonNameForm["&id"],
                    [1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    10,
                    nf.orgRoleNameForm["&id"],
                    [1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    11,
                    nf.orgUnitNameForm["&id"],
                    [1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    12,
                    nf.personNameForm["&id"],
                    [1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    13,
                    nf.resPersonNameForm["&id"],
                    [1, 2, 8],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    14,
                    nf.applProcessNameForm["&id"],
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    15,
                    nf.applEntityNameForm["&id"],
                    [14],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    16,
                    nf.cRLDistPtNameForm["&id"],
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    17,
                    inetOrgPersonNameForm["&id"],
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                ), DER),
            ],
            undefined,
        ),
        new Attribute(
            dITContentRules["&id"],
            [
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.applicationEntity["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.applicationProcess["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.cRLDistributionPoint["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.country["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.dMD["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.dSA["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.device["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.locality["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.organization["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.organizationalPerson["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.organizationalUnit["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.person["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
                _encode_DITContentRuleDescription(new DITContentRuleDescription(
                    oc.residentialPerson["&id"],
                    commonAuxiliaryObjectClasses, // auxiliaries
                    undefined, // mandatory
                    undefined, // optional
                    undefined, // precluded
                ), DER),
            ],
            undefined,
        ),
        new Attribute(
            dITContextUse["&id"],
            [
                _encode_DITContextUseDescription(new DITContextUseDescription(
                    id_oa_allAttributeTypes,
                    undefined,
                    undefined,
                    undefined,
                    new DITContextUseInformation(
                        undefined,
                        [
                            ct.temporalContext["&id"],
                            ct.ldapAttributeOptionContext["&id"],
                        ],
                    ),
                ), DER),
                ...([
                    at.name["&id"],
                    at.commonName["&id"],
                    at.localityName["&id"],
                    at.stateOrProvinceName["&id"],
                    at.title["&id"],
                    at.description["&id"],
                    at.serialNumber["&id"],
                ].map((ctoid) => _encode_DITContextUseDescription(new DITContextUseDescription(
                    ctoid,
                    undefined,
                    undefined,
                    undefined,
                    new DITContextUseInformation(
                        undefined,
                        [
                            ...allNonSecurityContextTypes,
                            ct.attributeValueSecurityLabelContext["&id"],
                            ct.attributeValueIntegrityInfoContext["&id"],
                        ],
                    ),
                ), DER))),
            ],
            undefined,
        ),
    ];
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

function addPasswordAdminSubentryArgument (
    baseObject: DistinguishedName,
    iso2c: string,
): AddEntryArgument {
    const c2 = _encodePrintableString(iso2c, DER);
    const cn = _encodeUTF8String(`${iso2c} Country Password Administration`, DER);
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.countryName["&id"]!,
                c2,
            ),
        ],
        [
            new AttributeTypeAndValue(
                selat.commonName["&id"]!,
                cn,
            ),
        ],
    ];
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(subentry["&id"], DER),
                _encodeObjectIdentifier(pwdAdminSubentry["&id"], DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.commonName["&id"],
            [cn],
            undefined,
        ),
        new Attribute(
            selat.subtreeSpecification["&id"],
            [
                _encode_SubtreeSpecification(new SubtreeSpecification(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    [],
                ), DER),
            ],
            undefined,
        ),
        new Attribute(
            at.pwdAttribute["&id"],
            [_encodeObjectIdentifier(at.userPwd["&id"], DER)],
            undefined,
        ),
        new Attribute(
            at.pwdModifyEntryAllowed["&id"],
            [_encodeBoolean(FALSE, DER)],
            undefined,
        ),
        new Attribute(
            at.pwdChangeAllowed["&id"],
            [_encodeBoolean(TRUE, DER)],
            undefined,
        ),
        new Attribute(
            at.pwdMinLength["&id"],
            [_encodeInteger(8, DER)],
            undefined,
        ),
    ];
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
            _encodePrintableString("CA", DER),
        ),
    ],
];

// FIXME: This needs to be changed or removed once testing is done.
const issuerName: Name = {
    rdnSequence: [
        [
            new AttributeTypeAndValue(
                commonName["&id"],
                _encodeUTF8String("god", DER),
            ),
        ],
    ],
};

let cachedKey: KeyObject | undefined;
function createSecurityLabel (content: SignedSecurityLabelContent): SignedSecurityLabel | null {
    try {
        if (!cachedKey) {
            const keyFileContents = readFileSync(
                process.env.TEST_DIT_KEY_FILE ?? path.join("test", "pki", "god.key"),
                { encoding: "ascii" },
            );
            const key = createPrivateKey({
                format: "pem",
                type: "pkcs8",
                key: keyFileContents,
            });
            cachedKey = key;
        }
        const bytes = _encode_SignedSecurityLabelContent(content, DER).toBytes();
        const signer = createSign("sha256");
        signer.update(bytes);
        const sig = signer.sign(cachedKey);
        return new SIGNED(
            content,
            new AlgorithmIdentifier(
                sha256WithRSAEncryption,
                _encodeNull(null, DER),
            ),
            unpackBits(sig),
            undefined,
            undefined,
        );
    } catch (e) {
        // We log and return gracefully, so that the test DIT can still be
        // created even if the keys could not be found.
        console.error(e);
        return null;
    }
}

function createSecurityLabelContext (content: SignedSecurityLabelContent): X500Context | null {
    const label = createSecurityLabel(content);
    if (!label) {
        return null;
    }
    return new X500Context(
        ct.attributeValueSecurityLabelContext["&id"],
        [
            ct.attributeValueSecurityLabelContext.encoderFor["&Type"]!(label, DER),
        ],
    );
}

function secLabel (
    type: AttributeType,
    value: ASN1Element,
    classification: INTEGER,
): X500Context | null {
    const atav = new AttributeTypeAndValue(type, value);
    const atav_bytes = _encode_AttributeTypeAndValue(atav).toBytes();
    const slc = new SignedSecurityLabelContent(
        new HASH(
            new AlgorithmIdentifier(id_sha256),
            unpackBits(createHash("sha256").update(atav_bytes).digest()),
        ),
        issuerName,
        undefined,
        new SecurityLabel(
            ObjectIdentifier.fromParts([ 1, 3, 6, 1, 4, 1, 56490, 403, 1 ]),
            classification,
            (classification === SecurityClassification_secret) ? "SECRET" : undefined,
            undefined,
        ),
    );
    return createSecurityLabelContext(slc);
}

// Converts "asdf" to "a***"
function censor (str: string): string {
    return `${str.charAt(0)}${"*".repeat(str.length - 1)}`;
}

function createSensitiveDeviceAttributes (serial: string, loc: string, desc: string): Attribute[] {
    const desc2 = censor(desc);
    const serial_sec_label = secLabel(
        selat.serialNumber["&id"],
        _encodeUTF8String(serial, DER),
        SecurityClassification_secret,
    );
    const loc_sec_label = secLabel(
        selat.localityName["&id"],
        _encodeUTF8String(loc, DER),
        SecurityClassification_confidential,
    );
    const desc_sec_label = secLabel(
        selat.description["&id"],
        _encodeUTF8String(desc, DER),
        SecurityClassification_restricted,
    );
    const desc2_sec_label = secLabel(
        selat.description["&id"],
        _encodeUTF8String(desc2, DER),
        SecurityClassification_unmarked,
    );
    return [
        new Attribute(
            selat.serialNumber["&id"]!,
            serial_sec_label ? [] : [ _encodeUTF8String(serial, DER) ],
            serial_sec_label
                ? [
                    new Attribute_valuesWithContext_Item(
                        _encodeUTF8String(serial, DER),
                        [serial_sec_label],
                    ),
                ]
                : undefined,
        ),
        new Attribute(
            selat.localityName["&id"]!,
            loc_sec_label ? [] : [ _encodeUTF8String(loc, DER) ],
            loc_sec_label
                ? [
                    new Attribute_valuesWithContext_Item(
                        _encodeUTF8String(loc, DER),
                        [loc_sec_label],
                    ),
                ]
                : undefined,
        ),
        new Attribute(
            selat.description["&id"]!,
            (desc_sec_label && desc2_sec_label) ? [] : [ _encodeUTF8String(desc, DER) ],
            (desc_sec_label && desc2_sec_label)
                ? [
                    new Attribute_valuesWithContext_Item(
                        _encodeUTF8String(desc, DER),
                        [desc_sec_label],
                    ),
                    new Attribute_valuesWithContext_Item(
                        _encodeUTF8String(desc2, DER),
                        [desc2_sec_label],
                    ),
                ]
                : undefined,
        ),
    ];
}

export
async function seedCA (
    ctx: Context,
    conn: Connection,
): Promise<void> {
    const subentries: [ (base: RDNSequence, cc: string) => AddEntryArgument, string ][] = [
        [ addPasswordAdminSubentryArgument, "password administration" ],
        [ addCollectiveAttributeSubentryArgument, "collective attributes" ],
        [ addSubschemaSubentryArgument, "subschema" ],
        [ addAccessControlSubentryArgument, "access control" ],
    ];
    for (const [ createSubentryArg, subentryType ] of subentries) {
        const createSubentry = createSubentryArg([], "CA");
        const outcome = await conn.writeOperation({
            opCode: addEntry["&operationCode"],
            argument: _encode_AddEntryArgument(createSubentry, DER),
        });
        if ("error" in outcome) {
            if (outcome.errcode) {
                if (compareCode(outcome.errcode, updateError["&errorCode"]!)) {
                    const param = updateError.decoderFor["&ParameterType"]!(outcome.error);
                    const data = getOptionallyProtectedValue(param);
                    if (data.problem === UpdateProblem_entryAlreadyExists) {
                        ctx.log.warn(`Country CA already has a ${subentryType} subentry.`);
                        continue;
                    }
                    else if ( // This error happens because there can only be one subschema per admin area.
                        (subentryType === "subschema")
                        && (data.problem === UpdateProblem_namingViolation)
                    ) {
                        ctx.log.warn(`Country CA already has a ${subentryType} subentry.`);
                        continue;
                    }
                }
                ctx.log.error(print(outcome.errcode));
                process.exit(873);
            } else {
                ctx.log.error("Uncoded error.");
                process.exit(4352);
            }
        }
        ctx.log.info(`Created ${subentryType} subentry for country CA.`);
    }

    { // C=CA,O=Armed Forces
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.organization["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.organizationName["&id"]!,
                [_encodeUTF8String("Armed Forces", DER)],
                undefined,
            ),
            new Attribute(
                selat.administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_accessControlSpecificArea, DER),
                ],
            ),
            new Attribute(
                selat.accessControlScheme["&id"],
                [
                    _encodeObjectIdentifier(rule_based_access_control, DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces", arg);
    }

    { // C=CA,CN=Justin Trudeau
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Justin Trudeau", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [_encodeUTF8String("Justin Trudeau", DER)],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("Trudeau", DER),
                ],
            ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("Prime Minister", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,CN=Justin Trudeau", arg);
    }

    { // C=CA,CN=Charles III
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Charles III", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Charles Philip Arthur George", DER),
                    _encodeUTF8String("Charles III", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("George", DER),
                ],
            ),
            // new Attribute(
            //     selat.generationQualifier["&id"],
            //     [
            //         _encodeUTF8String("III", DER),
            //     ],
            // ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("King", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,CN=Charles III", arg);
    }

    { // C=CA,CN=Mary Simon
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Mary Simon", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Mary Simon", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("Simon", DER),
                ],
            ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("Governor General", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,CN=Mary Simon", arg);
    }

    { // C=CA,O=Armed Forces,CN=Bill Blair
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Bill Blair", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Bill Blair", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("Blair", DER),
                ],
            ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("Minister of National Defense", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Bill Blair", arg);
    }

    { // C=CA,O=Armed Forces,CN=Wayne Eyre
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Wayne Eyre", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Wayne Eyre", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("Eyre", DER),
                ],
            ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("Chief of the Defence Staff", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Wayne Eyre", arg);
    }

    { // C=CA,O=Armed Forces,CN=Frances J. Allen
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Frances J. Allen", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Frances J. Allen", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("Allen", DER),
                ],
            ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("Vice Chief of the Defence Staff", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Frances J. Allen", arg);
    }

    { // C=CA,O=Armed Forces,CN=Gilles Gregoire
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Gilles Gregoire", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Gilles Gregoire", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("Gregoire", DER),
                ],
            ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("Chief Warrant Officer", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Gilles Gregoire", arg);
    }

    // This is not a real person.
    { // C=CA,O=Armed Forces,CN=Joe Schmoe
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Joe Schmoe", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.organizationalPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Joe Schmoe", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"],
                [
                    _encodeUTF8String("Schmoe", DER),
                ],
            ),
            new Attribute(
                selat.title["&id"],
                [
                    _encodeUTF8String("Caffeination Engineer", DER),
                ],
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Joe Schmoe", arg);
    }

    // These entries are going to be restricted under rule-based access control.
    // These all have object class `device`.

    { // C=CA,O=Armed Forces,CN=Patriot Missile System
        const serial = "358508303080-P";
        const loc = "Toronto";
        const desc = "Lightly used, $400 OBO, cash offers ONLY";
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Patriot Missile System", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.device["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Patriot Missile System", DER),
                ],
                undefined,
            ),
            ...createSensitiveDeviceAttributes(serial, loc, desc),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Patriot Missile System", arg);
    }

    { // C=CA,O=Armed Forces,CN=Shadow Strike Missile
        const serial = "S6899993-91";
        const loc = "Winnipeg";
        const desc = "Duct-taped together, but its fine.";
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Shadow Strike Missile", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.device["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Shadow Strike Missile", DER),
                ],
                undefined,
            ),
            ...createSensitiveDeviceAttributes(serial, loc, desc),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Shadow Strike Missile", arg);
    }

    { // C=CA,O=Armed Forces,CN=Abrams Tank
        const serial = "AT-00098551";
        const loc = "Churchill";
        const desc = "Stolen from the U.S. (dont tell please)";
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Abrams Tank", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.device["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("Abrams Tank", DER),
                ],
                undefined,
            ),
            ...createSensitiveDeviceAttributes(serial, loc, desc),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Abrams Tank", arg);
    }

    { // C=CA,O=Armed Forces,CN=F-16 #3389
        const serial = "3389";
        const loc = "Ottawa";
        const desc = "The one with the shark-launcher installed";
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("F-16 #3389", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.device["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [
                    _encodeUTF8String("F-16 #3389", DER),
                ],
                undefined,
            ),
            ...createSensitiveDeviceAttributes(serial, loc, desc),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=F-16 #3389", arg);
    }

    // This entry is TOP SECRET. You are NOT ALLOWED to know about this.
    { // C=CA,O=Armed Forces,CN=Demon Portal Siphon Gun
        const cn = "Demon Portal Siphon Gun";
        const cn_sec_label = secLabel(
            selat.commonName["&id"],
            _encodeUTF8String(cn, DER),
            SecurityClassification_top_secret,
        );
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.organizationName["&id"]!,
                    _encodeUTF8String("Armed Forces", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String(cn, DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.device["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                cn_sec_label ? [] : [ _encodeUTF8String(cn, DER) ],
                cn_sec_label
                    ? [
                        new Attribute_valuesWithContext_Item(
                            _encodeUTF8String(cn, DER),
                            [cn_sec_label],
                        ),
                    ]
                    : undefined,
            ),
            new Attribute(
                selat.serialNumber["&id"]!,
                [
                    _encodeUTF8String("BFG9000", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.localityName["&id"]!,
                [
                    _encodeUTF8String("Ottawa", DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.description["&id"]!,
                [
                    _encodeUTF8String("This entry is TOP SECRET. You are NOT ALLOWED to know about this.", DER),
                ],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=CA,O=Armed Forces,CN=Demon Portal Siphon Gun", arg);
    }

}

export default seedCA;
