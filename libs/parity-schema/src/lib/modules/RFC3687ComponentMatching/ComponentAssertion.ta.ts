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
import { ComponentReference, _decode_ComponentReference, _encode_ComponentReference } from "../RFC3687ComponentMatching/ComponentReference.ta";
export { ComponentReference, _decode_ComponentReference, _encode_ComponentReference } from "../RFC3687ComponentMatching/ComponentReference.ta";
import { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";
export { MATCHING_RULE } from "@wildboar/x500/src/lib/modules/InformationFramework/MATCHING-RULE.oca";


/* START_OF_SYMBOL_DEFINITION ComponentAssertion */
/**
 * @summary ComponentAssertion
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ComponentAssertion ::= SEQUENCE {
 *     component         ComponentReference (SIZE(1..MAX)) OPTIONAL,
 *     useDefaultValues  BOOLEAN DEFAULT TRUE,
 *     rule              MATCHING-RULE.&id,
 *     value             MATCHING-RULE.&AssertionType,
 *     ...
 * }
 * ```
 * 
 * @class
 */
export
class ComponentAssertion {
    constructor (
        /**
         * @summary `component`.
         * @public
         * @readonly
         */
        readonly component: OPTIONAL<ComponentReference>,
        /**
         * @summary `useDefaultValues`.
         * @public
         * @readonly
         */
        readonly useDefaultValues: OPTIONAL<BOOLEAN>,
        /**
         * @summary `rule`.
         * @public
         * @readonly
         */
        readonly rule: OBJECT_IDENTIFIER,
        /**
         * @summary `value`.
         * @public
         * @readonly
         */
        readonly value: _Element,
        /**
         * @summary Extensions that are not recognized.
         * @public
         * @readonly
         */
        readonly _unrecognizedExtensionsList: _Element[] = []
    ) {}

    /**
     * @summary Restructures an object into a ComponentAssertion
     * @description
     * 
     * This takes an `object` and converts it to a `ComponentAssertion`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ComponentAssertion`.
     * @returns {ComponentAssertion}
     */
    public static _from_object (_o: { [_K in keyof (ComponentAssertion)]: (ComponentAssertion)[_K] }): ComponentAssertion {
        return new ComponentAssertion(_o.component, _o.useDefaultValues, _o.rule, _o.value, _o._unrecognizedExtensionsList);
    }

    /**
     * @summary Getter that returns the default value for `useDefaultValues`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_useDefaultValues () { return true; }
}
/* END_OF_SYMBOL_DEFINITION ComponentAssertion */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ComponentAssertion */
/**
 * @summary The Leading Root Component Types of ComponentAssertion
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_ComponentAssertion: $.ComponentSpec[] = [
    new $.ComponentSpec("component", true, $.hasTag(_TagClass.universal, 12), undefined, undefined),
    new $.ComponentSpec("useDefaultValues", true, $.hasTag(_TagClass.universal, 1), undefined, undefined),
    new $.ComponentSpec("rule", false, $.hasTag(_TagClass.universal, 6), undefined, undefined),
    new $.ComponentSpec("value", false, $.hasAnyTag, undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ComponentAssertion */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ComponentAssertion */
/**
 * @summary The Trailing Root Component Types of ComponentAssertion
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_ComponentAssertion: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ComponentAssertion */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ComponentAssertion */
/**
 * @summary The Extension Addition Component Types of ComponentAssertion
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_ComponentAssertion: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ComponentAssertion */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentAssertion */
let _cached_decoder_for_ComponentAssertion: $.ASN1Decoder<ComponentAssertion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ComponentAssertion */

/* START_OF_SYMBOL_DEFINITION _decode_ComponentAssertion */
/**
 * @summary Decodes an ASN.1 element into a(n) ComponentAssertion
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ComponentAssertion} The decoded data structure.
 */
export
function _decode_ComponentAssertion (el: _Element) {
    if (!_cached_decoder_for_ComponentAssertion) { _cached_decoder_for_ComponentAssertion = function (el: _Element): ComponentAssertion {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let component: OPTIONAL<ComponentReference>;
    let useDefaultValues: OPTIONAL<BOOLEAN> = ComponentAssertion._default_value_for_useDefaultValues;
    let rule!: OBJECT_IDENTIFIER;
    let value!: _Element;
    let _unrecognizedExtensionsList: _Element[] = [];
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "component": (_el: _Element): void => { component = _decode_ComponentReference(_el); },
        "useDefaultValues": (_el: _Element): void => { useDefaultValues = $._decodeBoolean(_el); },
        "rule": (_el: _Element): void => { rule = $._decodeObjectIdentifier(_el); },
        "value": (_el: _Element): void => { value = $._decodeAny(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_ComponentAssertion,
        _extension_additions_list_spec_for_ComponentAssertion,
        _root_component_type_list_2_spec_for_ComponentAssertion,
        (ext: _Element): void => { _unrecognizedExtensionsList.push(ext); },
    );
    return new ComponentAssertion( /* SEQUENCE_CONSTRUCTOR_CALL */
        component,
        useDefaultValues,
        rule,
        value,
        _unrecognizedExtensionsList
    );
}; }
    return _cached_decoder_for_ComponentAssertion(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ComponentAssertion */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentAssertion */
let _cached_encoder_for_ComponentAssertion: $.ASN1Encoder<ComponentAssertion> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ComponentAssertion */

/* START_OF_SYMBOL_DEFINITION _encode_ComponentAssertion */
/**
 * @summary Encodes a(n) ComponentAssertion into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ComponentAssertion, encoded as an ASN.1 Element.
 */
export
function _encode_ComponentAssertion (value: ComponentAssertion, elGetter: $.ASN1Encoder<ComponentAssertion>) {
    if (!_cached_encoder_for_ComponentAssertion) { _cached_encoder_for_ComponentAssertion = function (value: ComponentAssertion, elGetter: $.ASN1Encoder<ComponentAssertion>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_ABSENT  */ ((value.component === undefined) ? undefined : _encode_ComponentReference(value.component, $.BER)),
            /* IF_DEFAULT */ (value.useDefaultValues === undefined || $.deepEq(value.useDefaultValues, ComponentAssertion._default_value_for_useDefaultValues) ? undefined : $._encodeBoolean(value.useDefaultValues, $.BER)),
            /* REQUIRED   */ $._encodeObjectIdentifier(value.rule, $.BER),
            /* REQUIRED   */ $._encodeAny(value.value, $.BER)
        ],
        (value._unrecognizedExtensionsList ? value._unrecognizedExtensionsList : []),
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_ComponentAssertion(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ComponentAssertion */

/* eslint-enable */
