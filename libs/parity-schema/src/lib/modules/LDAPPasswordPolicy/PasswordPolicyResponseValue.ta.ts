/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { PasswordPolicyResponseValue_warning, _decode_PasswordPolicyResponseValue_warning, _encode_PasswordPolicyResponseValue_warning } from "../LDAPPasswordPolicy/PasswordPolicyResponseValue-warning.ta";
export { PasswordPolicyResponseValue_warning, _decode_PasswordPolicyResponseValue_warning, _encode_PasswordPolicyResponseValue_warning } from "../LDAPPasswordPolicy/PasswordPolicyResponseValue-warning.ta";
import { PasswordPolicyResponseValue_error, _enum_for_PasswordPolicyResponseValue_error, PasswordPolicyResponseValue_error_passwordExpired /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordExpired /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_accountLocked /* IMPORTED_LONG_ENUMERATION_ITEM */, accountLocked /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_changeAfterReset /* IMPORTED_LONG_ENUMERATION_ITEM */, changeAfterReset /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordModNotAllowed /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordModNotAllowed /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_mustSupplyOldPassword /* IMPORTED_LONG_ENUMERATION_ITEM */, mustSupplyOldPassword /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_insufficientPasswordQuality /* IMPORTED_LONG_ENUMERATION_ITEM */, insufficientPasswordQuality /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordTooShort /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordTooShort /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordTooYoung /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordTooYoung /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordInHistory /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordInHistory /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_PasswordPolicyResponseValue_error, _encode_PasswordPolicyResponseValue_error } from "../LDAPPasswordPolicy/PasswordPolicyResponseValue-error.ta";
export { PasswordPolicyResponseValue_error, _enum_for_PasswordPolicyResponseValue_error, PasswordPolicyResponseValue_error_passwordExpired /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordExpired /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_accountLocked /* IMPORTED_LONG_ENUMERATION_ITEM */, accountLocked /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_changeAfterReset /* IMPORTED_LONG_ENUMERATION_ITEM */, changeAfterReset /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordModNotAllowed /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordModNotAllowed /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_mustSupplyOldPassword /* IMPORTED_LONG_ENUMERATION_ITEM */, mustSupplyOldPassword /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_insufficientPasswordQuality /* IMPORTED_LONG_ENUMERATION_ITEM */, insufficientPasswordQuality /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordTooShort /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordTooShort /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordTooYoung /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordTooYoung /* IMPORTED_SHORT_ENUMERATION_ITEM */, PasswordPolicyResponseValue_error_passwordInHistory /* IMPORTED_LONG_ENUMERATION_ITEM */, passwordInHistory /* IMPORTED_SHORT_ENUMERATION_ITEM */, _decode_PasswordPolicyResponseValue_error, _encode_PasswordPolicyResponseValue_error } from "../LDAPPasswordPolicy/PasswordPolicyResponseValue-error.ta";


/* START_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue */
/**
 * @summary PasswordPolicyResponseValue
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * PasswordPolicyResponseValue ::= SEQUENCE {
 *     warning [0] CHOICE {
 *         timeBeforeExpiration [0] INTEGER (0 .. maxInt),
 *         graceAuthNsRemaining [1] INTEGER (0 .. maxInt) } OPTIONAL,
 *     error   [1] ENUMERATED {
 *         passwordExpired             (0),
 *         accountLocked               (1),
 *         changeAfterReset            (2),
 *         passwordModNotAllowed       (3),
 *         mustSupplyOldPassword       (4),
 *         insufficientPasswordQuality (5),
 *         passwordTooShort            (6),
 *         passwordTooYoung            (7),
 *         passwordInHistory           (8) } OPTIONAL }
 * ```
 * 
 * @class
 */
export
class PasswordPolicyResponseValue {
    constructor (
        /**
         * @summary `warning`.
         * @public
         * @readonly
         */
        readonly warning: OPTIONAL<PasswordPolicyResponseValue_warning>,
        /**
         * @summary `error`.
         * @public
         * @readonly
         */
        readonly error: OPTIONAL<PasswordPolicyResponseValue_error>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a PasswordPolicyResponseValue
     * @description
     * 
     * This takes an `object` and converts it to a `PasswordPolicyResponseValue`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `PasswordPolicyResponseValue`.
     * @returns {PasswordPolicyResponseValue}
     */
    public static _from_object (_o: { [_K in keyof (PasswordPolicyResponseValue)]: (PasswordPolicyResponseValue)[_K] }): PasswordPolicyResponseValue {
        return new PasswordPolicyResponseValue(_o.warning, _o.error, _o._unrecognizedExtensionsList);
    }

        /**
         * @summary The enum used as the type of the component `error`
         * @public
         * @static
         */

    public static _enum_for_error = _enum_for_PasswordPolicyResponseValue_error;
}
/* END_OF_SYMBOL_DEFINITION PasswordPolicyResponseValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PasswordPolicyResponseValue */
/**
 * @summary The Leading Root Component Types of PasswordPolicyResponseValue
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_PasswordPolicyResponseValue: $.ComponentSpec[] = [
    new $.ComponentSpec("warning", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("error", true, $.hasTag(_TagClass.context, 1), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PasswordPolicyResponseValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PasswordPolicyResponseValue */
/**
 * @summary The Trailing Root Component Types of PasswordPolicyResponseValue
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_PasswordPolicyResponseValue: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PasswordPolicyResponseValue */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PasswordPolicyResponseValue */
/**
 * @summary The Extension Addition Component Types of PasswordPolicyResponseValue
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_PasswordPolicyResponseValue: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PasswordPolicyResponseValue */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PasswordPolicyResponseValue */
let _cached_decoder_for_PasswordPolicyResponseValue: $.ASN1Decoder<PasswordPolicyResponseValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PasswordPolicyResponseValue */

/* START_OF_SYMBOL_DEFINITION _decode_PasswordPolicyResponseValue */
/**
 * @summary Decodes an ASN.1 element into a(n) PasswordPolicyResponseValue
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PasswordPolicyResponseValue} The decoded data structure.
 */
export
function _decode_PasswordPolicyResponseValue (el: _Element) {
    if (!_cached_decoder_for_PasswordPolicyResponseValue) { _cached_decoder_for_PasswordPolicyResponseValue = function (el: _Element): PasswordPolicyResponseValue {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let warning: OPTIONAL<PasswordPolicyResponseValue_warning>;
    let error: OPTIONAL<PasswordPolicyResponseValue_error>;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "warning": (_el: _Element): void => { warning = $._decode_explicit<PasswordPolicyResponseValue_warning>(() => _decode_PasswordPolicyResponseValue_warning)(_el); },
        "error": (_el: _Element): void => { error = $._decode_explicit<PasswordPolicyResponseValue_error>(() => _decode_PasswordPolicyResponseValue_error)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_PasswordPolicyResponseValue,
        _extension_additions_list_spec_for_PasswordPolicyResponseValue,
        _root_component_type_list_2_spec_for_PasswordPolicyResponseValue,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new PasswordPolicyResponseValue( /* SEQUENCE_CONSTRUCTOR_CALL */
        warning,
        error,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_PasswordPolicyResponseValue(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PasswordPolicyResponseValue */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PasswordPolicyResponseValue */
let _cached_encoder_for_PasswordPolicyResponseValue: $.ASN1Encoder<PasswordPolicyResponseValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PasswordPolicyResponseValue */

/* START_OF_SYMBOL_DEFINITION _encode_PasswordPolicyResponseValue */
/**
 * @summary Encodes a(n) PasswordPolicyResponseValue into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PasswordPolicyResponseValue, encoded as an ASN.1 Element.
 */
export
function _encode_PasswordPolicyResponseValue (value: PasswordPolicyResponseValue, elGetter: $.ASN1Encoder<PasswordPolicyResponseValue>) {
    if (!_cached_encoder_for_PasswordPolicyResponseValue) { _cached_encoder_for_PasswordPolicyResponseValue = function (value: PasswordPolicyResponseValue, elGetter: $.ASN1Encoder<PasswordPolicyResponseValue>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.warning === undefined) ? undefined : $._encode_explicit(_TagClass.context, 0, () => _encode_PasswordPolicyResponseValue_warning, $.BER)(value.warning, $.BER)),
            /* IF_ABSENT  */ ((value.error === undefined) ? undefined : $._encode_explicit(_TagClass.context, 1, () => _encode_PasswordPolicyResponseValue_error, $.BER)(value.error, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_PasswordPolicyResponseValue(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PasswordPolicyResponseValue */

/* eslint-enable */
