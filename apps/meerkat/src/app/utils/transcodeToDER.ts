import { ASN1Element, DERElement } from "asn1-ts";
import { DER, ASN1Decoder, ASN1Encoder } from "asn1-ts/dist/node/functional";

// TODO: This is not currently used anywhere.
export
function transcodeToDER <T> (
    encoded: ASN1Element,
    decoder: ASN1Decoder<T>,
    encoder: ASN1Encoder<T>,
): DERElement {
    const decoded = decoder(encoded);
    return encoder(decoded, DER) as DERElement;
}

export default transcodeToDER;
