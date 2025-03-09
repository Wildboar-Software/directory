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



/* START_OF_SYMBOL_DEFINITION MailBox */
/**
 * @summary MailBox
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * MailBox ::= SEQUENCE {
 *     mailboxType     PrintableString,
 *     mailbox         IA5String,
 *     ...
 * }
 * ```
 * 
 * @class
 */
export
class MailBox {
    constructor (
        /**
         * @summary `mailboxType`.
         * @public
         * @readonly
         */
        readonly mailboxType: PrintableString,
        /**
         * @summary `mailbox`.
         * @public
         * @readonly
         */
        readonly mailbox: IA5String,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a MailBox
     * @description
     * 
     * This takes an `object` and converts it to a `MailBox`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `MailBox`.
     * @returns {MailBox}
     */
    public static _from_object (_o: { [_K in keyof (MailBox)]: (MailBox)[_K] }): MailBox {
        return new MailBox(_o.mailboxType, _o.mailbox, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION MailBox */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MailBox */
/**
 * @summary The Leading Root Component Types of MailBox
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_MailBox: $.ComponentSpec[] = [
    new $.ComponentSpec("mailboxType", false, $.hasTag(_TagClass.universal, 19), undefined, undefined),
    new $.ComponentSpec("mailbox", false, $.hasTag(_TagClass.universal, 22), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MailBox */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MailBox */
/**
 * @summary The Trailing Root Component Types of MailBox
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_MailBox: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MailBox */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MailBox */
/**
 * @summary The Extension Addition Component Types of MailBox
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_MailBox: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MailBox */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MailBox */
let _cached_decoder_for_MailBox: $.ASN1Decoder<MailBox> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MailBox */

/* START_OF_SYMBOL_DEFINITION _decode_MailBox */
/**
 * @summary Decodes an ASN.1 element into a(n) MailBox
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MailBox} The decoded data structure.
 */
export
function _decode_MailBox (el: _Element) {
    if (!_cached_decoder_for_MailBox) { _cached_decoder_for_MailBox = function (el: _Element): MailBox {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 2) {
        throw new _ConstructionError("MailBox contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "mailboxType";
    sequence[1].name = "mailbox";
    let mailboxType!: PrintableString;
    let mailbox!: IA5String;
    mailboxType = $._decodePrintableString(sequence[0]);
    mailbox = $._decodeIA5String(sequence[1]);
    return new MailBox(
        mailboxType,
        mailbox,
        sequence.slice(2),
    );
}; }
    return _cached_decoder_for_MailBox(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MailBox */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MailBox */
let _cached_encoder_for_MailBox: $.ASN1Encoder<MailBox> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MailBox */

/* START_OF_SYMBOL_DEFINITION _encode_MailBox */
/**
 * @summary Encodes a(n) MailBox into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MailBox, encoded as an ASN.1 Element.
 */
export
function _encode_MailBox (value: MailBox, elGetter: $.ASN1Encoder<MailBox>) {
    if (!_cached_encoder_for_MailBox) { _cached_encoder_for_MailBox = function (value: MailBox, elGetter: $.ASN1Encoder<MailBox>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encodePrintableString(value.mailboxType, $.BER),
            /* REQUIRED   */ $._encodeIA5String(value.mailbox, $.BER)
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_MailBox(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MailBox */

/* eslint-enable */
