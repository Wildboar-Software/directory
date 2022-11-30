/* eslint-disable */
import {
    ASN1ConstructionError as _ConstructionError,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    OBJECT_IDENTIFIER,
} from 'asn1-ts';
import * as $ from 'asn1-ts/dist/node/functional';
import {
    ObjectSel,
    _decode_ObjectSel,
    _encode_ObjectSel,
} from '../OtherImplicitlyTaggedTypes/ObjectSel.ta';
export {
    ObjectSel,
    _decode_ObjectSel,
    _encode_ObjectSel,
} from '../OtherImplicitlyTaggedTypes/ObjectSel.ta';

/* START_OF_SYMBOL_DEFINITION AccessService */
/**
 * @summary AccessService
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * AccessService ::= SEQUENCE {
 *   serviceId          OBJECT IDENTIFIER,
 *   objectDef          SEQUENCE SIZE (1..MAX) OF ObjectSel,
 *   ... }
 * ```
 *
 * @class
 */
export class AccessService {
    constructor(
        /**
         * @summary `serviceId`.
         * @public
         * @readonly
         */
        readonly serviceId: OBJECT_IDENTIFIER,
        /**
         * @summary `objectDef`.
         * @public
         * @readonly
         */
        readonly objectDef: ObjectSel[],
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a AccessService
     * @description
     *
     * This takes an `object` and converts it to a `AccessService`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `AccessService`.
     * @returns {AccessService}
     */
    public static _from_object(_o: {
        [_K in keyof AccessService]: AccessService[_K];
    }): AccessService {
        return new AccessService(
            _o.serviceId,
            _o.objectDef,
            _o._unrecognizedExtensionsList
        );
    }
}
/* END_OF_SYMBOL_DEFINITION AccessService */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AccessService */
/**
 * @summary The Leading Root Component Types of AccessService
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_1_spec_for_AccessService: $.ComponentSpec[] =
    [
        new $.ComponentSpec(
            'serviceId',
            false,
            $.hasTag(_TagClass.universal, 6),
            undefined,
            undefined
        ),
        new $.ComponentSpec(
            'objectDef',
            false,
            $.hasTag(_TagClass.universal, 16),
            undefined,
            undefined
        ),
    ];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_AccessService */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AccessService */
/**
 * @summary The Trailing Root Component Types of AccessService
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _root_component_type_list_2_spec_for_AccessService: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_AccessService */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AccessService */
/**
 * @summary The Extension Addition Component Types of AccessService
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export const _extension_additions_list_spec_for_AccessService: $.ComponentSpec[] =
    [];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_AccessService */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_AccessService */
let _cached_decoder_for_AccessService: $.ASN1Decoder<AccessService> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_AccessService */

/* START_OF_SYMBOL_DEFINITION _decode_AccessService */
/**
 * @summary Decodes an ASN.1 element into a(n) AccessService
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {AccessService} The decoded data structure.
 */
export function _decode_AccessService(el: _Element) {
    if (!_cached_decoder_for_AccessService) {
        _cached_decoder_for_AccessService = function (
            el: _Element
        ): AccessService {
            const sequence: _Element[] = el.sequence;
            if (sequence.length < 2) {
                throw new _ConstructionError(
                    'AccessService contained only ' +
                        sequence.length.toString() +
                        ' elements.'
                );
            }
            sequence[0].name = 'serviceId';
            sequence[1].name = 'objectDef';
            let serviceId!: OBJECT_IDENTIFIER;
            let objectDef!: ObjectSel[];
            serviceId = $._decodeObjectIdentifier(sequence[0]);
            objectDef = $._decodeSequenceOf<ObjectSel>(() => _decode_ObjectSel)(
                sequence[1]
            );
            return new AccessService(serviceId, objectDef, sequence.slice(2));
        };
    }
    return _cached_decoder_for_AccessService(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_AccessService */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_AccessService */
let _cached_encoder_for_AccessService: $.ASN1Encoder<AccessService> | null =
    null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_AccessService */

/* START_OF_SYMBOL_DEFINITION _encode_AccessService */
/**
 * @summary Encodes a(n) AccessService into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The AccessService, encoded as an ASN.1 Element.
 */
export function _encode_AccessService(
    value: AccessService,
    elGetter: $.ASN1Encoder<AccessService>
) {
    if (!_cached_encoder_for_AccessService) {
        _cached_encoder_for_AccessService = function (
            value: AccessService,
            elGetter: $.ASN1Encoder<AccessService>
        ): _Element {
            return $._encodeSequence(
                ([] as (_Element | undefined)[])
                    .concat(
                        [
                            /* REQUIRED   */ $._encodeObjectIdentifier(
                                value.serviceId,
                                $.BER
                            ),
                            /* REQUIRED   */ $._encodeSequenceOf<ObjectSel>(
                                () => _encode_ObjectSel,
                                $.BER
                            )(value.objectDef, $.BER),
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
    return _cached_encoder_for_AccessService(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_AccessService */

/* eslint-enable */
