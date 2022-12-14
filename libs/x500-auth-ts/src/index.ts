import {
    DAPClient,
    create_dap_client,
    rose_from_url,
    DAPOptions,
    DAPBindParameters,
    CompareOptions,
    SearchOptions,
} from "@wildboar/x500-client-ts";
import { URL } from "node:url";
import type {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    id_ac_directoryAccessAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryAccessAC.va";
import {
    SimpleCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials.ta";
import { TRUE_BIT } from "asn1-ts";
import { BER } from "asn1-ts/dist/node/functional";
import { directoryBindError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    AbortReason,
    RejectReason,
} from "@wildboar/rose-transport";
import { DirectoryBindArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import { SearchResult } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResultData.ta";
import type { EntryInformation } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import { strict as assert } from "node:assert";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";

// TODO: Configure positive and negative caching.

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
    // TODO: Include log level
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

function *iterateOverSearchResults (result: SearchResult): Generator<EntryInformation, undefined> {
    const data = getOptionallyProtectedValue(result);
    if ("searchInfo" in data) {
        for (const entry of data.searchInfo.entries) {
            yield entry;
        }
    } else if ("uncorrelatedSearchInfo" in data) {
        for (const subresult of data.uncorrelatedSearchInfo) {
            yield *iterateOverSearchResults(subresult);
        }
    } else {
        return undefined;
    }
    return undefined;
}

/*

This implements four strategies in one:

1. Authenticate directly using user's supplied username and password.
2. Authenticate as application, and search for user with username and password.
3. Authenticate as application, and compare password for object whose DN is derived from the username.

Additional features:


*/

export type User = Record<string, unknown>;

export type X500PassportSubstrategy =
    | {
        direct: (username: string) => Name | null;
    }
    | {
        search: {
            creds_to_arg: (username: string, password: string) => SearchArgumentData,
            entry_to_user: (entry: EntryInformation) => User,
        },
    }
    | {
        compare: (username: string, password: string) => [ Name, CompareOptions | null ],
    }
    ;

export
interface X500PassportStrategyOptions extends DAPOptions {
    url: string | URL;
    timeout_ms?: number;
    bind_as?: () => DAPBindParameters;
    substrategy: X500PassportSubstrategy;
    log?: (event: LogEvent) => unknown;

    // If set, this strategy will search for user groups and include membership
    // data in the user info.
    // TODO: Document object classes
    // search_for_groups?: (username: string) => SearchArgumentData;
    is_member_of_authorized_group?: (dn: Name) => SearchOptions,
}

export type DoneCallback = (err?: any, user?: User | null) => unknown;
export type AuthFunction = (username: string, password: string, done: DoneCallback) => void;

export
function get_auth_function (options: X500PassportStrategyOptions): AuthFunction {
    const rose = rose_from_url(options.url);
    if (!rose) {
        throw new Error(
            `Invalid URL. The problem could be an unrecognized URL scheme. `
            + `Directory URLs generally use one of these schemes: ${DIRECTORY_URL_SCHEMES.join(", ")}.`
            + `Your (invalid) URL was: ${options.url}`
        );
    }
    const dap_client: DAPClient = create_dap_client(rose);
    const bind_arg = options.bind_as?.();
    dap_client.bind({
        parameter: new DirectoryBindArgument(
            undefined,
            new Uint8ClampedArray([ TRUE_BIT, TRUE_BIT ]),
        ),
        ...bind_arg ?? {},
        protocol_id: id_ac_directoryAccessAC,
    })
        .then((outcome) => {
            if ("result" in outcome) {
                options.log?.({
                    level: LOG_LEVEL_INFO,
                    type: "bind",
                });
                return;
            }
            else if ("error" in outcome) {
                if (outcome.error.code) { // Not understood error type.
                    options.log?.({
                        level: LOG_LEVEL_ERROR,
                        type: "bind",
                    });
                    return;
                }
                const dirBindError = directoryBindError.decoderFor["&ParameterType"]!(outcome.error.parameter);
                const data = getOptionallyProtectedValue(dirBindError);
                if ("serviceError" in data.error) {
                    options?.log?.({
                        level: LOG_LEVEL_ERROR,
                        type: "bind_error/service/error",
                        error_problem_num: Number(data.error.serviceError),
                        error_problem_str: serviceProblemToMessage[data.error.serviceError as number],
                    });
                }
                else if ("securityError" in data.error) {
                    options?.log?.({
                        level: LOG_LEVEL_ERROR,
                        type: "bind_error/security_error",
                        error_problem_num: Number(data.error.securityError),
                        error_problem_str: securityProblemToMessage[data.error.securityError as number],
                    });
                }
                else {
                    options?.log?.({
                        level: LOG_LEVEL_ERROR,
                        type: "bind_error/other_error",
                    });
                }
                return;
            }
            else if ("abort" in outcome) {
                options?.log?.({
                    level: LOG_LEVEL_ERROR,
                    type: "bind_abort",
                    error_problem_str: abortReasonToString[outcome.abort],
                });
                return;
            }
            else if ("timeout" in outcome) {
                options?.log?.({
                    level: LOG_LEVEL_ERROR,
                    type: "bind_timeout",
                });
                return;
            }
            else {
                options?.log?.({
                    level: LOG_LEVEL_ERROR,
                    type: "bind_other",
                    other: outcome.other,
                });
                return;
            }
        })
        .catch((e) => {
            options?.log?.({
                level: LOG_LEVEL_ERROR,
                type: "bind_throw",
                message: e?.message,
            });
        })
        ;

    return function (username: string, password: string, done: DoneCallback) {
        if ("direct" in options.substrategy) {
            const dn = options.substrategy.direct(username);
            if (!dn) {
                done(new Error("4fa0a1e0-2571-4a05-aae4-b24042e42ce6"));
                return;
            }
            const rose = rose_from_url(options.url);
            if (!rose) {
                done(new Error("435ed6db-3bb8-469f-9dab-d247943030d3"));
                return;
            }
            const dap = create_dap_client(rose);
            dap.bind({
                protocol_id: id_ac_directoryAccessAC,
                parameter: {
                    credentials: {
                        simple: new SimpleCredentials(
                            dn.rdnSequence,
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
            })
            .then((outcome) => {
                if ("result" in outcome) {
                    done(null, { username });
                    return;
                }
                else if ("error" in outcome) {
                    if (outcome.error.code) { // Not understood error type.
                        done(new Error());
                        return;
                    }
                    const dirBindError = directoryBindError.decoderFor["&ParameterType"]!(outcome.error.parameter);
                    const data = getOptionallyProtectedValue(dirBindError);
                    if ("serviceError" in data.error) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "bind_error/service_error",
                            error_problem_num: Number(data.error.serviceError),
                            error_problem_str: serviceProblemToMessage[data.error.serviceError as number],
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else if ("securityError" in data.error) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "bind_error/security_error",
                            error_problem_num: Number(data.error.securityError),
                            error_problem_str: securityProblemToMessage[data.error.securityError as number],
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "bind_error/other_error",
                            username,
                        });
                        done(new Error());
                        return;
                    }
                }
                else if ("abort" in outcome) {
                    options?.log?.({
                        level: LOG_LEVEL_WARN,
                        type: "bind_abort",
                        error_problem_str: abortReasonToString[outcome.abort],
                        username,
                    });
                    done(new Error());
                    return;
                }
                else if ("timeout" in outcome) {
                    options?.log?.({
                        level: LOG_LEVEL_WARN,
                        type: "bind_timeout",
                        username,
                    });
                    done(new Error());
                    return;
                }
                else {
                    options?.log?.({
                        level: LOG_LEVEL_WARN,
                        type: "bind_other",
                        username,
                        other: outcome.other,
                    });
                    done(new Error());
                    return;
                }
            })
            .catch((e) => {
                options?.log?.({
                    level: LOG_LEVEL_ERROR,
                    type: "bind_throw",
                    message: e?.message,
                    username,
                });
                done(e);
                return;
            })
            ;
        } else if ("search" in options.substrategy) {
            if (!dap_client.rose.is_bound) {
                options?.log?.({
                    level: LOG_LEVEL_WARN,
                    type: "rose_unbound",
                });
                done(new Error());
                return;
            }
            const search_arg_data = options.substrategy.search.creds_to_arg(username, password);
            dap_client.search({
                ...search_arg_data,
                sizeLimit: 1,
            })
                .then((outcome) => {
                    if ("result" in outcome) {
                        // TODO: Add iterateOverSearchResults() function to @wildboar/x500.
                        const result1 = iterateOverSearchResults(outcome.result.parameter).next();
                        if (!result1.value) {
                            options?.log?.({
                                level: LOG_LEVEL_WARN,
                                type: "no_results",
                                username,
                            });
                            done(new Error());
                            return;
                        }
                        const entry = result1.value;
                        assert("search" in options.substrategy);
                        const user = options.substrategy.search.entry_to_user(entry);
                        done(null, user);
                        return;
                    }
                    else if ("error" in outcome) {
                        // TODO: Add extract problem function to @wildboar/x500.
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "error",
                            username,
                            error_code: outcome.error.code,
                        });
                        done(new Error());
                        return;
                    }
                    else if ("reject" in outcome) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "reject",
                            error_problem_str: rejectReasonToString[outcome.reject.problem],
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else if ("abort" in outcome) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "abort",
                            error_problem_str: abortReasonToString[outcome.abort],
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else if ("timeout" in outcome) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "timeout",
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "other",
                            username,
                            other: outcome.other,
                        });
                        done(new Error());
                        return;
                    }
                })
                .catch((e) => {
                    options?.log?.({
                        level: LOG_LEVEL_ERROR,
                        type: "search_throw",
                        message: e?.message,
                        username,
                        other: {
                            "warning": "You should NOT log this entire object. It could contain passwords.",
                            ...search_arg_data,
                        },
                    });
                    done(e);
                    return;
                })
                ;
        } else if ("compare" in options.substrategy) {
            if (!dap_client.rose.is_bound) {
                options?.log?.({
                    level: LOG_LEVEL_WARN,
                    type: "rose_unbound",
                });
                done(new Error());
                return;
            }
            const [ name, calculated_compare_arg ] = options.substrategy.compare(username, password);
            const compare_arg: CompareOptions = calculated_compare_arg ?? {
                object: name,
                purported: new AttributeValueAssertion(
                    userPwd["&id"],
                    userPwd.encoderFor["&Type"]!({
                        clear: password,
                    }, BER),
                ),
                timeLimit: 15,
            };
            dap_client.compare(compare_arg)
                .then((outcome) => {
                    if ("result" in outcome) {
                        const data = getOptionallyProtectedValue(outcome.result.parameter);
                        if (data.matched) {
                            done(null, { username });
                        } else {
                            // WARNING: This MUST be the same behavior taken if
                            // the entry does not exist, otherwise, it could
                            // lead to information disclosure vulnerabilities.
                            done();
                        }
                        return;
                    }
                    else if ("error" in outcome) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "error",
                            username,
                            error_code: outcome.error.code,
                        });
                        done();
                        return;
                    }
                    else if ("reject" in outcome) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "reject",
                            error_problem_str: rejectReasonToString[outcome.reject.problem],
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else if ("abort" in outcome) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "abort",
                            error_problem_str: abortReasonToString[outcome.abort],
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else if ("timeout" in outcome) {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "timeout",
                            username,
                        });
                        done(new Error());
                        return;
                    }
                    else {
                        options?.log?.({
                            level: LOG_LEVEL_WARN,
                            type: "other",
                            username,
                            other: outcome.other,
                        });
                        done(new Error());
                        return;
                    }
                })
                .catch((e) => {
                    options?.log?.({
                        level: LOG_LEVEL_ERROR,
                        type: "compare_throw",
                        message: e?.message,
                        username,
                        other: {
                            "warning": "You should NOT log this entire object. It could contain passwords.",
                            ...compare_arg,
                        },
                    });
                    done(e);
                    return;
                })
                ;
        } else {
            done(new Error());
            return;
        }
    };
}
