import { Context, Vertex } from "../types";
import {
    _decode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyEntryResult,
    _encode_ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    AttributeError,
    SecurityError,
} from "../errors";
import attributeToStoredValues from "../x500/attributeToStoredValues";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import { AttributeErrorData_problems_Item } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import { AttributeProblem_undefinedAttributeType } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import { SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    BERElement,
    DERElement,
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
    ASN1Construction,
} from "asn1-ts";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import getDistinguishedName from "../x500/getDistinguishedName";
import type { PrismaPromise } from "@prisma/client";
import addValues from "../database/entry/addValues";
import removeValues from "../database/entry/removeValues";
import removeAttribute from "../database/entry/removeAttribute";
import readValues from "../database/entry/readValues";
import dseFromDatabaseEntry from "../database/dseFromDatabaseEntry";

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
async function executeEntryModification (
    ctx: Context,
    entry: Vertex,
    mod: EntryModification,
): Promise<PrismaPromise<any>[]> {

    /**
     * This only needs to be called for alternatives that write new
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
        const values = attributeToStoredValues(mod.addAttribute);
        return addValues(ctx, entry, values, []);
    }
    else if ("removeAttribute" in mod) {
        return removeAttribute(ctx, entry, mod.removeAttribute, []);
    }
    else if ("addValues" in mod) {
        check(mod.addValues.type_);
        const values = attributeToStoredValues(mod.addValues);
        return addValues(ctx, entry, values, []);
    }
    else if ("removeValues" in mod) {
        const values = attributeToStoredValues(mod.removeValues);
        return removeValues(ctx, entry, values, []);
    }
    else if ("alterValues" in mod) {
        check(mod.alterValues.type_);
        if (!isAcceptableTypeForAlterValues(mod.alterValues.value)) {
            throw new Error();
        }
        const eis = new EntryInformationSelection(
            {
                select: [ mod.alterValues.type_ ],
            },
            undefined,
            {
                select: [ mod.alterValues.type_ ],
            },
            undefined,
            undefined,
            undefined,
        );
        const {
            userAttributes,
            operationalAttributes,
        } = await readValues(ctx, entry, eis);
        const values = [
            ...userAttributes,
            ...operationalAttributes,
        ];
        const TYPE_OID: string = mod.alterValues.type_.toString();
        const newValues = values.map((value) => {
            if (value.id.toString() !== TYPE_OID) {
                return value;
            }
            if (!isAcceptableTypeForAlterValues(value.value)) {
                throw new Error();
            }
            if (value.value.tagNumber !== mod.alterValues.value.tagNumber) {
                throw new Error();
            }
            const currentValue = (value.value.tagNumber === ASN1UniversalType.integer)
                ? value.value.integer
                : value.value.real;
            const toBeAdded = (mod.alterValues.value.tagNumber === ASN1UniversalType.integer)
                ? mod.alterValues.value.integer
                : mod.alterValues.value.real;
            return {
                ...value,
                value: new BERElement(
                    ASN1TagClass.universal,
                    ASN1Construction.primitive,
                    value.value.tagNumber,
                    (currentValue + toBeAdded),
                ),
            };
        });
        return [
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type: mod.alterValues.type_.toString(),
                },
            }),
            ...(await addValues(ctx, entry, newValues, [])),
        ];
    }
    else if ("resetValue" in mod) {
        // TODO: This will not update operational attributes, but that might not
        // matter, because it only remove values having some context.
        return [
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type: mod.resetValue.toString(),
                    ContextValue: {
                        some: {
                            fallback: false,
                        },
                    },
                },
            }),
        ];
    }
    else if ("replaceValues" in mod) {
        check(mod.replaceValues.type_);
        return [];
    }
    else {
        return [];
    }
}

export
async function modifyEntry (
    ctx: Context,
    target: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_ModifyEntryArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    const pendingUpdates: PrismaPromise<any>[] = [];
    // TODO: Access Control
    // TODO: Schema validation
    /**
     * Change types that warrant validation checks:
     * - addAttribute
     * - removeAttribute
     * - addValues
     * - removeValues
     * - resetValue
     * - replaceValues
     *
     * So basically, everything except alterValues
     */
    for (const mod of data.changes) {
        pendingUpdates.push(...(await executeEntryModification(ctx, target, mod)));
    }
    await ctx.db.$transaction(pendingUpdates);
    const dbe = await ctx.db.entry.findUnique({
        where: {
            id: target.dse.id,
        },
    });
    if (dbe) {
        target.dse = await dseFromDatabaseEntry(ctx, dbe);
    } else {
        ctx.log.warn(`Database entry ${target.dse.uuid} was deleted while it was being modified.`);
    }
    // TODO: Update HOBs
    // TODO: Update Shadows
    const result: ModifyEntryResult = {
        null_: null,
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_ModifyEntryResult(result, () => new DERElement()),
    );
}

export default modifyEntry;
