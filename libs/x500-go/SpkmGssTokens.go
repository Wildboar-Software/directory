package x500_go

import (
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
//	SPKM-REQ ::= SEQUENCE {
//	  requestToken  REQ-TOKEN,
//	  certif-data   [0]  CertificationData OPTIONAL,
//	  auth-data     [1]  AuthorizationData OPTIONAL
//	}
type SPKM_REQ struct {
	RequestToken REQ_TOKEN
	Certif_data  CertificationData `asn1:"optional,tag:0"`
	Auth_data    AuthorizationData `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	CertificationData ::= SEQUENCE {
//	  certificationPath          [0]  CertificationPath OPTIONAL,
//	  certificateRevocationList  [1]  CertificateList OPTIONAL
//	}
type CertificationData struct {
	CertificationPath         SPKMCertificationPath `asn1:"optional,tag:0"`
	CertificateRevocationList x509.RevocationList   `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	CertificationPath ::= SEQUENCE {
//	  userKeyId          [0]  OCTET STRING OPTIONAL,
//	  userCertif         [1]  Certificate OPTIONAL,
//	  verifKeyId         [2]  OCTET STRING OPTIONAL,
//	  userVerifCertif    [3]  Certificate OPTIONAL,
//	  theCACertificates  [4]  SEQUENCE OF CertificatePair OPTIONAL
//	}
type SPKMCertificationPath struct {
	UserKeyId         []byte              `asn1:"optional,tag:0"`
	UserCertif        x509.Certificate    `asn1:"optional,tag:1"`
	VerifKeyId        []byte              `asn1:"optional,tag:2"`
	UserVerifCertif   x509.Certificate    `asn1:"optional,tag:3"`
	TheCACertificates [](CertificatePair) `asn1:"optional,tag:4"`
}

// # ASN.1 Definition:
//
//	REQ-TOKEN ::= SEQUENCE {
//	  req-contents   Req-contents,
//	  algId          AlgorithmIdentifier{{SupportedAlgorithms}},
//	  req-integrity  Integrity -- "token" is Req-contents
//	}
type REQ_TOKEN struct {
	Req_contents  Req_contents
	AlgId         pkix.AlgorithmIdentifier
	Req_integrity Integrity
}

// # ASN.1 Definition:
//
//	Integrity ::= BIT STRING
type Integrity = asn1.BitString

// # ASN.1 Definition:
//
//	Req-contents ::= SEQUENCE {
//	  tok-id        INTEGER(256), -- shall contain 0100 (hex)
//	  context-id    Random-Integer,
//	  pvno          BIT STRING,
//	  timestamp     UTCTime OPTIONAL, -- mandatory for SPKM-2
//	  randSrc       Random-Integer,
//	  targ-name     Name,
//	  src-name      [0]  Name OPTIONAL,
//	  req-data      Context-Data,
//	  validity      [1]  Validity OPTIONAL,
//	  key-estb-set  Key-Estb-Algs,
//	  key-estb-req  BIT STRING OPTIONAL,
//	  key-src-bind  OCTET STRING OPTIONAL
//	  -- This field must be present for the case of SPKM-2
//	  -- unilateral authen. if the K-ALG in use does not provide
//	  -- such a binding (but is optional for all other cases).
//	  -- The octet string holds the result of applying the
//	  -- mandatory hashing procedure (in MANDATORY I-ALG;
//	  -- see Section 2.1) as follows:  MD5(src || context_key),
//	  -- where "src" is the DER-encoded octets of src-name,
//	  -- "context-key" is the symmetric key (i.e., the
//	  -- unprotected version of what is transmitted in
//	  -- key-estb-req), and "||" is the concatenation operation.
//	}
type Req_contents struct {
	Tok_id       int
	Context_id   Random_Integer
	Pvno         asn1.BitString
	Timestamp    time.Time `asn1:"optional"`
	RandSrc      Random_Integer
	Targ_name    Name
	Src_name     Name `asn1:"optional,tag:0"`
	Req_data     Context_Data
	Validity     Validity `asn1:"optional,tag:1"`
	Key_estb_set Key_Estb_Algs
	Key_estb_req asn1.BitString `asn1:"optional"`
	Key_src_bind []byte         `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	Random-Integer ::= BIT STRING
type Random_Integer = asn1.BitString

// # ASN.1 Definition:
//
//	Context-Data ::= SEQUENCE {
//	  channelId   ChannelId OPTIONAL,
//	  seq-number  INTEGER OPTIONAL,
//	  options     Options,
//	  conf-alg    Conf-Algs,
//	  intg-alg    Intg-Algs,
//	  owf-alg     OWF-Algs
//	}
type Context_Data struct {
	ChannelId  ChannelId `asn1:"optional"`
	Seq_number int       `asn1:"optional"`
	Options    Options
	Conf_alg   Conf_Algs
	Intg_alg   Intg_Algs
	Owf_alg    OWF_Algs
}

// # ASN.1 Definition:
//
//	ChannelId ::= OCTET STRING
type ChannelId = []byte

// # ASN.1 Definition:
//
//	Options ::= BIT STRING {
//	  delegation-state(0), mutual-state(1), replay-det-state(2), sequence-state(3),
//	  conf-avail(4), integ-avail(5), target-certif-data-required(6)}
type Options = asn1.BitString

const Options_Delegation_state int32 = 0

const Options_Mutual_state int32 = 1

const Options_Replay_det_state int32 = 2

const Options_Sequence_state int32 = 3

const Options_Conf_avail int32 = 4

const Options_Integ_avail int32 = 5

const Options_Target_certif_data_required int32 = 6

// # ASN.1 Definition:
//
//	Conf-Algs ::= CHOICE {
//	  algs  [0]  SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}},
//	  null  [1]  NULL
//	}
type Conf_Algs = asn1.RawValue

// # ASN.1 Definition:
//
//	Intg-Algs ::= SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}}
type Intg_Algs = [](pkix.AlgorithmIdentifier)

// # ASN.1 Definition:
//
//	OWF-Algs ::= SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}}
type OWF_Algs = [](pkix.AlgorithmIdentifier)

// # ASN.1 Definition:
//
//	Key-Estb-Algs ::= SEQUENCE OF AlgorithmIdentifier{{SupportedAlgorithms}}
type Key_Estb_Algs = [](pkix.AlgorithmIdentifier)

// # ASN.1 Definition:
//
//	SPKM-REP-TI ::= SEQUENCE {
//	  responseToken  REP-TI-TOKEN,
//	  certif-data    CertificationData OPTIONAL
//	  -- present if target-certif-data-required option was
//	}
type SPKM_REP_TI struct {
	ResponseToken REP_TI_TOKEN
	Certif_data   CertificationData `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	REP-TI-TOKEN ::= SEQUENCE {
//	  rep-ti-contents  Rep-ti-contents,
//	  algId            AlgorithmIdentifier{{SupportedAlgorithms}},
//	  rep-ti-integ     Integrity -- "token" is Rep-ti-contents
//	}
type REP_TI_TOKEN struct {
	Rep_ti_contents Rep_ti_contents
	AlgId           pkix.AlgorithmIdentifier
	Rep_ti_integ    Integrity
}

// # ASN.1 Definition:
//
//	Rep-ti-contents ::= SEQUENCE {
//	  tok-id        INTEGER(512), -- shall contain 0200 (hex)
//	  context-id    Random-Integer,
//	  pvno          [0]  BIT STRING OPTIONAL,
//	  timestamp     UTCTime OPTIONAL, -- mandatory for SPKM-2
//	  randTarg      Random-Integer,
//	  src-name      [1]  Name OPTIONAL,
//	  targ-name     Name,
//	  randSrc       Random-Integer,
//	  rep-data      Context-Data,
//	  validity      [2]  Validity OPTIONAL,
//	  key-estb-id   AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
//	  key-estb-str  BIT STRING OPTIONAL
//	}
type Rep_ti_contents struct {
	Tok_id       int
	Context_id   Random_Integer
	Pvno         asn1.BitString `asn1:"optional,tag:0"`
	Timestamp    time.Time      `asn1:"optional"`
	RandTarg     Random_Integer
	Src_name     Name `asn1:"optional,tag:1"`
	Targ_name    Name
	RandSrc      Random_Integer
	Rep_data     Context_Data
	Validity     Validity                 `asn1:"optional,tag:2"`
	Key_estb_id  pkix.AlgorithmIdentifier `asn1:"optional"`
	Key_estb_str asn1.BitString           `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	SPKM-REP-IT ::= SEQUENCE {
//	  responseToken  REP-IT-TOKEN,
//	  algId          AlgorithmIdentifier{{SupportedAlgorithms}},
//	  rep-it-integ   Integrity -- "token" is REP-IT-TOKEN
//	}
type SPKM_REP_IT struct {
	ResponseToken REP_IT_TOKEN
	AlgId         pkix.AlgorithmIdentifier
	Rep_it_integ  Integrity
}

// # ASN.1 Definition:
//
//	REP-IT-TOKEN ::= SEQUENCE {
//	  tok-id        INTEGER(768), -- shall contain 0300 (hex)
//	  context-id    Random-Integer,
//	  randSrc       Random-Integer,
//	  randTarg      Random-Integer,
//	  targ-name     Name,
//	  src-name      Name OPTIONAL,
//	  key-estb-rep  BIT STRING OPTIONAL
//	}
type REP_IT_TOKEN struct {
	Tok_id       int
	Context_id   Random_Integer
	RandSrc      Random_Integer
	RandTarg     Random_Integer
	Targ_name    Name
	Src_name     Name           `asn1:"optional"`
	Key_estb_rep asn1.BitString `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	SPKM-ERROR ::= SEQUENCE {
//	  errorToken  ERROR-TOKEN,
//	  algId       AlgorithmIdentifier{{SupportedAlgorithms}},
//	  integrity   Integrity -- "token" is ERROR-TOKEN
//	}
type SPKM_ERROR struct {
	ErrorToken ERROR_TOKEN
	AlgId      pkix.AlgorithmIdentifier
	Integrity  Integrity
}

// # ASN.1 Definition:
//
//	ERROR-TOKEN ::= SEQUENCE {
//	  tok-id      INTEGER(1024), -- shall contain 0400 (hex)
//	  context-id  Random-Integer
//	}
type ERROR_TOKEN struct {
	Tok_id     int
	Context_id Random_Integer
}

// # ASN.1 Definition:
//
//	SPKM-MIC ::= SEQUENCE {
//	     mic-header  Mic-Header,
//		 int-cksum   BIT STRING }
type SPKM_MIC struct {
	Mic_header Mic_Header
	Int_cksum  asn1.BitString
}

// # ASN.1 Definition:
//
//	Mic-Header ::= SEQUENCE {
//	  tok-id      INTEGER(257), -- shall contain 0101 (hex)
//	  context-id  Random-Integer,
//	  int-alg     [0]  AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
//	  snd-seq     [1]  SeqNum OPTIONAL
//	}
type Mic_Header struct {
	Tok_id     int
	Context_id Random_Integer
	Int_alg    pkix.AlgorithmIdentifier `asn1:"optional,tag:0"`
	Snd_seq    SeqNum                   `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	SeqNum ::= SEQUENCE {
//	   num      INTEGER,
//	   dir-ind  BOOLEAN }
type SeqNum struct {
	Num     int
	Dir_ind bool
}

// # ASN.1 Definition:
//
//	SPKM-WRAP ::= SEQUENCE {
//	    wrap-header  Wrap-Header,
//	    wrap-body    Wrap-Body }
type SPKM_WRAP struct {
	Wrap_header Wrap_Header
	Wrap_body   Wrap_Body
}

// # ASN.1 Definition:
//
//	Wrap-Header ::= SEQUENCE {
//	  tok-id      INTEGER(513), -- shall contain 0201 (hex)
//	  context-id  Random-Integer,
//	  int-alg     [0]  AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
//	  conf-alg    [1]  Conf-Alg OPTIONAL,
//	  snd-seq     [2]  SeqNum OPTIONAL
//	}
type Wrap_Header struct {
	Tok_id     int
	Context_id Random_Integer
	Int_alg    pkix.AlgorithmIdentifier `asn1:"optional,tag:0"`
	Conf_alg   Conf_Alg                 `asn1:"optional,tag:1"`
	Snd_seq    SeqNum                   `asn1:"optional,tag:2"`
}

// # ASN.1 Definition:
//
//	Wrap-Body ::= SEQUENCE {
//	     int-cksum  BIT STRING,
//	     data       BIT STRING }
type Wrap_Body struct {
	Int_cksum asn1.BitString
	Data      asn1.BitString
}

// # ASN.1 Definition:
//
//	Conf-Alg ::= CHOICE {
//	  algId  [0]  AlgorithmIdentifier{{SupportedAlgorithms}},
//	  null   [1]  NULL
//	}
type Conf_Alg = asn1.RawValue

// # ASN.1 Definition:
//
//	SPKM-DEL ::= SEQUENCE {
//	     del-header  Del-Header,
//	     int-cksum   BIT STRING }
type SPKM_DEL struct {
	Del_header Del_Header
	Int_cksum  asn1.BitString
}

// # ASN.1 Definition:
//
//	Del-Header ::= SEQUENCE {
//	  tok-id      INTEGER(769), -- shall contain 0301 (hex)
//	  context-id  Random-Integer,
//	  int-alg     [0]  AlgorithmIdentifier{{SupportedAlgorithms}} OPTIONAL,
//	  snd-seq     [1]  SeqNum OPTIONAL
//	}
type Del_Header struct {
	Tok_id     int
	Context_id Random_Integer
	Int_alg    pkix.AlgorithmIdentifier `asn1:"optional,tag:0"`
	Snd_seq    SeqNum                   `asn1:"optional,tag:1"`
}

// # ASN.1 Definition:
//
//	MechType ::= OBJECT IDENTIFIER
type MechType = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	InitialContextToken ::= [APPLICATION 0] IMPLICIT SEQUENCE {
//	  thisMech           MechType,
//	  innerContextToken  SPKMInnerContextToken
//	}
type InitialContextToken struct {
	ThisMech          MechType
	InnerContextToken SPKMInnerContextToken
}

// # ASN.1 Definition:
//
//	SPKMInnerContextToken ::= CHOICE {
//	  req     [0]  SPKM-REQ,
//	  rep-ti  [1]  SPKM-REP-TI,
//	  rep-it  [2]  SPKM-REP-IT,
//	  error   [3]  SPKM-ERROR,
//	  mic     [4]  SPKM-MIC,
//	  wrap    [5]  SPKM-WRAP,
//	  del     [6]  SPKM-DEL
//	}
type SPKMInnerContextToken = asn1.RawValue

// # ASN.1 Definition:
//
//	  AuthorizationData ::= SEQUENCE OF SEQUENCE {ad-type  INTEGER,
//		                      ad-data  OCTET STRING}
type AuthorizationData = [](AuthorizationData_Item)

// # ASN.1 Definition:
//
//	md5-DES-CBC OBJECT IDENTIFIER ::= {iso(1) identified-organization(3) dod(6) internet(1) security(5) integrity(3) md5-DES-CBC(1)}
var Md5_DES_CBC asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 3, 1}

// # ASN.1 Definition:
//
//	sum64-DES-CBC OBJECT IDENTIFIER ::= {iso(1) identified-organization(3) dod(6) internet(1) security(5) integrity(3) sum64-DES-CBC(2)}
var Sum64_DES_CBC asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 3, 2}

// # ASN.1 Definition:
//
//	spkm-1 OBJECT IDENTIFIER ::= {iso(1) identified-organization(3) dod(6) internet(1) security(5) mechanisms(5) spkm(1) spkm-1(1)}
var Spkm_1 asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 1, 1}

// # ASN.1 Definition:
//
//	spkm-2 OBJECT IDENTIFIER ::= {iso(1) identified-organization(3) dod(6) internet(1) security(5) mechanisms(5) spkm(1) spkm-2(2)}
var Spkm_2 asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 1, 2}

// # ASN.1 Definition:
//
//	AuthorizationData-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type AuthorizationData_Item struct {
	Ad_type int
	Ad_data []byte
}
