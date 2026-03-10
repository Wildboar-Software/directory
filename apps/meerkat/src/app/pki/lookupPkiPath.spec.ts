import { lookupPkiPathViaX500 } from "./lookupPkiPath.js";
import { _decode_Certificate, Validity, SubjectPublicKeyInfo } from "@wildboar/x500/AuthenticationFramework";
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
    TBSCertificate,
    _encode_TBSCertificate,
    _encode_Certificate,
    AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";
import { DERElement, ObjectIdentifier } from "@wildboar/asn1";
import { createPersonEntry, getMockCtx } from "../testing.spec.js";
import { commonName } from "@wildboar/x500/SelectedAttributeTypes";
import { DER } from "@wildboar/asn1/functional";
import { rsaEncryption } from "@wildboar/x500/AlgorithmObjectIdentifiers";

describe("lookupPkiPathViaX500()", () => {
    it("can return a PKI path", async () => {
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

        const tbs = new TBSCertificate(
            2,
            serialNumber,
            algId,
            issuerName,
            new Validity(
                { generalizedTime: new Date() },
                { generalizedTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) },
            ),
            subjectName,
            new SubjectPublicKeyInfo(
                algId,
                new Uint8ClampedArray(32),
            ),
        );
        const cert = new SIGNED(
            tbs,
            algId,
            new Uint8ClampedArray(32),
            undefined,
            undefined,
        );
        const certEl =_encode_Certificate(cert, DER);

        const person = await createPersonEntry(ctx, ctx.dit.root, "subject", "mcgubject");

        // This doesn't really have to make sense.
        const storedPkiPath = [ certEl, certEl ];

        await ctx.db.attributeValue.create({
            data: {
                entry_id: person.dse.id,
                type_oid: ObjectIdentifier.fromString("2.5.4.70").toBytes(), // pkiPath
                tag_class: 0,
                constructed: true,
                tag_number: 16,
                content_octets: DERElement.fromSequence(storedPkiPath).value,
                operational: false,
            },
            select: {
                id: true,
            },
        });

        const pkiPathReturned = await lookupPkiPathViaX500(ctx, subjectName, issuerName, serialNumber);
        expect(pkiPathReturned).toBeDefined();
        expect(pkiPathReturned).toHaveLength(2);
    });

    it("can return a single certificate", async () => {
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

        const tbs = new TBSCertificate(
            2,
            serialNumber,
            algId,
            issuerName,
            new Validity(
                { generalizedTime: new Date() },
                { generalizedTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) },
            ),
            subjectName,
            new SubjectPublicKeyInfo(
                algId,
                new Uint8ClampedArray(32),
            ),
        );
        const cert = new SIGNED(
            tbs,
            algId,
            new Uint8ClampedArray(32),
            undefined,
            undefined,
        );
        const certEl =_encode_Certificate(cert, DER);

        const person = await createPersonEntry(ctx, ctx.dit.root, "subject", "mcgubject");

        await ctx.db.attributeValue.create({
            data: {
                entry_id: person.dse.id,
                type_oid: ObjectIdentifier.fromString("2.5.4.36").toBytes(), // userCertificate
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

        const pkiPathReturned = await lookupPkiPathViaX500(ctx, subjectName, issuerName, serialNumber);
        expect(pkiPathReturned).toBeDefined();
        expect(pkiPathReturned).toHaveLength(1);
    });
});
