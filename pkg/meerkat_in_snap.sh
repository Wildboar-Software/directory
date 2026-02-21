#!/bin/sh

lang="$(snapctl get lang)"
if [ -n "$lang" ]; then
    export LANG="$lang"
fi
if [ -f "$SNAP_COMMON/attr-cert-chain.pem" ]; then
    export MEERKAT_ATTR_CERT_CHAIN_FILE="$SNAP_COMMON/attr-cert-chain.pem"
fi
if [ -f "$SNAP_COMMON/clearance-authorities.pem" ]; then
    export MEERKAT_CLEARANCE_AUTHORITIES="$SNAP_COMMON/clearance-authorities.pem"
fi
if [ -f "$SNAP_COMMON/signing-ca.pem" ]; then
    export MEERKAT_SIGNING_CA_FILE="$SNAP_COMMON/signing-ca.pem"
fi
if [ -f "$SNAP_COMMON/signing-cert-chain.pem" ]; then
    export MEERKAT_SIGNING_CERTS_CHAIN_FILE="$SNAP_COMMON/signing-cert-chain.pem"
fi
if [ -f "$SNAP_COMMON/signing-crl.pem" ]; then
    export MEERKAT_SIGNING_CRL_FILE="$SNAP_COMMON/signing-crl.pem"
fi
if [ -f "$SNAP_COMMON/signing-key.pem" ]; then
    export MEERKAT_SIGNING_KEY_FILE="$SNAP_COMMON/signing-key.pem"
fi
if [ -f "$SNAP_COMMON/sslkeylog.txt" ]; then
    export MEERKAT_SSLKEYLOG_FILE="$SNAP_COMMON/sslkeylog.txt"
fi
if [ -f "$SNAP_COMMON/signing-trust-anchors.pem" ]; then
    export MEERKAT_TRUST_ANCHORS_FILE="$SNAP_COMMON/signing-trust-anchors.pem"
fi
if [ -f "$SNAP_COMMON/tls-crl.pem" ]; then
    export MEERKAT_TLS_CRL_FILE="$SNAP_COMMON/tls-crl.pem"
fi
if [ -f "$SNAP_COMMON/tls-dh-param.pem" ]; then
    export MEERKAT_TLS_DH_PARAM_FILE="$SNAP_COMMON/tls-dh-param.pem"
fi
if [ -f "$SNAP_COMMON/tls-key.pem" ]; then
    export MEERKAT_TLS_KEY_FILE="$SNAP_COMMON/tls-key.pem"
fi
if [ -f "$SNAP_COMMON/tls-ca.pem" ]; then
    export MEERKAT_TLS_CA_FILE="$SNAP_COMMON/tls-ca.pem"
fi
if [ -f "$SNAP_COMMON/tls-cert-chain.pem" ]; then
    export MEERKAT_TLS_CERT_FILE="$SNAP_COMMON/tls-cert-chain.pem"
fi
if [ -f "$SNAP_COMMON/tls-secret.pfx" ]; then
    export MEERKAT_TLS_PFX_FILE="$SNAP_COMMON/tls-secret.pfx"
fi
if [ -f "$SNAP_COMMON/labeling-authorities.pem" ]; then
    export MEERKAT_LABELLING_AUTHORITIES="$SNAP_COMMON/labeling-authorities.pem"
fi
if [ -f "$SNAP_COMMON/init.mjs" ]; then
    export MEERKAT_INIT_JS="$SNAP_COMMON/init.mjs"
fi

export MEERKAT_MY_ACCESS_POINT_NSAPS="$(snapctl get my-access-point-nsaps)"
export MEERKAT_ADMINISTRATOR_EMAIL="$(snapctl get administrator-email)"
export MEERKAT_ADMINISTRATOR_EMAIL_PUBLIC="$(snapctl get administrator-email-public)"
export MEERKAT_ATTR_CERT_DURATION="$(snapctl get attr-cert-duration)"
export MEERKAT_BIND_MIN_SLEEP_MS="$(snapctl get bind-min-sleep-ms)"
export MEERKAT_BIND_SLEEP_RANGE_MS="$(snapctl get bind-sleep-range-ms)"
export MEERKAT_BULK_INSERT_MODE="$(snapctl get bulk-insert-mode)"
export MEERKAT_CLIENT_CERT_ENGINE="$(snapctl get client-cert-engine)"
export MEERKAT_CHAINING_CHECK_SIG="$(snapctl get chaining-check-sig)"
export MEERKAT_CHAINING_SIGN_REQUESTS="$(snapctl get chaining-sign-requests)"
export MEERKAT_CHAINING_STRONG_CREDS_TTL="$(snapctl get chaining-strong-creds-ttl)"
export MEERKAT_CHAINING_TLS_OPTIONAL="$(snapctl get chaining-tls-optional)"
export MEERKAT_DEFAULT_ENTRY_TTL="$(snapctl get default-entry-ttl)"
export MEERKAT_ECDH_CURVES="$(snapctl get ecdh-curves)"
export MEERKAT_ENABLE_DAP="$(snapctl get enable-dap)"
export MEERKAT_ENABLE_DISP="$(snapctl get enable-disp)"
export MEERKAT_ENABLE_DOP="$(snapctl get enable-dop)"
export MEERKAT_ENABLE_DSP="$(snapctl get enable-dsp)"
export MEERKAT_ENTRIES_PER_SUBORDINATES_PAGE="$(snapctl get entries-per-subordinates-page)"
export MEERKAT_FETCH_REMOTE_AUTHZ_ATTRS="$(snapctl get fetch-remote-authz-attrs)"
export MEERKAT_FORBID_ANONYMOUS_BIND="$(snapctl get forbid-anonymous-bind)"
export MEERKAT_GET_CLEARANCES_FROM_ATTR_CERTS="$(snapctl get get-clearances-from-attr-certs)"
export MEERKAT_GET_CLEARANCES_FROM_DSAIT="$(snapctl get get-clearances-from-dsait)"
export MEERKAT_GET_CLEARANCES_FROM_PKC="$(snapctl get get-clearances-from-pkc)"
export MEERKAT_HONOR_CIPHER_ORDER="$(snapctl get honor-cipher-order)"
export MEERKAT_IDM_BUFFER_SIZE="$(snapctl get idm-buffer-size)"
export MEERKAT_IDM_PORT="$(snapctl get idm-port)"
export MEERKAT_IDMS_PORT="$(snapctl get idms-port)"
export MEERKAT_ITOT_ABORT_TIMEOUT_IN_SECONDS="$(snapctl get itot-abort-timeout-in-seconds)"
export MEERKAT_ITOT_ACSE_PASSWORD="$(snapctl get itot-acse-password)"
export MEERKAT_ITOT_CHAINING="$(snapctl get itot-chaining)"
export MEERKAT_ITOT_MAX_NSDU_SIZE="$(snapctl get itot-max-nsdu-size)"
export MEERKAT_ITOT_MAX_TPDU_SIZE="$(snapctl get itot-max-tpdu-size)"
export MEERKAT_ITOT_MAX_TSDU_SIZE="$(snapctl get itot-max-tsdu-size)"
export MEERKAT_ITOT_MAX_SSDU_SIZE="$(snapctl get itot-max-ssdu-size)"
export MEERKAT_ITOT_MAX_PRESENTATION_CONTEXTS="$(snapctl get itot-max-presentation-contexts)"
export MEERKAT_ITOT_PORT="$(snapctl get itot-port)"
export MEERKAT_ITOTS_PORT="$(snapctl get itots-port)"
export MEERKAT_LAST_UPDATE_DISPUTE_THRESHOLD="$(snapctl get last-update-dispute-threshold)"
export MEERKAT_LCR_PARALLELISM="$(snapctl get lcr-parallelism)"
export MEERKAT_LDAP_BUFFER_SIZE="$(snapctl get ldap-buffer-size)"
export MEERKAT_LDAP_PORT="$(snapctl get ldap-port)"
export MEERKAT_LDAPS_PORT="$(snapctl get ldaps-port)"
export MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3="$(snapctl get local-qualifier-points-for-using-ssl3)"
export MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS="$(snapctl get local-qualifier-points-for-using-starttls)"
export MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS="$(snapctl get local-qualifier-points-for-using-tls)"
export MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0="$(snapctl get local-qualifier-points-for-using-tls-1-0)"
export MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1="$(snapctl get local-qualifier-points-for-using-tls-1-1)"
export MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2="$(snapctl get local-qualifier-points-for-using-tls-1-2)"
export MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3="$(snapctl get local-qualifier-points-for-using-tls-1-3)"
export MEERKAT_LOG_BOUND_DN="$(snapctl get log-bound-dn)"
export MEERKAT_LOG_LEVEL="$(snapctl get log-level)"
export MEERKAT_LOG_TLS_SECRETS="$(snapctl get log-tls-secrets)"
export MEERKAT_LOOKUP_UNCERT_STRONG_AUTH="$(snapctl get lookup-uncert-strong-auth)"
export MEERKAT_MAX_CONCURRENT_OPERATIONS_PER_CONNECTION="$(snapctl get max-concurrent-operations-per-connection)"
export MEERKAT_MAX_CONNECTIONS="$(snapctl get max-connections)"
export MEERKAT_MAX_CONNECTIONS_PER_ADDRESS="$(snapctl get max-connections-per-address)"
export MEERKAT_MAX_IDM_PDU_SIZE="$(snapctl get max-idm-pdu-size)"
export MEERKAT_MAX_IDM_SEGMENTS="$(snapctl get max-idm-segments)"
export MEERKAT_MAX_PRE_BIND_REQUESTS="$(snapctl get max-pre-bind-requests)"
export MEERKAT_MAX_RELAXATIONS="$(snapctl get max-relaxations)"
export MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING="$(snapctl get min-auth-level-for-chaining)"
export MEERKAT_MIN_AUTH_LEVEL_FOR_DISP="$(snapctl get min-auth-level-for-disp)"
export MEERKAT_MIN_AUTH_LEVEL_FOR_OB="$(snapctl get min-auth-level-for-ob)"
export MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_CHAINING="$(snapctl get min-auth-local-qualifier-for-chaining)"
export MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_DISP="$(snapctl get min-auth-local-qualifier-for-disp)"
export MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_OB="$(snapctl get min-auth-local-qualifier-for-ob)"
export MEERKAT_MIN_TRANSFER_SPEED_BYTES_PER_MINUTE="$(snapctl get min-transfer-speed-bytes-per-minute)"
export MEERKAT_MRU_VERTEX_TTL="$(snapctl get mru-vertex-ttl)"
export MEERKAT_MUTUAL_AUTH_OPTIONAL="$(snapctl get mutual-auth-optional)"
export MEERKAT_OB_AUTO_ACCEPT="$(snapctl get ob-auto-accept)"
export MEERKAT_OPEN_TOP_LEVEL="$(snapctl get open-top-level)"
export MEERKAT_PRINCIPLED_SERVICE_ADMIN="$(snapctl get principled-service-admin)"
export MEERKAT_PRIVATE_KEY_ENGINE="$(snapctl get private-key-engine)"
export MEERKAT_PROHIBIT_CHAINING="$(snapctl get prohibit-chaining)"
export MEERKAT_REMOTE_PWD_LOCAL_SCOPE="$(snapctl get remote-pwd-local-scope)"
export MEERKAT_REMOTE_PWD_TIME_LIMIT="$(snapctl get remote-pwd-time-limit)"
export MEERKAT_REQUEST_CROSS_REFERENCES="$(snapctl get request-cross-references)"
export MEERKAT_RETURN_CROSS_REFERENCES="$(snapctl get return-cross-references)"
export MEERKAT_REVEAL_USER_PWD="$(snapctl get reveal-user-pwd)"
export MEERKAT_SCR_PARALLELISM="$(snapctl get scr-parallelism)"
export MEERKAT_SHADOW_SECONDARY_REPLICA_UPDATE_CONCURRENCY="$(snapctl get shadow-secondary-replica-update-concurrency)"
export MEERKAT_SHADOW_TOTAL_REFRESH_DELETION_PAGE_SIZE="$(snapctl get shadow-total-refresh-deletion-page-size)"
export MEERKAT_SENTINEL_DOMAIN="$(snapctl get sentinel-domain)"
export MEERKAT_SIGNING_ACCEPTABLE_CERT_POLICIES="$(snapctl get signing-acceptable-cert-policies)"
export MEERKAT_SIGNING_BIND_ACCEPTABLE_CERT_POLICIES="$(snapctl get signing-bind-acceptable-cert-policies)"
export MEERKAT_SIGNING_BIND_CRL_DP_ATTEMPTS_PER_CERT="$(snapctl get signing-bind-crl-dp-attempts-per-cert)"
export MEERKAT_SIGNING_BIND_MAX_ENDPOINTS_PER_CRL_DP="$(snapctl get signing-bind-max-endpoints-per-crl-dp)"
export MEERKAT_SIGNING_BIND_OCSP_CHECKINESS="$(snapctl get signing-bind-ocsp-checkiness)"
export MEERKAT_SIGNING_BIND_OCSP_MAX_REQUESTS_PER_CERT="$(snapctl get signing-bind-ocsp-max-requests-per-cert)"
export MEERKAT_SIGNING_BIND_OCSP_SIGN_REQUESTS="$(snapctl get signing-bind-ocsp-sign-requests)"
export MEERKAT_SIGNING_BIND_OCSP_TIMEOUT="$(snapctl get signing-bind-ocsp-timeout)"
export MEERKAT_SIGNING_BIND_OCSP_UNKNOWN_IS_FAILURE="$(snapctl get signing-bind-ocsp-unknown-is-failure)"
export MEERKAT_SIGNING_BIND_REMOTE_CRL_CACHE_TTL="$(snapctl get signing-bind-remote-crl-cache-ttl)"
export MEERKAT_SIGNING_BIND_REMOTE_CRL_CHECKINESS="$(snapctl get signing-bind-remote-crl-checkiness)"
export MEERKAT_SIGNING_BIND_REMOTE_CRL_SIZE_LIMIT="$(snapctl get signing-bind-remote-crl-size-limit)"
export MEERKAT_SIGNING_BIND_REMOTE_CRL_SUPPORTED_PROTOCOLS="$(snapctl get signing-bind-remote-crl-supported-protocols)"
export MEERKAT_SIGNING_BIND_REMOTE_CRL_TIMEOUT="$(snapctl get signing-bind-remote-crl-timeout)"
export MEERKAT_SIGNING_BIND_TOLERATE_UNAVAILABLE_REMOTE_CRL="$(snapctl get signing-bind-tolerate-unavailable-remote-crl)"
export MEERKAT_SIGNING_CRL_DP_ATTEMPTS_PER_CERT="$(snapctl get signing-crl-dp-attempts-per-cert)"
export MEERKAT_SIGNING_DISABLE_VERIFICATION="$(snapctl get signing-disable-verification)"
export MEERKAT_SIGNING_ERRORS_MIN_AUTH_LEVEL="$(snapctl get signing-errors-min-auth-level)"
export MEERKAT_SIGNING_ERRORS_MIN_AUTH_LOCAL_QUALIFIER="$(snapctl get signing-errors-min-auth-local-qualifier)"
export MEERKAT_SIGNING_ERRORS_MIN_AUTH_SIGNED="$(snapctl get signing-errors-min-auth-signed)"
export MEERKAT_SIGNING_MAX_ENDPOINTS_PER_CRL_DP="$(snapctl get signing-max-endpoints-per-crl-dp)"
export MEERKAT_SIGNING_MIN_AUTH_LEVEL="$(snapctl get signing-min-auth-level)"
export MEERKAT_SIGNING_MIN_AUTH_LOCAL_QUALIFIER="$(snapctl get signing-min-auth-local-qualifier)"
export MEERKAT_SIGNING_MIN_AUTH_SIGNED="$(snapctl get signing-min-auth-signed)"
export MEERKAT_SIGNING_OCSP_CHECKINESS="$(snapctl get signing-ocsp-checkiness)"
export MEERKAT_SIGNING_OCSP_MAX_REQUESTS_PER_CERT="$(snapctl get signing-ocsp-max-requests-per-cert)"
export MEERKAT_SIGNING_OCSP_REPLAY_WINDOW="$(snapctl get signing-ocsp-replay-window)"
export MEERKAT_SIGNING_OCSP_RESPONSE_SIZE_LIMIT="$(snapctl get signing-ocsp-response-size-limit)"
export MEERKAT_SIGNING_OCSP_SIGN_REQUESTS="$(snapctl get signing-ocsp-sign-requests)"
export MEERKAT_SIGNING_OCSP_TIMEOUT="$(snapctl get signing-ocsp-timeout)"
export MEERKAT_SIGNING_OCSP_UNKNOWN_IS_FAILURE="$(snapctl get signing-ocsp-unknown-is-failure)"
export MEERKAT_SIGNING_PERMITTED_ALGORITHMS="$(snapctl get signing-permitted-algorithms)"
export MEERKAT_SIGNING_REMOTE_CRL_CACHE_TTL="$(snapctl get signing-remote-crl-cache-ttl)"
export MEERKAT_SIGNING_REMOTE_CRL_CHECKINESS="$(snapctl get signing-remote-crl-checkiness)"
export MEERKAT_SIGNING_REMOTE_CRL_SIZE_LIMIT="$(snapctl get signing-remote-crl-size-limit)"
export MEERKAT_SIGNING_REMOTE_CRL_SUPPORTED_PROTOCOLS="$(snapctl get signing-remote-crl-supported-protocols)"
export MEERKAT_SIGNING_REMOTE_CRL_TIMEOUT="$(snapctl get signing-remote-crl-timeout)"
export MEERKAT_SIGNING_REQUIRED_FOR_CHAINING="$(snapctl get signing-required-for-chaining)"
export MEERKAT_SIGNING_REQUIRED_FOR_DISP="$(snapctl get signing-required-for-disp)"
export MEERKAT_SIGNING_REQUIRED_FOR_OB="$(snapctl get signing-required-for-ob)"
export MEERKAT_SIGNING_REQUIRED_TO_TRUST_XR="$(snapctl get signing-required-to-trust-xr)"
export MEERKAT_SIGNING_TOLERATE_UNAVAILABLE_REMOTE_CRL="$(snapctl get signing-tolerate-unavailable-remote-crl)"
export MEERKAT_TCP_NO_DELAY="$(snapctl get tcp-no-delay)"
export MEERKAT_TCP_TIMEOUT_IN_SECONDS="$(snapctl get tcp-timeout-in-seconds)"
export MEERKAT_TLS_ANSWER_OCSP_REQUESTS="$(snapctl get tls-answer-ocsp-requests)"
export MEERKAT_TLS_CIPHERS="$(snapctl get tls-ciphers)"
export MEERKAT_TLS_CLIENT_CERT_AUTH="$(snapctl get tls-client-cert-auth)"
export MEERKAT_TLS_ENABLE_TRACE="$(snapctl get tls-enable-trace)"
export MEERKAT_TLS_HANDSHAKE_TIMEOUT_IN_SECONDS="$(snapctl get tls-handshake-timeout-in-seconds)"
export MEERKAT_TLS_KEY_PASSPHRASE="$(snapctl get tls-key-passphrase)"
export MEERKAT_TLS_MAX_VERSION="$(snapctl get tls-max-version)"
export MEERKAT_TLS_MIN_VERSION="$(snapctl get tls-min-version)"
export MEERKAT_TLS_OCSP_CHECKINESS="$(snapctl get tls-ocsp-checkiness)"
export MEERKAT_TLS_OCSP_MAX_REQUESTS_PER_CERT="$(snapctl get tls-ocsp-max-requests-per-cert)"
export MEERKAT_TLS_OCSP_REPLAY_WINDOW="$(snapctl get tls-ocsp-replay-window)"
export MEERKAT_TLS_OCSP_RESPONSE_SIZE_LIMIT="$(snapctl get tls-ocsp-response-size-limit)"
export MEERKAT_TLS_OCSP_SIGN_REQUESTS="$(snapctl get tls-ocsp-sign-requests)"
export MEERKAT_TLS_OCSP_TIMEOUT="$(snapctl get tls-ocsp-timeout)"
export MEERKAT_TLS_OCSP_UNKNOWN_IS_FAILURE="$(snapctl get tls-ocsp-unknown-is-failure)"
export MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS="$(snapctl get tls-reject-unauthorized-clients)"
export MEERKAT_TLS_REJECT_UNAUTHORIZED_SERVERS="$(snapctl get tls-reject-unauthorized-servers)"
export MEERKAT_TLS_REQUEST_CERT="$(snapctl get tls-request-cert)"
export MEERKAT_TLS_REQUEST_OCSP="$(snapctl get tls-request-ocsp)"
export MEERKAT_TLS_SESSION_TIMEOUT_IN_SECONDS="$(snapctl get tls-session-timeout-in-seconds)"
export MEERKAT_TLS_SIG_ALGS="$(snapctl get tls-sig-algs)"
export MEERKAT_TRANSCODE_DISTINGUISHED_VALUES_TO_DER="$(snapctl get transcode-distinguished-values-to-der)"
export MEERKAT_TRANSCODE_VALUES_TO_DER="$(snapctl get transcode-values-to-der)"
export MEERKAT_TRUST_FOR_IBRA="$(snapctl get trust-for-ibra)"
export MEERKAT_USE_DATABASE_WHEN_THERE_ARE_X_SUBORDINATES="$(snapctl get use-database-when-there-are-x-subordinates)"
export MEERKAT_VENDOR_NAME="$(snapctl get vendor-name)"
export MEERKAT_VENDOR_VERSION="$(snapctl get vendor-version)"
export MEERKAT_WEB_ADMIN_AUTH_USERNAME="$(snapctl get web-admin-auth-username)"
export MEERKAT_WEB_ADMIN_AUTH_PASSWORD="$(snapctl get web-admin-auth-password)"
export MEERKAT_WEB_ADMIN_AUTH_REALM="$(snapctl get web-admin-auth-realm)"
export MEERKAT_WEB_ADMIN_PORT="$(snapctl get web-admin-port)"
export MEERKAT_WEB_ADMIN_USE_TLS="$(snapctl get web-admin-use-tls)"
export MEERKAT_SCVP_ATTR_CERT_CHECKS="$(snapctl get scvp-attr-cert-checks)"
export MEERKAT_SCVP_ATTR_CERT_WANT_BACKS="$(snapctl get scvp-attr-cert-want-backs)"
export MEERKAT_SCVP_CACHED_RESPONSE="$(snapctl get scvp-cached-response)"
export MEERKAT_SCVP_DISCLOSE_AE_TITLE="$(snapctl get scvp-disclose-ae-title)"
export MEERKAT_SCVP_FULL_REQUEST_IN_RESPONSE="$(snapctl get scvp-full-request-in-response)"
export MEERKAT_SCVP_HASH_ALGORITHM="$(snapctl get scvp-hash-algorithm)"
export MEERKAT_SCVP_INHIBIT_ANY_POLICY="$(snapctl get scvp-inhibit-any-policy)"
export MEERKAT_SCVP_INHIBIT_POLICY_MAPPING="$(snapctl get scvp-inhibit-policy-mapping)"
export MEERKAT_SCVP_PROTECT_RESPONSE="$(snapctl get scvp-protect-response)"
export MEERKAT_SCVP_PUBLIC_KEY_CERT_CHECKS="$(snapctl get scvp-public-key-cert-checks)"
export MEERKAT_SCVP_PUBLIC_KEY_CERT_WANT_BACKS="$(snapctl get scvp-public-key-cert-want-backs)"
export MEERKAT_SCVP_REQUESTOR_TEXT="$(snapctl get scvp-requestor-text)"
export MEERKAT_SCVP_REQUIRE_EXPLICIT_POLICY="$(snapctl get scvp-require-explicit-policy)"
export MEERKAT_SCVP_RESPONSE_VALIDATION_POLICY_BY_REF="$(snapctl get scvp-response-validation-policy-by-ref)"
export MEERKAT_SCVP_SIGNATURE_ALGORITHM="$(snapctl get scvp-signature-algorithm)"
export MEERKAT_SCVP_URL="$(snapctl get scvp-url)"
export MEERKAT_SCVP_VALIDATION_ALGORITHM_ID="$(snapctl get scvp-validation-algorithm-id)"
export MEERKAT_SCVP_VALIDATION_POLICY_REF_ID="$(snapctl get scvp-validation-policy-ref-id)"

cd $SNAP

# If the migration fails, still carry on: we do not want a failed migration
# (which is infrequently needed to begin with) to make us unable to start
# Meerkat DSA
#
# NOTE: Prisma seems to search for migrations relative to the config file, not
# the current directory.
$SNAP/bin/npx prisma migrate deploy \
    --schema prisma/schema.prisma \
    --config prisma.config.ts || true

exec $SNAP/bin/node main.mjs start "$@"
