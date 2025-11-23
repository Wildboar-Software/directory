/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
    OPTIONAL,
    UTCTime,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import { Cause, _decode_Cause, _encode_Cause } from '../UPT-DataModel/Cause.ta';
import {
    CFServices,
    _decode_CFServices,
    _encode_CFServices,
} from '../UPT-DataModel/CFServices.ta';
import { Cost, _decode_Cost, _encode_Cost } from '../UPT-DataModel/Cost.ta';
import {
    IsdnAddress,
    _decode_IsdnAddress,
    _encode_IsdnAddress,
} from '../UPT-DataModel/IsdnAddress.ta';
import {
    NetworkCode,
    _decode_NetworkCode,
    _encode_NetworkCode,
} from '../UPT-DataModel/NetworkCode.ta';

/* START_OF_SYMBOL_DEFINITION CallInfoRecord */
/**
 * @summary CallInfoRecord
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * CallInfoRecord ::= SEQUENCE {
 *   authenticationTime            [0]  UTCTime,
 *   callStopTimeValue             [1]  UTCTime,
 *   callStartTimeValue            [2]  UTCTime,
 *   callingAddressValue           [3]  IsdnAddress,
 *   calledNumber                  [4]  IsdnAddress,
 *   duration                      [5]  INTEGER(0..2147483647) OPTIONAL,
 *   routingAddress                [6]  IsdnAddress OPTIONAL,
 *   forwardedToAddress            [7]  IsdnAddress OPTIONAL,
 *   invokedSupplementaryServices  [8]  CFServices OPTIONAL,
 *   visitedNetwork                [9]  NetworkCode OPTIONAL,
 *   callCost                      [10]  Cost OPTIONAL,
 *   surcharges                    [11]  Cost OPTIONAL,
 *   releaseCause                  [12]  Cause OPTIONAL
 * }
 * ```
 *
 * @class
 */
export class CallInfoRecord {
    constructor(
        /**
         * @summary `authenticationTime`.
         * @public
         * @readonly
         */
        readonly authenticationTime: UTCTime,
        /**
         * @summary `callStopTimeValue`.
         * @public
         * @readonly
         */
        readonly callStopTimeValue: UTCTime,
        /**
         * @summary `callStartTimeValue`.
         * @public
         * @readonly
         */
        readonly callStartTimeValue: UTCTime,
        /**
         * @summary `callingAddressValue`.
         * @public
         * @readonly
         */
        readonly callingAddressValue: IsdnAddress,
        /**
         * @summary `calledNumber`.
         * @public
         * @readonly
         */
        readonly calledNumber: IsdnAddress,
        /**
         * @summary `duration`.
         * @public
         * @readonly
         */
        readonly duration: OPTIONAL<INTEGER>,
        /**
         * @summary `routingAddress`.
         * @public
         * @readonly
         */
        readonly routingAddress: OPTIONAL<IsdnAddress>,
        /**
         * @summary `forwardedToAddress`.
         * @public
         * @readonly
         */
        readonly forwardedToAddress: OPTIONAL<IsdnAddress>,
        /**
         * @summary `invokedSupplementaryServices`.
         * @public
         * @readonly
         */
        readonly invokedSupplementaryServices: OPTIONAL<CFServices>,
        /**
         * @summary `visitedNetwork`.
         * @public
         * @readonly
         */
        readonly visitedNetwork: OPTIONAL<NetworkCode>,
        /**
         * @summary `callCost`.
         * @public
         * @readonly
         */
        readonly callCost: OPTIONAL<Cost>,
        /**
         * @summary `surcharges`.
         * @public
         * @readonly
         */
        readonly surcharges: OPTIONAL<Cost>,
        /**
         * @summary `releaseCause`.
         * @public
         * @readonly
         */
        readonly releaseCause: OPTIONAL<Cause>
    ) {}

    /**
     * @summary Restructures an object into a CallInfoRecord
     * @description
     *
     * This takes an `object` and converts it to a `CallInfoRecord`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `CallInfoRecord`.
     * @returns {CallInfoRecord}
     */
    public static _from_object(_o: {
        [_K in keyof CallInfoRecord]: CallInfoRecord[_K];
    }): CallInfoRecord {
        return new CallInfoRecord(
            _o.authenticationTime,
            _o.callStopTimeValue,
            _o.callStartTimeValue,
            _o.callingAddressValue,
            _o.calledNumber,
            _o.duration,
            _o.routingAddress,
            _o.forwardedToAddress,
            _o.invokedSupplementaryServices,
            _o.visitedNetwork,
            _o.callCost,
            _o.surcharges,
            _o.releaseCause
        );
    }
}
/* END_OF_SYMBOL_DEFINITION CallInfoRecord */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CallInfoRecord */
/**
 * @summary The Leading Root Component Types of CallInfoRecord
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_CallInfoRecord: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'authenticationTime',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'callStopTimeValue',
            false,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'callStartTimeValue',
            false,
            $.hasTag(_TagClass.context, 2),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'callingAddressValue',
            false,
            $.hasTag(_TagClass.context, 3),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'calledNumber',
            false,
            $.hasTag(_TagClass.context, 4),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'duration',
            true,
            $.hasTag(_TagClass.context, 5),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'routingAddress',
            true,
            $.hasTag(_TagClass.context, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'forwardedToAddress',
            true,
            $.hasTag(_TagClass.context, 7),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'invokedSupplementaryServices',
            true,
            $.hasTag(_TagClass.context, 8),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'visitedNetwork',
            true,
            $.hasTag(_TagClass.context, 9),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'callCost',
            true,
            $.hasTag(_TagClass.context, 10),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'surcharges',
            true,
            $.hasTag(_TagClass.context, 11),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'releaseCause',
            true,
            $.hasTag(_TagClass.context, 12),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_CallInfoRecord */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CallInfoRecord */
/**
 * @summary The Trailing Root Component Types of CallInfoRecord
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_CallInfoRecord: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_CallInfoRecord */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CallInfoRecord */
/**
 * @summary The Extension Addition Component Types of CallInfoRecord
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_CallInfoRecord: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_CallInfoRecord */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_CallInfoRecord */
let _cached_decoder_for_CallInfoRecord: $.ASN1Decoder<CallInfoRecord> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_CallInfoRecord */

/* START_OF_SYMBOL_DEFINITION _decode_CallInfoRecord */
/**
 * @summary Decodes an ASN.1 element into a(n) CallInfoRecord
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {CallInfoRecord} The decoded data structure.
 */
export function _decode_CallInfoRecord(el: _Element) {
    if (!_cached_decoder_for_CallInfoRecord) {
        _cached_decoder_for_CallInfoRecord = function (
            el: _Element
        ): CallInfoRecord {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let authenticationTime!: UTCTime;
            let callStopTimeValue!: UTCTime;
            let callStartTimeValue!: UTCTime;
            let callingAddressValue!: IsdnAddress;
            let calledNumber!: IsdnAddress;
            let duration: OPTIONAL<INTEGER>;
            let routingAddress: OPTIONAL<IsdnAddress>;
            let forwardedToAddress: OPTIONAL<IsdnAddress>;
            let invokedSupplementaryServices: OPTIONAL<CFServices>;
            let visitedNetwork: OPTIONAL<NetworkCode>;
            let callCost: OPTIONAL<Cost>;
            let surcharges: OPTIONAL<Cost>;
            let releaseCause: OPTIONAL<Cause>;
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                authenticationTime: (_el: _Element): void => {
                    authenticationTime = $._decode_explicit<UTCTime>(
                        () => $._decodeUTCTime
                    )(_el);
                },
                callStopTimeValue: (_el: _Element): void => {
                    callStopTimeValue = $._decode_explicit<UTCTime>(
                        () => $._decodeUTCTime
                    )(_el);
                },
                callStartTimeValue: (_el: _Element): void => {
                    callStartTimeValue = $._decode_explicit<UTCTime>(
                        () => $._decodeUTCTime
                    )(_el);
                },
                callingAddressValue: (_el: _Element): void => {
                    callingAddressValue = $._decode_explicit<IsdnAddress>(
                        () => _decode_IsdnAddress
                    )(_el);
                },
                calledNumber: (_el: _Element): void => {
                    calledNumber = $._decode_explicit<IsdnAddress>(
                        () => _decode_IsdnAddress
                    )(_el);
                },
                duration: (_el: _Element): void => {
                    duration = $._decode_explicit<INTEGER>(
                        () => $._decodeInteger
                    )(_el);
                },
                routingAddress: (_el: _Element): void => {
                    routingAddress = $._decode_explicit<IsdnAddress>(
                        () => _decode_IsdnAddress
                    )(_el);
                },
                forwardedToAddress: (_el: _Element): void => {
                    forwardedToAddress = $._decode_explicit<IsdnAddress>(
                        () => _decode_IsdnAddress
                    )(_el);
                },
                invokedSupplementaryServices: (_el: _Element): void => {
                    invokedSupplementaryServices =
                        $._decode_explicit<CFServices>(
                            () => _decode_CFServices
                        )(_el);
                },
                visitedNetwork: (_el: _Element): void => {
                    visitedNetwork = $._decode_explicit<NetworkCode>(
                        () => _decode_NetworkCode
                    )(_el);
                },
                callCost: (_el: _Element): void => {
                    callCost = $._decode_explicit<Cost>(() => _decode_Cost)(
                        _el
                    );
                },
                surcharges: (_el: _Element): void => {
                    surcharges = $._decode_explicit<Cost>(() => _decode_Cost)(
                        _el
                    );
                },
                releaseCause: (_el: _Element): void => {
                    releaseCause = $._decode_explicit<Cause>(
                        () => _decode_Cause
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_CallInfoRecord,
                _extension_additions_list_spec_for_CallInfoRecord,
                _root_component_type_list_2_spec_for_CallInfoRecord,
                undefined
            );
            return new CallInfoRecord /* SEQUENCE_CONSTRUCTOR_CALL */(
                authenticationTime,
                callStopTimeValue,
                callStartTimeValue,
                callingAddressValue,
                calledNumber,
                duration,
                routingAddress,
                forwardedToAddress,
                invokedSupplementaryServices,
                visitedNetwork,
                callCost,
                surcharges,
                releaseCause
            );
        };
    }
    return _cached_decoder_for_CallInfoRecord(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_CallInfoRecord */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_CallInfoRecord */
let _cached_encoder_for_CallInfoRecord: $.ASN1Encoder<CallInfoRecord> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_CallInfoRecord */

/* START_OF_SYMBOL_DEFINITION _encode_CallInfoRecord */
/**
 * @summary Encodes a(n) CallInfoRecord into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The CallInfoRecord, encoded as an ASN.1 Element.
 */
export function _encode_CallInfoRecord(
    value: CallInfoRecord,
    elGetter: $.ASN1Encoder<CallInfoRecord>
) {
    if (!_cached_encoder_for_CallInfoRecord) {
        _cached_encoder_for_CallInfoRecord = function (
            value: CallInfoRecord,
            elGetter: $.ASN1Encoder<CallInfoRecord>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat([
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            0,
                            () => $._encodeUTCTime,
                            $.BER
                        )(value.authenticationTime, $.BER),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            1,
                            () => $._encodeUTCTime,
                            $.BER
                        )(value.callStopTimeValue, $.BER),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            2,
                            () => $._encodeUTCTime,
                            $.BER
                        )(value.callStartTimeValue, $.BER),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            3,
                            () => _encode_IsdnAddress,
                            $.BER
                        )(value.callingAddressValue, $.BER),
                        /* REQUIRED   */ $._encode_explicit(
                            _TagClass.context,
                            4,
                            () => _encode_IsdnAddress,
                            $.BER
                        )(value.calledNumber, $.BER),
                        /* IF_ABSENT  */ value.duration === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  5,
                                  () => $._encodeInteger,
                                  $.BER
                              )(value.duration, $.BER),
                        /* IF_ABSENT  */ value.routingAddress === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  6,
                                  () => _encode_IsdnAddress,
                                  $.BER
                              )(value.routingAddress, $.BER),
                        /* IF_ABSENT  */ value.forwardedToAddress === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  7,
                                  () => _encode_IsdnAddress,
                                  $.BER
                              )(value.forwardedToAddress, $.BER),
                        /* IF_ABSENT  */ value.invokedSupplementaryServices ===
                        undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  8,
                                  () => _encode_CFServices,
                                  $.BER
                              )(value.invokedSupplementaryServices, $.BER),
                        /* IF_ABSENT  */ value.visitedNetwork === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  9,
                                  () => _encode_NetworkCode,
                                  $.BER
                              )(value.visitedNetwork, $.BER),
                        /* IF_ABSENT  */ value.callCost === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  10,
                                  () => _encode_Cost,
                                  $.BER
                              )(value.callCost, $.BER),
                        /* IF_ABSENT  */ value.surcharges === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  11,
                                  () => _encode_Cost,
                                  $.BER
                              )(value.surcharges, $.BER),
                        /* IF_ABSENT  */ value.releaseCause === undefined
                            ? undefined
                            : $._encode_explicit(
                                  _TagClass.context,
                                  12,
                                  () => _encode_Cause,
                                  $.BER
                              )(value.releaseCause, $.BER),
                    ])
                    .filter((c: _Element | undefined): c is _Element => !!c),
                $.BER
            );
        };
    }
    return _cached_encoder_for_CallInfoRecord(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_CallInfoRecord */

/* eslint-enable */
