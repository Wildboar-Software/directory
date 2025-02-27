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
    UpdateProblem_entryAlreadyExists, UpdateProblem_namingViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { commonAuxiliaryObjectClasses } from "./objectClassSets";
import {
    inetOrgPersonNameForm,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPersonNameForm.oa";
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
): AddEntryArgument {
    const c2 = _encodePrintableString("RU", DER);
    const cn = _encodeUTF8String(`Moscow Collective Attributes`, DER);
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
                selat.localityName["&id"]!,
                _encodeUTF8String("Moscow", DER),
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
): AddEntryArgument {
    const c2 = _encodePrintableString("RU", DER);
    const cn = _encodeUTF8String(`Moscow Access Control`, DER);
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
                selat.localityName["&id"]!,
                _encodeUTF8String("Moscow", DER),
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
): AddEntryArgument {
    const c2 = _encodePrintableString("RU", DER);
    const cn = _encodeUTF8String(`Moscow Subschema`, DER);
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
                selat.localityName["&id"]!,
                _encodeUTF8String("Moscow", DER),
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
                    0,
                    nf.locNameForm["&id"],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    2,
                    nf.sOPNameForm["&id"],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    3,
                    nf.orgNameForm["&id"],
                    [0, 1, 2, 8],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    4,
                    nf.dMDNameForm["&id"],
                    [0, 1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    5,
                    nf.dSANameForm["&id"],
                    [1, 4, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    6,
                    nf.deviceNameForm["&id"],
                    [0, 1, 2, 3, 4, 5, 8, 9, 11, 12, 13],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    7,
                    nf.gONNameForm["&id"],
                    [0, 1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    8,
                    nf.locNameForm["&id"],
                    [0, 1, 2, 8],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    9,
                    nf.orgPersonNameForm["&id"],
                    [0, 1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    10,
                    nf.orgRoleNameForm["&id"],
                    [1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    11,
                    nf.orgUnitNameForm["&id"],
                    [0, 1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    12,
                    nf.personNameForm["&id"],
                    [0, 1, 2, 3, 8, 11],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    13,
                    nf.resPersonNameForm["&id"],
                    [0, 1, 2, 8],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    14,
                    nf.applProcessNameForm["&id"],
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    15,
                    nf.applEntityNameForm["&id"],
                    [0, 14],
                ), DER),
                _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                    16,
                    nf.cRLDistPtNameForm["&id"],
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
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
): AddEntryArgument {
    const c2 = _encodePrintableString("RU", DER);
    const cn = _encodeUTF8String(`Moscow Password Administration`, DER);
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
                selat.localityName["&id"]!,
                _encodeUTF8String("Moscow", DER),
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

async function idempotentAddEntry (
    ctx: Context,
    conn: Connection,
    dnStr: string,
    arg: AddEntryArgument,
): Promise<void> {
    const outcome = await conn.writeOperation({
        opCode: addEntry["&operationCode"],
        argument: _encode_AddEntryArgument(arg, DER),
    });
    if ("error" in outcome) {
        if (outcome.errcode) {
            if (compareCode(outcome.errcode, updateError["&errorCode"]!)) {
                const param = updateError.decoderFor["&ParameterType"]!(outcome.error);
                const data = getOptionallyProtectedValue(param);
                if (data.problem === UpdateProblem_entryAlreadyExists) {
                    ctx.log.warn(`Entry ${dnStr} already exists.`);
                    return;
                }
            }
            ctx.log.error(print(outcome.errcode));
            process.exit(800);
        } else {
            ctx.log.error("Uncoded error.");
            process.exit(6004);
        }
    }
    ctx.log.info(`Added entry ${dnStr}.`);
}

const baseObject: DistinguishedName = [
    [
        new AttributeTypeAndValue(
            selat.countryName["&id"],
            _encodePrintableString("RU", DER),
        ),
    ],
    [
        new AttributeTypeAndValue(
            selat.localityName["&id"],
            _encodeUTF8String("Moscow", DER),
        ),
    ],
];

export
async function seedMoscow (
    ctx: Context,
    conn: Connection,
): Promise<void> {
    const subentries: [ (base: RDNSequence) => AddEntryArgument, string ][] = [
        [ addPasswordAdminSubentryArgument, "password administration" ],
        [ addCollectiveAttributeSubentryArgument, "collective attributes" ],
        [ addSubschemaSubentryArgument, "subschema" ],
        [ addAccessControlSubentryArgument, "access control" ],
    ];
    for (const [ createSubentryArg, subentryType ] of subentries) {
        const createSubentry = createSubentryArg([]);
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
                        ctx.log.warn(`Locality Moscow already has a ${subentryType} subentry.`);
                        continue;
                    }
                    else if ( // This error happens because there can only be one subschema per admin area.
                        (subentryType === "subschema")
                        && (data.problem === UpdateProblem_namingViolation)
                    ) {
                        ctx.log.warn(`Locality Moscow already has a ${subentryType} subentry.`);
                        continue;
                    }
                }
                ctx.log.error(print(outcome.errcode));
                process.exit(843);
            } else {
                ctx.log.error("Uncoded error.");
                process.exit(483);
            }
        }
        ctx.log.info(`Created ${subentryType} subentry for Moscow.`);
    }

    { // residentialPerson C=RU,L=Moscow,CN=Nikolai Petrosky
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Nikolai Petrosky", DER),
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
                [_encodeUTF8String("Nikolai Petrosky", DER)],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"]!,
                [_encodeUTF8String("Petrosky", DER)],
                undefined,
            ),
            new Attribute(
                selat.localityName["&id"]!,
                [_encodeUTF8String("Moscow", DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=RU,L=Moscow,CN=Nikolai Petrosky", arg);
    }
}

export default seedMoscow;
