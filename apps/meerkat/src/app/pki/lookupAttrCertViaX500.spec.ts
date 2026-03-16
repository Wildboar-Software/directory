import { _decode_Certificate } from "@wildboar/x500/AuthenticationFramework";
import {
    _decode_ReadResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _decode_Name,
    type Name,
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import {
    type CertificateSerialNumber,
    SIGNED,
    _get_encoder_for_SIGNED,
    AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";
import { DERElement, ObjectIdentifier } from "@wildboar/asn1";
import { createPersonEntry, getMockCtx } from "../testing.spec.js";
import {
    commonName,
    temporalContext,
    TimeSpecification,
    TimeSpecification_time_absolute,
} from "@wildboar/x500/SelectedAttributeTypes";
import { DER } from "@wildboar/asn1/functional";
import { rsaEncryption } from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    _encode_AttributeCertificate,
    AttCertIssuer,
    AttCertValidityPeriod,
    AttCertVersion_v2,
    Holder,
    TBSAttributeCertificate,
} from "@wildboar/pki-stub";
import lookupAttrCertViaX500 from "./lookupAttrCertViaX500.js";
import { addDays, subDays, subMinutes } from "date-fns";

describe("lookupAttrCertViaX500()", () => {
    it("can return an attribute certificate for a delegation path", async () => {
        const ctx = getMockCtx();
        const subjectName: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({
                            uTF8String: "subject",
                        }, DER),
                    ),
                ]
            ],
        };
        const issuerName: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({
                            uTF8String: "issuer",
                        }, DER),
                    ),
                ]
            ],
        };
        const serialNumber: CertificateSerialNumber = Buffer.from("deadbeef", "hex");

        const algId = new AlgorithmIdentifier(
            rsaEncryption,
            undefined,
        );

        const tbs = new TBSAttributeCertificate(
            AttCertVersion_v2,
            new Holder(
                undefined,
                [
                    {
                        directoryName: subjectName,
                    },
                ],
            ),
            new AttCertIssuer(
                [
                    {
                        directoryName: issuerName,
                    },
                ],
            ),
            algId,
            serialNumber,
            new AttCertValidityPeriod(
                new Date(),
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            ),
            [],
        );
        const cert = new SIGNED(
            tbs,
            algId,
            new Uint8ClampedArray(32),
            undefined,
            undefined,
        );
        const certEl = _encode_AttributeCertificate(cert, DER);

        const person = await createPersonEntry(ctx, ctx.dit.root, "subject", "mcgubject");

        // This doesn't really have to make sense.
        const storedDelegationPath = [ certEl, certEl ];

        await ctx.db.attributeValue.create({
            data: {
                entry_id: person.dse.id,
                type_oid: ObjectIdentifier.fromString("2.5.4.73").toBytes(), // delegationPath
                tag_class: 0,
                constructed: true,
                tag_number: 16,
                content_octets: DERElement.fromSequence(storedDelegationPath).value,
                operational: false,
            },
            select: {
                id: true,
            },
        });
        const attrCertReturned = await lookupAttrCertViaX500(
            ctx,
            subjectName,
            false,
        );
        expect(attrCertReturned).toBeTruthy();
    });

    it("can still return a single attribute certificate as long as delegationPath and attributeCertificateAttribute have the same attribute certificate", async () => {
        const ctx = getMockCtx();
        const subjectName: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({
                            uTF8String: "subject",
                        }, DER),
                    ),
                ]
            ],
        };
        const issuerName: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({
                            uTF8String: "issuer",
                        }, DER),
                    ),
                ]
            ],
        };
        const serialNumber: CertificateSerialNumber = Buffer.from("deadbeef", "hex");

        const algId = new AlgorithmIdentifier(
            rsaEncryption,
            undefined,
        );

        const tbs = new TBSAttributeCertificate(
            AttCertVersion_v2,
            new Holder(
                undefined,
                [
                    {
                        directoryName: subjectName,
                    },
                ],
            ),
            new AttCertIssuer(
                [
                    {
                        directoryName: issuerName,
                    },
                ],
            ),
            algId,
            serialNumber,
            new AttCertValidityPeriod(
                new Date(),
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            ),
            [],
        );
        const cert = new SIGNED(
            tbs,
            algId,
            new Uint8ClampedArray(32),
            undefined,
            undefined,
        );
        const certEl = _encode_AttributeCertificate(cert, DER);

        const person = await createPersonEntry(ctx, ctx.dit.root, "subject", "mcgubject");

        await ctx.db.attributeValue.create({
            data: {
                entry_id: person.dse.id,
                type_oid: ObjectIdentifier.fromString("2.5.4.58").toBytes(), // attributeCertificateAttribute
                tag_class: 0,
                constructed: true,
                tag_number: 16,
                content_octets: certEl.value as Uint8Array<ArrayBuffer>,
                operational: false,
            },
            select: {
                id: true,
            },
        });

        // This doesn't really have to make sense.
        const storedDelegationPath = [ certEl, certEl ];

        await ctx.db.attributeValue.create({
            data: {
                entry_id: person.dse.id,
                type_oid: ObjectIdentifier.fromString("2.5.4.73").toBytes(), // delegationPath
                tag_class: 0,
                constructed: true,
                tag_number: 16,
                content_octets: DERElement.fromSequence(storedDelegationPath).value,
                operational: false,
            },
            select: {
                id: true,
            },
        });
        const attrCertReturned = await lookupAttrCertViaX500(
            ctx,
            subjectName,
            false,
        );
        expect(attrCertReturned).toBeTruthy();
    });

    it.only("does not return attribute certificates that are not applicable to the given time", async () => {
        const ctx = getMockCtx();
        const subjectName: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({
                            uTF8String: "subject",
                        }, DER),
                    ),
                ]
            ],
        };
        const issuerName: Name = {
            rdnSequence: [
                [
                    new AttributeTypeAndValue(
                        commonName["&id"],
                        commonName.encoderFor["&Type"]!({
                            uTF8String: "issuer",
                        }, DER),
                    ),
                ]
            ],
        };
        const serialNumber: CertificateSerialNumber = Buffer.from("deadbeef", "hex");

        const algId = new AlgorithmIdentifier(
            rsaEncryption,
            undefined,
        );

        const tbs1 = new TBSAttributeCertificate(
            AttCertVersion_v2,
            new Holder(
                undefined,
                [
                    {
                        directoryName: subjectName,
                    },
                ],
            ),
            new AttCertIssuer(
                [
                    {
                        directoryName: issuerName,
                    },
                ],
            ),
            algId,
            serialNumber,
            new AttCertValidityPeriod(
                new Date(),
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            ),
            [],
        );
        serialNumber[0]++;
        const tbs2 = new TBSAttributeCertificate(
            AttCertVersion_v2,
            new Holder(
                undefined,
                [
                    {
                        directoryName: subjectName,
                    },
                ],
            ),
            new AttCertIssuer(
                [
                    {
                        directoryName: issuerName,
                    },
                ],
            ),
            algId,
            serialNumber,
            new AttCertValidityPeriod(
                new Date(),
                new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            ),
            [],
        );
        const cert1 = new SIGNED(
            tbs1,
            algId,
            new Uint8ClampedArray(32),
            undefined,
            undefined,
        );
        const cert2 = new SIGNED(
            tbs2,
            algId,
            new Uint8ClampedArray(32),
            undefined,
            undefined,
        );

        // These certs differ by a serial number.
        const certEl1 = _encode_AttributeCertificate(cert1, DER);
        const certEl2 = _encode_AttributeCertificate(cert2, DER);

        const person = await createPersonEntry(ctx, ctx.dit.root, "subject", "mcgubject");

        // Create a value with cert1 that is within the asserted time.
        await ctx.db.attributeValue.create({
            data: {
                entry_id: person.dse.id,
                type_oid: ObjectIdentifier.fromString("2.5.4.58").toBytes(), // attributeCertificateAttribute
                tag_class: 0,
                constructed: true,
                tag_number: 16,
                content_octets: certEl1.value as Uint8Array<ArrayBuffer>,
                operational: false,
                ContextValue: {
                    create: {
                        type: temporalContext["&id"].toString(),
                        tag_class: 0,
                        constructed: true,
                        tag_number: 16,
                        ber: temporalContext.encoderFor["&Type"]!(new TimeSpecification(
                            {
                                absolute: new TimeSpecification_time_absolute(
                                    subDays(new Date(), 1),
                                    addDays(new Date(), 1),
                                ),
                            },
                            undefined,
                            undefined,
                            undefined,
                        ), DER).toBytes(),
                        fallback: false,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        // Create a value with cert2 that is outside the asserted time.
        await ctx.db.attributeValue.create({
            data: {
                entry_id: person.dse.id,
                type_oid: ObjectIdentifier.fromString("2.5.4.58").toBytes(), // attributeCertificateAttribute
                tag_class: 0,
                constructed: true,
                tag_number: 16,
                content_octets: certEl2.value as Uint8Array<ArrayBuffer>,
                operational: false,
                ContextValue: {
                    create: {
                        type: temporalContext["&id"].toString(),
                        tag_class: 0,
                        constructed: true,
                        tag_number: 16,
                        ber: temporalContext.encoderFor["&Type"]!(new TimeSpecification(
                            {
                                absolute: new TimeSpecification_time_absolute(
                                    addDays(new Date(), 1),
                                    addDays(new Date(), 2),
                                ),
                            },
                            undefined,
                            undefined,
                            undefined,
                        ), DER).toBytes(),
                        fallback: false,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        const attrCertReturned1 = await lookupAttrCertViaX500(
            ctx,
            subjectName,
            true, // Must be true to return attributeCertificateAttribute values.
            undefined, // No asserted time (meaning now)
        );
        expect(attrCertReturned1).toBeTruthy();

        const attrCertReturned2 = await lookupAttrCertViaX500(
            ctx,
            subjectName,
            true, // Must be true to return attributeCertificateAttribute values.
            subMinutes(new Date(), 10),
        );
        expect(attrCertReturned2).toBeTruthy();

        const attrCertReturned3 = await lookupAttrCertViaX500(
            ctx,
            subjectName,
            true, // Must be true to return attributeCertificateAttribute values.
            subDays(new Date(), 10),
        );
        expect(attrCertReturned3).toBeFalsy();
    });
});

