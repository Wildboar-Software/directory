/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    type OPTIONAL,
    UTF8String,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    ContentType,
    _decode_ContentType,
    _encode_ContentType,
} from '../ExtendedSecurityServices-2009/ContentType.ta';

/* START_OF_SYMBOL_DEFINITION ContentHints */
/**
 * @summary ContentHints
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ContentHints ::= SEQUENCE {
 *     contentDescription UTF8String (SIZE (1..MAX)) OPTIONAL,
 *     contentType ContentType }
 * ```
 *
 * @class
 */
export class ContentHints {
    constructor(
        /**
         * @summary `contentDescription`.
         * @public
         * @readonly
         */
        readonly contentDescription: OPTIONAL<UTF8String>,
        /**
         * @summary `contentType`.
         * @public
         * @readonly
         */
        readonly contentType: ContentType
    ) {}

    /**
     * @summary Restructures an object into a ContentHints
     * @description
     *
     * This takes an `object` and converts it to a `ContentHints`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ContentHints`.
     * @returns {ContentHints}
     */
    public static _from_object(_o: {
        [_K in keyof ContentHints]: ContentHints[_K];
    }): ContentHints {
        return new ContentHints(_o.contentDescription, _o.contentType);
    }
}
/* END_OF_SYMBOL_DEFINITION ContentHints */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ContentHints */
/**
 * @summary The Leading Root Component Types of ContentHints
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_ContentHints: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'contentDescription',
            true,
            $.hasTag(_TagClass.universal, 12),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'contentType',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ContentHints */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ContentHints */
/**
 * @summary The Trailing Root Component Types of ContentHints
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_ContentHints: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ContentHints */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ContentHints */
/**
 * @summary The Extension Addition Component Types of ContentHints
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_ContentHints: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ContentHints */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentHints */
let _cached_decoder_for_ContentHints: $.ASN1Decoder<ContentHints> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ContentHints */

/* START_OF_SYMBOL_DEFINITION _decode_ContentHints */
/**
 * @summary Decodes an ASN.1 element into a(n) ContentHints
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ContentHints} The decoded data structure.
 */
export function _decode_ContentHints(el: _Element) {
    if (!_cached_decoder_for_ContentHints) {
        _cached_decoder_for_ContentHints = function (
            el: _Element
        ): ContentHints {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let contentDescription: OPTIONAL<UTF8String>;
            let contentType!: ContentType;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                contentDescription: (_el: _Element): void => {
                    contentDescription = $._decodeUTF8String(_el);
                },
                contentType: (_el: _Element): void => {
                    contentType = _decode_ContentType(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_ContentHints,
                _extension_additions_list_spec_for_ContentHints,
                _root_component_type_list_2_spec_for_ContentHints,
                undefined
            );
            return new ContentHints /* SEQUENCE_CONSTRUCTOR_CALL */(
                contentDescription,
                contentType
            );
        };
    }
    return _cached_decoder_for_ContentHints(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ContentHints */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentHints */
let _cached_encoder_for_ContentHints: $.ASN1Encoder<ContentHints> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ContentHints */

/* START_OF_SYMBOL_DEFINITION _encode_ContentHints */
/**
 * @summary Encodes a(n) ContentHints into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ContentHints, encoded as an ASN.1 Element.
 */
export function _encode_ContentHints(
    value: ContentHints,
    elGetter: $.ASN1Encoder<ContentHints>
) {
    if (!_cached_encoder_for_ContentHints) {
        _cached_encoder_for_ContentHints = function (
            value: ContentHints,
            elGetter: $.ASN1Encoder<ContentHints>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* IF_ABSENT  */ value.contentDescription === undefined
                            ? undefined
                            : $._encodeUTF8String(
                                  value.contentDescription,
                                  $.BER
                              ),
                        /* REQUIRED   */ _encode_ContentType(
                            value.contentType,
                            $.BER
                        ),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_ContentHints(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ContentHints */

/* eslint-enable */
