import { ASN1Element, FALSE_BIT, TRUE_BIT } from "@wildboar/asn1";
import { DER, _encodePrintableString } from "@wildboar/asn1/functional";
import { IDMConnection } from "@wildboar/idm";
import {
    Attribute,
    AttributeTypeAndValue,
    objectClass,
    AttributeValueAssertion,
} from "@wildboar/x500/InformationFramework";
import * as crypto from "node:crypto";
import type { ResultOrError } from "@wildboar/x500";
import type { Code } from "@wildboar/x500/CommonProtocolSpecification";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
    search,
    SearchArgument,
    _encode_SearchArgument,
    SearchArgumentData,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
    _decode_SearchResult,
    SearchControlOptions,
    SearchControlOptions_includeAllAreas,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    connect,
    createTestRootDN,
    createTestRootNode,
    utf8,
    createEntry,
    oid,
} from "../utils";
import { RelativeDistinguishedName } from "@wildboar/pki-stub";
import { country, person, residentialPerson } from "@wildboar/x500/SelectedObjectClasses";
import {
    commonName,
    stateOrProvinceName,
    countryName,
    localityName,
    surname,
    description,
    postalCode,
    id_mr_zonalMatch,
    id_mr_systemProposedMatch,
    caseExactMatch,
    wordMatch,
} from "@wildboar/x500/SelectedAttributeTypes";
import { MRMapping, RelaxationPolicy, Mapping, MRSubstitution } from "@wildboar/x500/ServiceAdministration";

vi.setConfig({ testTimeout: 30_000 });

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

describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    // Skipped because this depends upon a dataset being loaded, so this won't
    // pass in CI/CD environments.
    test.skip("zonal matching works", async () => {
        const testId = `zonal-matching-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId);
        }
        const dn = createTestRootDN(testId);
        const us_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                countryName["&id"],
                _encodePrintableString("US", DER),
            ),
        ];
        const person_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                _encodePrintableString("Goobis BoBoobis", DER),
            ),
        ];
        await createEntry(connection!, dn, us_rdn, [
            new Attribute(
                objectClass["&id"],
                [oid(country["&id"])],
            ),
            new Attribute(
                countryName["&id"],
                [_encodePrintableString("US", DER)],
            ),
        ]);
        await createEntry(connection!, [...dn, us_rdn], person_rdn, [
            new Attribute(
                objectClass["&id"],
                [
                    oid(person["&id"]),
                    oid(residentialPerson["&id"]),
                ],
            ),
            new Attribute(
                commonName["&id"],
                [_encodePrintableString("Goobis BoBoobis", DER)],
            ),
            new Attribute(
                surname["&id"],
                [_encodePrintableString("BoBoobis", DER)],
            ),
            new Attribute(
                stateOrProvinceName["&id"],
                [utf8("FL")],
            ),
            new Attribute(
                localityName["&id"],
                [utf8("Lutz")],
            ),
            new Attribute(
                postalCode["&id"],
                [utf8("33549")],
            ),
        ]);
        const sco: SearchControlOptions = new Uint8ClampedArray(12);
        sco[SearchControlOptions_includeAllAreas] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: [...dn, us_rdn],
            },
            SearchArgumentData_subset_oneLevel,
            /* In the absence of zonal matching this filter should NOT match the
            entry we created, but because of zonal matching, the localityName
            assertion should get converted to a postal code assertion. */
            {
                and: [
                    // {
                    //     item: {
                    //         equality: new AttributeValueAssertion(
                    //             countryName["&id"],
                    //             _encodePrintableString("US", DER),
                    //         ),
                    //     },
                    // },
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                stateOrProvinceName["&id"],
                                utf8("FL"),
                            ),
                        },
                    },
                    {
                        item: {
                            equality: new AttributeValueAssertion(
                                localityName["&id"],
                                utf8("Tampa"),
                            ),
                        },
                    },
                ],
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                new MRMapping(
                    [new Mapping(
                        id_mr_zonalMatch,
                        9,
                    )],
                    undefined,
                ),
                undefined,
                undefined,
                1,
                1,
            ),
            undefined,
            undefined,
            sco,
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

    test("matching rule substitution works", async () => {
        const testId = `matching-rule-substitution-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("Google audio recording agent installed in your smart toaster (you hereby agree to be monitored)")],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("recording"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                new MRMapping(
                    undefined,
                    [
                        new MRSubstitution(
                            description["&id"],
                            undefined,
                            wordMatch["&id"],
                        ),
                    ],
                ),
                undefined,
                undefined,
                1,
                1,
            ),
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

    test("systemPropopsedMatch matching rule substitution works", async () => {
        const testId = `system-proposed-match-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("Google audio recording agent installed in your smart toaster (you hereby agree to be monitored)")],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("recording"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                new MRMapping(
                    undefined,
                    [
                        new MRSubstitution(
                            description["&id"],
                            undefined,
                            id_mr_systemProposedMatch,
                        ),
                    ],
                ),
                undefined,
                undefined,
                1,
                1,
            ),
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


    test("relaxation works", async () => {
        const testId = `relaxation-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("Google audio recording agent installed in your smart toaster (you hereby agree to be monitored)")],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_baseObject,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("recording"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                undefined,
                undefined,
                [
                    new MRMapping(
                        undefined,
                        [
                            new MRSubstitution(
                                description["&id"],
                                undefined,
                                id_mr_systemProposedMatch,
                            ),
                        ],
                    ),
                ],
                1,
                1,
            ),
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

    /**
     * This creates two entries whose `description` value differs only in
     * casing. The default matching rule for `description` (`caseIgnoreMatch`)
     * is case-insensitive, so both should match at first. Then, after
     * tightening is applied, only the one whose casing matching should be
     * returned.
     */
    test("tightening works", async () => {
        const testId = `tightening-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("Deprecated")],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const us_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                countryName["&id"],
                _encodePrintableString("US", DER),
            ),
        ];
        await createEntry(connection!, dn, us_rdn, [
            new Attribute(
                objectClass["&id"],
                [oid(country["&id"])],
            ),
            new Attribute(
                countryName["&id"],
                [_encodePrintableString("US", DER)],
            ),
            new Attribute(
                description["&id"],
                [_encodePrintableString("DEPRECATED", DER)],
            ),
        ]);
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("Deprecated"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                undefined,
                [
                    new MRMapping(
                        undefined,
                        [
                            new MRSubstitution(
                                description["&id"],
                                undefined,
                                // id_mr_systemProposedMatch,
                                caseExactMatch["&id"],
                            ),
                        ],
                    ),
                ],
                undefined,
                1,
                1,
            ),
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

    /**
     * UPDATE: When I wrote this test, I made the mistake of making
     * exclusive relaxation apply for both substitution and mapping-based
     * relaxation. I fixed this bug, but the test is still wrong.
     *
     * In this test, we initially assert a value of `description` that will only
     * match the root node, but we provide a relaxation policy that requests at
     * least 3 results and suggests the system-proposed relaxation (in the case
     * of Meerkat DSA, this is `wordMatch`). After re-evaluation, this should
     * match all three entries and _return all three_ because we set
     * `includeAllAreas` to true.
     */
    test.skip("includeAllAreas=TRUE works", async () => {
        const testId = `includeAllAreas-true-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("Red")],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const us_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                countryName["&id"],
                _encodePrintableString("US", DER),
            ),
        ];
        const de_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                countryName["&id"],
                _encodePrintableString("DE", DER),
            ),
        ];
        await createEntry(connection!, dn, us_rdn, [
            new Attribute(
                objectClass["&id"],
                [oid(country["&id"])],
            ),
            new Attribute(
                countryName["&id"],
                [_encodePrintableString("US", DER)],
            ),
            new Attribute(
                description["&id"],
                [_encodePrintableString("Beward of the red menace", DER)],
            ),
        ]);
        await createEntry(connection!, dn, de_rdn, [
            new Attribute(
                objectClass["&id"],
                [oid(country["&id"])],
            ),
            new Attribute(
                countryName["&id"],
                [_encodePrintableString("DE", DER)],
            ),
            new Attribute(
                description["&id"],
                [_encodePrintableString("Our flag colors are black, red, and gold", DER)],
            ),
        ]);
        const sco: SearchControlOptions = new Uint8ClampedArray(12);
        sco[SearchControlOptions_includeAllAreas] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("red"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                undefined,
                undefined,
                [
                    new MRMapping(
                        undefined,
                        [
                            new MRSubstitution(
                                description["&id"],
                                undefined,
                                id_mr_systemProposedMatch,
                            ),
                        ],
                    ),
                ],
                undefined,
                3,
            ),
            undefined,
            undefined,
            sco,
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

    /**
     * UPDATE: I broke this test. When I wrote it, I made the mistake of making
     * exclusive relaxation apply for both substitution and mapping-based
     * relaxation. I fixed this bug, but now the test is broken.
     *
     * In this test, we initially assert a value of `description` that will only
     * match the root node, but we provide a relaxation policy that requests at
     * least 3 results and suggests the system-proposed relaxation (in the case
     * of Meerkat DSA, this is `wordMatch`). After re-evaluation, this should
     * match all three entries but return only the two returned from the
     * relaxed iteration (excluding the first returned from the first pass of
     * the search) because we set `includeAllAreas` to `FALSE`.
     */
    test.skip("includeAllAreas=FALSE works", async () => {
        const testId = `includeAllAreas-false-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, [
                new Attribute(
                    description["&id"],
                    [utf8("Red")],
                ),
            ]);
        }
        const dn = createTestRootDN(testId);
        const us_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                countryName["&id"],
                _encodePrintableString("US", DER),
            ),
        ];
        const de_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                countryName["&id"],
                _encodePrintableString("DE", DER),
            ),
        ];
        await createEntry(connection!, dn, us_rdn, [
            new Attribute(
                objectClass["&id"],
                [oid(country["&id"])],
            ),
            new Attribute(
                countryName["&id"],
                [_encodePrintableString("US", DER)],
            ),
            new Attribute(
                description["&id"],
                [_encodePrintableString("Flag colors: red, white and blue", DER)],
            ),
        ]);
        await createEntry(connection!, dn, de_rdn, [
            new Attribute(
                objectClass["&id"],
                [oid(country["&id"])],
            ),
            new Attribute(
                countryName["&id"],
                [_encodePrintableString("DE", DER)],
            ),
            new Attribute(
                description["&id"],
                [_encodePrintableString("Flag colors: black, red, and gold", DER)],
            ),
        ]);
        const sco: SearchControlOptions = new Uint8ClampedArray(12);
        sco[SearchControlOptions_includeAllAreas] = FALSE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_wholeSubtree,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("red"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            new RelaxationPolicy(
                undefined,
                undefined,
                [
                    new MRMapping(
                        undefined,
                        [
                            new MRSubstitution(
                                description["&id"],
                                undefined,
                                id_mr_systemProposedMatch,
                            ),
                        ],
                    ),
                ],
                undefined,
                2,
            ),
            undefined,
            undefined,
            sco,
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

    test.todo("multiple tightenings");
    test.todo("multiple relaxations");
});
