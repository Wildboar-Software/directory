/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    SecurityLevelBioRef,
    _decode_SecurityLevelBioRef,
    _encode_SecurityLevelBioRef,
} from '../TAI/SecurityLevelBioRef.ta';
export {
    SecurityLevelBioRef,
    _decode_SecurityLevelBioRef,
    _encode_SecurityLevelBioRef,
} from '../TAI/SecurityLevelBioRef.ta';

/* START_OF_SYMBOL_DEFINITION SecurityLevelBioReference */
/**
 * @summary SecurityLevelBioReference
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SecurityLevelBioReference ::= SEQUENCE {
 *   securityLevelNum     INTEGER,
 *   securityLevelBioRef  SecurityLevelBioRef
 * }
 * ```
 *
 * @class
 */
export class SecurityLevelBioReference {
    constructor(
        /**
         * @summary `securityLevelNum`.
         * @public
         * @readonly
         */
        readonly securityLevelNum: INTEGER,
        /**
         * @summary `securityLevelBioRef`.
         * @public
         * @readonly
         */
        readonly securityLevelBioRef: SecurityLevelBioRef
    ) {}

    /**
     * @summary Restructures an object into a SecurityLevelBioReference
     * @description
     *
     * This takes an `object` and converts it to a `SecurityLevelBioReference`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `SecurityLevelBioReference`.
     * @returns {SecurityLevelBioReference}
     */
    public static _from_object(_o: {
        [_K in keyof SecurityLevelBioReference]: SecurityLevelBioReference[_K];
    }): SecurityLevelBioReference {
        return new SecurityLevelBioReference(
            _o.securityLevelNum,
            _o.securityLevelBioRef
        );
    }
}
/* END_OF_SYMBOL_DEFINITION SecurityLevelBioReference */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SecurityLevelBioReference */
/**
 * @summary The Leading Root Component Types of SecurityLevelBioReference
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_SecurityLevelBioReference: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'securityLevelNum',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'securityLevelBioRef',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SecurityLevelBioReference */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SecurityLevelBioReference */
/**
 * @summary The Trailing Root Component Types of SecurityLevelBioReference
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_SecurityLevelBioReference: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SecurityLevelBioReference */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SecurityLevelBioReference */
/**
 * @summary The Extension Addition Component Types of SecurityLevelBioReference
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_SecurityLevelBioReference: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SecurityLevelBioReference */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelBioReference */
let _cached_decoder_for_SecurityLevelBioReference: $.ASN1Decoder<SecurityLevelBioReference> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SecurityLevelBioReference */

/* START_OF_SYMBOL_DEFINITION _decode_SecurityLevelBioReference */
/**
 * @summary Decodes an ASN.1 element into a(n) SecurityLevelBioReference
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SecurityLevelBioReference} The decoded data structure.
 */
export function _decode_SecurityLevelBioReference(el: _Element) {
    if (!_cached_decoder_for_SecurityLevelBioReference) {
        _cached_decoder_for_SecurityLevelBioReference = function (
            el: _Element
        ): SecurityLevelBioReference {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'SecurityLevelBioReference contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'securityLevelNum';
            sequence[1].name = 'securityLevelBioRef';
            let securityLevelNum!: INTEGER;
            let securityLevelBioRef!: SecurityLevelBioRef;
            securityLevelNum = $._decodeInteger(sequence[0]);
            securityLevelBioRef = _decode_SecurityLevelBioRef(sequence[1]);
            return new SecurityLevelBioReference(
                securityLevelNum,
                securityLevelBioRef
            );
        };
    }
    return _cached_decoder_for_SecurityLevelBioReference(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SecurityLevelBioReference */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelBioReference */
let _cached_encoder_for_SecurityLevelBioReference: $.ASN1Encoder<SecurityLevelBioReference> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SecurityLevelBioReference */

/* START_OF_SYMBOL_DEFINITION _encode_SecurityLevelBioReference */
/**
 * @summary Encodes a(n) SecurityLevelBioReference into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SecurityLevelBioReference, encoded as an ASN.1 Element.
 */
export function _encode_SecurityLevelBioReference(
    value: SecurityLevelBioReference,
    elGetter: $.ASN1Encoder<SecurityLevelBioReference>
) {
    if (!_cached_encoder_for_SecurityLevelBioReference) {
        _cached_encoder_for_SecurityLevelBioReference = function (
            value: SecurityLevelBioReference,
            elGetter: $.ASN1Encoder<SecurityLevelBioReference>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ $._encodeInteger(
                            value.securityLevelNum,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_SecurityLevelBioRef(
                            value.securityLevelBioRef,
                            $.BER
                        ),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_SecurityLevelBioReference(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SecurityLevelBioReference */

/* eslint-enable */
