import type { Connection, Context } from "./types";
import {
    TRUE,
    FALSE,
    FALSE_BIT,
    unpackBits,
    OBJECT_IDENTIFIER,
} from "asn1-ts";
import { randomBytes, randomInt } from "crypto";
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
import { AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    id_ar_collectiveAttributeSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-collectiveAttributeSpecificArea.va";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    id_ar_pwdAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-pwdAdminSpecificArea.va";
import {
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import { uriToNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import {
    PresentationAddress,
    _encode_PresentationAddress,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import { idempotentAddEntry } from "./utils";
import { Guide, _encode_Guide } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/Guide.ta";
import {
    directoryAccessAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/directoryAccessAC.oa";
import {
    directorySystemAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/directorySystemAC.oa";
import {
    directoryOperationalBindingManagementAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/directoryOperationalBindingManagementAC.oa";
import {
    shadowSupplierInitiatedAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/shadowSupplierInitiatedAC.oa";
import {
    shadowConsumerInitiatedAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/shadowConsumerInitiatedAC.oa";
import {
    shadowSupplierInitiatedAsynchronousAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/shadowSupplierInitiatedAsynchronousAC.oa";
import {
    shadowConsumerInitiatedAsynchronousAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/shadowConsumerInitiatedAsynchronousAC.oa";
import {
    Attribute_valuesWithContext_Item,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import {
    languageContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/languageContext.oa";
import {
    localeContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localeContext.oa";
import {
    temporalContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/temporalContext.oa";
import {
    TimeSpecification,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TimeSpecification.ta";
import {
    TimeSpecification_time_absolute,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/TimeSpecification-time-absolute.ta";
import { addDays } from "date-fns";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { commonAuxiliaryObjectClasses } from "./objectClassSets";
import {
    inetOrgPersonNameForm,
} from "@wildboar/parity-schema/src/lib/modules/InetOrgPerson/inetOrgPersonNameForm.oa";

// const MOSCOW_ACCESS_POINT = new AccessPoint(
//     {
//         rdnSequence: [
//             [
//                 new AttributeTypeAndValue(
//                     commonName["&id"],
//                     _encodeUTF8String("dsa01.moscow.mkdemo.wildboar.software", DER),
//                 ),
//             ],
//         ],
//     },
//     new PresentationAddress(
//         undefined,
//         undefined,
//         undefined,
//         [
//             /**
//              * Even if you plan on using LDAP to read this entry, you MUST
//              * specify an X.500 URL, because DOP cannot be translated into LDAP.
//              */
//             uriToNSAP("idms://dsa01.moscow.mkdemo.wildboar.software:44632", false),
//             uriToNSAP("idm://dsa01.moscow.mkdemo.wildboar.software:4632", false),
//             uriToNSAP("ldaps://dsa01.moscow.mkdemo.wildboar.software:636", false),
//             uriToNSAP("ldap://dsa01.moscow.mkdemo.wildboar.software:389", false),
//         ],
//     ),
//     undefined,
// );

const MOSCOW_ACCESS_POINT = new AccessPoint(
    {
        rdnSequence: [
            [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    _encodeUTF8String("dsa2", DER),
                ),
            ],
        ],
    },
    new PresentationAddress(
        undefined,
        undefined,
        undefined,
        [
            uriToNSAP("idm://dsa2:4632", false),
        ],
    ),
    undefined,
);

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
    targetSystem?: AccessPoint,
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
            selat.administrativeRole["&id"]!,
            [
                _encodeObjectIdentifier(id_ar_autonomousArea, DER),
                _encodeObjectIdentifier(id_ar_collectiveAttributeSpecificArea, DER),
                _encodeObjectIdentifier(id_ar_accessControlSpecificArea, DER),
                _encodeObjectIdentifier(id_ar_pwdAdminSpecificArea, DER),
                _encodeObjectIdentifier(id_ar_subschemaAdminSpecificArea, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.objectClass["&id"],
            [
                _encodeObjectIdentifier(seloc.locality["&id"]!, DER),
                _encodeObjectIdentifier(seloc.userPwdClass["&id"]!, DER),
            ],
            undefined,
        ),
        new Attribute(
            selat.localityName["&id"]!,
            [ln],
            undefined,
        ),
        new Attribute(
            selat.userPwd["&id"],
            [
                selat.userPwd.encoderFor["&Type"]!({
                    clear: `password4${lname}`,
                }, DER),
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
            _encodePrintableString("RU", DER),
        ),
    ],
];

export
async function seedRU (
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
        const createSubentry = createSubentryArg([], "RU");
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
                        ctx.log.warn(`Country RU already has a ${subentryType} subentry.`);
                        continue;
                    }
                    else if ( // This error happens because there can only be one subschema per admin area.
                        (subentryType === "subschema")
                        && (data.problem === UpdateProblem_namingViolation)
                    ) {
                        ctx.log.warn(`Country RU already has a ${subentryType} subentry.`);
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
        ctx.log.info(`Created ${subentryType} subentry for country RU.`);
    }

    { // residentialPerson C=RU,CN=Vladimir Putin
        const arg = createAddEntryArgument([
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String("Vladimir Putin", DER),
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
                [_encodeUTF8String("Vladimir Putin", DER)],
                undefined,
            ),
            new Attribute(
                selat.surname["&id"]!,
                [_encodeUTF8String("Putin", DER)],
                undefined,
            ),
            new Attribute(
                selat.localityName["&id"]!,
                [_encodeUTF8String("Moscow", DER)],
                undefined,
            ),
        ]);
        await idempotentAddEntry(ctx, conn, "C=RU,CN=Vladimir Putin", arg);
    }

    { // Create C=RU,L=Moscow in subordinate DSA
        const arg = addLocalityArgument(baseObject, "Moscow", MOSCOW_ACCESS_POINT);
        const outcome = await conn.writeOperation({
            opCode: addEntry["&operationCode"],
            argument: _encode_AddEntryArgument(arg, DER),
        });
        if ("error" in outcome) {
            if (outcome.errcode) {
                if (!compareCode(outcome.errcode, updateError["&errorCode"]!)) {
                    ctx.log.error(print(outcome.errcode));
                    process.exit(281);
                }
                const param = updateError.decoderFor["&ParameterType"]!(outcome.error);
                const data = getOptionallyProtectedValue(param);
                if (data.problem === UpdateProblem_entryAlreadyExists) {
                    ctx.log.warn(`cn=RU,l=Moscow already exists.`);
                } else {
                    ctx.log.error(print(outcome.errcode));
                    process.exit(283);
                }
            } else {
                ctx.log.error("Uncoded error.");
                process.exit(285);
            }
        } else {
            ctx.log.info(`Created country cn=RU,l=Moscow.`);
        }
    }

    const sputnikDMDName: string = "Sputnik DMD";
    { // Create C=RU,dmdName=Sputnik DMD
        const dn: DistinguishedName = [
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.dmdName["&id"]!,
                    _encodeUTF8String(sputnikDMDName, DER),
                ),
            ],
        ];
        const guide = new Guide(
            seloc.dSA["&id"],
            {
                type_: {
                    equality: selat.supportedApplicationContext["&id"],
                },
            },
        );
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.dMD["&id"], DER),
                ],
            ),
            new Attribute(
                selat.dmdName["&id"],
                [_encodeUTF8String(sputnikDMDName, DER)],
            ),
            new Attribute(
                selat.searchGuide["&id"],
                [_encode_Guide(guide, DER)],
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, "C=RU,dmdName=Sputnik DMD", arg);
    }

    // Create a few DSAs under the DMD
    for (let i = 0; i < 15; i++) {
        const numStr: string = i.toString().padStart(2, "0");
        const name: string = `DSA ${numStr}`;
        const dn: DistinguishedName = [
            ...baseObject,
            [
                new AttributeTypeAndValue(
                    selat.dmdName["&id"]!,
                    _encodeUTF8String(sputnikDMDName, DER),
                ),
            ],
            [
                new AttributeTypeAndValue(
                    selat.commonName["&id"]!,
                    _encodeUTF8String(name, DER),
                ),
            ],
        ];
        const pa = new PresentationAddress(
            undefined,
            undefined,
            undefined,
            [
                uriToNSAP(`idms://dsa${numStr}.sputnik.ru:44632`, false),
            ],
        );
        const applicationContexts: OBJECT_IDENTIFIER[] = [
            directoryAccessAC["&applicationContextName"]!,
            directorySystemAC["&applicationContextName"]!,
            directoryOperationalBindingManagementAC["&applicationContextName"]!,
            shadowSupplierInitiatedAC["&applicationContextName"]!,
            shadowConsumerInitiatedAC["&applicationContextName"]!,
            shadowSupplierInitiatedAsynchronousAC["&applicationContextName"]!,
            shadowConsumerInitiatedAsynchronousAC["&applicationContextName"]!,
        ];
        const timeSpec: TimeSpecification = new TimeSpecification(
            {
                absolute: new TimeSpecification_time_absolute(
                    new Date(),
                    addDays(new Date(), randomInt(1000)),
                ),
            },
            undefined,
            undefined,
        );
        const attributes: Attribute[] = [
            new Attribute(
                selat.objectClass["&id"],
                [
                    _encodeObjectIdentifier(seloc.applicationEntity["&id"], DER),
                    _encodeObjectIdentifier(seloc.dSA["&id"], DER),
                ],
            ),
            new Attribute(
                selat.commonName["&id"],
                [_encodeUTF8String(name, DER)],
            ),
            new Attribute(
                selat.presentationAddress["&id"],
                [_encode_PresentationAddress(pa, DER)],
            ),
            new Attribute(
                selat.supportedApplicationContext["&id"],
                applicationContexts.map((oid) => _encodeObjectIdentifier(oid, DER)),
            ),
            new Attribute(
                selat.description["&id"],
                [],
                [
                    new Attribute_valuesWithContext_Item(
                        _encodeUTF8String("В рамках подготовки к Третьей мировой войне...", DER),
                        [
                            new X500Context(
                                languageContext["&id"],
                                [languageContext.encoderFor["&Type"]!("RU", DER)],
                            ),
                        ],
                    ),
                    new Attribute_valuesWithContext_Item(
                        _encodeUTF8String("Just for scientific research...", DER),
                        [
                            new X500Context(
                                localeContext["&id"],
                                [localeContext.encoderFor["&Type"]!({
                                    localeID2: {
                                        uTF8String: "Murican",
                                    },
                                }, DER)],
                            ),
                        ],
                    ),
                ],
            ),
            new Attribute(
                selat.localityName["&id"],
                [],
                [
                    new Attribute_valuesWithContext_Item(
                        _encodeUTF8String("Istra", DER),
                        [
                            new X500Context(
                                temporalContext["&id"],
                                [temporalContext.encoderFor["&Type"]!(timeSpec, DER)],
                            ),
                        ],
                    ),
                ],
            ),
        ];
        const arg = createAddEntryArgument(dn, attributes);
        await idempotentAddEntry(ctx, conn, `C=RU,dmdName=Sputnik DMD,CN=${name}`, arg);
    }
}

export default seedRU;
