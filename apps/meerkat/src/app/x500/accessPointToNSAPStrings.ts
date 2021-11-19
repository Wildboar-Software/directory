import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";

// FIXME: Remove this. Convert nAddress to string.
export
function *accessPointToNSAPStrings (ap: AccessPoint): IterableIterator<string> {
    for (const naddr of ap.address.nAddresses) {
        try {
            if (
                (naddr[0] === 0x54)
                && (naddr[1] === 0x00)
                && (naddr[2] === 0x72)
                && (naddr[3] === 0x87)
                && (naddr[4] === 0x22)
            ) {
                const [ type, ipv4, port ] = ipv4FromNSAP(naddr);
                const protocol: string = ({
                    0x10: "idm",
                    0x03: "itot",
                    0x11: "ldap",
                })[type] ?? "unknown";
                if (port) {
                    yield `${protocol}://${ipv4}:${port}`;
                } else {
                    yield `${protocol}://${ipv4}`;
                }
            } else if (naddr[0] === 0xFF) { // It is a long address
                const [ , uriString ] = uriFromNSAP(naddr);
                yield uriString;
            }
        } catch {
            continue;
        }
    }
    return;
}

export default accessPointToNSAPStrings;
