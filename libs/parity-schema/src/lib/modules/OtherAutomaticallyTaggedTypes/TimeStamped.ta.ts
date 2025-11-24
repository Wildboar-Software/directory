/* eslint-disable */
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    type TimeStamp,
    _decode_TimeStamp,
    _encode_TimeStamp,
} from '../OtherAutomaticallyTaggedTypes/TimeStamp.ta';
import {
    type URI,
    _decode_URI,
    _encode_URI,
} from '../OtherAutomaticallyTaggedTypes/URI.ta';

/* START_OF_SYMBOL_DEFINITION TimeStamped */
/**
 * @summary TimeStamped
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * TimeStamped ::= SEQUENCE {
 *     timeStampValue        TimeStamp,
 *     timeStampService    URI OPTIONAL }
 * ```
 *
 * @class
 */
export class TimeStamped {
    constructor(
        /**
         * @summary `timeStampValue`.
         * @public
         * @readonly
         */
        readonly timeStampValue: TimeStamp,
        /**
         * @summary `timeStampService`.
         * @public
         * @readonly
         */
        readonly timeStampService: OPTIONAL<URI>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a TimeStamped
     * @description
     *
     * This takes an `object` and converts it to a `TimeStamped`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `TimeStamped`.
     * @returns {TimeStamped}
     */
    public static _from_object(_o: {
        [_K in keyof TimeStamped]: TimeStamped[_K];
    }): TimeStamped {
        return new TimeStamped(
            _o.timeStampValue,
            _o.timeStampService,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION TimeStamped */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_TimeStamped */
/**
 * @summary The Leading Root Component Types of TimeStamped
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_TimeStamped: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'timeStampValue',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'timeStampService',
            true,
            $.hasTag(_TagClass.context, 1),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_TimeStamped */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_TimeStamped */
/**
 * @summary The Trailing Root Component Types of TimeStamped
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_TimeStamped: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_TimeStamped */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_TimeStamped */
/**
 * @summary The Extension Addition Component Types of TimeStamped
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_TimeStamped: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_TimeStamped */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStamped */
let _cached_decoder_for_TimeStamped: $.ASN1Decoder<TimeStamped> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TimeStamped */

/* START_OF_SYMBOL_DEFINITION _decode_TimeStamped */
/**
 * @summary Decodes an ASN.1 element into a(n) TimeStamped
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TimeStamped} The decoded data structure.
 */
export function _decode_TimeStamped(el: _Element) {
    if (!_cached_decoder_for_TimeStamped) {
        _cached_decoder_for_TimeStamped = function (el: _Element): TimeStamped {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let timeStampValue!: TimeStamp;
            let timeStampService: OPTIONAL<URI>;
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                timeStampValue: (_el: _Element): void => {
                    timeStampValue = _decode_TimeStamp(_el);
                },
                timeStampService: (_el: _Element): void => {
                    timeStampService = _decode_URI(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_TimeStamped,
                _extension_additions_list_spec_for_TimeStamped,
                _root_component_type_list_2_spec_for_TimeStamped,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new TimeStamped /* SEQUENCE_CONSTRUCTOR_CALL */(
                timeStampValue,
                timeStampService,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_TimeStamped(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TimeStamped */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStamped */
let _cached_encoder_for_TimeStamped: $.ASN1Encoder<TimeStamped> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TimeStamped */

/* START_OF_SYMBOL_DEFINITION _encode_TimeStamped */
/**
 * @summary Encodes a(n) TimeStamped into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TimeStamped, encoded as an ASN.1 Element.
 */
export function _encode_TimeStamped(
    value: TimeStamped,
    elGetter: $.ASN1Encoder<TimeStamped>
) {
    if (!_cached_encoder_for_TimeStamped) {
        _cached_encoder_for_TimeStamped = function (
            value: TimeStamped,
            elGetter: $.ASN1Encoder<TimeStamped>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ _encode_TimeStamp(
                                value.timeStampValue,
                                $.BER
                            ),
                            /* IF_ABSENT  */ value.timeStampService ===
                            undefined
                                ? undefined
                                : _encode_URI(value.timeStampService, $.BER),
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
    return _cached_encoder_for_TimeStamped(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TimeStamped */

/* eslint-enable */
