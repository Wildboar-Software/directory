/* eslint-disable */
import {
    type DirectoryString,
    _decode_DirectoryString,
    _encode_DirectoryString,
} from '@wildboar/x500/SelectedAttributeTypes';
import {
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    BOOLEAN,
    OBJECT_IDENTIFIER,
    type OPTIONAL,
} from '@wildboar/asn1';
import * as $ from '@wildboar/asn1/functional';


/* START_OF_SYMBOL_DEFINITION MethodUseDescription */
/**
 * @summary MethodUseDescription
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * MethodUseDescription ::= SEQUENCE {
 *     identifier   OBJECT-CLASS.&id,
 *     name         SET OF DirectoryString{ub-schema} OPTIONAL,
 *     description  DirectoryString{ub-schema} OPTIONAL,
 *     obsolete     BOOLEAN DEFAULT FALSE,
 *     information  [0]  SET OF OBJECT IDENTIFIER
 * }
 * ```
 *
 * @class
 */
export class MethodUseDescription {
    constructor(
        /**
         * @summary `identifier`.
         * @public
         * @readonly
         */
        readonly identifier: OBJECT_IDENTIFIER,
        /**
         * @summary `name`.
         * @public
         * @readonly
         */
        readonly name: OPTIONAL<DirectoryString[]>,
        /**
         * @summary `description`.
         * @public
         * @readonly
         */
        readonly description: OPTIONAL<DirectoryString>,
        /**
         * @summary `obsolete`.
         * @public
         * @readonly
         */
        readonly obsolete: OPTIONAL<BOOLEAN>,
        /**
         * @summary `information`.
         * @public
         * @readonly
         */
        readonly information: OBJECT_IDENTIFIER[],
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a MethodUseDescription
     * @description
     *
     * This takes an `object` and converts it to a `MethodUseDescription`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `MethodUseDescription`.
     * @returns {MethodUseDescription}
     */
    public static _from_object(_o: {
        [_K in keyof MethodUseDescription]: MethodUseDescription[_K];
    }): MethodUseDescription {
        return new MethodUseDescription(
            _o.identifier,
            _o.name,
            _o.description,
            _o.obsolete,
            _o.information,
            _o._unrecognizedExtensionsList
        );
    }

    /**
     * @summary Getter that returns the default value for `obsolete`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_obsolete() {
        return false;
    }
}
/* END_OF_SYMBOL_DEFINITION MethodUseDescription */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MethodUseDescription */
/**
 * @summary The Leading Root Component Types of MethodUseDescription
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_MethodUseDescription: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'identifier',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'name',
            true,
            $.hasTag(_TagClass.universal, 17),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'description',
            true,
            $.or(
                $.hasTag(_TagClass.universal, 20),
                $.hasTag(_TagClass.universal, 19),
                $.hasTag(_TagClass.universal, 30),
                $.hasTag(_TagClass.universal, 28),
                $.hasTag(_TagClass.universal, 12)
            ),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'obsolete',
            true,
            $.hasTag(_TagClass.universal, 1),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'information',
            false,
            $.hasTag(_TagClass.context, 0),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_MethodUseDescription */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MethodUseDescription */
/**
 * @summary The Trailing Root Component Types of MethodUseDescription
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_MethodUseDescription: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_MethodUseDescription */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MethodUseDescription */
/**
 * @summary The Extension Addition Component Types of MethodUseDescription
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_MethodUseDescription: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_MethodUseDescription */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodUseDescription */
let _cached_decoder_for_MethodUseDescription: $.ASN1Decoder<MethodUseDescription> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_MethodUseDescription */

/* START_OF_SYMBOL_DEFINITION _decode_MethodUseDescription */
/**
 * @summary Decodes an ASN.1 element into a(n) MethodUseDescription
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {MethodUseDescription} The decoded data structure.
 */
export function _decode_MethodUseDescription(el: _Element) {
    if (!_cached_decoder_for_MethodUseDescription) {
        _cached_decoder_for_MethodUseDescription = function (
            el: _Element
        ): MethodUseDescription {
            /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            let identifier!: OBJECT_IDENTIFIER;
            let name: OPTIONAL<DirectoryString[]>;
            let description: OPTIONAL<DirectoryString>;
            let obsolete: OPTIONAL<BOOLEAN> =
                MethodUseDescription._default_value_for_obsolete;
            let information!: OBJECT_IDENTIFIER[];
            let _unrecognizedExtensionsList: _Element[] = [];
            /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
            /* START_OF_CALLBACKS_MAP */
            const callbacks: $.DecodingMap = {
                identifier: (_el: _Element): void => {
                    identifier = $._decodeObjectIdentifier(_el);
                },
                name: (_el: _Element): void => {
                    name = $._decodeSetOf<DirectoryString>(
                        () => _decode_DirectoryString
                    )(_el);
                },
                description: (_el: _Element): void => {
                    description = _decode_DirectoryString(_el);
                },
                obsolete: (_el: _Element): void => {
                    obsolete = $._decodeBoolean(_el);
                },
                information: (_el: _Element): void => {
                    information = $._decode_explicit<OBJECT_IDENTIFIER[]>(() =>
                        $._decodeSetOf<OBJECT_IDENTIFIER>(
                            () => $._decodeObjectIdentifier
                        )
                    )(_el);
                },
            };
            /* END_OF_CALLBACKS_MAP */
            $._parse_sequence(
                el,
                callbacks,
                _root_component_type_list_1_spec_for_MethodUseDescription,
                _extension_additions_list_spec_for_MethodUseDescription,
                _root_component_type_list_2_spec_for_MethodUseDescription,
                (ext: _Element): void => {
                    _unrecognizedExtensionsList.push(ext);
                }
            );
            return new MethodUseDescription /* SEQUENCE_CONSTRUCTOR_CALL */(
                identifier,
                name,
                description,
                obsolete,
                information,
                _unrecognizedExtensionsList
            );
        };
    }
    return _cached_decoder_for_MethodUseDescription(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_MethodUseDescription */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodUseDescription */
let _cached_encoder_for_MethodUseDescription: $.ASN1Encoder<MethodUseDescription> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_MethodUseDescription */

/* START_OF_SYMBOL_DEFINITION _encode_MethodUseDescription */
/**
 * @summary Encodes a(n) MethodUseDescription into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The MethodUseDescription, encoded as an ASN.1 Element.
 */
export function _encode_MethodUseDescription(
    value: MethodUseDescription,
    elGetter: $.ASN1Encoder<MethodUseDescription>
) {
    if (!_cached_encoder_for_MethodUseDescription) {
        _cached_encoder_for_MethodUseDescription = function (
            value: MethodUseDescription,
            elGetter: $.ASN1Encoder<MethodUseDescription>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeObjectIdentifier(
                                value.identifier,
                                $.BER
                            ),
                            /* IF_ABSENT  */ value.name === undefined
                                ? undefined
                                : $._encodeSetOf<DirectoryString>(
                                      () => _encode_DirectoryString,
                                      $.BER
                                  )(value.name, $.BER),
                            /* IF_ABSENT  */ value.description === undefined
                                ? undefined
                                : _encode_DirectoryString(
                                      value.description,
                                      $.BER
                                  ),
                            /* IF_DEFAULT */ value.obsolete === undefined ||
                            $.deepEq(
                                value.obsolete,
                                MethodUseDescription._default_value_for_obsolete
                            )
                                ? undefined
                                : $._encodeBoolean(value.obsolete, $.BER),
                            /* REQUIRED   */ $._encode_explicit(
                                _TagClass.context,
                                0,
                                () =>
                                    $._encodeSetOf<OBJECT_IDENTIFIER>(
                                        () => $._encodeObjectIdentifier,
                                        $.BER
                                    ),
                                $.BER
                            )(value.information, $.BER),
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
    return _cached_encoder_for_MethodUseDescription(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_MethodUseDescription */

/* eslint-enable */
