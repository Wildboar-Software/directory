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
import { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
export { AlgorithmIdentifier, _decode_AlgorithmIdentifier, _encode_AlgorithmIdentifier } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION EncryptedValue */
/**
 * @summary EncryptedValue
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * EncryptedValue ::= SEQUENCE {
 *     intendedAlg   [0] AlgorithmIdentifier{{SupportedAlgorithms}}  OPTIONAL,
 *     -- the intended algorithm for which the value will be used
 *     symmAlg       [1] AlgorithmIdentifier{{SupportedAlgorithms}}  OPTIONAL,
 *     -- the symmetric algorithm used to encrypt the value
 *     encSymmKey    [2] BIT STRING           OPTIONAL,
 *     -- the (encrypted) symmetric key used to encrypt the value
 *     keyAlg        [3] AlgorithmIdentifier{{SupportedAlgorithms}}  OPTIONAL,
 *     -- algorithm used to encrypt the symmetric key
 *     valueHint     [4] OCTET STRING         OPTIONAL,
 *     -- a brief description or identifier of the encValue content
 *     -- (may be meaningful only to the sending entity, and used only
 *     -- if EncryptedValue might be re-examined by the sending entity
 * 
 *     -- in the future)
 *     encValue       BIT STRING }
 * ```
 * 
 * @class
 */
export
class EncryptedValue {
    constructor (
        /**
         * @summary `intendedAlg`.
         * @public
         * @readonly
         */
        readonly intendedAlg: OPTIONAL<AlgorithmIdentifier>,
        /**
         * @summary `symmAlg`.
         * @public
         * @readonly
         */
        readonly symmAlg: OPTIONAL<AlgorithmIdentifier>,
        /**
         * @summary `encSymmKey`.
         * @public
         * @readonly
         */
        readonly encSymmKey: OPTIONAL<BIT_STRING>,
        /**
         * @summary `keyAlg`.
         * @public
         * @readonly
         */
        readonly keyAlg: OPTIONAL<AlgorithmIdentifier>,
        /**
         * @summary `valueHint`.
         * @public
         * @readonly
         */
        readonly valueHint: OPTIONAL<OCTET_STRING>,
        /**
         * @summary `encValue`.
         * @public
         * @readonly
         */
        readonly encValue: BIT_STRING
    ) {}

    /**
     * @summary Restructures an object into a EncryptedValue
     * @description
     * 
     * This takes an `object` and converts it to a `EncryptedValue`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `EncryptedValue`.
     * @returns {EncryptedValue}
     */
    public static _from_object (_o: { [_K in keyof (EncryptedValue)]: (EncryptedValue)[_K] }): EncryptedValue {
        return new EncryptedValue(_o.intendedAlg, _o.symmAlg, _o.encSymmKey, _o.keyAlg, _o.valueHint, _o.encValue);
    }


}
/* END_OF_SYMBOL_DEFINITION EncryptedValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_EncryptedValue */
/**
 * @summary The Leading Root Component Types of EncryptedValue
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_EncryptedValue: $.ComponentSpec[] = [
    new $.ComponentSpec("intendedAlg", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("symmAlg", true, $.hasTag(_TagClass.context, 1), undefined, undefined),
    new $.ComponentSpec("encSymmKey", true, $.hasTag(_TagClass.context, 2), undefined, undefined),
    new $.ComponentSpec("keyAlg", true, $.hasTag(_TagClass.context, 3), undefined, undefined),
    new $.ComponentSpec("valueHint", true, $.hasTag(_TagClass.context, 4), undefined, undefined),
    new $.ComponentSpec("encValue", false, $.hasTag(_TagClass.universal, 3), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_EncryptedValue */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_EncryptedValue */
/**
 * @summary The Trailing Root Component Types of EncryptedValue
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_EncryptedValue: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_EncryptedValue */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_EncryptedValue */
/**
 * @summary The Extension Addition Component Types of EncryptedValue
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_EncryptedValue: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_EncryptedValue */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_EncryptedValue */
let _cached_decoder_for_EncryptedValue: $.ASN1Decoder<EncryptedValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_EncryptedValue */

/* START_OF_SYMBOL_DEFINITION _decode_EncryptedValue */
/**
 * @summary Decodes an ASN.1 element into a(n) EncryptedValue
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {EncryptedValue} The decoded data structure.
 */
export
function _decode_EncryptedValue (el: _Element) {
    if (!_cached_decoder_for_EncryptedValue) { _cached_decoder_for_EncryptedValue = function (el: _Element): EncryptedValue {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let intendedAlg: OPTIONAL<AlgorithmIdentifier>;
    let symmAlg: OPTIONAL<AlgorithmIdentifier>;
    let encSymmKey: OPTIONAL<BIT_STRING>;
    let keyAlg: OPTIONAL<AlgorithmIdentifier>;
    let valueHint: OPTIONAL<OCTET_STRING>;
    let encValue!: BIT_STRING;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "intendedAlg": (_el: _Element): void => { intendedAlg = $._decode_implicit<AlgorithmIdentifier>(() => _decode_AlgorithmIdentifier)(_el); },
        "symmAlg": (_el: _Element): void => { symmAlg = $._decode_implicit<AlgorithmIdentifier>(() => _decode_AlgorithmIdentifier)(_el); },
        "encSymmKey": (_el: _Element): void => { encSymmKey = $._decode_implicit<BIT_STRING>(() => $._decodeBitString)(_el); },
        "keyAlg": (_el: _Element): void => { keyAlg = $._decode_implicit<AlgorithmIdentifier>(() => _decode_AlgorithmIdentifier)(_el); },
        "valueHint": (_el: _Element): void => { valueHint = $._decode_implicit<OCTET_STRING>(() => $._decodeOctetString)(_el); },
        "encValue": (_el: _Element): void => { encValue = $._decodeBitString(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_EncryptedValue,
        _extension_additions_list_spec_for_EncryptedValue,
        _root_component_type_list_2_spec_for_EncryptedValue,
        undefined,
    );
    return new EncryptedValue( /* SEQUENCE_CONSTRUCTOR_CALL */
        intendedAlg,
        symmAlg,
        encSymmKey,
        keyAlg,
        valueHint,
        encValue
    );
}; }
    return _cached_decoder_for_EncryptedValue(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_EncryptedValue */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_EncryptedValue */
let _cached_encoder_for_EncryptedValue: $.ASN1Encoder<EncryptedValue> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_EncryptedValue */

/* START_OF_SYMBOL_DEFINITION _encode_EncryptedValue */
/**
 * @summary Encodes a(n) EncryptedValue into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The EncryptedValue, encoded as an ASN.1 Element.
 */
export
function _encode_EncryptedValue (value: EncryptedValue, elGetter: $.ASN1Encoder<EncryptedValue>) {
    if (!_cached_encoder_for_EncryptedValue) { _cached_encoder_for_EncryptedValue = function (value: EncryptedValue, elGetter: $.ASN1Encoder<EncryptedValue>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.intendedAlg === undefined) ? undefined : $._encode_implicit(_TagClass.context, 0, () => _encode_AlgorithmIdentifier, $.BER)(value.intendedAlg, $.BER)),
            /* IF_ABSENT  */ ((value.symmAlg === undefined) ? undefined : $._encode_implicit(_TagClass.context, 1, () => _encode_AlgorithmIdentifier, $.BER)(value.symmAlg, $.BER)),
            /* IF_ABSENT  */ ((value.encSymmKey === undefined) ? undefined : $._encode_implicit(_TagClass.context, 2, () => $._encodeBitString, $.BER)(value.encSymmKey, $.BER)),
            /* IF_ABSENT  */ ((value.keyAlg === undefined) ? undefined : $._encode_implicit(_TagClass.context, 3, () => _encode_AlgorithmIdentifier, $.BER)(value.keyAlg, $.BER)),
            /* IF_ABSENT  */ ((value.valueHint === undefined) ? undefined : $._encode_implicit(_TagClass.context, 4, () => $._encodeOctetString, $.BER)(value.valueHint, $.BER)),
            /* REQUIRED   */ $._encodeBitString(value.encValue, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_EncryptedValue(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_EncryptedValue */

/* eslint-enable */
