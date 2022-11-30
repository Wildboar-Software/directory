/* eslint-disable */
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta';
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OCTET_STRING,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION SignAttrsHash */
/**
 * @summary SignAttrsHash
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SignAttrsHash ::= SEQUENCE {
 *     algID               AlgorithmIdentifier{{SupportedAlgorithms}},
 *     hash                OCTET STRING }
 * ```
 *
 * @class
 */
export class SignAttrsHash {
    constructor(
        /**
         * @summary `algID`.
         * @public
         * @readonly
         */
        readonly algID: AlgorithmIdentifier,
        /**
         * @summary `hash`.
         * @public
         * @readonly
         */
        readonly hash: OCTET_STRING,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a SignAttrsHash
     * @description
     *
     * This takes an `object` and converts it to a `SignAttrsHash`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `SignAttrsHash`.
     * @returns {SignAttrsHash}
     */
    public static _from_object(_o: {
        [_K in keyof SignAttrsHash]: SignAttrsHash[_K];
    }): SignAttrsHash {
        return new SignAttrsHash(
            _o.algID,
            _o.hash,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION SignAttrsHash */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SignAttrsHash */
/**
 * @summary The Leading Root Component Types of SignAttrsHash
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_SignAttrsHash: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'algID',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'hash',
            false,
            $.hasTag(_TagClass.universal, 4),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SignAttrsHash */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SignAttrsHash */
/**
 * @summary The Trailing Root Component Types of SignAttrsHash
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_SignAttrsHash: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SignAttrsHash */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SignAttrsHash */
/**
 * @summary The Extension Addition Component Types of SignAttrsHash
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_SignAttrsHash: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SignAttrsHash */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SignAttrsHash */
let _cached_decoder_for_SignAttrsHash: $.ASN1Decoder<SignAttrsHash> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SignAttrsHash */

/* START_OF_SYMBOL_DEFINITION _decode_SignAttrsHash */
/**
 * @summary Decodes an ASN.1 element into a(n) SignAttrsHash
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SignAttrsHash} The decoded data structure.
 */
export function _decode_SignAttrsHash(el: _Element) {
    if (!_cached_decoder_for_SignAttrsHash) {
        _cached_decoder_for_SignAttrsHash = function (
            el: _Element
        ): SignAttrsHash {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'SignAttrsHash contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'algID';
            sequence[1].name = 'hash';
            let algID!: AlgorithmIdentifier;
            let hash!: OCTET_STRING;
            algID = _decode_AlgorithmIdentifier(sequence[0]);
            hash = $._decodeOctetString(sequence[1]);
            return new SignAttrsHash(algID, hash, sequence.slice(2));
        };
    }
    return _cached_decoder_for_SignAttrsHash(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SignAttrsHash */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SignAttrsHash */
let _cached_encoder_for_SignAttrsHash: $.ASN1Encoder<SignAttrsHash> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SignAttrsHash */

/* START_OF_SYMBOL_DEFINITION _encode_SignAttrsHash */
/**
 * @summary Encodes a(n) SignAttrsHash into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SignAttrsHash, encoded as an ASN.1 Element.
 */
export function _encode_SignAttrsHash(
    value: SignAttrsHash,
    elGetter: $.ASN1Encoder<SignAttrsHash>
) {
    if (!_cached_encoder_for_SignAttrsHash) {
        _cached_encoder_for_SignAttrsHash = function (
            value: SignAttrsHash,
            elGetter: $.ASN1Encoder<SignAttrsHash>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_AlgorithmIdentifier(
                                value.algID,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeOctetString(
                                value.hash,
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
    return _cached_encoder_for_SignAttrsHash(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SignAttrsHash */

/* eslint-enable */
