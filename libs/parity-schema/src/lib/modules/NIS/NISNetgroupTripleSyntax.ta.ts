/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    IA5String,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';

/* START_OF_SYMBOL_DEFINITION NISNetgroupTripleSyntax */
/**
 * @summary NISNetgroupTripleSyntax
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * NISNetgroupTripleSyntax ::= SEQUENCE {
 *     hostname    [0] IA5String OPTIONAL,
 *     username    [1] IA5String OPTIONAL,
 *     domainname  [2] IA5String OPTIONAL
 * }
 * ```
 *
 * @class
 */
export class NISNetgroupTripleSyntax {
    constructor(
        /**
         * @summary `hostname`.
         * @public
         * @readonly
         */
        readonly hostname: OPTIONAL<IA5String>,
        /**
         * @summary `username`.
         * @public
         * @readonly
         */
        readonly username: OPTIONAL<IA5String>,
        /**
         * @summary `domainname`.
         * @public
         * @readonly
         */
        readonly domainname: OPTIONAL<IA5String>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a NISNetgroupTripleSyntax
     * @description
     *
     * This takes an `object` and converts it to a `NISNetgroupTripleSyntax`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `NISNetgroupTripleSyntax`.
     * @returns {NISNetgroupTripleSyntax}
     */
    public static _from_object(_o: {
        [_K in keyof NISNetgroupTripleSyntax]: NISNetgroupTripleSyntax[_K];
    }): NISNetgroupTripleSyntax {
        return new NISNetgroupTripleSyntax(
            _o.hostname,
            _o.username,
            _o.domainname,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION NISNetgroupTripleSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_NISNetgroupTripleSyntax */
/**
 * @summary The Leading Root Component Types of NISNetgroupTripleSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_NISNetgroupTripleSyntax: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'hostname',
            true,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'username',
            true,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'domainname',
            true,
            $.hasTag(_TagClass.context, 2),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_NISNetgroupTripleSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_NISNetgroupTripleSyntax */
/**
 * @summary The Trailing Root Component Types of NISNetgroupTripleSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_NISNetgroupTripleSyntax: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_NISNetgroupTripleSyntax */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_NISNetgroupTripleSyntax */
/**
 * @summary The Extension Addition Component Types of NISNetgroupTripleSyntax
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_NISNetgroupTripleSyntax: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_NISNetgroupTripleSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_NISNetgroupTripleSyntax */
let _cached_decoder_for_NISNetgroupTripleSyntax: $.ASN1Decoder<NISNetgroupTripleSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_NISNetgroupTripleSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_NISNetgroupTripleSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) NISNetgroupTripleSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {NISNetgroupTripleSyntax} The decoded data structure.
 */
export function _decode_NISNetgroupTripleSyntax(el: _Element) {
    if (!_cached_decoder_for_NISNetgroupTripleSyntax) {
        _cached_decoder_for_NISNetgroupTripleSyntax = function (
            el: _Element
        ): NISNetgroupTripleSyntax {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let hostname: OPTIONAL<IA5String>;
            let username: OPTIONAL<IA5String>;
            let domainname: OPTIONAL<IA5String>;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                hostname: (_el: _Element): void => {
                    hostname = $._decode_explicit<IA5String>(
                        () => $._decodeIA5String
                    )(_el);
                },
                username: (_el: _Element): void => {
                    username = $._decode_explicit<IA5String>(
                        () => $._decodeIA5String
                    )(_el);
                },
                domainname: (_el: _Element): void => {
                    domainname = $._decode_explicit<IA5String>(
                        () => $._decodeIA5String
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_NISNetgroupTripleSyntax,
                _extension_additions_list_spec_for_NISNetgroupTripleSyntax,
                _root_component_type_list_2_spec_for_NISNetgroupTripleSyntax,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new NISNetgroupTripleSyntax /* SEQUENCE_CONSTRUCTOR_CALL */(
                hostname,
                username,
                domainname,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_NISNetgroupTripleSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_NISNetgroupTripleSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_NISNetgroupTripleSyntax */
let _cached_encoder_for_NISNetgroupTripleSyntax: $.ASN1Encoder<NISNetgroupTripleSyntax> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_NISNetgroupTripleSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_NISNetgroupTripleSyntax */
/**
 * @summary Encodes a(n) NISNetgroupTripleSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The NISNetgroupTripleSyntax, encoded as an ASN.1 Element.
 */
export function _encode_NISNetgroupTripleSyntax(
    value: NISNetgroupTripleSyntax,
    elGetter: $.ASN1Encoder<NISNetgroupTripleSyntax>
) {
    if (!_cached_encoder_for_NISNetgroupTripleSyntax) {
        _cached_encoder_for_NISNetgroupTripleSyntax = function (
            value: NISNetgroupTripleSyntax,
            elGetter: $.ASN1Encoder<NISNetgroupTripleSyntax>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* IF_ABSENT  */ value.hostname === undefined
                                ? undefined
                                : $._encode_explicit(
                                      _TagClass.context,
                                      0,
                                      () => $._encodeIA5String,
                                      $.BER
                                  )(value.hostname, $.BER),
                            /* IF_ABSENT  */ value.username === undefined
                                ? undefined
                                : $._encode_explicit(
                                      _TagClass.context,
                                      1,
                                      () => $._encodeIA5String,
                                      $.BER
                                  )(value.username, $.BER),
                            /* IF_ABSENT  */ value.domainname === undefined
                                ? undefined
                                : $._encode_explicit(
                                      _TagClass.context,
                                      2,
                                      () => $._encodeIA5String,
                                      $.BER
                                  )(value.domainname, $.BER),
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
    return _cached_encoder_for_NISNetgroupTripleSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_NISNetgroupTripleSyntax */

/* eslint-enable */
