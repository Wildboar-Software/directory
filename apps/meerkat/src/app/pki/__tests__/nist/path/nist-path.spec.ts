import * as fsync from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import type { MeerkatContext } from "../../../../ctx";
import { ASN1Construction, ASN1TagClass, ASN1UndefinedError, ASN1UniversalType, DERElement, FALSE_BIT, ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import {
    caseIgnoreMatch,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreMatch.oa";
import {
    verifyCertPath,
    VerifyCertPathArgs,
    VerifyCertPathResult,
    VCP_RETURN_OK,
    VCP_RETURN_INVALID_SIG,
    VCP_RETURN_OCSP_REVOKED,
    VCP_RETURN_OCSP_OTHER,
    VCP_RETURN_CRL_REVOKED,
    VCP_RETURN_CRL_UNREACHABLE,
    VCP_RETURN_MALFORMED,
    VCP_RETURN_BAD_KEY_USAGE,
    VCP_RETURN_BAD_EXT_KEY_USAGE,
    VCP_RETURN_UNKNOWN_CRIT_EXT,
    VCP_RETURN_DUPLICATE_EXT,
    VCP_RETURN_AKI_SKI_MISMATCH,
    VCP_RETURN_PKU_PERIOD,
    VCP_RETURN_BASIC_CONSTRAINTS_CA,
    VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
    VCP_RETURN_INVALID_EXT_CRIT,
    VCP_RETURN_UNTRUSTED_ANCHOR,
    VCP_RETURN_INVALID_TIME,
    VCP_RETURN_ISSUER_SUBJECT_MISMATCH,
    VCP_RETURN_NAME_NOT_PERMITTED,
    VCP_RETURN_NAME_EXCLUDED,
    VCP_RETURN_PROHIBITED_SIG_ALG,
    VCP_RETURN_POLICY_NOT_ACCEPTABLE,
    VCP_RETURN_NO_AUTHORIZED_POLICIES,
    VCP_RETURN_NO_BASIC_CONSTRAINTS_CA,
} from "../../../verifyCertPath";
import type {
    TrustAnchorList,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/TrustAnchorList.ta";
import {
    anyPolicy,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/anyPolicy.va";
import {
    PolicyInformation, PolicyQualifierInfo,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/PolicyInformation.ta";
const PKITS_CERTS_PATH = path.join(__dirname, "data");
const VALIDITY_TIME: Date = new Date();
// From section 3.1 of https://csrc.nist.gov/CSRC/media/Projects/PKI-Testing/documents/PKITS.pdf
const NIST_TEST_POLICY_1 = ObjectIdentifier.fromString("2.16.840.1.101.3.2.1.48.1");
const NIST_TEST_POLICY_2 = ObjectIdentifier.fromString("2.16.840.1.101.3.2.1.48.2");
const NIST_TEST_POLICY_3 = ObjectIdentifier.fromString("2.16.840.1.101.3.2.1.48.3");
const NIST_TEST_POLICY_4 = ObjectIdentifier.fromString("2.16.840.1.101.3.2.1.48.4");
const NIST_TEST_POLICY_5 = ObjectIdentifier.fromString("2.16.840.1.101.3.2.1.48.5");
const NIST_TEST_POLICY_6 = ObjectIdentifier.fromString("2.16.840.1.101.3.2.1.48.6");
// From Section 3 of https://csrc.nist.gov/CSRC/media/Projects/PKI-Testing/documents/PKITS.pdf
const TRUST_ANCHOR_NAME: string = "TrustAnchorRootCertificate.crt";
const DEFAULT_TRUST_ANCHORS: TrustAnchorList = (() => {
    const der = fsync.readFileSync(path.join(PKITS_CERTS_PATH, TRUST_ANCHOR_NAME));
    const el = new DERElement();
    el.fromBytes(der);
    return [
        {
            certificate: _decode_Certificate(el),
        },
    ];
})();
const DEFAULT_SETTINGS: VerifyCertPathArgs = {
    validityTime: VALIDITY_TIME,
    certPath: [],
    trustAnchors: DEFAULT_TRUST_ANCHORS,
    initial_excluded_subtrees_set: [],
    initial_explicit_policy: false,
    initial_inhibit_any_policy: false,
    initial_permitted_subtrees_set: [],
    initial_policy_mapping_inhibit: false,
    initial_policy_set: [
        anyPolicy,
    ],
    initial_required_name_forms: [],
};
// So we don't modify anything by reference.
function getDefaultResult (result: Partial<VerifyCertPathResult>): VerifyCertPathResult {
    return {
        returnCode: VCP_RETURN_OK,
        authorities_constrained_policies: [],
        explicit_policy_indicator: false,
        policy_mappings_that_occurred: [],
        user_constrained_policies: [],
        warnings: [],
        endEntityExtKeyUsage: undefined,
        endEntityKeyUsage: undefined,
        endEntityPrivateKeyNotAfter: undefined,
        endEntityPrivateKeyNotBefore: undefined,
        ...result,
    };
}
function getErrorResult (): VerifyCertPathResult {
    return {
        returnCode: VCP_RETURN_OK,
        authorities_constrained_policies: [],
        explicit_policy_indicator: false,
        policy_mappings_that_occurred: [],
        user_constrained_policies: [],
        warnings: [],
        endEntityExtKeyUsage: undefined,
        endEntityKeyUsage: undefined,
        endEntityPrivateKeyNotAfter: undefined,
        endEntityPrivateKeyNotBefore: undefined,
    };
}
async function loadCert (certName: string): Promise<Certificate> {
    const withExtension = certName.endsWith(".crt")
        ? certName
        : certName + ".crt";
    const der: Buffer = await fs.readFile(path.join(PKITS_CERTS_PATH, withExtension));
    const el = new DERElement();
    el.fromBytes(der);
    return _decode_Certificate(el);
}
const ctx: MeerkatContext = {
    attributeTypes: {
        get: (key: string) => {
            return {
                equalityMatchingRule: caseIgnoreMatch["&id"],
            } as any;
        },
    },
    equalityMatchingRules: {
        get: (key: string) => {
            return {
                id: new ObjectIdentifier([ 2, 5, 17, 3 ]),
                matcher: (a, b) => {
                    return a.utf8String.toUpperCase() === b.utf8String.toUpperCase();
                },
            };
        },
    },
    matchingRulesSuitableForNaming: {
        has: (key: string) => true,
    },
    config: {
        tls: {
            revokedCertificateSerialNumbers: new Set(),
            // certificateRevocationLists: [],
            // trustAnchorList: [],
        },
        signing: {
            revokedCertificateSerialNumbers: new Set(),
            // certificateRevocationLists: [],
            // trustAnchorList: [],
        },
    },
} as MeerkatContext;
function create_nist_pkits_test (
    certPathFiles: string[],
    args: Partial<VerifyCertPathArgs>,
    expectedResult: Partial<VerifyCertPathResult>,
) {
    return async function () {
        const certPath: Certificate[] = (await Promise.all(
            certPathFiles.map(loadCert),
        )).reverse();
        const args_: VerifyCertPathArgs = {
            ...DEFAULT_SETTINGS,
            trustAnchors: [ {
                certificate: certPath[certPath.length - 1],
            } ],
            certPath,
            ...args,
        };
        const result = await verifyCertPath(ctx, args_);
        const expectedResult_: VerifyCertPathResult = getDefaultResult(expectedResult);
        return expect(result).toEqual(expectedResult_);
    }
}
describe("NIST PKITS 4.1.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidCertificatePathTest1EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.1.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BadSignedCACert.crt",
            "InvalidCASignatureTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_INVALID_SIG,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.1.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "InvalidEESignatureTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_INVALID_SIG,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.1.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "DSACACert.crt",
            "ValidDSASignaturesTest4EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
// DSA seems to be deprecated, so I am not going to sweat this test.
describe.skip("NIST PKITS 4.1.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "DSACACert.crt",
            "DSAParametersInheritedCACert.crt",
            "ValidDSAParameterInheritanceTest5EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.1.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "DSACACert.crt",
            "InvalidDSASignatureTest6EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_INVALID_SIG,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.2.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BadnotBeforeDateCACert.crt",
            "InvalidCAnotBeforeDateTest1EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_INVALID_TIME,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.2.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "InvalidEEnotBeforeDateTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_INVALID_TIME,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
// TODO: This will require publishing asn1-ts@7.0.10.
describe("NIST PKITS 4.2.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "Validpre2000UTCnotBeforeDateTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.2.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidGeneralizedTimenotBeforeDateTest4EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.2.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BadnotBeforeDateCACert.crt",
            "InvalidCAnotAfterDateTest5EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_INVALID_TIME,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.2.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "InvalidEEnotAfterDateTest6EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_INVALID_TIME,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.2.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "Invalidpre2000UTCEEnotAfterDateTest7EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_INVALID_TIME,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.2.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidGeneralizedTimenotAfterDateTest8EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.3.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "InvalidNameChainingTest1EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_ISSUER_SUBJECT_MISMATCH,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.3.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "NameOrderingCACert.crt",
            "InvalidNameChainingOrderTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_ISSUER_SUBJECT_MISMATCH,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.3.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidNameChainingWhitespaceTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
// FIXME: This is legitimately a bug, but it's not a big deal.
// To fix this, the X.500 library needs to remove internal whitespace in directory strings.
describe.skip("NIST PKITS 4.3.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidNameChainingWhitespaceTest4EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.3.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidNameChainingCapitalizationTest5EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.3.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "UIDCACert.crt",
            "ValidNameUIDsTest6EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.3.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "RFC3280MandatoryAttributeTypesCACert.crt",
            "ValidRFC3280MandatoryAttributeTypesTest7EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.3.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "RFC3280OptionalAttributeTypesCACert.crt",
            "ValidRFC3280OptionalAttributeTypesTest8EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.3.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "UTF8StringEncodedNamesCACert.crt",
            "ValidUTF8StringEncodedNamesTest9EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});

describe("NIST PKITS 4.3.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "RolloverfromPrintableStringtoUTF8StringCACert.crt",
            "ValidRolloverfromPrintableStringtoUTF8StringTest10EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
// FIXME: This is legitimately a bug, but it is not a big deal.
// Even though this test is supposedly for comparing case-insensitive matching,
// the subject and issuer names differ by internal whitespace as well.
describe.skip("NIST PKITS 4.3.11 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "UTF8StringCaseInsensitiveMatchCACert.crt",
            "ValidUTF8StringCaseInsensitiveMatchTest11EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});

test.todo("NIST PKITS 4.4.* Tests");

describe("NIST PKITS 4.5.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BasicSelfIssuedNewKeyCACert.crt",
            "BasicSelfIssuedNewKeyOldWithNewCACert.crt",
            "ValidBasicSelfIssuedOldWithNewTest1EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
// This test was commented out because it relies on CRL validation.
describe.skip("NIST PKITS 4.5.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BasicSelfIssuedNewKeyCACert.crt",
            "BasicSelfIssuedNewKeyOldWithNewCACert.crt",
            "InvalidBasicSelfIssuedOldWithNewTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.5.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BasicSelfIssuedOldKeyCACert.crt",
            "BasicSelfIssuedOldKeyNewWithOldCACert.crt",
            "ValidBasicSelfIssuedNewWithOldTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
// CRL-related
describe.skip("NIST PKITS 4.5.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BasicSelfIssuedOldKeyCACert.crt",
            "BasicSelfIssuedOldKeyNewWithOldCACert.crt",
            "ValidBasicSelfIssuedNewWithOldTest4EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
// CRL-related
describe.skip("NIST PKITS 4.5.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "BasicSelfIssuedOldKeyCACert.crt",
            "BasicSelfIssuedOldKeyNewWithOldCACert.crt",
            "InvalidBasicSelfIssuedNewWithOldTest5EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});

test.todo("NIST PKITS Tests 4.5.6 - 4.5.8");

describe("NIST PKITS 4.6.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "MissingbasicConstraintsCACert.crt",
            "InvalidMissingbasicConstraintsTest1EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_BASIC_CONSTRAINTS_CA,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "basicConstraintsCriticalcAFalseCACert.crt",
            "InvalidcAFalseTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_CA,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "basicConstraintsNotCriticalcAFalseCACert.crt",
            "InvalidcAFalseTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            /**
             * NOTE: This is a slight deviation from the expectation of the test.
             * But it is still correct and fine.
             *
             * I commented out the code that returns this error and I then get
             * the expected error.
             */
            returnCode: VCP_RETURN_INVALID_EXT_CRIT,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
// NOTE: I dispute that this path should pass.
describe("NIST PKITS 4.6.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "basicConstraintsNotCriticalCACert.crt",
            "ValidbasicConstraintsNotCriticalTest4EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_INVALID_EXT_CRIT,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint0CACert.crt",
            "pathLenConstraint0subCACert.crt",
            "InvalidpathLenConstraintTest5EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint0CACert.crt",
            "pathLenConstraint0subCACert.crt",
            "InvalidpathLenConstraintTest6EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint0CACert.crt",
            "ValidpathLenConstraintTest7EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.6.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint0CACert.crt",
            "ValidpathLenConstraintTest8EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.6.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint6CACert.crt",
            "pathLenConstraint6subCA0Cert.crt",
            "pathLenConstraint6subsubCA00Cert.crt",
            "InvalidpathLenConstraintTest9EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint6CACert.crt",
            "pathLenConstraint6subCA0Cert.crt",
            "pathLenConstraint6subsubCA00Cert.crt",
            "InvalidpathLenConstraintTest10EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.11 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint6CACert.crt",
            "pathLenConstraint6subCA1Cert.crt",
            "pathLenConstraint6subsubCA11Cert.crt",
            "pathLenConstraint6subsubsubCA11XCert.crt",
            "InvalidpathLenConstraintTest11EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.11 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint6CACert.crt",
            "pathLenConstraint6subCA1Cert.crt",
            "pathLenConstraint6subsubCA11Cert.crt",
            "pathLenConstraint6subsubsubCA11XCert.crt",
            "InvalidpathLenConstraintTest11EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.12 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint6CACert.crt",
            "pathLenConstraint6subCA1Cert.crt",
            "pathLenConstraint6subsubCA11Cert.crt",
            "pathLenConstraint6subsubsubCA11XCert.crt",
            "InvalidpathLenConstraintTest12EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.13 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint6CACert.crt",
            "pathLenConstraint6subCA4Cert.crt",
            "pathLenConstraint6subsubCA41Cert.crt",
            "pathLenConstraint6subsubsubCA41XCert.crt",
            "ValidpathLenConstraintTest13EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.6.14 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint6CACert.crt",
            "pathLenConstraint6subCA4Cert.crt",
            "pathLenConstraint6subsubCA41Cert.crt",
            "pathLenConstraint6subsubsubCA41XCert.crt",
            "ValidpathLenConstraintTest14EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.6.15 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint0CACert.crt",
            "pathLenConstraint0SelfIssuedCACert.crt",
            "ValidSelfIssuedpathLenConstraintTest15EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.6.16 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint0CACert.crt",
            "pathLenConstraint0SelfIssuedCACert.crt",
            "pathLenConstraint0subCA2Cert.crt",
            "InvalidSelfIssuedpathLenConstraintTest16EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.6.17 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "pathLenConstraint1CACert.crt",
            "pathLenConstraint1SelfIssuedCACert.crt",
            "pathLenConstraint1subCACert.crt",
            "pathLenConstraint1SelfIssuedsubCACert.crt",
            "ValidSelfIssuedpathLenConstraintTest17EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.7.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "keyUsageCriticalkeyCertSignFalseCACert.crt",
            "InvalidkeyUsageCriticalkeyCertSignFalseTest1EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BAD_KEY_USAGE,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.7.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "keyUsageNotCriticalkeyCertSignFalseCACert.crt",
            "InvalidkeyUsageNotCriticalkeyCertSignFalseTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_BAD_KEY_USAGE,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.7.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "keyUsageNotCriticalCACert.crt",
            "ValidkeyUsageNotCriticalTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
test.todo("NIST PKITS Tests 4.7.4");
test.todo("NIST PKITS Tests 4.7.5");
describe("NIST PKITS 4.8.1. Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidCertificatePathTest1EE.crt",
        ],
        {
            initial_explicit_policy: true,
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidCertificatePathTest1EE.crt",
        ],
        {
            initial_explicit_policy: true,
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #3", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidCertificatePathTest1EE.crt",
        ],
        {
            initial_explicit_policy: true,
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_POLICY_NOT_ACCEPTABLE,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #4", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "ValidCertificatePathTest1EE.crt",
        ],
        {
            initial_explicit_policy: true,
            initial_policy_set: [
                NIST_TEST_POLICY_1,
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "NoPoliciesCACert.crt",
            "AllCertificatesNoPoliciesTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "NoPoliciesCACert.crt",
            "AllCertificatesNoPoliciesTest2EE.crt",
        ],
        {
            initial_explicit_policy: true,
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "PoliciesP2subCACert.crt",
            "DifferentPoliciesTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "PoliciesP2subCACert.crt",
            "DifferentPoliciesTest3EE.crt",
        ],
        {
            initial_explicit_policy: true,
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #3", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "PoliciesP2subCACert.crt",
            "DifferentPoliciesTest3EE.crt",
        ],
        {
            initial_explicit_policy: true,
            initial_policy_set: [
                NIST_TEST_POLICY_1,
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "GoodsubCACert.crt",
            "DifferentPoliciesTest4EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "PoliciesP2subCA2Cert.crt",
            "DifferentPoliciesTest5EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP1234CACert.crt",
            "PoliciesP1234subCAP123Cert.crt",
            "PoliciesP1234subsubCAP123P12Cert.crt",
            "OverlappingPoliciesTest6EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));

    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP1234CACert.crt",
            "PoliciesP1234subCAP123Cert.crt",
            "PoliciesP1234subsubCAP123P12Cert.crt",
            "OverlappingPoliciesTest6EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));

    it("Validates successfully with the path in subtest #3", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP1234CACert.crt",
            "PoliciesP1234subCAP123Cert.crt",
            "PoliciesP1234subsubCAP123P12Cert.crt",
            "OverlappingPoliciesTest6EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_POLICY_NOT_ACCEPTABLE,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP123CACert.crt",
            "PoliciesP123subCAP12Cert.crt",
            "PoliciesP123subsubCAP12P1Cert.crt",
            "DifferentPoliciesTest7EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP12CACert.crt",
            "PoliciesP12subCAP1Cert.crt",
            "PoliciesP12subsubCAP1P2Cert.crt",
            "DifferentPoliciesTest8EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT, FALSE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP123CACert.crt",
            "PoliciesP123subCAP12Cert.crt",
            "PoliciesP123subsubCAP12P2Cert.crt",
            "PoliciesP123subsubsubCAP12P2P1Cert.crt",
            "DifferentPoliciesTest9EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP12CACert.crt",
            "AllCertificatesSamePoliciesTest10EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP12CACert.crt",
            "AllCertificatesSamePoliciesTest10EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #3", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP12CACert.crt",
            "AllCertificatesSamePoliciesTest10EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.11 Cert Path", () => {
    // FIXME: I think this is a bug.
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "anyPolicyCACert.crt",
            "AllCertificatesanyPolicyTest11EE.crt",
        ],
        {},
        {
            user_constrained_policies: [

            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    anyPolicy,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    // FIXME: I think this is a bug.
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "anyPolicyCACert.crt",
            "AllCertificatesanyPolicyTest11EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    anyPolicy,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.12 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP3CACert.crt",
            "DifferentPoliciesTest12EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.13 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP123CACert.crt",
            "AllCertificatesSamePoliciesTest13EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_3,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP123CACert.crt",
            "AllCertificatesSamePoliciesTest13EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_3,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #3", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP123CACert.crt",
            "AllCertificatesSamePoliciesTest13EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_3,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_3,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_3,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});

describe("NIST PKITS 4.8.14 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "anyPolicyCACert.crt",
            "AnyPolicyTest14EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "anyPolicyCACert.crt",
            "AnyPolicyTest14EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_POLICY_NOT_ACCEPTABLE,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.15 Cert Path", () => {
    // FIXME: Display user notices.
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "UserNoticeQualifierTest15EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.16 Cert Path", () => {
    // FIXME: Display user notices.
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "UserNoticeQualifierTest16EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.17 Cert Path", () => {
    // FIXME: Display user notices.
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "UserNoticeQualifierTest17EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.18 Cert Path", () => {
    // FIXME: User notices
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP12CACert.crt",
            "UserNoticeQualifierTest18EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PoliciesP12CACert.crt",
            "UserNoticeQualifierTest18EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.19 Cert Path", () => {
    const qualValue1 = new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.visibleString,
    );
    qualValue1.value = new Uint8Array(
        Array
            .from("q6:  Section 4.2.1.5 of RFC 3280 states the maximum size of explicitText is 200 characters, but warns that some non-conforming CAs exceed this limit.  Thus RFC 3280 states that certificate users SHOULD gracefully handle explicitText with more than 200 characters.  This explicitText is over 200 characters long")
            .map((char) => char.charCodeAt(0)));
    const qualValues = DERElement.fromSequence([qualValue1]);
    qualValues.name = "qualifier";
    qualValues.value = new Uint8Array(qualValues.value);
    const pq1 = [
        new PolicyQualifierInfo(
            new ObjectIdentifier([ 1, 3, 6, 1, 5, 5, 7, 2, 2 ]),
            qualValues,
        ),
    ];
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "UserNoticeQualifierTest19EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    pq1,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    pq1,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.8.20 Cert Path", () => {
    const qualValue1 = new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.ia5String,
    );
    qualValue1.name = "qualifier";
    qualValue1.value = new Uint8Array(
        Array
            .from("http://csrc.nist.gov/groups/ST/crypto_apps_infra/csor/pki_registration.html#PKITest")
            .map((char) => char.charCodeAt(0)));
    // const qualValues = DERElement.fromSequence([qualValue1]);
    // qualValues.name = "qualifier";
    // qualValues.value = new Uint8Array(qualValues.value);
    const pq1 = [
        new PolicyQualifierInfo(
            new ObjectIdentifier([ 1, 3, 6, 1, 5, 5, 7, 2, 1 ]),
            qualValue1,
        ),
    ];
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "CPSPointerQualifierTest20EE.crt",
        ],
        {
            initial_explicit_policy: true, // Not required, but recommended.
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    pq1,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    pq1,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.9.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy10CACert.crt",
            "requireExplicitPolicy10subCACert.crt",
            "requireExplicitPolicy10subsubCACert.crt",
            "requireExplicitPolicy10subsubsubCACert.crt",
            "ValidrequireExplicitPolicyTest1EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.9.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy5CACert.crt",
            "requireExplicitPolicy5subCACert.crt",
            "requireExplicitPolicy5subsubCACert.crt",
            "requireExplicitPolicy5subsubsubCACert.crt",
            "ValidrequireExplicitPolicyTest2EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.9.3 Cert Path", () => {
    // FIXME: This is a bug.
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy4CACert.crt",
            "requireExplicitPolicy4subCACert.crt",
            "requireExplicitPolicy4subsubCACert.crt",
            "requireExplicitPolicy4subsubsubCACert.crt",
            "InvalidrequireExplicitPolicyTest3EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.9.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy0CACert.crt",
            "requireExplicitPolicy0subCACert.crt",
            "requireExplicitPolicy0subsubCACert.crt",
            "requireExplicitPolicy0subsubsubCACert.crt",
            "ValidrequireExplicitPolicyTest4EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.9.5 Cert Path", () => {
    // FIXME: This is a bug.
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy7CACert.crt",
            "requireExplicitPolicy7subCARE2Cert.crt",
            "requireExplicitPolicy7subsubCARE2RE4Cert.crt",
            "requireExplicitPolicy7subsubsubCARE2RE4Cert.crt",
            "InvalidrequireExplicitPolicyTest5EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
describe("NIST PKITS 4.9.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy2CACert.crt",
            "requireExplicitPolicy2SelfIssuedCACert.crt",
            "ValidSelfIssuedrequireExplicitPolicyTest6EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});

// FIXME: This is a bug.
describe("NIST PKITS 4.9.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy2CACert.crt",
            "requireExplicitPolicy2SelfIssuedCACert.crt",
            "requireExplicitPolicy2subCACert.crt",
            "InvalidSelfIssuedrequireExplicitPolicyTest7EE.crt",
        ],
        {
            initial_explicit_policy: true,
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
// FIXME: This is a bug.
describe("NIST PKITS 4.9.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "requireExplicitPolicy2CACert.crt",
            "requireExplicitPolicy2SelfIssuedCACert.crt",
            "requireExplicitPolicy2subCACert.crt",
            "requireExplicitPolicy2SelfIssuedsubCACert.crt",
            "InvalidSelfIssuedrequireExplicitPolicyTest8EE.crt",
        ],
        {},
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: undefined,
        },
    ));
});
// FIXME: Use create_nist_pkits_test()
describe("NIST PKITS 4.10.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", async () => {
        const certPath: Certificate[] = (await Promise.all(
            [
                "TrustAnchorRootCertificate.crt",
                "Mapping1to2CACert.crt",
                "ValidPolicyMappingTest1EE.crt",
            ].map(loadCert),
        )).reverse();
        const args: VerifyCertPathArgs = {
            ...DEFAULT_SETTINGS,
            certPath,
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        };
        const result = await verifyCertPath(ctx, args);
        const expectedResult: VerifyCertPathResult = {
            returnCode: VCP_RETURN_OK,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            explicit_policy_indicator: true,
            policy_mappings_that_occurred: [],
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            warnings: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        };
        return expect(result).toEqual(expectedResult);
    });
});
describe("NIST PKITS 4.10.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", async () => {
        const certPath: Certificate[] = (await Promise.all(
            [
                "TrustAnchorRootCertificate.crt",
                "Mapping1to2CACert.crt",
                "ValidPolicyMappingTest1EE.crt",
            ].map(loadCert),
        )).reverse();
        const args: VerifyCertPathArgs = {
            ...DEFAULT_SETTINGS,
            certPath,
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        };
        const result = await verifyCertPath(ctx, args);
        const expectedResult: VerifyCertPathResult = {
            returnCode: VCP_RETURN_OK,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            explicit_policy_indicator: true,
            policy_mappings_that_occurred: [],
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            warnings: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        };
        return expect(result).toEqual(expectedResult);
    });
    it("Validates successfully with the path in subtest #2", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "Mapping1to2CACert.crt",
            "ValidPolicyMappingTest1EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            returnCode: VCP_RETURN_POLICY_NOT_ACCEPTABLE,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.10.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "P1Mapping1to234CACert.crt",
            "P1Mapping1to234subCACert.crt",
            "ValidPolicyMappingTest6EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT ]),
        },
    ));
});
describe("NIST PKITS 4.10.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "MappingFromanyPolicyCACert.crt",
            "InvalidMappingFromanyPolicyTest7EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_MALFORMED,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
        },
    ));
});
describe("NIST PKITS 4.10.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "MappingToanyPolicyCACert.crt",
            "InvalidMappingToanyPolicyTest8EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_MALFORMED,
            explicit_policy_indicator: false,
            authorities_constrained_policies: [],
        },
    ));
});
describe("NIST PKITS 4.10.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "PanyPolicyMapping1to2CACert.crt",
            "ValidPolicyMappingTest9EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe("NIST PKITS 4.10.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "GoodsubCAPanyPolicyMapping1to2CACert.crt",
            "InvalidPolicyMappingTest10EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe("NIST PKITS 4.10.11 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "GoodCACert.crt",
            "GoodsubCAPanyPolicyMapping1to2CACert.crt",
            "ValidPolicyMappingTest11EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe("NIST PKITS 4.10.12 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "P12Mapping1to3CACert.crt",
            "ValidPolicyMappingTest12EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
            endEntityPrivateKeyNotAfter: undefined,
            endEntityPrivateKeyNotBefore: undefined,
        },
    ));
});
describe("NIST PKITS 4.10.13 Cert Path", () => {
    const qualValue1 = new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.visibleString,
    );
    qualValue1.value = new Uint8Array(
        Array
            .from("q9:  This is the user notice from qualifier 9 associated with NIST-test-policy-1.  This user notice should be displayed for Valid Policy Mapping Test13")
            .map((char) => char.charCodeAt(0)));
    const qualValues = DERElement.fromSequence([qualValue1]);
    qualValues.name = "qualifier";
    qualValues.value = new Uint8Array(qualValues.value);
    const pq1 = [
        new PolicyQualifierInfo(
            new ObjectIdentifier([ 1, 3, 6, 1, 5, 5, 7, 2, 2 ]),
            qualValues,
        ),
    ];
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "P1anyPolicyMapping1to2CACert.crt",
            "ValidPolicyMappingTest13EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    pq1,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    pq1,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe("NIST PKITS 4.10.14 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "P1anyPolicyMapping1to2CACert.crt",
            "ValidPolicyMappingTest14EE.crt",
        ],
        {},
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping0CACert.crt",
            "inhibitPolicyMapping0subCACert.crt",
            "InvalidinhibitPolicyMappingTest1EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P12CACert.crt",
            "inhibitPolicyMapping1P12subCACert.crt",
            "InvalidinhibitPolicyMappingTest1EE.crt"
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P12CACert.crt",
            "inhibitPolicyMapping1P12subCACert.crt",
            "inhibitPolicyMapping1P12subsubCACert.crt",
            "InvalidinhibitPolicyMappingTest3EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P12CACert.crt",
            "inhibitPolicyMapping1P12subCACert.crt",
            "inhibitPolicyMapping1P12subsubCACert.crt",
            "ValidinhibitPolicyMappingTest4EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_2,
            ],
        },
        {
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_2,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping5CACert.crt",
            "inhibitPolicyMapping5subCACert.crt",
            "inhibitPolicyMapping5subsubCACert.crt",
            "inhibitPolicyMapping5subsubsubCACert.crt",
            "InvalidinhibitPolicyMappingTest5EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P12CACert.crt",
            "inhibitPolicyMapping1P12subCAIPM5Cert.crt",
            "inhibitPolicyMapping1P12subsubCAIPM5Cert.crt",
            "InvalidinhibitPolicyMappingTest6EE.crt"
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P1CACert.crt",
            "inhibitPolicyMapping1P1SelfIssuedsubCACert.crt",
            "inhibitPolicyMapping1P1subCACert.crt",
            "ValidSelfIssuedinhibitPolicyMappingTest7EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P1CACert.crt",
            "inhibitPolicyMapping1P1SelfIssuedsubCACert.crt",
            "inhibitPolicyMapping1P1subCACert.crt",
            "inhibitPolicyMapping1P1subsubCACert.crt",
            "InvalidSelfIssuedinhibitPolicyMappingTest8EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P1CACert.crt",
            "inhibitPolicyMapping1P1SelfIssuedCACert.crt",
            "inhibitPolicyMapping1P1subCACert.crt",
            "inhibitPolicyMapping1P1subsubCACert.crt",
            "InvalidSelfIssuedinhibitPolicyMappingTest9EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P1CACert.crt",
            "inhibitPolicyMapping1P1SelfIssuedCACert.crt",
            "inhibitPolicyMapping1P1subCACert.crt",
            "inhibitPolicyMapping1P1SelfIssuedsubCACert.crt",
            "InvalidSelfIssuedinhibitPolicyMappingTest10EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.11.11 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitPolicyMapping1P1CACert.crt",
            "inhibitPolicyMapping1P1SelfIssuedCACert.crt",
            "inhibitPolicyMapping1P1subCACert.crt",
            "inhibitPolicyMapping1P1SelfIssuedsubCACert.crt",
            "InvalidSelfIssuedinhibitPolicyMappingTest11EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy0CACert.crt",
            "InvalidinhibitAnyPolicyTest1EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy0CACert.crt",
            "ValidinhibitAnyPolicyTest2EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy1CACert.crt",
            "inhibitAnyPolicy1subCA1Cert.crt",
            "inhibitAnyPolicyTest3EE.crt",
        ],
        {
            initial_inhibit_any_policy: true,
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy1CACert.crt",
            "inhibitAnyPolicy1subCA1Cert.crt",
            "InvalidinhibitAnyPolicyTest4EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe("NIST PKITS 4.12.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy5CACert.crt",
            "inhibitAnyPolicy5subCACert.crt",
            "inhibitAnyPolicy5subsubCACert.crt",
            "InvalidinhibitAnyPolicyTest5EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [],
            returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [],
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy1CACert.crt",
            "inhibitAnyPolicy1subCAIAP5Cert.crt",
            "InvalidinhibitAnyPolicyTest6EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy1CACert.crt",
            "inhibitAnyPolicy1SelfIssuedCACert.crt",
            "inhibitAnyPolicy1subCA2Cert",
            "ValidSelfIssuedinhibitAnyPolicyTest7EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy1CACert.crt",
            "inhibitAnyPolicy1SelfIssuedCACert.crt",
            "inhibitAnyPolicy1subCA2Cert",
            "inhibitAnyPolicy1subsubCA2Cert",
            "InvalidSelfIssuedinhibitAnyPolicyTest8EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy1CACert.crt",
            "inhibitAnyPolicy1SelfIssuedCACert.crt",
            "inhibitAnyPolicy1subCA2Cert",
            "inhibitAnyPolicy1SelfIssuedsubCA2Cert.crt",
            "ValidSelfIssuedinhibitAnyPolicyTest9EE.crt",
        ],
        {
            initial_policy_set: [
                NIST_TEST_POLICY_1,
            ],
        },
        {
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.12.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "inhibitAnyPolicy1CACert.crt",
            "inhibitAnyPolicy1SelfIssuedCACert.crt",
            "inhibitAnyPolicy1subCA2Cert.crt",
            "InvalidSelfIssuedinhibitAnyPolicyTest10EE.crt",
        ],
        {
        },
        {
            user_constrained_policies: [
            ],
            returnCode: VCP_RETURN_OK,
            explicit_policy_indicator: true,
            authorities_constrained_policies: [
            ],
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "ValidDNnameConstraintsTest1EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "InvalidDNnameConstraintsTest2EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "InvalidDNnameConstraintsTest3EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "ValidDNnameConstraintsTest4EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN2CACert.crt",
            "ValidDNnameConstraintsTest5EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN3CACert.crt",
            "ValidDNnameConstraintsTest6EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN3CACert.crt",
            "InvalidDNnameConstraintsTest7EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN4CACert.crt",
            "InvalidDNnameConstraintsTest8EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN4CACert.crt",
            "InvalidDNnameConstraintsTest9EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN5CACert.crt",
            "InvalidDNnameConstraintsTest10EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.11 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN5CACert.crt",
            "ValidDNnameConstraintsTest11EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.12 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "nameConstraintsDN1subCA1Cert.crt",
            "InvalidDNnameConstraintsTest12EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.13 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "nameConstraintsDN1subCA2Cert.crt",
            "InvalidDNnameConstraintsTest13EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.14 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "nameConstraintsDN1subCA2Cert.crt",
            "ValidDNnameConstraintsTest14EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.15 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN3CACert.crt",
            "nameConstraintsDN3subCA1Cert.crt",
            "InvalidDNnameConstraintsTest15EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.16 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN3CACert.crt",
            "nameConstraintsDN3subCA1Cert.crt",
            "InvalidDNnameConstraintsTest16EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.17 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN3CACert.crt",
            "nameConstraintsDN3subCA2Cert.crt",
            "InvalidDNnameConstraintsTest17EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.18 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN3CACert.crt",
            "nameConstraintsDN3subCA2Cert.crt",
            "ValidDNnameConstraintsTest18EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.19 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "nameConstraintsDN1SelfIssuedCACert.crt",
            "ValidDNnameConstraintsTest19EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.20 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "InvalidDNnameConstraintsTest20EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.21 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsRFC822CA1Cert.crt",
            "ValidRFC822nameConstraintsTest21EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.22 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsRFC822CA1Cert.crt",
            "InvalidRFC822nameConstraintsTest22EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.23 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsRFC822CA2Cert.crt",
            "ValidRFC822nameConstraintsTest23EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.24 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsRFC822CA3Cert.crt",
            "InvalidRFC822nameConstraintsTest24EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.25 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsRFC822CA3Cert.crt",
            "ValidRFC822nameConstraintsTest25EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.26 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsRFC822CA3Cert.crt",
            "InvalidRFC822nameConstraintsTest26EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.27 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "nameConstraintsDN1subCA3Cert.crt",
            "ValidDNandRFC822nameConstraintsTest27EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.28 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "nameConstraintsDN1subCA3Cert.crt",
            "InvalidDNandRFC822nameConstraintsTest28EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.29 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDN1CACert.crt",
            "nameConstraintsDN1subCA3Cert.crt",
            "InvalidDNandRFC822nameConstraintsTest29EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.30 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDNS1CACert.crt",
            "ValidDNSnameConstraintsTest30EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.31 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDNS1CACert.crt",
            "InvalidDNSnameConstraintsTest31EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.32 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDNS2CACert.crt",
            "ValidDNSnameConstraintsTest32EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.33 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDNS2CACert.crt",
            "InvalidDNSnameConstraintsTest33EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.34 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsURI1CACert.crt",
            "ValidURInameConstraintsTest34EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.35 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsURI1CACert.crt",
            "InvalidURInameConstraintsTest35EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.36 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsURI2CACert.crt",
            "ValidURInameConstraintsTest36EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.37 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsURI2CACert.crt",
            "InvalidURInameConstraintsTest37EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.13.38 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "nameConstraintsDNS1CACert.crt",
            "InvalidDNSnameConstraintsTest38EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint1CACert.crt",
            "ValiddistributionPointTest1EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint1CACert.crt",
            "InvaliddistributionPointTest2EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint1CACert.crt",
            "InvaliddistributionPointTest3EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint1CACert.crt",
            "ValiddistributionPointTest4EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint2CACert.crt",
            "ValiddistributionPointTest5EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint2CACert.crt",
            "InvaliddistributionPointTest6EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint2CACert.crt",
            "ValiddistributionPointTest7EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint2CACert.crt",
            "InvaliddistributionPointTest8EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "distributionPoint2CACert.crt",
            "InvaliddistributionPointTest9EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "NoissuingDistributionPointCACert.crt",
            "ValidNoissuingDistributionPointTest10EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.11 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlyContainsUserCertsCACert.crt",
            "InvalidonlyContainsUserCertsTest11EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.12 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlyContainsCACertsCACert.crt",
            "InvalidonlyContainsCACertsTest12EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.13 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlyContainsCACertsCACert.crt",
            "ValidonlyContainsCACertsTest13EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.14 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlyContainsAttributeCertsCACert.crt",
            "InvalidonlyContainsAttributeCertsTest14EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.15 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlySomeReasonsCA1Cert.crt",
            "InvalidonlySomeReasonsTest15EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.16 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlySomeReasonsCA1Cert.crt",
            "InvalidonlySomeReasonsTest16EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.17 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlySomeReasonsCA2Cert.crt",
            "InvalidonlySomeReasonsTest17EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.18 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlySomeReasonsCA3Cert.crt",
            "ValidonlySomeReasonsTest18EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.19 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlySomeReasonsCA4Cert.crt",
            "ValidonlySomeReasonsTest19EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.20 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlySomeReasonsCA4Cert.crt",
            "InvalidonlySomeReasonsTest20EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.21 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "onlySomeReasonsCA4Cert.crt",
            "InvalidonlySomeReasonsTest21EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.22 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA1Cert.crt",
            "ValidIDPwithindirectCRLTest22EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.23 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA1Cert.crt",
            "InvalidIDPwithindirectCRLTest23EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.24 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA2Cert.crt",
            "indirectCRLCA1Cert.crt",
            "ValidIDPwithindirectCRLTest24EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.25 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA2Cert.crt",
            "indirectCRLCA1Cert.crt",
            "ValidIDPwithindirectCRLTest25EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.26 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA2Cert.crt",
            "indirectCRLCA1Cert.crt",
            "InvalidIDPwithindirectCRLTest26EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.27 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA2Cert.crt",
            "GoodCACert.crt",
            "InvalidcRLIssuerTest27EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.28 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA3Cert.crt",
            "indirectCRLCA3cRLIssuerCert.crt",
            "ValidcRLIssuerTest28EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.29 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA3Cert.crt",
            "indirectCRLCA3cRLIssuerCert.crt",
            "ValidcRLIssuerTest29EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.30 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA4Cert.crt",
            "indirectCRLCA4cRLIssuerCert.crt",
            "ValidcRLIssuerTest30EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.31 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA5Cert.crt",
            "indirectCRLCA6Cert.crt",
            "InvalidcRLIssuerTest31EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.32 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA5Cert.crt",
            "indirectCRLCA6Cert.crt",
            "InvalidcRLIssuerTest32EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.33 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA5Cert.crt",
            "indirectCRLCA6Cert.crt",
            "ValidcRLIssuerTest33EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.34 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA5Cert.crt",
            "InvalidcRLIssuerTest34EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.14.35 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "indirectCRLCA5Cert.crt",
            "InvalidcRLIssuerTest35EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLIndicatorNoBaseCACert.crt",
            "InvaliddeltaCRLIndicatorNoBaseTest1EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA1Cert.crt",
            "ValiddeltaCRLTest2EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.3 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA1Cert.crt",
            "InvaliddeltaCRLTest3EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.4 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA1Cert.crt",
            "InvaliddeltaCRLTest4EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.5 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA1Cert.crt",
            "ValiddeltaCRLTest5EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.6 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA1Cert.crt",
            "InvaliddeltaCRLTest6EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.7 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA1Cert.crt",
            "ValiddeltaCRLTest7EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.8 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA2Cert.crt",
            "ValiddeltaCRLTest8EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.9 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA2Cert.crt",
            "InvaliddeltaCRLTest9EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe.skip("NIST PKITS 4.15.10 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "deltaCRLCA3Cert.crt",
            "InvaliddeltaCRLTest9EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
        },
    ));
});
describe("NIST PKITS 4.16.1 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "ValidUnknownNotCriticalCertificateExtensionTest1EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_OK,
            endEntityExtKeyUsage: undefined,
            endEntityKeyUsage: new Uint8ClampedArray([TRUE_BIT, TRUE_BIT, TRUE_BIT, TRUE_BIT]),
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
        },
    ));
});
describe("NIST PKITS 4.16.2 Cert Path", () => {
    it("Validates successfully with the path in subtest #1", create_nist_pkits_test(
        [
            "TrustAnchorRootCertificate.crt",
            "InvalidUnknownCriticalCertificateExtensionTest2EE.crt",
        ],
        {
        },
        {
            returnCode: VCP_RETURN_UNKNOWN_CRIT_EXT,
            authorities_constrained_policies: [],
            user_constrained_policies: [],
        },
    ));
});
