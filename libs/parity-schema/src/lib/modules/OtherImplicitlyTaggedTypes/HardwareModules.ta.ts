/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';
import {
    HardwareSerialEntry,
    _decode_HardwareSerialEntry,
    _encode_HardwareSerialEntry,
} from '../OtherImplicitlyTaggedTypes/HardwareSerialEntry.ta';

/* START_OF_SYMBOL_DEFINITION HardwareModules */
/**
 * @summary HardwareModules
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * HardwareModules ::= SEQUENCE {
 *     hwType              OBJECT IDENTIFIER,
 *     hwSerialEntries     SEQUENCE OF HardwareSerialEntry }
 * ```
 *
 * @class
 */
export class HardwareModules {
    constructor(
        /**
         * @summary `hwType`.
         * @public
         * @readonly
         */
        readonly hwType: OBJECT_IDENTIFIER,
        /**
         * @summary `hwSerialEntries`.
         * @public
         * @readonly
         */
        readonly hwSerialEntries: HardwareSerialEntry[],
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a HardwareModules
     * @description
     *
     * This takes an `object` and converts it to a `HardwareModules`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `HardwareModules`.
     * @returns {HardwareModules}
     */
    public static _from_object(_o: {
        [_K in keyof HardwareModules]: HardwareModules[_K];
    }): HardwareModules {
        return new HardwareModules(
            _o.hwType,
            _o.hwSerialEntries,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION HardwareModules */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HardwareModules */
/**
 * @summary The Leading Root Component Types of HardwareModules
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_HardwareModules: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'hwType',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'hwSerialEntries',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_HardwareModules */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HardwareModules */
/**
 * @summary The Trailing Root Component Types of HardwareModules
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_HardwareModules: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_HardwareModules */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HardwareModules */
/**
 * @summary The Extension Addition Component Types of HardwareModules
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_HardwareModules: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_HardwareModules */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareModules */
let _cached_decoder_for_HardwareModules: $.ASN1Decoder<HardwareModules> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_HardwareModules */

/* START_OF_SYMBOL_DEFINITION _decode_HardwareModules */
/**
 * @summary Decodes an ASN.1 element into a(n) HardwareModules
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {HardwareModules} The decoded data structure.
 */
export function _decode_HardwareModules(el: _Element) {
    if (!_cached_decoder_for_HardwareModules) {
        _cached_decoder_for_HardwareModules = function (
            el: _Element
        ): HardwareModules {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'HardwareModules contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'hwType';
            sequence[1].name = 'hwSerialEntries';
            let hwType!: OBJECT_IDENTIFIER;
            let hwSerialEntries!: HardwareSerialEntry[];
            hwType = $._decodeObjectIdentifier(sequence[0]);
            hwSerialEntries = $._decodeSequenceOf<HardwareSerialEntry>(
                () => _decode_HardwareSerialEntry
            )(sequence[1]);
            return new HardwareModules(
                hwType,
                hwSerialEntries,
                sequence.slice(2)
            );
        };
    }
    return _cached_decoder_for_HardwareModules(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_HardwareModules */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareModules */
let _cached_encoder_for_HardwareModules: $.ASN1Encoder<HardwareModules> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_HardwareModules */

/* START_OF_SYMBOL_DEFINITION _encode_HardwareModules */
/**
 * @summary Encodes a(n) HardwareModules into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The HardwareModules, encoded as an ASN.1 Element.
 */
export function _encode_HardwareModules(
    value: HardwareModules,
    elGetter: $.ASN1Encoder<HardwareModules>
) {
    if (!_cached_encoder_for_HardwareModules) {
        _cached_encoder_for_HardwareModules = function (
            value: HardwareModules,
            elGetter: $.ASN1Encoder<HardwareModules>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeObjectIdentifier(
                                value.hwType,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeSequenceOf<HardwareSerialEntry>(
                                () => _encode_HardwareSerialEntry,
                                $.BER
                            )(value.hwSerialEntries, $.BER),
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
    return _cached_encoder_for_HardwareModules(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_HardwareModules */

/* eslint-enable */
