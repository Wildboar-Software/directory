/* eslint-disable */
import {
    OBJECT_IDENTIFIER,
    OCTET_STRING,
    OPTIONAL,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "@wildboar/asn1";
import * as $ from "@wildboar/asn1/functional";
import { FWReceiptVersion, _decode_FWReceiptVersion, _encode_FWReceiptVersion, v1 /* IMPORTED_SHORT_NAMED_INTEGER */ } from "../CMSFirmwareWrapper/FWReceiptVersion.ta";
import { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";


/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadReceipt */
/**
 * @summary FirmwarePackageLoadReceipt
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FirmwarePackageLoadReceipt ::= SEQUENCE {
 *     version                     FWReceiptVersion DEFAULT v1,
 *     hwType                      OBJECT IDENTIFIER,
 *     hwSerialNum                 OCTET STRING,
 *     fwPkgName                   PreferredOrLegacyPackageIdentifier,
 *     trustAnchorKeyID            OCTET STRING OPTIONAL,
 *     decryptKeyID                [1] OCTET STRING OPTIONAL
 * }
 * ```
 *
 * @class
 */
export
class FirmwarePackageLoadReceipt {
    constructor (
        /**
         * @summary `version`.
         * @public
         * @readonly
         */
        readonly version: OPTIONAL<FWReceiptVersion>,
        /**
         * @summary `hwType`.
         * @public
         * @readonly
         */
        readonly hwType: OBJECT_IDENTIFIER,
        /**
         * @summary `hwSerialNum`.
         * @public
         * @readonly
         */
        readonly hwSerialNum: OCTET_STRING,
        /**
         * @summary `fwPkgName`.
         * @public
         * @readonly
         */
        readonly fwPkgName: PreferredOrLegacyPackageIdentifier,
        /**
         * @summary `trustAnchorKeyID`.
         * @public
         * @readonly
         */
        readonly trustAnchorKeyID: OPTIONAL<OCTET_STRING>,
        /**
         * @summary `decryptKeyID`.
         * @public
         * @readonly
         */
        readonly decryptKeyID: OPTIONAL<OCTET_STRING>
    ) {}

    /**
     * @summary Restructures an object into a FirmwarePackageLoadReceipt
     * @description
     *
     * This takes an `object` and converts it to a `FirmwarePackageLoadReceipt`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `FirmwarePackageLoadReceipt`.
     * @returns {FirmwarePackageLoadReceipt}
     */
    public static _from_object (_o: { [_K in keyof (FirmwarePackageLoadReceipt)]: (FirmwarePackageLoadReceipt)[_K] }): FirmwarePackageLoadReceipt {
        return new FirmwarePackageLoadReceipt(_o.version, _o.hwType, _o.hwSerialNum, _o.fwPkgName, _o.trustAnchorKeyID, _o.decryptKeyID);
    }

    /**
     * @summary Getter that returns the default value for `version`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_version () { return v1; }
}
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadReceipt */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageLoadReceipt */
/**
 * @summary The Leading Root Component Types of FirmwarePackageLoadReceipt
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_FirmwarePackageLoadReceipt: $.ComponentSpec[] = [
    new $.ComponentSpec("version", true, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("hwType", false, $.hasTag(_TagClass.universal, 6), undefined, undefined),
    new $.ComponentSpec("hwSerialNum", false, $.hasTag(_TagClass.universal, 4), undefined, undefined),
    new $.ComponentSpec("fwPkgName", false, $.hasAnyTag, undefined, undefined),
    new $.ComponentSpec("trustAnchorKeyID", true, $.hasTag(_TagClass.universal, 4), undefined, undefined),
    new $.ComponentSpec("decryptKeyID", true, $.hasTag(_TagClass.context, 1), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageLoadReceipt */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageLoadReceipt */
/**
 * @summary The Trailing Root Component Types of FirmwarePackageLoadReceipt
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_FirmwarePackageLoadReceipt: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageLoadReceipt */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageLoadReceipt */
/**
 * @summary The Extension Addition Component Types of FirmwarePackageLoadReceipt
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_FirmwarePackageLoadReceipt: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageLoadReceipt */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageLoadReceipt */
let _cached_decoder_for_FirmwarePackageLoadReceipt: $.ASN1Decoder<FirmwarePackageLoadReceipt> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageLoadReceipt */

/* START_OF_SYMBOL_DEFINITION _decode_FirmwarePackageLoadReceipt */
/**
 * @summary Decodes an ASN.1 element into a(n) FirmwarePackageLoadReceipt
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FirmwarePackageLoadReceipt} The decoded data structure.
 */
export
function _decode_FirmwarePackageLoadReceipt (el: _Element) {
    if (!_cached_decoder_for_FirmwarePackageLoadReceipt) { _cached_decoder_for_FirmwarePackageLoadReceipt = function (el: _Element): FirmwarePackageLoadReceipt {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let version: OPTIONAL<FWReceiptVersion> = FirmwarePackageLoadReceipt._default_value_for_version;
    let hwType!: OBJECT_IDENTIFIER;
    let hwSerialNum!: OCTET_STRING;
    let fwPkgName!: PreferredOrLegacyPackageIdentifier;
    let trustAnchorKeyID: OPTIONAL<OCTET_STRING>;
    let decryptKeyID: OPTIONAL<OCTET_STRING>;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "version": (_el: _Element): void => { version = _decode_FWReceiptVersion(_el); },
        "hwType": (_el: _Element): void => { hwType = $._decodeObjectIdentifier(_el); },
        "hwSerialNum": (_el: _Element): void => { hwSerialNum = $._decodeOctetString(_el); },
        "fwPkgName": (_el: _Element): void => { fwPkgName = _decode_PreferredOrLegacyPackageIdentifier(_el); },
        "trustAnchorKeyID": (_el: _Element): void => { trustAnchorKeyID = $._decodeOctetString(_el); },
        "decryptKeyID": (_el: _Element): void => { decryptKeyID = $._decode_implicit<OCTET_STRING>(() => $._decodeOctetString)(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_FirmwarePackageLoadReceipt,
        _extension_additions_list_spec_for_FirmwarePackageLoadReceipt,
        _root_component_type_list_2_spec_for_FirmwarePackageLoadReceipt,
        undefined,
    );
    return new FirmwarePackageLoadReceipt( /* SEQUENCE_CONSTRUCTOR_CALL */
        version,
        hwType,
        hwSerialNum,
        fwPkgName,
        trustAnchorKeyID,
        decryptKeyID
    );
}; }
    return _cached_decoder_for_FirmwarePackageLoadReceipt(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FirmwarePackageLoadReceipt */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageLoadReceipt */
let _cached_encoder_for_FirmwarePackageLoadReceipt: $.ASN1Encoder<FirmwarePackageLoadReceipt> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageLoadReceipt */

/* START_OF_SYMBOL_DEFINITION _encode_FirmwarePackageLoadReceipt */
/**
 * @summary Encodes a(n) FirmwarePackageLoadReceipt into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FirmwarePackageLoadReceipt, encoded as an ASN.1 Element.
 */
export
function _encode_FirmwarePackageLoadReceipt (value: FirmwarePackageLoadReceipt, elGetter: $.ASN1Encoder<FirmwarePackageLoadReceipt>) {
    if (!_cached_encoder_for_FirmwarePackageLoadReceipt) { _cached_encoder_for_FirmwarePackageLoadReceipt = function (value: FirmwarePackageLoadReceipt, elGetter: $.ASN1Encoder<FirmwarePackageLoadReceipt>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_DEFAULT */ (value.version === undefined || $.deepEq(value.version, FirmwarePackageLoadReceipt._default_value_for_version) ? undefined : _encode_FWReceiptVersion(value.version, $.BER)),
            /* REQUIRED   */ $._encodeObjectIdentifier(value.hwType, $.BER),
            /* REQUIRED   */ $._encodeOctetString(value.hwSerialNum, $.BER),
            /* REQUIRED   */ _encode_PreferredOrLegacyPackageIdentifier(value.fwPkgName, $.BER),
            /* IF_ABSENT  */ ((value.trustAnchorKeyID === undefined) ? undefined : $._encodeOctetString(value.trustAnchorKeyID, $.BER)),
            /* IF_ABSENT  */ ((value.decryptKeyID === undefined) ? undefined : $._encode_implicit(_TagClass.context, 1, () => $._encodeOctetString, $.BER)(value.decryptKeyID, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_FirmwarePackageLoadReceipt(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FirmwarePackageLoadReceipt */

/* eslint-enable */
