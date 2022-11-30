/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
    OPTIONAL,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    CertTemplate,
    _decode_CertTemplate,
    _encode_CertTemplate,
} from '../PKIXCRMF-2009/CertTemplate.ta';
import {
    Controls,
    _decode_Controls,
    _encode_Controls,
} from '../PKIXCRMF-2009/Controls.ta';

/* START_OF_SYMBOL_DEFINITION CertRequest */
/**
 * @summary CertRequest
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CertRequest ::= SEQUENCE {
 *     certReqId     INTEGER,
 *     -- ID for matching request and reply
 *     certTemplate  CertTemplate,
 *     -- Selected fields of cert to be issued
 *     controls      Controls OPTIONAL }
 * ```
 *
 * @class
 */
export class CertRequest {
    constructor(
        /**
         * @summary `certReqId`.
         * @public
         * @readonly
         */
        readonly certReqId: INTEGER,
        /**
         * @summary `certTemplate`.
         * @public
         * @readonly
         */
        readonly certTemplate: CertTemplate,
        /**
         * @summary `controls`.
         * @public
         * @readonly
         */
        readonly controls: OPTIONAL<Controls>
    ) {}

    /**
     * @summary Restructures an object into a CertRequest
     * @description
     *
     * This takes an `object` and converts it to a `CertRequest`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `CertRequest`.
     * @returns {CertRequest}
     */
    public static _from_object(_o: {
        [_K in keyof CertRequest]: CertRequest[_K];
    }): CertRequest {
        return new CertRequest(_o.certReqId, _o.certTemplate, _o.controls);
    }
}
/* END_OF_SYMBOL_DEFINITION CertRequest */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertRequest */
/**
 * @summary The Leading Root Component Types of CertRequest
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_CertRequest: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'certReqId',
            false,
            $.hasTag(_TagClass.universal, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'certTemplate',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'controls',
            true,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertRequest */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertRequest */
/**
 * @summary The Trailing Root Component Types of CertRequest
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_CertRequest: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertRequest */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertRequest */
/**
 * @summary The Extension Addition Component Types of CertRequest
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_CertRequest: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertRequest */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CertRequest */
let _cached_decoder_for_CertRequest: $.ASN1Decoder<CertRequest> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CertRequest */

/* START_OF_SYMBOL_DEFINITION _decode_CertRequest */
/**
 * @summary Decodes an ASN.1 element into a(n) CertRequest
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CertRequest} The decoded data structure.
 */
export function _decode_CertRequest(el: _Element) {
    if (!_cached_decoder_for_CertRequest) {
        _cached_decoder_for_CertRequest = function (el: _Element): CertRequest {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let certReqId!: INTEGER;
            let certTemplate!: CertTemplate;
            let controls: OPTIONAL<Controls>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                certReqId: (_el: _Element): void => {
                    certReqId = $._decodeInteger(_el);
                },
                certTemplate: (_el: _Element): void => {
                    certTemplate = _decode_CertTemplate(_el);
                },
                controls: (_el: _Element): void => {
                    controls = _decode_Controls(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_CertRequest,
                _extension_additions_list_spec_for_CertRequest,
                _root_component_type_list_2_spec_for_CertRequest,
                undefined
            );
            return new CertRequest /* SEQUENCE_CONSTRUCTOR_CALL */(
                certReqId,
                certTemplate,
                controls
            );
        };
    }
    return _cached_decoder_for_CertRequest(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CertRequest */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CertRequest */
let _cached_encoder_for_CertRequest: $.ASN1Encoder<CertRequest> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CertRequest */

/* START_OF_SYMBOL_DEFINITION _encode_CertRequest */
/**
 * @summary Encodes a(n) CertRequest into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CertRequest, encoded as an ASN.1 Element.
 */
export function _encode_CertRequest(
    value: CertRequest,
    elGetter: $.ASN1Encoder<CertRequest>
) {
    if (!_cached_encoder_for_CertRequest) {
        _cached_encoder_for_CertRequest = function (
            value: CertRequest,
            elGetter: $.ASN1Encoder<CertRequest>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ $._encodeInteger(
                            value.certReqId,
                            $.BER
                        ),
                        /* REQUIRED   */ _encode_CertTemplate(
                            value.certTemplate,
                            $.BER
                        ),
                        /* IF_ABSENT  */ value.controls === undefined
                            ? undefined
                            : _encode_Controls(value.controls, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_CertRequest(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CertRequest */

/* eslint-enable */
