package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION UserPwd */
// ### ASN.1 Definition:
//
// ```asn1
// UserPwd  ::=  CHOICE {
//   clear                 UTF8String,
//   encrypted             SEQUENCE {
//     algorithmIdentifier   AlgorithmIdentifier{{SupportedAlgorithms}},
//     encryptedString       OCTET STRING,
//     ...},
//   ...}
// ```
type UserPwd = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UserPwd */ /* START_OF_SYMBOL_DEFINITION PwdVocabulary */
// ### ASN.1 Definition:
//
// ```asn1
// PwdVocabulary  ::=   BIT STRING {
//     noDictionaryWords   (0),
//     noPersonNames       (1),
//     noGeographicalNames (2) }
// ```
type PwdVocabulary = asn1.BitString

/* END_OF_SYMBOL_DEFINITION PwdVocabulary */

/* START_OF_SYMBOL_DEFINITION PwdVocabulary_NoDictionaryWords */
const PwdVocabulary_NoDictionaryWords int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PwdVocabulary_NoDictionaryWords */

/* START_OF_SYMBOL_DEFINITION PwdVocabulary_NoPersonNames */
const PwdVocabulary_NoPersonNames int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PwdVocabulary_NoPersonNames */

/* START_OF_SYMBOL_DEFINITION PwdVocabulary_NoGeographicalNames */
const PwdVocabulary_NoGeographicalNames int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PwdVocabulary_NoGeographicalNames */ /* START_OF_SYMBOL_DEFINITION PwdAlphabet */
// ### ASN.1 Definition:
//
// ```asn1
// PwdAlphabet  ::=  SEQUENCE OF UTF8String
// ```
type PwdAlphabet = [](string) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION PwdAlphabet */ /* START_OF_SYMBOL_DEFINITION PwdEncAlg */
// ### ASN.1 Definition:
//
// ```asn1
// PwdEncAlg  ::=  AlgorithmIdentifier{{SupportedAlgorithms}}
// ```
type PwdEncAlg = pkix.AlgorithmIdentifier // DefinedType
/* END_OF_SYMBOL_DEFINITION PwdEncAlg */ /* START_OF_SYMBOL_DEFINITION Id_at_userPwd */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-userPwd                    OBJECT IDENTIFIER ::= {id-at 85}
// ```
//
//
var Id_at_userPwd asn1.ObjectIdentifier = []int{2, 5, 4, 85} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_userPwd */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdStartTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdStartTime               OBJECT IDENTIFIER ::= {id-oa 22}
// ```
//
//
var Id_oa_pwdStartTime asn1.ObjectIdentifier = []int{2, 5, 18, 22} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdStartTime */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdExpiryTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdExpiryTime              OBJECT IDENTIFIER ::= {id-oa 23}
// ```
//
//
var Id_oa_pwdExpiryTime asn1.ObjectIdentifier = []int{2, 5, 18, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdExpiryTime */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdEndTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdEndTime                 OBJECT IDENTIFIER ::= {id-oa 24}
// ```
//
//
var Id_oa_pwdEndTime asn1.ObjectIdentifier = []int{2, 5, 18, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdEndTime */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdFails */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdFails                   OBJECT IDENTIFIER ::= {id-oa 25}
// ```
//
//
var Id_oa_pwdFails asn1.ObjectIdentifier = []int{2, 5, 18, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdFails */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdFailureTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdFailureTime             OBJECT IDENTIFIER ::= {id-oa 26}
// ```
//
//
var Id_oa_pwdFailureTime asn1.ObjectIdentifier = []int{2, 5, 18, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdFailureTime */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdGracesUsed */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdGracesUsed              OBJECT IDENTIFIER ::= {id-oa 27}
// ```
//
//
var Id_oa_pwdGracesUsed asn1.ObjectIdentifier = []int{2, 5, 18, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdGracesUsed */ /* START_OF_SYMBOL_DEFINITION Id_oa_userPwdHistory */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-userPwdHistory             OBJECT IDENTIFIER ::= {id-oa 28}
// ```
//
//
var Id_oa_userPwdHistory asn1.ObjectIdentifier = []int{2, 5, 18, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_userPwdHistory */ /* START_OF_SYMBOL_DEFINITION Id_oa_userPwdRecentlyExpired */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-userPwdRecentlyExpired     OBJECT IDENTIFIER ::= {id-oa 29}
// ```
//
//
var Id_oa_userPwdRecentlyExpired asn1.ObjectIdentifier = []int{2, 5, 18, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_userPwdRecentlyExpired */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdModifyEntryAllowed */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdModifyEntryAllowed      OBJECT IDENTIFIER ::= {id-oa 30}
// ```
//
//
var Id_oa_pwdModifyEntryAllowed asn1.ObjectIdentifier = []int{2, 5, 18, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdModifyEntryAllowed */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdChangeAllowed */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdChangeAllowed           OBJECT IDENTIFIER ::= {id-oa 31}
// ```
//
//
var Id_oa_pwdChangeAllowed asn1.ObjectIdentifier = []int{2, 5, 18, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdChangeAllowed */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdMaxAge */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdMaxAge                  OBJECT IDENTIFIER ::= {id-oa 32}
// ```
//
//
var Id_oa_pwdMaxAge asn1.ObjectIdentifier = []int{2, 5, 18, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdMaxAge */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdExpiryAge */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdExpiryAge               OBJECT IDENTIFIER ::= {id-oa 33}
// ```
//
//
var Id_oa_pwdExpiryAge asn1.ObjectIdentifier = []int{2, 5, 18, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdExpiryAge */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdMinLength */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdMinLength               OBJECT IDENTIFIER ::= {id-oa 34}
// ```
//
//
var Id_oa_pwdMinLength asn1.ObjectIdentifier = []int{2, 5, 18, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdMinLength */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdVocabulary */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdVocabulary              OBJECT IDENTIFIER ::= {id-oa 35}
// ```
//
//
var Id_oa_pwdVocabulary asn1.ObjectIdentifier = []int{2, 5, 18, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdVocabulary */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdAlphabet */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdAlphabet                OBJECT IDENTIFIER ::= {id-oa 36}
// ```
//
//
var Id_oa_pwdAlphabet asn1.ObjectIdentifier = []int{2, 5, 18, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdAlphabet */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdDictionaries */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdDictionaries            OBJECT IDENTIFIER ::= {id-oa 37}
// ```
//
//
var Id_oa_pwdDictionaries asn1.ObjectIdentifier = []int{2, 5, 18, 37} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdDictionaries */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdExpiryWarning */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdExpiryWarning           OBJECT IDENTIFIER ::= {id-oa 38}
// ```
//
//
var Id_oa_pwdExpiryWarning asn1.ObjectIdentifier = []int{2, 5, 18, 38} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdExpiryWarning */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdGraces */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdGraces                  OBJECT IDENTIFIER ::= {id-oa 39}
// ```
//
//
var Id_oa_pwdGraces asn1.ObjectIdentifier = []int{2, 5, 18, 39} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdGraces */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdFailureDuration */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdFailureDuration         OBJECT IDENTIFIER ::= {id-oa 40}
// ```
//
//
var Id_oa_pwdFailureDuration asn1.ObjectIdentifier = []int{2, 5, 18, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdFailureDuration */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdLockoutDuration */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdLockoutDuration         OBJECT IDENTIFIER ::= {id-oa 41}
// ```
//
//
var Id_oa_pwdLockoutDuration asn1.ObjectIdentifier = []int{2, 5, 18, 41} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdLockoutDuration */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdMaxFailures */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdMaxFailures             OBJECT IDENTIFIER ::= {id-oa 42}
// ```
//
//
var Id_oa_pwdMaxFailures asn1.ObjectIdentifier = []int{2, 5, 18, 42} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdMaxFailures */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdMaxTimeInHistory */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdMaxTimeInHistory        OBJECT IDENTIFIER ::= {id-oa 43}
// ```
//
//
var Id_oa_pwdMaxTimeInHistory asn1.ObjectIdentifier = []int{2, 5, 18, 43} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdMaxTimeInHistory */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdMinTimeInHistory */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdMinTimeInHistory        OBJECT IDENTIFIER ::= {id-oa 44}
// ```
//
//
var Id_oa_pwdMinTimeInHistory asn1.ObjectIdentifier = []int{2, 5, 18, 44} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdMinTimeInHistory */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdHistorySlots */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdHistorySlots            OBJECT IDENTIFIER ::= {id-oa 45}
// ```
//
//
var Id_oa_pwdHistorySlots asn1.ObjectIdentifier = []int{2, 5, 18, 45} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdHistorySlots */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdRecentlyExpiredDuration */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdRecentlyExpiredDuration OBJECT IDENTIFIER ::= {id-oa 46}
// ```
//
//
var Id_oa_pwdRecentlyExpiredDuration asn1.ObjectIdentifier = []int{2, 5, 18, 46} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdRecentlyExpiredDuration */ /* START_OF_SYMBOL_DEFINITION Id_oa_pwdEncAlg */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa-pwdEncAlg                  OBJECT IDENTIFIER ::= {id-oa 47}
// ```
//
//
var Id_oa_pwdEncAlg asn1.ObjectIdentifier = []int{2, 5, 18, 47} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oa_pwdEncAlg */ /* START_OF_SYMBOL_DEFINITION Id_mr_userPwdMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-userPwdMatch               OBJECT IDENTIFIER ::= {id-mr 71}
// ```
//
//
var Id_mr_userPwdMatch asn1.ObjectIdentifier = []int{2, 5, 13, 71} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_userPwdMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_userPwdHistoryMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-userPwdHistoryMatch        OBJECT IDENTIFIER ::= {id-mr 72}
// ```
//
//
var Id_mr_userPwdHistoryMatch asn1.ObjectIdentifier = []int{2, 5, 13, 72} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_userPwdHistoryMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_pwdEncAlgMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-pwdEncAlgMatch             OBJECT IDENTIFIER ::= {id-mr 73}
// ```
//
//
var Id_mr_pwdEncAlgMatch asn1.ObjectIdentifier = []int{2, 5, 13, 73} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_pwdEncAlgMatch */ /* START_OF_SYMBOL_DEFINITION Id_asx_userPwdDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-userPwdDescription        OBJECT IDENTIFIER ::= {id-asx 0}
// ```
//
//
var Id_asx_userPwdDescription asn1.ObjectIdentifier = []int{2, 5, 40, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_userPwdDescription */ /* START_OF_SYMBOL_DEFINITION Id_asx_pwdVocabularyDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-pwdVocabularyDescription  OBJECT IDENTIFIER ::= {id-asx 1}
// ```
//
//
var Id_asx_pwdVocabularyDescription asn1.ObjectIdentifier = []int{2, 5, 40, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_pwdVocabularyDescription */ /* START_OF_SYMBOL_DEFINITION Id_asx_pwdAlphabetDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-pwdAlphabetDescription    OBJECT IDENTIFIER ::= {id-asx 2}
// ```
//
//
var Id_asx_pwdAlphabetDescription asn1.ObjectIdentifier = []int{2, 5, 40, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_pwdAlphabetDescription */ /* START_OF_SYMBOL_DEFINITION Id_asx_pwdEncAlgDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-pwdEncAlgDescription      OBJECT IDENTIFIER ::= {id-asx 3}
// ```
//
//
var Id_asx_pwdEncAlgDescription asn1.ObjectIdentifier = []int{2, 5, 40, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_pwdEncAlgDescription */ /* START_OF_SYMBOL_DEFINITION UserPwd_encrypted */
// ### ASN.1 Definition:
//
// ```asn1
// UserPwd-encrypted ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type UserPwd_encrypted struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	EncryptedString     []byte
}

/* END_OF_SYMBOL_DEFINITION UserPwd_encrypted */
