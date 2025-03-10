/* eslint-disable */
import { GeneralName, _decode_GeneralName, _encode_GeneralName } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import {
    INTEGER,
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";


/* START_OF_SYMBOL_DEFINITION CertId */
/**
 * @summary CertId
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CertId ::= SEQUENCE {
 *     issuer           GeneralName,
 *     serialNumber     INTEGER }
 * ```
 *
 * @class
 */
export
class CertId {
    constructor (
        /**
         * @summary `issuer`.
         * @public
         * @readonly
         */
        readonly issuer: GeneralName,
        /**
         * @summary `serialNumber`.
         * @public
         * @readonly
         */
        readonly serialNumber: INTEGER
    ) {}

    /**
     * @summary Restructures an object into a CertId
     * @description
     *
     * This takes an `object` and converts it to a `CertId`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `CertId`.
     * @returns {CertId}
     */
    public static _from_object (_o: { [_K in keyof (CertId)]: (CertId)[_K] }): CertId {
        return new CertId(_o.issuer, _o.serialNumber);
    }


}
/* END_OF_SYMBOL_DEFINITION CertId */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertId */
/**
 * @summary The Leading Root Component Types of CertId
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_CertId: $.ComponentSpec[] = [
    new $.ComponentSpec("issuer", false, $.hasAnyTag, undefined, undefined),
    new $.ComponentSpec("serialNumber", false, $.hasTag(_TagClass.universal, 2), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertId */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertId */
/**
 * @summary The Trailing Root Component Types of CertId
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_CertId: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertId */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertId */
/**
 * @summary The Extension Addition Component Types of CertId
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_CertId: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertId */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CertId */
let _cached_decoder_for_CertId: $.ASN1Decoder<CertId> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CertId */

/* START_OF_SYMBOL_DEFINITION _decode_CertId */
/**
 * @summary Decodes an ASN.1 element into a(n) CertId
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CertId} The decoded data structure.
 */
export
function _decode_CertId (el: _Element) {
    if (!_cached_decoder_for_CertId) { _cached_decoder_for_CertId = function (el: _Element): CertId {
    const sequence: _Element[] = el.sequence;
    if (sequence.length < 2) {
        throw new _ConstructionError("CertId contained only " + sequence.length.toString() + " elements.");
    }
    sequence[0].name = "issuer";
    sequence[1].name = "serialNumber";
    let issuer!: GeneralName;
    let serialNumber!: INTEGER;
    issuer = _decode_GeneralName(sequence[0]);
    serialNumber = $._decodeInteger(sequence[1]);
    return new CertId(
        issuer,
        serialNumber,

    );
}; }
    return _cached_decoder_for_CertId(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CertId */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CertId */
let _cached_encoder_for_CertId: $.ASN1Encoder<CertId> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CertId */

/* START_OF_SYMBOL_DEFINITION _encode_CertId */
/**
 * @summary Encodes a(n) CertId into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CertId, encoded as an ASN.1 Element.
 */
export
function _encode_CertId (value: CertId, elGetter: $.ASN1Encoder<CertId>) {
    if (!_cached_encoder_for_CertId) { _cached_encoder_for_CertId = function (value: CertId, elGetter: $.ASN1Encoder<CertId>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_GeneralName(value.issuer, $.BER),
            /* REQUIRED   */ $._encodeInteger(value.serialNumber, $.BER)
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_CertId(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CertId */

/* eslint-enable */
