/* eslint-disable */
import {
    AttributeTypeAndValue,
    _decode_AttributeTypeAndValue,
    _encode_AttributeTypeAndValue,
} from '@wildboar/x500/InformationFramework';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    type CertRequest,
    _decode_CertRequest,
    _encode_CertRequest,
} from '../PKIXCRMF-2009/CertRequest.ta';
import {
    type ProofOfPossession,
    _decode_ProofOfPossession,
    _encode_ProofOfPossession,
} from '../PKIXCRMF-2009/ProofOfPossession.ta';

/**
 * @summary CertReqMsg
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CertReqMsg ::= SEQUENCE {
 *     certReq   CertRequest,
 *     popo       ProofOfPossession  OPTIONAL,
 *     -- content depends upon key type
 *     regInfo   SEQUENCE SIZE(1..MAX) OF AttributeTypeAndValue{{RegInfoSet}} OPTIONAL }
 * ```
 *
 * @class
 */
export class CertReqMsg {
    constructor(
        /**
         * @summary `certReq`.
         * @public
         * @readonly
         */
        readonly certReq: CertRequest,
        /**
         * @summary `popo`.
         * @public
         * @readonly
         */
        readonly popo: OPTIONAL<ProofOfPossession>,
        /**
         * @summary `regInfo`.
         * @public
         * @readonly
         */
        readonly regInfo: OPTIONAL<AttributeTypeAndValue[]>
    ) {}

    /**
     * @summary Restructures an object into a CertReqMsg
     * @description
     *
     * This takes an `object` and converts it to a `CertReqMsg`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `CertReqMsg`.
     * @returns {CertReqMsg}
     */
    public static _from_object(_o: {
        [_K in keyof CertReqMsg]: CertReqMsg[_K];
    }): CertReqMsg {
        return new CertReqMsg(_o.certReq, _o.popo, _o.regInfo);
    }
}
/* END_OF_SYMBOL_DEFINITION CertReqMsg */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertReqMsg */
/**
 * @summary The Leading Root Component Types of CertReqMsg
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_CertReqMsg: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'certReq',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'popo',
            true,
            $.or(
                $.hasTag(_TagClass.context, 0),
                $.hasTag(_TagClass.context, 1),
                $.hasTag(_TagClass.context, 2),
                $.hasTag(_TagClass.context, 3)
            ),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'regInfo',
            true,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CertReqMsg */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertReqMsg */
/**
 * @summary The Trailing Root Component Types of CertReqMsg
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_CertReqMsg: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CertReqMsg */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertReqMsg */
/**
 * @summary The Extension Addition Component Types of CertReqMsg
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_CertReqMsg: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CertReqMsg */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CertReqMsg */
let _cached_decoder_for_CertReqMsg: $.ASN1Decoder<CertReqMsg> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CertReqMsg */

/* START_OF_SYMBOL_DEFINITION _decode_CertReqMsg */
/**
 * @summary Decodes an ASN.1 element into a(n) CertReqMsg
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CertReqMsg} The decoded data structure.
 */
export function _decode_CertReqMsg(el: _Element) {
    if (!_cached_decoder_for_CertReqMsg) {
        _cached_decoder_for_CertReqMsg = function (el: _Element): CertReqMsg {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let certReq!: CertRequest;
            let popo: OPTIONAL<ProofOfPossession>;
            let regInfo: OPTIONAL<AttributeTypeAndValue[]>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                certReq: (_el: _Element): void => {
                    certReq = _decode_CertRequest(_el);
                },
                popo: (_el: _Element): void => {
                    popo = _decode_ProofOfPossession(_el);
                },
                regInfo: (_el: _Element): void => {
                    regInfo = $._decodeSequenceOf<AttributeTypeAndValue>(
                        () => _decode_AttributeTypeAndValue
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_CertReqMsg,
                _extension_additions_list_spec_for_CertReqMsg,
                _root_component_type_list_2_spec_for_CertReqMsg,
                undefined
            );
            return new CertReqMsg /* SEQUENCE_CONSTRUCTOR_CALL */(
                certReq,
                popo,
                regInfo
            );
        };
    }
    return _cached_decoder_for_CertReqMsg(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CertReqMsg */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CertReqMsg */
let _cached_encoder_for_CertReqMsg: $.ASN1Encoder<CertReqMsg> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CertReqMsg */

/* START_OF_SYMBOL_DEFINITION _encode_CertReqMsg */
/**
 * @summary Encodes a(n) CertReqMsg into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CertReqMsg, encoded as an ASN.1 Element.
 */
export function _encode_CertReqMsg(
    value: CertReqMsg,
    elGetter: $.ASN1Encoder<CertReqMsg>
) {
    if (!_cached_encoder_for_CertReqMsg) {
        _cached_encoder_for_CertReqMsg = function (
            value: CertReqMsg,
            elGetter: $.ASN1Encoder<CertReqMsg>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ _encode_CertRequest(
                            value.certReq,
                            $.BER
                        ),
                        /* IF_ABSENT  */ value.popo === undefined
                            ? undefined
                            : _encode_ProofOfPossession(value.popo, $.BER),
                        /* IF_ABSENT  */ value.regInfo === undefined
                            ? undefined
                            : $._encodeSequenceOf<AttributeTypeAndValue>(
                                  () => _encode_AttributeTypeAndValue,
                                  $.BER
                              )(value.regInfo, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_CertReqMsg(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CertReqMsg */

/* eslint-enable */
