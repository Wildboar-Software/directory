import type { Connection, Context } from "./types";
import {
    TRUE,
    FALSE,
    FALSE_BIT,
    unpackBits,
    OBJECT_IDENTIFIER,
} from "asn1-ts";
import { randomBytes } from "crypto";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import {
    AddEntryArgument,
    _encode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import {
    DistinguishedName, _encode_DistinguishedName,
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
    subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import {
    accessControlSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
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
import print from "./printCode";
import {
    DER,
    _encodeBoolean,
    _encodeIA5String,
    _encodeInteger,
    _encodeObjectIdentifier,
    _encodePrintableString,
    _encodeUTF8String,
    // _encodeNumericString,
} from "asn1-ts/dist/node/functional";
import {
    dITStructureRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import {
    DITStructureRuleDescription,
    _encode_DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
import {
    dITContentRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import {
    DITContentRuleDescription,
    _encode_DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import {
    dITContextUse,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
import {
    DITContextUseDescription,
    _encode_DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    DITContextUseInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseInformation.ta";
import * as nf from "@wildboar/x500/src/lib/collections/nameForms";
import * as oc from "@wildboar/x500/src/lib/collections/objectClasses";
import * as at from "@wildboar/x500/src/lib/collections/attributes";
import * as ct from "@wildboar/x500/src/lib/collections/contexts";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    ANONYMOUS_BASELINE,
    AUTHENTICATED_USER_BASELINE,
    AUTHENTICATED_USER_SELF_BASELINE,
    GLOBAL_DIRECTORY_ADMIN_BASELINE,
} from "./aci";
import { RDNSequence } from "@wildboar/x500/src/lib/modules/InformationFramework/RDNSequence.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    UpdateProblem_entryAlreadyExists,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { createMockPersonAttributes } from "./mock-entries";
import { idempotentAddEntry } from "./utils";
import { commonAuxiliaryObjectClasses, deviceAuxiliaryObjectClasses } from "./objectClassSets";
import {
    bootableDevice, bootFile, bootParameter,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootableDevice.oa";
import {
    ieee802Device, macAddress,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ieee802Device.oa";
import {
    ipHost,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipHost.oa";
import { BootParameterSyntax, _encode_BootParameterSyntax } from "@wildboar/parity-schema/src/lib/modules/NIS/BootParameterSyntax.ta";

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
            generalizedTime: new Date(),
        },
        unpackBits(randomBytes(16)),
        ProtectionRequest_none,
        addEntry["&operationCode"]!,
        ErrorProtectionRequest_none,
        undefined,
    );
}

function addLocalityArgument (
    baseObject: DistinguishedName,
    lname: string,
): AddEntryArgument {
    const ln = _encodeUTF8String(lname, DER);
    const dn: DistinguishedName = [
        ...baseObject,
        [
            new AttributeTypeAndValue(
                selat.localityName["&id"]!,
                ln,
            ),
        ],
    ];
    const attributes: Attribute[] = [
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(seloc.locality["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.localityName["&id"]!,
            [ln],
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
                    [
                        ...commonAuxiliaryObjectClasses,
                        ...deviceAuxiliaryObjectClasses,
                    ], // auxiliaries
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
                ].map((ctoid) => _encode_DITContextUseDescription(new DITContextUseDescription(
                    ctoid,
                    undefined,
                    undefined,
                    undefined,
                    new DITContextUseInformation(
                        undefined,
                        allNonSecurityContextTypes,
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
            _encodePrintableString("GB", DER),
        ),
    ],
];

export
async function seedGB (
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
        const createSubentry = createSubentryArg([], "GB");
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
                        ctx.log.warn(`Country GB already has a ${subentryType} subentry.`);
                        continue;
                    }
                }
                ctx.log.error(print(outcome.errcode));
                process.exit(8482);
            } else {
                ctx.log.error("Uncoded error.");
                process.exit(1235);
            }
        }
        ctx.log.info(`Created ${subentryType} subentry for country GB.`);
    }

    const regions: string[] = [
        "London",
        "South East",
        "North West",
        "East of England",
        "West Midlands",
        "South West",
        "Yorkshire and the Humber",
        "East Midlands",
        "North East",
    ];
    for (const region of regions) {
        const arg = addLocalityArgument(baseObject, region);
        const outcome = await conn.writeOperation({
            opCode: addEntry["&operationCode"],
            argument: _encode_AddEntryArgument(arg, DER),
        });
        if ("error" in outcome) {
            if (outcome.errcode) {
                if (!compareCode(outcome.errcode, updateError["&errorCode"]!)) {
                    ctx.log.error(print(outcome.errcode));
                    process.exit(4538);
                }
                const param = updateError.decoderFor["&ParameterType"]!(outcome.error);
                const data = getOptionallyProtectedValue(param);
                if (data.problem === UpdateProblem_entryAlreadyExists) {
                    ctx.log.warn(`cn=GB,l=${region} already exists.`);
                } else {
                    ctx.log.error(print(outcome.errcode));
                    process.exit(7373);
                }
            } else {
                ctx.log.error("Uncoded error.");
                process.exit(83);
            }
        } else {
            ctx.log.info(`Created country cn=GB,l=${region}.`);
        }
    }

    { // residentialPerson C=GB,CN=Margaret Thatcher
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Margaret Thatcher", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.residentialPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [_encodeUTF8String("Margaret Thatcher", DER)],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"]!,
                [_encodeUTF8String("Thatcher", DER)],
                undefined,
            ),
            new Attribute(
                selat.localityName["&id"]!,
                [_encodeUTF8String("London", DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=GB,CN=Margaret Thatcher", arg);
    }

    { // residentialPerson C=GB,CN=Prince Harry
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Prince Harry", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.residentialPerson["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [_encodeUTF8String("Prince Harry", DER)],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"]!,
                [_encodeUTF8String("Harry", DER)],
                undefined,
            ),
            new Attribute(
                selat.localityName["&id"]!,
                [_encodeUTF8String("Essex", DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=GB,CN=Prince Harry", arg);
    }

    { // device C=GB,CN=Prince Harry,CN=Cracked Screen iPhone 3
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Prince Harry", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Cracked Screen iPhone 3", DER),
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
                [_encodeUTF8String("Cracked Screen iPhone 3", DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=GB,CN=Prince Harry,CN=Cracked Screen iPhone 3", arg);
    }

    { // device C=GB,CN=Prince Harry,CN=VCR in the kill room
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Prince Harry", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("VCR in the kill room", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.child["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.device["&id"]!, DER),
                    _encodeObjectIdentifier(bootableDevice["&id"]!, DER),
                    _encodeObjectIdentifier(ieee802Device["&id"]!, DER),
                    _encodeObjectIdentifier(ipHost["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [_encodeUTF8String("VCR in the kill room", DER)],
                undefined,
            ),
            new Attribute(
                bootFile["&id"],
                [_encodeIA5String("/boot/boot.efi", DER)],
                undefined,
            ),
            new Attribute(
                bootParameter["&id"],
                [
                    _encode_BootParameterSyntax(new BootParameterSyntax(
                        "number_of_boops",
                        "www.google.com",
                        "/games/doom/doom.exe",
                    ), DER)
                ],
                undefined,
            ),
            new Attribute(
                macAddress["&id"],
                [_encodeIA5String("08:FB:34:11:05:37", DER)],
                undefined,
            ),
            new Attribute(
                macAddress["&id"],
                [_encodeIA5String("08:FB:34:11:05:37", DER)],
                undefined,
            ),
            new Attribute(
                ipHost["&id"],
                [_encodeIA5String("192.168.1.105", DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=GB,CN=Prince Harry,CN=VCR in the kill room", arg);
    }

    { // residentialPerson C=GB,CN=Megan Markle+SN=Markle
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Megan Markle", DER),
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
                [_encodeUTF8String("Megan Markle", DER)],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"]!,
                [_encodeUTF8String("Markle", DER)],
                undefined,
            ),
            new Attribute(
                selat.localityName["&id"]!,
                [_encodeUTF8String("Essex", DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=GB,CN=Megan Markle", arg);
    }

    { // person C=GB,L=London,CN=Sadiq Khan
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.localityName["&id"]!,
                    _encodeUTF8String("London", DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Sadiq Khan", DER),
                ),
            ],
        ], [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.person["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [_encodeUTF8String("Sadiq Khan", DER)],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"]!,
                [_encodeUTF8String("Khan", DER)],
                undefined,
            ),
            new Attribute(
                selat.hierarchyParent["&id"]!,
                [_encode_DistinguishedName([
                    ...baseObject,
                    [
                        new AttributeTypeAndValue(
                            selat.commonName["&id"]!,
                            _encodeUTF8String("Margaret Thatcher", DER),
                        ),
                    ],
                ], DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=GB,L=London,CN=Sadiq Khan", arg);
    }

    { // subentry C=GB,L=Yorkshire and the Humber,CN=Collective Attributes Subentry
        const cn: string = "Collective Attributes Subentry";
        const loc: string = "Yorkshire and the Humber";
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.localityName["&id"]!,
                    _encodeUTF8String(loc, DER),
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
                    _encodeObjectIdentifier(seloc.subentry["&id"]!, DER),
                    _encodeObjectIdentifier(seloc.collectiveAttributeSubentry["&id"]!, DER),
                ],
                undefined,
            ),
            new Attribute(
                selat.commonName["&id"]!,
                [_encodeUTF8String(cn, DER)],
                undefined,
            ),
            new Attribute(
                selat.collectiveLocalityName["&id"]!,
                [_encodeUTF8String(loc, DER)],
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
        ]);
        await idempotentAddEntry(ctx, conn, "C=GB,L=Yorkshire and the Humber,CN=Collective Attributes Subentry", arg);
    }

    // Create random people
    for (let i = 0; i < 1000; i++) {
        const [ rdn, attributes, cn ] = createMockPersonAttributes();
        const dn: DistinguishedName = [
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.localityName["&id"]!,
                    _encodeUTF8String("Yorkshire and the Humber", DER),
                ),
            ],
            rdn,
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, `C=GB,L=London,CN=${cn}`, arg);
    }
}

export default seedGB;
