import { Context, Vertex, ClientAssociation, RBAC_ACDF } from "@wildboar/meerkat-types";
import { compareDistinguishedName } from "@wildboar/x500";
import {
    SignedSecurityLabel,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/SignedSecurityLabel.ta";
import {
    _encode_SignedSecurityLabelContent,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/SignedSecurityLabelContent.ta";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import { ASN1Element, DERElement, ObjectIdentifier, TRUE_BIT, packBits } from "asn1-ts";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { KeyObject } from "node:crypto";
import { digestOIDToNodeHash } from "../pki/digestOIDToNodeHash";
import * as crypto from "node:crypto";
import { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    AttributeTypeAndValue,
    _encode_AttributeTypeAndValue,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import { DER } from "asn1-ts/dist/node/functional";
import { verifySignature } from "../pki/verifyCertPath";
import {
    ClassList_confidential,
    ClassList_restricted,
    ClassList_secret,
    ClassList_topSecret,
    ClassList_unmarked,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/ClassList.ta";
import {
    SecurityClassification,
    SecurityClassification_confidential,
    SecurityClassification_restricted,
    SecurityClassification_secret,
    SecurityClassification_top_secret,
    SecurityClassification_unclassified,
    SecurityClassification_unmarked,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/SecurityClassification.ta";
import {
    id_wildboar,
} from "@wildboar/parity-schema/src/lib/modules/Wildboar/id-wildboar.va";

// TODO: Add this to the registry.
export const id_simpleSecurityPolicy = new ObjectIdentifier([ 403, 1 ], id_wildboar);


/**
 * @summary A simple Rule-Based Access Control ACDF
 * @description
 *
 * This RBAC ACDF is built-in to Meerkat DSA to provide a sensible default and
 * sample ACDF.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param target The target object
 * @param signedLabel The security label, after being verified
 * @param _value The value to which authorization is sought
 * @param _contexts The contexts associated with the value
 * @param _permissions The permissions sought on the attribute value
 * @returns A `boolean` indicating whether access is granted to the value
 */
export
const simple_rbac_acdf: RBAC_ACDF = (
    ctx: Context,
    assn: ClientAssociation, // This has a clearance field.
    target: Vertex,
    signedLabel: SignedSecurityLabel,
    _value: ASN1Element,
    _contexts: X500Context[],
    _permissions: number[],
): boolean => {
    const label = signedLabel.toBeSigned.securityLabel;
    const classification = Number(label.security_classification ?? SecurityClassification_unmarked);
    if (classification === SecurityClassification_unclassified) {
        return true; // If unclassified, the user may always see it.
    }
    /* "unmarked" is treated as more sensitive than "unclassified," but it is
    numerically lower than "unclassified" among the named integers of the
    `SecurityClassification` type. We perform the swap here. */
    if (classification === SecurityClassification_unclassified) {
        classification = 0;
    } else if (classification === SecurityClassification_unmarked) {
        classification = 1;
    }
    const policyId = label.security_policy_identifier ?? id_simpleSecurityPolicy;
    let highestClearanceLevel: number = 0;
    for (const clearance of assn.clearances) {
        if (!clearance.policyId.isEqualTo(policyId)) {
            continue;
        }
        const clearanceLevel: SecurityClassification = (() => {
            if (!clearance.classList) {
                return SecurityClassification_unclassified;
            }
            else if (clearance.classList[ClassList_topSecret] === TRUE_BIT) {
                return SecurityClassification_top_secret;
            }
            else if (clearance.classList[ClassList_secret] === TRUE_BIT) {
                return SecurityClassification_secret;
            }
            else if (clearance.classList[ClassList_confidential] === TRUE_BIT) {
                return SecurityClassification_confidential;
            }
            else if (clearance.classList[ClassList_restricted] === TRUE_BIT) {
                return SecurityClassification_restricted;
            }
            else if (clearance.classList[ClassList_unmarked] === TRUE_BIT) {
                return SecurityClassification_unmarked;
            }
            else {
                return SecurityClassification_unclassified;
            }
        })();
        if (clearanceLevel > highestClearanceLevel) {
            highestClearanceLevel = Number(clearanceLevel);
        }
    }
    // Just to make sure that classification cannot be given a large,
    // illegitimate value to make a protected value universally inaccessible.
    if (highestClearanceLevel == SecurityClassification_top_secret) {
        return true;
    }
    return (highestClearanceLevel >= classification);
};

// TODO: Log invalid hashes and such so admins can know if they are locked out of values.

/**
 * @summary Rule-Based Access Control Decision Function
 * @description
 *
 * This function evaluates access to an attribute value according to
 * Rule-Based Access Control (RBAC).
 *
 * @param ctx The context object
 * @param assn The association
 * @param target The target object
 * @param label The security label
 * @param attributeType the attribute type to which authorization is requested
 * @param value The attribute value to which authorization is requested
 * @param contexts The contexts associated with the attribute value
 * @param permissions The permissions requested on the attribute value
 * @returns A `boolean` indicating whether access is granted to the value
 *
 * @function
 */
export function rbacACDF (
    ctx: Context,
    assn: ClientAssociation, // This has a clearance field.
    target: Vertex,
    label: SignedSecurityLabel,
    attributeType: AttributeType,
    value: ASN1Element,
    contexts: X500Context[],
    permissions: number[],
): boolean {
    if (!assn.clearances.length) {
        // If the user has no clearance, only allow access for things unmarked.
        return (label.toBeSigned.securityLabel.security_classification == SecurityClassification_unclassified);
    }
    // const applicable_clearances = assn.clearances.filter((c) => c.policyId.isEqualTo(label.))
    const policyId = label.toBeSigned.securityLabel.security_policy_identifier
        ?? id_basicSecurityPolicy;
    const acdf = ctx.rbacPolicies.get(policyId.toString());
    if (!acdf) {
        return false; // If the policy ID is not understood, deny access.
    }

    const atav_hash_alg = digestOIDToNodeHash.get(label.toBeSigned.attHash.algorithmIdentifier.algorithm.toString());
    if (!atav_hash_alg) {
        return false; // Hash algorithm not understood.
    }
    const atav = new AttributeTypeAndValue(attributeType, value);
    const atav_bytes = _encode_AttributeTypeAndValue(atav, DER).toBytes();
    const hasher = crypto.createHash(atav_hash_alg);
    hasher.update(atav_bytes);
    const calculated_digest = hasher.digest();
    const provided_digest_bytes = packBits(label.toBeSigned.attHash.hashValue);
    const provided_digest = Buffer.from(
        provided_digest_bytes.buffer,
        provided_digest_bytes.byteOffset,
        provided_digest_bytes.byteLength,
    );

    if (Buffer.compare(calculated_digest, provided_digest)) {
        return false; // The hashes don't match up.
    }

    const namingMatcher = getNamingMatcherGetter(ctx);
    let publicKey: KeyObject | undefined;
    if ( // If no keyIdentifier, and no issuer or the issuer is this DSA...
        !label.toBeSigned.keyIdentifier
        && (
            !label.toBeSigned.issuer
            || compareDistinguishedName(
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                label.toBeSigned.issuer.rdnSequence,
                namingMatcher,
            )
        )
    ) { // Then we validate the signature against this DSA's signing key.
        publicKey = ctx.config.signing.key;
    } else if (label.toBeSigned.keyIdentifier) {
        const key_id = Buffer.from(label.toBeSigned.keyIdentifier).toString("base64");
        const authority = ctx.labellingAuthorities.get(key_id);
        if (authority === null) {
            return false;
        }
        const issuer = label.toBeSigned.issuer;
        const authority_is_valid: boolean = !!(
            authority
            && authority.authorized
            && (
                !issuer
                || authority.issuerNames.some((iss_name) => compareDistinguishedName(
                    iss_name.rdnSequence,
                    issuer.rdnSequence,
                    namingMatcher,
                ))
            )
        );
        if (!authority_is_valid) {
            return false;
        }
        publicKey = authority?.publicKey;
    } else if (label.toBeSigned.issuer) {
        const issuer = label.toBeSigned.issuer;
        for (const authority of ctx.labellingAuthorities.values()) {
            if (!authority) {
                continue;
            }
            if (!authority.authorized) {
                continue;
            }
            const issuer_names_match: boolean = authority.issuerNames
                .some((iss_name) => compareDistinguishedName(
                    iss_name.rdnSequence,
                    issuer.rdnSequence,
                    namingMatcher,
                ));
            if (!issuer_names_match) {
                continue;
            }
            publicKey = authority.publicKey;
        }
    } else { // This should actually be unreachable.
        return false;
    }
    if (!publicKey) {
        return false;
    }
    const tbs_bytes = label.originalDER
        ? (() => {
            const el = new DERElement();
            el.fromBytes(label.originalDER);
            const tbs = el.sequence[0];
            return tbs.toBytes();
        })()
        : _encode_SignedSecurityLabelContent(label.toBeSigned, DER).toBytes();
    const sig_value = packBits(label.signature);
    const sig_valid = verifySignature(
        tbs_bytes,
        label.algorithmIdentifier,
        sig_value,
        publicKey,
    );
    if (!sig_valid) {
        return false;
    }
    // At this point, we know that the label is correctly bound to the value,
    // so we can use the policy-specific RBAC ACDF.
    return acdf(ctx, assn, target, label, value, contexts, permissions);
}
