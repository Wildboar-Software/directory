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
import { ClassList, ClassList_unmarked /* IMPORTED_LONG_NAMED_BIT */, unmarked /* IMPORTED_SHORT_NAMED_BIT */, ClassList_unclassified /* IMPORTED_LONG_NAMED_BIT */, unclassified /* IMPORTED_SHORT_NAMED_BIT */, ClassList_restricted /* IMPORTED_LONG_NAMED_BIT */, restricted /* IMPORTED_SHORT_NAMED_BIT */, ClassList_confidential /* IMPORTED_LONG_NAMED_BIT */, confidential /* IMPORTED_SHORT_NAMED_BIT */, ClassList_secret /* IMPORTED_LONG_NAMED_BIT */, secret /* IMPORTED_SHORT_NAMED_BIT */, ClassList_topSecret /* IMPORTED_LONG_NAMED_BIT */, topSecret /* IMPORTED_SHORT_NAMED_BIT */, _decode_ClassList, _encode_ClassList } from "../OtherImplicitlyTaggedTypes/ClassList.ta";
export { ClassList, ClassList_unmarked /* IMPORTED_LONG_NAMED_BIT */, unmarked /* IMPORTED_SHORT_NAMED_BIT */, ClassList_unclassified /* IMPORTED_LONG_NAMED_BIT */, unclassified /* IMPORTED_SHORT_NAMED_BIT */, ClassList_restricted /* IMPORTED_LONG_NAMED_BIT */, restricted /* IMPORTED_SHORT_NAMED_BIT */, ClassList_confidential /* IMPORTED_LONG_NAMED_BIT */, confidential /* IMPORTED_SHORT_NAMED_BIT */, ClassList_secret /* IMPORTED_LONG_NAMED_BIT */, secret /* IMPORTED_SHORT_NAMED_BIT */, ClassList_topSecret /* IMPORTED_LONG_NAMED_BIT */, topSecret /* IMPORTED_SHORT_NAMED_BIT */, _decode_ClassList, _encode_ClassList } from "../OtherImplicitlyTaggedTypes/ClassList.ta";
import { SecurityCategory_rfc3281, _decode_SecurityCategory_rfc3281, _encode_SecurityCategory_rfc3281 } from "../OtherImplicitlyTaggedTypes/SecurityCategory-rfc3281.ta";
export { SecurityCategory_rfc3281, _decode_SecurityCategory_rfc3281, _encode_SecurityCategory_rfc3281 } from "../OtherImplicitlyTaggedTypes/SecurityCategory-rfc3281.ta";


/* START_OF_SYMBOL_DEFINITION Clearance_rfc3281 */
/**
 * @summary Clearance_rfc3281
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * Clearance-rfc3281 ::= SEQUENCE {
 *     policyId            [0] OBJECT IDENTIFIER,
 *     classList            [1] ClassList DEFAULT {unclassified},
 *     securityCategories    [2] SET OF SecurityCategory-rfc3281{{SupportedSecurityCategories}} OPTIONAL
 * }
 * ```
 * 
 * @class
 */
export
class Clearance_rfc3281 {
    constructor (
        /**
         * @summary `policyId`.
         * @public
         * @readonly
         */
        readonly policyId: OBJECT_IDENTIFIER,
        /**
         * @summary `classList`.
         * @public
         * @readonly
         */
        readonly classList: OPTIONAL<ClassList>,
        /**
         * @summary `securityCategories`.
         * @public
         * @readonly
         */
        readonly securityCategories: OPTIONAL<SecurityCategory_rfc3281[]>,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a Clearance_rfc3281
     * @description
     * 
     * This takes an `object` and converts it to a `Clearance_rfc3281`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `Clearance_rfc3281`.
     * @returns {Clearance_rfc3281}
     */
    public static _from_object (_o: { [_K in keyof (Clearance_rfc3281)]: (Clearance_rfc3281)[_K] }): Clearance_rfc3281 {
        return new Clearance_rfc3281(_o.policyId, _o.classList, _o.securityCategories, _o._unrecognizedExtensionsList);
    }

    /**
     * @summary Getter that returns the default value for `classList`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_classList () { return (() => { const _ret = new Uint8ClampedArray(Math.max(0, 1, 2, 3, 4, 5)); _ret[ClassList_unclassified] = TRUE_BIT;return _ret; })(); }
}
/* END_OF_SYMBOL_DEFINITION Clearance_rfc3281 */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_Clearance_rfc3281 */
/**
 * @summary The Leading Root Component Types of Clearance_rfc3281
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_Clearance_rfc3281: $.ComponentSpec[] = [
    new $.ComponentSpec("policyId", false, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("classList", true, $.hasTag(_TagClass.context, 1), undefined, undefined),
    new $.ComponentSpec("securityCategories", true, $.hasTag(_TagClass.context, 2), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_Clearance_rfc3281 */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_Clearance_rfc3281 */
/**
 * @summary The Trailing Root Component Types of Clearance_rfc3281
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_Clearance_rfc3281: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_Clearance_rfc3281 */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_Clearance_rfc3281 */
/**
 * @summary The Extension Addition Component Types of Clearance_rfc3281
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_Clearance_rfc3281: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_Clearance_rfc3281 */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_Clearance_rfc3281 */
let _cached_decoder_for_Clearance_rfc3281: $.ASN1Decoder<Clearance_rfc3281> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_Clearance_rfc3281 */

/* START_OF_SYMBOL_DEFINITION _decode_Clearance_rfc3281 */
/**
 * @summary Decodes an ASN.1 element into a(n) Clearance_rfc3281
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {Clearance_rfc3281} The decoded data structure.
 */
export
function _decode_Clearance_rfc3281 (el: _Element) {
    if (!_cached_decoder_for_Clearance_rfc3281) { _cached_decoder_for_Clearance_rfc3281 = function (el: _Element): Clearance_rfc3281 {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let policyId!: OBJECT_IDENTIFIER;
    let classList: OPTIONAL<ClassList> = Clearance_rfc3281._default_value_for_classList;
    let securityCategories: OPTIONAL<SecurityCategory_rfc3281[]>;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "policyId": (_el: _Element): void => { policyId = $._decode_implicit<OBJECT_IDENTIFIER>(() => $._decodeObjectIdentifier)(_el); },
        "classList": (_el: _Element): void => { classList = $._decode_implicit<ClassList>(() => _decode_ClassList)(_el); },
        "securityCategories": (_el: _Element): void => { securityCategories = $._decode_implicit<SecurityCategory_rfc3281[]>(() => $._decodeSetOf<SecurityCategory_rfc3281>(() => _decode_SecurityCategory_rfc3281))(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_Clearance_rfc3281,
        _extension_additions_list_spec_for_Clearance_rfc3281,
        _root_component_type_list_2_spec_for_Clearance_rfc3281,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new Clearance_rfc3281( /* SEQUENCE_CONSTRUCTOR_CALL */
        policyId,
        classList,
        securityCategories,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_Clearance_rfc3281(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_Clearance_rfc3281 */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_Clearance_rfc3281 */
let _cached_encoder_for_Clearance_rfc3281: $.ASN1Encoder<Clearance_rfc3281> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_Clearance_rfc3281 */

/* START_OF_SYMBOL_DEFINITION _encode_Clearance_rfc3281 */
/**
 * @summary Encodes a(n) Clearance_rfc3281 into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The Clearance_rfc3281, encoded as an ASN.1 Element.
 */
export
function _encode_Clearance_rfc3281 (value: Clearance_rfc3281, elGetter: $.ASN1Encoder<Clearance_rfc3281>) {
    if (!_cached_encoder_for_Clearance_rfc3281) { _cached_encoder_for_Clearance_rfc3281 = function (value: Clearance_rfc3281, elGetter: $.ASN1Encoder<Clearance_rfc3281>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ $._encode_implicit(_TagClass.context, 0, () => $._encodeObjectIdentifier, $.BER)(value.policyId, $.BER),
            /* IF_DEFAULT */ (value.classList === undefined || $.deepEq(value.classList, Clearance_rfc3281._default_value_for_classList) ? undefined : $._encode_implicit(_TagClass.context, 1, () => _encode_ClassList, $.BER)(value.classList, $.BER)),
            /* IF_ABSENT  */ ((value.securityCategories === undefined) ? undefined : $._encode_implicit(_TagClass.context, 2, () => $._encodeSetOf<SecurityCategory_rfc3281>(() => _encode_SecurityCategory_rfc3281, $.BER), $.BER)(value.securityCategories, $.BER))
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_Clearance_rfc3281(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_Clearance_rfc3281 */

/* eslint-enable */
