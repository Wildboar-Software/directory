package x500_go

import (
	"encoding/asn1"
	"errors"
	"fmt"
)

func ASN1RawValueToStr(value asn1.RawValue) (output string, err error) {
	if value.Class != asn1.ClassUniversal {
		// TODO: Something better than this.
		return fmt.Sprintf("% x", value.FullBytes), nil
	}
	switch value.Tag {
	case asn1.TagBoolean:
		{
			if len(value.Bytes) == 0 {
				return "ERROR", errors.New("BOOLEAN encoded on zero bytes")
			}
			if value.Bytes[0] > 0 {
				return "TRUE", nil
			} else {
				return "FALSE", nil
			}
		}
	case asn1.TagInteger:
		fallthrough
	case asn1.TagEnum:
		{
			var decoded int64 = 0
			rest, err := asn1.Unmarshal(value.FullBytes, &decoded)
			if err != nil {
				return "?", err
			}
			if len(rest) > 0 {
				return "?", err
			}
			return fmt.Sprint(decoded), nil
		}
	case asn1.TagOctetString:
		{
			return fmt.Sprint("% x", value.Bytes), nil
		}
	case asn1.TagNull:
		{
			return "NULL", nil
		}
	case asn1.TagOID:
		{
			oid := asn1.ObjectIdentifier{}
			rest, err := asn1.Unmarshal(value.FullBytes, &oid)
			if err != nil {
				return "?", err
			}
			if len(rest) > 0 {
				return "?", err
			}
			return oid.String(), nil
		}
	case asn1.TagUTF8String:
		fallthrough
	case asn1.TagNumericString:
		fallthrough
	case asn1.TagPrintableString:
		fallthrough
	case asn1.TagT61String:
		fallthrough
	case asn1.TagIA5String:
		fallthrough
	case asn1.TagGeneralString:
		fallthrough
	case asn1.TagGeneralizedTime:
		fallthrough
	case asn1.TagUTCTime:
		{
			return string(value.Bytes[:]), nil
		}
	default:
		{
			return fmt.Sprintf("% x", value.FullBytes), nil
		}
	}
}
