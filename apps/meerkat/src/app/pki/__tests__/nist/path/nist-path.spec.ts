import * as fsync from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import type { MeerkatContext } from "../../../../ctx";
import { DERElement, ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import {
    caseIgnoreMatch,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/caseIgnoreMatch.oa";
import { verifyCertPath, VerifyCertPathArgs, VerifyCertPathResult } from "../../../verifyCertPath";
import type {
    TrustAnchorList,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/TrustAnchorList.ta";
import {
    anyPolicy,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/anyPolicy.va";
import {
    PolicyInformation,
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
        returnCode: 0,
        authorities_constrained_policies: [],
        explicit_policy_indicator: false,
        policy_mappings_that_occurred: [],
        user_constrained_policies: [],
        warnings: [],
        endEntityExtKeyUsage: undefined,
        endEntityKeyUsage: new Uint8ClampedArray([
            1,
            1,
            1,
            1,
        ]),
        endEntityPrivateKeyNotAfter: undefined,
        endEntityPrivateKeyNotBefore: undefined,
        ...result,
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
            certPath,
            ...args,
        };
        const result = await verifyCertPath(ctx, args_);
        const expectedResult_: VerifyCertPathResult = getDefaultResult(expectedResult);
        return expect(result).toEqual(expectedResult_);
    }
}

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
            returnCode: 0,
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

    it("Fails validation with the path in subtest #2", create_nist_pkits_test(
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
            returnCode: -200,
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

describe("NIST PKITS 4.12.2 Cert Path", () => {
    it("Passes validation subtest #1", create_nist_pkits_test(
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
            returnCode: 0,
            authorities_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
            explicit_policy_indicator: true,
            user_constrained_policies: [
                new PolicyInformation(
                    NIST_TEST_POLICY_1,
                    undefined,
                ),
            ],
        },
    ));

});
