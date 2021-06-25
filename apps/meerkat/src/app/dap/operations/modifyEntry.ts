import type { Context, Entry, StoredAttributeValueWithContexts } from "../../types";
import type {
    ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import type {
    ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
// import type DAPConnection from "../DAPConnection";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import findEntry from "../../x500/findEntry";
import getDistinguishedName from "../../x500/getDistinguishedName";
import { TRUE_BIT, ASN1Element, ASN1TagClass, ASN1Construction, ASN1UniversalType, BERElement } from "asn1-ts";
import { EXT_BIT_USE_ALIAS_ON_UPDATE } from "../../x500/extensions";
import {
    ServiceControlOptions_subentries,
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    AttributeError,
    NameError,
    SecurityError,
    ServiceError,
    UpdateError,
    objectDoesNotExistErrorData,
    namingViolationErrorData,
} from "../errors";
import { UpdateProblem_namingViolation } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import { UpdateErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import { ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { ServiceProblem_unsupportedMatchingUse } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import attributeToStoredValues from "../../x500/attributeToStoredValues";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import { AttributeErrorData_problems_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import { AttributeProblem_noSuchAttributeOrValue, AttributeProblem_undefinedAttributeType } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import readEntry from "../../database/readEntry";

// modifyEntry OPERATION ::= {
//   ARGUMENT  ModifyEntryArgument
//   RESULT    ModifyEntryResult
//   ERRORS    {attributeError |
//              nameError |
//              serviceError |
//              referral |
//              securityError |
//              updateError}
//   CODE      id-opcode-modifyEntry }

// ModifyEntryArgument ::= OPTIONALLY-PROTECTED { ModifyEntryArgumentData }

// ModifyEntryArgumentData ::= SET {
//   object     [0]  Name,
//   changes    [1]  SEQUENCE OF EntryModification,
//   selection  [2]  EntryInformationSelection OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF   CommonArguments }

// ModifyEntryResult ::= CHOICE {
//   null         NULL,
//   information  OPTIONALLY-PROTECTED-SEQ { ModifyEntryResultData },
//   ... }

// ModifyEntryResultData ::= SEQUENCE {
//   entry    [0]  EntryInformation OPTIONAL,
//   ...,
//   ...,
//   COMPONENTS OF CommonResultsSeq }

// EntryModification ::= CHOICE {
//   addAttribute     [0]  Attribute{{SupportedAttributes}},
//   removeAttribute  [1]  AttributeType,
//   addValues        [2]  Attribute{{SupportedAttributes}},
//   removeValues     [3]  Attribute{{SupportedAttributes}},
//   alterValues      [4]  AttributeTypeAndValue,
//   resetValue       [5]  AttributeType,
//   replaceValues    [6]  Attribute{{SupportedAttributes}},
//   ... }

function isAcceptableTypeForAlterValues (el: ASN1Element): boolean {
    return (
        (el.tagClass === ASN1TagClass.universal)
        && (
            el.tagNumber === ASN1UniversalType.integer
            || el.tagNumber === ASN1UniversalType.realNumber
        )
    );
}

/**
 * From ITU Recommendation X.501 (2016), Section 13.4.7:
 *
 * > If no equality matching rule is indicated, the Directory:
 * >
 * > a) treats values of this attribute as having type ANY, i.e., the Directory may not check that those values
 * > conform with the data type or any other rule indicated for the attribute;
 * >
 * > b) does not permit the attribute to be used for naming;
 * >
 * > c) does not allow individual values of multi-valued attributes to be added or removed;
 * >
 * > d) does not perform comparisons of values of the attribute;
 * >
 * > e) will not attempt to evaluate AVAs using values of such an attribute type.
 *
 */
function executeEntryModification (
    ctx: Context,
    entry: Entry,
    attributes: StoredAttributeValueWithContexts[],
    mod: EntryModification,
): StoredAttributeValueWithContexts[] {

    /**
     * This only needs to be called for alternatives that do not write new
     * attributes or attribute values.
     */
    const check = (attributeType: AttributeType) => {
        const TYPE_OID: string = attributeType.toString();
        const spec = ctx.attributes.get(TYPE_OID);
        if (!spec) {
            throw new AttributeError(
                `Attribute type ${TYPE_OID} not understood.`,
                new AttributeErrorData(
                    {
                        rdnSequence: getDistinguishedName(entry),
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_undefinedAttributeType,
                            attributeType,
                            undefined,
                        ),
                    ],
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        if (spec?.noUserModification) {
            throw new SecurityError(
                `Attribute type ${TYPE_OID} may not be modified.`,
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    };

    if ("addAttribute" in mod) {
        check(mod.addAttribute.type_);
        return [
            ...attributes,
            ...attributeToStoredValues(entry, mod.addAttribute),
        ];
    }
    else if ("removeAttribute" in mod) {
        // We do not need to check for no-user-modification because attempted mods will be a noop.
        // We do not need to check for misunderstood attribute types because
        // users should be able to delete no-longer-recognized attribute types.
        // Therefore, we do not need to call check() here.
        const lengthBefore: number = attributes.length;
        const newAttributes = attributes.filter((attr) => (attr.id.toString() !== mod.removeAttribute.toString()));
        /**
         * From ITU Recommendation X.511 (2016), Section 12.3.2.
         *
         * > If the values are not present in the attribute, this results in an
         * > `attributeError`.
         */
        if (newAttributes.length === lengthBefore) {
            throw new AttributeError(
                `Attribute with OID ${mod.removeAttribute.toString()} not found in entry with ID ${entry.uuid}.`,
                new AttributeErrorData(
                    {
                        rdnSequence: getDistinguishedName(entry),
                    },
                    [
                        new AttributeErrorData_problems_Item(
                            AttributeProblem_noSuchAttributeOrValue,
                            mod.removeAttribute,
                            undefined,
                        ),
                    ],
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        return newAttributes;
    }
    else if ("addValues" in mod) {
        check(mod.addValues.type_);
        return [
            ...attributes,
            ...attributeToStoredValues(entry, mod.addValues),
        ];
    }
    else if ("removeValues" in mod) {
        // We do not need to check for no-user-modification because attempted mods will be a noop.
        // We do not need to check for misunderstood attribute types because
        // users should be able to delete no-longer-recognized attribute types.
        // Therefore, we do not need to call check() here.
        return attributes
            .filter((attr): boolean => {
                const TYPE_OID: string = attr.id.toString();
                if (TYPE_OID !== mod.removeValues.type_.toString()) {
                    return true;
                }
                const spec = ctx.attributes.get(TYPE_OID);
                if (!spec) {
                    return true; // Attribute not understood.
                }
                const matcher = spec.equalityMatcher;
                if (!matcher) {
                    throw new ServiceError(
                        `No equality matching rule defined for attribute type ${TYPE_OID}.`,
                        new ServiceErrorData(
                            ServiceProblem_unsupportedMatchingUse,
                            [],
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                        ),
                    );
                }
                return !(
                    mod.removeValues.values.some((v): boolean => matcher(v, attr.value))
                    || mod.removeValues.valuesWithContext?.some((vwc): boolean => matcher(vwc.value, attr.value))
                );
            });
    }
    else if ("alterValues" in mod) {
        check(mod.alterValues.type_);
        if (!isAcceptableTypeForAlterValues(mod.alterValues.value)) {
            throw new Error();
        }
        const TYPE_OID: string = mod.alterValues.type_.toString();
        return attributes.map((attr) => {
            if (attr.id.toString() !== TYPE_OID) {
                return attr;
            }
            if (!isAcceptableTypeForAlterValues(attr.value)) {
                throw new Error();
            }
            if (attr.value.tagNumber !== mod.alterValues.value.tagNumber) {
                throw new Error();
            }
            const currentValue = (attr.value.tagNumber === ASN1UniversalType.integer)
                ? attr.value.integer
                : attr.value.real;
            const toBeAdded = (mod.alterValues.value.tagNumber === ASN1UniversalType.integer)
                ? mod.alterValues.value.integer
                : mod.alterValues.value.real;
            return {
                ...attr,
                value: new BERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.primitive,
                    attr.value.tagNumber,
                    (currentValue + toBeAdded),
                ),
            };
        });
    }
    else if ("resetValue" in mod) {
        return attributes
            .filter((attr): boolean => Array.from(attr.contexts.values())
                .every((context) => context.fallback));
    }
    else if ("replaceValues" in mod) {
        check(mod.replaceValues.type_);
        const TYPE_OID: string = mod.replaceValues.type_.toString();
        return [
            ...attributes.filter((attr) => attr.id.toString() !== TYPE_OID),
            ...attributeToStoredValues(entry, mod.replaceValues),
        ];
    }
    else {
        return attributes;
    }
}

// NOTE: X.511 seems to indicate that familyReturn is relevant to modifyEntry, but I don't see how...

export
async function modifyEntry (
    ctx: Context,
    // connection: DAPConnection,
    arg: ModifyEntryArgument,
): Promise<ModifyEntryResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;

    // if (!connection.v2 && data.selection) {
    //     throw new Error();
    // }

    if (data.object.rdnSequence.length === 0) {
        throw new UpdateError(
            "The zero-RDN entry is the automatically-managed root DSE and may not be edited.",
            namingViolationErrorData([]),
        );
    }
    const useAliasOnUpdateExtension: boolean = (
        data.criticalExtensions?.[EXT_BIT_USE_ALIAS_ON_UPDATE] === TRUE_BIT);
    const dontDereferenceAliases: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);

    /**
     * From ITU Recommendation X.511, Section 12.3.2:
     *
     * > ...aliases are dereferenced by this operation only if
     * > dontDereferenceAlias is not set and useAliasOnUpdate is set
     */
    const derefAliases: boolean = (
        !dontDereferenceAliases
        && useAliasOnUpdateExtension
    );
    const entry = findEntry(ctx, ctx.database.data.dit, data.object.rdnSequence, derefAliases);
    if (!entry) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, data.object),
        );
    }

    const objectIsSubentry: boolean = Boolean(entry.dseType.subentry || entry.dseType.dsSubentry);
    const useSubentries: boolean = (data.serviceControls?.options?.[ServiceControlOptions_subentries] === TRUE_BIT);

    if (objectIsSubentry && !useSubentries) {
        throw new UpdateError(
            "Object targeted for update was a subentry, but the subentries flag was not set.",
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    } else if (!objectIsSubentry && useSubentries) {
        throw new UpdateError(
            "Object targeted for update was not a subentry, but the subentries flag was set.",
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }

    const entryAttributes = await readEntry(ctx, entry);
    let newAttributes = entryAttributes;
    for (const mod of data.changes) {
        // replaceValues could be checked here.
        newAttributes = executeEntryModification(ctx, entry, newAttributes, mod);
    }

    // Modify all of the attributes in memory, then replace them all.
    await ctx.db.$transaction([
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: entry.id,
            },
        }),
        ctx.db.attributeValue.createMany({
            data: newAttributes.map((attr) => ({
                entry_id: entry.id,
                type: attr.id.toString(),
                tag_class: attr.value.tagClass,
                constructed: (attr.value.construction === ASN1Construction.constructed),
                tag_number: attr.value.tagNumber,
                ber: Buffer.from(attr.value.value),
                ContextValue: Array.from(attr.contexts.values())
                    .flatMap((context) => context.values
                        .map((cv) => ({
                            entry_id: entry.id,
                            type: context.id.nodes,
                            tag_class: cv.tagClass,
                            constructed: (cv.construction === ASN1Construction.constructed),
                            tag_number: cv.tagNumber,
                            ber: Buffer.from(cv.value),
                            // hint
                            // jer
                            fallback: context.fallback,
                        }))),
                // hint
                // jer
            }))
        }),
    ]);

    /**
     * From ITU X.511, Section 12.3.3:
     *
     * > If the result is not to be signed by the Directory, no entry
     * > information shall be conveyed with the result.
     *
     * This sounds to me like I should always return NULL until I implement
     * result signing. So for now, the .selection option will be ignored.
     */
    return {
        null_: null,
    };
}

export default modifyEntry;
