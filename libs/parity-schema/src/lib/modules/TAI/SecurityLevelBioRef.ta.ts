/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricPara,
    _decode_BiometricPara,
    _encode_BiometricPara,
} from '../TAI/BiometricPara.ta';
import {
    BiometricSecurityLevelId,
    _decode_BiometricSecurityLevelId,
    _encode_BiometricSecurityLevelId,
} from '../TAI/BiometricSecurityLevelId.ta';
import {
    ModalityPolicy,
    _decode_ModalityPolicy,
    _encode_ModalityPolicy,
} from '../TAI/ModalityPolicy.ta';

/* START_OF_SYMBOL_DEFINITION SecurityLevelBioRef */
/**
 * @summary SecurityLevelBioRef
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SecurityLevelBioRef ::= SEQUENCE {
 *   biometricSecurityLevelId  BiometricSecurityLevelId,
 *   modalityPolicy            ModalityPolicy,
 *   biometricPara             BiometricPara
 * }
 * ```
 *
 * @class
 */
export class SecurityLevelBioRef {
    constructor(
        /**
         * @summary `biometricSecurityLevelId`.
         * @public
         * @readonly
         */
        readonly biometricSecurityLevelId: BiometricSecurityLevelId,
        /**
         * @summary `modalityPolicy`.
         * @public
         * @readonly
         */
        readonly modalityPolicy: ModalityPolicy,
        /**
         * @summary `biometricPara`.
         * @public
         * @readonly
         */
        readonly biometricPara: BiometricPara
    ) {}

    /**
     * @summary Restructures an object into a SecurityLevelBioRef
     * @description
     *
     * This takes an `object` and converts it to a `SecurityLevelBioRef`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `SecurityLevelBioRef`.
     * @returns {SecurityLevelBioRef}
     */
    public static _from_object(_o: {
        [_K in keyof SecurityLevelBioRef]: SecurityLevelBioRef[_K];
    }): SecurityLevelBioRef {
        return new SecurityLevelBioRef(
            _o.biometricSecurityLevelId,
            _o.modalityPolicy,
            _o.biometricPara
        );
    }
}
/* END_OF_SYMBOL_DEFINITION SecurityLevelBioRef */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SecurityLevelBioRef */
/**
 * @summary The Leading Root Component Types of SecurityLevelBioRef
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_SecurityLevelBioRef: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'biometricSecurityLevelId',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'modalityPolicy',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'biometricPara',
            false,
            $.hasTag(_TagClass.context, 2),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SecurityLevelBioRef */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SecurityLevelBioRef */
/**
 * @summary The Trailing Root Component Types of SecurityLevelBioRef
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_SecurityLevelBioRef: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SecurityLevelBioRef */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SecurityLevelBioRef */
/**
 * @summary The Extension Addition Component Types of SecurityLevelBioRef
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_SecurityLevelBioRef: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SecurityLevelBioRef */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelBioRef */
let _cached_decoder_for_SecurityLevelBioRef: $.ASN1Decoder<SecurityLevelBioRef> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelBioRef */

/* START_OF_SYMBOL_DEFINITION _decode_SecurityLevelBioRef */
/**
 * @summary Decodes an ASN.1 element into a(n) SecurityLevelBioRef
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SecurityLevelBioRef} The decoded data structure.
 */
export function _decode_SecurityLevelBioRef(el: _Element) {
    if (!_cached_decoder_for_SecurityLevelBioRef) {
        _cached_decoder_for_SecurityLevelBioRef = function (
            el: _Element
        ): SecurityLevelBioRef {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 3) {
                throw new _ConstructionError(
                    'SecurityLevelBioRef contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'biometricSecurityLevelId';
            sequence[1].name = 'modalityPolicy';
            sequence[2].name = 'biometricPara';
            let biometricSecurityLevelId!: BiometricSecurityLevelId;
            let modalityPolicy!: ModalityPolicy;
            let biometricPara!: BiometricPara;
            biometricSecurityLevelId = _decode_BiometricSecurityLevelId(
                sequence[0]
            );
            modalityPolicy = _decode_ModalityPolicy(sequence[1]);
            biometricPara = _decode_BiometricPara(sequence[2]);
            return new SecurityLevelBioRef(
                biometricSecurityLevelId,
                modalityPolicy,
                biometricPara
            );
        };
    }
    return _cached_decoder_for_SecurityLevelBioRef(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SecurityLevelBioRef */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelBioRef */
let _cached_encoder_for_SecurityLevelBioRef: $.ASN1Encoder<SecurityLevelBioRef> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelBioRef */

/* START_OF_SYMBOL_DEFINITION _encode_SecurityLevelBioRef */
/**
 * @summary Encodes a(n) SecurityLevelBioRef into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SecurityLevelBioRef, encoded as an ASN.1 Element.
 */
export function _encode_SecurityLevelBioRef(
    value: SecurityLevelBioRef,
    elGetter: $.ASN1Encoder<SecurityLevelBioRef>
) {
    if (!_cached_encoder_for_SecurityLevelBioRef) {
        _cached_encoder_for_SecurityLevelBioRef = function (
            value: SecurityLevelBioRef,
            elGetter: $.ASN1Encoder<SecurityLevelBioRef>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ _encode_BiometricSecurityLevelId(
                            value.biometricSecurityLevelId,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_ModalityPolicy(
                            value.modalityPolicy,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_BiometricPara(
                            value.biometricPara,
                            $.BER
                        ),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_SecurityLevelBioRef(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SecurityLevelBioRef */

/* eslint-enable */
