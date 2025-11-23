/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OCTET_STRING,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    ContentIdentifier,
    _decode_ContentIdentifier,
    _encode_ContentIdentifier,
} from '../ExtendedSecurityServices-2009/ContentIdentifier.ta';
import {
    ContentType,
    _decode_ContentType,
    _encode_ContentType,
} from '../ExtendedSecurityServices-2009/ContentType.ta';
import {
    ESSVersion,
    _decode_ESSVersion,
    _encode_ESSVersion,
} from '../ExtendedSecurityServices-2009/ESSVersion.ta';
export {
    ContentIdentifier,
    _decode_ContentIdentifier,
    _encode_ContentIdentifier,
} from '../ExtendedSecurityServices-2009/ContentIdentifier.ta';
export {
    ContentType,
    _decode_ContentType,
    _encode_ContentType,
} from '../ExtendedSecurityServices-2009/ContentType.ta';
export {
    ESSVersion,
    ESSVersion_v1 /* IMPORTED_LONG_NAMED_INTEGER */,
    v1 /* IMPORTED_SHORT_NAMED_INTEGER */,
    _decode_ESSVersion,
    _encode_ESSVersion,
} from '../ExtendedSecurityServices-2009/ESSVersion.ta';

/* START_OF_SYMBOL_DEFINITION Receipt */
/**
 * @summary Receipt
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * Receipt ::= SEQUENCE {
 *     version                   ESSVersion,
 *     contentType               ContentType,
 *     signedContentIdentifier   ContentIdentifier,
 *     originatorSignatureValue  OCTET STRING
 * }
 * ```
 *
 * @class
 */
export class Receipt {
    constructor(
        /**
         * @summary `version`.
         * @public
         * @readonly
         */
        readonly version: ESSVersion,
        /**
         * @summary `contentType`.
         * @public
         * @readonly
         */
        readonly contentType: ContentType,
        /**
         * @summary `signedContentIdentifier`.
         * @public
         * @readonly
         */
        readonly signedContentIdentifier: ContentIdentifier,
        /**
         * @summary `originatorSignatureValue`.
         * @public
         * @readonly
         */
        readonly originatorSignatureValue: OCTET_STRING
    ) {}

    /**
     * @summary Restructures an object into a Receipt
     * @description
     *
     * This takes an `object` and converts it to a `Receipt`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `Receipt`.
     * @returns {Receipt}
     */
    public static _from_object(_o: {
        [_K in keyof Receipt]: Receipt[_K];
    }): Receipt {
        return new Receipt(
            _o.version,
            _o.contentType,
            _o.signedContentIdentifier,
            _o.originatorSignatureValue
        );
    }
}
/* END_OF_SYMBOL_DEFINITION Receipt */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_Receipt */
/**
 * @summary The Leading Root Component Types of Receipt
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_Receipt: $.ComponentSpec[] = [
    new $.ComponentSpec(
        'version',
        false,
        $.hasTag(_TagClass.universal, 2),
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
    new $.ComponentSpec(
        'signedContentIdentifier',
        false,
        $.hasTag(_TagClass.universal, 4),
        undefined,
        undefined
    ),
    new $.ComponentSpec(
        'originatorSignatureValue',
        false,
        $.hasTag(_TagClass.universal, 4),
        undefined,
        undefined
    ),
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_Receipt */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_Receipt */
/**
 * @summary The Trailing Root Component Types of Receipt
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_Receipt: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_Receipt */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_Receipt */
/**
 * @summary The Extension Addition Component Types of Receipt
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_Receipt: $.ComponentSpec[] = [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_Receipt */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Receipt */
let _cached_decoder_for_Receipt: $.ASN1Decoder<Receipt> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Receipt */

/* START_OF_SYMBOL_DEFINITION _decode_Receipt */
/**
 * @summary Decodes an ASN.1 element into a(n) Receipt
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Receipt} The decoded data structure.
 */
export function _decode_Receipt(el: _Element) {
    if (!_cached_decoder_for_Receipt) {
        _cached_decoder_for_Receipt = function (el: _Element): Receipt {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 4) {
                throw new _ConstructionError(
                    'Receipt contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'version';
            sequence[1].name = 'contentType';
            sequence[2].name = 'signedContentIdentifier';
            sequence[3].name = 'originatorSignatureValue';
            let version!: ESSVersion;
            let contentType!: ContentType;
            let signedContentIdentifier!: ContentIdentifier;
            let originatorSignatureValue!: OCTET_STRING;
            version = _decode_ESSVersion(sequence[0]);
            contentType = _decode_ContentType(sequence[1]);
            signedContentIdentifier = _decode_ContentIdentifier(sequence[2]);
            originatorSignatureValue = $._decodeOctetString(sequence[3]);
            return new Receipt(
                version,
                contentType,
                signedContentIdentifier,
                originatorSignatureValue
            );
        };
    }
    return _cached_decoder_for_Receipt(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Receipt */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Receipt */
let _cached_encoder_for_Receipt: $.ASN1Encoder<Receipt> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Receipt */

/* START_OF_SYMBOL_DEFINITION _encode_Receipt */
/**
 * @summary Encodes a(n) Receipt into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Receipt, encoded as an ASN.1 Element.
 */
export function _encode_Receipt(
    value: Receipt,
    elGetter: $.ASN1Encoder<Receipt>
) {
    if (!_cached_encoder_for_Receipt) {
        _cached_encoder_for_Receipt = function (
            value: Receipt,
            elGetter: $.ASN1Encoder<Receipt>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ _encode_ESSVersion(
                            value.version,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_ContentType(
                            value.contentType,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_ContentIdentifier(
                            value.signedContentIdentifier,
                            $.BER
                        ),
                        /* REQUIRED   */ $._encodeOctetString(
                            value.originatorSignatureValue,
                            $.BER
                        ),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_Receipt(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Receipt */

/* eslint-enable */
