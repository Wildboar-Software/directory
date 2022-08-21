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
import { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
export { DistinguishedName, _decode_DistinguishedName, _encode_DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";


/* START_OF_SYMBOL_DEFINITION LockSession */
/**
 * @summary LockSession
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * LockSession ::= SEQUENCE {
 *   entryName  [0]  DistinguishedName,
 *   atribute   [1]  OBJECT IDENTIFIER
 * }
 * ```
 * 
 * @class
 */
export
class LockSession {
    constructor (
        /**
         * @summary `entryName`.
         * @public
         * @readonly
         */
        readonly entryName: DistinguishedName,
        /**
         * @summary `atribute`.
         * @public
         * @readonly
         */
        readonly atribute: OBJECT_IDENTIFIER,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a LockSession
     * @description
     * 
     * This takes an `object` and converts it to a `LockSession`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `LockSession`.
     * @returns {LockSession}
     */
    public static _from_object (_o: { [_K in keyof (LockSession)]: (LockSession)[_K] }): LockSession {
        return new LockSession(_o.entryName, _o.atribute, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION LockSession */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_LockSession */
/**
 * @summary The Leading Root Component Types of LockSession
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_LockSession: $.ComponentSpec[] = [
    new $.ComponentSpec("entryName", false, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("atribute", false, $.hasTag(_TagClass.context, 1), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_LockSession */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_LockSession */
/**
 * @summary The Trailing Root Component Types of LockSession
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_LockSession: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_LockSession */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_LockSession */
/**
 * @summary The Extension Addition Component Types of LockSession
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_LockSession: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_LockSession */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_LockSession */
let _cached_decoder_for_LockSession: $.ASN1Decoder<LockSession> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_LockSession */

/* START_OF_SYMBOL_DEFINITION _decode_LockSession */
/**
 * @summary Decodes an ASN.1 element into a(n) LockSession
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {LockSession} The decoded data structure.
 */
export
function _decode_LockSession (el: _Element) {
    if (!_cached_decoder_for_LockSession) { _cached_decoder_for_LockSession = function (el: _Element): LockSession {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 2) {
        throw new _ConstructionError("LockSession contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "entryName";
    sequence[1].name = "atribute";
    let entryName!: DistinguishedName;
    let atribute!: OBJECT_IDENTIFIER;
    entryName = $._decode_explicit<DistinguishedName>(() => _decode_DistinguishedName)(sequence[0]);
    atribute = $._decode_explicit<OBJECT_IDENTIFIER>(() => $._decodeObjectIdentifier)(sequence[1]);
    return new LockSession(
        entryName,
        atribute,
        sequence.slice(2),
    );
}; }
    return _cached_decoder_for_LockSession(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_LockSession */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_LockSession */
let _cached_encoder_for_LockSession: $.ASN1Encoder<LockSession> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_LockSession */

/* START_OF_SYMBOL_DEFINITION _encode_LockSession */
/**
 * @summary Encodes a(n) LockSession into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The LockSession, encoded as an ASN.1 Element.
 */
export
function _encode_LockSession (value: LockSession, elGetter: $.ASN1Encoder<LockSession>) {
    if (!_cached_encoder_for_LockSession) { _cached_encoder_for_LockSession = function (value: LockSession, elGetter: $.ASN1Encoder<LockSession>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encode_explicit(_TagClass.context, 0, () => _encode_DistinguishedName, $.BER)(value.entryName, $.BER),
            /* REQUIRED   */ $._encode_explicit(_TagClass.context, 1, () => $._encodeObjectIdentifier, $.BER)(value.atribute, $.BER)
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_LockSession(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_LockSession */

/* eslint-enable */
