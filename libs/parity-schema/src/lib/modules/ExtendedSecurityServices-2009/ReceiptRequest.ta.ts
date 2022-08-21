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
import { ContentIdentifier, _decode_ContentIdentifier, _encode_ContentIdentifier } from "../ExtendedSecurityServices-2009/ContentIdentifier.ta";
export { ContentIdentifier, _decode_ContentIdentifier, _encode_ContentIdentifier } from "../ExtendedSecurityServices-2009/ContentIdentifier.ta";
import { ReceiptsFrom, _decode_ReceiptsFrom, _encode_ReceiptsFrom } from "../ExtendedSecurityServices-2009/ReceiptsFrom.ta";
export { ReceiptsFrom, _decode_ReceiptsFrom, _encode_ReceiptsFrom } from "../ExtendedSecurityServices-2009/ReceiptsFrom.ta";
import { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";
export { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";


/* START_OF_SYMBOL_DEFINITION ReceiptRequest */
/**
 * @summary ReceiptRequest
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ReceiptRequest ::= SEQUENCE {
 *     signedContentIdentifier ContentIdentifier,
 *     receiptsFrom ReceiptsFrom,
 *     receiptsTo SEQUENCE SIZE (1..ub-receiptsTo) OF GeneralNames
 * }
 * ```
 * 
 * @class
 */
export
class ReceiptRequest {
    constructor (
        /**
         * @summary `signedContentIdentifier`.
         * @public
         * @readonly
         */
        readonly signedContentIdentifier: ContentIdentifier,
        /**
         * @summary `receiptsFrom`.
         * @public
         * @readonly
         */
        readonly receiptsFrom: ReceiptsFrom,
        /**
         * @summary `receiptsTo`.
         * @public
         * @readonly
         */
        readonly receiptsTo: GeneralNames[]
    ) {}

    /**
     * @summary Restructures an object into a ReceiptRequest
     * @description
     * 
     * This takes an `object` and converts it to a `ReceiptRequest`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ReceiptRequest`.
     * @returns {ReceiptRequest}
     */
    public static _from_object (_o: { [_K in keyof (ReceiptRequest)]: (ReceiptRequest)[_K] }): ReceiptRequest {
        return new ReceiptRequest(_o.signedContentIdentifier, _o.receiptsFrom, _o.receiptsTo);
    }


}
/* END_OF_SYMBOL_DEFINITION ReceiptRequest */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ReceiptRequest */
/**
 * @summary The Leading Root Component Types of ReceiptRequest
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_ReceiptRequest: $.ComponentSpec[] = [
    new $.ComponentSpec("signedContentIdentifier", false, $.hasTag(_TagClass.universal, 4), undefined, undefined),
    new $.ComponentSpec("receiptsFrom", false, $.hasAnyTag, undefined, undefined),
    new $.ComponentSpec("receiptsTo", false, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ReceiptRequest */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ReceiptRequest */
/**
 * @summary The Trailing Root Component Types of ReceiptRequest
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_ReceiptRequest: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ReceiptRequest */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ReceiptRequest */
/**
 * @summary The Extension Addition Component Types of ReceiptRequest
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_ReceiptRequest: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ReceiptRequest */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ReceiptRequest */
let _cached_decoder_for_ReceiptRequest: $.ASN1Decoder<ReceiptRequest> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ReceiptRequest */

/* START_OF_SYMBOL_DEFINITION _decode_ReceiptRequest */
/**
 * @summary Decodes an ASN.1 element into a(n) ReceiptRequest
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ReceiptRequest} The decoded data structure.
 */
export
function _decode_ReceiptRequest (el: _Element) {
    if (!_cached_decoder_for_ReceiptRequest) { _cached_decoder_for_ReceiptRequest = function (el: _Element): ReceiptRequest {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 3) {
        throw new _ConstructionError("ReceiptRequest contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "signedContentIdentifier";
    sequence[1].name = "receiptsFrom";
    sequence[2].name = "receiptsTo";
    let signedContentIdentifier!: ContentIdentifier;
    let receiptsFrom!: ReceiptsFrom;
    let receiptsTo!: GeneralNames[];
    signedContentIdentifier = _decode_ContentIdentifier(sequence[0]);
    receiptsFrom = _decode_ReceiptsFrom(sequence[1]);
    receiptsTo = $._decodeSequenceOf<GeneralNames>(() => _decode_GeneralNames)(sequence[2]);
    return new ReceiptRequest(
        signedContentIdentifier,
        receiptsFrom,
        receiptsTo,

    );
}; }
    return _cached_decoder_for_ReceiptRequest(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ReceiptRequest */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ReceiptRequest */
let _cached_encoder_for_ReceiptRequest: $.ASN1Encoder<ReceiptRequest> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ReceiptRequest */

/* START_OF_SYMBOL_DEFINITION _encode_ReceiptRequest */
/**
 * @summary Encodes a(n) ReceiptRequest into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ReceiptRequest, encoded as an ASN.1 Element.
 */
export
function _encode_ReceiptRequest (value: ReceiptRequest, elGetter: $.ASN1Encoder<ReceiptRequest>) {
    if (!_cached_encoder_for_ReceiptRequest) { _cached_encoder_for_ReceiptRequest = function (value: ReceiptRequest, elGetter: $.ASN1Encoder<ReceiptRequest>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_ContentIdentifier(value.signedContentIdentifier, $.BER),
            /* REQUIRED   */ _encode_ReceiptsFrom(value.receiptsFrom, $.BER),
            /* REQUIRED   */ $._encodeSequenceOf<GeneralNames>(() => _encode_GeneralNames, $.BER)(value.receiptsTo, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_ReceiptRequest(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ReceiptRequest */

/* eslint-enable */
