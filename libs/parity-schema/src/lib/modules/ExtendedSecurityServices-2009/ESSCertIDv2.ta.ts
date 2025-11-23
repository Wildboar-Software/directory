/* eslint-disable */
import { id_sha256 } from '@wildboar/x500/AlgorithmObjectIdentifiers';
import { AlgorithmIdentifier } from '@wildboar/x500/AuthenticationFramework';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    Hash,
    _decode_Hash,
    _encode_Hash,
} from '../ExtendedSecurityServices-2009/Hash.ta';
import {
    HashAlgorithm,
    _decode_HashAlgorithm,
    _encode_HashAlgorithm,
} from '../ExtendedSecurityServices-2009/HashAlgorithm.ta';
import {
    IssuerSerial,
    _decode_IssuerSerial,
    _encode_IssuerSerial,
} from '../ExtendedSecurityServices-2009/IssuerSerial.ta';

/* START_OF_SYMBOL_DEFINITION ESSCertIDv2 */
/**
 * @summary ESSCertIDv2
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * ESSCertIDv2 ::= SEQUENCE {
 *     hashAlgorithm    HashAlgorithm
 *                         DEFAULT { algorithm id-sha256 },
 *     certHash        Hash,
 *     issuerSerial    IssuerSerial OPTIONAL
 * }
 * ```
 *
 * @class
 */
export class ESSCertIDv2 {
    constructor(
        /**
         * @summary `hashAlgorithm`.
         * @public
         * @readonly
         */
        readonly hashAlgorithm: OPTIONAL<HashAlgorithm>,
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
     * @summary Restructures an object into a ESSCertIDv2
     * @description
     *
     * This takes an `object` and converts it to a `ESSCertIDv2`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ESSCertIDv2`.
     * @returns {ESSCertIDv2}
     */
    public static _from_object(_o: {
        [_K in keyof ESSCertIDv2]: ESSCertIDv2[_K];
    }): ESSCertIDv2 {
        return new ESSCertIDv2(_o.hashAlgorithm, _o.certHash, _o.issuerSerial);
    }

    /**
     * @summary Getter that returns the default value for `hashAlgorithm`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_hashAlgorithm() {
        return AlgorithmIdentifier._from_object({
            algorithm: id_sha256,
            _unrecognizedExtensionsList: [],
        });
    }
}
/* END_OF_SYMBOL_DEFINITION ESSCertIDv2 */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ESSCertIDv2 */
/**
 * @summary The Leading Root Component Types of ESSCertIDv2
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_ESSCertIDv2: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'hashAlgorithm',
            true,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
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
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ESSCertIDv2 */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ESSCertIDv2 */
/**
 * @summary The Trailing Root Component Types of ESSCertIDv2
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_ESSCertIDv2: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ESSCertIDv2 */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ESSCertIDv2 */
/**
 * @summary The Extension Addition Component Types of ESSCertIDv2
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_ESSCertIDv2: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ESSCertIDv2 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSCertIDv2 */
let _cached_decoder_for_ESSCertIDv2: $.ASN1Decoder<ESSCertIDv2> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSCertIDv2 */

/* START_OF_SYMBOL_DEFINITION _decode_ESSCertIDv2 */
/**
 * @summary Decodes an ASN.1 element into a(n) ESSCertIDv2
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ESSCertIDv2} The decoded data structure.
 */
export function _decode_ESSCertIDv2(el: _Element) {
    if (!_cached_decoder_for_ESSCertIDv2) {
        _cached_decoder_for_ESSCertIDv2 = function (el: _Element): ESSCertIDv2 {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let hashAlgorithm: OPTIONAL<HashAlgorithm> =
                ESSCertIDv2._default_value_for_hashAlgorithm;
            let certHash!: Hash;
            let issuerSerial: OPTIONAL<IssuerSerial>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                hashAlgorithm: (_el: _Element): void => {
                    hashAlgorithm = _decode_HashAlgorithm(_el);
                },
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
                _root_component_type_list_1_spec_for_ESSCertIDv2,
                _extension_additions_list_spec_for_ESSCertIDv2,
                _root_component_type_list_2_spec_for_ESSCertIDv2,
                undefined
            );
            return new ESSCertIDv2 /* SEQUENCE_CONSTRUCTOR_CALL */(
                hashAlgorithm,
                certHash,
                issuerSerial
            );
        };
    }
    return _cached_decoder_for_ESSCertIDv2(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ESSCertIDv2 */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSCertIDv2 */
let _cached_encoder_for_ESSCertIDv2: $.ASN1Encoder<ESSCertIDv2> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSCertIDv2 */

/* START_OF_SYMBOL_DEFINITION _encode_ESSCertIDv2 */
/**
 * @summary Encodes a(n) ESSCertIDv2 into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ESSCertIDv2, encoded as an ASN.1 Element.
 */
export function _encode_ESSCertIDv2(
    value: ESSCertIDv2,
    elGetter: $.ASN1Encoder<ESSCertIDv2>
) {
    if (!_cached_encoder_for_ESSCertIDv2) {
        _cached_encoder_for_ESSCertIDv2 = function (
            value: ESSCertIDv2,
            elGetter: $.ASN1Encoder<ESSCertIDv2>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* IF_DEFAULT */ value.hashAlgorithm === undefined ||
                        $.deepEq(
                            value.hashAlgorithm,
                            ESSCertIDv2._default_value_for_hashAlgorithm
                        )
                            ? undefined
                            : _encode_HashAlgorithm(value.hashAlgorithm, $.BER),
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
    return _cached_encoder_for_ESSCertIDv2(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ESSCertIDv2 */

/* eslint-enable */
