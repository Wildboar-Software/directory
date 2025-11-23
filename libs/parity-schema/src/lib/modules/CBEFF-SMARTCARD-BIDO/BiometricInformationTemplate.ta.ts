/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    EXTERNAL,
    OCTET_STRING,
    OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    BiometricHeaderTemplate,
    _decode_BiometricHeaderTemplate,
    _encode_BiometricHeaderTemplate,
} from '../CBEFF-SMARTCARD-BIDO/BiometricHeaderTemplate.ta';
export {
    BiometricHeaderTemplate,
    _decode_BiometricHeaderTemplate,
    _encode_BiometricHeaderTemplate,
} from '../CBEFF-SMARTCARD-BIDO/BiometricHeaderTemplate.ta';

/* START_OF_SYMBOL_DEFINITION BiometricInformationTemplate */
/**
 * @summary BiometricInformationTemplate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BiometricInformationTemplate ::= [APPLICATION 96]  SET {
 *   algorithmReference       [0]  OCTET STRING(SIZE (1)) OPTIONAL,
 *   -- A non-CBEFF data element &#8211; see ISO/IEC 7816-11
 *   referenceDataQualifier   [3]  OCTET STRING(SIZE (1)) OPTIONAL,
 *   -- A non-CBEFF data element &#8211; see ISO/IEC 7816-11
 *   biometricHeaderTemplate  [1]  BiometricHeaderTemplate,
 *   bdbReferenceData         [APPLICATION 46]  EXTERNAL OPTIONAL,
 *   -- A CBEFF BDB, mandatory for off-card-matching
 *   birPayLoad               [APPLICATION 19]  OCTET STRING OPTIONAL
 *   -- CBEFF_BIR_payload, contents defined by ISO/IEC 7816-11
 * }
 * ```
 *
 * @class
 */
export class BiometricInformationTemplate {
    constructor(
        /**
         * @summary `algorithmReference`.
         * @public
         * @readonly
         */
        readonly algorithmReference: OPTIONAL<OCTET_STRING>,
        /**
         * @summary `referenceDataQualifier`.
         * @public
         * @readonly
         */
        readonly referenceDataQualifier: OPTIONAL<OCTET_STRING>,
        /**
         * @summary `biometricHeaderTemplate`.
         * @public
         * @readonly
         */
        readonly biometricHeaderTemplate: BiometricHeaderTemplate,
        /**
         * @summary `bdbReferenceData`.
         * @public
         * @readonly
         */
        readonly bdbReferenceData: OPTIONAL<EXTERNAL>,
        /**
         * @summary `birPayLoad`.
         * @public
         * @readonly
         */
        readonly birPayLoad: OPTIONAL<OCTET_STRING>
    ) {}

    /**
     * @summary Restructures an object into a BiometricInformationTemplate
     * @description
     *
     * This takes an `object` and converts it to a `BiometricInformationTemplate`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `BiometricInformationTemplate`.
     * @returns {BiometricInformationTemplate}
     */
    public static _from_object(_o: {
        [_K in keyof BiometricInformationTemplate]: BiometricInformationTemplate[_K];
    }): BiometricInformationTemplate {
        return new BiometricInformationTemplate(
            _o.algorithmReference,
            _o.referenceDataQualifier,
            _o.biometricHeaderTemplate,
            _o.bdbReferenceData,
            _o.birPayLoad
        );
    }
}
/* END_OF_SYMBOL_DEFINITION BiometricInformationTemplate */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BiometricInformationTemplate */
/**
 * @summary The Leading Root Component Types of BiometricInformationTemplate
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_BiometricInformationTemplate: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'algorithmReference',
            true,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'referenceDataQualifier',
            true,
            $.hasTag(_TagClass.context, 3),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'biometricHeaderTemplate',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'bdbReferenceData',
            true,
            $.hasTag(_TagClass.application, 46),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'birPayLoad',
            true,
            $.hasTag(_TagClass.application, 19),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BiometricInformationTemplate */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BiometricInformationTemplate */
/**
 * @summary The Trailing Root Component Types of BiometricInformationTemplate
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_BiometricInformationTemplate: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BiometricInformationTemplate */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BiometricInformationTemplate */
/**
 * @summary The Extension Addition Component Types of BiometricInformationTemplate
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_BiometricInformationTemplate: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BiometricInformationTemplate */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricInformationTemplate */
let _cached_decoder_for_BiometricInformationTemplate: $.ASN1Decoder<BiometricInformationTemplate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricInformationTemplate */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricInformationTemplate */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricInformationTemplate
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricInformationTemplate} The decoded data structure.
 */
export function _decode_BiometricInformationTemplate(el: _Element) {
    if (!_cached_decoder_for_BiometricInformationTemplate) {
        _cached_decoder_for_BiometricInformationTemplate =
            $._decode_implicit<BiometricInformationTemplate>(
                () =>
                    function (el: _Element): BiometricInformationTemplate {
                        /* START_OF_SET_COMPONENT_DECLARATIONS */
                        let algorithmReference: OPTIONAL<OCTET_STRING>;
                        let referenceDataQualifier: OPTIONAL<OCTET_STRING>;
                        let biometricHeaderTemplate!: BiometricHeaderTemplate;
                        let bdbReferenceData: OPTIONAL<EXTERNAL>;
                        let birPayLoad: OPTIONAL<OCTET_STRING>;
                        /* END_OF_SET_COMPONENT_DECLARATIONS */
                        /* START_OF_CALLBACKS_MAP */
                        const callbacks: $.DecodingMap = {
                            algorithmReference: (_el: _Element): void => {
                                algorithmReference =
                                    $._decode_implicit<OCTET_STRING>(
                                        () => $._decodeOctetString
                                    )(_el);
                            },
                            referenceDataQualifier: (_el: _Element): void => {
                                referenceDataQualifier =
                                    $._decode_implicit<OCTET_STRING>(
                                        () => $._decodeOctetString
                                    )(_el);
                            },
                            biometricHeaderTemplate: (_el: _Element): void => {
                                biometricHeaderTemplate =
                                    $._decode_implicit<BiometricHeaderTemplate>(
                                        () => _decode_BiometricHeaderTemplate
                                    )(_el);
                            },
                            bdbReferenceData: (_el: _Element): void => {
                                bdbReferenceData = $._decode_implicit<EXTERNAL>(
                                    () => $._decodeExternal
                                )(_el);
                            },
                            birPayLoad: (_el: _Element): void => {
                                birPayLoad = $._decode_implicit<OCTET_STRING>(
                                    () => $._decodeOctetString
                                )(_el);
                            },
                        };
                        /* END_OF_CALLBACKS_MAP */
                        $._parse_set(
                            el,
                            callbacks,
                            _root_component_type_list_1_spec_for_BiometricInformationTemplate,
                            _extension_additions_list_spec_for_BiometricInformationTemplate,
                            _root_component_type_list_2_spec_for_BiometricInformationTemplate,
                            undefined
                        );
                        return new BiometricInformationTemplate /* SET_CONSTRUCTOR_CALL */(
                            algorithmReference,
                            referenceDataQualifier,
                            biometricHeaderTemplate,
                            bdbReferenceData,
                            birPayLoad
                        );
                    }
            );
    }
    return _cached_decoder_for_BiometricInformationTemplate(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricInformationTemplate */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricInformationTemplate */
let _cached_encoder_for_BiometricInformationTemplate: $.ASN1Encoder<BiometricInformationTemplate> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricInformationTemplate */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricInformationTemplate */
/**
 * @summary Encodes a(n) BiometricInformationTemplate into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricInformationTemplate, encoded as an ASN.1 Element.
 */
export function _encode_BiometricInformationTemplate(
    value: BiometricInformationTemplate,
    elGetter: $.ASN1Encoder<BiometricInformationTemplate>
) {
    if (!_cached_encoder_for_BiometricInformationTemplate) {
        _cached_encoder_for_BiometricInformationTemplate = $._encode_implicit(
            _TagClass.application,
            96,
            () =>
                function (
                    value: BiometricInformationTemplate,
                    elGetter: $.ASN1Encoder<BiometricInformationTemplate>
                ): _Element {
                    return $._encodeSet(
                        ([] as (_Element | undefined)[])
                            .concat([
                                /* IF_ABSENT  */ value.algorithmReference ===
                                undefined
                                    ? undefined
                                    : $._encode_implicit(
                                          _TagClass.context,
                                          0,
                                          () => $._encodeOctetString,
                                          $.BER
                                      )(value.algorithmReference, $.BER),
                                /* IF_ABSENT  */ value.referenceDataQualifier ===
                                undefined
                                    ? undefined
                                    : $._encode_implicit(
                                          _TagClass.context,
                                          3,
                                          () => $._encodeOctetString,
                                          $.BER
                                      )(value.referenceDataQualifier, $.BER),
                                /* REQUIRED   */ $._encode_implicit(
                                    _TagClass.context,
                                    1,
                                    () => _encode_BiometricHeaderTemplate,
                                    $.BER
                                )(value.biometricHeaderTemplate, $.BER),
                                /* IF_ABSENT  */ value.bdbReferenceData ===
                                undefined
                                    ? undefined
                                    : $._encode_implicit(
                                          _TagClass.application,
                                          46,
                                          () => $._encodeExternal,
                                          $.BER
                                      )(value.bdbReferenceData, $.BER),
                                /* IF_ABSENT  */ value.birPayLoad === undefined
                                    ? undefined
                                    : $._encode_implicit(
                                          _TagClass.application,
                                          19,
                                          () => $._encodeOctetString,
                                          $.BER
                                      )(value.birPayLoad, $.BER),
                            ])
                            .filter(
                                (c: _Element | undefined): c is _Element => !!c
                            ),
                        $.BER
                    );
                },
            $.BER
        );
    }
    return _cached_encoder_for_BiometricInformationTemplate(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricInformationTemplate */

/* eslint-enable */
