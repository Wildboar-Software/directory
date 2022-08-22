/* eslint-disable */
import {
    itu_t,
    itu_r,
    ccitt,
    iso,
    joint_iso_itu_t,
    joint_iso_ccitt,
    OPTIONAL,
    BOOLEAN,
    INTEGER,
    BIT_STRING,
    OCTET_STRING,
    NULL,
    OBJECT_IDENTIFIER,
    ObjectDescriptor,
    EXTERNAL,
    REAL,
    INSTANCE_OF,
    ENUMERATED,
    EMBEDDED_PDV,
    UTF8String,
    RELATIVE_OID,
    SEQUENCE,
    SEQUENCE_OF,
    SET,
    SET_OF,
    GraphicString,
    NumericString,
    VisibleString,
    PrintableString,
    ISO646String,
    TeletexString,
    GeneralString,
    T61String,
    UniversalString,
    VideotexString,
    BMPString,
    IA5String,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    TIME,
    DATE,
    TIME_OF_DAY,
    DATE_TIME,
    DURATION,
    OID_IRI,
    RELATIVE_OID_IRI,
    TRUE,
    FALSE,
    TRUE_BIT,
    FALSE_BIT,
    PLUS_INFINITY,
    MINUS_INFINITY,
    NOT_A_NUMBER,
    TYPE_IDENTIFIER,
    ABSTRACT_SYNTAX,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass,
    ASN1Construction as _Construction,
    ASN1UniversalType as _UniversalType,
    ObjectIdentifier as _OID,
    External as _External,
    EmbeddedPDV as _PDV,
    ASN1ConstructionError as _ConstructionError,
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { ObjectOperations, ObjectOperations_read /* IMPORTED_LONG_NAMED_BIT */, read /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_add /* IMPORTED_LONG_NAMED_BIT */, add /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_modify /* IMPORTED_LONG_NAMED_BIT */, modify /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_delete_ /* IMPORTED_LONG_NAMED_BIT */, delete_ /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_rename /* IMPORTED_LONG_NAMED_BIT */, rename /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_discloseOnError /* IMPORTED_LONG_NAMED_BIT */, discloseOnError /* IMPORTED_SHORT_NAMED_BIT */, _decode_ObjectOperations, _encode_ObjectOperations } from "../OtherImplicitlyTaggedTypes/ObjectOperations.ta";
export { ObjectOperations, ObjectOperations_read /* IMPORTED_LONG_NAMED_BIT */, read /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_add /* IMPORTED_LONG_NAMED_BIT */, add /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_modify /* IMPORTED_LONG_NAMED_BIT */, modify /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_delete_ /* IMPORTED_LONG_NAMED_BIT */, delete_ /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_rename /* IMPORTED_LONG_NAMED_BIT */, rename /* IMPORTED_SHORT_NAMED_BIT */, ObjectOperations_discloseOnError /* IMPORTED_LONG_NAMED_BIT */, discloseOnError /* IMPORTED_SHORT_NAMED_BIT */, _decode_ObjectOperations, _encode_ObjectOperations } from "../OtherImplicitlyTaggedTypes/ObjectOperations.ta";
import { AttributeSel, _decode_AttributeSel, _encode_AttributeSel } from "../OtherImplicitlyTaggedTypes/AttributeSel.ta";
export { AttributeSel, _decode_AttributeSel, _encode_AttributeSel } from "../OtherImplicitlyTaggedTypes/AttributeSel.ta";


/* START_OF_SYMBOL_DEFINITION TargetSelect */
/**
 * @summary TargetSelect
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * TargetSelect ::= SEQUENCE {
 *   objOper   ObjectOperations OPTIONAL,
 *   attrSel   AttributeSel     OPTIONAL,
 *   ... }
 *   (WITH COMPONENTS {..., objOper  PRESENT } |
 *    WITH COMPONENTS {..., attrSel  PRESENT } )
 * ```
 * 
 * @class
 */
export
class TargetSelect {
    constructor (
        /**
         * @summary `objOper`.
         * @public
         * @readonly
         */
        readonly objOper: OPTIONAL<ObjectOperations>,
        /**
         * @summary `attrSel`.
         * @public
         * @readonly
         */
        readonly attrSel: OPTIONAL<AttributeSel>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a TargetSelect
     * @description
     * 
     * This takes an `object` and converts it to a `TargetSelect`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `TargetSelect`.
     * @returns {TargetSelect}
     */
    public static _from_object (_o: { [_K in keyof (TargetSelect)]: (TargetSelect)[_K] }): TargetSelect {
        return new TargetSelect(_o.objOper, _o.attrSel, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION TargetSelect */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_TargetSelect */
/**
 * @summary The Leading Root Component Types of TargetSelect
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_TargetSelect: $.ComponentSpec[] = [
    new $.ComponentSpec("objOper", true, $.hasTag(_TagClass.universal, 3), undefined, undefined),
    new $.ComponentSpec("attrSel", true, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_TargetSelect */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_TargetSelect */
/**
 * @summary The Trailing Root Component Types of TargetSelect
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_TargetSelect: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_TargetSelect */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_TargetSelect */
/**
 * @summary The Extension Addition Component Types of TargetSelect
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_TargetSelect: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_TargetSelect */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_TargetSelect */
let _cached_decoder_for_TargetSelect: $.ASN1Decoder<TargetSelect> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_TargetSelect */

/* START_OF_SYMBOL_DEFINITION _decode_TargetSelect */
/**
 * @summary Decodes an ASN.1 element into a(n) TargetSelect
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {TargetSelect} The decoded data structure.
 */
export
function _decode_TargetSelect (el: _Element) {
    if (!_cached_decoder_for_TargetSelect) { _cached_decoder_for_TargetSelect = function (el: _Element): TargetSelect {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let objOper: OPTIONAL<ObjectOperations>;
    let attrSel: OPTIONAL<AttributeSel>;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "objOper": (_el: _Element): void => { objOper = _decode_ObjectOperations(_el); },
        "attrSel": (_el: _Element): void => { attrSel = _decode_AttributeSel(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_TargetSelect,
        _extension_additions_list_spec_for_TargetSelect,
        _root_component_type_list_2_spec_for_TargetSelect,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new TargetSelect( /* SEQUENCE_CONSTRUCTOR_CALL */
        objOper,
        attrSel,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_TargetSelect(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_TargetSelect */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_TargetSelect */
let _cached_encoder_for_TargetSelect: $.ASN1Encoder<TargetSelect> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_TargetSelect */

/* START_OF_SYMBOL_DEFINITION _encode_TargetSelect */
/**
 * @summary Encodes a(n) TargetSelect into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The TargetSelect, encoded as an ASN.1 Element.
 */
export
function _encode_TargetSelect (value: TargetSelect, elGetter: $.ASN1Encoder<TargetSelect>) {
    if (!_cached_encoder_for_TargetSelect) { _cached_encoder_for_TargetSelect = function (value: TargetSelect, elGetter: $.ASN1Encoder<TargetSelect>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.objOper === undefined) ? undefined : _encode_ObjectOperations(value.objOper, $.BER)),
            /* IF_ABSENT  */ ((value.attrSel === undefined) ? undefined : _encode_AttributeSel(value.attrSel, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_TargetSelect(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_TargetSelect */

/* eslint-enable */
