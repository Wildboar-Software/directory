import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    OBJECT_IDENTIFIER,
    INTEGER,
    ObjectIdentifier,
    FALSE,
} from "asn1-ts";
import {
    BER,
    DER,
    _encodeObjectIdentifier,
    _encodeInteger,
} from "asn1-ts/dist/node/functional";
import * as net from "net";
import {
    DirectoryBindArgument,
    _encode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    IdmBind,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
import {
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";
import {
    dap_ip,
} from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import {
    IDMConnection,
} from "@wildboar/idm";
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
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    _encode_UnboundedDirectoryString,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import {
    applicationProcess,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/applicationProcess.oa";
import {
    description,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/description.oa";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import {
    id_ar_subschemaAdminSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-subschemaAdminSpecificArea.va";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import {
    organization,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/organization.oa";
import {
    organizationalUnit,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/organizationalUnit.oa";
import {
    person,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa";
import {
    device,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/device.oa";
import {
    organizationName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationName.oa";
import {
    organizationalUnitName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/organizationalUnitName.oa";
import {
    surname,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/surname.oa";
import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import {
    userPwdClass,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/userPwdClass.oa";
import type {
    Credentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Credentials.ta";
import {
    dITStructureRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import {
    DITStructureRuleDescription,
    _encode_DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
import {
    nameForms,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import {
    NameFormDescription,
    _encode_NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    NameFormInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormInformation.ta";
import {
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import {
    dITContentRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import {
    DITContentRuleDescription,
    _encode_DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import { friends } from "@wildboar/x500/src/lib/modules/SchemaAdministration/friends.oa";
import {
    FriendsDescription,
    _encode_FriendsDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/FriendsDescription.ta";
import {
    isoTagInfo,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/isoTagInfo.oa";
import {
    tagOid,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/tagOid.oa";
import {
    uiiInUrn,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uiiInUrn.oa";
import {
    contentUrl,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/contentUrl.oa";
import {
    alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import {
    aliasedEntryName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
import {
    oidC,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/oidC.oa";
import {
    oidCobj,
} from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/oidCobj.oa";
import {
    localeContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localeContext.oa";
import { dITContextUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
import {
    DITContextUseDescription,
    _encode_DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    DITContextUseInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseInformation.ta";

export
const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;

export
const serviceControls = new ServiceControls(
    serviceControlOptions,
    undefined,
    60,
);

export
function frame(ber: ASN1Element): Buffer {
    const data = ber.toBytes();
    const lengthBytes = Buffer.allocUnsafe(4);
    lengthBytes.writeUInt32BE(data.length);
    return Buffer.from([
        0x01, // Version 1
        0x01, // Final packet
        ...lengthBytes,
        ...Buffer.from(data),
    ]);
}

export const HOST: string = "localhost";
export const PORT: number = 4632;

export
const encodedDesc = utf8("testeroo");

export
function utf8 (str: string): ASN1Element {
    return _encode_UnboundedDirectoryString({
        uTF8String: str,
    }, DER);
}

export
function oid (o: OBJECT_IDENTIFIER): ASN1Element {
    return _encodeObjectIdentifier(o, DER);
}

export
function int (i: INTEGER): ASN1Element {
    return _encodeInteger(i, DER);
}

export
const subschemaRDN: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        commonName["&id"],
        utf8("subschema"),
    ),
];

export
async function connect (credentials?: Credentials): Promise<IDMConnection> {
    const dba = new DirectoryBindArgument(
        credentials,
        undefined,
    );
    const dapBind = {
        bind: new IdmBind(
            dap_ip["&id"]!,
            undefined,
            undefined,
            _encode_DirectoryBindArgument(dba, BER),
        ),
    };
    const client = net.createConnection({
        host: HOST,
        port: PORT,
    }, () => {
        client.write(frame(_encode_IDM_PDU(dapBind, BER)));
    });
    const idm = new IDMConnection(client);
    await new Promise((resolve, reject) => {
        idm.events.once("bindError", (err) => {
            reject(err);
        });
        idm.events.once("bindResult", (result) => {
            resolve(result);
        });
    });
    return idm;
}

export
function createAddEntryArguments(
    dn: DistinguishedName,
    attributes: Attribute[],
): AddEntryArgument {
    const reqData = new AddEntryArgumentData(
        {
            rdnSequence: dn,
        },
        attributes,
        undefined,
        [],
        serviceControls,
    );
    const arg: AddEntryArgument = {
        unsigned: reqData,
    };
    return arg;
}

export
function createTestRDN (str: string): RelativeDistinguishedName {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: str,
    }, DER);
    return [
        new AttributeTypeAndValue(
            commonName["&id"]!,
            encodedCN,
        ),
    ];
}

export
function createTestRootDN(
    testId: string,
): DistinguishedName {
    return [
        createTestRDN(testId),
    ];
}

export
function writeOperation(
    connection: IDMConnection,
    opCode: Code,
    argument: ASN1Element,
): Promise<ResultOrError> {
    const invokeID = crypto.randomInt(1_000_000);
    return new Promise((resolve) => {
        connection.events.on(invokeID.toString(), (roe: ResultOrError) => {
            if ("error" in roe) {
                resolve(roe);
            } else {
                resolve({
                    invokeId: {
                        present: invokeID,
                    },
                    opCode: opCode,
                    result: roe.result,
                });
            }
        });
        connection.writeRequest(
            invokeID,
            opCode,
            argument,
        );
    });
}

export
async function createEntry(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
    rdn: RelativeDistinguishedName,
    attributes: Attribute[],
): Promise<ResultOrError> {
    const addTestNode = createAddEntryArguments(
        [
            ...superiorDN,
            rdn,
        ],
        attributes,
    );
    const invokeID = crypto.randomInt(1_000_000);
    return new Promise((resolve) => {
        connection.events.on(invokeID.toString(), (roe: ResultOrError) => {
            if ("error" in roe) {
                resolve(roe);
            } else {
                resolve({
                    invokeId: {
                        present: invokeID,
                    },
                    opCode: addEntry["&operationCode"]!,
                    result: roe.result,
                });
            }
        });
        connection!.writeRequest(
            invokeID,
            addEntry["&operationCode"]!,
            _encode_AddEntryArgument(addTestNode, DER),
        );
    });
}

// NOTE: These are made up OIDs.
export const personNameForm1ID  = new ObjectIdentifier([ 2, 5, 100, 1 ]);
export const personNameForm2ID  = new ObjectIdentifier([ 2, 5, 100, 2 ]);
export const processNameFormID  = new ObjectIdentifier([ 2, 5, 100, 3 ]);
export const deviceNameFormID   = new ObjectIdentifier([ 2, 5, 100, 4 ]);
export const orgNameFormID      = new ObjectIdentifier([ 2, 5, 100, 5 ]);
export const orgUnitNameFormID  = new ObjectIdentifier([ 2, 5, 100, 6 ]);
export const aliasNameFormID    = new ObjectIdentifier([ 2, 5, 100, 7 ]);
export const oidNameFormID      = new ObjectIdentifier([ 2, 5, 100, 8 ]);
export const aliasNameForm2ID   = new ObjectIdentifier([ 2, 5, 100, 9 ]);

export
async function createTestRootNode(
    connection: IDMConnection,
    testId: string,
    extraAttributes: Attribute[] = [],
    extraAttributesForSubschema: Attribute[] = [],
): Promise<void> {
    await createEntry(
        connection,
        [],
        createTestRDN(testId),
        [
            new Attribute(
                administrativeRole["&id"],
                [
                    oid(id_ar_autonomousArea),
                    oid(id_ar_subschemaAdminSpecificArea),
                ],
                undefined,
            ),
            new Attribute(
                objectClass["&id"],
                [
                    oid(applicationProcess["&id"]),
                    oid(userPwdClass["&id"]), // So passwords can be set.
                    oid(isoTagInfo["&id"]), // Just for testing friends.
                ],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8(testId)],
                undefined,
            ),
            new Attribute(
                description["&id"],
                [utf8("testeroo")],
                undefined,
            ),
            new Attribute(
                tagOid["&id"],
                [oid(new ObjectIdentifier([ 2, 5, 5, 5, 5 ]))],
                undefined,
            ),
            ...extraAttributes,
        ],
    );

    await createEntry(
        connection,
        createTestRootDN(testId),
        subschemaRDN,
        [
            new Attribute(
                objectClass["&id"],
                [
                    oid(subentry["&id"]),
                    oid(subschema["&id"]),
                ],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("subschema")],
                undefined,
            ),
            new Attribute(
                subtreeSpecification["&id"],
                [_encode_SubtreeSpecification(new SubtreeSpecification(), DER)],
                undefined,
            ),
            new Attribute(
                nameForms["&id"],
                [
                    _encode_NameFormDescription(new NameFormDescription(
                        processNameFormID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            applicationProcess["&id"],
                            [commonName["&id"]],
                            [description["&id"]],
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        personNameForm1ID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            person["&id"],
                            [surname["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        personNameForm2ID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            person["&id"],
                            [commonName["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        deviceNameFormID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            device["&id"],
                            [commonName["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        orgNameFormID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            organization["&id"],
                            [organizationName["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        orgUnitNameFormID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            organizationalUnit["&id"],
                            [organizationalUnitName["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        aliasNameFormID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            alias["&id"],
                            [objectClass["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        aliasNameFormID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            alias["&id"],
                            [objectClass["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        oidNameFormID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            oidCobj["&id"],
                            [oidC["&id"]],
                            undefined,
                        ),
                    ), DER),
                    _encode_NameFormDescription(new NameFormDescription(
                        aliasNameForm2ID,
                        undefined,
                        undefined,
                        undefined,
                        new NameFormInformation(
                            alias["&id"],
                            [userPwdClass["&id"]],
                            undefined,
                        ),
                    ), DER),
                ],
                undefined,
            ),
            new Attribute(
                dITStructureRules["&id"],
                [
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        1,
                        processNameFormID,
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        2,
                        personNameForm1ID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        3,
                        personNameForm2ID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        4,
                        processNameFormID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        5,
                        deviceNameFormID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        6,
                        orgNameFormID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        7,
                        orgUnitNameFormID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        8,
                        aliasNameFormID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        9,
                        oidNameFormID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                    _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                        10,
                        aliasNameForm2ID,
                        [ 1, 2, 3, 4, 5, 6, 7 ], // Everything may appear under everything else.
                    ), DER),
                ],
                undefined,
            ),
            new Attribute(
                dITContentRules["&id"],
                [
                    _encode_DITContentRuleDescription(new DITContentRuleDescription(
                        applicationProcess["&id"],
                        [child["&id"], userPwdClass["&id"], isoTagInfo["&id"]],
                    ), DER),
                    _encode_DITContentRuleDescription(new DITContentRuleDescription(
                        person["&id"],
                        [child["&id"]],
                    ), DER),
                    _encode_DITContentRuleDescription(new DITContentRuleDescription(
                        device["&id"],
                        [child["&id"]],
                    ), DER),
                    _encode_DITContentRuleDescription(new DITContentRuleDescription(
                        organization["&id"],
                        [child["&id"]],
                    ), DER),
                    _encode_DITContentRuleDescription(new DITContentRuleDescription(
                        organizationalUnit["&id"],
                        [child["&id"]],
                    ), DER),
                    _encode_DITContentRuleDescription(new DITContentRuleDescription(
                        alias["&id"],
                        [userPwdClass["&id"]],
                    ), DER),
                ],
                undefined,
            ),
            new Attribute(
                dITContextUse["&id"],
                [
                    _encode_DITContextUseDescription(new DITContextUseDescription(
                        commonName["&id"],
                        undefined,
                        undefined,
                        undefined,
                        new DITContextUseInformation(
                            undefined,
                            [localeContext["&id"]],
                        ),
                    ), DER),
                    _encode_DITContextUseDescription(new DITContextUseDescription(
                        description["&id"],
                        undefined,
                        undefined,
                        undefined,
                        new DITContextUseInformation(
                            undefined,
                            [localeContext["&id"]],
                        ),
                    ), DER),
                ],
                undefined,
            ),
            new Attribute(
                friends["&id"],
                [
                    // _encode_FriendsDescription(new FriendsDescription(
                    //     commonName["&id"],
                    //     [
                    //         {
                    //             uTF8String: "DELETEME",
                    //         },
                    //     ],
                    //     {
                    //         uTF8String: "Test name-form. Please delete.",
                    //     },
                    //     FALSE,
                    //     [tagOid["&id"]],
                    //     [],
                    // ), DER),
                    _encode_FriendsDescription(new FriendsDescription(
                        uiiInUrn["&id"],
                        [
                            {
                                uTF8String: "DELETEME",
                            },
                        ],
                        {
                            uTF8String: "Test name-form. Please delete.",
                        },
                        FALSE,
                        [tagOid["&id"]],
                        [],
                    ), DER),
                    _encode_FriendsDescription(new FriendsDescription(
                        organizationalUnitName["&id"],
                        [
                            {
                                uTF8String: "DELETEME",
                            },
                        ],
                        {
                            uTF8String: "Test name-form. Please delete.",
                        },
                        FALSE,
                        [description["&id"]],
                        [],
                    ), DER),
                ],
                undefined,
            ),
            ...extraAttributesForSubschema,
        ],
    );
}

export
async function createTestNode(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
    id: string,
    extraAttributes?: Attribute[],
): Promise<ResultOrError> {
    const addTestNode = createAddEntryArguments(
        [
            ...superiorDN,
            [
                new AttributeTypeAndValue(
                    commonName["&id"]!,
                    utf8(id),
                ),
            ],
        ],
        [
            new Attribute(
                objectClass["&id"],
                [
                    oid(applicationProcess["&id"]),
                    oid(isoTagInfo["&id"]),
                ],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8(id)],
                undefined,
            ),
            ...(extraAttributes ?? []),
        ],
    );
    const invokeID = crypto.randomInt(1_000_000);
    return new Promise((resolve) => {
        connection.events.on(invokeID.toString(), (roe: ResultOrError) => {
            if ("error" in roe) {
                resolve(roe);
            } else {
                resolve({
                    invokeId: {
                        present: invokeID,
                    },
                    opCode: addEntry["&operationCode"]!,
                    result: roe.result,
                });
            }
        });
        connection!.writeRequest(
            invokeID,
            addEntry["&operationCode"]!,
            _encode_AddEntryArgument(addTestNode, DER),
        );
    });
}

const parentRDN: RelativeDistinguishedName = [
    new AttributeTypeAndValue(
        organizationName["&id"],
        utf8("Wildboar Software"),
    ),
];

/**
 * @description
 *
 * organization
 * - organizationalUnit
 *   - person
 *   - device
 * - organizationalUnit
 * - person
 * - device
 *
 * @param connection
 * @param superiorDN
 */
export
async function createCompoundEntry(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
): Promise<void> {
    await createEntry(
        connection,
        superiorDN,
        parentRDN,
        [
            new Attribute(
                objectClass["&id"],
                [oid(organization["&id"])],
                undefined,
            ),
            new Attribute(
                organizationName["&id"],
                [utf8("Wildboar Software")],
                undefined,
            ),
        ],
    );

    const level2A_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            organizationalUnitName["&id"],
            utf8("Finance Department"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2A_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(organizationalUnit["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                organizationalUnitName["&id"],
                [utf8("Finance Department")],
                undefined,
            ),
        ],
    );

    const level2B_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            organizationalUnitName["&id"],
            utf8("Fun Department"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2B_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(organizationalUnit["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                organizationalUnitName["&id"],
                [utf8("Fun Department")],
                undefined,
            ),
        ],
    );

    const level2C_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Chief Pain Officer Jonathan Wilbur"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2C_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(person["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Chief Pain Officer Jonathan Wilbur")],
                undefined,
            ),
            new Attribute(
                surname["&id"],
                [utf8("Wilbur")],
                undefined,
            ),
        ],
    );

    const level2D_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Commodore 64 (128 KB memory extension)"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN],
        level2D_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(device["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Commodore 64 (128 KB memory extension)")],
                undefined,
            ),
        ],
    );

    const level3A_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Bigfoot"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN, level2A_rdn],
        level3A_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(person["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Bigfoot")],
                undefined,
            ),
            new Attribute(
                surname["&id"],
                [utf8("Garfunkel")],
                undefined,
            ),
        ],
    );

    const level3B_rdn: RelativeDistinguishedName = [
        new AttributeTypeAndValue(
            commonName["&id"],
            utf8("Bigfoot's iPhone 4"),
        ),
    ];
    await createEntry(
        connection,
        [...superiorDN, parentRDN, level2A_rdn],
        level3B_rdn,
        [
            new Attribute(
                objectClass["&id"],
                [oid(device["&id"]), oid(child["&id"])],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [utf8("Bigfoot's iPhone 4")],
                undefined,
            ),
        ],
    );
}
