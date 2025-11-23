import {
    DAPClient,
    create_dap_client,
    rose_from_url,
    DAPOptions,
    DAPBindParameters,
    CompareOptions,
    SearchOptions,
    DAPBindOutcome,
} from "@wildboar/x500-client-ts";
import {
    id_ac_directoryAccessAC,
} from "@wildboar/x500/DirectoryOSIProtocols";
import {
    SimpleCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import { FALSE, TRUE, TRUE_BIT } from "@wildboar/asn1";
import { BER } from "@wildboar/asn1/functional";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    ServiceProblem_administrativeLimitExceeded,
    ServiceProblem_busy,
    ServiceProblem_chainingRequired,
    ServiceProblem_ditError,
    ServiceProblem_loopDetected,
    ServiceProblem_outOfScope,
    ServiceProblem_timeLimitExceeded,
    ServiceProblem_unableToProceed,
    ServiceProblem_unavailable,
    ServiceProblem_unavailableCriticalExtension,
    ServiceProblem_unsupportedMatchingUse,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_ambiguousKeyAttributes,
    ServiceProblem_invalidQueryReference,
    ServiceProblem_invalidReference,
    ServiceProblem_notSupportedByLDAP,
    ServiceProblem_requestedServiceNotAvailable,
    ServiceProblem_saslBindInProgress,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_blockedCredentials,
    SecurityProblem_inappropriateAlgorithms,
    SecurityProblem_inappropriateAuthentication,
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidCredentials,
    SecurityProblem_invalidSignature,
    SecurityProblem_noInformation,
    SecurityProblem_passwordExpired,
    SecurityProblem_protectionRequired,
    SecurityProblem_unsupportedAuthenticationMethod,
    SecurityProblem_spkmError,
} from "@wildboar/x500/DirectoryAbstractService";
import { Code } from "@wildboar/x500/CommonProtocolSpecification";
import {
    AbortReason,
    OperationOutcome,
    RejectReason,
} from "@wildboar/rose-transport";
import { DirectoryBindArgument } from "@wildboar/x500/DirectoryAbstractService";
import { SearchResult } from "@wildboar/x500/DirectoryAbstractService";
import { EntryInformation } from "@wildboar/x500/DirectoryAbstractService";
import { strict as assert } from "node:assert";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/InformationFramework";
import { userPwd } from "@wildboar/x500/PasswordPolicy";
import {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { differenceInMilliseconds } from "date-fns";
import { Socket, createConnection } from "node:net";
import { TLSSocket, connect as tlsConnect, TLSSocketOptions } from "node:tls";
import {
    TLSResponse_success,
} from "@wildboar/x500/IDMProtocolSpecification";

const DIRECTORY_URL_SCHEMES: string[] = [
    "idm",
    "idms",
    "itot",
    "itots",
    "lpp",
    "lpps",
];

export const LOG_LEVEL_DEBUG: number = 1;
export const LOG_LEVEL_INFO: number = 2;
export const LOG_LEVEL_WARN: number = 3;
export const LOG_LEVEL_ERROR: number = 4;

export
interface LogEvent {
    level: number;
    type: string;
    error_code?: Code;
    error_problem_num?: number;
    error_problem_str?: string;
    abort_reason?: number;
    username?: string;
    message?: string;
    other?: Record<string, unknown>;
}

export const serviceProblemToMessage: Record<number, string> = {
    [ServiceProblem_administrativeLimitExceeded as number]: "administrativeLimitExceeded",
    [ServiceProblem_busy as number]: "busy",
    [ServiceProblem_chainingRequired as number]: "chainingRequired",
    [ServiceProblem_ditError as number]: "ditError",
    [ServiceProblem_loopDetected as number]: "loopDetected",
    [ServiceProblem_outOfScope as number]: "outOfScope",
    [ServiceProblem_timeLimitExceeded as number]: "timeLimitExceeded",
    [ServiceProblem_unableToProceed as number]: "unableToProceed",
    [ServiceProblem_unavailable as number]: "unavailable",
    [ServiceProblem_unavailableCriticalExtension as number]: "unavailableCriticalExtension",
    [ServiceProblem_unsupportedMatchingUse as number]: "unsupportedMatchingUse",
    [ServiceProblem_unwillingToPerform as number]: "unwillingToPerform",
    [ServiceProblem_ambiguousKeyAttributes as number]: "ambiguousKeyAttributes",
    [ServiceProblem_invalidQueryReference as number]: "invalidQueryReference",
    [ServiceProblem_invalidReference as number]: "invalidReference",
    [ServiceProblem_notSupportedByLDAP as number]: "notSupportedByLDAP",
    [ServiceProblem_requestedServiceNotAvailable as number]: "requestedServiceNotAvailable",
    [ServiceProblem_saslBindInProgress as number]: "saslBindInProgress",
};

export const securityProblemToMessage: Record<number, string> = {
    [SecurityProblem_blockedCredentials as number]: "blockedCredentials",
    [SecurityProblem_inappropriateAlgorithms as number]: "inappropriateAlgorithms",
    [SecurityProblem_inappropriateAuthentication as number]: "inappropriateAuthentication",
    [SecurityProblem_insufficientAccessRights as number]: "insufficientAccessRights",
    [SecurityProblem_invalidCredentials as number]: "invalidCredentials",
    [SecurityProblem_invalidSignature as number]: "invalidSignature",
    [SecurityProblem_noInformation as number]: "noInformation",
    [SecurityProblem_passwordExpired as number]: "passwordExpired",
    [SecurityProblem_protectionRequired as number]: "protectionRequired",
    [SecurityProblem_unsupportedAuthenticationMethod as number]: "unsupportedAuthenticationMethod",
    [SecurityProblem_spkmError as number]: "spkmError",
};

export const abortReasonToString: Record<AbortReason, string> = {
    [AbortReason.authentication_failure]: "authentication_failure",
    [AbortReason.authentication_mechanism_name_not_recognized]: "authentication_mechanism_name_not_recognized",
    [AbortReason.authentication_mechanism_name_required]: "authentication_mechanism_name_required",
    [AbortReason.authentication_required]: "authentication_required",
    [AbortReason.connection_failed]: "connection_failed",
    [AbortReason.invalid_pdu]: "invalid_pdu",
    [AbortReason.invalid_protocol]: "invalid_protocol",
    [AbortReason.mistyped_pdu]: "mistyped_pdu",
    [AbortReason.other]: "other",
    [AbortReason.protocol_error]: "protocol_error",
    [AbortReason.reason_not_specified]: "reason_not_specified",
    [AbortReason.resource_limitation]: "resource_limitation",
    [AbortReason.unbound_request]: "unbound_request",
};

export const rejectReasonToString: Record<RejectReason, string> = {
    [RejectReason.badly_structured_pdu]: "badly_structured_pdu",
    [RejectReason.duplicate_invoke_id_request]: "duplicate_invoke_id_request",
    [RejectReason.invalid_idm_version]: "invalid_idm_version",
    [RejectReason.mistyped_argument_request]: "mistyped_argument_request",
    [RejectReason.mistyped_parameter_error]: "mistyped_parameter_error",
    [RejectReason.mistyped_pdu]: "mistyped_pdu",
    [RejectReason.mistyped_result_request]: "mistyped_result_request",
    [RejectReason.other]: "other",
    [RejectReason.release_in_progress]: "release_in_progress",
    [RejectReason.resource_limitation_request]: "resource_limitation_request",
    [RejectReason.unknown_error]: "unknown_error",
    [RejectReason.unknown_invoke_id_error]: "unknown_invoke_id_error",
    [RejectReason.unknown_invoke_id_result]: "unknown_invoke_id_result",
    [RejectReason.unknown_operation_request]: "unknown_operation_request",
    [RejectReason.unrecognized_pdu]: "unrecognized_pdu",
    [RejectReason.unsuitable_idm_version]: "unsuitable_idm_version",
    [RejectReason.unsupported_idm_version]: "unsupported_idm_version",
    [RejectReason.unsupported_operation_request]: "unsupported_operation_request",
};

function* iterateOverSearchResults(result: SearchResult): Generator<EntryInformation, undefined> {
    const data = getOptionallyProtectedValue(result);
    if ("searchInfo" in data) {
        for (const entry of data.searchInfo.entries) {
            yield entry;
        }
    } else if ("uncorrelatedSearchInfo" in data) {
        for (const subresult of data.uncorrelatedSearchInfo) {
            yield* iterateOverSearchResults(subresult);
        }
    } else {
        return undefined;
    }
    return undefined;
}

export type User = Record<string, unknown>;

export
interface BindSubstrategyOptions { }

export
interface CompareSubstrategyOptions { }

export type X500PassportSubstrategy =
    | {
        bind: BindSubstrategyOptions;
    }
    | {
        compare: CompareSubstrategyOptions;
    }
    ;

// TODO: Option to fetch the pwdAttribute.
export
interface X500PassportStrategyOptions extends DAPOptions {
    url: string | URL;
    tlsOptions?: TLSSocketOptions;
    timeout_ms?: number;
    bind_as?: () => Promise<DAPBindParameters>;
    log?: (event: LogEvent) => unknown;

    // Step 1: Convert username to a DN, or a search that can be used to form a DN.
    username_to_dn_or_search: (username: string) => Promise<DistinguishedName | SearchOptions>;

    // Step 2: Actually use the DN to perform the password evaluation.
    substrategy: X500PassportSubstrategy;

    // Step 3: Produce initial user info.
    // If search is used, entry will be the search result.
    // If the DN was produced directly from the username, entry will have no attributes.
    entry_to_user: (entry: EntryInformation) => Promise<User>;

    // Step 4: Follow up to produce the final user info.
    hydrate_user_info?: (state: AuthFunctionState, user: User) => Promise<User>;
}

export
interface AuthFunctionState {
    dap_client?: DAPClient | null | undefined;
};

export type DoneCallback = (err?: any, user?: User | undefined | false) => unknown;
export type AuthFunction = (username: string, password: string, done: DoneCallback) => void;

export
async function create_client(options: X500PassportStrategyOptions) {
    const url: URL = (options.url instanceof URL)
        ? options.url
        : new URL(options.url);
    const host: string = url.hostname;
    const port: number = url.port.length
        ? Number.parseInt(url.port, 10)
        : (() => {
            throw new Error("Please specify a port number in the DSA URL.");
        })();
    let socket!: Socket;
    await new Promise<void>((resolve, reject) => {
        socket = url.protocol.slice(0, -1).toLowerCase().endsWith("s")
            ? tlsConnect({
                host,
                port,
                ...options.tlsOptions ?? {},
                timeout: options.timeout_ms,
            }, resolve)
            : createConnection({
                host,
                port,
                timeout: options.timeout_ms,
            }, resolve);

        socket.on("error", (e) => {
            options?.log?.({
                level: LOG_LEVEL_ERROR,
                type: "socket_error",
                message: e.message,
            });
            reject(e);
        });

        socket.on("timeout", () => {
            options?.log?.({
                level: LOG_LEVEL_ERROR,
                type: "socket_timeout",
                message: "Socket timed out.",
            });
            reject();
        });

        socket.on("lookup", (e, address, family, host) => {
            if (e) {
                options?.log?.({
                    level: LOG_LEVEL_ERROR,
                    type: "socket_lookup",
                    message: e.message,
                    other: {
                        address,
                        family,
                        host,
                    },
                });
                reject(e);
            } else {
                options?.log?.({
                    level: LOG_LEVEL_DEBUG,
                    type: "socket_lookup",
                    other: {
                        address,
                        family,
                        host,
                    },
                });
            }
        });

        if (socket instanceof TLSSocket) {
            const s = socket;
            socket.once("secureConnect", () => {
                if (!s.authorized && (options.tlsOptions?.rejectUnauthorized ?? true)) {
                    socket.destroy(); // Destroy for immediate and complete denial.
                    options?.log?.({
                        level: LOG_LEVEL_ERROR,
                        type: "tls_auth_fail",
                        message: s.authorizationError.message,
                    });
                    reject();
                }
            });
            // TODO: OCSP
        }
    });

    const rose = rose_from_url(
        options.url,
        socket,
        undefined,
        options.tlsOptions,
        options.timeout_ms,
    );
    if (!rose) {
        throw new Error(
            `Invalid URL. The problem could be an unrecognized URL scheme. `
            + `Directory URLs generally use one of these schemes: ${DIRECTORY_URL_SCHEMES.join(", ")}.`
            + `Your (invalid) URL was: ${options.url}`
        );
    }
    return create_dap_client(rose);
}

export
async function bind(
    options: X500PassportStrategyOptions,
    dap_client: DAPClient | undefined,
    timeout_ms: number,
): Promise<DAPBindOutcome> {
    const dap = dap_client ?? await create_client(options);
    const bind_arg = options.bind_as?.();
    if (options.tlsOptions && dap.startTLS) {
        const tls_outcome = await dap.startTLS({
            timeout: timeout_ms,
        });
        if (("not_supported_locally" in tls_outcome) || ("already_in_use" in tls_outcome)) {
            return { other: tls_outcome };
        }
        if (!("response" in tls_outcome)) {
            return tls_outcome;
        }
        // TLSResponse ::= ENUMERATED {
        //     success         (0),
        //     operationsError (1),
        //     protocolError   (2),
        //     unavailable     (3),
        //     ...}
        const tls_response = tls_outcome.response;
        if (tls_response !== TLSResponse_success) {
            return { other: tls_outcome };
        }
    }
    return dap.bind({
        parameter: new DirectoryBindArgument(
            undefined,
            new Uint8ClampedArray([TRUE_BIT, TRUE_BIT]),
        ),
        ...bind_arg ?? {},
        protocol_id: id_ac_directoryAccessAC,
        timeout: timeout_ms,
    });
}

export
function handle_non_result(
    outcome: OperationOutcome<any>,
    options: X500PassportStrategyOptions,
    username: string,
): void {
    if ("result" in outcome) {
        return;
    }
    else if ("error" in outcome) {
        options?.log?.({
            level: LOG_LEVEL_WARN,
            type: "error",
            username,
            error_code: outcome.error.code,
        });
    }
    else if ("reject" in outcome) {
        options?.log?.({
            level: LOG_LEVEL_WARN,
            type: "reject",
            error_problem_str: rejectReasonToString[outcome.reject.problem],
            username,
        });
    }
    else if ("abort" in outcome) {
        options?.log?.({
            level: LOG_LEVEL_WARN,
            type: "abort",
            error_problem_str: abortReasonToString[outcome.abort],
            username,
        });
    }
    else if ("timeout" in outcome) {
        options?.log?.({
            level: LOG_LEVEL_WARN,
            type: "timeout",
            username,
        });
    }
    else {
        options?.log?.({
            level: LOG_LEVEL_WARN,
            type: "other",
            username,
            other: outcome.other,
        });
    }
}

export
async function bind_auth(
    options: X500PassportStrategyOptions,
    dn: DistinguishedName,
    username: string,
    password: string,
    timeout_ms: number,
): Promise<boolean> {
    assert("bind" in options.substrategy);
    const rose = rose_from_url(options.url);
    if (!rose) {
        throw new Error("435ed6db-3bb8-469f-9dab-d247943030d3");
    }
    const dap = create_dap_client(rose);
    const outcome = await dap.bind({
        protocol_id: id_ac_directoryAccessAC,
        parameter: {
            credentials: {
                simple: new SimpleCredentials(
                    dn,
                    undefined,
                    {
                        unprotected: Buffer.from(password),
                    },
                ),
            },
            versions: new Uint8ClampedArray([
                TRUE_BIT,
                TRUE_BIT,
            ]),
            _unrecognizedExtensionsList: [],
        },
        timeout: timeout_ms,
    });
    if (!("result" in outcome)) {
        if ("error" in outcome) {
            return false;
        }
        handle_non_result(outcome, options, username);
        return false;
    }
    return true;
}

export
async function compare_auth(
    state: AuthFunctionState,
    options: X500PassportStrategyOptions,
    dn: DistinguishedName,
    username: string,
    password: string,
    timeout_ms: number,
): Promise<boolean> {
    const start_time = new Date();
    assert("compare" in options.substrategy);
    if (!state.dap_client || !state.dap_client.rose.socket?.readable) {
        state.dap_client = await create_client(options);
    }
    const socket = state.dap_client.rose.socket;
    if (!socket?.readable || !socket?.writable) {
        state.dap_client = await create_client(options);
    }
    assert(state.dap_client);
    // We need to re-bind if disconnected. This might happen after a period of
    // inactivity.
    if (!state.dap_client.rose.is_bound) {
        const bind_outcome = await bind(options, state.dap_client, timeout_ms);
        if (!("result" in bind_outcome)) {
            throw new Error("b0525d9f-cc3b-4526-9734-cab668f7551f");
        }
    }
    const time_elapsed = Math.abs(differenceInMilliseconds(start_time, new Date()));
    if (time_elapsed > timeout_ms) {
        return false;
    }
    const dap_client = state.dap_client;
    const compare_arg: CompareOptions = {
        object: dn,
        purported: new AttributeValueAssertion(
            userPwd["&id"],
            userPwd.encoderFor["&Type"]!({
                clear: password,
            }, BER),
        ),
        timeLimit: (timeout_ms - time_elapsed),
    };
    const outcome = await dap_client.compare(compare_arg);
    if (!("result" in outcome)) {
        handle_non_result(outcome, options, username);
        return false;
    }
    const data = getOptionallyProtectedValue(outcome.result.parameter);
    if (!data.matched) {
        // WARNING: This MUST be the same behavior taken if
        // the entry does not exist, otherwise, it could
        // lead to information disclosure vulnerabilities.
        return false;
    }
    return true;
}

export
async function attempt(
    options: X500PassportStrategyOptions,
    state: AuthFunctionState,
    username: string,
    password: string,
): Promise<User | null> {
    const start_time = new Date();
    const timeout_ms: number = options.timeout_ms ?? 30_000;
    if (!state.dap_client) {
        state.dap_client = await create_client(options);
    }
    const socket = state.dap_client.rose.socket;
    if (!socket?.readable || !socket?.writable) {
        state.dap_client = await create_client(options);
    }
    assert(state.dap_client);
    let time_elapsed = Math.abs(differenceInMilliseconds(start_time, new Date()));
    if (time_elapsed > timeout_ms) {
        return null;
    }
    if (!state.dap_client.rose.is_bound) {
        const bind_outcome = await bind(options, state.dap_client, (timeout_ms - time_elapsed));
        if (!("result" in bind_outcome)) {
            throw new Error("b0525d9f-cc3b-4526-9734-cab668f7551f");
        }
    }
    time_elapsed = Math.abs(differenceInMilliseconds(start_time, new Date()));
    if (time_elapsed > timeout_ms) {
        return null;
    }
    const dn_or_search = await options.username_to_dn_or_search(username);
    time_elapsed = Math.abs(differenceInMilliseconds(start_time, new Date()));
    if (time_elapsed > timeout_ms) {
        return null;
    }
    let entry: EntryInformation | undefined;
    if (Array.isArray(dn_or_search)) {
        entry = new EntryInformation(
            {
                rdnSequence: dn_or_search,
            },
            FALSE,
            undefined,
            undefined,
            undefined,
            TRUE,
        );
    } else {
        const search_arg: SearchOptions = dn_or_search;
        const search_outcome = await state.dap_client.search({
            ...search_arg,
            timeLimit: search_arg.timeLimit ?? Math.floor(timeout_ms - time_elapsed),
        });
        if (!("result" in search_outcome)) {
            handle_non_result(search_outcome, options, username);
            throw new Error("472f2392-17d6-4d6e-83ce-4a156ed933fe");
        }
        const search_result = search_outcome.result.parameter;
        // const search_data = getOptionallyProtectedValue(search_result);
        const entries = Array.from(iterateOverSearchResults(search_result));
        if (entries.length === 0) {
            options?.log?.({
                level: LOG_LEVEL_INFO,
                type: "search_zero",
                username,
            });
            return null;
        }
        if (entries.length > 1) {
            options?.log?.({
                level: LOG_LEVEL_WARN,
                type: "search_multi",
                username,
            });
        }
        entry = entries[0];
    }
    if (!entry) {
        options?.log?.({
            level: LOG_LEVEL_ERROR,
            type: "null_dn",
            username,
        });
        return null;
    }
    let success: boolean = false;
    time_elapsed = Math.abs(differenceInMilliseconds(start_time, new Date()));
    if (time_elapsed > timeout_ms) {
        return null;
    }
    if ("bind" in options.substrategy) {
        success = await bind_auth(
            options,
            entry.name.rdnSequence,
            username,
            password,
            (timeout_ms - time_elapsed),
        );
    } else if ("compare" in options.substrategy) {
        success = await compare_auth(
            state,
            options,
            entry.name.rdnSequence,
            username,
            password,
            (timeout_ms - time_elapsed),
        );
    } else {
        options?.log?.({
            level: LOG_LEVEL_ERROR,
            type: "unrecognized_substrategy",
            username,
        });
        return null;
    }
    if (!success) {
        return null;
    }
    const user = await options.entry_to_user(entry);
    if (!options.hydrate_user_info) {
        return user;
    }
    time_elapsed = Math.abs(differenceInMilliseconds(start_time, new Date()));
    if (time_elapsed > timeout_ms) {
        return null;
    }
    return options.hydrate_user_info(state, user);
}

export
function get_auth_function(options: X500PassportStrategyOptions): [Promise<DAPBindOutcome>, AuthFunction] {
    const state: AuthFunctionState = {
        dap_client: null,
    };
    const auth_function = (
        username: string,
        password: string,
        done: DoneCallback,
    ) => attempt(options, state, username, password)
        .then((result) => done(null, result ?? undefined))
        .catch((e) => done(e));
    return [
        bind(options, undefined, options.timeout_ms ?? 30_000),
        auth_function,
    ];
}
