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



/* START_OF_SYMBOL_DEFINITION SS_Code */
/**
 * @summary SS_Code
 * @description
 * 
 * ### ASN.1 Definition:
 * 
 * ```asn1
 * SS-Code  ::=  INTEGER {
 *   clip(11), clir(12), colp(13), colr(14), mci(15), cfu(16), cfb(17),
 *   cfna(18), cfnr(25), civr(26), tvr(27)}
 * ```
 */
export
type SS_Code = INTEGER;
/* END_OF_SYMBOL_DEFINITION SS_Code */

/* START_OF_SYMBOL_DEFINITION SS_Code_clip */
/**
 * @summary SS_Code_clip
 * @constant
 * @type {number}
 */
export
const SS_Code_clip: SS_Code = 11; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_clip */

/* START_OF_SYMBOL_DEFINITION clip */
/**
 * @summary SS_Code_clip
 * @constant
 * @type {number}
 */
export
const clip: SS_Code = SS_Code_clip; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION clip */

/* START_OF_SYMBOL_DEFINITION SS_Code_clir */
/**
 * @summary SS_Code_clir
 * @constant
 * @type {number}
 */
export
const SS_Code_clir: SS_Code = 12; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_clir */

/* START_OF_SYMBOL_DEFINITION clir */
/**
 * @summary SS_Code_clir
 * @constant
 * @type {number}
 */
export
const clir: SS_Code = SS_Code_clir; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION clir */

/* START_OF_SYMBOL_DEFINITION SS_Code_colp */
/**
 * @summary SS_Code_colp
 * @constant
 * @type {number}
 */
export
const SS_Code_colp: SS_Code = 13; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_colp */

/* START_OF_SYMBOL_DEFINITION colp */
/**
 * @summary SS_Code_colp
 * @constant
 * @type {number}
 */
export
const colp: SS_Code = SS_Code_colp; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION colp */

/* START_OF_SYMBOL_DEFINITION SS_Code_colr */
/**
 * @summary SS_Code_colr
 * @constant
 * @type {number}
 */
export
const SS_Code_colr: SS_Code = 14; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_colr */

/* START_OF_SYMBOL_DEFINITION colr */
/**
 * @summary SS_Code_colr
 * @constant
 * @type {number}
 */
export
const colr: SS_Code = SS_Code_colr; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION colr */

/* START_OF_SYMBOL_DEFINITION SS_Code_mci */
/**
 * @summary SS_Code_mci
 * @constant
 * @type {number}
 */
export
const SS_Code_mci: SS_Code = 15; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_mci */

/* START_OF_SYMBOL_DEFINITION mci */
/**
 * @summary SS_Code_mci
 * @constant
 * @type {number}
 */
export
const mci: SS_Code = SS_Code_mci; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION mci */

/* START_OF_SYMBOL_DEFINITION SS_Code_cfu */
/**
 * @summary SS_Code_cfu
 * @constant
 * @type {number}
 */
export
const SS_Code_cfu: SS_Code = 16; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_cfu */

/* START_OF_SYMBOL_DEFINITION cfu */
/**
 * @summary SS_Code_cfu
 * @constant
 * @type {number}
 */
export
const cfu: SS_Code = SS_Code_cfu; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION cfu */

/* START_OF_SYMBOL_DEFINITION SS_Code_cfb */
/**
 * @summary SS_Code_cfb
 * @constant
 * @type {number}
 */
export
const SS_Code_cfb: SS_Code = 17; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_cfb */

/* START_OF_SYMBOL_DEFINITION cfb */
/**
 * @summary SS_Code_cfb
 * @constant
 * @type {number}
 */
export
const cfb: SS_Code = SS_Code_cfb; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION cfb */

/* START_OF_SYMBOL_DEFINITION SS_Code_cfna */
/**
 * @summary SS_Code_cfna
 * @constant
 * @type {number}
 */
export
const SS_Code_cfna: SS_Code = 18; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_cfna */

/* START_OF_SYMBOL_DEFINITION cfna */
/**
 * @summary SS_Code_cfna
 * @constant
 * @type {number}
 */
export
const cfna: SS_Code = SS_Code_cfna; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION cfna */

/* START_OF_SYMBOL_DEFINITION SS_Code_cfnr */
/**
 * @summary SS_Code_cfnr
 * @constant
 * @type {number}
 */
export
const SS_Code_cfnr: SS_Code = 25; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_cfnr */

/* START_OF_SYMBOL_DEFINITION cfnr */
/**
 * @summary SS_Code_cfnr
 * @constant
 * @type {number}
 */
export
const cfnr: SS_Code = SS_Code_cfnr; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION cfnr */

/* START_OF_SYMBOL_DEFINITION SS_Code_civr */
/**
 * @summary SS_Code_civr
 * @constant
 * @type {number}
 */
export
const SS_Code_civr: SS_Code = 26; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_civr */

/* START_OF_SYMBOL_DEFINITION civr */
/**
 * @summary SS_Code_civr
 * @constant
 * @type {number}
 */
export
const civr: SS_Code = SS_Code_civr; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION civr */

/* START_OF_SYMBOL_DEFINITION SS_Code_tvr */
/**
 * @summary SS_Code_tvr
 * @constant
 * @type {number}
 */
export
const SS_Code_tvr: SS_Code = 27; /* LONG_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION SS_Code_tvr */

/* START_OF_SYMBOL_DEFINITION tvr */
/**
 * @summary SS_Code_tvr
 * @constant
 * @type {number}
 */
export
const tvr: SS_Code = SS_Code_tvr; /* SHORT_NAMED_INTEGER_VALUE */
/* END_OF_SYMBOL_DEFINITION tvr */

/* START_OF_SYMBOL_DEFINITION _cached_decoder_for_SS_Code */
let _cached_decoder_for_SS_Code: $.ASN1Decoder<SS_Code> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_decoder_for_SS_Code */

/* START_OF_SYMBOL_DEFINITION _decode_SS_Code */
/**
 * @summary Decodes an ASN.1 element into a(n) SS_Code
 * @function
 * @param {_Element} el The element being decoded.
 * @returns {SS_Code} The decoded data structure.
 */
export
function _decode_SS_Code (el: _Element) {
    if (!_cached_decoder_for_SS_Code) { _cached_decoder_for_SS_Code = $._decodeInteger; }
    return _cached_decoder_for_SS_Code(el);
}
/* END_OF_SYMBOL_DEFINITION _decode_SS_Code */

/* START_OF_SYMBOL_DEFINITION _cached_encoder_for_SS_Code */
let _cached_encoder_for_SS_Code: $.ASN1Encoder<SS_Code> | null = null;
/* END_OF_SYMBOL_DEFINITION _cached_encoder_for_SS_Code */

/* START_OF_SYMBOL_DEFINITION _encode_SS_Code */
/**
 * @summary Encodes a(n) SS_Code into an ASN.1 Element.
 * @function
 * @param {value} el The element being decoded.
 * @param elGetter A function that can be used to get new ASN.1 elements.
 * @returns {_Element} The SS_Code, encoded as an ASN.1 Element.
 */
export
function _encode_SS_Code (value: SS_Code, elGetter: $.ASN1Encoder<SS_Code>) {
    if (!_cached_encoder_for_SS_Code) { _cached_encoder_for_SS_Code = $._encodeInteger; }
    return _cached_encoder_for_SS_Code(value, elGetter);
}

/* END_OF_SYMBOL_DEFINITION _encode_SS_Code */

/* eslint-enable */
