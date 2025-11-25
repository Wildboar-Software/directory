import type { MeerkatContext } from "../ctx.js";
import { verifyCertPath, VerifyCertPathArgs } from "./verifyCertPath.js";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import { PEMObject } from "@wildboar/pem";
import { DERElement, ObjectIdentifier } from "@wildboar/asn1";
import type {
    TrustAnchorList,
} from "@wildboar/tal";
import {
    caseIgnoreMatch,
} from "@wildboar/x500/SelectedAttributeTypes";

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
                id: ObjectIdentifier.fromParts([ 2, 5, 17, 3 ]),
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

const trustAnchorPEM: string = `-----BEGIN CERTIFICATE-----
MIIDbTCCAlWgAwIBAgIULVexlqqnsQ1/ezE1u8+lQW3iC/8wDQYJKoZIhvcNAQEL
BQAwRjELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkZMMQ4wDAYDVQQHDAVUYW1wYTEa
MBgGA1UECgwRV2lsZGJvYXIgU29mdHdhcmUwHhcNMjIwNDA2MDAxODA5WhcNNDkw
ODIyMDAxODA5WjBGMQswCQYDVQQGEwJVUzELMAkGA1UECAwCRkwxDjAMBgNVBAcM
BVRhbXBhMRowGAYDVQQKDBFXaWxkYm9hciBTb2Z0d2FyZTCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBANfoJHPvPB0PTbywZ/LJwYTN75d2rqaRo/0jf+f2
uviyVVLIeVMRsImjfhBCK32kDp4EUB3jwhjoMnb0LubuY63o40uCF9STb2pT9b/C
5QsBdH1UGAgfGykRFkGG8SDAx+prkafiy69ha/ZtLRZW78bfPmGWDq7ALwEMKdvz
xEF0+B7Nj5hmvVnt51+Tf2nUi8LXLn3uyK8Tu9HkZt3LkQgCAQENOGg97kpXU7aj
+Ime99pIQr9ehnioCt8tegHXJkQF42Yh6xnlfwqakLMYjPsulfM+1ZF3TGbabHA9
owt1w0aOtmoicNeLdZ31YSXGrAZTa9U9YlYh1cH0Y7Kr14UCAwEAAaNTMFEwHQYD
VR0OBBYEFNnD4JAJEcfK/62LwuKq8RQnrTmwMB8GA1UdIwQYMBaAFNnD4JAJEcfK
/62LwuKq8RQnrTmwMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEB
AAkWT0CbFTaUttuZJNDYX7vtdId2dS3BF3cPglaXuYag7IZmvMQ/XrOW2Wr3CcKU
Mg0rbIuCmn37fBFrggDg+NICOcOAuXs9wdufUvAQx9RFc4kv749uTmjWA2H4Oz+R
S8cyDlwXICD/QaEjo9I306umXZA1bkO8M2jHjIBDslLFsSWwQags08DrWZTwC9tU
W1rwqkOlabEpphV4snFuuYqyHXTmCVjUQVipPj4mLi9J5ydSyJSnhKy4neoOGYyC
lfpmMNCkvSpqT3Z2DXoYk38sH8SWfJfcX3ao6InIMq6v12mpnQwhvgTGuAmwDHLz
4omJCGN3ohmP9kr2tp3Cf6o=
-----END CERTIFICATE-----`;

const eeCertPEM: string = `-----BEGIN CERTIFICATE-----
MIIEMDCCAxigAwIBAgIUWp1XmbI8pDAY0VB8GxGqEq16v7swDQYJKoZIhvcNAQEL
BQAwRjELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkZMMQ4wDAYDVQQHDAVUYW1wYTEa
MBgGA1UECgwRV2lsZGJvYXIgU29mdHdhcmUwHhcNMjIwNDI5MjAwMDM4WhcNMjQw
NDI4MjAwMDM4WjAsMSowKAYDVQQDDCFkc2EwMS5nYi5ta2RlbW8ud2lsZGJvYXIu
c29mdHdhcmUwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDQng9l0Puv
A2akR6J6/kS98qLsi+mXkO282uVv63jYVbw2DHpg1c5LA9SeI0UqP5+GKRFCS7Oq
nz9padX4eulEBvy5Pp0NS4Pqx1/Xlby5+TpfkUX0fp5WVIriwsD+kfi6I3oJ+M7o
KspSFshBFNK1Mu14qTC/ROZMdQ5y//stlYwVZM9aytA2K1fI9YtqR0EQg9LTkNTM
CV3uZn+DK5cDaO2Zyy4oCNybzFQmIbU8iboSDIbN8a+/Bfx5iofoomtztpkYcou2
PMmCsnex7Skp83mmo2731Unszc9Xy/nBduUiiXbH3nn0vd7GPLYmOdyRzG77Wn72
0gs+72jCzrTTm5hswEsBv1w9riWiwZPwYozMsKchehFOTZgjsK6YmYUOzUK470SV
oQDH0ILbJClPtp++CSbSB50PGpM8sxLVWMonqvPYgeF3WH+fct0TXFXFOEHwuCFH
Xl0T1Bgx99p2D/rGwpC/Q63p5uGOgrDMyb1LnjS6Ot/mQrQrS26HHZYU0oM9xg3O
BvcU4SLPTn8n6Rfkdo2ap8/bDBIns2n8/VKc9Ndd31hbOPrjG6vyCTB5wGEpH3W5
u3d5Rfuzb9/LZWWPa/a9fLduEX8ETF01oLnbftaTZsfyk9hPibaFnF8ZI9DydQjB
IpM8z+syqiiPB1d2f9gxOHjnUWHU9vJbxQIDAQABozAwLjAsBgNVHREEJTAjgiFk
c2EwMS5nYi5ta2RlbW8ud2lsZGJvYXIuc29mdHdhcmUwDQYJKoZIhvcNAQELBQAD
ggEBADUAHXzAw7/1w05VqdNcx66usvDSm5YpJCPLP4Q8WPJBMLAsfJs+3WayDyTg
7wEhE+dVJ5b7Lgl67UmfMKnewkKl6ZxyAfF1WU2lz/RTbXVrTV+WVspGV+Zyx3l1
AIK486M67O06yI74sxaCxHDOlIZajBcFqKskB2LCBjVwE0pUqtZIocKOgUrUkbqB
5HZTNlxt5/bRKxZb8VAAUTHrAUevhcHyXVpZ7i9RS7HT01EaiSwQPjVGrc5oZu/g
bocnsriR9nnrxu8i+dIiXMk1ty78NzqUerS38j0qek7Wj3g5P+90OWImhoCC3Osf
n4J+pkIDjGD93mplf1Fla5+hNFU=
-----END CERTIFICATE-----`;

const eeCertPEMWithAlteredSig: string = `-----BEGIN CERTIFICATE-----
MIIEMDCCAxigAwIBAgIUWp1XmbI8pDAY0VB8GxGqEq16v7swDQYJKoZIhvcNAQEL
BQAwRjELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkZMMQ4wDAYDVQQHDAVUYW1wYTEa
MBgGA1UECgwRV2lsZGJvYXIgU29mdHdhcmUwHhcNMjIwNDI5MjAwMDM4WhcNMjQw
NDI4MjAwMDM4WjAsMSowKAYDVQQDDCFkc2EwMS5nYi5ta2RlbW8ud2lsZGJvYXIu
c29mdHdhcmUwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDQng9l0Puv
A2akR6J6/kS98qLsi+mXkO282uVv63jYVbw2DHpg1c5LA9SeI0UqP5+GKRFCS7Oq
nz9padX4eulEBvy5Pp0NS4Pqx1/Xlby5+TpfkUX0fp5WVIriwsD+kfi6I3oJ+M7o
KspSFshBFNK1Mu14qTC/ROZMdQ5y//stlYwVZM9aytA2K1fI9YtqR0EQg9LTkNTM
CV3uZn+DK5cDaO2Zyy4oCNybzFQmIbU8iboSDIbN8a+/Bfx5iofoomtztpkYcou2
PMmCsnex7Skp83mmo2731Unszc9Xy/nBduUiiXbH3nn0vd7GPLYmOdyRzG77Wn72
0gs+72jCzrTTm5hswEsBv1w9riWiwZPwYozMsKchehFOTZgjsK6YmYUOzUK470SV
oQDH0ILbJClPtp++CSbSB50PGpM8sxLVWMonqvPYgeF3WH+fct0TXFXFOEHwuCFH
Xl0T1Bgx99p2D/rGwpC/Q63p5uGOgrDMyb1LnjS6Ot/mQrQrS26HHZYU0oM9xg3O
BvcU4SLPTn8n6Rfkdo2ap8/bDBIns2n8/VKc9Ndd31hbOPrjG6vyCTB5wGEpH3W5
u3d5Rfuzb9/LZWWPa/a9fLduEX8ETF01oLnbftaTZsfyk9hPibaFnF8ZI9DydQjB
IpM8z+syqiiPB1d2f9gxOHjnUWHU9vJbxQIDAQABozAwLjAsBgNVHREEJTAjgiFk
c2EwMS5nYi5ta2RlbW8ud2lsZGJvYXIuc29mdHdhcmUwDQYJKoZIhvcNAQELBQAD
ggEBADUAHXzAw7/1w05VqdNcx66usvDSm5YpJCPLP4Q8WPJBMLAsfJs+3WayDyTg
7wEhE+dVJ5b7Lgl67UmfMKnewkKl6ZxyAfF1WU2lz/RTbXVrTV+WVspGV+Zyx3l1
AIK486M67O06yI74sxaCxHDOlIZajBcFqKskB2LCBjVwE0pUqtZIocKOgUrUkbqB
5HZTNlxt5/bRKxZb8VAAUTHrAUevhcHyXVpZ7i9RS7HT01EaiSwQPjVGrc5oZu/g
bocnsriR9nnrxu8i+dIiXMk1ty78NzqUasS38j0qek7Wj3g5P+90OWImhoCC3Osf
n4J+pkIDjGD93mplf1Fla5+hNFU=
-----END CERTIFICATE-----`;

const validCertPath: Certificate[] = [
    eeCertPEM,
    trustAnchorPEM,
]
    .flatMap(PEMObject.parse)
    .map((p) => {
        const el = new DERElement();
        el.fromBytes(p.data);
        return _decode_Certificate(el);
    });

const invalidCertPathAlteredSignature: Certificate[] = [
    eeCertPEMWithAlteredSig,
    trustAnchorPEM,
]
    .flatMap(PEMObject.parse)
    .map((p) => {
        const el = new DERElement();
        el.fromBytes(p.data);
        return _decode_Certificate(el);
    });

const trustAnchorList: TrustAnchorList = [
    {
        certificate: validCertPath[validCertPath.length - 1],
    },
];

describe("verifyCertPath()", () => {
    it("accepts a valid certification path", async () => {
        const args: VerifyCertPathArgs = {
            validityTime: new Date(2022, 6, 23, 12, 0, 0),
            certPath: validCertPath,
            trustAnchors: trustAnchorList,
            initial_excluded_subtrees_set: [],
            initial_explicit_policy: false,
            initial_inhibit_any_policy: true,
            initial_permitted_subtrees_set: [],
            initial_policy_mapping_inhibit: true,
            initial_policy_set: [],
            initial_required_name_forms: [],
        };
        const response = await verifyCertPath(ctx, args);
        expect(response.returnCode).toBe(0);
        expect(response.warnings).toHaveLength(0);
    });

    it("rejects a certification path with an altered signature", async () => {
        const args: VerifyCertPathArgs = {
            validityTime: new Date(2022, 6, 23, 12, 0, 0),
            certPath: invalidCertPathAlteredSignature,
            trustAnchors: trustAnchorList,
            initial_excluded_subtrees_set: [],
            initial_explicit_policy: true,
            initial_inhibit_any_policy: true,
            initial_permitted_subtrees_set: [],
            initial_policy_mapping_inhibit: true,
            initial_policy_set: [],
            initial_required_name_forms: [],
        };
        const response = await verifyCertPath(ctx, args);
        expect(response.returnCode).not.toBe(0);
        expect(response.warnings).toHaveLength(0);
    });

    it("rejects a certification path after it expires", async () => {
        const args: VerifyCertPathArgs = {
            validityTime: new Date(2052, 6, 23, 12, 0, 0),
            certPath: validCertPath,
            trustAnchors: trustAnchorList,
            initial_excluded_subtrees_set: [],
            initial_explicit_policy: true,
            initial_inhibit_any_policy: true,
            initial_permitted_subtrees_set: [],
            initial_policy_mapping_inhibit: true,
            initial_policy_set: [],
            initial_required_name_forms: [],
        };
        const response = await verifyCertPath(ctx, args);
        expect(response.returnCode).not.toBe(0);
        expect(response.warnings).toHaveLength(0);
    });
});
