/* eslint-disable */
import {
    SubjectPublicKeyInfo,
    _decode_SubjectPublicKeyInfo,
    _encode_SubjectPublicKeyInfo,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/SubjectPublicKeyInfo.ta';
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    POPOSigningKeyInput_authInfo,
    _decode_POPOSigningKeyInput_authInfo,
    _encode_POPOSigningKeyInput_authInfo,
} from '../PKIXCRMF-2009/POPOSigningKeyInput-authInfo.ta';
export {
    SubjectPublicKeyInfo,
    _decode_SubjectPublicKeyInfo,
    _encode_SubjectPublicKeyInfo,
} from '@wildboar/x500/src/lib/modules/AuthenticationFramework/SubjectPublicKeyInfo.ta';
export {
    POPOSigningKeyInput_authInfo,
    _decode_POPOSigningKeyInput_authInfo,
    _encode_POPOSigningKeyInput_authInfo,
} from '../PKIXCRMF-2009/POPOSigningKeyInput-authInfo.ta';

/* START_OF_SYMBOL_DEFINITION POPOSigningKeyInput */
/**
 * @summary POPOSigningKeyInput
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * POPOSigningKeyInput ::= SEQUENCE {
 *     authInfo            CHOICE {
 *     sender              [0] GeneralName,
 *     -- used only if an authenticated identity has been
 *     -- established for the sender (e.g., a DN from a
 *     -- previously-issued and currently-valid certificate)
 *     publicKeyMAC        PKMACValue },
 *     -- used if no authenticated GeneralName currently exists for
 *     -- the sender; publicKeyMAC contains a password-based MAC
 *     -- on the DER-encoded value of publicKey
 *     publicKey           SubjectPublicKeyInfo }
 * ```
 *
 * @class
 */
export class POPOSigningKeyInput {
    constructor(
        /**
         * @summary `authInfo`.
         * @public
         * @readonly
         */
        readonly authInfo: POPOSigningKeyInput_authInfo,
        /**
         * @summary `publicKey`.
         * @public
         * @readonly
         */
        readonly publicKey: SubjectPublicKeyInfo
    ) {}

    /**
     * @summary Restructures an object into a POPOSigningKeyInput
     * @description
     *
     * This takes an `object` and converts it to a `POPOSigningKeyInput`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `POPOSigningKeyInput`.
     * @returns {POPOSigningKeyInput}
     */
    public static _from_object(_o: {
        [_K in keyof POPOSigningKeyInput]: POPOSigningKeyInput[_K];
    }): POPOSigningKeyInput {
        return new POPOSigningKeyInput(_o.authInfo, _o.publicKey);
    }
}
/* END_OF_SYMBOL_DEFINITION POPOSigningKeyInput */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_POPOSigningKeyInput */
/**
 * @summary The Leading Root Component Types of POPOSigningKeyInput
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_POPOSigningKeyInput: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'authInfo',
            false,
            $.hasAnyTag,
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'publicKey',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_POPOSigningKeyInput */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_POPOSigningKeyInput */
/**
 * @summary The Trailing Root Component Types of POPOSigningKeyInput
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_POPOSigningKeyInput: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_POPOSigningKeyInput */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_POPOSigningKeyInput */
/**
 * @summary The Extension Addition Component Types of POPOSigningKeyInput
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_POPOSigningKeyInput: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_POPOSigningKeyInput */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_POPOSigningKeyInput */
let _cached_decoder_for_POPOSigningKeyInput: $.ASN1Decoder<POPOSigningKeyInput> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_POPOSigningKeyInput */

/* START_OF_SYMBOL_DEFINITION _decode_POPOSigningKeyInput */
/**
 * @summary Decodes an ASN.1 element into a(n) POPOSigningKeyInput
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {POPOSigningKeyInput} The decoded data structure.
 */
export function _decode_POPOSigningKeyInput(el: _Element) {
    if (!_cached_decoder_for_POPOSigningKeyInput) {
        _cached_decoder_for_POPOSigningKeyInput = function (
            el: _Element
        ): POPOSigningKeyInput {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'POPOSigningKeyInput contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'authInfo';
            sequence[1].name = 'publicKey';
            let authInfo!: POPOSigningKeyInput_authInfo;
            let publicKey!: SubjectPublicKeyInfo;
            authInfo = _decode_POPOSigningKeyInput_authInfo(sequence[0]);
            publicKey = _decode_SubjectPublicKeyInfo(sequence[1]);
            return new POPOSigningKeyInput(authInfo, publicKey);
        };
    }
    return _cached_decoder_for_POPOSigningKeyInput(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_POPOSigningKeyInput */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_POPOSigningKeyInput */
let _cached_encoder_for_POPOSigningKeyInput: $.ASN1Encoder<POPOSigningKeyInput> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_POPOSigningKeyInput */

/* START_OF_SYMBOL_DEFINITION _encode_POPOSigningKeyInput */
/**
 * @summary Encodes a(n) POPOSigningKeyInput into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The POPOSigningKeyInput, encoded as an ASN.1 Element.
 */
export function _encode_POPOSigningKeyInput(
    value: POPOSigningKeyInput,
    elGetter: $.ASN1Encoder<POPOSigningKeyInput>
) {
    if (!_cached_encoder_for_POPOSigningKeyInput) {
        _cached_encoder_for_POPOSigningKeyInput = function (
            value: POPOSigningKeyInput,
            elGetter: $.ASN1Encoder<POPOSigningKeyInput>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ _encode_POPOSigningKeyInput_authInfo(
                            value.authInfo,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_SubjectPublicKeyInfo(
                            value.publicKey,
                            $.BER
                        ),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_POPOSigningKeyInput(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_POPOSigningKeyInput */

/* eslint-enable */
