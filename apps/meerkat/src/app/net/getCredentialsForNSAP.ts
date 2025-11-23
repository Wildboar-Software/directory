import type { Context } from "@wildboar/meerkat-types";
import rdnFromJson from "../x500/rdnFromJson";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import type {
    DSACredentials,
} from "@wildboar/x500/DistributedOperations";
import {
    SimpleCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    HASH,
} from "@wildboar/x500/AuthenticationFramework";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";
import { BERElement, ObjectIdentifier, unpackBits } from "@wildboar/asn1";

/**
 * @summary Get credentials to try when establishing a connection to a remote DSA
 * @description
 *
 * This function reads credentials to attempt when accessing a remote DSA from
 * the database.
 *
 * @param ctx The context object
 * @param url The URL of the NSAP
 * @returns An array of credentials to try
 *
 * @function
 * @async
 */
export
async function getCredentialsForNSAP (
    ctx: Context,
    url: string,
): Promise<DSACredentials[]> {
    return (await ctx.db.accessPoint.findMany({
        where: {
            active: true,
            NSAP: {
                some: {
                    url,
                },
            },
        },
        select: {
            credentials: true,
        },
    }))
        .flatMap((ap) => ap.credentials)
        .flatMap((c): DSACredentials[] => {
            const ret: DSACredentials[] = [];
            let name: DistinguishedName | undefined;
            if (c.simple_name && Array.isArray(c.simple_name)) {
                name = c.simple_name.map(rdnFromJson);
                if (
                    c.simple_password_hash_algorithm_oid
                    && c.simple_password_hash_value
                ) {
                    const hash = new HASH(
                        new AlgorithmIdentifier(
                            ObjectIdentifier.fromString(c.simple_password_hash_algorithm_oid),
                            c.simple_password_hash_algorithm_parameters
                                ? (() => {
                                    const el = new BERElement();
                                    el.fromBytes(c.simple_password_hash_algorithm_parameters);
                                    return el;
                                })()
                                : undefined,
                        ),
                        unpackBits(c.simple_password_hash_value),
                    );
                    ret.push({
                        simple: new SimpleCredentials(
                            name,
                            undefined,
                            {
                                protected_: hash,
                            },
                        ),
                    });
                }
                if (c.simple_password_unprotected) {
                    ret.push({
                        simple: new SimpleCredentials(
                            name,
                            undefined,
                            {
                                unprotected: c.simple_password_unprotected,
                            },
                        ),
                    });
                }
                ret.push({
                    simple: new SimpleCredentials(
                        name,
                        undefined,
                    ),
                });
            }
            if (c.strong_pkcs12) {
                // TODO: Decode this and use it to produce strong credentials.
                // Actually, this might not work, because strong credentials
                // have a timestamp in them, and you might have to spend a few
                // seconds or minutes chaining to other DSAs, which would
                // invalidate this timestamp.
            }
            return ret;
        }) ?? [];
}

export default getCredentialsForNSAP;
