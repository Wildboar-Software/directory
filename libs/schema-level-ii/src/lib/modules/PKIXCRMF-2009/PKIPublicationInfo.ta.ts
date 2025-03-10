/* eslint-disable */
import {
    OPTIONAL,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { PKIPublicationInfo_action, _decode_PKIPublicationInfo_action, _encode_PKIPublicationInfo_action } from "../PKIXCRMF-2009/PKIPublicationInfo-action.ta";
import { SinglePubInfo, _decode_SinglePubInfo, _encode_SinglePubInfo } from "../PKIXCRMF-2009/SinglePubInfo.ta";


/* START_OF_SYMBOL_DEFINITION PKIPublicationInfo */
/**
 * @summary PKIPublicationInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PKIPublicationInfo ::= SEQUENCE {
 *     action     INTEGER {
 *                     dontPublish (0),
 *                     pleasePublish (1) },
 *     pubInfos  SEQUENCE SIZE (1..MAX) OF SinglePubInfo OPTIONAL }
 * ```
 *
 * @class
 */
export
class PKIPublicationInfo {
    constructor (
        /**
         * @summary `action`.
         * @public
         * @readonly
         */
        readonly action: PKIPublicationInfo_action,
        /**
         * @summary `pubInfos`.
         * @public
         * @readonly
         */
        readonly pubInfos: OPTIONAL<SinglePubInfo[]>
    ) {}

    /**
     * @summary Restructures an object into a PKIPublicationInfo
     * @description
     *
     * This takes an `object` and converts it to a `PKIPublicationInfo`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `PKIPublicationInfo`.
     * @returns {PKIPublicationInfo}
     */
    public static _from_object (_o: { [_K in keyof (PKIPublicationInfo)]: (PKIPublicationInfo)[_K] }): PKIPublicationInfo {
        return new PKIPublicationInfo(_o.action, _o.pubInfos);
    }


}
/* END_OF_SYMBOL_DEFINITION PKIPublicationInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PKIPublicationInfo */
/**
 * @summary The Leading Root Component Types of PKIPublicationInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_PKIPublicationInfo: $.ComponentSpec[] = [
    new $.ComponentSpec("action", false, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("pubInfos", true, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PKIPublicationInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PKIPublicationInfo */
/**
 * @summary The Trailing Root Component Types of PKIPublicationInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_PKIPublicationInfo: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PKIPublicationInfo */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PKIPublicationInfo */
/**
 * @summary The Extension Addition Component Types of PKIPublicationInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_PKIPublicationInfo: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PKIPublicationInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PKIPublicationInfo */
let _cached_decoder_for_PKIPublicationInfo: $.ASN1Decoder<PKIPublicationInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PKIPublicationInfo */

/* START_OF_SYMBOL_DEFINITION _decode_PKIPublicationInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) PKIPublicationInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PKIPublicationInfo} The decoded data structure.
 */
export
function _decode_PKIPublicationInfo (el: _Element) {
    if (!_cached_decoder_for_PKIPublicationInfo) { _cached_decoder_for_PKIPublicationInfo = function (el: _Element): PKIPublicationInfo {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let action!: PKIPublicationInfo_action;
    let pubInfos: OPTIONAL<SinglePubInfo[]>;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "action": (_el: _Element): void => { action = _decode_PKIPublicationInfo_action(_el); },
        "pubInfos": (_el: _Element): void => { pubInfos = $._decodeSequenceOf<SinglePubInfo>(() => _decode_SinglePubInfo)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_PKIPublicationInfo,
        _extension_additions_list_spec_for_PKIPublicationInfo,
        _root_component_type_list_2_spec_for_PKIPublicationInfo,
        undefined,
    );
    return new PKIPublicationInfo( /* SEQUENCE_CONSTRUCTOR_CALL */
        action,
        pubInfos
    );
}; }
    return _cached_decoder_for_PKIPublicationInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PKIPublicationInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PKIPublicationInfo */
let _cached_encoder_for_PKIPublicationInfo: $.ASN1Encoder<PKIPublicationInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PKIPublicationInfo */

/* START_OF_SYMBOL_DEFINITION _encode_PKIPublicationInfo */
/**
 * @summary Encodes a(n) PKIPublicationInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PKIPublicationInfo, encoded as an ASN.1 Element.
 */
export
function _encode_PKIPublicationInfo (value: PKIPublicationInfo, elGetter: $.ASN1Encoder<PKIPublicationInfo>) {
    if (!_cached_encoder_for_PKIPublicationInfo) { _cached_encoder_for_PKIPublicationInfo = function (value: PKIPublicationInfo, elGetter: $.ASN1Encoder<PKIPublicationInfo>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_PKIPublicationInfo_action(value.action, $.BER),
            /* IF_ABSENT  */ ((value.pubInfos === undefined) ? undefined : $._encodeSequenceOf<SinglePubInfo>(() => _encode_SinglePubInfo, $.BER)(value.pubInfos, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_PKIPublicationInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PKIPublicationInfo */

/* eslint-enable */
