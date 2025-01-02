package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	UserPwd ::= CHOICE {
//	  clear                 UTF8String,
//	  encrypted             SEQUENCE {
//	    algorithmIdentifier   AlgorithmIdentifier{{SupportedAlgorithms}},
//	    encryptedString       OCTET STRING,
//	    ...},
//	  ...}
type UserPwd = asn1.RawValue

// # ASN.1 Definition:
//
//	PwdVocabulary ::=  BIT STRING {
//	    noDictionaryWords   (0),
//	    noPersonNames       (1),
//	    noGeographicalNames (2) }
type PwdVocabulary = asn1.BitString

const PwdVocabulary_NoDictionaryWords int32 = 0

const PwdVocabulary_NoPersonNames int32 = 1

const PwdVocabulary_NoGeographicalNames int32 = 2

// # ASN.1 Definition:
//
//	PwdAlphabet ::= SEQUENCE OF UTF8String
type PwdAlphabet = [](string)

// # ASN.1 Definition:
//
//	PwdEncAlg ::= AlgorithmIdentifier{{SupportedAlgorithms}}
type PwdEncAlg = pkix.AlgorithmIdentifier

// # ASN.1 Definition:
//
//	id-at-userPwd                    OBJECT IDENTIFIER ::= {id-at 85}
var Id_at_userPwd asn1.ObjectIdentifier = []int{2, 5, 4, 85}

// # ASN.1 Definition:
//
//	id-oa-pwdStartTime               OBJECT IDENTIFIER ::= {id-oa 22}
var Id_oa_pwdStartTime asn1.ObjectIdentifier = []int{2, 5, 18, 22}

// # ASN.1 Definition:
//
//	id-oa-pwdExpiryTime              OBJECT IDENTIFIER ::= {id-oa 23}
var Id_oa_pwdExpiryTime asn1.ObjectIdentifier = []int{2, 5, 18, 23}

// # ASN.1 Definition:
//
//	id-oa-pwdEndTime                 OBJECT IDENTIFIER ::= {id-oa 24}
var Id_oa_pwdEndTime asn1.ObjectIdentifier = []int{2, 5, 18, 24}

// # ASN.1 Definition:
//
//	id-oa-pwdFails                   OBJECT IDENTIFIER ::= {id-oa 25}
var Id_oa_pwdFails asn1.ObjectIdentifier = []int{2, 5, 18, 25}

// # ASN.1 Definition:
//
//	id-oa-pwdFailureTime             OBJECT IDENTIFIER ::= {id-oa 26}
var Id_oa_pwdFailureTime asn1.ObjectIdentifier = []int{2, 5, 18, 26}

// # ASN.1 Definition:
//
//	id-oa-pwdGracesUsed              OBJECT IDENTIFIER ::= {id-oa 27}
var Id_oa_pwdGracesUsed asn1.ObjectIdentifier = []int{2, 5, 18, 27}

// # ASN.1 Definition:
//
//	id-oa-userPwdHistory             OBJECT IDENTIFIER ::= {id-oa 28}
var Id_oa_userPwdHistory asn1.ObjectIdentifier = []int{2, 5, 18, 28}

// # ASN.1 Definition:
//
//	id-oa-userPwdRecentlyExpired     OBJECT IDENTIFIER ::= {id-oa 29}
var Id_oa_userPwdRecentlyExpired asn1.ObjectIdentifier = []int{2, 5, 18, 29}

// # ASN.1 Definition:
//
//	id-oa-pwdModifyEntryAllowed      OBJECT IDENTIFIER ::= {id-oa 30}
var Id_oa_pwdModifyEntryAllowed asn1.ObjectIdentifier = []int{2, 5, 18, 30}

// # ASN.1 Definition:
//
//	id-oa-pwdChangeAllowed           OBJECT IDENTIFIER ::= {id-oa 31}
var Id_oa_pwdChangeAllowed asn1.ObjectIdentifier = []int{2, 5, 18, 31}

// # ASN.1 Definition:
//
//	id-oa-pwdMaxAge                  OBJECT IDENTIFIER ::= {id-oa 32}
var Id_oa_pwdMaxAge asn1.ObjectIdentifier = []int{2, 5, 18, 32}

// # ASN.1 Definition:
//
//	id-oa-pwdExpiryAge               OBJECT IDENTIFIER ::= {id-oa 33}
var Id_oa_pwdExpiryAge asn1.ObjectIdentifier = []int{2, 5, 18, 33}

// # ASN.1 Definition:
//
//	id-oa-pwdMinLength               OBJECT IDENTIFIER ::= {id-oa 34}
var Id_oa_pwdMinLength asn1.ObjectIdentifier = []int{2, 5, 18, 34}

// # ASN.1 Definition:
//
//	id-oa-pwdVocabulary              OBJECT IDENTIFIER ::= {id-oa 35}
var Id_oa_pwdVocabulary asn1.ObjectIdentifier = []int{2, 5, 18, 35}

// # ASN.1 Definition:
//
//	id-oa-pwdAlphabet                OBJECT IDENTIFIER ::= {id-oa 36}
var Id_oa_pwdAlphabet asn1.ObjectIdentifier = []int{2, 5, 18, 36}

// # ASN.1 Definition:
//
//	id-oa-pwdDictionaries            OBJECT IDENTIFIER ::= {id-oa 37}
var Id_oa_pwdDictionaries asn1.ObjectIdentifier = []int{2, 5, 18, 37}

// # ASN.1 Definition:
//
//	id-oa-pwdExpiryWarning           OBJECT IDENTIFIER ::= {id-oa 38}
var Id_oa_pwdExpiryWarning asn1.ObjectIdentifier = []int{2, 5, 18, 38}

// # ASN.1 Definition:
//
//	id-oa-pwdGraces                  OBJECT IDENTIFIER ::= {id-oa 39}
var Id_oa_pwdGraces asn1.ObjectIdentifier = []int{2, 5, 18, 39}

// # ASN.1 Definition:
//
//	id-oa-pwdFailureDuration         OBJECT IDENTIFIER ::= {id-oa 40}
var Id_oa_pwdFailureDuration asn1.ObjectIdentifier = []int{2, 5, 18, 40}

// # ASN.1 Definition:
//
//	id-oa-pwdLockoutDuration         OBJECT IDENTIFIER ::= {id-oa 41}
var Id_oa_pwdLockoutDuration asn1.ObjectIdentifier = []int{2, 5, 18, 41}

// # ASN.1 Definition:
//
//	id-oa-pwdMaxFailures             OBJECT IDENTIFIER ::= {id-oa 42}
var Id_oa_pwdMaxFailures asn1.ObjectIdentifier = []int{2, 5, 18, 42}

// # ASN.1 Definition:
//
//	id-oa-pwdMaxTimeInHistory        OBJECT IDENTIFIER ::= {id-oa 43}
var Id_oa_pwdMaxTimeInHistory asn1.ObjectIdentifier = []int{2, 5, 18, 43}

// # ASN.1 Definition:
//
//	id-oa-pwdMinTimeInHistory        OBJECT IDENTIFIER ::= {id-oa 44}
var Id_oa_pwdMinTimeInHistory asn1.ObjectIdentifier = []int{2, 5, 18, 44}

// # ASN.1 Definition:
//
//	id-oa-pwdHistorySlots            OBJECT IDENTIFIER ::= {id-oa 45}
var Id_oa_pwdHistorySlots asn1.ObjectIdentifier = []int{2, 5, 18, 45}

// # ASN.1 Definition:
//
//	id-oa-pwdRecentlyExpiredDuration OBJECT IDENTIFIER ::= {id-oa 46}
var Id_oa_pwdRecentlyExpiredDuration asn1.ObjectIdentifier = []int{2, 5, 18, 46}

// # ASN.1 Definition:
//
//	id-oa-pwdEncAlg                  OBJECT IDENTIFIER ::= {id-oa 47}
var Id_oa_pwdEncAlg asn1.ObjectIdentifier = []int{2, 5, 18, 47}

// # ASN.1 Definition:
//
//	id-mr-userPwdMatch               OBJECT IDENTIFIER ::= {id-mr 71}
var Id_mr_userPwdMatch asn1.ObjectIdentifier = []int{2, 5, 13, 71}

// # ASN.1 Definition:
//
//	id-mr-userPwdHistoryMatch        OBJECT IDENTIFIER ::= {id-mr 72}
var Id_mr_userPwdHistoryMatch asn1.ObjectIdentifier = []int{2, 5, 13, 72}

// # ASN.1 Definition:
//
//	id-mr-pwdEncAlgMatch             OBJECT IDENTIFIER ::= {id-mr 73}
var Id_mr_pwdEncAlgMatch asn1.ObjectIdentifier = []int{2, 5, 13, 73}

// # ASN.1 Definition:
//
//	id-asx-userPwdDescription        OBJECT IDENTIFIER ::= {id-asx 0}
var Id_asx_userPwdDescription asn1.ObjectIdentifier = []int{2, 5, 40, 0}

// # ASN.1 Definition:
//
//	id-asx-pwdVocabularyDescription  OBJECT IDENTIFIER ::= {id-asx 1}
var Id_asx_pwdVocabularyDescription asn1.ObjectIdentifier = []int{2, 5, 40, 1}

// # ASN.1 Definition:
//
//	id-asx-pwdAlphabetDescription    OBJECT IDENTIFIER ::= {id-asx 2}
var Id_asx_pwdAlphabetDescription asn1.ObjectIdentifier = []int{2, 5, 40, 2}

// # ASN.1 Definition:
//
//	id-asx-pwdEncAlgDescription      OBJECT IDENTIFIER ::= {id-asx 3}
var Id_asx_pwdEncAlgDescription asn1.ObjectIdentifier = []int{2, 5, 40, 3}

// # ASN.1 Definition:
//
//	UserPwd-encrypted ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type UserPwd_encrypted struct {
	AlgorithmIdentifier pkix.AlgorithmIdentifier
	EncryptedString     []byte
}
