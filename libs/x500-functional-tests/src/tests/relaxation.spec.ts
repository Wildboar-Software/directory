import {
    ASN1Element,
    FALSE_BIT,
    TRUE_BIT,
} from "asn1-ts";
import { DER, _encodePrintableString } from "asn1-ts/dist/node/functional";
import { strict as assert } from "node:assert";
import {
    IDMConnection,
} from "@wildboar/idm";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta.js";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta.js";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa.js";
import * as crypto from "crypto";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import {
    ServiceControlOptions,
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta.js";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta.js";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa.js";
import {
    SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta.js";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta.js";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta.js";
import {
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta.js";
import {
    connect,
    createTestRootDN,
    createTestRootNode,
    utf8,
    createEntry,
    oid,
} from "../utils";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta.js";
import { countryName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/countryName.oa.js";
import { description, person, surname } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/person.oa.js";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa.js";
import { country } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/country.oa.js";
import { stateOrProvinceName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/stateOrProvinceName.oa.js";
import { localityName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localityName.oa.js";
import { postalCode } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/postalCode.oa.js";
import { residentialPerson } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/residentialPerson.oa.js";
import { MRMapping, RelaxationPolicy } from "@wildboar/x500/src/lib/modules/ServiceAdministration/RelaxationPolicy.ta.js";
import { Mapping } from "@wildboar/x500/src/lib/modules/ServiceAdministration/Mapping.ta.js";
import { id_mr_zonalMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-mr-zonalMatch.va.js";
import { AttributeValueAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta.js";
import { MRSubstitution } from "@wildboar/x500/src/lib/modules/ServiceAdministration/MRSubstitution.ta.js";
import { wordMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/wordMatch.oa.js";
import { id_mr_systemProposedMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-mr-systemProposedMatch.va.js";
import { caseExactMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseExactMatch.oa.js";
import { SearchControlOptions, SearchControlOptions_includeAllAreas } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta.js";
import { describe, it, before } from "node:test";

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

describe("Meerkat DSA", { timeout: 30000 }, async (t) => {
    let connection: IDMConnection | undefined;

    before(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    // Skipped because this depends upon a dataset being loaded, so this won't
    // pass in CI/CD environments.
    it.skip("zonal matching works", async () => {
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
                assert.strictEqual(resData.searchInfo.entries.length, 1);
            } else {
                assert.fail();
            }
        } else {
            assert.fail();
        }
    });

    it("matching rule substitution works", async () => {
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
                assert.strictEqual(resData.searchInfo.entries.length, 1);
            } else {
                assert.fail();
            }
        } else {
            assert.fail();
        }
    });

    it("systemPropopsedMatch matching rule substitution works", async () => {
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
                assert.strictEqual(resData.searchInfo.entries.length, 1);
            } else {
                assert.fail();
            }
        } else {
            assert.fail();
        }
    });


    it("relaxation works", async () => {
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
                assert.strictEqual(resData.searchInfo.entries.length, 1);
            } else {
                assert.fail();
            }
        } else {
            assert.fail();
        }
    });

    /**
     * This creates two entries whose `description` value differs only in
     * casing. The default matching rule for `description` (`caseIgnoreMatch`)
     * is case-insensitive, so both should match at first. Then, after
     * tightening is applied, only the one whose casing matching should be
     * returned.
     */
    it("tightening works", async () => {
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
                assert.strictEqual(resData.searchInfo.entries.length, 1);
            } else {
                assert.fail();
            }
        } else {
            assert.fail();
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
    it.skip("includeAllAreas=TRUE works", async () => {
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
                assert.strictEqual(resData.searchInfo.entries.length, 3);
            } else {
                assert.fail();
            }
        } else {
            assert.fail();
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
    it.skip("includeAllAreas=FALSE works", async () => {
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
                assert.strictEqual(resData.searchInfo.entries.length, 2);
            } else {
                assert.fail();
            }
        } else {
            assert.fail();
        }
    });

    it.todo("multiple tightenings");
    it.todo("multiple relaxations");
});
