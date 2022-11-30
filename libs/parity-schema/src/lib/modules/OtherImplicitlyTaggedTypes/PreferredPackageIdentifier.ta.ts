/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    INTEGER,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';

/* START_OF_SYMBOL_DEFINITION PreferredPackageIdentifier */
/**
 * @summary PreferredPackageIdentifier
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * PreferredPackageIdentifier ::= SEQUENCE {
 *     fwPkgID OBJECT IDENTIFIER,
 *     verNum INTEGER (0..MAX) }
 * ```
 *
 * @class
 */
export class PreferredPackageIdentifier {
    constructor(
        /**
         * @summary `fwPkgID`.
         * @public
         * @readonly
         */
        readonly fwPkgID: OBJECT_IDENTIFIER,
        /**
         * @summary `verNum`.
         * @public
         * @readonly
         */
        readonly verNum: INTEGER,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a PreferredPackageIdentifier
     * @description
     *
     * This takes an `object` and converts it to a `PreferredPackageIdentifier`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `PreferredPackageIdentifier`.
     * @returns {PreferredPackageIdentifier}
     */
    public static _from_object(_o: {
        [_K in keyof PreferredPackageIdentifier]: PreferredPackageIdentifier[_K];
    }): PreferredPackageIdentifier {
        return new PreferredPackageIdentifier(
            _o.fwPkgID,
            _o.verNum,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION PreferredPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PreferredPackageIdentifier */
/**
 * @summary The Leading Root Component Types of PreferredPackageIdentifier
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_PreferredPackageIdentifier: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'fwPkgID',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'verNum',
            false,
            $.hasTag(_TagClass.universal, 2),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_PreferredPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PreferredPackageIdentifier */
/**
 * @summary The Trailing Root Component Types of PreferredPackageIdentifier
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_PreferredPackageIdentifier: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_PreferredPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PreferredPackageIdentifier */
/**
 * @summary The Extension Addition Component Types of PreferredPackageIdentifier
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_PreferredPackageIdentifier: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_PreferredPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_PreferredPackageIdentifier */
let _cached_decoder_for_PreferredPackageIdentifier: $.ASN1Decoder<PreferredPackageIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_PreferredPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _decode_PreferredPackageIdentifier */
/**
 * @summary Decodes an ASN.1 element into a(n) PreferredPackageIdentifier
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {PreferredPackageIdentifier} The decoded data structure.
 */
export function _decode_PreferredPackageIdentifier(el: _Element) {
    if (!_cached_decoder_for_PreferredPackageIdentifier) {
        _cached_decoder_for_PreferredPackageIdentifier = function (
            el: _Element
        ): PreferredPackageIdentifier {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'PreferredPackageIdentifier contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'fwPkgID';
            sequence[1].name = 'verNum';
            let fwPkgID!: OBJECT_IDENTIFIER;
            let verNum!: INTEGER;
            fwPkgID = $._decodeObjectIdentifier(sequence[0]);
            verNum = $._decodeInteger(sequence[1]);
            return new PreferredPackageIdentifier(
                fwPkgID,
                verNum,
                sequence.slice(2)
            );
        };
    }
    return _cached_decoder_for_PreferredPackageIdentifier(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_PreferredPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_PreferredPackageIdentifier */
let _cached_encoder_for_PreferredPackageIdentifier: $.ASN1Encoder<PreferredPackageIdentifier> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_PreferredPackageIdentifier */

/* START_OF_SYMBOL_DEFINITION _encode_PreferredPackageIdentifier */
/**
 * @summary Encodes a(n) PreferredPackageIdentifier into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The PreferredPackageIdentifier, encoded as an ASN.1 Element.
 */
export function _encode_PreferredPackageIdentifier(
    value: PreferredPackageIdentifier,
    elGetter: $.ASN1Encoder<PreferredPackageIdentifier>
) {
    if (!_cached_encoder_for_PreferredPackageIdentifier) {
        _cached_encoder_for_PreferredPackageIdentifier = function (
            value: PreferredPackageIdentifier,
            elGetter: $.ASN1Encoder<PreferredPackageIdentifier>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeObjectIdentifier(
                                value.fwPkgID,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeInteger(
                                value.verNum,
                                $.BER
                            ),
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
    return _cached_encoder_for_PreferredPackageIdentifier(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_PreferredPackageIdentifier */

/* eslint-enable */
