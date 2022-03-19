export const updatesDomain: string = "updates.meerkat.wildboar.software";
export const telemetryDomain: string = "telemetry.meerkat.wildboar.software";
export const CONTEXT: string = "CONTEXT";
export const MINIMUM_MAX_ATTR_SIZE: number = 8;
export const MAX_RESULTS: number = 10_000_000;
export const MAX_TRAVERSAL: number = 100000;
export const DEFAULT_IDM_BUFFER_SIZE: number = 1_000_000;
export const DEFAULT_LDAP_BUFFER_SIZE: number = 1_000_000;
export const MAX_SORT_KEYS: number = 3;

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
