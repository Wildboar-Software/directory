package x500_go

import (
	"encoding/asn1"
	"fmt"
	"net"
	"os"
	"testing"
)

func TestReadAnEntry(t *testing.T) {
	conn, err := net.Dial("tcp", "localhost:4632")
	if err != nil {
		os.Exit(1)
	}
	idm := IDMProtocolStack{
		socket:            conn,
		ReceivedData:      make([]byte, 0),
		NextInvokeId:      1,
		PendingOperations: make(map[int]*X500Operation),
		bound:             make(chan bool),
	}
	go idm.ProcessReceivedPDUs()
	err = idm.BindAnonymously()
	if err != nil {
		os.Exit(2)
	}
	invokeId := idm.GetNextInvokeId()
	dn := DistinguishedName{
		[]AttributeTypeAndValue{
			{
				Type: Id_at_commonName,
				Value: asn1.RawValue{
					Tag:        asn1.TagUTF8String,
					Class:      asn1.ClassUniversal,
					IsCompound: false,
					Bytes:      []byte("eis.select-nothing-2022-04-16T02:59:15.521Z"),
				},
			},
		},
	}
	name_bytes, err := asn1.Marshal(dn)
	if err != nil {
		os.Exit(6)
	}
	name := asn1.RawValue{FullBytes: name_bytes}
	arg_data := ReadArgumentData{
		Object: asn1.RawValue{
			Tag:        0,
			Class:      asn1.ClassContextSpecific,
			IsCompound: true,
			Bytes:      name.FullBytes,
		},
	}
	arg_bytes, err := asn1.MarshalWithParams(arg_data, "set")
	if err != nil {
		os.Exit(7)
		return
	}
	iidBytes, err := asn1.Marshal(invokeId)
	if err != nil {
		os.Exit(8)
		return
	}
	req := X500Request{
		InvokeId: asn1.RawValue{
			FullBytes: iidBytes,
		},
		OpCode: asn1.RawValue{
			Tag:        asn1.TagInteger,
			Class:      asn1.ClassUniversal,
			IsCompound: false,
			Bytes:      []byte{0x01}, // Read operation
		},
		Argument: asn1.RawValue{FullBytes: arg_bytes},
	}
	outcome, err := idm.Request(req)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(9)
		return
	}
	fmt.Printf("Received response: % x\n", outcome.Parameter.FullBytes)
	result := ReadResultData{}
	rest, err := asn1.UnmarshalWithParams(outcome.Parameter.FullBytes, &result, "set")
	if err != nil {
		os.Exit(11)
		return
	}
	if len(rest) > 0 {
		os.Exit(12)
		return
	}
	for _, info := range result.Entry.Information {
		if info.Tag == asn1.TagOID { // AttributeType
			oid := asn1.ObjectIdentifier{}
			rest, err := asn1.Unmarshal(info.FullBytes, &oid)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			fmt.Printf("Attribute Type: %s\n", oid.String())
		} else if info.Tag == asn1.TagSequence { // Attribute
			attr := Attribute{}
			rest, err := asn1.Unmarshal(info.FullBytes, &attr)
			if err != nil {
				continue
			}
			if len(rest) > 0 {
				continue
			}
			fmt.Printf("Attribute Type: %s\n", attr.Type.String())
			for _, value := range attr.Values {
				str, err := ASN1RawValueToStr(value)
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				if len(str) == 0 {
					fmt.Println("BULLSHIT")
				}
				fmt.Printf("  %s\n", str)
			}
			for _, vwc := range attr.ValuesWithContext {
				str, err := ASN1RawValueToStr(vwc.Value)
				if err != nil {
					fmt.Println(err.Error())
					continue
				}
				fmt.Printf("  %s (Has Contexts)\n", str)
			}
		} else { // Something else
			continue
		}
	}
}
