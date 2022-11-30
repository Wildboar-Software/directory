/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OPTIONAL,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    EncKeyWithID_identifier,
    _decode_EncKeyWithID_identifier,
    _encode_EncKeyWithID_identifier,
} from '../PKIXCRMF-2009/EncKeyWithID-identifier.ta';
import {
    PrivateKeyInfo,
    _decode_PrivateKeyInfo,
    _encode_PrivateKeyInfo,
} from '../PKIXCRMF-2009/PrivateKeyInfo.ta';
export {
    EncKeyWithID_identifier,
    _decode_EncKeyWithID_identifier,
    _encode_EncKeyWithID_identifier,
} from '../PKIXCRMF-2009/EncKeyWithID-identifier.ta';
export {
    PrivateKeyInfo,
    _decode_PrivateKeyInfo,
    _encode_PrivateKeyInfo,
} from '../PKIXCRMF-2009/PrivateKeyInfo.ta';

/* START_OF_SYMBOL_DEFINITION EncKeyWithID */
/**
 * @summary EncKeyWithID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * EncKeyWithID ::= SEQUENCE {
 *     privateKey           PrivateKeyInfo,
 *     identifier CHOICE {
 *         string             UTF8String,
 *         generalName        GeneralName
 *     } OPTIONAL
 * }
 * ```
 *
 * @class
 */
export class EncKeyWithID {
    constructor(
        /**
         * @summary `privateKey`.
         * @public
         * @readonly
         */
        readonly privateKey: PrivateKeyInfo,
        /**
         * @summary `identifier`.
         * @public
         * @readonly
         */
        readonly identifier: OPTIONAL<EncKeyWithID_identifier>
    ) {}

    /**
     * @summary Restructures an object into a EncKeyWithID
     * @description
     *
     * This takes an `object` and converts it to a `EncKeyWithID`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `EncKeyWithID`.
     * @returns {EncKeyWithID}
     */
    public static _from_object(_o: {
        [_K in keyof EncKeyWithID]: EncKeyWithID[_K];
    }): EncKeyWithID {
        return new EncKeyWithID(_o.privateKey, _o.identifier);
    }
}
/* END_OF_SYMBOL_DEFINITION EncKeyWithID */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_EncKeyWithID */
/**
 * @summary The Leading Root Component Types of EncKeyWithID
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_EncKeyWithID: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'privateKey',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'identifier',
            true,
            $.or($.hasTag(_TagClass.universal, 12), $.hasAnyTag),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_EncKeyWithID */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_EncKeyWithID */
/**
 * @summary The Trailing Root Component Types of EncKeyWithID
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_EncKeyWithID: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_EncKeyWithID */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_EncKeyWithID */
/**
 * @summary The Extension Addition Component Types of EncKeyWithID
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_EncKeyWithID: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_EncKeyWithID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_EncKeyWithID */
let _cached_decoder_for_EncKeyWithID: $.ASN1Decoder<EncKeyWithID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_EncKeyWithID */

/* START_OF_SYMBOL_DEFINITION _decode_EncKeyWithID */
/**
 * @summary Decodes an ASN.1 element into a(n) EncKeyWithID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {EncKeyWithID} The decoded data structure.
 */
export function _decode_EncKeyWithID(el: _Element) {
    if (!_cached_decoder_for_EncKeyWithID) {
        _cached_decoder_for_EncKeyWithID = function (
            el: _Element
        ): EncKeyWithID {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let privateKey!: PrivateKeyInfo;
            let identifier: OPTIONAL<EncKeyWithID_identifier>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                privateKey: (_el: _Element): void => {
                    privateKey = _decode_PrivateKeyInfo(_el);
                },
                identifier: (_el: _Element): void => {
                    identifier = _decode_EncKeyWithID_identifier(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_EncKeyWithID,
                _extension_additions_list_spec_for_EncKeyWithID,
                _root_component_type_list_2_spec_for_EncKeyWithID,
                undefined
            );
            return new EncKeyWithID /* SEQUENCE_CONSTRUCTOR_CALL */(
                privateKey,
                identifier
            );
        };
    }
    return _cached_decoder_for_EncKeyWithID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_EncKeyWithID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_EncKeyWithID */
let _cached_encoder_for_EncKeyWithID: $.ASN1Encoder<EncKeyWithID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_EncKeyWithID */

/* START_OF_SYMBOL_DEFINITION _encode_EncKeyWithID */
/**
 * @summary Encodes a(n) EncKeyWithID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The EncKeyWithID, encoded as an ASN.1 Element.
 */
export function _encode_EncKeyWithID(
    value: EncKeyWithID,
    elGetter: $.ASN1Encoder<EncKeyWithID>
) {
    if (!_cached_encoder_for_EncKeyWithID) {
        _cached_encoder_for_EncKeyWithID = function (
            value: EncKeyWithID,
            elGetter: $.ASN1Encoder<EncKeyWithID>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ _encode_PrivateKeyInfo(
                            value.privateKey,
                            $.BER
                        ),
                        /* IF_ABSENT  */ value.identifier === undefined
                            ? undefined
                            : _encode_EncKeyWithID_identifier(
                                  value.identifier,
                                  $.BER
                              ),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_EncKeyWithID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_EncKeyWithID */

/* eslint-enable */
