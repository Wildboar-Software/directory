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
import { PatronHeaderVersion, _decode_PatronHeaderVersion, _encode_PatronHeaderVersion } from "../CBEFF-SMARTCARD-BIDO/PatronHeaderVersion.ta";
export { PatronHeaderVersion, _decode_PatronHeaderVersion, _encode_PatronHeaderVersion } from "../CBEFF-SMARTCARD-BIDO/PatronHeaderVersion.ta";
import { BiometricType, _decode_BiometricType, _encode_BiometricType } from "../CBEFF-SMARTCARD-BIDO/BiometricType.ta";
export { BiometricType, _decode_BiometricType, _encode_BiometricType } from "../CBEFF-SMARTCARD-BIDO/BiometricType.ta";
import { BiometricSubType, _decode_BiometricSubType, _encode_BiometricSubType } from "../CBEFF-SMARTCARD-BIDO/BiometricSubType.ta";
export { BiometricSubType, _decode_BiometricSubType, _encode_BiometricSubType } from "../CBEFF-SMARTCARD-BIDO/BiometricSubType.ta";
import { BCDTime, _decode_BCDTime, _encode_BCDTime } from "../CBEFF-SMARTCARD-BIDO/BCDTime.ta";
export { BCDTime, _decode_BCDTime, _encode_BCDTime } from "../CBEFF-SMARTCARD-BIDO/BCDTime.ta";
import { Creator, _decode_Creator, _encode_Creator } from "../CBEFF-SMARTCARD-BIDO/Creator.ta";
export { Creator, _decode_Creator, _encode_Creator } from "../CBEFF-SMARTCARD-BIDO/Creator.ta";
import { BCDDatePeriod, _decode_BCDDatePeriod, _encode_BCDDatePeriod } from "../CBEFF-SMARTCARD-BIDO/BCDDatePeriod.ta";
export { BCDDatePeriod, _decode_BCDDatePeriod, _encode_BCDDatePeriod } from "../CBEFF-SMARTCARD-BIDO/BCDDatePeriod.ta";
import { ProductID, _decode_ProductID, _encode_ProductID } from "../CBEFF-SMARTCARD-BIDO/ProductID.ta";
export { ProductID, _decode_ProductID, _encode_ProductID } from "../CBEFF-SMARTCARD-BIDO/ProductID.ta";
import { FormatOwner, _decode_FormatOwner, _encode_FormatOwner } from "../CBEFF-SMARTCARD-BIDO/FormatOwner.ta";
export { FormatOwner, _decode_FormatOwner, _encode_FormatOwner } from "../CBEFF-SMARTCARD-BIDO/FormatOwner.ta";
import { FormatType, _decode_FormatType, _encode_FormatType } from "../CBEFF-SMARTCARD-BIDO/FormatType.ta";
export { FormatType, _decode_FormatType, _encode_FormatType } from "../CBEFF-SMARTCARD-BIDO/FormatType.ta";
import { BIRIndex, _decode_BIRIndex, _encode_BIRIndex } from "../CBEFF-SMARTCARD-BIDO/BIRIndex.ta";
export { BIRIndex, _decode_BIRIndex, _encode_BIRIndex } from "../CBEFF-SMARTCARD-BIDO/BIRIndex.ta";


/* START_OF_SYMBOL_DEFINITION BiometricHeaderTemplate */
/**
 * @summary BiometricHeaderTemplate
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * BiometricHeaderTemplate ::= SET {
 *   patronHeaderVersion    [0]  PatronHeaderVersion DEFAULT '0101'H,
 *   -- The absence of this Data Object represents NO VALUE AVAILABLE
 *   bdbBiometricType       [1]  BiometricType OPTIONAL,
 *   bdbBiometricSubType    [2]  BiometricSubType OPTIONAL,
 *   -- Required to be absent unless bdbBiometricType is present
 *   bdbCreationDate        [3]  BCDTime OPTIONAL,
 *   -- CBEFF_BDB_creation_date
 *   birCreator             [4]  Creator OPTIONAL,
 *   bdbValidityPeriod      [5]  BCDDatePeriod OPTIONAL,
 *   bdbPID                 [6]  ProductID OPTIONAL,
 *   bdbFormatOwner         [7]  FormatOwner,
 *   bdbFormatType          [8]  FormatType,
 *   birIndex               [16]  BIRIndex OPTIONAL,
 *   matchingAlgParameters  [17]  OCTET STRING OPTIONAL
 *   -- A non-CBEFF data element &#8211; see ISO/IEC 7816-11
 * }
 * ```
 * 
 * @class
 */
export
class BiometricHeaderTemplate {
    constructor (
        /**
         * @summary `patronHeaderVersion`.
         * @public
         * @readonly
         */
        readonly patronHeaderVersion: OPTIONAL<PatronHeaderVersion>,
        /**
         * @summary `bdbBiometricType`.
         * @public
         * @readonly
         */
        readonly bdbBiometricType: OPTIONAL<BiometricType>,
        /**
         * @summary `bdbBiometricSubType`.
         * @public
         * @readonly
         */
        readonly bdbBiometricSubType: OPTIONAL<BiometricSubType>,
        /**
         * @summary `bdbCreationDate`.
         * @public
         * @readonly
         */
        readonly bdbCreationDate: OPTIONAL<BCDTime>,
        /**
         * @summary `birCreator`.
         * @public
         * @readonly
         */
        readonly birCreator: OPTIONAL<Creator>,
        /**
         * @summary `bdbValidityPeriod`.
         * @public
         * @readonly
         */
        readonly bdbValidityPeriod: OPTIONAL<BCDDatePeriod>,
        /**
         * @summary `bdbPID`.
         * @public
         * @readonly
         */
        readonly bdbPID: OPTIONAL<ProductID>,
        /**
         * @summary `bdbFormatOwner`.
         * @public
         * @readonly
         */
        readonly bdbFormatOwner: FormatOwner,
        /**
         * @summary `bdbFormatType`.
         * @public
         * @readonly
         */
        readonly bdbFormatType: FormatType,
        /**
         * @summary `birIndex`.
         * @public
         * @readonly
         */
        readonly birIndex: OPTIONAL<BIRIndex>,
        /**
         * @summary `matchingAlgParameters`.
         * @public
         * @readonly
         */
        readonly matchingAlgParameters: OPTIONAL<OCTET_STRING>
    ) {}

    /**
     * @summary Restructures an object into a BiometricHeaderTemplate
     * @description
     * 
     * This takes an `object` and converts it to a `BiometricHeaderTemplate`.
     * 
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `BiometricHeaderTemplate`.
     * @returns {BiometricHeaderTemplate}
     */
    public static _from_object (_o: { [_K in keyof (BiometricHeaderTemplate)]: (BiometricHeaderTemplate)[_K] }): BiometricHeaderTemplate {
        return new BiometricHeaderTemplate(_o.patronHeaderVersion, _o.bdbBiometricType, _o.bdbBiometricSubType, _o.bdbCreationDate, _o.birCreator, _o.bdbValidityPeriod, _o.bdbPID, _o.bdbFormatOwner, _o.bdbFormatType, _o.birIndex, _o.matchingAlgParameters);
    }

    /**
     * @summary Getter that returns the default value for `patronHeaderVersion`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_patronHeaderVersion () { return new Uint8Array([ 0x, 0x, 0x ]); }
}
/* END_OF_SYMBOL_DEFINITION BiometricHeaderTemplate */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BiometricHeaderTemplate */
/**
 * @summary The Leading Root Component Types of BiometricHeaderTemplate
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_1_spec_for_BiometricHeaderTemplate: $.ComponentSpec[] = [
    new $.ComponentSpec("patronHeaderVersion", true, $.hasTag(_TagClass.context, 0), undefined, undefined),
    new $.ComponentSpec("bdbBiometricType", true, $.hasTag(_TagClass.context, 1), undefined, undefined),
    new $.ComponentSpec("bdbBiometricSubType", true, $.hasTag(_TagClass.context, 2), undefined, undefined),
    new $.ComponentSpec("bdbCreationDate", true, $.hasTag(_TagClass.context, 3), undefined, undefined),
    new $.ComponentSpec("birCreator", true, $.hasTag(_TagClass.context, 4), undefined, undefined),
    new $.ComponentSpec("bdbValidityPeriod", true, $.hasTag(_TagClass.context, 5), undefined, undefined),
    new $.ComponentSpec("bdbPID", true, $.hasTag(_TagClass.context, 6), undefined, undefined),
    new $.ComponentSpec("bdbFormatOwner", false, $.hasTag(_TagClass.context, 7), undefined, undefined),
    new $.ComponentSpec("bdbFormatType", false, $.hasTag(_TagClass.context, 8), undefined, undefined),
    new $.ComponentSpec("birIndex", true, $.hasTag(_TagClass.context, 16), undefined, undefined),
    new $.ComponentSpec("matchingAlgParameters", true, $.hasTag(_TagClass.context, 17), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_BiometricHeaderTemplate */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BiometricHeaderTemplate */
/**
 * @summary The Trailing Root Component Types of BiometricHeaderTemplate
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _root_component_type_list_2_spec_for_BiometricHeaderTemplate: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_BiometricHeaderTemplate */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BiometricHeaderTemplate */
/**
 * @summary The Extension Addition Component Types of BiometricHeaderTemplate
 * @description
 * 
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 * 
 * @constant
 */
export
const _extension_additions_list_spec_for_BiometricHeaderTemplate: $.ComponentSpec[] = [
    
];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_BiometricHeaderTemplate */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricHeaderTemplate */
let _cached_decoder_for_BiometricHeaderTemplate: $.ASN1Decoder<BiometricHeaderTemplate> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_BiometricHeaderTemplate */

/* START_OF_SYMBOL_DEFINITION _decode_BiometricHeaderTemplate */
/**
 * @summary Decodes an ASN.1 element into a(n) BiometricHeaderTemplate
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {BiometricHeaderTemplate} The decoded data structure.
 */
export
function _decode_BiometricHeaderTemplate (el: _Element) {
    if (!_cached_decoder_for_BiometricHeaderTemplate) { _cached_decoder_for_BiometricHeaderTemplate = function (el: _Element): BiometricHeaderTemplate {
    /* START_OF_SET_COMPONENT_DECLARATIONS */
    let patronHeaderVersion: OPTIONAL<PatronHeaderVersion> = BiometricHeaderTemplate._default_value_for_patronHeaderVersion;
    let bdbBiometricType: OPTIONAL<BiometricType>;
    let bdbBiometricSubType: OPTIONAL<BiometricSubType>;
    let bdbCreationDate: OPTIONAL<BCDTime>;
    let birCreator: OPTIONAL<Creator>;
    let bdbValidityPeriod: OPTIONAL<BCDDatePeriod>;
    let bdbPID: OPTIONAL<ProductID>;
    let bdbFormatOwner!: FormatOwner;
    let bdbFormatType!: FormatType;
    let birIndex: OPTIONAL<BIRIndex>;
    let matchingAlgParameters: OPTIONAL<OCTET_STRING>;
    /* END_OF_SET_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "patronHeaderVersion": (_el: _Element): void => { patronHeaderVersion = $._decode_implicit<PatronHeaderVersion>(() => _decode_PatronHeaderVersion)(_el); },
        "bdbBiometricType": (_el: _Element): void => { bdbBiometricType = $._decode_implicit<BiometricType>(() => _decode_BiometricType)(_el); },
        "bdbBiometricSubType": (_el: _Element): void => { bdbBiometricSubType = $._decode_implicit<BiometricSubType>(() => _decode_BiometricSubType)(_el); },
        "bdbCreationDate": (_el: _Element): void => { bdbCreationDate = $._decode_implicit<BCDTime>(() => _decode_BCDTime)(_el); },
        "birCreator": (_el: _Element): void => { birCreator = $._decode_implicit<Creator>(() => _decode_Creator)(_el); },
        "bdbValidityPeriod": (_el: _Element): void => { bdbValidityPeriod = $._decode_implicit<BCDDatePeriod>(() => _decode_BCDDatePeriod)(_el); },
        "bdbPID": (_el: _Element): void => { bdbPID = $._decode_implicit<ProductID>(() => _decode_ProductID)(_el); },
        "bdbFormatOwner": (_el: _Element): void => { bdbFormatOwner = $._decode_implicit<FormatOwner>(() => _decode_FormatOwner)(_el); },
        "bdbFormatType": (_el: _Element): void => { bdbFormatType = $._decode_implicit<FormatType>(() => _decode_FormatType)(_el); },
        "birIndex": (_el: _Element): void => { birIndex = $._decode_implicit<BIRIndex>(() => _decode_BIRIndex)(_el); },
        "matchingAlgParameters": (_el: _Element): void => { matchingAlgParameters = $._decode_implicit<OCTET_STRING>(() => $._decodeOctetString)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_set(el, callbacks,
        _root_component_type_list_1_spec_for_BiometricHeaderTemplate,
        _extension_additions_list_spec_for_BiometricHeaderTemplate,
        _root_component_type_list_2_spec_for_BiometricHeaderTemplate,
        undefined,
    );
    return new BiometricHeaderTemplate( /* SET_CONSTRUCTOR_CALL */
        patronHeaderVersion,
        bdbBiometricType,
        bdbBiometricSubType,
        bdbCreationDate,
        birCreator,
        bdbValidityPeriod,
        bdbPID,
        bdbFormatOwner,
        bdbFormatType,
        birIndex,
        matchingAlgParameters
    );
}; }
    return _cached_decoder_for_BiometricHeaderTemplate(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_BiometricHeaderTemplate */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricHeaderTemplate */
let _cached_encoder_for_BiometricHeaderTemplate: $.ASN1Encoder<BiometricHeaderTemplate> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_BiometricHeaderTemplate */

/* START_OF_SYMBOL_DEFINITION _encode_BiometricHeaderTemplate */
/**
 * @summary Encodes a(n) BiometricHeaderTemplate into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The BiometricHeaderTemplate, encoded as an ASN.1 Element.
 */
export
function _encode_BiometricHeaderTemplate (value: BiometricHeaderTemplate, elGetter: $.ASN1Encoder<BiometricHeaderTemplate>) {
    if (!_cached_encoder_for_BiometricHeaderTemplate) { _cached_encoder_for_BiometricHeaderTemplate = function (value: BiometricHeaderTemplate, elGetter: $.ASN1Encoder<BiometricHeaderTemplate>): _Element {
    return $._encodeSet(([] as (_Element | undefined)[]).concat(
        [
            /* IF_DEFAULT */ (value.patronHeaderVersion === undefined || $.deepEq(value.patronHeaderVersion, BiometricHeaderTemplate._default_value_for_patronHeaderVersion) ? undefined : $._encode_implicit(_TagClass.context, 0, () => _encode_PatronHeaderVersion, $.BER)(value.patronHeaderVersion, $.BER)),
            /* IF_ABSENT  */ ((value.bdbBiometricType === undefined) ? undefined : $._encode_implicit(_TagClass.context, 1, () => _encode_BiometricType, $.BER)(value.bdbBiometricType, $.BER)),
            /* IF_ABSENT  */ ((value.bdbBiometricSubType === undefined) ? undefined : $._encode_implicit(_TagClass.context, 2, () => _encode_BiometricSubType, $.BER)(value.bdbBiometricSubType, $.BER)),
            /* IF_ABSENT  */ ((value.bdbCreationDate === undefined) ? undefined : $._encode_implicit(_TagClass.context, 3, () => _encode_BCDTime, $.BER)(value.bdbCreationDate, $.BER)),
            /* IF_ABSENT  */ ((value.birCreator === undefined) ? undefined : $._encode_implicit(_TagClass.context, 4, () => _encode_Creator, $.BER)(value.birCreator, $.BER)),
            /* IF_ABSENT  */ ((value.bdbValidityPeriod === undefined) ? undefined : $._encode_implicit(_TagClass.context, 5, () => _encode_BCDDatePeriod, $.BER)(value.bdbValidityPeriod, $.BER)),
            /* IF_ABSENT  */ ((value.bdbPID === undefined) ? undefined : $._encode_implicit(_TagClass.context, 6, () => _encode_ProductID, $.BER)(value.bdbPID, $.BER)),
            /* REQUIRED   */ $._encode_implicit(_TagClass.context, 7, () => _encode_FormatOwner, $.BER)(value.bdbFormatOwner, $.BER),
            /* REQUIRED   */ $._encode_implicit(_TagClass.context, 8, () => _encode_FormatType, $.BER)(value.bdbFormatType, $.BER),
            /* IF_ABSENT  */ ((value.birIndex === undefined) ? undefined : $._encode_implicit(_TagClass.context, 16, () => _encode_BIRIndex, $.BER)(value.birIndex, $.BER)),
            /* IF_ABSENT  */ ((value.matchingAlgParameters === undefined) ? undefined : $._encode_implicit(_TagClass.context, 17, () => $._encodeOctetString, $.BER)(value.matchingAlgParameters, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_BiometricHeaderTemplate(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_BiometricHeaderTemplate */

/* eslint-enable */
