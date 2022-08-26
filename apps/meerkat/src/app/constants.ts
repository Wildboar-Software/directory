import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import {
    ContextAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ContextAssertion.ta";
import {
    temporalContext,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/temporalContext.oa";
import { DER } from "asn1-ts/dist/node/functional";
import { ObjectIdentifier } from "asn1-ts";
import {
    id_ce_extKeyUsage,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/id-ce-extKeyUsage.va";

export const updatesDomain: string = "updates.meerkat.wildboar.software";
export const telemetryDomain: string = "telemetry.meerkat.wildboar.software";
export const CONTEXT: string = "CONTEXT";
export const MINIMUM_MAX_ATTR_SIZE: number = 8;
export const MAX_RESULTS: number = 10_000_000;
export const MAX_TRAVERSAL: number = 100000;
export const DEFAULT_IDM_BUFFER_SIZE: number = 1_000_000;
export const DEFAULT_LDAP_BUFFER_SIZE: number = 1_000_000;
export const MAX_SORT_KEYS: number = 3;
export const DEFAULT_REMOTE_CRL_CACHE_TTL: number = 300; // Five minutes.
export const DEFAULT_REMOTE_CRL_SIZE_LIMIT: number = 1_000_000; // 1MB, which is a pretty large CRL.

// IP Blacklist Reasons
export const IP_BL_REASON_SLOW_LORIS: string = "SLOW_LORIS";
export const IP_BL_REASON_HUGE_INVOKE_ID: string = "HUGE_INVOKE_ID";
export const IP_BL_REASON_NEGATIVE_INVOKE_ID: string = "NEGATIVE_INVOKE_ID";
export const IP_BL_REASON_MANY_ERRORS: string = "MANY_ERRORS";
export const IP_BL_REASON_BRUTE_FORCE: string = "BRUTE_FORCE";
export const IP_BL_REASON_DOUBLE_STARTTLS: string = "DOUBLE_STARTTLS";
export const IP_BL_REASON_DOUBLE_BIND: string = "DOUBLE_BIND";
export const IP_BL_REASON_CONN_PER_ADDR: string = "CONN_PER_ADDR";
export const IP_BL_REASON_NON_EXISTENT_OB: string = "NON_EXISTENT_OB";
export const IP_BL_REASON_UNREC_LDAP_OP: string = "UNREC_LDAP_OP";
export const IP_BL_REASON_UNREC_IDM_PDU_TYPE: string = "UNREC_IDM_PDU_TYPE";
export const IP_BL_REASON_UNREC_OP: string = "UNREC_OP";

export
const UNTRUSTED_REQ_AUTH_LEVEL: AuthenticationLevel = {
    basicLevels: new AuthenticationLevel_basicLevels(
        AuthenticationLevel_basicLevels_level_none,
        undefined,
        undefined,
    ),
};

export const INTERNAL_ASSOCIATON_ID: string = "INTERNAL";

export const NOW_CONTEXT_ASSERTION = new ContextAssertion(
    temporalContext["&id"],
    [
        temporalContext.encoderFor["&Assertion"]!({
            now: null,
        }, DER),
    ],
);

/**
 * Defined in ITU X.509 (2019), but not in the ASN.1 modules--only in the text
 * of section 9.2.2.4.
 */
export const id_anyExtendedKeyUsage = new ObjectIdentifier([ 0 ], id_ce_extKeyUsage);

/**
 * Defined in IETF RFC 5280.
 */
 export const id_pkix = new ObjectIdentifier([ 1, 3, 6, 1, 5, 5, 7 ]);

/**
 * Defined in IETF RFC 5280.
 */
export const id_kp = new ObjectIdentifier([ 3 ], id_pkix);

/**
 * Defined in IETF RFC 5280.
 */
 export const id_kp_serverAuth      = new ObjectIdentifier([ 1 ], id_kp);
 export const id_kp_clientAuth      = new ObjectIdentifier([ 2 ], id_kp);
 export const id_kp_codeSigning     = new ObjectIdentifier([ 3 ], id_kp);
 export const id_kp_emailProtection = new ObjectIdentifier([ 4 ], id_kp);
 export const id_kp_timeStamping    = new ObjectIdentifier([ 8 ], id_kp);
 export const id_kp_OCSPSigning     = new ObjectIdentifier([ 9 ], id_kp);
