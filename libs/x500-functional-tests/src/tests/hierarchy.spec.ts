import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
    BIT_STRING,
} from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    IDMConnection,
} from "@wildboar/idm";
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
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_baseObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
    connect,
    createTestNode,
    createTestRootDN,
    createTestRootNode,
    utf8,
} from "../utils";
import {
    HierarchySelections_all,
    HierarchySelections_children,
    HierarchySelections_hierarchy,
    HierarchySelections_parent,
    HierarchySelections_self,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblings,
    HierarchySelections_siblingSubtree,
    HierarchySelections_subtree,
    HierarchySelections_top,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";

jest.setTimeout(30000);

const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(Array(9).fill(FALSE_BIT));
// Necessary to make countries administrative points.
serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;

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

/**
 * @summary Create a somewhat complex hierarchical group for testing.
 * @description
 *
 * Creates a hierarchical group that is structured like so:
 *
 * ```text
 * CN=Root (of the test subtree)
 *     CN=Root,CN=A1
 *         CN=Root,CN=A1,CN=B1
 *         CN=Root,CN=A1,CN=B2
 *         CN=Root,CN=A1,CN=B3
 *     CN=Root,CN=A2
 *     CN=Root,CN=A3
 *         CN=Root,CN=A3,CN=C1
 *             CN=Root,CN=A3,CN=C2
 *                 CN=Root,CN=A3,CN=C3
 * ```
 *
 * @param conn The IDM connection
 * @param dn The distinguished name that lies at the root of the hierarchical group.
 */
async function createTestHierarchy (conn: IDMConnection, dn: DistinguishedName): Promise<void> {
    const subordinates1: string[] = [ "A1", "A2", "A3" ];
    const subordinates2: string[] = [ "B1", "B2", "B3" ];
    const subordinates3: string[] = [ "C1", "C2", "C3" ];

    for (const subordinate_id of subordinates1) {
        await createTestNode(conn, dn, subordinate_id, [
            new Attribute(
                hierarchyParent["&id"],
                [hierarchyParent.encoderFor["&Type"]!(dn, DER)],
            ),
        ]);
    }

    const db_b: DistinguishedName = [
        ...dn,
        [
            new AttributeTypeAndValue(
                commonName["&id"]!,
                utf8("A1"),
            ),
        ],
    ];
    const db_c: DistinguishedName = [
        ...dn,
        [
            new AttributeTypeAndValue(
                commonName["&id"]!,
                utf8("A3"),
            ),
        ],
    ];
    for (const subordinate_id of subordinates2) {
        await createTestNode(conn, dn, subordinate_id, [
            new Attribute(
                hierarchyParent["&id"],
                [hierarchyParent.encoderFor["&Type"]!(db_b, DER)],
            ),
        ]);
    }
    // let previous_id: string | undefined;
    let parentDN: DistinguishedName = db_c;
    for (const subordinate_id of subordinates3) {
        await createTestNode(conn, dn, subordinate_id, [
            new Attribute(
                hierarchyParent["&id"],
                [hierarchyParent.encoderFor["&Type"]!(parentDN, DER)],
            ),
        ]);
        parentDN = [
            ...dn,
            [
                new AttributeTypeAndValue(
                    commonName["&id"]!,
                    utf8(subordinate_id),
                ),
            ],
        ];
    }
}

// TODO: You also need to test deduplication.
describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    test("hierarchy selection 'self' works", async () => {
        const testId = `hierarchy-self-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    hierarchyParent["&id"],
                    [hierarchyParent.encoderFor["&Type"]!(dn, DER)],
                ),
            ]);
        }
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_self] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'children' works", async () => {
        const testId = `hierarchy-children-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinates = [
            "E338ECE9-0100-4499-BEEE-2F3F766B669C",
            "837DF269-2A2A-47E6-BA19-3FC65D5D3FA7",
            "6AF6F47F-8432-4CBE-9F2F-7C8C56D4F70A",
        ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    hierarchyParent["&id"],
                    [hierarchyParent.encoderFor["&Type"]!(dn, DER)],
                ),
            ]);
        }
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_children] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(3);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'parent' works", async () => {
        const testId = `hierarchy-parent-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinates = [
            "1",
            "2",
            "3",
        ];
        let previous_id: string | undefined;
        for (const subordinate_id of subordinates) {
            const parentDN: DistinguishedName = previous_id
                ? [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8(previous_id),
                        ),
                    ],
                ]
                : dn;
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    hierarchyParent["&id"],
                    [hierarchyParent.encoderFor["&Type"]!(parentDN, DER)],
                ),
            ]);
            previous_id = subordinate_id;
        }
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_parent] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8("2"),
                        ),
                    ],
                ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'hierarchy' works", async () => {
        const testId = `hierarchy-hierarchy-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinates = [
            "1",
            "2",
            "3",
        ];
        let previous_id: string | undefined;
        for (const subordinate_id of subordinates) {
            const parentDN: DistinguishedName = previous_id
                ? [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8(previous_id),
                        ),
                    ],
                ]
                : dn;
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    hierarchyParent["&id"],
                    [hierarchyParent.encoderFor["&Type"]!(parentDN, DER)],
                ),
            ]);
            previous_id = subordinate_id;
        }
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_hierarchy] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8("2"),
                        ),
                    ],
                ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(2);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'top' works", async () => {
        const testId = `hierarchy-top-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const subordinates = [
            "1",
            "2",
            "3",
        ];
        let previous_id: string | undefined;
        for (const subordinate_id of subordinates) {
            const parentDN: DistinguishedName = previous_id
                ? [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8(previous_id),
                        ),
                    ],
                ]
                : dn;
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    hierarchyParent["&id"],
                    [hierarchyParent.encoderFor["&Type"]!(parentDN, DER)],
                ),
            ]);
            previous_id = subordinate_id;
        }
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_top] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8("2"),
                        ),
                    ],
                ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(1);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'subtree' works", async () => {
        const testId = `hierarchy-subtree-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        await createTestHierarchy(connection!, dn);
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_subtree] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(10);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'siblings' works", async () => {
        const testId = `hierarchy-siblings-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        await createTestHierarchy(connection!, dn);
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_siblings] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8("A2"),
                        ),
                    ],
                ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(2);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'siblingChildren' works", async () => {
        const testId = `hierarchy-siblingChildren-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        await createTestHierarchy(connection!, dn);
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_siblingChildren] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8("A2"),
                        ),
                    ],
                ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(4);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'siblingSubtree' works", async () => {
        const testId = `hierarchy-siblingSubtree-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        await createTestHierarchy(connection!, dn);
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_siblingSubtree] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8("A2"),
                        ),
                    ],
                ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(6);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("hierarchy selection 'all' works", async () => {
        const testId = `hierarchy-all-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        await createTestHierarchy(connection!, dn);
        const hs: BIT_STRING = new Uint8ClampedArray(10);
        hs[HierarchySelections_all] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [
                    ...dn,
                    [
                        new AttributeTypeAndValue(
                            commonName["&id"]!,
                            utf8("C3"),
                        ),
                    ],
                ],
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            hs,
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        if ("result" in result && result.result) {
            const decoded = _decode_SearchResult(result.result);
            const resData = getOptionallyProtectedValue(decoded);
            if ("searchInfo" in resData) {
                expect(resData.searchInfo.entries.length).toBe(10);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

});
