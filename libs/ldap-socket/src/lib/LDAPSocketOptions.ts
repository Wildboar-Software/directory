import type { TLSSocketOptions } from "node:tls";

/**
 * @summary Options for an LDAP socket
 * @description
 *
 * Options for a Lightweight Directory Access Protocol (LDAP) socket
 *
 * @interface
 * @augments TLSSocketOptions
 */
export
interface LDAPSocketOptions extends TLSSocketOptions {
    asn1ErrorBudget?: number;
}

export default LDAPSocketOptions;
