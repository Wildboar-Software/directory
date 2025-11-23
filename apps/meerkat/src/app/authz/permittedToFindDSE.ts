import type { ClientAssociation, Context, Vertex } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "@wildboar/asn1";
import { type ACDFTuple } from "@wildboar/x500";
import { type ACDFTupleExtended } from "@wildboar/x500";
import {
    bacACDF,
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500";
import accessControlSchemesThatUseACIItems from "./accessControlSchemesThatUseACIItems";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import bacSettings from "./bacSettings";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import getDistinguishedName from "../x500/getDistinguishedName";
import getACIItems from "./getACIItems";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import { getACDFTuplesFromACIItem } from "@wildboar/x500";
import getIsGroupMember from "../authz/getIsGroupMember";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/BasicAccessControl";
import preprocessTuples from "./preprocessTuples";
import accessControlSchemesThatUseRBAC from "./accessControlSchemesThatUseRBAC";
import dnToVertex from "../dit/dnToVertex";
import permittedToFindDseViaRbac from "./permittedToFindDseViaRbac";

export
interface PermittedToFindDSEReturn {
    readonly exists?: boolean;
    readonly permittedToFind: boolean;
    readonly discloseOnError: boolean;
}

const ENTRY_NOT_FOUND: PermittedToFindDSEReturn = {
    exists: false,
    discloseOnError: true,
    permittedToFind: true,
};

/**
 * @summary Whether a user is permitted to find a given DSE.
 * @description
 *
 * Determines whether the user can discover a given DSE.
 * This function checks that every vertex from the top-level DSE down to the
 * target DSE can be discovered by the user.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param root The root of the DIT to begin evaluating access
 * @param needleDN The distinguished name whose discoverability is to be determined.
 * @param user The name and UID of the user requesting access
 * @param authLevel The authentication level of the user.
 * @returns Information about the discoverability of the entry, including
 *  whether it really exists or not.
 *
 * @function
 * @async
 */
export
async function permittedToFindDSE (
    ctx: Context,
    assn: ClientAssociation,
    root: Vertex,
    needleDN: DistinguishedName,
    user: NameAndOptionalUID | undefined | null,
    authLevel: AuthenticationLevel,
): Promise<PermittedToFindDSEReturn> {
    let dse_i: Vertex = root;
    const admPoints: Vertex[] = [];
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    let accessControlScheme: OBJECT_IDENTIFIER | undefined;
    let authorizedToDiscloseOnError: boolean = false;
    const subentriesCache: Map<number, Vertex[]> = new Map();

    for (let i = 0; i < needleDN.length; i++) {
        const rdn = needleDN[i];
        const vertex = await dnToVertex(ctx, dse_i, [ rdn ]);
        if (!vertex) {
            return ENTRY_NOT_FOUND;
        }
        accessControlScheme = (dse_i.dse.admPoint
            ? [ ...admPoints, dse_i ]
            : [ ...admPoints ])
                .reverse()
                .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        dse_i = vertex;
        if (dse_i.dse.admPoint?.accessControlScheme) {
            accessControlScheme = dse_i.dse.admPoint.accessControlScheme;
        }
        if (!accessControlScheme) {
            continue;
        }
        const acs = accessControlScheme.toString();
        if (accessControlSchemesThatUseACIItems.has(acs)) {
            const childDN = getDistinguishedName(dse_i);
            const objectClasses = Array.from(dse_i.dse.objectClass).map(ObjectIdentifier.fromString);
            // Without this, all first-level DSEs are discoverable.
            const relevantAdmPoints: Vertex[] = dse_i.dse.admPoint
                ? [ ...admPoints, dse_i ]
                : [ ...admPoints ];
            const relevantSubentries: Vertex[] = (await Promise.all(
                relevantAdmPoints.map((ap) => getRelevantSubentries(
                    ctx,
                    dse_i,
                    childDN,
                    ap,
                    undefined,
                    subentriesCache,
                )),
            )).flat();
            const targetACI = await getACIItems(
                ctx,
                accessControlScheme,
                dse_i.immediateSuperior,
                dse_i,
                relevantSubentries,
                Boolean(dse_i.dse.subentry),
            );
            const acdfTuples: ACDFTuple[] = (targetACI ?? [])
                .flatMap((aci) => getACDFTuplesFromACIItem(aci));
            const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
                accessControlScheme,
                acdfTuples,
                user,
                authLevel,
                childDN,
                isMemberOfGroup,
                NAMING_MATCHER,
            );
            /**
             * We ignore entries for which browse and returnDN permissions
             * are not granted. This is not specified in the Find DSE
             * procedure, but it is important for preventing information
             * disclosure vulnerabilities.
             */
            const { authorized: authorizedToFind } = bacACDF(
                relevantTuples,
                user,
                { entry: objectClasses },
                [ PERMISSION_CATEGORY_BROWSE, PERMISSION_CATEGORY_RETURN_DN ],
                bacSettings,
                true,
            );
            authorizedToDiscloseOnError = bacACDF(
                relevantTuples,
                user,
                { entry: objectClasses },
                [ PERMISSION_CATEGORY_DISCLOSE_ON_ERROR ],
                bacSettings,
                true,
            ).authorized;
            if (!authorizedToFind) {
                return {
                    // We can't say with certainty that it does NOT exist unless we're on the last iteration.
                    exists: (i === (needleDN.length - 1)) || undefined,
                    permittedToFind: false,
                    discloseOnError: authorizedToDiscloseOnError,
                };
            }
        }
        if (accessControlSchemesThatUseRBAC.has(acs)) {
            const authorized: boolean = await permittedToFindDseViaRbac(ctx, assn, dse_i);
            if (!authorized) {
                return {
                    // We can't say with certainty that it does NOT exist unless we're on the last iteration.
                    exists: (i === (needleDN.length - 1)) || undefined,
                    permittedToFind: false,
                    discloseOnError: false,
                };
            }
        }
    }
    return {
        exists: true,
        permittedToFind: true,
        discloseOnError: authorizedToDiscloseOnError,
    };
}

export default permittedToFindDSE;
