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
import readSubordinates from "../dit/readSubordinates";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
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


const MAX_DEPTH: number = 10000;

export
interface PermittedToFindDSEReturn {
    exists?: boolean;
    permittedToFind: boolean;
    discloseOnError: boolean;
}

export
async function permittedToFindDSE (
    ctx: Context,
    needleDN: DistinguishedName,
    user: NameAndOptionalUID | undefined | null,
    authLevel: AuthenticationLevel,
): Promise<PermittedToFindDSEReturn> {
    let i: number = 0;
    let dse_i: Vertex = ctx.dit.root;
    const m: number = needleDN.length;
    const admPoints: Vertex[] = [];
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    let accessControlScheme: OBJECT_IDENTIFIER | undefined;
    let authorizedToDiscloseOnError: boolean = false;
    let iterations: number = 0;
    while (iterations < MAX_DEPTH) {
        iterations++;
        if (i === m) {
            return {
                exists: true,
                permittedToFind: true,
                discloseOnError: true,
            };
        }
        const needleRDN = needleDN[i];
        let rdnMatched: boolean = false;
        accessControlScheme = (dse_i.dse.admPoint
            ? [ ...admPoints, dse_i ]
            : [ ...admPoints ])
                .reverse()
                .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
        let cursorId: number | undefined;
        const getNextBatchOfSubordinates = async () => {
            if (rdnMatched) {
                return [];
            }
            return readSubordinates(
                ctx,
                dse_i,
                ctx.config.entriesPerSubordinatesPage,
                undefined,
                cursorId,
                {
                    AND: needleRDN.map((atav) => ({
                        RDN: {
                            some: {
                                type: atav.type_.toString(),
                            },
                        },
                    })),
                },
            );
        };
        let subordinatesInBatch = await getNextBatchOfSubordinates();
        while (subordinatesInBatch.length) {
            for (const child of subordinatesInBatch) {
                cursorId = child.dse.id;
                // if (op?.abandonTime) {
                //     op.events.emit("abandon");
                //     throw new errors.AbandonError(
                //         ctx.i18n.t("err:abandoned"),
                //         new AbandonedData(
                //             undefined,
                //             [],
                //             createSecurityParameters(
                //                 ctx,
                //                 conn.boundNameAndUID?.dn,
                //                 undefined,
                //                 abandoned["&errorCode"],
                //             ),
                //             ctx.dsa.accessPoint.ae_title.rdnSequence,
                //             state.chainingArguments.aliasDereferenced,
                //             undefined,
                //         ),
                //     );
                // }
                // checkTimeLimit();
                rdnMatched = compareRDN(
                    needleRDN,
                    child.dse.rdn,
                    getNamingMatcherGetter(ctx),
                );
                if (rdnMatched) {
                    if (child.dse.admPoint?.accessControlScheme) {
                        accessControlScheme = child.dse.admPoint.accessControlScheme;
                    }
                    if ( // Check if the user can actually access it.
                        accessControlScheme
                        && accessControlSchemesThatUseACIItems.has(accessControlScheme.toString())
                    ) {
                        const childDN = getDistinguishedName(child);
                        const objectClasses = Array.from(child.dse.objectClass).map(ObjectIdentifier.fromString);
                        // Without this, all first-level DSEs are discoverable.
                        const relevantAdmPoints: Vertex[] = child.dse.admPoint
                            ? [ ...admPoints, child ]
                            : [ ...admPoints ];
                        const relevantSubentries: Vertex[] = (await Promise.all(
                            relevantAdmPoints.map((ap) => getRelevantSubentries(ctx, child, childDN, ap)),
                        )).flat();
                        const targetACI = getACIItems(accessControlScheme, child, relevantSubentries);
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
                                permittedToFind: false,
                                discloseOnError: authorizedToDiscloseOnError,
                            };
                        }
                    }
                    i++;
                    dse_i = child;
                    break;
                }
            }
            if (rdnMatched) {
                break;
            }
            subordinatesInBatch = await getNextBatchOfSubordinates();
        }
        if (!rdnMatched) {
            return {
                exists: false,
                discloseOnError: false,
                permittedToFind: false,
            };
        }
    }
    return {
        exists: (i === m),
        permittedToFind: (i === m),
        discloseOnError: authorizedToDiscloseOnError,
    };
}

export default permittedToFindDSE;
