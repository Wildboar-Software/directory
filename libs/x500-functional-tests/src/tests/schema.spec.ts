import { Buffer } from "node:buffer";
import process from "node:process";
import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    INTEGER,
    FALSE,
    DERElement,
} from "@wildboar/asn1";
import {
    BER,
    DER,
    _encodeObjectIdentifier,
    _encodeInteger,
    _encodePrintableString,
} from "@wildboar/asn1/functional";
import * as net from "node:net";
import {
    DirectoryBindArgument,
    _encode_DirectoryBindArgument,
    addEntry,
    AddEntryArgument,
    _encode_AddEntryArgument,
    AddEntryArgumentData,
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
    ServiceControls,
    _encode_ReadArgument,
    _decode_ReadResult,
    _encode_CompareArgument,
    _decode_CompareResult,
    _encode_ListArgument,
    _decode_ListResult,
    _encode_RemoveEntryArgument,
    modifyEntry,
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
    ModifyEntryArgumentData,
    _decode_ModifyEntryResult,
    _encode_ModifyDNArgument,
    _encode_AdministerPasswordArgument,
    _encode_ChangePasswordArgument,
    _encode_SearchArgument,
    _decode_SearchResult,
    _encode_TypeAndContextAssertion,
    Credentials,
    attributeError,
    AttributeProblem_contextViolation,
    updateError,
    UpdateProblem_objectClassViolation,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    IdmBind,
    _encode_IDM_PDU,
} from "@wildboar/x500/IDMProtocolSpecification";
import { dap_ip } from "@wildboar/x500/DirectoryIDMProtocols";
import { IDMConnection } from "@wildboar/idm";
import {
    DistinguishedName,
    _decode_DistinguishedName,
    _encode_DistinguishedName,
    Attribute,
    AttributeTypeAndValue,
    administrativeRole,
    objectClass,
    id_ar_autonomousArea,
    id_ar_subschemaAdminSpecificArea,
    Attribute_valuesWithContext_Item,
    Context,
    child,
    subentry,
    SubtreeSpecification,
    _encode_SubtreeSpecification,
    subtreeSpecification,
    RelativeDistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    commonName,
    description,
    _encode_UnboundedDirectoryString,
    organizationName,
    organizationalUnitName,
    surname,
    localeContext,
    _encode_LocaleContextSyntax,
    telephoneNumber,
    seeAlso,
    languageContext,
    temporalContext,
    TimeSpecification,
    _encode_TimeSpecification,
    TimeSpecification_time_absolute,
} from "@wildboar/x500/SelectedAttributeTypes";
import * as crypto from "node:crypto";
import type { ResultOrError } from "@wildboar/x500";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { strict as assert } from "node:assert";
import {
    organization,
    organizationalUnit,
    person,
    device,
    userPwdClass,
    userSecurityInformation,
    isoTagInfo,
    applicationProcess,
} from "@wildboar/x500/SelectedObjectClasses";
import { compareCode } from "@wildboar/x500";
import {
    subschema,
    _encode_FriendsDescription,
    dITStructureRules,
    DITStructureRuleDescription,
    _encode_DITStructureRuleDescription,
    nameForms,
    NameFormDescription,
    _encode_NameFormDescription,
    NameFormInformation,
    dITContentRules,
    DITContentRuleDescription,
    _encode_DITContentRuleDescription,
    dITContextUse,
    DITContextUseDescription,
    _encode_DITContextUseDescription,
    DITContextUseInformation,
} from "@wildboar/x500/SchemaAdministration";

vi.setConfig({ testTimeout: 30_000 });

const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(
    Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
const serviceControls = new ServiceControls(
    serviceControlOptions,
    undefined,
    60,
);

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

const HOST: string = process.env.MEERKAT_TEST_HOST ?? "localhost";
const PORT: number = process.env.MEERKAT_TEST_PORT
    ? Number.parseInt(process.env.MEERKAT_TEST_PORT)
    : 4632;

const encodedDesc = _encode_UnboundedDirectoryString({
    uTF8String: "testeroo",
}, DER);

function utf8 (str: string): ASN1Element {
    return _encode_UnboundedDirectoryString({
        uTF8String: str,
    }, DER);
}

function printable (str: string): ASN1Element {
    return _encodePrintableString(str, DER);
}

function oid (o: OBJECT_IDENTIFIER): ASN1Element {
    return _encodeObjectIdentifier(o, DER);
}

function int (i: INTEGER): ASN1Element {
    return _encodeInteger(i, DER);
}

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

function createTestRootDN(
    testId: string,
): DistinguishedName {
    return [
        createTestRDN(testId),
    ];
}

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

async function createTestRootNode(
    connection: IDMConnection,
    testId: string,
    extraAttributes?: Attribute[],
): Promise<ResultOrError> {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: testId,
    }, DER);

    const addTestRoot = createAddEntryArguments(
        createTestRootDN(testId),
        [
            new Attribute(
                administrativeRole["&id"],
                [
                    _encodeObjectIdentifier(id_ar_autonomousArea, DER),
                ],
                undefined,
            ),
            new Attribute(
                objectClass["&id"],
                [
                    _encodeObjectIdentifier(applicationProcess["&id"], DER),
                    _encodeObjectIdentifier(userPwdClass["&id"], DER), // So passwords can be set.
                ],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [
                    encodedCN,
                ],
                undefined,
            ),
            new Attribute(
                description["&id"],
                [
                    encodedDesc,
                ],
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
            _encode_AddEntryArgument(addTestRoot, DER),
        );
    });
}

async function createTestNode(
    connection: IDMConnection,
    superiorDN: DistinguishedName,
    id: string,
    extraAttributes?: Attribute[],
): Promise<ResultOrError> {
    const encodedCN = _encode_UnboundedDirectoryString({
        uTF8String: id,
    }, DER);
    const addTestNode = createAddEntryArguments(
        [
            ...superiorDN,
            [
                new AttributeTypeAndValue(
                    commonName["&id"]!,
                    encodedCN,
                ),
            ],
        ],
        [
            new Attribute(
                objectClass["&id"],
                [
                    _encodeObjectIdentifier(applicationProcess["&id"], DER),
                ],
                undefined,
            ),
            new Attribute(
                commonName["&id"],
                [
                    encodedCN,
                ],
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

describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    it("enforces DIT structure rules on entries in a subschema", async () => {
        const testId = `subschema.structure-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const personNameForm = ObjectIdentifier.fromParts([ 2, 5, 100, 2345 ]);
        const processNameForm = ObjectIdentifier.fromParts([ 2, 5, 100, 6789 ]);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_subschemaAdminSpecificArea),
                    ],
                    undefined,
                ),
            ]);
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8("subschema"),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
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
                        [
                            utf8("subschema"),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        nameForms["&id"],
                        [
                            _encode_NameFormDescription(new NameFormDescription(
                                processNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    applicationProcess["&id"],
                                    [commonName["&id"]],
                                    undefined,
                                ),
                            ), DER),
                            _encode_NameFormDescription(new NameFormDescription(
                                personNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    person["&id"],
                                    [surname["&id"]],
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
                                processNameForm,
                            ), DER),
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                2,
                                personNameForm,
                                [1], // People may appear below a process.
                            ), DER),
                        ],
                        undefined,
                    ),
                ],
            );
        }

        { // This should fail because the subschema does not permit a process beneath a process.
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [ ...dn, createTestRDN(entryName) ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(applicationProcess["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("errcode" in response);
            assert(response.errcode);
            assert("error" in response);
            assert(response.error);
        }

        { // This should fail because the name form for a person is wrong.
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [ ...dn, createTestRDN(entryName) ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8("asdf")],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("errcode" in response);
            assert(response.errcode);
            assert("error" in response);
            assert(response.error);
        }

        { // This should succeed because we are able to create a person with this name form below the process.
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
        }
    });

    it("enforces DIT content rules on entries in a subschema", async () => {
        const testId = `subschema.content-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const personNameForm = ObjectIdentifier.fromParts([ 2, 5, 100, 6336 ]);
        const processNameForm = ObjectIdentifier.fromParts([ 2, 5, 100, 8590 ]);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_subschemaAdminSpecificArea),
                    ],
                    undefined,
                ),
            ]);
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8("subschema"),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
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
                        [
                            utf8("subschema"),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        nameForms["&id"],
                        [
                            _encode_NameFormDescription(new NameFormDescription(
                                processNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    applicationProcess["&id"],
                                    [commonName["&id"]],
                                    undefined,
                                ),
                            ), DER),
                            _encode_NameFormDescription(new NameFormDescription(
                                personNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    person["&id"],
                                    [surname["&id"]],
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
                                processNameForm,
                            ), DER),
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                2,
                                personNameForm,
                                [1], // People may appear below a process.
                            ), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        dITContentRules["&id"],
                        [
                            _encode_DITContentRuleDescription(new DITContentRuleDescription(
                                person["&id"],
                                [userPwdClass["&id"], isoTagInfo["&id"]], // auxiliaries
                                [telephoneNumber["&id"]], // mandatory
                                [organizationName["&id"]], // optional
                                [seeAlso["&id"]], // precluded
                            ), DER),
                        ],
                        undefined,
                    ),
                ],
            );
        }

        { // Create person with no telephoneNumber, which should fail.
            const entryName: string = "no-telephoneNumber";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Create person with seeAlso
        {
            const entryName: string = "with-seeAlso";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        telephoneNumber["&id"],
                        [printable("+1 (888) 111-1111")],
                        undefined,
                    ),
                    new Attribute(
                        seeAlso["&id"],
                        [DERElement.fromSequence([])],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Create person with non-permitted auxiliary object class
        {
            const entryName: string = "with-forbidden-aux-oc";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(person["&id"]),
                            oid(userSecurityInformation["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        telephoneNumber["&id"],
                        [printable("+1 (888) 111-1111")],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Create person that complies with content rule
        const compliantEntryName: string = "compliant";
        const compliantEntryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                surname["&id"],
                utf8(compliantEntryName),
            ),
        ];
        const compliantEntryDN: DistinguishedName = [
            ...dn,
            compliantEntryRDN,
        ];
        {
            const entryName: string = compliantEntryName;
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [
                            oid(person["&id"]),
                            oid(userPwdClass["&id"]),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        telephoneNumber["&id"],
                        [printable("+1 (888) 111-1111")],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
        }

        // Modify person to add non-permitted auxiliary object class
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            objectClass["&id"],
                            [oid(userSecurityInformation["&id"])],
                            undefined,
                        ),
                    },
                ],
                undefined,
            );
            const arg: ModifyEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                modifyEntry["&operationCode"]!,
                _encode_ModifyEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Modify person to add permitted auxiliary object class
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            objectClass["&id"],
                            [oid(isoTagInfo["&id"])],
                            undefined,
                        ),
                    },
                ],
                undefined,
            );
            const arg: ModifyEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                modifyEntry["&operationCode"]!,
                _encode_ModifyEntryArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
        }

        // Modify person to add precluded attribute type
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            seeAlso["&id"],
                            [DERElement.fromSequence([])],
                            undefined,
                        ),
                    },
                ],
                undefined,
            );
            const arg: ModifyEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                modifyEntry["&operationCode"]!,
                _encode_ModifyEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Modify person to remove mandatory attribute type
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        removeAttribute: telephoneNumber["&id"],
                    },
                ],
                undefined,
            );
            const arg: ModifyEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                modifyEntry["&operationCode"]!,
                _encode_ModifyEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, updateError["&errorCode"]!)).toBeTruthy();
            const param = updateError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problem).toBe(UpdateProblem_objectClassViolation);
        }

        // Commented out because it would be a pain in the ass to test, because I have
        // to change the name, name form, and DIT structure rule.
        // Modify person to remove permitted auxiliary object class
        // {
        //     const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
        //         compliantEntryDN,
        //         [],
        //         TRUE,
        //     );
        //     const arg: ModifyDNArgument = {
        //         unsigned: reqData,
        //     };
        //     const response = await writeOperation(
        //         connection!,
        //         modifyDN["&operationCode"]!,
        //         _encode_ModifyDNArgument(arg, DER),
        //     );
        //     assert("result" in response);
        //     assert(response.result);
        // }

        // ModifyDN.deleteOldRDN cannot delete a mandatory attribute type

    });

    it("enforces DIT context use rules on entries in a subschema", async () => {
        const testId = `subschema.context-${(new Date()).toISOString()}`;
        const dn = createTestRootDN(testId);
        const personNameForm = ObjectIdentifier.fromParts([ 2, 5, 100, 26729 ]);
        const processNameForm = ObjectIdentifier.fromParts([ 2, 5, 100, 6931 ]);
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    administrativeRole["&id"],
                    [
                        oid(id_ar_subschemaAdminSpecificArea),
                    ],
                    undefined,
                ),
            ]);
            const subentryRDN: RelativeDistinguishedName = [
                new AttributeTypeAndValue(
                    commonName["&id"],
                    utf8("subschema"),
                ),
            ];
            await createEntry(
                connection!,
                dn,
                subentryRDN,
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
                        [
                            utf8("subschema"),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        subtreeSpecification["&id"],
                        [
                            _encode_SubtreeSpecification(new SubtreeSpecification(), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        nameForms["&id"],
                        [
                            _encode_NameFormDescription(new NameFormDescription(
                                processNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    applicationProcess["&id"],
                                    [commonName["&id"]],
                                    undefined,
                                ),
                            ), DER),
                            _encode_NameFormDescription(new NameFormDescription(
                                personNameForm,
                                undefined,
                                undefined,
                                undefined,
                                new NameFormInformation(
                                    person["&id"],
                                    [surname["&id"]],
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
                                processNameForm,
                            ), DER),
                            _encode_DITStructureRuleDescription(new DITStructureRuleDescription(
                                2,
                                personNameForm,
                                [1], // People may appear below a process.
                            ), DER),
                        ],
                        undefined,
                    ),
                    new Attribute(
                        dITContextUse["&id"],
                        [
                            _encode_DITContextUseDescription(new DITContextUseDescription(
                                description["&id"],
                                undefined,
                                undefined,
                                undefined,
                                new DITContextUseInformation(
                                    [languageContext["&id"]],
                                    [localeContext["&id"]],
                                ),
                            ), DER),
                        ],
                        undefined,
                    ),
                ],
            );
        }

        // Create person with description with non-permitted context
        {
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        description["&id"],
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                utf8("desc"),
                                [
                                    new Context(
                                        temporalContext["&id"],
                                        [
                                            _encode_TimeSpecification(new TimeSpecification(
                                                {
                                                    absolute: new TimeSpecification_time_absolute(
                                                        new Date(),
                                                        undefined,
                                                    ),
                                                },
                                                FALSE,
                                                undefined,
                                            ), DER),
                                        ],
                                        FALSE,
                                    ),
                                ],
                            ),
                        ],
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            if (!compareCode(response.errcode, attributeError["&errorCode"]!)) {
                console.log("ERROR CODE: ", response.errcode);
                console.log(response.error.toString());
            }
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Create person with description without mandatory context
        {
            const entryName: string = "asdf";
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: [
                        ...dn,
                        [
                            new AttributeTypeAndValue(
                                surname["&id"],
                                utf8(entryName),
                            ),
                        ],
                    ],
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        description["&id"],
                        [utf8("desc")],
                        undefined,
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Create person with description that complies
        const compliantEntryName: string = "compliant";
        const compliantEntryRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                surname["&id"],
                utf8(compliantEntryName),
            ),
        ];
        const compliantEntryDN: DistinguishedName = [
            ...dn,
            compliantEntryRDN,
        ];
        {
            const entryName: string = compliantEntryName;
            const reqData: AddEntryArgumentData = new AddEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    new Attribute(
                        objectClass["&id"],
                        [oid(person["&id"])],
                        undefined,
                    ),
                    new Attribute(
                        commonName["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        surname["&id"],
                        [utf8(entryName)],
                        undefined,
                    ),
                    new Attribute(
                        description["&id"],
                        [],
                        [
                            new Attribute_valuesWithContext_Item(
                                utf8("desc"),
                                [
                                    new Context(
                                        languageContext["&id"],
                                        [printable("EN")],
                                        FALSE,
                                    ),
                                    new Context(
                                        localeContext["&id"],
                                        [localeContext.encoderFor["&Type"]!({
                                            localeID2: {
                                                uTF8String: "en-US",
                                            },
                                        }, DER)],
                                        undefined,
                                    ),
                                ],
                            ),
                        ],
                    ),
                ],
            );
            const arg: AddEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                addEntry["&operationCode"]!,
                _encode_AddEntryArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
        }

        // Add description with non-permitted context
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            description["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    utf8("desc2"),
                                    [
                                        new Context(
                                            temporalContext["&id"],
                                            [
                                                _encode_TimeSpecification(new TimeSpecification(
                                                    {
                                                        absolute: new TimeSpecification_time_absolute(
                                                            new Date(),
                                                            undefined,
                                                        ),
                                                    },
                                                    FALSE,
                                                    undefined,
                                                ), DER),
                                            ],
                                            FALSE,
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                ],
                undefined,
            );
            const arg: ModifyEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                modifyEntry["&operationCode"]!,
                _encode_ModifyEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Add description without mandatory context
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            description["&id"],
                            [utf8("desc2")],
                            undefined,
                        ),
                    },
                ],
                undefined,
            );
            const arg: ModifyEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                modifyEntry["&operationCode"]!,
                _encode_ModifyEntryArgument(arg, DER),
            );
            assert("error" in response);
            assert(response.error);
            assert(response.errcode);
            expect(compareCode(response.errcode, attributeError["&errorCode"]!)).toBeTruthy();
            const param = attributeError.decoderFor["&ParameterType"]!(response.error);
            const data = getOptionallyProtectedValue(param);
            expect(data.problems).toHaveLength(1);
            const problem = data.problems[0];
            expect(problem.problem).toBe(AttributeProblem_contextViolation);
            expect(problem.type_.toString()).toBe(description["&id"].toString());
        }

        // Add description that complies
        {
            const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
                {
                    rdnSequence: compliantEntryDN,
                },
                [
                    {
                        addValues: new Attribute(
                            description["&id"],
                            [],
                            [
                                new Attribute_valuesWithContext_Item(
                                    utf8("desc2"),
                                    [
                                        new Context(
                                            languageContext["&id"],
                                            [printable("fr")],
                                            FALSE,
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    },
                ],
                undefined,
            );
            const arg: ModifyEntryArgument = {
                unsigned: reqData,
            };
            const response = await writeOperation(
                connection!,
                modifyEntry["&operationCode"]!,
                _encode_ModifyEntryArgument(arg, DER),
            );
            assert("result" in response);
            assert(response.result);
        }

        // ModifyDN.deleteOldRDN will not be tested, because it will require
        // changes to the name, name form, and DIT structure rules.
    });

    it.todo("Ignores obsolete DIT structure rules");
    it.todo("Ignores obsolete DIT content rules");
    it.todo("Ignores obsolete DIT context use rules");
    it.todo("Ignores obsolete friendships");
    it.todo("Observes subschema friendships"); // This is implicitly tested elsewhere, but good to double-check
    it.todo("Does not enforce DIT structure rules on subentries");
    it.todo("Enforces name forms"); // This is already implicitly tested, but good to double-check
    it.todo("Does not loop infinitely if a DIT structure rule references itself as a superior");
    it.todo("Enforces DIT matching rule use"); // Meerkat DSA will definitely fail this, but just keeping this in view.

});
