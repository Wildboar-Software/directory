import type { Context } from "@wildboar/meerkat-types";
import type {
    GeneralName,
} from "@wildboar/x500/CertificateExtensions";
import { stringifyDN } from "./stringifyDN";
import { directoryStringToString } from "@wildboar/x500";

/**
 * @summary Convert a general name to a string
 * @description
 *
 * This function converts a `GeneralName` to a string according to the
 * procedures defined for the Lightweight Directory Access Protocol (LDAP), as
 * described in [IETF RFC 4514](https://datatracker.ietf.org/doc/html/rfc4514),
 * EXCEPT that it does not reverse the ordering of RDNs in the distinguished
 * name. (LDAP, for some reason, reverses the ordering of RDNs from that used by
 * X.500 directory systems, so this implementation does not do that.)
 *
 * @param ctx The context object
 * @param gn The distinguished name to be converted to a string
 * @returns The string representation of the distinguished name
 *
 * @function
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4514}
 */
export
function stringifyGN (
    ctx: Context,
    gn: GeneralName,
): string {
    const key = Object.keys(gn)[0];
    if ("otherName" in gn) {
        // TODO: Do something a little more thorough than this.
        return `${key}:[Cannot display OTHER-NAME]`;
    } else if ("rfc822Name" in gn) {
        return `${key}:${gn.rfc822Name}`;
    } else if ("dNSName" in gn) {
        return `${key}:${gn.dNSName}`;
    } else if ("x400Address" in gn) {
        // TODO: Do something a little more thorough than this.
        return `${key}:[Cannot display X.400 address]`;
    } else if ("directoryName" in gn) {
        return `${key}:${stringifyDN(ctx, gn.directoryName.rdnSequence)}`;
    } else if ("ediPartyName" in gn) {
        if (gn.ediPartyName.nameAssigner) {
            return `${key}:${directoryStringToString(gn.ediPartyName.nameAssigner)}:${directoryStringToString(gn.ediPartyName.partyName)}`;
        } else {
            return `${key}:${directoryStringToString(gn.ediPartyName.partyName)}`;
        }
    } else if ("uniformResourceIdentifier" in gn) {
        return `${key}:${gn.uniformResourceIdentifier}`;
    } else if ("iPAddress" in gn) {
        return `${key}:${Array.from(gn.iPAddress).join(".")}`;
    } else if ("registeredID" in gn) {
        return `${key}:${gn.registeredID.toString()}`;
    } else {
        return "[Unrecognized GeneralName alternative]";
    }
}

export default stringifyDN;
