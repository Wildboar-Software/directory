import {
    ASN1Element,
    FALSE_BIT,
    ObjectIdentifier,
    TRUE,
    TRUE_BIT,
} from "asn1-ts";
import { DER, _encodePrintableString } from "asn1-ts/dist/node/functional";
import {
    IDMConnection,
} from "@wildboar/idm";
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
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import {
    connect,
    createTestNode,
    createTestRootDN,
    createTestRootNode,
    createCompoundEntry,
    utf8,
    createEntry,
    oid,
} from "../utils";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import { commonName } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import { Attribute } from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { searchRules } from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";
import { ControlOptions, EntryLimit, FamilyGrouping_compoundEntry, ImposedSubset_baseObject, RelaxationPolicy, RequestAttribute, ResultAttribute, SearchRuleDescription } from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { subentry, subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import { serviceAdminSubentry } from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import { SubtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import { AttributeValueAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { applicationProcess, description, organizationalUnitName } from "@wildboar/x500/src/lib/modules/SelectedObjectClasses/applicationProcess.oa";
import { EntryInformationSelection, FamilyReturn } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { ServiceControls } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import { FamilyReturn_memberSelect_compoundEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn-memberSelect.ta";
import { family_information } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/family-information.oa";
import { strict as assert } from "node:assert";
import { MRMapping, MRSubstitution } from "@wildboar/x500/src/lib/modules/ServiceAdministration/MRMapping.ta";
import { id_mr_systemProposedMatch } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/id-mr-systemProposedMatch.va";
import { SearchControlOptions, SearchControlOptions_noSystemRelaxation, SearchControlOptions_useSubset } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import { Context } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Context.ta";
import { ContextProfile } from "@wildboar/x500/src/lib/modules/ServiceAdministration/ContextProfile.ta";
import { languageContext } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/languageContext.oa";
import { ContextAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/ContextAssertion.ta";
import { localeContext } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/localeContext.oa";
import { name } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/name.oa";
import { Attribute_valuesWithContext_Item } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute-valuesWithContext-Item.ta";
import { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { RequestAttribute_defaultValues_Item } from "@wildboar/x500/src/lib/modules/ServiceAdministration/RequestAttribute-defaultValues-Item.ta";

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

describe("Meerkat DSA", () => {

    let connection: IDMConnection | undefined;

    beforeEach(async () => {
        if (!connection) {
            connection = await connect();
        }
    });

    test("search rules can allow certain searches", async () => {
        const testId = `search-rule-allowed-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
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
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        { // Try request that should be prohibited
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_wholeSubtree,
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            expect("error" in result);
        }

        { // Try a request that should be allowed
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
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
        }
    });

    test("search rules can allow certain searches based on filter attributes", async () => {
        const testId = `search-rule-filter-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        { // Try request that should be prohibited
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            objectClass["&id"],
                            oid(applicationProcess["&id"]),
                            undefined,
                        ),
                    },
                },
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            expect("error" in result);
        }

        { // Try a request that should be allowed
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8("B"),
                            undefined,
                        ),
                    },
                },
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
        }
    });

    test("search rules can allow certain searches based on attribute combinations", async () => {
        const testId = `search-rule-attr-combo-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                                new RequestAttribute(
                                    objectClass["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            {
                                and: [
                                    {
                                        attribute: commonName["&id"],
                                    },
                                    {
                                        attribute: objectClass["&id"],
                                    },
                                ],
                            },
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        { // Try request that should be prohibited
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            objectClass["&id"],
                            oid(applicationProcess["&id"]),
                            undefined,
                        ),
                    },
                },
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            expect("error" in result);
        }

        { // Try a request that should be allowed
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    and: [
                        {
                            item: {
                                equality: new AttributeValueAssertion(
                                    commonName["&id"],
                                    utf8("B"),
                                    undefined,
                                ),
                            },
                        },
                        {
                            item: {
                                equality: new AttributeValueAssertion(
                                    objectClass["&id"],
                                    oid(applicationProcess["&id"]),
                                    undefined,
                                ),
                            },
                        },
                    ],
                },
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
        }
    });

    test("search rules can limit the returned attribute types", async () => {
        const testId = `search-rule-output-attr-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            undefined,
                            undefined,
                            [
                                new ResultAttribute(commonName["&id"]),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
            undefined,
            undefined,
            new EntryInformationSelection(
                {
                    select: [
                        objectClass["&id"],
                        commonName["&id"],
                    ],
                },
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
                expect(resData.searchInfo.entries.length).toBe(3);
                for (const entry of resData.searchInfo.entries) {
                    const infos = entry.information ?? [];
                    for (const info of infos) {
                        if ("attributeType" in info) {
                            expect(false).toBeTruthy();
                        } else if ("attribute" in info) {
                            expect(info.attribute.type_.isEqualTo(commonName["&id"]));
                        }
                    }
                }
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("search rules can set default controls", async () => {
        const testId = `search-rule-default-controls-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            undefined,
                            undefined,
                            undefined,
                            new ControlOptions(
                                new Uint8ClampedArray([
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    TRUE_BIT, // subentries
                                ]),
                                undefined,
                                undefined,
                            ),
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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

    test("search rules can require mandatory controls", async () => {
        const testId = `search-rule-mandatory-controls-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            undefined,
                            undefined,
                            undefined,
                            new ControlOptions(
                                new Uint8ClampedArray([
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    TRUE_BIT, // subentries
                                ]),
                                undefined,
                                undefined,
                            ),
                            new ControlOptions(
                                new Uint8ClampedArray([
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    TRUE_BIT, // subentries
                                ]),
                                undefined,
                                undefined,
                            ),
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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
            undefined,
            undefined,
            undefined,
            undefined,
            new ServiceControls(
                new Uint8ClampedArray(),
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
        expect("error" in result);
    });

    test("search rules can override controls", async () => {
        const testId = `search-rule-override-controls-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            undefined,
                            undefined,
                            undefined,
                            new ControlOptions(
                                new Uint8ClampedArray([
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    TRUE_BIT, // subentries
                                ]),
                                undefined,
                                undefined,
                            ),
                            undefined,
                            new ControlOptions(
                                new Uint8ClampedArray([
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    FALSE_BIT,
                                    TRUE_BIT, // subentries
                                ]),
                                undefined,
                                undefined,
                            ),
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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
            undefined,
            undefined,
            undefined,
            undefined,
            new ServiceControls(
                new Uint8ClampedArray(),
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
                expect(resData.searchInfo.entries.length).toBe(2);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("search rules can override the family return member select", async () => {
        const testId = `search-rule-member-select-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new FamilyReturn(
                                FamilyReturn_memberSelect_compoundEntry,
                            ),
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        await createCompoundEntry(connection!, dn);

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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
                const entry = resData.searchInfo.entries[0];
                const infos = entry.information ?? [];
                const family_info = infos
                    .find((i) => ("attribute" in i) && i.attribute.type_.isEqualTo(family_information["&id"]));
                assert(family_info);
                assert("attribute" in family_info);
                expect(family_info.attribute.values).toHaveLength(3);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("search rules can override the family grouping", async () => {
        const testId = `search-rule-family-grouping-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [ // We need this so we can have a filter.
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            FamilyGrouping_compoundEntry,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        await createCompoundEntry(connection!, dn);

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
            {
                item: {
                    /* This should match one of the entries in the compound
                    entry. Because the search rule sets FamilyGrouping to
                    compoundEntry, the whole compound entry will match. */
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        utf8("Chief Pain Officer Jonathan Wilbur"),
                    ),
                },
            },
            undefined,
            new EntryInformationSelection(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                new FamilyReturn(
                    FamilyReturn_memberSelect_compoundEntry,
                ),
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
                const entry = resData.searchInfo.entries[0];
                const infos = entry.information ?? [];
                const family_info = infos
                    .find((i) => ("attribute" in i) && i.attribute.type_.isEqualTo(family_information["&id"]));
                assert(family_info);
                assert("attribute" in family_info);
                expect(family_info.attribute.values).toHaveLength(3);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("search rules can affect relaxation", async () => {
        const testId = `search-rule-relaxation-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [ // We need this so we can have a filter.
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
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
                                            commonName["&id"],
                                            undefined,
                                            id_mr_systemProposedMatch,
                                        ),
                                    ],
                                ),
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                            ),
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
            {
                item: {
                    /* This wouldn't normally match, but because the search rule
                    specifies a base relaxation that changes the matching rule
                    for commonName, this should match. Note that this will only
                    work for Meerkat DSA, where the systemProposedMatch for
                    commonName is wordMatch. */
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        utf8("Green"),
                    ),
                },
            },
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

    test("search rules can affect imposedSubset", async () => {
        const testId = `search-rule-imposedSubset-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
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
                            undefined,
                            ImposedSubset_baseObject,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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

    test("search rules can affect the default entry limit", async () => {
        const testId = `search-rule-entry-limit-default-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
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
                            undefined,
                            undefined,
                            new EntryLimit(
                                1,
                                2,
                            ),
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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

    test("search rules can affect the max entry limit", async () => {
        const testId = `search-rule-entry-limit-max-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
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
                            undefined,
                            undefined,
                            new EntryLimit(
                                1,
                                2,
                            ),
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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
            undefined,
            undefined,
            undefined,
            undefined,
            new ServiceControls(
                undefined,
                undefined,
                undefined,
                4,
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
                expect(resData.searchInfo.entries.length).toBe(2);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("useSubset search control option overrides a search rule's imposed subset", async () => {
        const testId = `search-rule-useSubset-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
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
                            undefined,
                            ImposedSubset_baseObject,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const sco: SearchControlOptions = new Uint8ClampedArray(12);
        sco[SearchControlOptions_useSubset] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
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

    test("noSystemRelaxation search control option can disable search rule relaxation", async () => {
        const testId = `search-rule-relaxation-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [ // We need this so we can have a filter.
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
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
                                                commonName["&id"],
                                                undefined,
                                                id_mr_systemProposedMatch,
                                            ),
                                        ],
                                    ),
                                ],
                                undefined,
                                undefined,
                                undefined,
                            ),
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const sco: SearchControlOptions = new Uint8ClampedArray(12);
        sco[SearchControlOptions_noSystemRelaxation] = TRUE_BIT;
        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
            {
                item: {
                    /* This wouldn't normally match, but because the search rule
                    specifies a base relaxation that changes the matching rule
                    for commonName, this should match. Note that this will only
                    work for Meerkat DSA, where the systemProposedMatch for
                    commonName is wordMatch. */
                    equality: new AttributeValueAssertion(
                        commonName["&id"],
                        utf8("Green"),
                    ),
                },
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
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
                expect(resData.searchInfo.entries.length).toBe(0);
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("search rules can limit returned values via matchedValuesOnly", async () => {
        const testId = `search-rule-matchedValuesOnly-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [ // We need this so we can have a filter.
                                new RequestAttribute(
                                    description["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            [
                                new ResultAttribute(
                                    description["&id"],
                                    {
                                        matchedValuesOnly: null,
                                    },
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    description["&id"],
                    [
                        utf8(subordinate_id),
                        utf8(`Description for ${subordinate_id}`),
                    ],
                ),
            ]);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("Lazy Frog"),
                    ),
                },
            },
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
                const entry = resData.searchInfo.entries[0];
                assert(entry.information);
                expect(entry.information).toHaveLength(1);
                const desc_info = entry.information[0];
                assert(desc_info);
                assert("attribute" in desc_info);
                const desc_attr = desc_info.attribute;
                assert(!desc_attr.valuesWithContext?.length);
                expect(desc_attr.values).toHaveLength(1);
                const value = desc_attr.values[0];
                expect(value.utf8String).toBe("Lazy Frog");
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("search rules can limit returned values via selectedValues", async () => {
        const testId = `search-rule-selectedValues-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [ // We need this so we can have a filter.
                                new RequestAttribute(
                                    description["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            [
                                new ResultAttribute(
                                    description["&id"],
                                    {
                                        selectedValues: [
                                            utf8("Description for Lazy Frog"),
                                        ],
                                    },
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "Very Large Hippo", "Lazy Frog", "Little Green Elephant" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id, [
                new Attribute(
                    description["&id"],
                    [
                        utf8(subordinate_id),
                        utf8(`Description for ${subordinate_id}`),
                    ],
                ),
            ]);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        description["&id"],
                        utf8("Lazy Frog"),
                    ),
                },
            },
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
                const entry = resData.searchInfo.entries[0];
                assert(entry.information);
                expect(entry.information).toHaveLength(1);
                const desc_info = entry.information[0];
                assert(desc_info);
                assert("attribute" in desc_info);
                const desc_attr = desc_info.attribute;
                assert(!desc_attr.valuesWithContext?.length);
                expect(desc_attr.values).toHaveLength(1);
                const value = desc_attr.values[0];
                expect(value.utf8String).toBe("Description for Lazy Frog");
            } else {
                expect(false).toBeFalsy();
            }
        } else {
            expect(false).toBeTruthy();
        }
    });

    test("search rules can allow certain searches based on filter item context types", async () => {
        const testId = `search-rule-request-contexts-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    [
                                        new ContextProfile(
                                            languageContext["&id"],
                                        ),
                                    ],
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        { // Try request that should be prohibited
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            objectClass["&id"],
                            oid(applicationProcess["&id"]),
                            {
                                selectedContexts: [
                                    new ContextAssertion(
                                        localeContext["&id"],
                                        [
                                            localeContext.encoderFor["&Type"]!({
                                                localeID1: new ObjectIdentifier([ 2, 5, 234, 20 ]),
                                            }, DER),
                                        ],
                                    ),
                                ],
                            },
                        ),
                    },
                },
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            expect("error" in result);
        }

        { // Try a request that should be allowed
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8("B"),
                            {
                                selectedContexts: [
                                    new ContextAssertion(
                                        languageContext["&id"],
                                        [
                                            languageContext.encoderFor["&Type"]!("en", DER),
                                        ],
                                    ),
                                ],
                            },
                        ),
                    },
                },
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
        }
    });

    test("search rules can allow certain searches based on filter item context values", async () => {
        const testId = `search-rule-request-context-values-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    [
                                        new ContextProfile(
                                            languageContext["&id"],
                                            [
                                                languageContext.encoderFor["&Type"]!("en", DER),
                                            ],
                                        ),
                                    ],
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        { // Try request that should be prohibited
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            objectClass["&id"],
                            oid(applicationProcess["&id"]),
                            {
                                selectedContexts: [
                                    new ContextAssertion(
                                        languageContext["&id"],
                                        [
                                            languageContext.encoderFor["&Type"]!("fr", DER),
                                        ],
                                    ),
                                ],
                            },
                        ),
                    },
                },
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            expect("error" in result);
        }

        { // Try a request that should be allowed
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8("B"),
                            {
                                selectedContexts: [
                                    new ContextAssertion(
                                        languageContext["&id"],
                                        [
                                            languageContext.encoderFor["&Type"]!("en", DER),
                                        ],
                                    ),
                                ],
                            },
                        ),
                    },
                },
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
        }
    });

    test("search rules can allow certain searches based on filter item context combinations", async () => {
        const testId = `search-rule-request-context-combo-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [
                                new RequestAttribute(
                                    commonName["&id"],
                                    undefined,
                                    undefined,
                                    undefined,
                                    [
                                        new ContextProfile(
                                            languageContext["&id"],
                                            [
                                                languageContext.encoderFor["&Type"]!("en", DER),
                                            ],
                                        ),
                                        new ContextProfile(
                                            localeContext["&id"],
                                        ),
                                    ],
                                    {
                                        and: [
                                            {
                                                context: languageContext["&id"],
                                            },
                                            {
                                                context: localeContext["&id"],
                                            },
                                        ],
                                    },
                                    undefined,
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        { // Try request that should be prohibited
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            objectClass["&id"],
                            oid(applicationProcess["&id"]),
                            {
                                selectedContexts: [
                                    new ContextAssertion(
                                        languageContext["&id"],
                                        [
                                            languageContext.encoderFor["&Type"]!("fr", DER),
                                        ],
                                    ),
                                ],
                            },
                        ),
                    },
                },
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            expect("error" in result);
        }

        { // Try a request that should be allowed
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8("B"),
                            {
                                selectedContexts: [
                                    new ContextAssertion(
                                        languageContext["&id"],
                                        [
                                            languageContext.encoderFor["&Type"]!("en", DER),
                                        ],
                                    ),
                                    new ContextAssertion(
                                        localeContext["&id"],
                                        [
                                            localeContext.encoderFor["&Type"]!({
                                                localeID1: new ObjectIdentifier([ 2, 5, 423, 30 ]),
                                            }, DER),
                                        ],
                                    ),
                                ],
                            },
                        ),
                    },
                },
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
        }
    });

    test("search rules can allow certain searches based on filter attribute subtypes", async () => {
        const testId = `search-rule-filter-subtypes-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [
                                new RequestAttribute(
                                    name["&id"],
                                    true,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        { // Try request that should be prohibited
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            objectClass["&id"],
                            oid(applicationProcess["&id"]),
                            undefined,
                        ),
                    },
                },
            );
            const arg: SearchArgument = {
                unsigned: reqData,
            };
            const result = await writeOperation(
                connection!,
                search["&operationCode"]!,
                _encode_SearchArgument(arg, DER),
            );
            expect("error" in result);
        }

        { // Try a request that should be allowed
            const reqData: SearchArgumentData = new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_oneLevel,
                {
                    item: {
                        equality: new AttributeValueAssertion(
                            commonName["&id"],
                            utf8("B"),
                            undefined,
                        ),
                    },
                },
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
        }
    });

    test("search rules can limit the returned contexts", async () => {
        const testId = `search-rule-output-context-types-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            undefined,
                            undefined,
                            [
                                new ResultAttribute(
                                    organizationalUnitName["&id"],
                                    undefined,
                                    [
                                        new ContextProfile(
                                            languageContext["&id"],
                                        ),
                                    ],
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinateRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("A"),
            ),
        ];
        const subordinateDN: DistinguishedName = [ ...dn, subordinateRDN ];
        await createTestNode(connection!, dn, "A", [
            new Attribute(
                organizationalUnitName["&id"],
                [],
                [
                    new Attribute_valuesWithContext_Item(
                        utf8("Area 51"),
                        [
                            new Context(
                                languageContext["&id"],
                                [_encodePrintableString("en", DER)],
                            ),
                            new Context(
                                localeContext["&id"],
                                [
                                    localeContext.encoderFor["&Type"]!({
                                        localeID1: new ObjectIdentifier([ 2, 5, 42, 23 ]),
                                    }, DER),
                                ],
                            ),
                        ],
                    ),
                ],
            ),
        ]);

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: subordinateDN,
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            new EntryInformationSelection(
                {
                    select: [
                        organizationalUnitName["&id"],
                    ],
                },
                undefined,
                undefined,
                undefined,
                TRUE, // You must specify that you actually WANT contexts.
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
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_SearchResult(result.result);
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
        const entry = resData.searchInfo.entries[0];
        assert(entry.information);
        expect(entry.information).toHaveLength(1);
        const ou_info = entry.information[0];
        assert("attribute" in ou_info);
        const ou_attr = ou_info.attribute;
        expect(ou_attr.type_.isEqualTo(organizationalUnitName["&id"])).toBeTruthy();
        expect(ou_attr.values).toHaveLength(0);
        assert(ou_attr.valuesWithContext);
        expect(ou_attr.valuesWithContext).toHaveLength(1);
        const vwc = ou_attr.valuesWithContext[0];
        expect(vwc.value.printableString).toBe("Area 51");
        expect(vwc.contextList).toHaveLength(1);
        const context = vwc.contextList[0];
        expect(context.contextType.isEqualTo(languageContext["&id"]));
        expect(context.contextValues).toHaveLength(1);
        const context_value = context.contextValues[0];
        expect(context_value.printableString).toBe("en");
    });

    test("search rules can limit the returned context values", async () => {
        const testId = `search-rule-output-context-values-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            undefined,
                            undefined,
                            [
                                new ResultAttribute(
                                    organizationalUnitName["&id"],
                                    undefined,
                                    [
                                        new ContextProfile(
                                            languageContext["&id"],
                                            [_encodePrintableString("en", DER)],
                                        ),
                                    ],
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinateRDN: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("A"),
            ),
        ];
        const subordinateDN: DistinguishedName = [ ...dn, subordinateRDN ];
        await createTestNode(connection!, dn, "A", [
            new Attribute(
                organizationalUnitName["&id"],
                [],
                [
                    new Attribute_valuesWithContext_Item(
                        utf8("Area 51"),
                        [
                            new Context(
                                languageContext["&id"],
                                [
                                    _encodePrintableString("en", DER),
                                    _encodePrintableString("fr", DER),
                                    _encodePrintableString("de", DER),
                                ],
                            ),
                            new Context(
                                localeContext["&id"],
                                [
                                    localeContext.encoderFor["&Type"]!({
                                        localeID1: new ObjectIdentifier([ 2, 5, 42, 23 ]),
                                    }, DER),
                                ],
                            ),
                        ],
                    ),
                ],
            ),
        ]);

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: subordinateDN,
            },
            SearchArgumentData_subset_baseObject,
            undefined,
            undefined,
            new EntryInformationSelection(
                {
                    select: [
                        organizationalUnitName["&id"],
                    ],
                },
                undefined,
                undefined,
                undefined,
                TRUE, // You must specify that you actually WANT contexts.
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
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_SearchResult(result.result);
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries).toHaveLength(1);
        const entry = resData.searchInfo.entries[0];
        assert(entry.information);
        expect(entry.information).toHaveLength(1);
        const ou_info = entry.information[0];
        assert("attribute" in ou_info);
        const ou_attr = ou_info.attribute;
        expect(ou_attr.type_.isEqualTo(organizationalUnitName["&id"])).toBeTruthy();
        expect(ou_attr.values).toHaveLength(0);
        assert(ou_attr.valuesWithContext);
        expect(ou_attr.valuesWithContext).toHaveLength(1);
        const vwc = ou_attr.valuesWithContext[0];
        expect(vwc.value.printableString).toBe("Area 51");
        expect(vwc.contextList).toHaveLength(1);
        const context = vwc.contextList[0];
        expect(context.contextType.isEqualTo(languageContext["&id"]));
        /* This is not a mistake. The return contexts do not limit the contexts
        values that are returned. Return contexts with values become context
        assertions, and since we only asserted a languageContext of "en", the
        value supplied above is returned, even though it lacks "fr" and "de"
        values as contexts. This is honestly not a very good test at all, but
        I did debug this and I do see that it is creating context assertions. */
        expect(context.contextValues).toHaveLength(3);
    });

    /**
     * This remains undone because the specifications say nothing about how to
     * use the entryType field.
     */
    test.todo("defaultValues with an entry type");
    test("search rules can use default values for input attribute types without an entry type", async () => {
        const testId = `search-rule-defaultValues-no-entry-type-${(new Date()).toISOString()}`;
        { // Setup
            await createTestRootNode(connection!, testId, undefined, undefined, true);
        }
        const dn = createTestRootDN(testId);

        const service_subentry_rdn: RelativeDistinguishedName = [
            new AttributeTypeAndValue(
                commonName["&id"],
                utf8("Service Admin"),
            ),
        ];
        await createEntry(
            connection!,
            dn,
            service_subentry_rdn,
            [
                new Attribute(
                    objectClass["&id"],
                    [
                        oid(subentry["&id"]),
                        oid(serviceAdminSubentry["&id"]),
                    ],
                ),
                new Attribute(
                    commonName["&id"],
                    [utf8("Service Admin")],
                ),
                new Attribute(
                    subtreeSpecification["&id"],
                    [subtreeSpecification.encoderFor["&Type"]!(new SubtreeSpecification(), DER)],
                ),
                new Attribute(
                    searchRules["&id"],
                    [
                        searchRules.encoderFor["&Type"]!(new SearchRuleDescription(
                            1,
                            new ObjectIdentifier([ 1, 3, 4, 6, 1 ]),
                            new ObjectIdentifier([ 1, 3, 4, 6, 1, 4, 555 ]),
                            4,
                            [
                                new RequestAttribute(
                                    organizationalUnitName["&id"],
                                    undefined,
                                    undefined,
                                    [
                                        new RequestAttribute_defaultValues_Item(
                                            undefined,
                                            [utf8("enron")],
                                        ),
                                    ],
                                    undefined,
                                    undefined,
                                    undefined,
                                ),
                            ],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, FALSE_BIT ]), // baseObject and oneLevel
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ), DER),
                    ],
                ),
            ],
        );

        const subordinates = [ "A", "B", "C" ];
        for (const subordinate_id of subordinates) {
            await createTestNode(connection!, dn, subordinate_id);
        }

        const reqData: SearchArgumentData = new SearchArgumentData(
            {
                rdnSequence: dn,
            },
            SearchArgumentData_subset_oneLevel,
            {
                item: {
                    equality: new AttributeValueAssertion(
                        organizationalUnitName["&id"],
                        utf8("enron"),
                        undefined,
                    ),
                },
            },
        );
        const arg: SearchArgument = {
            unsigned: reqData,
        };
        const result = await writeOperation(
            connection!,
            search["&operationCode"]!,
            _encode_SearchArgument(arg, DER),
        );
        assert("result" in result);
        assert(result.result);
        const decoded = _decode_SearchResult(result.result);
        const resData = getOptionallyProtectedValue(decoded);
        assert("searchInfo" in resData);
        expect(resData.searchInfo.entries.length).toBe(3);
    });

    test.todo("complicated example");
    test.todo("search rules can regulate a read operation");
    test.todo("search rules can regulate a modifyEntry operation");

});
