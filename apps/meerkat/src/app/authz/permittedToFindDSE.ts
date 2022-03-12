import type { Context, Vertex } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import accessControlSchemesThatUseACIItems from "./accessControlSchemesThatUseACIItems";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import bacSettings from "./bacSettings";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import getDistinguishedName from "../x500/getDistinguishedName";
import getACIItems from "./getACIItems";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import getIsGroupMember from "../authz/getIsGroupMember";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import preprocessTuples from "./preprocessTuples";
import rdnToID from "../dit/rdnToID";
import getVertexById from "../database/getVertexById";

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
 * Resolves a `boolean` indicating whether the user can discover a given DSE.
 * This function checks that every vertex from the top-level DSE down to the
 * target DSE can be discovered by the user.
 *
 * @param ctx The context object
 * @param assn The client association
 * @returns A `boolean` indicating whether the bound client may add a top-level DSE.
 *
 * @function
 * @async
 */
export
async function permittedToFindDSE (
    ctx: Context,
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

    for (let i = 0; i < needleDN.length; i++) {
        const id = await rdnToID(ctx, dse_i.dse.id, needleDN[i]);
        if (!id) {
            return ENTRY_NOT_FOUND;
        }
        accessControlScheme = (dse_i.dse.admPoint
            ? [ ...admPoints, dse_i ]
            : [ ...admPoints ])
                .reverse()
                .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        const vertex = await getVertexById(ctx, dse_i, id);
        if (!vertex) {
            return ENTRY_NOT_FOUND;
        }
        dse_i = vertex;
        if (dse_i.dse.admPoint?.accessControlScheme) {
            accessControlScheme = dse_i.dse.admPoint.accessControlScheme;
        }
        if ( // Check if the user can actually access it.
            accessControlScheme
            && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
        ) {
            const childDN = getDistinguishedName(dse_i);
            const objectClasses = Array.from(dse_i.dse.objectClass).map(ObjectIdentifier.fromString);
            // Without this, all first-level DSEs are discoverable.
            const relevantAdmPoints: Vertex[] = dse_i.dse.admPoint
                ? [ ...admPoints, dse_i ]
                : [ ...admPoints ];
            const relevantSubentries: Vertex[] = (await Promise.all(
                relevantAdmPoints.map((ap) => getRelevantSubentries(ctx, dse_i, childDN, ap)),
            )).flat();
            const targetACI = getACIItems(accessControlScheme, dse_i, relevantSubentries);
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
    }
    return {
        exists: true,
        permittedToFind: true,
        discloseOnError: authorizedToDiscloseOnError,
    };
}

export default permittedToFindDSE;
