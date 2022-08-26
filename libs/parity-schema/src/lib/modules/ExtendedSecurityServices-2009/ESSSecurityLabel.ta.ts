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
import { SecurityPolicyIdentifier, _decode_SecurityPolicyIdentifier, _encode_SecurityPolicyIdentifier } from "../ExtendedSecurityServices-2009/SecurityPolicyIdentifier.ta";
export { SecurityPolicyIdentifier, _decode_SecurityPolicyIdentifier, _encode_SecurityPolicyIdentifier } from "../ExtendedSecurityServices-2009/SecurityPolicyIdentifier.ta";
import { SecurityClassification, SecurityClassification_unmarked /* IMPORTED_LONG_NAMED_INTEGER */, unmarked /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_unclassified /* IMPORTED_LONG_NAMED_INTEGER */, unclassified /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_restricted /* IMPORTED_LONG_NAMED_INTEGER */, restricted /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_confidential /* IMPORTED_LONG_NAMED_INTEGER */, confidential /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_secret /* IMPORTED_LONG_NAMED_INTEGER */, secret /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_top_secret /* IMPORTED_LONG_NAMED_INTEGER */, top_secret /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_SecurityClassification, _encode_SecurityClassification } from "../ExtendedSecurityServices-2009/SecurityClassification.ta";
export { SecurityClassification, SecurityClassification_unmarked /* IMPORTED_LONG_NAMED_INTEGER */, unmarked /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_unclassified /* IMPORTED_LONG_NAMED_INTEGER */, unclassified /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_restricted /* IMPORTED_LONG_NAMED_INTEGER */, restricted /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_confidential /* IMPORTED_LONG_NAMED_INTEGER */, confidential /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_secret /* IMPORTED_LONG_NAMED_INTEGER */, secret /* IMPORTED_SHORT_NAMED_INTEGER */, SecurityClassification_top_secret /* IMPORTED_LONG_NAMED_INTEGER */, top_secret /* IMPORTED_SHORT_NAMED_INTEGER */, _decode_SecurityClassification, _encode_SecurityClassification } from "../ExtendedSecurityServices-2009/SecurityClassification.ta";
import { ESSPrivacyMark, _decode_ESSPrivacyMark, _encode_ESSPrivacyMark } from "../ExtendedSecurityServices-2009/ESSPrivacyMark.ta";
export { ESSPrivacyMark, _decode_ESSPrivacyMark, _encode_ESSPrivacyMark } from "../ExtendedSecurityServices-2009/ESSPrivacyMark.ta";
import { SecurityCategories, _decode_SecurityCategories, _encode_SecurityCategories } from "../ExtendedSecurityServices-2009/SecurityCategories.ta";
export { SecurityCategories, _decode_SecurityCategories, _encode_SecurityCategories } from "../ExtendedSecurityServices-2009/SecurityCategories.ta";


/* START_OF_SYMBOL_DEFINITION ESSSecurityLabel */
/**
 * @summary ESSSecurityLabel
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * ESSSecurityLabel ::= SET {
 *     security-policy-identifier SecurityPolicyIdentifier,
 *     security-classification SecurityClassification OPTIONAL,
 *     privacy-mark ESSPrivacyMark OPTIONAL,
 *     security-categories SecurityCategories OPTIONAL }
 * ```
 * 
 * @class
 */
export
class ESSSecurityLabel {
    constructor (
        /**
         * @summary `security_policy_identifier`.
         * @public
         * @readonly
         */
        readonly security_policy_identifier: SecurityPolicyIdentifier,
        /**
         * @summary `security_classification`.
         * @public
         * @readonly
         */
        readonly security_classification: OPTIONAL<SecurityClassification>,
        /**
         * @summary `privacy_mark`.
         * @public
         * @readonly
         */
        readonly privacy_mark: OPTIONAL<ESSPrivacyMark>,
        /**
         * @summary `security_categories`.
         * @public
         * @readonly
         */
        readonly security_categories: OPTIONAL<SecurityCategories>
    ) {}

    /**
     * @summary Restructures an object into a ESSSecurityLabel
     * @description
     * 
     * This takes an `object` and converts it to a `ESSSecurityLabel`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `ESSSecurityLabel`.
     * @returns {ESSSecurityLabel}
     */
    public static _from_object (_o: { [_K in keyof (ESSSecurityLabel)]: (ESSSecurityLabel)[_K] }): ESSSecurityLabel {
        return new ESSSecurityLabel(_o.security_policy_identifier, _o.security_classification, _o.privacy_mark, _o.security_categories);
    }


}
/* END_OF_SYMBOL_DEFINITION ESSSecurityLabel */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ESSSecurityLabel */
/**
 * @summary The Leading Root Component Types of ESSSecurityLabel
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_ESSSecurityLabel: $.ComponentSpec[] = [
    new $.ComponentSpec("security-policy-identifier", false, $.hasTag(_TagClass.universal, 6), undefined, undefined),
    new $.ComponentSpec("security-classification", true, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("privacy-mark", true, $.or($.hasTag(_TagClass.universal, 19), $.hasTag(_TagClass.universal, 12)), undefined, undefined),
    new $.ComponentSpec("security-categories", true, $.hasTag(_TagClass.universal, 17), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_ESSSecurityLabel */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ESSSecurityLabel */
/**
 * @summary The Trailing Root Component Types of ESSSecurityLabel
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_ESSSecurityLabel: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_ESSSecurityLabel */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ESSSecurityLabel */
/**
 * @summary The Extension Addition Component Types of ESSSecurityLabel
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_ESSSecurityLabel: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_ESSSecurityLabel */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSSecurityLabel */
let _cached_decoder_for_ESSSecurityLabel: $.ASN1Decoder<ESSSecurityLabel> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_ESSSecurityLabel */

/* START_OF_SYMBOL_DEFINITION _decode_ESSSecurityLabel */
/**
 * @summary Decodes an ASN.1 element into a(n) ESSSecurityLabel
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {ESSSecurityLabel} The decoded data structure.
 */
export
function _decode_ESSSecurityLabel (el: _Element) {
    if (!_cached_decoder_for_ESSSecurityLabel) { _cached_decoder_for_ESSSecurityLabel = function (el: _Element): ESSSecurityLabel {
    /* START_OF_SET_COMPONENT_DECLARATIONS */
    let security_policy_identifier!: SecurityPolicyIdentifier;
    let security_classification: OPTIONAL<SecurityClassification>;
    let privacy_mark: OPTIONAL<ESSPrivacyMark>;
    let security_categories: OPTIONAL<SecurityCategories>;
    /* END_OF_SET_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "security-policy-identifier": (_el: _Element): void => { security_policy_identifier = _decode_SecurityPolicyIdentifier(_el); },
        "security-classification": (_el: _Element): void => { security_classification = _decode_SecurityClassification(_el); },
        "privacy-mark": (_el: _Element): void => { privacy_mark = _decode_ESSPrivacyMark(_el); },
        "security-categories": (_el: _Element): void => { security_categories = _decode_SecurityCategories(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_set(el, callbacks,
        _root_component_type_list_1_spec_for_ESSSecurityLabel,
        _extension_additions_list_spec_for_ESSSecurityLabel,
        _root_component_type_list_2_spec_for_ESSSecurityLabel,
        undefined,
    );
    return new ESSSecurityLabel( /* SET_CONSTRUCTOR_CALL */
        security_policy_identifier,
        security_classification,
        privacy_mark,
        security_categories
    );
}; }
    return _cached_decoder_for_ESSSecurityLabel(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_ESSSecurityLabel */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSSecurityLabel */
let _cached_encoder_for_ESSSecurityLabel: $.ASN1Encoder<ESSSecurityLabel> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_ESSSecurityLabel */

/* START_OF_SYMBOL_DEFINITION _encode_ESSSecurityLabel */
/**
 * @summary Encodes a(n) ESSSecurityLabel into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The ESSSecurityLabel, encoded as an ASN.1 Element.
 */
export
function _encode_ESSSecurityLabel (value: ESSSecurityLabel, elGetter: $.ASN1Encoder<ESSSecurityLabel>) {
    if (!_cached_encoder_for_ESSSecurityLabel) { _cached_encoder_for_ESSSecurityLabel = function (value: ESSSecurityLabel, elGetter: $.ASN1Encoder<ESSSecurityLabel>): _Element {
    return $._encodeSet(([] as (_Element | undefined)[]).concat(
        [
            /* REQUIRED   */ _encode_SecurityPolicyIdentifier(value.security_policy_identifier, $.BER),
            /* IF_ABSENT  */ ((value.security_classification === undefined) ? undefined : _encode_SecurityClassification(value.security_classification, $.BER)),
            /* IF_ABSENT  */ ((value.privacy_mark === undefined) ? undefined : _encode_ESSPrivacyMark(value.privacy_mark, $.BER)),
            /* IF_ABSENT  */ ((value.security_categories === undefined) ? undefined : _encode_SecurityCategories(value.security_categories, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_ESSSecurityLabel(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_ESSSecurityLabel */

/* eslint-enable */
