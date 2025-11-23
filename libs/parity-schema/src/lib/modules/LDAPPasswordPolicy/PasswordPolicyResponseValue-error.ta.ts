/* eslint-disable */
import { ASN1Element as _Element } from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION _enum_for_PasswordPolicyResponseValue_error */
/**
 * @summary PasswordPolicyResponseValue_error
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PasswordPolicyResponseValue-error ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export enum _enum_for_PasswordPolicyResponseValue_error {
    passwordExpired = 0,
    accountLocked = 1,
    changeAfterReset = 2,
    passwordModNotAllowed = 3,
    mustSupplyOldPassword = 4,
    insufficientPasswordQuality = 5,
    passwordTooShort = 6,
    passwordTooYoung = 7,
    passwordInHistory = 8,
}
/* END_OF_SYMBOL_DEFINITION _enum_for_PasswordPolicyResponseValue_error */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error */
/**
 * @summary PasswordPolicyResponseValue_error
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PasswordPolicyResponseValue-error ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export type PasswordPolicyResponseValue_error =
    _enum_for_PasswordPolicyResponseValue_error;
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error */
/**
 * @summary PasswordPolicyResponseValue_error
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PasswordPolicyResponseValue-error ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
 * ```@enum {number}
 */
export const PasswordPolicyResponseValue_error =
    _enum_for_PasswordPolicyResponseValue_error;
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordExpired */
/**
 * @summary PasswordPolicyResponseValue_error_passwordExpired
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_passwordExpired: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordExpired; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordExpired */

/* START_OF_SYMBOL_DEFINITION passwordExpired */
/**
 * @summary passwordExpired
 * @constant
 * @type {number}
 */
export const passwordExpired: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordExpired; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION passwordExpired */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_accountLocked */
/**
 * @summary PasswordPolicyResponseValue_error_accountLocked
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_accountLocked: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.accountLocked; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_accountLocked */

/* START_OF_SYMBOL_DEFINITION accountLocked */
/**
 * @summary accountLocked
 * @constant
 * @type {number}
 */
export const accountLocked: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.accountLocked; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION accountLocked */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_changeAfterReset */
/**
 * @summary PasswordPolicyResponseValue_error_changeAfterReset
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_changeAfterReset: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.changeAfterReset; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_changeAfterReset */

/* START_OF_SYMBOL_DEFINITION changeAfterReset */
/**
 * @summary changeAfterReset
 * @constant
 * @type {number}
 */
export const changeAfterReset: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.changeAfterReset; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION changeAfterReset */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordModNotAllowed */
/**
 * @summary PasswordPolicyResponseValue_error_passwordModNotAllowed
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_passwordModNotAllowed: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordModNotAllowed; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordModNotAllowed */

/* START_OF_SYMBOL_DEFINITION passwordModNotAllowed */
/**
 * @summary passwordModNotAllowed
 * @constant
 * @type {number}
 */
export const passwordModNotAllowed: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordModNotAllowed; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION passwordModNotAllowed */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_mustSupplyOldPassword */
/**
 * @summary PasswordPolicyResponseValue_error_mustSupplyOldPassword
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_mustSupplyOldPassword: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.mustSupplyOldPassword; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_mustSupplyOldPassword */

/* START_OF_SYMBOL_DEFINITION mustSupplyOldPassword */
/**
 * @summary mustSupplyOldPassword
 * @constant
 * @type {number}
 */
export const mustSupplyOldPassword: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.mustSupplyOldPassword; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION mustSupplyOldPassword */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_insufficientPasswordQuality */
/**
 * @summary PasswordPolicyResponseValue_error_insufficientPasswordQuality
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_insufficientPasswordQuality: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.insufficientPasswordQuality; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_insufficientPasswordQuality */

/* START_OF_SYMBOL_DEFINITION insufficientPasswordQuality */
/**
 * @summary insufficientPasswordQuality
 * @constant
 * @type {number}
 */
export const insufficientPasswordQuality: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.insufficientPasswordQuality; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION insufficientPasswordQuality */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordTooShort */
/**
 * @summary PasswordPolicyResponseValue_error_passwordTooShort
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_passwordTooShort: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordTooShort; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordTooShort */

/* START_OF_SYMBOL_DEFINITION passwordTooShort */
/**
 * @summary passwordTooShort
 * @constant
 * @type {number}
 */
export const passwordTooShort: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordTooShort; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION passwordTooShort */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordTooYoung */
/**
 * @summary PasswordPolicyResponseValue_error_passwordTooYoung
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_passwordTooYoung: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordTooYoung; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordTooYoung */

/* START_OF_SYMBOL_DEFINITION passwordTooYoung */
/**
 * @summary passwordTooYoung
 * @constant
 * @type {number}
 */
export const passwordTooYoung: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordTooYoung; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION passwordTooYoung */

/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordInHistory */
/**
 * @summary PasswordPolicyResponseValue_error_passwordInHistory
 * @constant
 * @type {number}
 */
export const PasswordPolicyResponseValue_error_passwordInHistory: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordInHistory; /* LONG_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue_error_passwordInHistory */

/* START_OF_SYMBOL_DEFINITION passwordInHistory */
/**
 * @summary passwordInHistory
 * @constant
 * @type {number}
 */
export const passwordInHistory: PasswordPolicyResponseValue_error =
    PasswordPolicyResponseValue_error.passwordInHistory; /* SHORT_NAMED_ENUMERATED_VALUE */
/* END_OF_SYMBOL_DEFINITION passwordInHistory */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PasswordPolicyResponseValue_error */
let _cached_decoder_for_PasswordPolicyResponseValue_error: $.ASN1Decoder<PasswordPolicyResponseValue_error> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PasswordPolicyResponseValue_error */

/* START_OF_SYMBOL_DEFINITION _decode_PasswordPolicyResponseValue_error */
/**
 * @summary Decodes an ASN.1 element into a(n) PasswordPolicyResponseValue_error
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PasswordPolicyResponseValue_error} The decoded data structure.
 */
export function _decode_PasswordPolicyResponseValue_error(el: _Element) {
    if (!_cached_decoder_for_PasswordPolicyResponseValue_error) {
        _cached_decoder_for_PasswordPolicyResponseValue_error =
            $._decodeEnumerated;
    }
    return _cached_decoder_for_PasswordPolicyResponseValue_error(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PasswordPolicyResponseValue_error */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PasswordPolicyResponseValue_error */
let _cached_encoder_for_PasswordPolicyResponseValue_error: $.ASN1Encoder<PasswordPolicyResponseValue_error> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PasswordPolicyResponseValue_error */

/* START_OF_SYMBOL_DEFINITION _encode_PasswordPolicyResponseValue_error */
/**
 * @summary Encodes a(n) PasswordPolicyResponseValue_error into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PasswordPolicyResponseValue_error, encoded as an ASN.1 Element.
 */
export function _encode_PasswordPolicyResponseValue_error(
    value: PasswordPolicyResponseValue_error,
    elGetter: $.ASN1Encoder<PasswordPolicyResponseValue_error>
) {
    if (!_cached_encoder_for_PasswordPolicyResponseValue_error) {
        _cached_encoder_for_PasswordPolicyResponseValue_error =
            $._encodeEnumerated;
    }
    return _cached_encoder_for_PasswordPolicyResponseValue_error(
        value,
        elGetter
    );
}

/* END_OF_SYMBOL_DEFINITION _encode_PasswordPolicyResponseValue_error */

/* eslint-enable */
