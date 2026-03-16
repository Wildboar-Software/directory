import type { TlsOptions } from "node:tls";

/**
 * Options for fetching some (possibly remote) resource via X.500.
 */
export interface LookupViaX500Options {
    /** Whether to tolerate chaining to remote DSAs. */
    chaining?: boolean;
    /**
     * Whether to limit the scope of the search to the local DSA.
     * For Meerkat DSA, the meaning of "local" is documented
     * here: [Local Scope](https://wildboar-software.github.io/directory/docs/distributed#local-scope).
     */
    localScope?: boolean;
    /** If `true`, do not accept shadow DSEs, nor copies of any kind. */
    dontUseCopy?: boolean;
    /**
     * If `true`, accept shadow DSEs, even if they don't have all desired
     * attributes replicated.
     * 
     * Note that this is not exactly just an opposite of `dontUseCopy`,
     * although the two do contradict. This setting being `true`
     * absolves the DSA from having to chain the request to the shadow
     * supplier (perhaps the master DSA) if the copy does not have all
     * of the queried attributes and values replicated. You should
     * think of this setting as `incompleteCopyShallDo`.
     */
    copyShallDo?: boolean;
    /** If `true`, do not dereference aliases. */
    dontDereferenceAliases?: boolean;
    /** The time limit in seconds for the operation. */
    timeLimitInSeconds?: number;

    // TODO: Add option for attribute size limit.
}

/**
 * Options for fetching a remote resource via a URL.
 */
export
interface CurlOptions {
    /** The timeout in milliseconds for the fetch. */
    timeoutInMilliseconds: number;
    /** The size limit in bytes for the response body. */
    sizeLimit: number;
    /** The TLS options for protocols that use TLS. */
    tlsOptions?: TlsOptions,
    /**
     * The base URLs of an IPFS HTTP gateway. If not supplied, IPFS URLs will
     * return a `null` result.
     */
    ipfsBaseUrl?: string,
}
