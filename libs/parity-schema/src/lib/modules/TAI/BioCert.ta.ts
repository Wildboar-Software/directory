/* eslint-disable */
import {
    IssuerSerial,
    _decode_IssuerSerial,
    _encode_IssuerSerial,
} from '@wildboar/x500/AttributeCertificateDefinitions';
import {
    ObjectDigestInfo,
    _decode_ObjectDigestInfo,
    _encode_ObjectDigestInfo,
} from '@wildboar/x500/AttributeCertificateDefinitions';
import {
    GeneralNames,
    _decode_GeneralNames,
    _encode_GeneralNames,
} from '@wildboar/x500/CertificateExtensions';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
export {
    IssuerSerial,
    _decode_IssuerSerial,
    _encode_IssuerSerial,
} from '@wildboar/x500/AttributeCertificateDefinitions';
export {
    ObjectDigestInfo,
    _decode_ObjectDigestInfo,
    _encode_ObjectDigestInfo,
} from '@wildboar/x500/AttributeCertificateDefinitions';
export {
    GeneralNames,
    _decode_GeneralNames,
    _encode_GeneralNames,
} from '@wildboar/x500/CertificateExtensions';

/* START_OF_SYMBOL_DEFINITION BioCert */
/**
 * @summary BioCert
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * BioCert ::= SEQUENCE {
 *   baseCertificateID  [0]  IssuerSerial OPTIONAL,
 *   entityName         [1]  GeneralNames OPTIONAL -- [b-ISO-IEC-TR-24741] --,
 *   objectDigestInfo   [2]  ObjectDigestInfo OPTIONAL -- [b-ISO-IEC-TR-24722] --
 * }
 * (CONSTRAINED BY { -- at least one of baseCertificateID,
 *
 *    -- entityName or
 *    -- objectDigestInfo shall be present 
 *    })
 * ```
 *
 * @class
 */
export class BioCert {
    constructor(
        /**
         * @summary `baseCertificateID`.
         * @public
         * @readonly
         */
        readonly baseCertificateID: OPTIONAL<IssuerSerial>,
        /**
         * @summary `entityName`.
         * @public
         * @readonly
         */
        readonly entityName: OPTIONAL<GeneralNames>,
        /**
         * @summary `objectDigestInfo`.
         * @public
         * @readonly
         */
        readonly objectDigestInfo: OPTIONAL<ObjectDigestInfo>
    ) {}

    /**
     * @summary Restructures an object into a BioCert
     * @description
     *
     * This takes an `object` and converts it to a `BioCert`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `BioCert`.
     * @returns {BioCert}
     */
    public static _from_object(_o: {
        [_K in keyof BioCert]: BioCert[_K];
    }): BioCert {
        return new BioCert(
            _o.baseCertificateID,
            _o.entityName,
            _o.objectDigestInfo
        );
    }
}
/* END_OF_SYMBOL_DEFINITION BioCert */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BioCert */
/**
 * @summary The Leading Root Component Types of BioCert
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_BioCert: $.ComponentSpec[] = [
    new $.ComponentSpec(
        'baseCertificateID',
        true,
        $.hasTag(_TagClass.context, 0),
        undefined,
        undefined
    ),
    new $.ComponentSpec(
        'entityName',
        true,
        $.hasTag(_TagClass.context, 1),
        undefined,
        undefined
    ),
    new $.ComponentSpec(
        'objectDigestInfo',
        true,
        $.hasTag(_TagClass.context, 2),
        undefined,
        undefined
    ),
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BioCert */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BioCert */
/**
 * @summary The Trailing Root Component Types of BioCert
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_BioCert: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BioCert */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BioCert */
/**
 * @summary The Extension Addition Component Types of BioCert
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_BioCert: $.ComponentSpec[] = [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BioCert */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BioCert */
let _cached_decoder_for_BioCert: $.ASN1Decoder<BioCert> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BioCert */

/* START_OF_SYMBOL_DEFINITION _decode_BioCert */
/**
 * @summary Decodes an ASN.1 element into a(n) BioCert
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BioCert} The decoded data structure.
 */
export function _decode_BioCert(el: _Element) {
    if (!_cached_decoder_for_BioCert) {
        _cached_decoder_for_BioCert = function (el: _Element): BioCert {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let baseCertificateID: OPTIONAL<IssuerSerial>;
            let entityName: OPTIONAL<GeneralNames>;
            let objectDigestInfo: OPTIONAL<ObjectDigestInfo>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                baseCertificateID: (_el: _Element): void => {
                    baseCertificateID = $._decode_implicit<IssuerSerial>(
                        () => _decode_IssuerSerial
                    )(_el);
                },
                entityName: (_el: _Element): void => {
                    entityName = $._decode_implicit<GeneralNames>(
                        () => _decode_GeneralNames
                    )(_el);
                },
                objectDigestInfo: (_el: _Element): void => {
                    objectDigestInfo = $._decode_implicit<ObjectDigestInfo>(
                        () => _decode_ObjectDigestInfo
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_BioCert,
                _extension_additions_list_spec_for_BioCert,
                _root_component_type_list_2_spec_for_BioCert,
                undefined
            );
            return new BioCert /* SEQUENCE_CONSTRUCTOR_CALL */(
                baseCertificateID,
                entityName,
                objectDigestInfo
            );
        };
    }
    return _cached_decoder_for_BioCert(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BioCert */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BioCert */
let _cached_encoder_for_BioCert: $.ASN1Encoder<BioCert> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BioCert */

/* START_OF_SYMBOL_DEFINITION _encode_BioCert */
/**
 * @summary Encodes a(n) BioCert into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BioCert, encoded as an ASN.1 Element.
 */
export function _encode_BioCert(
    value: BioCert,
    elGetter: $.ASN1Encoder<BioCert>
) {
    if (!_cached_encoder_for_BioCert) {
        _cached_encoder_for_BioCert = function (
            value: BioCert,
            elGetter: $.ASN1Encoder<BioCert>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* IF_ABSENT  */ value.baseCertificateID === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  0,
                                  () => _encode_IssuerSerial,
                                  $.BER
                              )(value.baseCertificateID, $.BER),
                        /* IF_ABSENT  */ value.entityName === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  1,
                                  () => _encode_GeneralNames,
                                  $.BER
                              )(value.entityName, $.BER),
                        /* IF_ABSENT  */ value.objectDigestInfo === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  2,
                                  () => _encode_ObjectDigestInfo,
                                  $.BER
                              )(value.objectDigestInfo, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_BioCert(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BioCert */

/* eslint-enable */
