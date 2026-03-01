import { Buffer } from "node:buffer";
import {
    ASN1UniversalType,
    type External,
    type OBJECT_IDENTIFIER,
    ObjectIdentifier,
    type ASN1Element,
} from "@wildboar/asn1";
import type { Context } from "../types/index.js";
import type { GeneralName } from "@wildboar/x500/CertificateExtensions";
import { stringifyDN } from "./stringifyDN.js";
import { directoryStringToString } from "@wildboar/x500";
import { _decode_AlgorithmIdentifier, type AlgorithmIdentifier } from "@wildboar/pki-stub";

const ID_UPN = ObjectIdentifier.fromString("1.3.6.1.4.1.311.20.2.3");
// const ID_PERSONAL_DATA = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.1");
// const ID_USER_GROUP = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.2");
const ID_PERMANENT_ID = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.3");
const ID_HW_MODULE_NAME = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.4");
const ID_XMPP_ADDR = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.5");
const ID_SIM = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.6");
const ID_SRV_NAME = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.7");
const ID_NAI_REALM = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.8");
const ID_SMTP_UTF8 = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.9");
const ID_ACP_NODE_NAME = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.10");
const ID_BUNDLE_EID = ObjectIdentifier.fromString("1.3.6.1.5.5.7.8.11");

function stringifyUnknownOrBadOtherName (type_id: OBJECT_IDENTIFIER, encoding: ASN1Element): string {
    const bytes = encoding.toBytes();
    const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return `otherName:${type_id.toString()}:0x${buf.toString("hex")}`;
}

function stringifyOtherName (othername: External): string {
    // These conditions should never be true for a well-formed OTHER-NAME.
    if (
        !othername.directReference
        || othername.encoding instanceof Uint8Array
        || othername.encoding instanceof Buffer
        || othername.encoding instanceof Uint8ClampedArray
    ) {
        return `otherName:[Cannot display malformed OTHER-NAME]`;
    }
    if (othername.directReference.isEqualTo(ID_UPN)) {
        return `otherName:UPN:${othername.encoding.utf8String}`;
    }
    // if (othername.directReference.isEqualTo(ID_PERSONAL_DATA)) {
    //     return `otherName:[Cannot display PERSONAL-DATA]`;
    // }
    // if (othername.directReference.isEqualTo(ID_USER_GROUP)) {
    //     return `otherName:[Cannot display USER-GROUP]`;
    // }
    if (othername.directReference.isEqualTo(ID_PERMANENT_ID)) {
        const [ el1, el2 ] = othername.encoding.sequence;
        if (!el1) {
            return `otherName:PermanentIdentifier:{}`;
        }
        if (el2) {
            return `otherName:PermanentIdentifier:{ identifierValue:"${el1.utf8String}", assigner:${el2.objectIdentifier.toString()} }`;
        }
        if (el1.tagNumber === ASN1UniversalType.utf8String) {
            return `otherName:PermanentIdentifier:{ identifierValue:"${el1.utf8String}" }`;
        } else {
            return `otherName:PermanentIdentifier:{ assigner:${el1.objectIdentifier.toString()} }`;
        }
    }
    if (othername.directReference.isEqualTo(ID_HW_MODULE_NAME)) {
        const [ el1, el2 ] = othername.encoding.sequence;
        if (!el2) {
            return stringifyUnknownOrBadOtherName(othername.directReference, othername.encoding);
        }
        return `otherName:HardwareModuleName:{ hwType:${el1.objectIdentifier.toString()}, hwSerialNum:${Buffer.from(el2.octetString).toString("hex")} }`;
    }
    if (othername.directReference.isEqualTo(ID_XMPP_ADDR)) {
        return `otherName:XMPPAddr:${othername.encoding.ia5String}`;
    }
    if (othername.directReference.isEqualTo(ID_SIM)) {
        const [ el1, el2, el3 ] = othername.encoding.sequence;
        if (!el3) {
            return stringifyUnknownOrBadOtherName(othername.directReference, othername.encoding);
        }
        let alg: AlgorithmIdentifier;
        try {
            alg = _decode_AlgorithmIdentifier(el1);
        } catch {
            return stringifyUnknownOrBadOtherName(othername.directReference, othername.encoding);
        }
        if (alg.parameters && alg.parameters.tagNumber !== ASN1UniversalType.nill) {
            return stringifyUnknownOrBadOtherName(othername.directReference, othername.encoding);
        }
        const s1 = `{ algorithm:${alg.algorithm.toString()} }`;
        const s2 = Buffer.from(el2.octetString).toString("hex");
        const s3 = Buffer.from(el3.octetString).toString("hex");
        return `otherName:SIM:{ hashAlg:${s1}, authorityRandom:${s2}, pEPSI:${s3} }`;
    }
    if (othername.directReference.isEqualTo(ID_SRV_NAME)) {
        return `otherName:SRVName:${othername.encoding.ia5String}`;
    }
    if (othername.directReference.isEqualTo(ID_NAI_REALM)) {
        return `otherName:NAIRealm:${othername.encoding.utf8String}`;
    }
    if (othername.directReference.isEqualTo(ID_SMTP_UTF8)) {
        return `otherName:SmtpUTF8Mailbox:${othername.encoding.utf8String}`;
    }
    if (othername.directReference.isEqualTo(ID_ACP_NODE_NAME)) {
        return `otherName:AcpNodeName:${othername.encoding.ia5String}`;
    }
    if (othername.directReference.isEqualTo(ID_BUNDLE_EID)) {
        return `otherName:BundleEID:${othername.encoding.ia5String}`;
    }
    return stringifyUnknownOrBadOtherName(othername.directReference, othername.encoding);
}

/**
 * @summary Convert a general name to a string
 * @description
 *
 * This function converts a `GeneralName` to a string according to the
 * procedures defined for the Lightweight Directory Access Protocol (LDAP), as
 * described in [IETF RFC 4514](https://datatracker.ietf.org/doc/html/rfc4514),
 * EXCEPT that it does not reverse the ordering of RDNs in the distinguished
 * name. (LDAP, for some reason, reverses the ordering of RDNs from that used by
 * X.500 directory systems, so this implementation does not do that.)
 *
 * @param ctx The context object
 * @param gn The distinguished name to be converted to a string
 * @returns The string representation of the distinguished name
 *
 * @function
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4514}
 */
export
function stringifyGN (
    ctx: Context,
    gn: GeneralName,
): string {
    const key = Object.keys(gn)[0];
    if ("otherName" in gn) {
        return stringifyOtherName(gn.otherName);
    } else if ("rfc822Name" in gn) {
        return `${key}:${gn.rfc822Name}`;
    } else if ("dNSName" in gn) {
        return `${key}:${gn.dNSName}`;
    } else if ("x400Address" in gn) {
        // TODO: Do something a little more thorough than this.
        return `${key}:[Cannot display X.400 address]`;
    } else if ("directoryName" in gn) {
        return `${key}:${stringifyDN(ctx, gn.directoryName.rdnSequence)}`;
    } else if ("ediPartyName" in gn) {
        if (gn.ediPartyName.nameAssigner) {
            return `${key}:${directoryStringToString(gn.ediPartyName.nameAssigner)}:${directoryStringToString(gn.ediPartyName.partyName)}`;
        } else {
            return `${key}:${directoryStringToString(gn.ediPartyName.partyName)}`;
        }
    } else if ("uniformResourceIdentifier" in gn) {
        return `${key}:${gn.uniformResourceIdentifier}`;
    } else if ("iPAddress" in gn) {
        return `${key}:${Array.from(gn.iPAddress).join(".")}`;
    } else if ("registeredID" in gn) {
        return `${key}:${gn.registeredID.toString()}`;
    } else {
        return "[Unrecognized GeneralName alternative]";
    }
}

export default stringifyDN;
