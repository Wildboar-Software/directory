import {
    ASN1Element,
    ENUMERATED,
    BIT_STRING,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    unpackBits,
    FALSE_BIT,
    TRUE_BIT,
    BERElement,
    INTEGER,
} from "@wildboar/asn1";
import { destringifyRDNSequence } from "@wildboar/ldap";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { normalizeAttributeDescription } from "@wildboar/ldap";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/InformationFramework";
import {
    SIGNED,
} from "@wildboar/x500/AuthenticationFramework";
import { DER, ASN1Encoder, _encodeNull } from "@wildboar/asn1/functional";
import type {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/EnhancedSecurity";
import { KeyObject, createSign, sign, KeyType, randomInt } from "crypto";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";
import { sa_Ed25519 } from "@wildboar/safecurves-pkix-18";
import {
    rSASSA_PSS_Type,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha1,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha224,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha384,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha512,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_224,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_384,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_sha3_512,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_shake128,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_shake256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    sha512WithRSAEncryption,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    ecdsa_with_SHA512,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    rSASSA_PSS,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    id_dsa_with_sha256,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    ReferenceType_superior,
    ReferenceType_subordinate,
    ReferenceType_cross,
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_supplier,
    ReferenceType_master,
    ReferenceType_immediateSuperior,
    ReferenceType_self,
    ReferenceType_ditBridge,
} from "@wildboar/x500/DistributedOperations";
import type {
    CommonArgumentsSeq,
} from "@wildboar/x500/DirectoryAbstractService";
import { PkiPath } from "@wildboar/pki-stub";
import {
    ContextSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyGrouping,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Name,
} from "@wildboar/x500/InformationFramework";
import { ROSETransport } from "@wildboar/rose-transport";
import { createConnection } from "node:net";
import { TLSSocket, TLSSocketOptions, connect as tlsConnect } from "node:tls";
import { IDMConnection } from "@wildboar/idm";
import { rose_transport_from_idm_socket } from "./idm.js";
import { rose_transport_from_itot_stack } from "./itot.js";
import { create_itot_stack, PresentationAddress } from "@wildboar/osi-net";
import { naddrToURI } from "@wildboar/x500";
import { readFileSync } from "node:fs";
import { PEMObject } from "@wildboar/pem";
import { differenceInSeconds } from "date-fns";
import { randomBytes } from "node:crypto";
import { ServiceControls } from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_localScope,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_subentries,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_allowWriteableCopy,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls_manageDSAITPlaneRef,
} from "@wildboar/x500/DirectoryAbstractService";
import { OperationalBindingID } from "@wildboar/x500/OperationalBindingManagement";
import { SecurityParameters } from "@wildboar/x500/DirectoryAbstractService";
import { Code } from "@wildboar/x500/CommonProtocolSpecification";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    EntryInformationSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import {

} from "@wildboar/asn1";
import {
    CertificatePair,
    CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import { Socket } from "node:net";
import {
    dap_ip,
    dsp_ip,
    dop_ip,
    disp_ip,
} from "@wildboar/x500/DirectoryIDMProtocols";
import {
    id_ac_directoryAccessAC,
    id_ac_directorySystemAC,
    id_ac_directoryOperationalBindingManagementAC,
    id_ac_shadowConsumerInitiatedAC,
    id_ac_shadowSupplierInitiatedAC,
    id_ac_shadowSupplierInitiatedAsynchronousAC,
    id_ac_shadowConsumerInitiatedAsynchronousAC,
} from "@wildboar/x500/DirectoryOSIProtocols";

export
interface SelectionOptions extends EntryInformationSelection {

}

/**
 * @summary A mapping of NodeJS hash name strings to their equivalent algorithm object identifiers
 * @description
 *
 * This is a mapping between NodeJS's algorithm identifiers, as used by the
 * `crypto.createHash()` function and their equivalent algorithm object
 * identifiers.
 *
 * You can run `crypto.getHashes()` to see which hash identifiers are defined
 * for a given NodeJS runtime.
 *
 * @see {@link digestOIDToNodeHash}, which is the reverse of this.
 * @see {@link https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options}
 * @see {@link https://nodejs.org/api/crypto.html#cryptogethashes}
 */
export
const nodeHashAlgStringToOID: Map<string, OBJECT_IDENTIFIER> = new Map([
    [ "sha1", id_sha1 ], // NOTE: This one differs from the others by requiring a NULL parameter.
    [ "sha224", id_sha224 ],
    [ "sha256", id_sha256 ],
    [ "sha384", id_sha384 ],
    [ "sha512", id_sha512 ],
    [ "sha3-244", id_sha3_224 ],
    [ "sha3-256", id_sha3_256 ],
    [ "sha3-384", id_sha3_384 ],
    [ "sha3-512", id_sha3_512 ],
    [ "shake128", id_shake128 ],
    [ "shake256", id_shake256 ],
]);

/**
 * @summary A mapping from a NodeJS private key and an algorithm object identifier to use for digital signature
 * @description
 *
 * A mapping from a NodeJS `crypto.KeyObject.asymmetricKeyType` and an algorithm
 * object identifier to use for digital signature.
 *
 * @see {@link https://nodejs.org/api/crypto.html#keyobjectasymmetrickeytype}
 */
 export
 const keyTypeToAlgOID: Map<KeyType, OBJECT_IDENTIFIER> = new Map([
     [ "rsa", sha512WithRSAEncryption ],
     [ "ec", ecdsa_with_SHA512 ],
     [ "dsa", id_dsa_with_sha256 ],
     [ "rsa-pss", rSASSA_PSS["&id"]! ],
     [ "ed25519", sa_Ed25519["&id"]! ],
]);

export
function destringifyDN (
    dn: string,
    nameToOID: (name: string) => OBJECT_IDENTIFIER | undefined | null,
    valueParser: (str: string) => ASN1Element,
): DistinguishedName {
    return Array.from(destringifyRDNSequence(
        dn,
        (syntax: string) => {
            const desc = normalizeAttributeDescription(Buffer.from(syntax));
            const oid = desc.indexOf(".") > -1
                ? ObjectIdentifier.fromString(desc)
                : nameToOID(desc);
            if (!oid) {
                return undefined;
            }
            return [
                oid,
                (value: string): ASN1Element => valueParser(value),
            ];
        },
    ))
        .map((rdn) => rdn.map((atav) => new AttributeTypeAndValue(
            atav[0],
            atav[1],
        )));
}

/**
 * @summary Generate a digital signature
 * @description
 *
 * This function generates a digital signature and returns both the signature
 * and the `AlgorithmIdentifier` of the signature algorithm used, or `null` if
 * no signature could be generated.
 *
 * @param key The private key to use for generating the signature
 * @param data The bytes or arrays of bytes to be signed.
 * @returns An `AlgorithmIdentifier` and a buffer representing the signature value,
 *  or `null` if a signature could not be generated.
 *
 * @function
 */
export
function generateSignature (
    key: KeyObject,
    data: Uint8Array | Uint8Array[], // Array of buffers to avoid unnecessary concat().
): [ AlgorithmIdentifier, Buffer ] | null {
    if (!key.asymmetricKeyType) {
        return null;
    }
    const supportedKeyType = (
        (key.asymmetricKeyType === "rsa") // Requires digest
        || (key.asymmetricKeyType === "ed25519") // NO digest
        || (key.asymmetricKeyType === "ec") // Requires digest? (If it is ECDSA: https://stackoverflow.com/questions/72761177/what-signature-algorithm-does-a-key-of-type-ec-use-in-nodejs)
        || (key.asymmetricKeyType === "dsa") // Requires digest
        || (key.asymmetricKeyType === "rsa-pss") // Requires digest
    );
    if (!supportedKeyType) {
        return null;
    }
    const signatureRequiresDigest: boolean = (key.asymmetricKeyType !== "ed25519");
    if (signatureRequiresDigest) {
        const algOID = keyTypeToAlgOID.get(key.asymmetricKeyType);
        if (!algOID) {
            return null;
        }
        let error: boolean = false;
        const param: ASN1Element | undefined = (() => {
            switch (key.asymmetricKeyType) {
                case ("rsa"): return _encodeNull(null, DER);
                case ("rsa-pss"): {
                    // TODO: This needs to be tested thoroughly, because it was
                    // not clear what the parameters are and how to translate
                    // their NodeJS values to the X.500 values.
                    const {
                        hashAlgorithm,
                        saltLength,
                    } = key.asymmetricKeyDetails!;
                    const haOID = nodeHashAlgStringToOID.get(hashAlgorithm!);
                    if (!haOID) {
                        error = true;
                        return undefined;
                    }
                    const hparam: ASN1Element | undefined = haOID.isEqualTo(id_sha1)
                        ? _encodeNull(null, DER)
                        : undefined;
                    // It seems like trailerField is always the default.
                    return rSASSA_PSS.encoderFor["&Type"]!(new rSASSA_PSS_Type(
                        new AlgorithmIdentifier(
                            haOID,
                            hparam,
                        ),
                        saltLength,
                        undefined,
                    ), DER);
                }
                default: {
                    return undefined;
                }
            }
        })();
        if (error) {
            return null;
        }
        const sigAlg = new AlgorithmIdentifier(
            algOID,
            param,
        );
        const signer = createSign((key.asymmetricKeyType === "dsa") ? "SHA256" : "SHA512");
        if (Array.isArray(data)) {
            for (const buffer of data) {
                signer.update(buffer);
            }
        } else {
            signer.update(data);
        }
        const sigValue = signer.sign(key);
        return [ sigAlg, sigValue ];
    } else {
        const sigValue = sign(null, Array.isArray(data) ? Buffer.concat(data) : data, key);
        const sigAlg = new AlgorithmIdentifier(
            sa_Ed25519["&id"]!,
        );
        return [ sigAlg, sigValue ];
    }
}

export
function generateSIGNED <T> (
    key: KeyObject,
    data: T,
    encoder: ASN1Encoder<T>,
): OPTIONALLY_PROTECTED<T> {
    const tbsBytes = encoder(data, DER).toBytes();
    const signingResult = generateSignature(key, tbsBytes);
    if (!signingResult) {
        return {
            unsigned: data,
        };
    }
    const [ sigAlg, sigValue ] = signingResult;
    return {
        signed: new SIGNED(
            data,
            sigAlg,
            unpackBits(sigValue),
            undefined,
            undefined,
        ),
    };
}

export type ReferenceType =
    | "superior"
    | "supr"
    | "subordinate"
    | "subr"
    | "cross"
    | "xr"
    | "nonSpecificSubordinate"
    | "nssr"
    | "supplier"
    | "master"
    | "immediateSuperior"
    | "immSupr"
    | "self"
    | "ditBridge"
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    ;

export
function ref_type_from (rt?: ReferenceType | INTEGER): ENUMERATED | undefined {
    if (!rt) {
        return undefined;
    }
    const key = typeof rt === "bigint"
        ? Number(rt)
        : rt;
    return ({
        "superior": ReferenceType_superior,
        "supr": ReferenceType_superior,
        "subordinate": ReferenceType_subordinate,
        "subr": ReferenceType_subordinate,
        "cross": ReferenceType_cross,
        "xr": ReferenceType_cross,
        "nonSpecificSubordinate": ReferenceType_nonSpecificSubordinate,
        "nssr": ReferenceType_nonSpecificSubordinate,
        "supplier": ReferenceType_supplier,
        "master": ReferenceType_master,
        "immediateSuperior": ReferenceType_immediateSuperior,
        "immSupr": ReferenceType_immediateSuperior,
        "self": ReferenceType_self,
        "ditBridge": ReferenceType_ditBridge,
        1: ReferenceType_superior,
        2: ReferenceType_subordinate,
        3: ReferenceType_cross,
        4: ReferenceType_nonSpecificSubordinate,
        5: ReferenceType_supplier,
        6: ReferenceType_master,
        7: ReferenceType_immediateSuperior,
        8: ReferenceType_self,
        9: ReferenceType_ditBridge,
    })[key];
}

export
interface ServiceOptions {
    preferChaining?: boolean;
    chainingProhibited?: boolean;
    localScope?: boolean;
    dontUseCopy?: boolean;
    dontDereferenceAliases?: boolean;
    subentries?: boolean;
    copyShallDo?: boolean;
    partialNameResolution?: boolean;
    manageDSAIT?: boolean;
    noSubtypeMatch?: boolean;
    noSubtypeSelection?: boolean;
    countFamily?: boolean;
    dontSelectFriends?: boolean;
    dontMatchFriends?: boolean;
    allowWriteableCopy?: boolean;
    priority?: number;
    timeLimit?: number;
    sizeLimit?: number;
    scopeOfReferral?: number;
    attributeSizeLimit?: number;
    manageDSAITPlaneRef?: {
        dsaName: DirectoryName;
        agreementID: {
            identifier: number;
            version: number;
        };
    };
    serviceType?: OIDOption;
    userClass?: number;
}

export
interface SecurityOptions {
    certification_path?: CertPathOption;
    requestSignedResult?: boolean;
    requestSignedError?: boolean;
}

export
interface CommonArguments extends ServiceOptions, SecurityOptions {
    criticalExtensions?: BitStringOption;
    operationContexts?: ContextSelection;
    familyGrouping?: FamilyGrouping;
    requestor?: CommonArgumentsSeq["requestor"];
    operationProgress?: CommonArgumentsSeq["operationProgress"];
    aliasedRDNs?: CommonArgumentsSeq["aliasedRDNs"];
    referenceType?: ReferenceType | INTEGER;
    entryOnly?: CommonArgumentsSeq["entryOnly"];
    exclusions?: CommonArgumentsSeq["exclusions"];
    nameResolveOnMaster?: CommonArgumentsSeq["nameResolveOnMaster"];
}

export
interface TargetsObject {
    object: DirectoryName;
}

export type DirectoryName = string | Name | DistinguishedName;
export type BitStringOption = string | BIT_STRING;
export type OIDOption = string | OBJECT_IDENTIFIER;
export type CertPathOption =
    | CertificationPath
    | PkiPath
    | string // File path string
    ;

/* TODO: Make socket NON-optional. This was a serious design mistake of mine,
because it means that the caller has no control of the socket until this
function returns. It means that errors can happen silently and apps can hang.
*/
export
function rose_from_url (
    url: string | URL,
    socket?: Socket | TLSSocket,
    address?: PresentationAddress,
    tlsOptions?: TLSSocketOptions,
    socket_timeout: number = 60_000,
): ROSETransport | null {
    const u: URL = (typeof url === "string")
        ? new URL(url)
        : url;
    const protocol = u.protocol.replace(/:/g, "").replace(/\//g, "").toLowerCase();
    const host = u.hostname;
    const port = Number.parseInt(u.port);
    if (!Number.isSafeInteger(port) || (port < 0 )|| (port > 65535)) {
        return null;
    }
    switch (protocol) {
        case ("idm"): {
            const tcpSocket = socket ?? createConnection({
                host,
                port,
                timeout: socket_timeout,
            });
            const idm = new IDMConnection(tcpSocket, tlsOptions);
            return rose_transport_from_idm_socket(idm);
        }
        case ("idms"): {
            const tlsSocket = (!socket || !(socket instanceof TLSSocket))
                ? tlsConnect({
                    host,
                    port,
                    ...tlsOptions,
                    timeout: socket_timeout,
                    socket,
                })
                : socket;
            const idm = new IDMConnection(tlsSocket, tlsOptions);
            return rose_transport_from_idm_socket(idm);
        }
        case ("itot"): {
            const tcpSocket = socket ?? createConnection({
                host,
                port,
                timeout: socket_timeout,
            });
            const itot = create_itot_stack(tcpSocket, {
                remoteAddress: address,
                sessionCaller: true,
                transportCaller: true,
            });
            return rose_transport_from_itot_stack(itot);
        }
        case ("itots"): {
            const tlsSocket = (!socket || !(socket instanceof TLSSocket))
                ? tlsConnect({
                    host,
                    port,
                    ...tlsOptions,
                    timeout: socket_timeout,
                    socket,
                })
                : socket;
            const itot = create_itot_stack(tlsSocket, {
                remoteAddress: address,
                sessionCaller: true,
                transportCaller: true,
            });
            return rose_transport_from_itot_stack(itot);
        }
        default: return null;
    }

}

// NOTE: This implementation uses just the first nAddress.
export
function rose_from_presentation_address (
    address: PresentationAddress,
    socket?: Socket | TLSSocket,
    tlsOptions?: TLSSocketOptions,
    socket_timeout: number = 60_000,
): ROSETransport | null {
    if (!address.nAddresses?.length) {
        return null;
    }
    const nAddress = address.nAddresses[0];
    const url = naddrToURI(nAddress);
    if (!url) {
        return null;
    }
    const u = new URL(url);
    return rose_from_url(u, socket, address, tlsOptions, socket_timeout);
}

export
function name_option_to_name (
    name: DirectoryName,
    nameToOID?: (name: string) => OBJECT_IDENTIFIER | undefined | null,
    valueParser?: (str: string) => ASN1Element,
): Name | null {
    if (Array.isArray(name)) {
        return {
            rdnSequence: name,
        };
    } else if (typeof name === "object") {
        return name;
    } else {
        if (!nameToOID || !valueParser) {
            return null;
        }
        return {
            rdnSequence: destringifyDN(name, nameToOID, valueParser),
        };
    }
}

export
function selection_option_to_selection (sel?: SelectionOptions): EntryInformationSelection | undefined {
    if (!sel) {
        return undefined;
    }
    return new EntryInformationSelection(
        sel.attributes,
        sel.infoTypes,
        sel.extraAttributes,
        sel.contextSelection,
        sel.returnContexts,
        sel.familyReturn,
    );
}

export
function oid_option_to_oid (oid: OIDOption): OBJECT_IDENTIFIER {
    if (typeof oid === "string") {
        return ObjectIdentifier.fromString(oid);
    } else {
        return oid;
    }
}

export
function service_option_to (so: ServiceOptions): ServiceControls {
    const opts = new Uint8ClampedArray(15);
    opts[ServiceControlOptions_preferChaining] = so.preferChaining ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_chainingProhibited] = so.chainingProhibited ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_localScope] = so.localScope ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontUseCopy] = so.dontUseCopy ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontDereferenceAliases] = so.dontDereferenceAliases ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_subentries] = so.subentries ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_copyShallDo] = so.copyShallDo ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_partialNameResolution] = so.partialNameResolution ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_manageDSAIT] = so.manageDSAIT ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_noSubtypeMatch] = so.noSubtypeMatch ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_noSubtypeSelection] = so.noSubtypeSelection ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_countFamily] = so.countFamily ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontSelectFriends] = so.dontSelectFriends ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontMatchFriends] = so.dontMatchFriends ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_allowWriteableCopy] = so.allowWriteableCopy ? TRUE_BIT : FALSE_BIT;
    const mdsaitPlaneName = so.manageDSAITPlaneRef?.dsaName
        ? name_option_to_name(so.manageDSAITPlaneRef.dsaName)
        : undefined;
    return new ServiceControls(
        opts,
        so.priority,
        so.timeLimit
            ? ((typeof so.timeLimit === "object")
                ? Math.abs(differenceInSeconds(so.timeLimit, new Date()))
                : so.timeLimit)
            : undefined,
        so.sizeLimit,
        so.scopeOfReferral,
        so.attributeSizeLimit,
        mdsaitPlaneName
            ? new ServiceControls_manageDSAITPlaneRef(
                mdsaitPlaneName,
                new OperationalBindingID(
                    so.manageDSAITPlaneRef!.agreementID.identifier,
                    so.manageDSAITPlaneRef!.agreementID.version,
                ),
            )
            : undefined,
        so.serviceType
            ? oid_option_to_oid(so.serviceType)
            : undefined,
        so.userClass,
        [],
    );
}

export
function cert_path_from_option (cp?: CertPathOption): CertificationPath | undefined {
    if (!cp) {
        return undefined;
    }
    if (cp instanceof CertificationPath) {
        return cp;
    } else if (Array.isArray(cp) && (cp.length > 0)) {
        const userCert = cp[cp.length - 1] as Certificate;
        return new CertificationPath(
            userCert,
            (cp as Certificate[])
                .slice(0, -1)
                .reverse()
                .map((c: Certificate) => new CertificatePair(c, undefined)),
        );
    } else if (typeof cp === "string") {
        const certFile = readFileSync(cp, { encoding: "utf-8" });
        const certPems = PEMObject.parse(certFile);
        const certs = certPems.map((certPem) => {
            const el = new BERElement();
            el.fromBytes(certPem.data);
            return _decode_Certificate(el);
        });
        return cert_path_from_option(certs.reverse());
    } else {
        return undefined;
    }
}

export
function security_params_from (p: SecurityOptions, opCode: Code): SecurityParameters | undefined {
    if (!p.certification_path && !p.requestSignedResult && !p.requestSignedError) {
        return undefined;
    }
    const cert_path = cert_path_from_option(p.certification_path);
    return new SecurityParameters(
        cert_path,
        undefined, // Name
        cert_path
            ? {
                generalizedTime: new Date((new Date()).valueOf() + 60000),
            }
            : undefined,
        cert_path
            ? unpackBits(randomBytes(4))
            : undefined,
        p.requestSignedResult
            ? ProtectionRequest_signed
            : undefined,
        opCode,
        p.requestSignedError
            ? ErrorProtectionRequest_signed
            : undefined,
        undefined,
        undefined,
    );
}

export
function critex_from (bits?: BitStringOption): BIT_STRING | undefined {
    if (!bits) {
        return undefined;
    }
    if (bits instanceof Uint8ClampedArray) {
        return bits;
    } else {
        return new Uint8ClampedArray(
            Array
                .from(bits)
                .map((char) => (char === "1") ? TRUE_BIT : FALSE_BIT),
        );
    }
}

export
interface DirectoryVersioned {
    directoryVersion: number;
}

export const MAX_INVOKE_ID: number = 2147483647;

export
function generateUnusedInvokeId (): number {
    return randomInt(MAX_INVOKE_ID);
}

export
const protocol_id_to_app_context: Map<string, OBJECT_IDENTIFIER> = new Map([
    [ dap_ip["&id"]!.toString(), id_ac_directoryAccessAC ],
    [ dsp_ip["&id"]!.toString(), id_ac_directorySystemAC ],
    [ dop_ip["&id"]!.toString(), id_ac_directoryOperationalBindingManagementAC ],
    [ disp_ip["&id"]!.toString(), id_ac_shadowSupplierInitiatedAsynchronousAC ], // I don't know how to map this one...
    [ id_ac_directoryAccessAC.toString(), id_ac_directoryAccessAC ],
    [ id_ac_directorySystemAC.toString(), id_ac_directorySystemAC ],
    [ id_ac_directoryOperationalBindingManagementAC.toString(), id_ac_directoryOperationalBindingManagementAC ],
    [ id_ac_shadowConsumerInitiatedAC.toString(), id_ac_shadowConsumerInitiatedAC ],
    [ id_ac_shadowSupplierInitiatedAC.toString(), id_ac_shadowSupplierInitiatedAC ],
    [ id_ac_shadowSupplierInitiatedAsynchronousAC.toString(), id_ac_shadowSupplierInitiatedAsynchronousAC ],
    [ id_ac_shadowConsumerInitiatedAsynchronousAC.toString(), id_ac_shadowConsumerInitiatedAsynchronousAC ],
]);

export
const app_context_to_protocol_id: Map<string, OBJECT_IDENTIFIER> = new Map([
    [ dap_ip["&id"]!.toString(), dap_ip["&id"]! ],
    [ dsp_ip["&id"]!.toString(), dsp_ip["&id"]! ],
    [ dop_ip["&id"]!.toString(), dop_ip["&id"]! ],
    [ disp_ip["&id"]!.toString(), disp_ip["&id"]! ],
    [ id_ac_directoryAccessAC.toString(), dap_ip["&id"]! ],
    [ id_ac_directorySystemAC.toString(), dsp_ip["&id"]! ],
    [ id_ac_directoryOperationalBindingManagementAC.toString(), dop_ip["&id"]! ],
    [ id_ac_shadowConsumerInitiatedAC.toString(), disp_ip["&id"]! ],
    [ id_ac_shadowSupplierInitiatedAC.toString(), disp_ip["&id"]! ],
    [ id_ac_shadowSupplierInitiatedAsynchronousAC.toString(), disp_ip["&id"]! ],
    [ id_ac_shadowConsumerInitiatedAsynchronousAC.toString(), disp_ip["&id"]! ],
]);

/**
 * @summary Compute the value of `ROSETransport.protocol`
 * @description
 *
 * The `ROSETransport` abstraction is supposed to be abstract enough to not
 * concern itself with the means by which ROSE PDUs are transported (IDM, ITOT,
 * LPP, XOT, etc.), but some of the object identifiers used in these transports
 * are specific to the transport mechanism. For instance, the Directory Access
 * Protocol uses a different protocol ID when transported over IDM versus its
 * corresponding application context when transported over OSI networking.
 *
 * To remove this coupling, This function shall be used to translate the
 * protocol identifer supplied in bind arguments and results to an object
 * identifier that shall be used to identify a directory protocol at the ROSE
 * layer.
 *
 * Concretely, this implementation uses the application context object
 * identifiers to identify protocols rather than IDM protocol object
 * identifiers, simply because there are more application context object
 * identifiers (there are multiple OSI DISP application contexts, but only one
 * IDM DISP protocol), and therefore, it is less ambiguous.
 *
 * @param pid The protocol ID or application context
 * @returns The object identifier that should be used to populate the `protocol`
 *  field on a `ROSETransport` object.
 *
 * @function
 */
export
const protocol_id_to_rose_protocol
    = (pid: OBJECT_IDENTIFIER): OBJECT_IDENTIFIER | undefined => protocol_id_to_app_context.get(pid.toString());

export
interface OperationOptions {
    /** The number of milliseconds before the operation will time out. */
    timeout?: number;
}

export
interface DirectoryOperationOptions extends OperationOptions {
    /** The private key used to sign requests. */
    key?: KeyObject;
    /** The certification path provided to verify signed requests from this client. */
    cert_path?: CertPathOption;
}
