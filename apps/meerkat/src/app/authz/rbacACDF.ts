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
import { ds } from "@wildboar/parity-schema/src/lib/modules/Wildboar/ds.va";
import { attributeValueSecurityLabelContext } from "@wildboar/x500/src/lib/collections/contexts";
import {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_MODIFY,
    PERMISSION_CATEGORY_REMOVE,
} from "@wildboar/x500/src/lib/bac/bacACDF";

// TODO: Add this to the registry.
export const id_simpleSecurityPolicy = new ObjectIdentifier([ 403, 1 ], ds);

const modification_permissions: number[] = [
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_MODIFY,
    PERMISSION_CATEGORY_REMOVE,
];

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
    contexts: X500Context[],
    permissions: number[],
): boolean => {
    const label = signedLabel.toBeSigned.securityLabel;
    let classification = Number(label.security_classification ?? SecurityClassification_unmarked);
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
                return 0;
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
                /* Under the Simple Security Policy, unmarked is treated as
                being a level higher than unclassified. */
                return 1;
            }
            return 0;
        })();
        // Just to make sure that classification cannot be given a large,
        // illegitimate value to make a protected value universally inaccessible.
        // This also short circuits this function.
        if (clearanceLevel == SecurityClassification_top_secret) {
            return true;
        }
        if (clearanceLevel > highestClearanceLevel) {
            highestClearanceLevel = Number(clearanceLevel);
        }
    }

    if (highestClearanceLevel < classification) {
        return false;
    }
    /* If the user does not have top-secret clearance, but does have generally
    sufficient clearance, the only remaining reason we have to block them is if
    they are modifying the security labels themselves, in which case, access is
    denied, because, under the Simple Security Policy, you need top-secret
    clearance to modify the security labels. */
    const is_modification: boolean = permissions.some((p) => modification_permissions.includes(p));
    return (
        !is_modification
        || !contexts.some((c) => c.contextType.isEqualTo(attributeValueSecurityLabelContext["&id"]))
    );
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
        // If the user has no clearance, only allow access for things unclassified.
        return (label.toBeSigned.securityLabel.security_classification == SecurityClassification_unclassified);
    }
    const policyId = label.toBeSigned.securityLabel.security_policy_identifier
        ?? id_simpleSecurityPolicy;
    const acdf = ctx.rbacPolicies.get(policyId.toString());
    const relevantClearances = assn.clearances.filter((c) => c.policyId.isEqualTo(policyId));
    const userHasTopSecretClearance: boolean = relevantClearances
        .some((c) => (c.classList?.[ClassList_topSecret] === TRUE_BIT));
    if (!acdf) {
        /* If the policy is not understood, allow the request if unclassified or
        if the user has top-secret clearance for that policy. Otherwise, deny
        access. */
        return (
            (label.toBeSigned.securityLabel.security_classification === SecurityClassification_unclassified)
            || userHasTopSecretClearance
        );
    }

    const atav_hash_alg = digestOIDToNodeHash.get(label.toBeSigned.attHash.algorithmIdentifier.algorithm.toString());
    if (!atav_hash_alg) {
        return userHasTopSecretClearance; // Hash algorithm not understood.
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
        return userHasTopSecretClearance; // The hashes don't match up.
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
            return userHasTopSecretClearance;
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
            return userHasTopSecretClearance;
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
        // We grant access for only top-secret clearance, just to ensure that
        // problems can be rectified.
        return userHasTopSecretClearance;
    }
    if (!publicKey) {
        return userHasTopSecretClearance;
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
        return userHasTopSecretClearance;
    }
    // At this point, we know that the label is correctly bound to the value,
    // so we can use the policy-specific RBAC ACDF.
    return acdf(ctx, assn, target, label, value, contexts, permissions);
}
