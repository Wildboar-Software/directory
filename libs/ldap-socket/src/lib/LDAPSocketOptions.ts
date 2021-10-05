import type { TLSSocketOptions } from "tls";

export
interface LDAPSocketOptions extends TLSSocketOptions {
    asn1ErrorBudget?: number;
}

export default LDAPSocketOptions;
