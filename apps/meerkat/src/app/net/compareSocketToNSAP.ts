import type { Socket } from "net";
import { TLSSocket, checkServerIdentity } from "tls";
import type { OCTET_STRING } from "asn1-ts";
import { lookup } from "dns/promises";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import { URL } from "url";

// TODO: Put this in the X.500 library.
const commonPrefix: number[] = [
    0x54, // The AFI
    0x00, 0x72, 0x87, 0x22, // The IDI
];

export
async function compareSocketToNSAP (
    socket: Socket | TLSSocket,
    nsap: OCTET_STRING,
): Promise<boolean> {
    if (nsap[0] === 0xFF) { // It is a URL.
        try {
            const [ idi, uri ] = uriFromNSAP(nsap);
            switch (idi) {
                case (0):
                case (1): {
                    const url = new URL(uri);
                    const hostname = url.hostname;
                    if ("encrypted" in socket) {
                        const cert = socket.getPeerCertificate();
                        const error = checkServerIdentity(hostname, cert);
                        return !error;
                    }
                    const addresses = await lookup(hostname, {
                        all: true,
                    });
                    for (const address of addresses) {
                        if (address.address.toLowerCase() === socket.remoteAddress?.toLowerCase()) {
                            return true;
                        }
                    }
                    return false;
                }
                default: {
                    return false; // Not understood.
                }
            }
        } catch {
            return false;
        }
    }
    // Otherwise, the only other format Meerkat recognizes are the IPv4 formats.
    for (let i = 0; i < commonPrefix.length; i++) {
        if (nsap[i] !== commonPrefix[i]) {
            return false;
        }
    }
    const [ , ipv4 ] = ipv4FromNSAP(nsap);
    const ip: string = Array.from(ipv4).join(".");
    return (ip === socket.remoteAddress);
}

export default compareSocketToNSAP;
