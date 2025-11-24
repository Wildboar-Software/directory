/* eslint-disable */
import {
    type GeneralName,
    _decode_GeneralName,
    _encode_GeneralName,
} from '@wildboar/x500/CertificateExtensions';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OCTET_STRING,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION SvceAuthInfo */
/**
 * @summary SvceAuthInfo
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * SvceAuthInfo ::= SEQUENCE {
 *     service        GeneralName,
 *     ident        GeneralName,
 *     authInfo    OCTET STRING OPTIONAL }
 * ```
 *
 * @class
 */
export class SvceAuthInfo {
    constructor(
        /**
         * @summary `service`.
         * @public
         * @readonly
         */
        readonly service: GeneralName,
        /**
         * @summary `ident`.
         * @public
         * @readonly
         */
        readonly ident: GeneralName,
        /**
         * @summary `authInfo`.
         * @public
         * @readonly
         */
        readonly authInfo: OPTIONAL<OCTET_STRING>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a SvceAuthInfo
     * @description
     *
     * This takes an `object` and converts it to a `SvceAuthInfo`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `SvceAuthInfo`.
     * @returns {SvceAuthInfo}
     */
    public static _from_object(_o: {
        [_K in keyof SvceAuthInfo]: SvceAuthInfo[_K];
    }): SvceAuthInfo {
        return new SvceAuthInfo(
            _o.service,
            _o.ident,
            _o.authInfo,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION SvceAuthInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SvceAuthInfo */
/**
 * @summary The Leading Root Component Types of SvceAuthInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_SvceAuthInfo: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'service',
            false,
            $.hasAnyTag,
            undefined,
            undefined
        ),
        new $.ComponentSpec('ident', false, $.hasAnyTag, undefined, undefined),
        new $.ComponentSpec(
            'authInfo',
            true,
            $.hasTag(_TagClass.universal, 4),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_SvceAuthInfo */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SvceAuthInfo */
/**
 * @summary The Trailing Root Component Types of SvceAuthInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_SvceAuthInfo: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_SvceAuthInfo */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SvceAuthInfo */
/**
 * @summary The Extension Addition Component Types of SvceAuthInfo
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_SvceAuthInfo: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_SvceAuthInfo */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SvceAuthInfo */
let _cached_decoder_for_SvceAuthInfo: $.ASN1Decoder<SvceAuthInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SvceAuthInfo */

/* START_OF_SYMBOL_DEFINITION _decode_SvceAuthInfo */
/**
 * @summary Decodes an ASN.1 element into a(n) SvceAuthInfo
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SvceAuthInfo} The decoded data structure.
 */
export function _decode_SvceAuthInfo(el: _Element) {
    if (!_cached_decoder_for_SvceAuthInfo) {
        _cached_decoder_for_SvceAuthInfo = function (
            el: _Element
        ): SvceAuthInfo {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let service!: GeneralName;
            let ident!: GeneralName;
            let authInfo: OPTIONAL<OCTET_STRING>;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                service: (_el: _Element): void => {
                    service = _decode_GeneralName(_el);
                },
                ident: (_el: _Element): void => {
                    ident = _decode_GeneralName(_el);
                },
                authInfo: (_el: _Element): void => {
                    authInfo = $._decodeOctetString(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_SvceAuthInfo,
                _extension_additions_list_spec_for_SvceAuthInfo,
                _root_component_type_list_2_spec_for_SvceAuthInfo,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new SvceAuthInfo /* SEQUENCE_CONSTRUCTOR_CALL */(
                service,
                ident,
                authInfo,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_SvceAuthInfo(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SvceAuthInfo */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SvceAuthInfo */
let _cached_encoder_for_SvceAuthInfo: $.ASN1Encoder<SvceAuthInfo> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SvceAuthInfo */

/* START_OF_SYMBOL_DEFINITION _encode_SvceAuthInfo */
/**
 * @summary Encodes a(n) SvceAuthInfo into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SvceAuthInfo, encoded as an ASN.1 Element.
 */
export function _encode_SvceAuthInfo(
    value: SvceAuthInfo,
    elGetter: $.ASN1Encoder<SvceAuthInfo>
) {
    if (!_cached_encoder_for_SvceAuthInfo) {
        _cached_encoder_for_SvceAuthInfo = function (
            value: SvceAuthInfo,
            elGetter: $.ASN1Encoder<SvceAuthInfo>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_GeneralName(
                                value.service,
                                $.BER
                            ),
                            /* REQUIRED   */ _encode_GeneralName(
                                value.ident,
                                $.BER
                            ),
                            /* IF_ABSENT  */ value.authInfo === undefined
                                ? undefined
                                : $._encodeOctetString(value.authInfo, $.BER),
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
    return _cached_encoder_for_SvceAuthInfo(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SvceAuthInfo */

/* eslint-enable */
