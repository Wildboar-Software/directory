/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION ContentInfo */
/**
 * @summary ContentInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ContentInfo ::= SEQUENCE {
 *     contentType     OBJECT IDENTIFIER,
 *     content         [0] EXPLICIT ANY DEFINED BY contentType }
 * ```
 *
 * @class
 */
export class ContentInfo {
    constructor(
        /**
         * @summary `contentType`.
         * @public
         * @readonly
         */
        readonly contentType: OBJECT_IDENTIFIER,
        /**
         * @summary `content`.
         * @public
         * @readonly
         */
        readonly content: ASN1Element
    ) {}

    /**
     * @summary Restructures an object into a ContentInfo
     * @description
     *
     * This takes an `object` and converts it to a `ContentInfo`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ContentInfo`.
     * @returns {ContentInfo}
     */
    public static _from_object(_o: {
        [_K in keyof ContentInfo]: ContentInfo[_K];
    }): ContentInfo {
        return new ContentInfo(_o.contentType, _o.content);
    }
}
/* END_OF_SYMBOL_DEFINITION ContentInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ContentInfo */
/**
 * @summary The Leading Root Component Types of ContentInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_ContentInfo: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'contentType',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'content',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ContentInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ContentInfo */
/**
 * @summary The Trailing Root Component Types of ContentInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_ContentInfo: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ContentInfo */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ContentInfo */
/**
 * @summary The Extension Addition Component Types of ContentInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_ContentInfo: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ContentInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentInfo */
let _cached_decoder_for_ContentInfo: $.ASN1Decoder<ContentInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentInfo */

/* START_OF_SYMBOL_DEFINITION _decode_ContentInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) ContentInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ContentInfo} The decoded data structure.
 */
export function _decode_ContentInfo(el: _Element) {
    if (!_cached_decoder_for_ContentInfo) {
        _cached_decoder_for_ContentInfo = function (el: _Element): ContentInfo {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'ContentInfo contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'contentType';
            sequence[1].name = 'content';
            let contentType!: OBJECT_IDENTIFIER;
            let content!: ASN1Element;
            contentType = $._decodeObjectIdentifier(sequence[0]);
            content = $._decodeAny(sequence[1]);
            return new ContentInfo(contentType, content);
        };
    }
    return _cached_decoder_for_ContentInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ContentInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentInfo */
let _cached_encoder_for_ContentInfo: $.ASN1Encoder<ContentInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentInfo */

/* START_OF_SYMBOL_DEFINITION _encode_ContentInfo */
/**
 * @summary Encodes a(n) ContentInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ContentInfo, encoded as an ASN.1 Element.
 */
export function _encode_ContentInfo(
    value: ContentInfo,
    elGetter: $.ASN1Encoder<ContentInfo>
) {
    if (!_cached_encoder_for_ContentInfo) {
        _cached_encoder_for_ContentInfo = function (
            value: ContentInfo,
            elGetter: $.ASN1Encoder<ContentInfo>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ $._encodeObjectIdentifier(
                            value.contentType,
                            $.BER
                        ),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            0,
                            () => $._encodeAny,
                            $.BER
                        )(value.content, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_ContentInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ContentInfo */

/* eslint-enable */
