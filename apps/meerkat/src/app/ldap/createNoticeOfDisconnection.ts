import { ObjectIdentifier } from "asn1-ts";
import {
    LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import {
    ExtendedResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ExtendedResponse.ta";
import type {
    LDAPResult_resultCode,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";

/**
 * @summary Creates an LDAP unsolicited notification
 * @description
 *
 * Creates an LDAP unsolicited notification as described in IETF RFC 4511,
 * Section 4.4.
 *
 * Note that this function does not _send_ the response. It merely creates it.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4511#section-4.4
 *
 * @param resultCode The result code of the notification
 * @param message The message of the notification
 * @returns The notification
 *
 * @function
 */
export
function createNoticeOfDisconnection (
    resultCode: LDAPResult_resultCode,
    message: string,
): LDAPMessage {
    return new LDAPMessage(
        0, // 0 is reserved for unsolicited notifications.
        {
            extendedResp: new ExtendedResponse(
                resultCode,
                new Uint8Array(),
                Buffer.from(message, "utf-8"),
                undefined,
                encodeLDAPOID(new ObjectIdentifier([ 1, 3, 6, 1, 4, 1, 1466, 20036 ])),
                undefined,
            ),
        },
        undefined,
    );
}

export default createNoticeOfDisconnection;
