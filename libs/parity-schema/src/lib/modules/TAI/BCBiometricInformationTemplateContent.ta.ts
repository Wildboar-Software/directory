/* eslint-disable */
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/AuthenticationFramework';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricTemplateInfo,
    _decode_BiometricTemplateInfo,
    _encode_BiometricTemplateInfo,
} from '../TAI/BiometricTemplateInfo.ta';
import {
    BiometricTemplateVersion,
    _decode_BiometricTemplateVersion,
    _encode_BiometricTemplateVersion,
} from '../TAI/BiometricTemplateVersion.ta';
import {
    BioTempIssuer,
    _decode_BioTempIssuer,
    _encode_BioTempIssuer,
} from '../TAI/BioTempIssuer.ta';

/* START_OF_SYMBOL_DEFINITION BCBiometricInformationTemplateContent */
/**
 * @summary BCBiometricInformationTemplateContent
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BCBiometricInformationTemplateContent ::= SEQUENCE {
 *   biometricTemplateVersion         BiometricTemplateVersion,
 *   biometricTemplateInfo            BiometricTemplateInfo,
 *   issuerDigitalSignatureAlgorithm
 *     AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
 *   bioTempIssuer                    BioTempIssuer OPTIONAL
 * }
 * ```
 *
 * @class
 */
export class BCBiometricInformationTemplateContent {
    constructor(
        /**
         * @summary `biometricTemplateVersion`.
         * @public
         * @readonly
         */
        readonly biometricTemplateVersion: BiometricTemplateVersion,
        /**
         * @summary `biometricTemplateInfo`.
         * @public
         * @readonly
         */
        readonly biometricTemplateInfo: BiometricTemplateInfo,
        /**
         * @summary `issuerDigitalSignatureAlgorithm`.
         * @public
         * @readonly
         */
        readonly issuerDigitalSignatureAlgorithm: OPTIONAL<AlgorithmIdentifier>,
        /**
         * @summary `bioTempIssuer`.
         * @public
         * @readonly
         */
        readonly bioTempIssuer: OPTIONAL<BioTempIssuer>
    ) {}

    /**
     * @summary Restructures an object into a BCBiometricInformationTemplateContent
     * @description
     *
     * This takes an `object` and converts it to a `BCBiometricInformationTemplateContent`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `BCBiometricInformationTemplateContent`.
     * @returns {BCBiometricInformationTemplateContent}
     */
    public static _from_object(_o: {
        [_K in keyof BCBiometricInformationTemplateContent]: BCBiometricInformationTemplateContent[_K];
    }): BCBiometricInformationTemplateContent {
        return new BCBiometricInformationTemplateContent(
            _o.biometricTemplateVersion,
            _o.biometricTemplateInfo,
            _o.issuerDigitalSignatureAlgorithm,
            _o.bioTempIssuer
        );
    }
}
/* END_OF_SYMBOL_DEFINITION BCBiometricInformationTemplateContent */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BCBiometricInformationTemplateContent */
/**
 * @summary The Leading Root Component Types of BCBiometricInformationTemplateContent
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_BCBiometricInformationTemplateContent: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'biometricTemplateVersion',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'biometricTemplateInfo',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'issuerDigitalSignatureAlgorithm',
            true,
            $.hasTag(_TagClass.context, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'bioTempIssuer',
            true,
            $.hasTag(_TagClass.context, 3),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BCBiometricInformationTemplateContent */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BCBiometricInformationTemplateContent */
/**
 * @summary The Trailing Root Component Types of BCBiometricInformationTemplateContent
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_BCBiometricInformationTemplateContent: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BCBiometricInformationTemplateContent */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BCBiometricInformationTemplateContent */
/**
 * @summary The Extension Addition Component Types of BCBiometricInformationTemplateContent
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_BCBiometricInformationTemplateContent: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BCBiometricInformationTemplateContent */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BCBiometricInformationTemplateContent */
let _cached_decoder_for_BCBiometricInformationTemplateContent: $.ASN1Decoder<BCBiometricInformationTemplateContent> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BCBiometricInformationTemplateContent */

/* START_OF_SYMBOL_DEFINITION _decode_BCBiometricInformationTemplateContent */
/**
 * @summary Decodes an ASN.1 element into a(n) BCBiometricInformationTemplateContent
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BCBiometricInformationTemplateContent} The decoded data structure.
 */
export function _decode_BCBiometricInformationTemplateContent(el: _Element) {
    if (!_cached_decoder_for_BCBiometricInformationTemplateContent) {
        _cached_decoder_for_BCBiometricInformationTemplateContent = function (
            el: _Element
        ): BCBiometricInformationTemplateContent {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let biometricTemplateVersion!: BiometricTemplateVersion;
            let biometricTemplateInfo!: BiometricTemplateInfo;
            let issuerDigitalSignatureAlgorithm: OPTIONAL<AlgorithmIdentifier>;
            let bioTempIssuer: OPTIONAL<BioTempIssuer>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                biometricTemplateVersion: (_el: _Element): void => {
                    biometricTemplateVersion =
                        _decode_BiometricTemplateVersion(_el);
                },
                biometricTemplateInfo: (_el: _Element): void => {
                    biometricTemplateInfo = _decode_BiometricTemplateInfo(_el);
                },
                issuerDigitalSignatureAlgorithm: (_el: _Element): void => {
                    issuerDigitalSignatureAlgorithm =
                        _decode_AlgorithmIdentifier(_el);
                },
                bioTempIssuer: (_el: _Element): void => {
                    bioTempIssuer = _decode_BioTempIssuer(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_BCBiometricInformationTemplateContent,
                _extension_additions_list_spec_for_BCBiometricInformationTemplateContent,
                _root_component_type_list_2_spec_for_BCBiometricInformationTemplateContent,
                undefined
            );
            return new BCBiometricInformationTemplateContent /* SEQUENCE_CONSTRUCTOR_CALL */(
                biometricTemplateVersion,
                biometricTemplateInfo,
                issuerDigitalSignatureAlgorithm,
                bioTempIssuer
            );
        };
    }
    return _cached_decoder_for_BCBiometricInformationTemplateContent(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BCBiometricInformationTemplateContent */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BCBiometricInformationTemplateContent */
let _cached_encoder_for_BCBiometricInformationTemplateContent: $.ASN1Encoder<BCBiometricInformationTemplateContent> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BCBiometricInformationTemplateContent */

/* START_OF_SYMBOL_DEFINITION _encode_BCBiometricInformationTemplateContent */
/**
 * @summary Encodes a(n) BCBiometricInformationTemplateContent into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BCBiometricInformationTemplateContent, encoded as an ASN.1 Element.
 */
export function _encode_BCBiometricInformationTemplateContent(
    value: BCBiometricInformationTemplateContent,
    elGetter: $.ASN1Encoder<BCBiometricInformationTemplateContent>
) {
    if (!_cached_encoder_for_BCBiometricInformationTemplateContent) {
        _cached_encoder_for_BCBiometricInformationTemplateContent = function (
            value: BCBiometricInformationTemplateContent,
            elGetter: $.ASN1Encoder<BCBiometricInformationTemplateContent>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ _encode_BiometricTemplateVersion(
                            value.biometricTemplateVersion,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_BiometricTemplateInfo(
                            value.biometricTemplateInfo,
                            $.BER
                        ),
                        /* IF_ABSENT  */ value.issuerDigitalSignatureAlgorithm ===
                        undefined
                            ? undefined
                            : _encode_AlgorithmIdentifier(
                                  value.issuerDigitalSignatureAlgorithm,
                                  $.BER
                              ),
                        /* IF_ABSENT  */ value.bioTempIssuer === undefined
                            ? undefined
                            : _encode_BioTempIssuer(value.bioTempIssuer, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_BCBiometricInformationTemplateContent(
        value,
        elGetter
    );
}

/* END_OF_SYMBOL_DEFINITION _encode_BCBiometricInformationTemplateContent */

/* eslint-enable */
