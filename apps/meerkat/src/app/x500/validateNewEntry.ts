import type { Context, ClientAssociation, Vertex, IndexableOID, Value } from "@wildboar/meerkat-types";
import type { BOOLEAN, INTEGER } from "asn1-ts";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";

import * as errors from "@wildboar/meerkat-types";
import {
    id_at_objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-at-objectClass.va";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import {
    id_oc_alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-alias.va";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import {
    UpdateErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_objectClassViolation,
    UpdateProblem_namingViolation,
    UpdateProblem_familyRuleViolation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import {
    AttributeProblem_contextViolation,
    AttributeProblem_undefinedAttributeType,
    AttributeProblem_constraintViolation,
    AttributeProblem_invalidAttributeSyntax,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import { ObjectIdentifier, OBJECT_IDENTIFIER } from "asn1-ts";
import { AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import createSecurityParameters from "./createSecurityParameters";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import validateObjectClasses from "./validateObjectClasses";
import valuesFromAttribute from "./valuesFromAttribute";
import getNamingMatcherGetter from "./getNamingMatcherGetter";
import {
    subschema,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import getStructuralObjectClass from "./getStructuralObjectClass";
import checkNameForm from "@wildboar/x500/src/lib/utils/checkNameForm";
import {
    ObjectClassKind_auxiliary,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    id_oa_allAttributeTypes,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-allAttributeTypes.va";
import getSubschemaSubentry from "../dit/getSubschemaSubentry";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import extensibleObject from "../ldap/extensibleObject";
import attributeTypesPermittedForEveryEntry from "./attributeTypesPermittedForEveryEntry";
import {
    id_oa_collectiveExclusions,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-collectiveExclusions.va";
import { id_aca_subentryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-subentryACI.va";
import { id_aca_prescriptiveACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-prescriptiveACI.va";
import {
    hierarchyParent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import {
    NameErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    NameProblem_invalidAttributeSyntax,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { id_ar_autonomousArea } from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
import mayAddTopLeveDSE from "../authz/mayAddTopLevelDSE";
import {
    id_aca_accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-accessControlScheme.va";
import {
    Context as X500Context,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Context.ta";
import { nameError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import { strict as assert } from "assert";
import {
    subentryNameForm,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subentryNameForm.oa";
import getDistinguishedName from "./getDistinguishedName";
import { printInvokeId } from "../utils/printInvokeId";
import type {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import type {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import type {
    OBJECT_CLASS,
} from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";

const ALL_ATTRIBUTE_TYPES: string = id_oa_allAttributeTypes.toString();

function namingViolationErrorData (
    ctx: Context,
    assn: ClientAssociation,
    attributeTypes: AttributeType[],
    aliasDereferenced?: boolean,
): UpdateErrorData {
    return new UpdateErrorData(
        UpdateProblem_namingViolation,
        attributeTypes.map((at) => ({
            attributeType: at,
        })),
        [],
        createSecurityParameters(
            ctx,
            assn.boundNameAndUID?.dn,
            undefined,
            updateError["&errorCode"],
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        aliasDereferenced,
        undefined,
    );
}

export
interface ValidateEntryReturn {
    structuralObjectClass: OBJECT_CLASS["&id"];
    governingStructureRule: INTEGER | undefined;
}

export
async function validateEntry (
    ctx: Context,
    assn: ClientAssociation,
    immediateSuperior: Vertex,
    rdn: RelativeDistinguishedName,
    entry: Attribute[],
    aliasDereferenced: BOOLEAN,
    user: NameAndOptionalUID | undefined,
    manageDSAIT: BOOLEAN,
    invokeId: InvokeId,
): Promise<ValidateEntryReturn> {
    const targetDN: DistinguishedName = [ ...getDistinguishedName(immediateSuperior), rdn ];
    const values: Value[] = entry.flatMap(valuesFromAttribute);
    const objectClassValues = values.filter((attr) => attr.type.isEqualTo(id_at_objectClass));
    if (objectClassValues.length === 0) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:object_class_not_found"),
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
    const objectClasses: OBJECT_IDENTIFIER[] = objectClassValues.map((ocv) => ocv.value.objectIdentifier);
    if (!ctx.config.bulkInsertMode && !validateObjectClasses(ctx, objectClasses)) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:invalid_object_classes"),
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }
    const structuralObjectClass = getStructuralObjectClass(ctx, objectClasses);
    const objectClassesIndex: Set<IndexableOID> = new Set(objectClasses.map((oc) => oc.toString()));

    /**
     * From ITU X.501 (2016), Section 13.3.2:
     *
     * > There shall be one value of the objectClass attribute for the entry's
     * > structural object class and a value for each of its superclasses. top
     * > may be omitted.
     *
     * This means that we can determine if this potential new entry is a
     * subentry by checking that the `subentry` object class is present.
     */
    const isSubentry: boolean = objectClassesIndex.has(id_sc_subentry.toString());
    const isSubschemaSubentry: boolean = isSubentry && objectClasses.some((oc) => oc.isEqualTo(subschema["&id"]));
    const isAlias: boolean = objectClassesIndex.has(id_oc_alias.toString());
    const isExtensible: boolean = objectClassesIndex.has(extensibleObject.toString());
    const isParent: boolean = objectClassesIndex.has(id_oc_parent.toString());
    const isChild: boolean = objectClassesIndex.has(id_oc_child.toString());
    const isEntry: boolean = (!isSubentry && !isAlias);
    const isFirstLevel: boolean = !!immediateSuperior.dse.root;
    /**
     * It would be impossible to create anything other than first-level DSEs if
     * subentries were not exempt from subschema restrictions, because they must
     * be created before the subschema can be defined!
     *
     * ITU Recommendation X.501 (2016), Section 14.2 states that:
     *
     * > Although subentry and subentryNameForm are specified using the notation
     * > of clause 13, subentries are not regulated by DIT structure or DIT
     * > content rules.
     *
     * However, regarding `subentryNameForm`, Section 14.2.2 states that:
     *
     * > No other name form shall be used for subentries.
     *
     * As such, Meerkat DSA will perform a hard-coded check that subentries have
     * this attribute type exclusively in their RDN.
     */
    const isExemptFromSubschema: boolean = (isSubentry || isFirstLevel);

    if (
        (immediateSuperior.dse.governingStructureRule === undefined) // The immediate superior has no GSR, and...
        && !isExemptFromSubschema
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:no_gsr", { uuid: immediateSuperior.dse.uuid }),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }

    if (
        isSubentry
        && !checkNameForm( // And the name is not valid for a subentry...
            rdn,
            subentryNameForm["&MandatoryAttributes"].map((a) => a["&id"]),
            subentryNameForm["&OptionalAttributes"]?.map((a) => a["&id"]),
        )
    ) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:name_form_invalid", {
                context: "subentry",
            }),
            new UpdateErrorData(
                UpdateProblem_namingViolation,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }

    if (isFirstLevel) {
        if (!await mayAddTopLeveDSE(ctx, assn)) {
            ctx.log.debug(ctx.i18n.t("log:not_authz_to_add_top_level", { context: "hint" }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(invokeId),
            });
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_to_add_top_level"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
    }

    if (isFirstLevel && !entry.some((info) => info.type_.isEqualTo(administrativeRole["&id"]))) {
        ctx.log.warn(ctx.i18n.t("log:admin_role_not_present_first_level_dse"), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            invokeID: printInvokeId(invokeId),
        });
        entry.push(new Attribute(
            administrativeRole["&id"],
            [_encodeObjectIdentifier(id_ar_autonomousArea, DER)],
            undefined,
        ));
    }

    if (isParent) {
        throw new errors.UpdateError(
            ctx.i18n.t("err:cannot_add_object_class_parent"),
            new UpdateErrorData(
                UpdateProblem_objectClassViolation,
                [
                    {
                        attribute: new Attribute(
                            id_at_objectClass,
                            [
                                _encodeObjectIdentifier(parent["&id"], DER),
                            ],
                            undefined,
                        ),
                    },
                ],
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    updateError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }

    if (isChild) {
        if (isFirstLevel) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_be_first_level_and_child"),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(id_oc_child, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
        if (isAlias) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:cannot_be_alias_and_child"),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    [
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(id_oc_alias, DER),
                                    _encodeObjectIdentifier(id_oc_child, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
    }

    const missingMandatoryAttributes: Set<IndexableOID> = new Set();
    const optionalAttributes: Set<IndexableOID> = new Set(
        attributeTypesPermittedForEveryEntry.map((oid) => oid.toString()),
    );
    if (isEntry) {
        optionalAttributes.add(id_oa_collectiveExclusions.toString());
        optionalAttributes.add(administrativeRole["&id"].toString());
        optionalAttributes.add(id_aca_accessControlScheme.toString());
        optionalAttributes.add(id_aca_subentryACI.toString());
        optionalAttributes.add(hierarchyParent["&id"].toString());
    }
    if (isSubentry) {
        optionalAttributes.add(id_aca_prescriptiveACI.toString());
    }
    const nonUserApplicationAttributes: AttributeType[] = [];
    const unrecognizedAttributes: AttributeType[] = [];
    const noUserModAttributes: AttributeType[] = [];
    const dummyAttributes: AttributeType[] = [];
    const collectiveAttributes: AttributeType[] = [];
    const obsoleteAttributes: AttributeType[] = [];
    const incorrectlyMultiValuedAttributes: AttributeType[] = [];
    for (const attr of entry) {
        const spec = ctx.attributeTypes.get(attr.type_.toString());
        if (!spec) {
            unrecognizedAttributes.push(attr.type_);
            continue;
        }
        if (spec.usage !== AttributeUsage_userApplications) {
            nonUserApplicationAttributes.push(attr.type_);
        }
        if (spec.noUserModification) {
            noUserModAttributes.push(attr.type_);
        }
        if (spec.dummy) {
            dummyAttributes.push(attr.type_);
        }
        if (spec.collective) {
            collectiveAttributes.push(attr.type_);
            optionalAttributes.add(attr.type_.toString());
        }
        if (spec.obsolete) {
            obsoleteAttributes.push(attr.type_);
        }
        const numberOfValues: number = (attr.values.length + (attr.valuesWithContext?.length ?? 0));
        if (spec.singleValued && (numberOfValues > 1)) {
            incorrectlyMultiValuedAttributes.push(spec.id);
        }
        if (attr.type_.isEqualTo(hierarchyParent["&id"]) && isChild) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:child_cannot_be_in_hierarchy"),
                new UpdateErrorData(
                    UpdateProblem_familyRuleViolation,
                    [
                        {
                            attribute: attr,
                        },
                        {
                            attribute: new Attribute(
                                id_at_objectClass,
                                [
                                    _encodeObjectIdentifier(id_oc_child, DER),
                                ],
                                undefined,
                            ),
                        },
                    ],
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
    }
    if (
        (unrecognizedAttributes.length > 0)
        || ((noUserModAttributes.length > 0) && !manageDSAIT)
        || (dummyAttributes.length > 0)
        || (!isSubentry && (collectiveAttributes.length > 0))
        || (obsoleteAttributes.length > 0)
        || (incorrectlyMultiValuedAttributes.length > 0)
    ) {
        if (unrecognizedAttributes.length > 0) {
            ctx.log.debug(ctx.i18n.t("err:unrecognized_attribute_type", {
                oids: unrecognizedAttributes.map((at) => at.toString()).join(", "),
            }));
        }
        if ((noUserModAttributes.length > 0) && !manageDSAIT) {
            ctx.log.debug(ctx.i18n.t("err:no_user_modification", {
                oids: noUserModAttributes.map((at) => at.toString()).join(", "),
            }));
        }
        if (dummyAttributes.length > 0) {
            ctx.log.debug(ctx.i18n.t("err:cannot_add_dummy_attr", {
                oids: dummyAttributes.map((at) => at.toString()).join(", "),
            }));
        }
        if (!isSubentry && (collectiveAttributes.length > 0)) {
            ctx.log.debug(ctx.i18n.t("err:cannot_add_collective_attr", {
                oids: collectiveAttributes.map((at) => at.toString()).join(", "),
            }));
        }
        if (obsoleteAttributes.length > 0) {
            ctx.log.debug(ctx.i18n.t("err:cannot_add_obsolete_attr", {
                oids: obsoleteAttributes.map((at) => at.toString()).join(", "),
            }));
        }
        if (incorrectlyMultiValuedAttributes.length > 0) {
            ctx.log.debug(ctx.i18n.t("err:single_valued", {
                oid: incorrectlyMultiValuedAttributes.map((at) => at.toString()).join(", "),
            }));
        }
        const oids: OBJECT_IDENTIFIER[] = [
            ...unrecognizedAttributes,
            ...noUserModAttributes,
            ...dummyAttributes,
            ...collectiveAttributes,
            ...obsoleteAttributes,
            ...incorrectlyMultiValuedAttributes,
        ];
        throw new errors.AttributeError(
            ctx.i18n.t("err:attribute_error_types", {
                oids: oids.map((oid) => oid.toString()).join(", "),
            }),
            new AttributeErrorData(
                {
                    rdnSequence: targetDN,
                },
                [
                    ...unrecognizedAttributes
                        .map((at) => new AttributeErrorData_problems_Item(
                            AttributeProblem_undefinedAttributeType,
                            at,
                            undefined,
                        )),
                    ...noUserModAttributes
                        .map((at) => new AttributeErrorData_problems_Item(
                            AttributeProblem_constraintViolation,
                            at,
                            undefined,
                        )),
                    ...dummyAttributes
                        .map((at) => new AttributeErrorData_problems_Item(
                            AttributeProblem_constraintViolation,
                            at,
                            undefined,
                        )),
                    ...collectiveAttributes
                        .map((at) => new AttributeErrorData_problems_Item(
                            AttributeProblem_constraintViolation,
                            at,
                            undefined,
                        )),
                    ...obsoleteAttributes
                        .map((at) => new AttributeErrorData_problems_Item(
                            AttributeProblem_constraintViolation,
                            at,
                            undefined,
                        )),
                    ...incorrectlyMultiValuedAttributes
                        .map((at) => new AttributeErrorData_problems_Item(
                            AttributeProblem_invalidAttributeSyntax,
                            at,
                            undefined,
                        )),
                ],
                [],
                createSecurityParameters(
                    ctx,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                aliasDereferenced,
                undefined,
            ),
        );
    }

    if (!ctx.config.bulkInsertMode) {
        objectClasses
            .map((oc) => ctx.objectClasses.get(oc.toString()))
            .forEach((oc, i) => {
                const oid = objectClassValues[i].value.objectIdentifier;
                if (!oc) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:unrecognized_object_class", {
                            oid: oid.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attribute: new Attribute(
                                        id_at_objectClass,
                                        [
                                            _encodeObjectIdentifier(oid, DER),
                                        ],
                                        undefined,
                                    ),
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            aliasDereferenced,
                            undefined,
                        ),
                    );
                }
                if (oc.obsolete) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:cannot_add_obsolete_oc", {
                            oid: oid.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attribute: new Attribute(
                                        id_at_objectClass,
                                        [
                                            _encodeObjectIdentifier(oid, DER),
                                        ],
                                        undefined,
                                    ),
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            aliasDereferenced,
                            undefined,
                        ),
                    );
                }
                for (const at of oc.mandatoryAttributes) {
                    missingMandatoryAttributes.add(at);
                    optionalAttributes.add(at);
                }
                for (const at of oc.optionalAttributes) {
                    optionalAttributes.add(at);
                }
            });

        const attributeTypes: Set<IndexableOID> = new Set(entry.map((attr) => attr.type_.toString()));
        for (const at of attributeTypes.values()) {
            missingMandatoryAttributes.delete(at);
            if (!isExtensible && !optionalAttributes.has(at)) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:attribute_type_not_permitted_by_oc", {
                        oids: at,
                    }),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: ObjectIdentifier.fromString(at),
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
        if (missingMandatoryAttributes.size > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:missing_mandatory_attributes", {
                    oids: Array.from(missingMandatoryAttributes).join(", "),
                }),
                new UpdateErrorData(
                    UpdateProblem_objectClassViolation,
                    Array.from(missingMandatoryAttributes).map((at) => ({
                        attributeType: ObjectIdentifier.fromString(at),
                    })),
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }

        const attrsFromDN: Value[] = rdn
            .map((atav): Value => ({
                type: atav.type_,
                value: atav.value,
            }));
        const rdnAttributes: Set<IndexableOID> = new Set();
        const duplicatedAFDNs: AttributeType[] = [];
        const unrecognizedAFDNs: AttributeType[] = [];
        const cannotBeUsedInNameAFDNs: AttributeType[] = [];
        const unmatchedAFDNs: AttributeType[] = [];
        for (const afdn of attrsFromDN) {
            const oid: string = afdn.type.toString();
            if (rdnAttributes.has(oid)) {
                duplicatedAFDNs.push(afdn.type);
                continue;
            } else {
                rdnAttributes.add(oid);
            }
            const spec = ctx.attributeTypes.get(afdn.type.toString());
            if (!spec) {
                unrecognizedAFDNs.push(afdn.type);
                continue;
            }
            if (spec.validator) {
                try {
                    spec.validator(afdn.value);
                } catch {
                    throw new errors.NameError(
                        ctx.i18n.t("err:invalid_attribute_syntax", {
                            type: afdn.type.toString(),
                        }),
                        new NameErrorData(
                            NameProblem_invalidAttributeSyntax,
                            {
                                rdnSequence: targetDN,
                            },
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                nameError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            const matcher = getNamingMatcherGetter(ctx)(afdn.type);
            if (!matcher) {
                cannotBeUsedInNameAFDNs.push(afdn.type);
                continue;
            }
            const someAttributeMatched = values.some((attr) => (
                /**
                 * According to ITU Recommendation X.501 (2019), Section 8.5:
                 *
                 * > A distinguished value may have contexts attached, but such
                 * > context information is not part of a distinguished name.
                 *
                 * I have left this code here, but commented out so posterity
                 * can see that distinguished values MAY have contexts.
                 */
                // (!attr.contexts || (attr.contexts.length === 0))
                attr.type.isEqualTo(afdn.type)
                && matcher(attr.value, afdn.value)
            ));
            if (!someAttributeMatched) {
                unmatchedAFDNs.push(afdn.type);
                continue;
            }
        }

        if (duplicatedAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_types_duplicated", {
                    oids: duplicatedAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, duplicatedAFDNs, aliasDereferenced),
            );
        }

        if (unrecognizedAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_types_unrecognized", {
                    oids: unrecognizedAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, unrecognizedAFDNs, aliasDereferenced),
            );
        }

        if (cannotBeUsedInNameAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_types_prohibited_in_naming", {
                    oids: cannotBeUsedInNameAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, cannotBeUsedInNameAFDNs, aliasDereferenced),
            );
        }

        if (unmatchedAFDNs.length > 0) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:rdn_values_not_present_in_entry", {
                    oids: unmatchedAFDNs.join(", "),
                }),
                namingViolationErrorData(ctx, assn, unmatchedAFDNs, aliasDereferenced),
            );
        }
    }

    if (isSubschemaSubentry) {
        const subschemaThatAlreadyExists = await ctx.db.entry.findFirst({
            where: {
                immediate_superior_id: immediateSuperior.dse.id,
                deleteTimestamp: null,
                subentry: true,
                EntryObjectClass: {
                    some: {
                        object_class: subschema["&id"].toString(),
                    },
                },
            },
            select: {
                dseUUID: true,
            },
        });
        if (subschemaThatAlreadyExists) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:one_subschema", {
                    uuid: subschemaThatAlreadyExists.dseUUID,
                }),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
        const subtreeSpec = entry
            .find((attr) => attr.type_.isEqualTo(subtreeSpecification["&id"]));
        if (subtreeSpec) {
            const ssValues = subtreeSpec.values.length;
            const ssValuesWithContext = (subtreeSpec.valuesWithContext?.length ?? 0);
            if ((ssValues !== 1) || (ssValuesWithContext > 0)) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:subschema_whole_area"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: subtreeSpecification["&id"],
                            }
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                );
            }
            const invalidSubtreeForSubschema = subtreeSpec.values
                .map((v) => _decode_SubtreeSpecification(v))
                .some((ss) => (
                    ((ss.base !== undefined) && (ss.base.length > 0))
                    || ![ undefined, 0 ].includes(ss.minimum as number)
                    || ![ undefined, 0 ].includes(ss.maximum as number)
                    || ss.specificExclusions?.length
                    || ss.specificationFilter
                ));
            if (invalidSubtreeForSubschema) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:subschema_whole_area"),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attributeType: subtreeSpecification["&id"],
                            }
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
    }

    // Subschema validation
    let governingStructureRule: number | undefined;
    const schemaSubentry = isSubentry // Schema rules only apply to entries.
        ? undefined
        : await getSubschemaSubentry(ctx, immediateSuperior);
    if (!isExemptFromSubschema && schemaSubentry) { // Schema rules only apply to entries.
        assert(schemaSubentry.dse.subentry);
        assert(immediateSuperior.dse.governingStructureRule !== undefined); // Checked above.
        const structuralRule = (schemaSubentry.dse.subentry?.ditStructureRules ?? [])
            .find((rule) => {
                if (rule.obsolete) {
                    return false;
                }
                if (!rule.superiorStructureRules?.includes(immediateSuperior.dse.governingStructureRule!)) {
                    return false;
                }
                const nf = ctx.nameForms.get(rule.nameForm.toString());
                if (!nf) {
                    return false;
                }
                if (!nf.namedObjectClass.isEqualTo(structuralObjectClass)) {
                    return false;
                }
                if (nf.obsolete) {
                    return false;
                }
                return checkNameForm(rdn, nf.mandatoryAttributes, nf.optionalAttributes);
            });
        if (!structuralRule) {
            throw new errors.UpdateError(
                ctx.i18n.t("err:no_dit_structural_rules"),
                new UpdateErrorData(
                    UpdateProblem_namingViolation,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        updateError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
            );
        }
        governingStructureRule = Number(structuralRule.ruleIdentifier);
        const contentRule = (schemaSubentry.dse.subentry?.ditContentRules ?? [])
            .find((rule) => !rule.obsolete && rule.structuralObjectClass.isEqualTo(structuralObjectClass));
        const auxiliaryClasses = objectClasses
            .filter((oc) => ctx.objectClasses.get(oc.toString())?.kind == ObjectClassKind_auxiliary);
        if (contentRule) {
            const permittedAuxiliaries: Set<IndexableOID> = new Set(
                contentRule.auxiliaries?.map((oid) => oid.toString()));
            for (const ac of auxiliaryClasses) {
                if (!permittedAuxiliaries.has(ac.toString())) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:aux_oc_not_permitted_by_dit_content_rule", {
                            aoc: ac.toString(),
                            soc: structuralObjectClass.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attribute: new Attribute(
                                        id_at_objectClass,
                                        [
                                            _encodeObjectIdentifier(ac, DER),
                                        ],
                                        undefined,
                                    ),
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            /**
             * According to ITU Recommendation X.501 (2016), Section 13.8.2:
             *
             * > the optional components specify user attribute types which an
             * > entry to which the DIT content rule applies may contain in
             * > addition to those which it may contain according to its
             * > structural and auxiliary object classes;
             *
             * Meerkat DSA knowingly will not observe this feature.
             * Circumstantially allowing attributes to be added in spite of the
             * object class constraints would make it difficult to enforce
             * schema. What happens when you move the entry? What happens when
             * you move, change, or remove the content rule? Meerkat DSA does
             * not have to handle these tricky cases, because it will not permit
             * additional attribute types.
             */
            // const optionalAttributes: Set<IndexableOID> = new Set(
            //     contentRule.optional?.map((oid) => oid.toString()));
            const mandatoryAttributesRemaining: Set<IndexableOID> = new Set(
                contentRule.mandatory?.map((oid) => oid.toString()));
            const precludedAttributes: Set<IndexableOID> = new Set(
                contentRule.precluded?.map((oid) => oid.toString()));
            for (const attr of entry) {
                mandatoryAttributesRemaining.delete(attr.type_.toString());
                if (precludedAttributes.has(attr.type_.toString())) {
                    throw new errors.UpdateError(
                        ctx.i18n.t("err:attr_type_precluded", {
                            oid: attr.type_.toString(),
                            soc: structuralObjectClass.toString(),
                        }),
                        new UpdateErrorData(
                            UpdateProblem_objectClassViolation,
                            [
                                {
                                    attributeType: attr.type_,
                                },
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                updateError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            if (mandatoryAttributesRemaining.size > 0) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:dit_content_rule_missing_mandatory_attributes", {
                        soc: structuralObjectClass.toString(),
                        oids: Array.from(mandatoryAttributesRemaining.values()).join(" "),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        Array.from(mandatoryAttributesRemaining.values())
                            .map(ObjectIdentifier.fromString)
                            .map((oid) => ({
                                attributeType: oid,
                            })),
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                );
            }
        } else {
            /**
             * From ITU Recommendation X.501 (2016), Section 13.8.1:
             *
             * > If no DIT content rule is present for a structural object
             * > class, then entries of that class shall contain only the
             * > attributes permitted by the structural object class definition.
             *
             * This implementation will simply check that there are no
             * auxiliary classes at all. Theoretically, this could exclude
             * auxiliary classes that have only optional attributes that overlap
             * with those of the structural object class, but at that point,
             * there is almost no point in including the auxiliary object class.
             */

            if (auxiliaryClasses.length > 0) {
                throw new errors.UpdateError(
                    ctx.i18n.t("err:aux_oc_forbidden_because_no_dit_content_rules", {
                        oids: auxiliaryClasses.map((oid) => oid.toString()).join(", "),
                        soc: structuralObjectClass.toString(),
                    }),
                    new UpdateErrorData(
                        UpdateProblem_objectClassViolation,
                        [
                            {
                                attribute: new Attribute(
                                    id_at_objectClass,
                                    auxiliaryClasses
                                        .map((ac) => _encodeObjectIdentifier(ac, DER)),
                                    undefined,
                                ),
                            },
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            updateError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }

        const contextUseRules = (schemaSubentry.dse.subentry?.ditContextUse ?? [])
            .filter((rule) => !rule.obsolete);
        const contextRulesIndex: Map<IndexableOID, DITContextUseDescription> = new Map(
            contextUseRules.map((rule) => [ rule.identifier.toString(), rule ]),
        );
        for (const value of values) {
            const applicableRule = contextRulesIndex.get(value.type.toString())
                ?? contextRulesIndex.get(ALL_ATTRIBUTE_TYPES);
            /**
             * From ITU Recommendation X.501 (2016), Section 13.10.1:
             *
             * > If no DIT Context Use definition is present for a given
             * > attribute type, then values of attributes of that type shall
             * > contain no context lists.
             */
            if (!applicableRule) {
                if (value.contexts && (value.contexts.length > 0)) {
                    throw new errors.AttributeError(
                        ctx.i18n.t("err:no_contexts_permitted", {
                            oid: value.type.toString(),
                        }),
                        new AttributeErrorData(
                            {
                                rdnSequence: targetDN,
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_contextViolation,
                                    value.type,
                                    value.value,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            aliasDereferenced,
                            undefined,
                        ),
                    );
                } else {
                    continue;
                }
            }

            const mandatoryContextsRemaining: Set<IndexableOID> = new Set(
                applicableRule.information.mandatoryContexts?.map((con) => con.toString()),
            );
            const permittedContexts: OBJECT_IDENTIFIER[] = [
                ...applicableRule.information.mandatoryContexts ?? [],
                ...applicableRule.information.optionalContexts ?? [],
            ];
            const permittedContextsIndex: Set<IndexableOID> = new Set(permittedContexts.map((con) => con.toString()));
            // Add default context values
            for (const contextType of permittedContextsIndex.values()) {
                const contextSpec = ctx.contextTypes.get(contextType);
                if (
                    (contextSpec?.defaultValue)
                    && (
                        !value.contexts?.length // If there are no contexts
                        // Or there are no contexts of the defaulting context type
                        || !value.contexts.some((c) => c.contextType.isEqualTo(contextSpec.id))
                    )
                ) {
                    const defaultValue = contextSpec.defaultValue();
                    const defaultedContext: X500Context = new X500Context(
                        contextSpec.id,
                        [ defaultValue ],
                        undefined,
                    );
                    if (value.contexts) {
                        value.contexts.push(defaultedContext);
                    } else {
                        value.contexts = [ defaultedContext ];
                    }
                }
            }
            for (const context of value.contexts?.values() ?? []) {
                const ID: string = context.contextType.toString();
                mandatoryContextsRemaining.delete(ID);
                if (!permittedContextsIndex.has(ID)) {
                    throw new errors.AttributeError(
                        ctx.i18n.t("err:context_type_prohibited_by_context_use_rule", {
                            ct: ID,
                            at: value.type.toString(),
                        }),
                        new AttributeErrorData(
                            {
                                rdnSequence: targetDN,
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_contextViolation,
                                    value.type,
                                    value.value,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                assn.boundNameAndUID?.dn,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            aliasDereferenced,
                            undefined,
                        ),
                    );
                }
            }
            if (mandatoryContextsRemaining.size > 0) {
                throw new errors.AttributeError(
                    ctx.i18n.t("err:missing_required_context_types", {
                        attr: value.type.toString(),
                        oids: Array.from(mandatoryContextsRemaining.values()).join(", "),
                    }),
                    new AttributeErrorData(
                        {
                            rdnSequence: targetDN,
                        },
                        [
                            new AttributeErrorData_problems_Item(
                                AttributeProblem_contextViolation,
                                value.type,
                                value.value,
                            ),
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            assn.boundNameAndUID?.dn,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        aliasDereferenced,
                        undefined,
                    ),
                );
            }
        }
    }

    return {
        structuralObjectClass,
        governingStructureRule,
    };
}
