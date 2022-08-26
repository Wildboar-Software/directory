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
import { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";
export { GeneralNames, _decode_GeneralNames, _encode_GeneralNames } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralNames.ta";
import { IetfAttrSyntax_values_Item, _decode_IetfAttrSyntax_values_Item, _encode_IetfAttrSyntax_values_Item } from "../OtherImplicitlyTaggedTypes/IetfAttrSyntax-values-Item.ta";
export { IetfAttrSyntax_values_Item, _decode_IetfAttrSyntax_values_Item, _encode_IetfAttrSyntax_values_Item } from "../OtherImplicitlyTaggedTypes/IetfAttrSyntax-values-Item.ta";


/* START_OF_SYMBOL_DEFINITION IetfAttrSyntax */
/**
 * @summary IetfAttrSyntax
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * IetfAttrSyntax ::= SEQUENCE {
 *     policyAuthority        [0] GeneralNames    OPTIONAL,
 *     values                SEQUENCE OF CHOICE {
 *         octets    OCTET STRING,
 *         oid    OBJECT IDENTIFIER,
 *         string    UTF8String
 *     }
 * }
 * ```
 * 
 * @class
 */
export
class IetfAttrSyntax {
    constructor (
        /**
         * @summary `policyAuthority`.
         * @public
         * @readonly
         */
        readonly policyAuthority: OPTIONAL<GeneralNames>,
        /**
         * @summary `values`.
         * @public
         * @readonly
         */
        readonly values: IetfAttrSyntax_values_Item[],
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a IetfAttrSyntax
     * @description
     * 
     * This takes an `object` and converts it to a `IetfAttrSyntax`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `IetfAttrSyntax`.
     * @returns {IetfAttrSyntax}
     */
    public static _from_object (_o: { [_K in keyof (IetfAttrSyntax)]: (IetfAttrSyntax)[_K] }): IetfAttrSyntax {
        return new IetfAttrSyntax(_o.policyAuthority, _o.values, _o._unrecognizedExtensionsList);
    }


}
/* END_OF_SYMBOL_DEFINITION IetfAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_IetfAttrSyntax */
/**
 * @summary The Leading Root Component Types of IetfAttrSyntax
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_IetfAttrSyntax: $.ComponentSpec[] = [
    new $.ComponentSpec("policyAuthority", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("values", false, $.hasTag(_TagClass.universal, 16), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_IetfAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_IetfAttrSyntax */
/**
 * @summary The Trailing Root Component Types of IetfAttrSyntax
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_IetfAttrSyntax: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_IetfAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_IetfAttrSyntax */
/**
 * @summary The Extension Addition Component Types of IetfAttrSyntax
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_IetfAttrSyntax: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_IetfAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_IetfAttrSyntax */
let _cached_decoder_for_IetfAttrSyntax: $.ASN1Decoder<IetfAttrSyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_IetfAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _decode_IetfAttrSyntax */
/**
 * @summary Decodes an ASN.1 element into a(n) IetfAttrSyntax
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {IetfAttrSyntax} The decoded data structure.
 */
export
function _decode_IetfAttrSyntax (el: _Element) {
    if (!_cached_decoder_for_IetfAttrSyntax) { _cached_decoder_for_IetfAttrSyntax = function (el: _Element): IetfAttrSyntax {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let policyAuthority: OPTIONAL<GeneralNames>;
    let values!: IetfAttrSyntax_values_Item[];
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "policyAuthority": (_el: _Element): void => { policyAuthority = $._decode_implicit<GeneralNames>(() => _decode_GeneralNames)(_el); },
        "values": (_el: _Element): void => { values = $._decodeSequenceOf<IetfAttrSyntax_values_Item>(() => _decode_IetfAttrSyntax_values_Item)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_IetfAttrSyntax,
        _extension_additions_list_spec_for_IetfAttrSyntax,
        _root_component_type_list_2_spec_for_IetfAttrSyntax,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new IetfAttrSyntax( /* SEQUENCE_CONSTRUCTOR_CALL */
        policyAuthority,
        values,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_IetfAttrSyntax(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_IetfAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_IetfAttrSyntax */
let _cached_encoder_for_IetfAttrSyntax: $.ASN1Encoder<IetfAttrSyntax> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_IetfAttrSyntax */

/* START_OF_SYMBOL_DEFINITION _encode_IetfAttrSyntax */
/**
 * @summary Encodes a(n) IetfAttrSyntax into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The IetfAttrSyntax, encoded as an ASN.1 Element.
 */
export
function _encode_IetfAttrSyntax (value: IetfAttrSyntax, elGetter: $.ASN1Encoder<IetfAttrSyntax>) {
    if (!_cached_encoder_for_IetfAttrSyntax) { _cached_encoder_for_IetfAttrSyntax = function (value: IetfAttrSyntax, elGetter: $.ASN1Encoder<IetfAttrSyntax>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.policyAuthority === undefined) ? undefined : $._encode_implicit(_TagClass.context, 0, () => _encode_GeneralNames, $.BER)(value.policyAuthority, $.BER)),
            /* REQUIRED   */ $._encodeSequenceOf<IetfAttrSyntax_values_Item>(() => _encode_IetfAttrSyntax_values_Item, $.BER)(value.values, $.BER)
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_IetfAttrSyntax(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_IetfAttrSyntax */

/* eslint-enable */
