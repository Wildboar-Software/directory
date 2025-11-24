/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    Hash,
    _decode_Hash,
    _encode_Hash,
} from '../ExtendedSecurityServices-2009/Hash.ta';
import {
    IssuerSerial,
    _decode_IssuerSerial,
    _encode_IssuerSerial,
} from '../ExtendedSecurityServices-2009/IssuerSerial.ta';

/* START_OF_SYMBOL_DEFINITION ESSCertID */
/**
 * @summary ESSCertID
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ESSCertID ::= SEQUENCE {
 *     certHash        Hash,
 *     issuerSerial    IssuerSerial OPTIONAL
 * }
 * ```
 *
 * @class
 */
export class ESSCertID {
    constructor(
        /**
         * @summary `certHash`.
         * @public
         * @readonly
         */
        readonly certHash: Hash,
        /**
         * @summary `issuerSerial`.
         * @public
         * @readonly
         */
        readonly issuerSerial: OPTIONAL<IssuerSerial>
    ) {}

    /**
     * @summary Restructures an object into a ESSCertID
     * @description
     *
     * This takes an `object` and converts it to a `ESSCertID`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ESSCertID`.
     * @returns {ESSCertID}
     */
    public static _from_object(_o: {
        [_K in keyof ESSCertID]: ESSCertID[_K];
    }): ESSCertID {
        return new ESSCertID(_o.certHash, _o.issuerSerial);
    }
}
/* END_OF_SYMBOL_DEFINITION ESSCertID */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ESSCertID */
/**
 * @summary The Leading Root Component Types of ESSCertID
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_ESSCertID: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'certHash',
            false,
            $.hasTag(_TagClass.universal, 4),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'issuerSerial',
            true,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ESSCertID */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ESSCertID */
/**
 * @summary The Trailing Root Component Types of ESSCertID
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_ESSCertID: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ESSCertID */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ESSCertID */
/**
 * @summary The Extension Addition Component Types of ESSCertID
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_ESSCertID: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ESSCertID */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSCertID */
let _cached_decoder_for_ESSCertID: $.ASN1Decoder<ESSCertID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSCertID */

/* START_OF_SYMBOL_DEFINITION _decode_ESSCertID */
/**
 * @summary Decodes an ASN.1 element into a(n) ESSCertID
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ESSCertID} The decoded data structure.
 */
export function _decode_ESSCertID(el: _Element) {
    if (!_cached_decoder_for_ESSCertID) {
        _cached_decoder_for_ESSCertID = function (el: _Element): ESSCertID {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let certHash!: Hash;
            let issuerSerial: OPTIONAL<IssuerSerial>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                certHash: (_el: _Element): void => {
                    certHash = _decode_Hash(_el);
                },
                issuerSerial: (_el: _Element): void => {
                    issuerSerial = _decode_IssuerSerial(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_ESSCertID,
                _extension_additions_list_spec_for_ESSCertID,
                _root_component_type_list_2_spec_for_ESSCertID,
                undefined
            );
            return new ESSCertID /* SEQUENCE_CONSTRUCTOR_CALL */(
                certHash,
                issuerSerial
            );
        };
    }
    return _cached_decoder_for_ESSCertID(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ESSCertID */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSCertID */
let _cached_encoder_for_ESSCertID: $.ASN1Encoder<ESSCertID> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSCertID */

/* START_OF_SYMBOL_DEFINITION _encode_ESSCertID */
/**
 * @summary Encodes a(n) ESSCertID into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ESSCertID, encoded as an ASN.1 Element.
 */
export function _encode_ESSCertID(
    value: ESSCertID,
    elGetter: $.ASN1Encoder<ESSCertID>
) {
    if (!_cached_encoder_for_ESSCertID) {
        _cached_encoder_for_ESSCertID = function (
            value: ESSCertID,
            elGetter: $.ASN1Encoder<ESSCertID>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ _encode_Hash(value.certHash, $.BER),
                        /* IF_ABSENT  */ value.issuerSerial === undefined
                            ? undefined
                            : _encode_IssuerSerial(value.issuerSerial, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_ESSCertID(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ESSCertID */

/* eslint-enable */
