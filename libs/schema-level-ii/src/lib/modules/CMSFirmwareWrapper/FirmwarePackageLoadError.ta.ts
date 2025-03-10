/* eslint-disable */
import {
    OBJECT_IDENTIFIER,
    OCTET_STRING,
    OPTIONAL,
    ASN1Element as _Element,
    ASN1TagClass as _TagClass
} from "asn1-ts";
import * as $ from "asn1-ts/dist/node/functional";
import { CurrentFWConfig, _decode_CurrentFWConfig, _encode_CurrentFWConfig } from "../CMSFirmwareWrapper/CurrentFWConfig.ta";
import { FWErrorVersion, _decode_FWErrorVersion, _encode_FWErrorVersion, v1 /* IMPORTED_SHORT_NAMED_INTEGER */ } from "../CMSFirmwareWrapper/FWErrorVersion.ta";
import { FirmwarePackageLoadErrorCode, _decode_FirmwarePackageLoadErrorCode, _encode_FirmwarePackageLoadErrorCode, _enum_for_FirmwarePackageLoadErrorCode } from "../CMSFirmwareWrapper/FirmwarePackageLoadErrorCode.ta";
import { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";
import { VendorLoadErrorCode, _decode_VendorLoadErrorCode, _encode_VendorLoadErrorCode } from "../CMSFirmwareWrapper/VendorLoadErrorCode.ta";
export { CurrentFWConfig, _decode_CurrentFWConfig, _encode_CurrentFWConfig } from "../CMSFirmwareWrapper/CurrentFWConfig.ta";
export { FWErrorVersion, FWErrorVersion_v1 /* IMPORTED_LONG_NAMED_INTEGER */, _decode_FWErrorVersion, _encode_FWErrorVersion, v1 /* IMPORTED_SHORT_NAMED_INTEGER */ } from "../CMSFirmwareWrapper/FWErrorVersion.ta";
export { FirmwarePackageLoadErrorCode, FirmwarePackageLoadErrorCode_badCertificate /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badCompressAlgorithm /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badContentInfo /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badDigestAlgorithm /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badEncapContent /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badEncryptAlgorithm /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badEncryptContent /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badEncryptedData /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badFirmware /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badSignatureAlgorithm /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badSignedAttrs /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badSignedData /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badSignerInfo /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_badUnsignedAttrs /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_breaksDependency /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_contentTypeMismatch /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_decodeFailure /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_decompressFailure /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_decryptFailure /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_insufficientMemory /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_missingCiphertext /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_missingCompressedContent /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_missingContent /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_missingDependency /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_noDecryptKey /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_noTrustAnchor /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_notAuthorized /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_notInCommunity /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_otherError /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_signatureFailure /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_stalePackage /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_unprotectedAttrsPresent /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_unsupportedKeySize /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_unsupportedPackageType /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_unsupportedParameters /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_wrongDependencyVersion /* IMPORTED_LONG_ENUMERATION_ITEM */, FirmwarePackageLoadErrorCode_wrongHardware /* IMPORTED_LONG_ENUMERATION_ITEM */, _decode_FirmwarePackageLoadErrorCode, _encode_FirmwarePackageLoadErrorCode, _enum_for_FirmwarePackageLoadErrorCode, badCertificate /* IMPORTED_SHORT_ENUMERATION_ITEM */, badCompressAlgorithm /* IMPORTED_SHORT_ENUMERATION_ITEM */, badContentInfo /* IMPORTED_SHORT_ENUMERATION_ITEM */, badDigestAlgorithm /* IMPORTED_SHORT_ENUMERATION_ITEM */, badEncapContent /* IMPORTED_SHORT_ENUMERATION_ITEM */, badEncryptAlgorithm /* IMPORTED_SHORT_ENUMERATION_ITEM */, badEncryptContent /* IMPORTED_SHORT_ENUMERATION_ITEM */, badEncryptedData /* IMPORTED_SHORT_ENUMERATION_ITEM */, badFirmware /* IMPORTED_SHORT_ENUMERATION_ITEM */, badSignatureAlgorithm /* IMPORTED_SHORT_ENUMERATION_ITEM */, badSignedAttrs /* IMPORTED_SHORT_ENUMERATION_ITEM */, badSignedData /* IMPORTED_SHORT_ENUMERATION_ITEM */, badSignerInfo /* IMPORTED_SHORT_ENUMERATION_ITEM */, badUnsignedAttrs /* IMPORTED_SHORT_ENUMERATION_ITEM */, breaksDependency /* IMPORTED_SHORT_ENUMERATION_ITEM */, contentTypeMismatch /* IMPORTED_SHORT_ENUMERATION_ITEM */, decodeFailure /* IMPORTED_SHORT_ENUMERATION_ITEM */, decompressFailure /* IMPORTED_SHORT_ENUMERATION_ITEM */, decryptFailure /* IMPORTED_SHORT_ENUMERATION_ITEM */, insufficientMemory /* IMPORTED_SHORT_ENUMERATION_ITEM */, missingCiphertext /* IMPORTED_SHORT_ENUMERATION_ITEM */, missingCompressedContent /* IMPORTED_SHORT_ENUMERATION_ITEM */, missingContent /* IMPORTED_SHORT_ENUMERATION_ITEM */, missingDependency /* IMPORTED_SHORT_ENUMERATION_ITEM */, noDecryptKey /* IMPORTED_SHORT_ENUMERATION_ITEM */, noTrustAnchor /* IMPORTED_SHORT_ENUMERATION_ITEM */, notAuthorized /* IMPORTED_SHORT_ENUMERATION_ITEM */, notInCommunity /* IMPORTED_SHORT_ENUMERATION_ITEM */, otherError /* IMPORTED_SHORT_ENUMERATION_ITEM */, signatureFailure /* IMPORTED_SHORT_ENUMERATION_ITEM */, stalePackage /* IMPORTED_SHORT_ENUMERATION_ITEM */, unprotectedAttrsPresent /* IMPORTED_SHORT_ENUMERATION_ITEM */, unsupportedKeySize /* IMPORTED_SHORT_ENUMERATION_ITEM */, unsupportedPackageType /* IMPORTED_SHORT_ENUMERATION_ITEM */, unsupportedParameters /* IMPORTED_SHORT_ENUMERATION_ITEM */, wrongDependencyVersion /* IMPORTED_SHORT_ENUMERATION_ITEM */, wrongHardware /* IMPORTED_SHORT_ENUMERATION_ITEM */ } from "../CMSFirmwareWrapper/FirmwarePackageLoadErrorCode.ta";
export { PreferredOrLegacyPackageIdentifier, _decode_PreferredOrLegacyPackageIdentifier, _encode_PreferredOrLegacyPackageIdentifier } from "../CMSFirmwareWrapper/PreferredOrLegacyPackageIdentifier.ta";
export { VendorLoadErrorCode, _decode_VendorLoadErrorCode, _encode_VendorLoadErrorCode } from "../CMSFirmwareWrapper/VendorLoadErrorCode.ta";


/* START_OF_SYMBOL_DEFINITION FirmwarePackageLoadError */
/**
 * @summary FirmwarePackageLoadError
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * FirmwarePackageLoadError ::= SEQUENCE {
 *     version                     FWErrorVersion DEFAULT v1,
 *     hwType                      OBJECT IDENTIFIER,
 *     hwSerialNum                 OCTET STRING,
 *     errorCode                   FirmwarePackageLoadErrorCode,
 *     vendorErrorCode             VendorLoadErrorCode OPTIONAL,
 *     fwPkgName                   PreferredOrLegacyPackageIdentifier OPTIONAL,
 *     config                      [1] SEQUENCE OF CurrentFWConfig OPTIONAL
 * }
 * ```
 *
 * @class
 */
export
class FirmwarePackageLoadError {
    constructor (
        /**
         * @summary `version`.
         * @public
         * @readonly
         */
        readonly version: OPTIONAL<FWErrorVersion>,
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
         * @summary `errorCode`.
         * @public
         * @readonly
         */
        readonly errorCode: FirmwarePackageLoadErrorCode,
        /**
         * @summary `vendorErrorCode`.
         * @public
         * @readonly
         */
        readonly vendorErrorCode: OPTIONAL<VendorLoadErrorCode>,
        /**
         * @summary `fwPkgName`.
         * @public
         * @readonly
         */
        readonly fwPkgName: OPTIONAL<PreferredOrLegacyPackageIdentifier>,
        /**
         * @summary `config`.
         * @public
         * @readonly
         */
        readonly config: OPTIONAL<CurrentFWConfig[]>
    ) {}

    /**
     * @summary Restructures an object into a FirmwarePackageLoadError
     * @description
     *
     * This takes an `object` and converts it to a `FirmwarePackageLoadError`.
     *
     * @public
     * @static
     * @method
     * @param {Object} _o An object having all of the keys and values of a `FirmwarePackageLoadError`.
     * @returns {FirmwarePackageLoadError}
     */
    public static _from_object (_o: { [_K in keyof (FirmwarePackageLoadError)]: (FirmwarePackageLoadError)[_K] }): FirmwarePackageLoadError {
        return new FirmwarePackageLoadError(_o.version, _o.hwType, _o.hwSerialNum, _o.errorCode, _o.vendorErrorCode, _o.fwPkgName, _o.config);
    }

    /**
     * @summary Getter that returns the default value for `version`.
     * @public
     * @static
     * @method
     */
    public static get _default_value_for_version () { return v1; }        /**
         * @summary The enum used as the type of the component `errorCode`
         * @public
         * @static
         */

    public static _enum_for_errorCode = _enum_for_FirmwarePackageLoadErrorCode;
}
/* END_OF_SYMBOL_DEFINITION FirmwarePackageLoadError */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageLoadError */
/**
 * @summary The Leading Root Component Types of FirmwarePackageLoadError
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the leading root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_1_spec_for_FirmwarePackageLoadError: $.ComponentSpec[] = [
    new $.ComponentSpec("version", true, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("hwType", false, $.hasTag(_TagClass.universal, 6), undefined, undefined),
    new $.ComponentSpec("hwSerialNum", false, $.hasTag(_TagClass.universal, 4), undefined, undefined),
    new $.ComponentSpec("errorCode", false, $.hasTag(_TagClass.universal, 10), undefined, undefined),
    new $.ComponentSpec("vendorErrorCode", true, $.hasTag(_TagClass.universal, 2), undefined, undefined),
    new $.ComponentSpec("fwPkgName", true, $.or($.hasTag(_TagClass.universal, 16), $.hasTag(_TagClass.universal, 4)), undefined, undefined),
    new $.ComponentSpec("config", true, $.hasTag(_TagClass.context, 1), undefined, undefined)
];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_1_spec_for_FirmwarePackageLoadError */

/* START_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageLoadError */
/**
 * @summary The Trailing Root Component Types of FirmwarePackageLoadError
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the trailing root component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _root_component_type_list_2_spec_for_FirmwarePackageLoadError: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _root_component_type_list_2_spec_for_FirmwarePackageLoadError */

/* START_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageLoadError */
/**
 * @summary The Extension Addition Component Types of FirmwarePackageLoadError
 * @description
 *
 * This is an array of `ComponentSpec`s that define how to decode the extension addition component type list of a SET or SEQUENCE.
 *
 * @constant
 */
export
const _extension_additions_list_spec_for_FirmwarePackageLoadError: $.ComponentSpec[] = [

];
/* END_OF_SYMBOL_DEFINITION _extension_additions_list_spec_for_FirmwarePackageLoadError */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageLoadError */
let _cached_decoder_for_FirmwarePackageLoadError: $.ASN1Decoder<FirmwarePackageLoadError> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_FirmwarePackageLoadError */

/* START_OF_SYMBOL_DEFINITION _decode_FirmwarePackageLoadError */
/**
 * @summary Decodes an ASN.1 element into a(n) FirmwarePackageLoadError
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {FirmwarePackageLoadError} The decoded data structure.
 */
export
function _decode_FirmwarePackageLoadError (el: _Element) {
    if (!_cached_decoder_for_FirmwarePackageLoadError) { _cached_decoder_for_FirmwarePackageLoadError = function (el: _Element): FirmwarePackageLoadError {
    /* START_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    let version: OPTIONAL<FWErrorVersion> = FirmwarePackageLoadError._default_value_for_version;
    let hwType!: OBJECT_IDENTIFIER;
    let hwSerialNum!: OCTET_STRING;
    let errorCode!: FirmwarePackageLoadErrorCode;
    let vendorErrorCode: OPTIONAL<VendorLoadErrorCode>;
    let fwPkgName: OPTIONAL<PreferredOrLegacyPackageIdentifier>;
    let config: OPTIONAL<CurrentFWConfig[]>;
    /* END_OF_SEQUENCE_COMPONENT_DECLARATIONS */
    /* START_OF_CALLBACKS_MAP */
    const callbacks: $.DecodingMap = {
        "version": (_el: _Element): void => { version = _decode_FWErrorVersion(_el); },
        "hwType": (_el: _Element): void => { hwType = $._decodeObjectIdentifier(_el); },
        "hwSerialNum": (_el: _Element): void => { hwSerialNum = $._decodeOctetString(_el); },
        "errorCode": (_el: _Element): void => { errorCode = _decode_FirmwarePackageLoadErrorCode(_el); },
        "vendorErrorCode": (_el: _Element): void => { vendorErrorCode = _decode_VendorLoadErrorCode(_el); },
        "fwPkgName": (_el: _Element): void => { fwPkgName = _decode_PreferredOrLegacyPackageIdentifier(_el); },
        "config": (_el: _Element): void => { config = $._decode_implicit<CurrentFWConfig[]>(() => $._decodeSequenceOf<CurrentFWConfig>(() => _decode_CurrentFWConfig))(_el); }
    };
    /* END_OF_CALLBACKS_MAP */
    $._parse_sequence(el, callbacks,
        _root_component_type_list_1_spec_for_FirmwarePackageLoadError,
        _extension_additions_list_spec_for_FirmwarePackageLoadError,
        _root_component_type_list_2_spec_for_FirmwarePackageLoadError,
        undefined,
    );
    return new FirmwarePackageLoadError( /* SEQUENCE_CONSTRUCTOR_CALL */
        version,
        hwType,
        hwSerialNum,
        errorCode,
        vendorErrorCode,
        fwPkgName,
        config
    );
}; }
    return _cached_decoder_for_FirmwarePackageLoadError(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_FirmwarePackageLoadError */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageLoadError */
let _cached_encoder_for_FirmwarePackageLoadError: $.ASN1Encoder<FirmwarePackageLoadError> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_FirmwarePackageLoadError */

/* START_OF_SYMBOL_DEFINITION _encode_FirmwarePackageLoadError */
/**
 * @summary Encodes a(n) FirmwarePackageLoadError into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The FirmwarePackageLoadError, encoded as an ASN.1 Element.
 */
export
function _encode_FirmwarePackageLoadError (value: FirmwarePackageLoadError, elGetter: $.ASN1Encoder<FirmwarePackageLoadError>) {
    if (!_cached_encoder_for_FirmwarePackageLoadError) { _cached_encoder_for_FirmwarePackageLoadError = function (value: FirmwarePackageLoadError, elGetter: $.ASN1Encoder<FirmwarePackageLoadError>): _Element {
    return $._encodeSequence(([] as (_Element | undefined)[]).concat(
        [
            /* IF_DEFAULT */ (value.version === undefined || $.deepEq(value.version, FirmwarePackageLoadError._default_value_for_version) ? undefined : _encode_FWErrorVersion(value.version, $.BER)),
            /* REQUIRED   */ $._encodeObjectIdentifier(value.hwType, $.BER),
            /* REQUIRED   */ $._encodeOctetString(value.hwSerialNum, $.BER),
            /* REQUIRED   */ _encode_FirmwarePackageLoadErrorCode(value.errorCode, $.BER),
            /* IF_ABSENT  */ ((value.vendorErrorCode === undefined) ? undefined : _encode_VendorLoadErrorCode(value.vendorErrorCode, $.BER)),
            /* IF_ABSENT  */ ((value.fwPkgName === undefined) ? undefined : _encode_PreferredOrLegacyPackageIdentifier(value.fwPkgName, $.BER)),
            /* IF_ABSENT  */ ((value.config === undefined) ? undefined : $._encode_implicit(_TagClass.context, 1, () => $._encodeSequenceOf<CurrentFWConfig>(() => _encode_CurrentFWConfig, $.BER), $.BER)(value.config, $.BER))
        ],
    ).filter((c: (_Element | undefined)): c is _Element => (!!c)), $.BER);
}; }
    return _cached_encoder_for_FirmwarePackageLoadError(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_FirmwarePackageLoadError */

/* eslint-enable */
