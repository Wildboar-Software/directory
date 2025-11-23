/* eslint-disable */
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/AuthenticationFramework';
import {
    Extensions,
    _decode_Extensions,
    _encode_Extensions,
} from '@wildboar/x500/AuthenticationFramework';
import {
    SubjectPublicKeyInfo,
    _decode_SubjectPublicKeyInfo,
    _encode_SubjectPublicKeyInfo,
} from '@wildboar/x500/AuthenticationFramework';
import {
    Version,
    _decode_Version,
    _encode_Version,
} from '@wildboar/x500/AuthenticationFramework';
import {
    Name,
    _decode_Name,
    _encode_Name,
} from '@wildboar/x500/InformationFramework';
import {
    UniqueIdentifier,
    _decode_UniqueIdentifier,
    _encode_UniqueIdentifier,
} from '@wildboar/x500/SelectedAttributeTypes';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
    OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    OptionalValidity,
    _decode_OptionalValidity,
    _encode_OptionalValidity,
} from '../PKIXCRMF-2009/OptionalValidity.ta';
export {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
    _encode_AlgorithmIdentifier,
} from '@wildboar/x500/AuthenticationFramework';
export {
    Extensions,
    _decode_Extensions,
    _encode_Extensions,
} from '@wildboar/x500/AuthenticationFramework';
export {
    SubjectPublicKeyInfo,
    _decode_SubjectPublicKeyInfo,
    _encode_SubjectPublicKeyInfo,
} from '@wildboar/x500/AuthenticationFramework';
export {
    v1 /* IMPORTED_SHORT_NAMED_INTEGER */,
    v2 /* IMPORTED_SHORT_NAMED_INTEGER */,
    v3 /* IMPORTED_SHORT_NAMED_INTEGER */,
    Version,
    Version_v1 /* IMPORTED_LONG_NAMED_INTEGER */,
    Version_v2 /* IMPORTED_LONG_NAMED_INTEGER */,
    Version_v3 /* IMPORTED_LONG_NAMED_INTEGER */,
    _decode_Version,
    _encode_Version,
} from '@wildboar/x500/AuthenticationFramework';
export {
    Name,
    _decode_Name,
    _encode_Name,
} from '@wildboar/x500/InformationFramework';
export {
    UniqueIdentifier,
    _decode_UniqueIdentifier,
    _encode_UniqueIdentifier,
} from '@wildboar/x500/SelectedAttributeTypes';
export {
    OptionalValidity,
    _decode_OptionalValidity,
    _encode_OptionalValidity,
} from '../PKIXCRMF-2009/OptionalValidity.ta';

/* START_OF_SYMBOL_DEFINITION CertTemplate */
/**
 * @summary CertTemplate
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CertTemplate ::= SEQUENCE {
 *     version      [0] Version               OPTIONAL,
 *     serialNumber [1] INTEGER               OPTIONAL,
 *     signingAlg   [2] AlgorithmIdentifier{{SupportedAlgorithms}}   OPTIONAL,
 *     issuer       [3] Name                  OPTIONAL,
 *     validity     [4] OptionalValidity      OPTIONAL,
 *     subject      [5] Name                  OPTIONAL,
 *     publicKey    [6] SubjectPublicKeyInfo  OPTIONAL,
 *     issuerUID    [7] UniqueIdentifier      OPTIONAL,
 *     subjectUID   [8] UniqueIdentifier      OPTIONAL,
 *     extensions   [9] Extensions  OPTIONAL }
 * ```
 *
 * @class
 */
export class CertTemplate {
    constructor(
        /**
         * @summary `version`.
         * @public
         * @readonly
         */
        readonly version: OPTIONAL<Version>,
        /**
         * @summary `serialNumber`.
         * @public
         * @readonly
         */
        readonly serialNumber: OPTIONAL<INTEGER>,
        /**
         * @summary `signingAlg`.
         * @public
         * @readonly
         */
        readonly signingAlg: OPTIONAL<AlgorithmIdentifier>,
        /**
         * @summary `issuer`.
         * @public
         * @readonly
         */
        readonly issuer: OPTIONAL<Name>,
        /**
         * @summary `validity`.
         * @public
         * @readonly
         */
        readonly validity: OPTIONAL<OptionalValidity>,
        /**
         * @summary `subject`.
         * @public
         * @readonly
         */
        readonly subject: OPTIONAL<Name>,
        /**
         * @summary `publicKey`.
         * @public
         * @readonly
         */
        readonly publicKey: OPTIONAL<SubjectPublicKeyInfo>,
        /**
         * @summary `issuerUID`.
         * @public
         * @readonly
         */
        readonly issuerUID: OPTIONAL<UniqueIdentifier>,
        /**
         * @summary `subjectUID`.
         * @public
         * @readonly
         */
        readonly subjectUID: OPTIONAL<UniqueIdentifier>,
        /**
         * @summary `extensions`.
         * @public
         * @readonly
         */
        readonly extensions: OPTIONAL<Extensions>
    ) {}

    /**
     * @summary Restructures an object into a CertTemplate
     * @description
     *
     * This takes an `object` and converts it to a `CertTemplate`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `CertTemplate`.
     * @returns {CertTemplate}
     */
    public static _from_object(_o: {
        [_K in keyof CertTemplate]: CertTemplate[_K];
    }): CertTemplate {
        return new CertTemplate(
            _o.version,
            _o.serialNumber,
            _o.signingAlg,
            _o.issuer,
            _o.validity,
            _o.subject,
            _o.publicKey,
            _o.issuerUID,
            _o.subjectUID,
            _o.extensions
        );
    }
}
/* END_OF_SYMBOL_DEFINITION CertTemplate */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertTemplate */
/**
 * @summary The Leading Root Component Types of CertTemplate
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_CertTemplate: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'version',
            true,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'serialNumber',
            true,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'signingAlg',
            true,
            $.hasTag(_TagClass.context, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'issuer',
            true,
            $.hasTag(_TagClass.context, 3),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'validity',
            true,
            $.hasTag(_TagClass.context, 4),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'subject',
            true,
            $.hasTag(_TagClass.context, 5),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'publicKey',
            true,
            $.hasTag(_TagClass.context, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'issuerUID',
            true,
            $.hasTag(_TagClass.context, 7),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'subjectUID',
            true,
            $.hasTag(_TagClass.context, 8),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'extensions',
            true,
            $.hasTag(_TagClass.context, 9),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertTemplate */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertTemplate */
/**
 * @summary The Trailing Root Component Types of CertTemplate
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_CertTemplate: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertTemplate */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertTemplate */
/**
 * @summary The Extension Addition Component Types of CertTemplate
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_CertTemplate: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertTemplate */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CertTemplate */
let _cached_decoder_for_CertTemplate: $.ASN1Decoder<CertTemplate> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CertTemplate */

/* START_OF_SYMBOL_DEFINITION _decode_CertTemplate */
/**
 * @summary Decodes an ASN.1 element into a(n) CertTemplate
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CertTemplate} The decoded data structure.
 */
export function _decode_CertTemplate(el: _Element) {
    if (!_cached_decoder_for_CertTemplate) {
        _cached_decoder_for_CertTemplate = function (
            el: _Element
        ): CertTemplate {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let version: OPTIONAL<Version>;
            let serialNumber: OPTIONAL<INTEGER>;
            let signingAlg: OPTIONAL<AlgorithmIdentifier>;
            let issuer: OPTIONAL<Name>;
            let validity: OPTIONAL<OptionalValidity>;
            let subject: OPTIONAL<Name>;
            let publicKey: OPTIONAL<SubjectPublicKeyInfo>;
            let issuerUID: OPTIONAL<UniqueIdentifier>;
            let subjectUID: OPTIONAL<UniqueIdentifier>;
            let extensions: OPTIONAL<Extensions>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                version: (_el: _Element): void => {
                    version = $._decode_implicit<Version>(
                        () => _decode_Version
                    )(_el);
                },
                serialNumber: (_el: _Element): void => {
                    serialNumber = $._decode_implicit<INTEGER>(
                        () => $._decodeInteger
                    )(_el);
                },
                signingAlg: (_el: _Element): void => {
                    signingAlg = $._decode_implicit<AlgorithmIdentifier>(
                        () => _decode_AlgorithmIdentifier
                    )(_el);
                },
                issuer: (_el: _Element): void => {
                    issuer = $._decode_explicit<Name>(() => _decode_Name)(_el);
                },
                validity: (_el: _Element): void => {
                    validity = $._decode_implicit<OptionalValidity>(
                        () => _decode_OptionalValidity
                    )(_el);
                },
                subject: (_el: _Element): void => {
                    subject = $._decode_explicit<Name>(() => _decode_Name)(_el);
                },
                publicKey: (_el: _Element): void => {
                    publicKey = $._decode_implicit<SubjectPublicKeyInfo>(
                        () => _decode_SubjectPublicKeyInfo
                    )(_el);
                },
                issuerUID: (_el: _Element): void => {
                    issuerUID = $._decode_implicit<UniqueIdentifier>(
                        () => _decode_UniqueIdentifier
                    )(_el);
                },
                subjectUID: (_el: _Element): void => {
                    subjectUID = $._decode_implicit<UniqueIdentifier>(
                        () => _decode_UniqueIdentifier
                    )(_el);
                },
                extensions: (_el: _Element): void => {
                    extensions = $._decode_implicit<Extensions>(
                        () => _decode_Extensions
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_CertTemplate,
                _extension_additions_list_spec_for_CertTemplate,
                _root_component_type_list_2_spec_for_CertTemplate,
                undefined
            );
            return new CertTemplate /* SEQUENCE_CONSTRUCTOR_CALL */(
                version,
                serialNumber,
                signingAlg,
                issuer,
                validity,
                subject,
                publicKey,
                issuerUID,
                subjectUID,
                extensions
            );
        };
    }
    return _cached_decoder_for_CertTemplate(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CertTemplate */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CertTemplate */
let _cached_encoder_for_CertTemplate: $.ASN1Encoder<CertTemplate> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CertTemplate */

/* START_OF_SYMBOL_DEFINITION _encode_CertTemplate */
/**
 * @summary Encodes a(n) CertTemplate into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CertTemplate, encoded as an ASN.1 Element.
 */
export function _encode_CertTemplate(
    value: CertTemplate,
    elGetter: $.ASN1Encoder<CertTemplate>
) {
    if (!_cached_encoder_for_CertTemplate) {
        _cached_encoder_for_CertTemplate = function (
            value: CertTemplate,
            elGetter: $.ASN1Encoder<CertTemplate>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* IF_ABSENT  */ value.version === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  0,
                                  () => _encode_Version,
                                  $.BER
                              )(value.version, $.BER),
                        /* IF_ABSENT  */ value.serialNumber === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  1,
                                  () => $._encodeInteger,
                                  $.BER
                              )(value.serialNumber, $.BER),
                        /* IF_ABSENT  */ value.signingAlg === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  2,
                                  () => _encode_AlgorithmIdentifier,
                                  $.BER
                              )(value.signingAlg, $.BER),
                        /* IF_ABSENT  */ value.issuer === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  3,
                                  () => _encode_Name,
                                  $.BER
                              )(value.issuer, $.BER),
                        /* IF_ABSENT  */ value.validity === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  4,
                                  () => _encode_OptionalValidity,
                                  $.BER
                              )(value.validity, $.BER),
                        /* IF_ABSENT  */ value.subject === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  5,
                                  () => _encode_Name,
                                  $.BER
                              )(value.subject, $.BER),
                        /* IF_ABSENT  */ value.publicKey === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  6,
                                  () => _encode_SubjectPublicKeyInfo,
                                  $.BER
                              )(value.publicKey, $.BER),
                        /* IF_ABSENT  */ value.issuerUID === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  7,
                                  () => _encode_UniqueIdentifier,
                                  $.BER
                              )(value.issuerUID, $.BER),
                        /* IF_ABSENT  */ value.subjectUID === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  8,
                                  () => _encode_UniqueIdentifier,
                                  $.BER
                              )(value.subjectUID, $.BER),
                        /* IF_ABSENT  */ value.extensions === undefined
                            ? undefined
                            : $._encode_implicit(
                                  _TagClass.context,
                                  9,
                                  () => _encode_Extensions,
                                  $.BER
                              )(value.extensions, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_CertTemplate(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CertTemplate */

/* eslint-enable */
