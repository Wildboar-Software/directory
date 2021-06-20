import type { Context, IndexableOID } from "../../types";
import type {
    ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import type {
    ModifyDNResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNResult.ta";
import nameToString from "@wildboar/x500/src/lib/stringifiers/nameToString";
import distinguishedNameToString from "@wildboar/x500/src/lib/stringifiers/distinguishedNameToString";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    AttributeError,
    NameError,
    SecurityError,
    ServiceError,
    UpdateError,
    objectDoesNotExistErrorData,
} from "../errors";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    UpdateProblem_noSuchSuperior,
    UpdateProblem_entryAlreadyExists,
    UpdateProblem_namingViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    AttributeProblem_undefinedAttributeType,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    ServiceControlOptions_manageDSAIT,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import { TRUE_BIT } from "asn1-ts";
import {
    EXT_BIT_MANAGE_DSA_IT,
    EXT_BIT_NEW_SUPERIOR,
} from "../../x500/extensions";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    SecurityErrorData,
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import findEntry from "../../x500/findEntry";
import getDistinguishedName from "../../x500/getDistinguishedName";
import nonAdminUserCanManageEntry from "../../x500/nonAdminUserCanManageEntry";
import readEntry from "../../database/readEntry";

// modifyDN OPERATION ::= {
//   ARGUMENT  ModifyDNArgument
//   RESULT    ModifyDNResult
//   ERRORS    {nameError |
//              serviceError |
//              referral |
//              securityError |
//              updateError}
//   CODE      id-opcode-modifyDN }

// ModifyDNArgument ::= OPTIONALLY-PROTECTED { ModifyDNArgumentData }

// ModifyDNArgumentData ::= SET {
//   object        [0]  DistinguishedName,
//   newRDN        [1]  RelativeDistinguishedName,
//   deleteOldRDN  [2]  BOOLEAN DEFAULT FALSE,
//   newSuperior   [3]  DistinguishedName OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF      CommonArguments }

// ModifyDNResult ::= CHOICE {
//   null         NULL,
//   information  OPTIONALLY-PROTECTED-SEQ { ModifyDNResultData },
//   ... }

// ModifyDNResultData ::= SEQUENCE {
//   newRDN        RelativeDistinguishedName,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

const NO_SUCH_SUPERIOR_ERROR_DATA = new UpdateErrorData(
    UpdateProblem_noSuchSuperior,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);
const ENTRY_EXISTS_ERROR_DATA = new UpdateErrorData(
    UpdateProblem_entryAlreadyExists,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);
const CANNOT_MOVE_NON_ENTRY_ERROR_DATA = new SecurityErrorData(
    SecurityProblem_insufficientAccessRights,
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);

function namingViolationErrorData (attributeTypes: AttributeType[]): UpdateErrorData {
    return new UpdateErrorData(
        UpdateProblem_namingViolation,
        attributeTypes.map((at) => ({
            attributeType: at,
        })),
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

function unrecognizedAttributeErrorData (
    name: Name,
    attributeTypes: AttributeType[],
): AttributeErrorData {
    return new AttributeErrorData(
        name,
        attributeTypes.map((at) => new AttributeErrorData_problems_Item(
            AttributeProblem_undefinedAttributeType,
            at,
            undefined,
        )),
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

export
async function modifyDN (
    ctx: Context,
    arg: ModifyDNArgument,
): Promise<ModifyDNResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    if (data.object.length === 0) {
        throw new UpdateError(
            "The zero-RDN entry is the automatically-managed root DSE and may not be edited.",
            namingViolationErrorData([]),
        );
    }
    const entry = findEntry(ctx, ctx.database.data.dit, data.object);
    if (!entry) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, {
                rdnSequence: data.object,
            }),
        );
    }

    const manageDSAITExtension: boolean = (data.criticalExtensions?.[EXT_BIT_MANAGE_DSA_IT] === TRUE_BIT);
    const manageDSAITSCO: boolean = (data.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] === TRUE_BIT);
    // Only necessary if a specific DSA IT is to be managed.
    // const manageDSAITPlaneRef = data.serviceControls?.manageDSAITPlaneRef;
    const requestedToManageDSA: boolean = (manageDSAITExtension && manageDSAITSCO);
    if (!requestedToManageDSA && !nonAdminUserCanManageEntry(entry.dseType)) {
        throw new SecurityError(
            "Entries other than type 'entry' may not be managed by users without manageDSAIT service control.",
            CANNOT_MOVE_NON_ENTRY_ERROR_DATA,
        );
    }

    const newSuperiorExtension: boolean = (data.criticalExtensions?.[EXT_BIT_NEW_SUPERIOR] === TRUE_BIT);
    if (!newSuperiorExtension && data.newSuperior) {
        throw new ServiceError(
            "Use of the `newSuperior` option in the `modifyDN` operation was not enabled by the request.",
            new ServiceErrorData(
                ServiceProblem_unavailable,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    const newSuperior = data.newSuperior
        ? findEntry(ctx, ctx.database.data.dit, data.newSuperior)
        : null; // `null` means we did not try.
    if (newSuperior === undefined) { // `undefined` means we tried and failed.
        throw new Error();
    }

    const superior = data.newSuperior
        ? newSuperior
        : entry.parent;

    if (!superior) {
        // This should always throw, because you cant meaningfully move a root DSE.
        // And if you found an entry
        throw new Error();
    }

    if (data.newSuperior) {
        if (!superior) {
            const newSuperiorDN: string = distinguishedNameToString(data.newSuperior);
            throw new UpdateError(`No such superior: ${newSuperiorDN}`, NO_SUCH_SUPERIOR_ERROR_DATA);
        }
        if (superior.dseType.alias) {
            throw new UpdateError(
                "New entry inserted below an entry of a forbidden DSE type, such as an alias.",
                namingViolationErrorData([]),
            );
        }
    }

    const potentialNewName: Name = {
        rdnSequence: [ data.newRDN, ...(superior ? getDistinguishedName(superior) : []) ],
    };
    const potentialEntry = findEntry(ctx, ctx.database.data.dit, potentialNewName.rdnSequence);
    if (potentialEntry) {
        const potentialDN = nameToString(potentialNewName);
        throw new UpdateError(`Entry already exists: ${potentialDN}`, ENTRY_EXISTS_ERROR_DATA);
    }

    const attrs = await readEntry(ctx, entry);
    const rdnAttributeTypes: Set<IndexableOID> = new Set();
    data.newRDN.forEach((atav) => {
        const TYPE: string = atav.type_.toString();
        if (rdnAttributeTypes.has(TYPE)) {
            throw new UpdateError(
                "Attributes of the following types in the RDNs of the entry were "
                + `duplicated: ${TYPE}`,
                namingViolationErrorData([ atav.type_ ]),
            );
        }
        rdnAttributeTypes.add(TYPE);
        const attrSpec = ctx.attributes.get(TYPE);
        if (!attrSpec) {
            throw new AttributeError(
                `Unrecognized attributes: ${TYPE}.`,
                unrecognizedAttributeErrorData({
                    rdnSequence: getDistinguishedName(entry),
                }, [ atav.type_ ]),
            );
        }
        const matcher = attrSpec.namingMatcher;
        if (
            !matcher
            || (attrSpec.usage !== AttributeUsage_userApplications) // I am not really sure this is a requirement...
        ) {
            throw new UpdateError(
                "Attributes of the following types in the RDNs of the entry are "
                + `innately not suitable for naming: ${TYPE}`,
                namingViolationErrorData([ atav.type_ ]),
            );
        }
        const relevantAttrs = attrs
            .filter((attr) => ((attr.id.toString() === TYPE) && (attr.contexts.size === 0)));

        if (!relevantAttrs.some((ra) => matcher(ra.value, atav.value))) {
            throw new UpdateError(
                "Attributes of the following types in the RDNs of the entry did not "
                + `have matching values in the attributes: ${TYPE}`,
                namingViolationErrorData([ atav.type_ ]),
            );
        }
    });

    if (entry.parent?.children.length && (entry.parent !== superior)) {
        const entryIndex = entry.parent.children.findIndex((child) => (child.uuid === entry.uuid));
        entry.parent.children.splice(entryIndex, 1); // Remove from the current parent.
        superior?.children.push(entry); // Move to the new parent.
    }

    const oldRDN = entry.rdn;

    if (data.deleteOldRDN) {
        ctx.database.data.values = ctx.database.data.values
            .filter((v) => {
                if (v.entry !== entry.uuid) {
                    return true;
                }
                const matches: boolean = oldRDN.some((atav) => {
                    const TYPE_OID: string = atav.type_.toString();
                    const spec = ctx.attributes.get(TYPE_OID);
                    if (!spec) {
                        return;
                    }
                    const matcher = spec.equalityMatcher;
                    if (!matcher) {
                        return;
                    }
                    return matcher(v.value, atav.value);
                });
                return !matches; // We want to _keep_ the ones that _do not_ belong to the old RDN.
            });
    }

    entry.rdn = data.newRDN; // Update the RDN.

    return {
        null_: null,
    };
}

export default modifyDN;
