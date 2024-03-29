/* eslint-disable */
import {
    CertificateSerialNumber,
    _decode_CertificateSerialNumber,
    _encode_CertificateSerialNumber,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificateSerialNumber.ta';
import {
    GeneralNames,
    _decode_GeneralNames,
    _encode_GeneralNames,
} from '@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta';
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
export {
    CertificateSerialNumber,
    _decode_CertificateSerialNumber,
    _encode_CertificateSerialNumber,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificateSerialNumber.ta';
export {
    GeneralNames,
    _decode_GeneralNames,
    _encode_GeneralNames,
} from '@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta';

/* START_OF_SYMBOL_DEFINITION IssuerSerial */
/**
 * @summary IssuerSerial
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * IssuerSerial ::= SEQUENCE {
 *     issuer                   GeneralNames,
 *     serialNumber             CertificateSerialNumber
 * }
 * ```
 *
 * @class
 */
export class IssuerSerial {
    constructor(
        /**
         * @summary `issuer`.
         * @public
         * @readonly
         */
        readonly issuer: GeneralNames,
        /**
         * @summary `serialNumber`.
         * @public
         * @readonly
         */
        readonly serialNumber: CertificateSerialNumber,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a IssuerSerial
     * @description
     *
     * This takes an `object` and converts it to a `IssuerSerial`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `IssuerSerial`.
     * @returns {IssuerSerial}
     */
    public static _from_object(_o: {
        [_K in keyof IssuerSerial]: IssuerSerial[_K];
    }): IssuerSerial {
        return new IssuerSerial(
            _o.issuer,
            _o.serialNumber,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION IssuerSerial */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_IssuerSerial */
/**
 * @summary The Leading Root Component Types of IssuerSerial
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_IssuerSerial: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'issuer',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'serialNumber',
            false,
            $.hasTag(_TagClass.universal, 2),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_IssuerSerial */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_IssuerSerial */
/**
 * @summary The Trailing Root Component Types of IssuerSerial
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_IssuerSerial: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_IssuerSerial */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_IssuerSerial */
/**
 * @summary The Extension Addition Component Types of IssuerSerial
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_IssuerSerial: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_IssuerSerial */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_IssuerSerial */
let _cached_decoder_for_IssuerSerial: $.ASN1Decoder<IssuerSerial> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_IssuerSerial */

/* START_OF_SYMBOL_DEFINITION _decode_IssuerSerial */
/**
 * @summary Decodes an ASN.1 element into a(n) IssuerSerial
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {IssuerSerial} The decoded data structure.
 */
export function _decode_IssuerSerial(el: _Element) {
    if (!_cached_decoder_for_IssuerSerial) {
        _cached_decoder_for_IssuerSerial = function (
            el: _Element
        ): IssuerSerial {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'IssuerSerial contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'issuer';
            sequence[1].name = 'serialNumber';
            let issuer!: GeneralNames;
            let serialNumber!: CertificateSerialNumber;
            issuer = _decode_GeneralNames(sequence[0]);
            serialNumber = _decode_CertificateSerialNumber(sequence[1]);
            return new IssuerSerial(issuer, serialNumber, sequence.slice(2));
        };
    }
    return _cached_decoder_for_IssuerSerial(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_IssuerSerial */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_IssuerSerial */
let _cached_encoder_for_IssuerSerial: $.ASN1Encoder<IssuerSerial> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_IssuerSerial */

/* START_OF_SYMBOL_DEFINITION _encode_IssuerSerial */
/**
 * @summary Encodes a(n) IssuerSerial into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The IssuerSerial, encoded as an ASN.1 Element.
 */
export function _encode_IssuerSerial(
    value: IssuerSerial,
    elGetter: $.ASN1Encoder<IssuerSerial>
) {
    if (!_cached_encoder_for_IssuerSerial) {
        _cached_encoder_for_IssuerSerial = function (
            value: IssuerSerial,
            elGetter: $.ASN1Encoder<IssuerSerial>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_GeneralNames(
                                value.issuer,
                                $.BER
                            ),
                            /* REQUIRED   */ _encode_CertificateSerialNumber(
                                value.serialNumber,
                                $.BER
                            ),
                        ],
                        value._unrecognizedExtensionsList
                            ? value._unrecognizedExtensionsList
                            : []
                    )
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_IssuerSerial(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_IssuerSerial */

/* eslint-enable */
