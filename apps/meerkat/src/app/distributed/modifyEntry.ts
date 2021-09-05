import { Context, IndexableOID, Vertex, Value } from "../types";
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
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_objectClassViolation,
    UpdateProblem_objectClassModificationProhibited,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import * as errors from "../errors";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
// import { top } from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import { parent } from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
// import {
//     administrativeRole,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    ObjectClassKind,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
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
    ObjectIdentifier,
} from "asn1-ts";
import {
    DER,
    _encodeObjectIdentifier,
} from "asn1-ts/dist/node/functional";
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
import { strict as assert } from "assert";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import {
    AccessPoint,
    _decode_AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import isPrefix from "../x500/isPrefix";
import updateSubordinate from "../dop/updateSubordinate";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import findEntry from "../x500/findEntry";

type ValuesIndex = Map<IndexableOID, Value[]>;

function isAcceptableTypeForAlterValues (el: ASN1Element): boolean {
    return (
        (el.tagClass === ASN1TagClass.universal)
        && (
            el.tagNumber === ASN1UniversalType.integer
            || el.tagNumber === ASN1UniversalType.realNumber
        )
    );
}

function getValueAlterer (toBeAddedElement: ASN1Element): (value: Value) => Value {
    const toBeAdded = (toBeAddedElement.tagNumber === ASN1UniversalType.integer)
        ? toBeAddedElement.integer
        : toBeAddedElement.real;
    return (value: Value): Value => {
        if (!isAcceptableTypeForAlterValues(value.value)) {
            throw new Error();
        }
        if (value.value.tagNumber !== toBeAddedElement.tagNumber) {
            throw new Error();
        }
        const currentValue = (value.value.tagNumber === ASN1UniversalType.integer)
            ? value.value.integer
            : value.value.real;
        return {
            ...value,
            value: new DERElement(
                ASN1TagClass.universal,
                ASN1Construction.primitive,
                value.value.tagNumber,
                (currentValue + toBeAdded),
            ),
        };
    };
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
    delta: ValuesIndex,
): Promise<PrismaPromise<any>[]> {

    /**
     * This only needs to be called for alternatives that write new
     * attributes or attribute values.
     */
    const check = (attributeType: AttributeType) => {
        const TYPE_OID: string = attributeType.toString();
        const spec = ctx.attributes.get(TYPE_OID);
        if (!spec) {
            throw new errors.AttributeError(
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
            throw new errors.SecurityError(
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
        const TYPE_OID: IndexableOID = mod.addAttribute.type_.toString();
        const deltaValues = delta.get(TYPE_OID);
        if (deltaValues) {
            deltaValues.push(...values);
        } else {
            delta.set(TYPE_OID, values);
        }
        return addValues(ctx, entry, values, []);
    }
    else if ("removeAttribute" in mod) {
        delta.delete(mod.removeAttribute.toString());
        return removeAttribute(ctx, entry, mod.removeAttribute, []);
    }
    else if ("addValues" in mod) {
        check(mod.addValues.type_);
        const values = attributeToStoredValues(mod.addValues);
        const TYPE_OID: IndexableOID = mod.addValues.type_.toString();
        const deltaValues = delta.get(TYPE_OID);
        if (deltaValues) {
            deltaValues.push(...values);
        } else {
            delta.set(TYPE_OID, values);
        }
        return addValues(ctx, entry, values, []);
    }
    else if ("removeValues" in mod) {
        const values = attributeToStoredValues(mod.removeValues);
        const valuesToBeDeleted: Set<string> = new Set(
            values?.map((v) => Buffer.from(v.value.toBytes()).toString("base64")),
        );
        const TYPE_OID: IndexableOID = mod.removeValues.type_.toString();
        const deltaValues = delta.get(TYPE_OID);
        if (deltaValues) {
            const newValues = deltaValues
                .filter((dv) => !valuesToBeDeleted.has(Buffer.from(dv.value.toBytes()).toString("base64")));
            delta.set(TYPE_OID, newValues);
        }
        return removeValues(ctx, entry, values, []);
    }
    else if ("alterValues" in mod) {
        check(mod.alterValues.type_);
        if (!isAcceptableTypeForAlterValues(mod.alterValues.value)) {
            throw new Error();
        }
        const TYPE_OID: IndexableOID = mod.alterValues.type_.toString();
        const alterer = getValueAlterer(mod.alterValues.value);
        { // Modify the delta values.
            const deltaValues = delta.get(TYPE_OID);
            if (deltaValues) {
                const newValues = deltaValues.map(alterer);
                delta.set(TYPE_OID, newValues);
            }
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
        const newValues = values.map(alterer);
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
        const TYPE_OID: IndexableOID = mod.resetValue.toString();
        { // Updating the delta values
            const deltaValues = delta.get(TYPE_OID);
            if (deltaValues) {
                const newDeltaValues = deltaValues
                    .filter((dv) => !Array.from(dv.contexts.values())
                        .some((context) => (context.fallback === false)));
                delta.set(TYPE_OID, newDeltaValues);
            }
        }
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
        const TYPE_OID: string = mod.replaceValues.type_.toString();
        const values = attributeToStoredValues(mod.replaceValues);
        delta.set(TYPE_OID, values);
        return [
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type: TYPE_OID,
                },
            }),
            ...(await addValues(ctx, entry, values, [])),
        ];
    }
    else {
        return []; // Any other alternative not understood.
    }
}

/**
 * @summary Modify an entry
 * @description
 *
 * ## Implementation
 *
 * ### Schema Validation
 *
 * ### System Schema Validation
 *
 * There are some attributes that may be added to any entry of any object class,
 * such as `administrativeRole`, because there is no object class defined for
 * every DSE type, and thus, these special attributes are used to validate if
 * the DSE is, de facto, of a given type.
 *
 * Continuing on the aforementioned example, the mere presence of an
 * `administrativeRole` attribute is what determines whether Meerkat DSA views
 * the entry as an
 *
 * @param ctx
 * @param target
 * @param admPoints
 * @param request
 * @returns
 */
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
    const delta: ValuesIndex = new Map();
    // TODO: Access Control
    for (const mod of data.changes) {
        pendingUpdates.push(...(await executeEntryModification(ctx, target, mod, delta)));
    }

    const requiredAttributes: Set<IndexableOID> = new Set();
    const optionalAttributes: Set<IndexableOID> = new Set();
    const addedObjectClasses = delta.get(objectClass["&id"].toString())
        ?.map((value) => value.value.objectIdentifier) ?? [];
    for (const ocid of addedObjectClasses) {
        const spec = ctx.objectClasses.get(ocid.toString());
        if (!spec) {
            throw new errors.UpdateError(
                `Object class ${ocid.toString()} not understood.`,
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                objectClass["&id"],
                                [
                                    _encodeObjectIdentifier(ocid, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        // TODO: Even though not mandated by the specification, tolerate
        // modification of the structural object class, as long as it is
        // a subclass of the current structural object class.
        if (spec.kind === ObjectClassKind.structural) {
            // TODO: What to do about abstract object classes?
            throw new errors.UpdateError(
                `Cannot supplant structural object class with object class ${ocid.toString()}.`,
                new UpdateErrorData(
                    UpdateProblem_objectClassModificationProhibited,
                    [
                        {
                            attribute: new Attribute(
                                objectClass["&id"],
                                [
                                    _encodeObjectIdentifier(ocid, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
        Array.from(spec.mandatoryAttributes).forEach((attr) => requiredAttributes.add(attr));
        Array.from(spec.optionalAttributes).forEach((attr) => optionalAttributes.add(attr));
    }
    const alreadyPresentObjectClasses = Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString);
    for (const ocid of alreadyPresentObjectClasses) {
        const spec = ctx.objectClasses.get(ocid.toString());
        if (!spec) {
            ctx.log.warn(`Object has unrecognized object class ${ocid.toString()}.`);
            continue;
        }
        Array.from(spec.mandatoryAttributes).forEach((attr) => requiredAttributes.add(attr));
        Array.from(spec.optionalAttributes).forEach((attr) => optionalAttributes.add(attr));
    }

    { // Check required attributes
        const missingRequiredAttributeTypes: Set<IndexableOID> = new Set();
        for (const ra of Array.from(requiredAttributes)) {
            const deltaValues = delta.get(ra);
            if (!deltaValues?.length) {
                const alreadyPresentValues = await ctx.db.attributeValue.count({
                    where: {
                        entry_id: target.dse.id,
                        type: ra,
                    },
                });
                if (alreadyPresentValues === 0) {
                    missingRequiredAttributeTypes.add(ra);
                }
            }
        }
        if (missingRequiredAttributeTypes.size > 0) {
            const missing: string[] = Array.from(missingRequiredAttributeTypes);
            throw new errors.UpdateError(
                `Missing required attribute types: ${missing.join(" ")}`,
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    missing
                        .map(ObjectIdentifier.fromString)
                        .map((attributeType) => ({ attributeType })),
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }
    { // Check optional attributes
        const nonPermittedAttributeTypes: Set<IndexableOID> = new Set();
        for (const type_ of Array.from(delta.keys())) {
            if (!optionalAttributes.has(type_.toString())) {
                nonPermittedAttributeTypes.add(type_);
            }
        }
        if (nonPermittedAttributeTypes.size > 0) {
            const nonPermitted: string[] = Array.from(nonPermittedAttributeTypes);
            throw new errors.UpdateError(
                `No object class permits attribute types: ${nonPermitted.join(" ")}`,
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    nonPermitted
                        .map(ObjectIdentifier.fromString)
                        .map((attributeType) => ({ attributeType })),
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }

    { // Other validation.
        const objectClasses = [
            ...alreadyPresentObjectClasses,
            ...addedObjectClasses,
        ];

        /**
         * From ITU Recommendation X.501 (2016), Section 13.3.3:
         *
         * > The parent object class is derived by the presence of an
         * > immediately subordinate family member, marked by the presence of
         * > a child object class value. It may not be directly administered.
         */
        {
            const hasParentObjectClass: boolean = objectClasses
                .some((oc) => oc.isEqualTo(parent["&id"]));
            if (hasParentObjectClass) {
                throw new errors.UpdateError(
                    "Object class 'parent' may not be added directly.",
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attribute: new Attribute(
                                    objectClass["&id"],
                                    [
                                        _encodeObjectIdentifier(parent["&id"], DER),
                                    ],
                                    undefined,
                                ),
                            },
                        ],
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
        }


        const hasChildObjectClass: boolean = objectClasses
            .some((oc) => oc.isEqualTo(child["&id"]));
        const hasAliasObjectClass: boolean = objectClasses
            .some((oc) => oc.isEqualTo(alias["&id"]));

        /**
         * From ITU Recommendation X.501 (2016), Section 13.3.3:
         *
         * > Neither the parent nor the child object classes shall be combined
         * > with the alias object class to form an alias entry.
         */
        if (hasChildObjectClass && hasAliasObjectClass) {
            throw new errors.UpdateError(
                "Object may not have object class 'alias' and 'child' simultaneously.",
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                objectClass["&id"],
                                [
                                    _encodeObjectIdentifier(alias["&id"], DER),
                                    _encodeObjectIdentifier(child["&id"], DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
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

    // Update relevant hierarchical operational bindings
    if (target.dse.admPoint || target.dse.subentry) {
        const admPoint: Vertex | undefined = target.dse.admPoint
            ? target
            : target.immediateSuperior;
        assert(admPoint?.dse.admPoint);
        const admPointDN = getDistinguishedName(admPoint);
        const now = new Date();
        const relevantOperationalBindings = await ctx.db.operationalBinding.findMany({
            where: {
                binding_type: id_op_binding_hierarchical.toString(),
                validity_start: {
                    gte: now,
                },
                validity_end: {
                    lte: now,
                },
                // accepted: true, // FIXME: Is this always set?
                OR: [
                    { // Local DSA initiated role A (meaning local DSA is superior.)
                        initiator: OperationalBindingInitiator.ROLE_A,
                        outbound: true,
                    },
                    { // Remote DSA initiated role B (meaning local DSA is superior again.)
                        initiator: OperationalBindingInitiator.ROLE_B,
                        outbound: false,
                    },
                ],
            },
            select: {
                binding_identifier: true,
                binding_version: true,
                access_point: true,
                agreement_ber: true,
            },
        });
        for (const ob of relevantOperationalBindings) {
            const argreementElement = new BERElement();
            argreementElement.fromBytes(ob.agreement_ber);
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            if (!isPrefix(ctx, admPointDN, agreement.immediateSuperior)) {
                continue;
            }
            const bindingID = new OperationalBindingID(
                ob.binding_identifier,
                ob.binding_version,
            );
            const accessPointElement = new BERElement();
            accessPointElement.fromBytes(ob.access_point.ber);
            const accessPoint: AccessPoint = _decode_AccessPoint(accessPointElement);
            try {
                const subrDN: DistinguishedName = [
                    ...agreement.immediateSuperior,
                    agreement.rdn,
                ];
                const subr = await findEntry(ctx, ctx.dit.root, subrDN);
                if (!subr) {
                    ctx.log.warn(`Subordinate entry for agreement ${bindingID.identifier} (version ${bindingID.version}) not found.`);
                    continue;
                }
                assert(subr.immediateSuperior);
                // We do not await the return value. This can run independently
                // of returning from this operation.
                updateSubordinate(
                    ctx,
                    bindingID,
                    subr.immediateSuperior,
                    undefined,
                    subr.dse.rdn,
                    accessPoint,
                )
                    .catch((e) => {
                        ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}). ${e}`);
                    });
            } catch (e) {
                ctx.log.warn(`Failed to update HOB for agreement ${bindingID.identifier} (version ${bindingID.version}).`);
                continue;
            }
        }
    }

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
        _encode_ModifyEntryResult(result, DER),
    );
}

export default modifyEntry;
