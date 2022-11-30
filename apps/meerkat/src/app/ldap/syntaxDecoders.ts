import type { Context } from "@wildboar/meerkat-types";
import type LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import {
    ASN1Element,
    BERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
} from "asn1-ts";
import { BER, DER, _encodeNumericString, _encodePrintableString, _encodeUTF8String } from "asn1-ts/dist/node/functional";
import lex from "./lexSchema";
import isDigit from "../utils/isDigit";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    AttributeUsage,
    AttributeUsage_dSAOperation,
    AttributeUsage_directoryOperation,
    AttributeUsage_distributedOperation,
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    ObjectClassDescription,
    _encode_ObjectClassDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassDescription.ta";
import {
    ObjectClassInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassInformation.ta";
import {
    AttributeTypeDescription,
    _encode_AttributeTypeDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/AttributeTypeDescription.ta";
import {
    AttributeTypeInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/AttributeTypeInformation.ta";
import {
    MatchingRuleDescription,
    _encode_MatchingRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleDescription.ta";
import {
    MatchingRuleUseDescription,
    _encode_MatchingRuleUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleUseDescription.ta";
import {
    DITContentRuleDescription,
    _encode_DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import {
    DITStructureRuleDescription,
    _encode_DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
import {
    NameFormDescription,
    _encode_NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    NameFormInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormInformation.ta";
import {
    LdapSyntaxDescription,
    _encode_LdapSyntaxDescription,
} from "@wildboar/x500/src/lib/modules/LdapSystemSchema/LdapSyntaxDescription.ta";
import {
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import { getSubtreeSpecLexer } from "./lexSubtreeSpec";
import { phone } from "phone";
import decodeLDAPDN from "./decodeLDAPDN";
import {
    _encode_RelativeDistinguishedName,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import {
    BootParameterSyntax,
    _encode_BootParameterSyntax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/BootParameterSyntax.ta";
import {
    NISNetgroupTripleSyntax,
    _encode_NISNetgroupTripleSyntax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/NISNetgroupTripleSyntax.ta";
import { UtmCoordinates, _encode_UtmCoordinates } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UtmCoordinates.ta";
import { UiiFormat_subset, UiiFormat_subset_baseObject, UiiFormat_subset_oneLevel, UiiFormat_subset_wholeSubtree } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UiiFormat-subset.ta";
import { UiiFilter, UiiFormat_next } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UiiFormat-next.ta";
import { UiiFormat, _encode_UiiFormat } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UiiFormat.ta";
import { UiiItem } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UiiItem.ta";
import { EpcFormat_fields_Item_charField } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/EpcFormat-fields-Item-charField.ta";
import { EpcFormat_fields_Item, EpcFormat_fields_Item_result, EpcFormat_fields_Item_result_alpha7bits, EpcFormat_fields_Item_result_numeric, EpcFormat_fields_Item_result_numericPad } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/EpcFormat-fields-Item.ta";
import { EpcFormat, _encode_EpcFormat } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/EpcFormat.ta";
import { parseOneAddress } from "email-addresses";

function qdstring (escaped: string): string {
    return escaped
        .slice(1, -1)
        .replace(/\\27/g, "'")
        .replace(/\\5C/g, "\\");
}

function descr (str: string): string {
    const unsanitized = str.slice(1, -1);
    if (!/[A-Za-z][A-Za-z0-9-]*/.test(unsanitized)) {
        throw new Error("8c14480e-f77e-4203-a9f7-7602dddf5760");
    }
    if (unsanitized.endsWith("-")) {
        // Technically, this is not prohibited by the spec, but it is probably invalid.
        throw new Error("04a53119-d3e2-42b8-b8bd-211236688b1d");
    }
    return unsanitized;
}

// export
// const objectClasses: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const attributeTypes: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const matchingRules: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const matchingRuleUse: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const ldapSyntaxes: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const dITContentRules: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const dITStructureRules: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const nameForms: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

export
function getDITStructureRulesDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const tokens = Array.from(lex(str)).slice(1, -1);
        const identifier: number = Number.parseInt(tokens[0]);
        const name: string[] = [];
        let description: string | undefined;
        let obsolete: boolean = false;
        let form: OBJECT_IDENTIFIER | undefined;
        const superiorRuleIds: number[] = [];
        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
                case ("NAME"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            name.push(descr(tokens[t]));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(descr(tokens[t]));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = qdstring(tokens[t]);
                    }
                    break;
                }
                case ("OBSOLETE"): {
                    obsolete = true;
                    break;
                }
                case ("FORM"): {
                    t++;
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        form = ObjectIdentifier.fromString(tokens[t]);
                    } else {
                        const spec = ctx.nameForms.get(tokens[t].trim().toLowerCase());
                        if (!spec) {
                            throw new Error("96f6c1be-2a55-4ebf-b349-f21d85376cfd");
                        }
                        form = spec.id;
                    }
                    break;
                }
                case ("SUP"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            superiorRuleIds.push(Number.parseInt(tokens[t]));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        superiorRuleIds.push(Number.parseInt(tokens[t]));
                    }
                    break;
                }
            }
        }
        if (!form) {
            throw new Error("03114b82-321c-43fd-b396-f6a98fa3896e");
        }
        const desc = new DITStructureRuleDescription(
            identifier,
            form,
            superiorRuleIds.length
                ? superiorRuleIds
                : undefined,
            name?.map((name) => ({
                uTF8String: name,
            })),
            description
                ? {
                    uTF8String: description,
                }
                : undefined,
            obsolete,
        );
        return _encode_DITStructureRuleDescription(desc, DER);
    };
}

export
function getNameFormsDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const tokens = Array.from(lex(str)).slice(1, -1);
        const identifier: OBJECT_IDENTIFIER = ObjectIdentifier.fromString(tokens[0]);
        const name: string[] = [];
        let description: string | undefined;
        let obsolete: boolean = false;
        let subordinate: OBJECT_IDENTIFIER | undefined;
        const mandatories: OBJECT_IDENTIFIER[] = [];
        const optionals: OBJECT_IDENTIFIER[] = [];
        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
                case ("NAME"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            name.push(descr(tokens[t]));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(descr(tokens[t]));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = qdstring(tokens[t]);
                    }
                    break;
                }
                case ("OBSOLETE"): {
                    obsolete = true;
                    break;
                }
                case ("OC"): {
                    t++;
                    subordinate = ObjectIdentifier.fromString(tokens[t]);
                    break;
                }
                case ("MUST"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            if (isDigit(tokens[t].charCodeAt(0))) {
                                mandatories.push(ObjectIdentifier.fromString(tokens[t]));
                            } else {
                                const spec = ctx.attributeTypes.get(tokens[t]);
                                if (!spec) {
                                    throw new Error("567bb513-d8be-489d-8e63-021bcccfaa7e");
                                }
                                mandatories.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            mandatories.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.attributeTypes.get(tokens[t]);
                            if (!spec) {
                                throw new Error("18307b03-755d-460f-886b-0dde1ebfda44");
                            }
                            mandatories.push(spec.id);
                        }
                    }
                    break;
                }
                case ("MAY"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            if (isDigit(tokens[t].charCodeAt(0))) {
                                optionals.push(ObjectIdentifier.fromString(tokens[t]));
                            } else {
                                const spec = ctx.objectClasses.get(tokens[t]);
                                if (!spec) {
                                    throw new Error("20ee149b-b7ad-4897-89c3-1e9d74be0eab");
                                }
                                optionals.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            optionals.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.objectClasses.get(tokens[t]);
                            if (!spec) {
                                throw new Error("866266df-2003-4228-a4e2-d89239844d0b");
                            }
                            optionals.push(spec.id);
                        }
                    }
                    break;
                }
            }
        }
        if (!subordinate) {
            throw new Error("81698cf9-70a8-4715-ad5b-9e500f04d778");
        }
        const desc = new NameFormDescription(
            identifier,
            name?.map((name) => ({
                uTF8String: name,
            })),
            description
                ? {
                    uTF8String: description,
                }
                : undefined,
            obsolete,
            new NameFormInformation(
                subordinate,
                mandatories,
                optionals.length
                    ? optionals
                    : undefined,
            ),
        );
        return _encode_NameFormDescription(desc, DER);
    };
}

export
function getDITContentRulesDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const tokens = Array.from(lex(str)).slice(1, -1);
        const structuralObjectClass: OBJECT_IDENTIFIER = ObjectIdentifier.fromString(tokens[0]);
        const name: string[] = [];
        let description: string | undefined;
        let obsolete: boolean = false;
        const auxiliaries: OBJECT_IDENTIFIER[] = [];
        const mandatory: OBJECT_IDENTIFIER[] = [];
        const optional: OBJECT_IDENTIFIER[] = [];
        const precluded: OBJECT_IDENTIFIER[] = [];
        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
                case ("NAME"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            name.push(descr(tokens[t]));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(descr(tokens[t]));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = qdstring(tokens[t]);
                    }
                    break;
                }
                case ("OBSOLETE"): {
                    obsolete = true;
                    break;
                }
                case ("AUX"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            if (isDigit(tokens[t].charCodeAt(0))) {
                                auxiliaries.push(ObjectIdentifier.fromString(tokens[t]));
                            } else {
                                const spec = ctx.objectClasses.get(tokens[t]);
                                if (!spec) {
                                    throw new Error("ac8721c1-5a40-49c8-8a34-5c47b1e7ba19");
                                }
                                auxiliaries.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            auxiliaries.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.objectClasses.get(tokens[t]);
                            if (!spec) {
                                throw new Error("7be5e014-7a88-4a86-ab28-0bb5b57b4fe0");
                            }
                            auxiliaries.push(spec.id);
                        }
                    }
                    break;
                }
                case ("MUST"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            if (isDigit(tokens[t].charCodeAt(0))) {
                                mandatory.push(ObjectIdentifier.fromString(tokens[t]));
                            } else {
                                const spec = ctx.attributeTypes.get(tokens[t]);
                                if (!spec) {
                                    throw new Error("f970809b-a3e4-402a-ad79-62bb74840a63");
                                }
                                mandatory.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            mandatory.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.attributeTypes.get(tokens[t]);
                            if (!spec) {
                                throw new Error("45d710b8-8ac5-48d0-86b2-fd24214a38db");
                            }
                            mandatory.push(spec.id);
                        }
                    }
                    break;
                }
                case ("MAY"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            if (isDigit(tokens[t].charCodeAt(0))) {
                                optional.push(ObjectIdentifier.fromString(tokens[t]));
                            } else {
                                const spec = ctx.objectClasses.get(tokens[t]);
                                if (!spec) {
                                    throw new Error("b9e640ac-a485-4bcb-9b4d-201b9b3894d7");
                                }
                                optional.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            optional.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.objectClasses.get(tokens[t]);
                            if (!spec) {
                                throw new Error("7b3d5afc-1e5a-4360-9966-a65852121536");
                            }
                            optional.push(spec.id);
                        }
                    }
                    break;
                }
                case ("NOT"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            if (isDigit(tokens[t].charCodeAt(0))) {
                                precluded.push(ObjectIdentifier.fromString(tokens[t]));
                            } else {
                                const spec = ctx.objectClasses.get(tokens[t]);
                                if (!spec) {
                                    throw new Error("12f9fb99-0099-4acc-a6a7-2a67c31b8300");
                                }
                                precluded.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            precluded.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.objectClasses.get(tokens[t]);
                            if (!spec) {
                                throw new Error("52571ade-c42a-472b-a4a0-b124dab5596e");
                            }
                            precluded.push(spec.id);
                        }
                    }
                    break;
                }
            }
        }
        const desc = new DITContentRuleDescription(
            structuralObjectClass,
            auxiliaries.length
                ? auxiliaries
                : undefined,
            mandatory.length
                ? mandatory
                : undefined,
            optional.length
                ? optional
                : undefined,
            precluded.length
                ? precluded
                : undefined,
            name?.map((name) => ({
                uTF8String: name,
            })),
            description
                ? {
                    uTF8String: description,
                }
                : undefined,
            obsolete,
        );
        return _encode_DITContentRuleDescription(desc, DER);
    };
}

export
function getObjectClassesDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const tokens = Array.from(lex(str)).slice(1, -1);
        const identifier: OBJECT_IDENTIFIER = ObjectIdentifier.fromString(tokens[0]);
        const name: string[] = [];
        let description: string | undefined;
        let obsolete: boolean = false;
        const subclassOf: OBJECT_IDENTIFIER[] = [];
        let kind: ObjectClassKind = ObjectClassKind_structural;
        const mandatories: OBJECT_IDENTIFIER[] = [];
        const optionals: OBJECT_IDENTIFIER[] = [];

        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
            case ("NAME"): {
                t++;
                if (tokens[t] === "(") {
                    t++;
                    while ((t < tokens.length) && (tokens[t] !== ")")) {
                        name.push(descr(tokens[t]));
                        t++;
                    }
                } else if (tokens[t]) { // Checking that it's not undefined.
                    name.push(descr(tokens[t]));
                }
                break;
            }
            case ("DESC"): {
                t++;
                if (tokens[t]) {
                    description = qdstring(tokens[t]);
                }
                break;
            }
            case ("OBSOLETE"): {
                obsolete = true;
                break;
            }
            case ("SUP"): {
                t++;
                if (tokens[t] === "(") {
                    t++;
                    while ((t < tokens.length) && (tokens[t] !== ")")) {
                        if (tokens[t] === "$") {
                            t++;
                            continue;
                        }
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            subclassOf.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.objectClasses.get(tokens[t]);
                            if (!spec) {
                                throw new Error("ae59e368-dee6-4e0e-a851-9b47f566db96");
                            }
                            subclassOf.push(spec.id);
                        }
                        t++;
                    }
                } else if (tokens[t]) { // Checking that it's not undefined.
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        subclassOf.push(ObjectIdentifier.fromString(tokens[t]));
                    } else {
                        const spec = ctx.objectClasses.get(tokens[t]);
                        if (!spec) {
                            throw new Error("a517ddfd-cd74-4010-b250-ef17246b2428");
                        }
                        subclassOf.push(spec.id);
                    }
                }
                break;
            }
            case ("ABSTRACT"): {
                kind = ObjectClassKind_abstract;
                break;
            }
            case ("STRUCTURAL"): {
                kind = ObjectClassKind_structural;
                break;
            }
            case ("AUXILIARY"): {
                kind = ObjectClassKind_auxiliary;
                break;
            }
            case ("MUST"): {
                t++;
                if (tokens[t] === "(") {
                    t++;
                    while ((t < tokens.length) && (tokens[t] !== ")")) {
                        if (tokens[t] === "$") {
                            t++;
                            continue;
                        }
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            mandatories.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.attributeTypes.get(tokens[t]);
                            if (!spec) {
                                throw new Error("e2953368-9849-4b40-9cdf-0660b7281d19");
                            }
                            mandatories.push(spec.id);
                        }
                        t++;
                    }
                } else if (tokens[t]) { // Checking that it's not undefined.
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        mandatories.push(ObjectIdentifier.fromString(tokens[t]));
                    } else {
                        const spec = ctx.attributeTypes.get(tokens[t]);
                        if (!spec) {
                            throw new Error("4feb64de-bf93-40bd-bdfe-43ee1379f241");
                        }
                        mandatories.push(spec.id);
                    }
                }
                break;
            }
            case ("MAY"): {
                t++;
                if (tokens[t] === "(") {
                    t++;
                    while ((t < tokens.length) && (tokens[t] !== ")")) {
                        if (tokens[t] === "$") {
                            t++;
                            continue;
                        }
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            optionals.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.objectClasses.get(tokens[t]);
                            if (!spec) {
                                throw new Error("96591e72-b885-462e-8acb-ac09a8b0ebe6");
                            }
                            optionals.push(spec.id);
                        }
                        t++;
                    }
                } else if (tokens[t]) { // Checking that it's not undefined.
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        optionals.push(ObjectIdentifier.fromString(tokens[t]));
                    } else {
                        const spec = ctx.objectClasses.get(tokens[t]);
                        if (!spec) {
                            throw new Error("a2861d9d-c9bf-405e-bc64-5c550c36905e");
                        }
                        optionals.push(spec.id);
                    }
                }
                break;
            }
            }
        }
        const desc = new ObjectClassDescription(
            identifier,
            name?.map((name) => ({
                uTF8String: name,
            })),
            description
                ? {
                    uTF8String: description,
                }
                : undefined,
            obsolete,
            new ObjectClassInformation(
                subclassOf,
                kind,
                mandatories.length
                    ? mandatories
                    : undefined,
                optionals.length
                    ? optionals
                    : undefined,
            ),
        );
        return _encode_ObjectClassDescription(desc, DER);
    };
}

export
function getAttributeTypesDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const tokens = Array.from(lex(str)).slice(1, -1);
        const identifier: OBJECT_IDENTIFIER = ObjectIdentifier.fromString(tokens[0]);
        const name: string[] = [];
        let description: string | undefined;
        let obsolete: boolean = false;
        let derivation: OBJECT_IDENTIFIER | undefined;
        let equalityMatch: OBJECT_IDENTIFIER | undefined;
        let orderingMatch: OBJECT_IDENTIFIER | undefined;
        let substringsMatch: OBJECT_IDENTIFIER | undefined;
        let attributeSyntax: OBJECT_IDENTIFIER | undefined;
        let multiValued: boolean = true;
        let collective: boolean = false;
        let userModifiable: boolean = true;
        let application: AttributeUsage = AttributeUsage_userApplications;
        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
                case ("NAME"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            name.push(descr(tokens[t]));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(descr(tokens[t]));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = qdstring(tokens[t]);
                    }
                    break;
                }
                case ("OBSOLETE"): {
                    obsolete = true;
                    break;
                }
                case ("SUP"): {
                    t++;
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        derivation = ObjectIdentifier.fromString(tokens[t]);
                    } else {
                        const spec = ctx.objectClasses.get(tokens[t]);
                        if (!spec) {
                            throw new Error("67d839c2-acb5-4126-bff6-74e53103b52b");
                        }
                        derivation = spec.id;
                    }
                    break;
                }
                case ("EQUALITY"): {
                    t++;
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        equalityMatch = ObjectIdentifier.fromString(tokens[t]);
                    } else {
                        const spec = ctx.objectClasses.get(tokens[t]);
                        if (!spec) {
                            throw new Error("ee0814a2-bbc0-4747-8bc3-fc987215d786");
                        }
                        equalityMatch = spec.id;
                    }
                    break;
                }
                case ("ORDERING"): {
                    t++;
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        orderingMatch = ObjectIdentifier.fromString(tokens[t]);
                    } else {
                        const spec = ctx.objectClasses.get(tokens[t]);
                        if (!spec) {
                            throw new Error("41b4fa84-e845-4d6e-9c3d-9d3f19ac55a2");
                        }
                        orderingMatch = spec.id;
                    }
                    break;
                }
                case ("SUBSTR"): {
                    t++;
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        substringsMatch = ObjectIdentifier.fromString(tokens[t]);
                    } else {
                        const spec = ctx.objectClasses.get(tokens[t]);
                        if (!spec) {
                            throw new Error("0bcc017b-457e-49ac-80d4-e5f417505edf");
                        }
                        substringsMatch = spec.id;
                    }
                    break;
                }
                case ("SYNTAX"): {
                    t++;
                    const indexOfLcurly = tokens[t].indexOf("{");
                    const numericoid = (indexOfLcurly > -1)
                        ? tokens[t].slice(0, indexOfLcurly)
                        : tokens[t];
                    attributeSyntax = ObjectIdentifier.fromString(numericoid);
                    break;
                }
                case ("SINGLE-VALUE"): {
                    multiValued = false;
                    break;
                }
                case ("COLLECTIVE"): {
                    collective = true;
                    break;
                }
                case ("NO-USER-MODIFICATION"): {
                    userModifiable = false;
                    break;
                }
                case ("userApplications"): {
                    application = AttributeUsage_userApplications;
                    break;
                }
                case ("directoryOperation"): {
                    application = AttributeUsage_directoryOperation;
                    break;
                }
                case ("distributedOperation"): {
                    application = AttributeUsage_distributedOperation;
                    break;
                }
                case ("dSAOperation"): {
                    application = AttributeUsage_dSAOperation;
                    break;
                }
            }
        }
        const syntax: string | undefined = attributeSyntax
            ? ctx.ldapSyntaxToASN1Syntax.get(attributeSyntax.toString())
            : undefined;
        const desc = new AttributeTypeDescription(
            identifier,
            name?.map((name) => ({
                uTF8String: name,
            })),
            description
                ? {
                    uTF8String: description,
                }
                : undefined,
            obsolete,
            new AttributeTypeInformation(
                derivation,
                equalityMatch,
                orderingMatch,
                substringsMatch,
                syntax
                    ? {
                        uTF8String: syntax,
                    }
                    : undefined,
                multiValued,
                collective,
                userModifiable,
                application,
            ),
        );
        return _encode_AttributeTypeDescription(desc, DER);
    };
}

export
function getMatchingRulesDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const tokens = Array.from(lex(str)).slice(1, -1);
        const identifier: OBJECT_IDENTIFIER = ObjectIdentifier.fromString(tokens[0]);
        const name: string[] = [];
        let description: string | undefined;
        let obsolete: boolean = false;
        let assertionSyntax: OBJECT_IDENTIFIER | undefined;
        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
                case ("NAME"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            name.push(descr(tokens[t]));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(descr(tokens[t]));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = qdstring(tokens[t]);
                    }
                    break;
                }
                case ("OBSOLETE"): {
                    obsolete = true;
                    break;
                }
                case ("SYNTAX"): {
                    t++;
                    const indexOfLcurly = tokens[t].indexOf("{");
                    const numericoid = (indexOfLcurly > -1)
                        ? tokens[t].slice(0, indexOfLcurly)
                        : tokens[t];
                        assertionSyntax = ObjectIdentifier.fromString(numericoid);
                    break;
                }
            }
        }
        const syntax: string | undefined = assertionSyntax
            ? ctx.ldapSyntaxToASN1Syntax.get(assertionSyntax.toString())
            : undefined;
        const desc = new MatchingRuleDescription(
            identifier,
            name?.map((name) => ({
                uTF8String: name,
            })),
            description
                ? {
                    uTF8String: description,
                }
                : undefined,
            obsolete,
            syntax
                ? {
                    uTF8String: syntax,
                }
                : undefined,
        );
        return _encode_MatchingRuleDescription(desc, DER);
    };
}

export
function getMatchingRuleUseDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const tokens = Array.from(lex(str)).slice(1, -1);
        const identifier: OBJECT_IDENTIFIER = ObjectIdentifier.fromString(tokens[0]);
        const name: string[] = [];
        let description: string | undefined;
        let obsolete: boolean = false;
        const applies: OBJECT_IDENTIFIER[] = [];
        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
                case ("NAME"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            name.push(descr(tokens[t]));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(descr(tokens[t]));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = qdstring(tokens[t]);
                    }
                    break;
                }
                case ("OBSOLETE"): {
                    obsolete = true;
                    break;
                }
                case ("APPLIES"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            if (tokens[t] === "$") {
                                t++;
                                continue;
                            }
                            if (isDigit(tokens[t].charCodeAt(0))) {
                                applies.push(ObjectIdentifier.fromString(tokens[t]));
                            } else {
                                const spec = ctx.objectClasses.get(tokens[t]);
                                if (!spec) {
                                    throw new Error("40e1a318-34c3-4c6f-a48d-da4f60daf68d");
                                }
                                applies.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            applies.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.objectClasses.get(tokens[t]);
                            if (!spec) {
                                throw new Error("db977c64-7993-400b-99f6-e9c03c518c03");
                            }
                            applies.push(spec.id);
                        }
                    }
                    break;
                }
            }
        }
        const desc = new MatchingRuleUseDescription(
            identifier,
            name?.map((name) => ({
                uTF8String: name,
            })),
            description
                ? {
                    uTF8String: description,
                }
                : undefined,
            obsolete,
            applies,
        );
        return _encode_MatchingRuleUseDescription(desc, DER);
    };
}

export
function ldapSyntaxes (value: Uint8Array): ASN1Element {
    const str = Buffer.from(value).toString("utf-8");
    const tokens = Array.from(lex(str)).slice(1, -1);
    const identifier: OBJECT_IDENTIFIER = ObjectIdentifier.fromString(tokens[0]);
    let description: string | undefined;
    for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
        switch (tokens[t]) {
            case ("DESC"): {
                t++;
                if (tokens[t]) {
                    description = qdstring(tokens[t]);
                }
                break;
            }
        }
    }
    const desc = new LdapSyntaxDescription(
        identifier,
        description
            ? {
                uTF8String: description,
            }
            : undefined,
    );
    return _encode_LdapSyntaxDescription(desc, DER);
}

export
function getSubtreeSpecificationDecoder (
    ctx: Context,
): LDAPSyntaxDecoder {
    const lexer = getSubtreeSpecLexer(ctx);
    return function (value: Uint8Array): ASN1Element {
        const str = Buffer.from(value).toString("utf-8");
        const ss = lexer(str);
        return _encode_SubtreeSpecification(ss, DER);
    };
}

export
const telephoneNumber: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("utf-8");
    const phoneResult = phone(str, {
        validateMobilePrefix: false,
    });
    if (!phoneResult.isValid) {
        throw new Error("5a90e5b3-ccb6-4f20-9982-f3f4feb2054f");
    }
    const el = new BERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.printableString,
    );
    el.printableString = phoneResult.phoneNumber;
    return el;
};

// export
// const authPasswordSyntax: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

export
const bootParameterSyntax: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("utf-8");
    const indexOfNextEq = str.indexOf("=");
    if (indexOfNextEq < 0) {
        throw new Error("2aaf79ea-5509-4380-bca1-822821123046");
    }
    const indexOfNextColon = str.indexOf(":", indexOfNextEq + 1);
    if (indexOfNextColon < 0) {
        throw new Error("fde3b2d4-d3af-4c4e-a0ba-071e25bb1f9e");
    }
    const key = str.slice(0, indexOfNextEq);
    const server = str.slice(indexOfNextEq + 1, indexOfNextColon);
    const path = str.slice(indexOfNextColon);
    const bps = new BootParameterSyntax(key, server, path);
    return _encode_BootParameterSyntax(bps, BER);
};

export
const nisNetgroupTripleSyntax: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("latin1");
    const [ hostname, username, domainname ] = str.slice(1, -1).split(",");
    const nts = new NISNetgroupTripleSyntax(
        (hostname?.length && (hostname !== "-")) ? hostname : undefined,
        (username?.length && (username !== "-")) ? username : undefined,
        (domainname?.length && (domainname !== "-")) ? domainname : undefined,
    );
    return _encode_NISNetgroupTripleSyntax(nts, DER);
};

// export
// const componentFilter: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

export
const null_: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    // Theoretically, we could check the syntax, but there's no point other than
    // unnecessary policing.
    return new BERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.nill,
        null,
    );
};

// export
// const open: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

// export
// const rdn: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
//     const str = Buffer.from(value).toString("utf-8");
// };

export
function getRDNDecoder (ctx: Context): LDAPSyntaxDecoder {
    return (value: Uint8Array): ASN1Element => {
        const dn = decodeLDAPDN(ctx, value);
        return _encode_RelativeDistinguishedName(dn[0] ?? [], DER);
    };
}

//   UtmCoordinates ::= SEQUENCE {
//     zone      PrintableString,
//     easting   NumericString,
//     northing  NumericString }
export
const utmCoords: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("latin1");
    const v = JSON.parse(
        str
            .replace("zone", '"zone":')
            .replace("easting", '"easting":')
            .replace("northing", '"northing":')
    );
    if (typeof v !== "object" || !v) {
        throw new Error("2bb01fa9-2280-4b25-9671-f061a85a6c56");
    }
    const zone = v["zone"];
    const easting = v["easting"];
    const northing = v["northing"];
    if (!zone || !easting || !northing) {
        throw new Error("a07f0033-ba6e-404b-a664-583fb6ac20a1");
    }
    if (
        (typeof zone !== "string")
        || (typeof easting !== "string")
        || (typeof northing !== "string")
    ) {
        throw new Error("1c1289c7-c8dd-4a7b-98a0-a1abeeb6482e");
    }
    const u = new UtmCoordinates(zone, easting, northing);
    return _encode_UtmCoordinates(u, BER);
};

// UiiFormat ::= SEQUENCE {
//     baseObject  URI  OPTIONAL,
//     subset      ENUMERATED {
//         baseObject   (0),
//         oneLevel     (1),
//         wholeSubtree (2) } DEFAULT baseObject,
//     next        CHOICE {
//         length      INTEGER,
//         filter      UiiFilter } }

// UiiFilter ::= CHOICE {
//     item  [0]  UiiItem,
//     and   [1]  SET OF UiiFilter,
//     or    [2]  SET OF UiiFilter,
//     not   [3]  UiiFilter }

// UiiItem ::= SEQUENCE {
//     type   ATTRIBUTE.&id,
//     length INTEGER OPTIONAL }

function decodeUiiFilter (
    ctx: Context,
    str: string,
    start_index: number,
): [ number, UiiFilter ] {
    let bytes_read: number = 0;
    if (str.slice(start_index, start_index + 4).toLowerCase() === "item") {
        bytes_read += 4;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        if (str[start_index + bytes_read] !== ":") {
            throw new Error();
        }
        bytes_read++;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        if (str[start_index + bytes_read] !== "{") {
            throw new Error();
        }
        bytes_read++;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        let i = start_index + bytes_read;
        if (str.slice(i, i + 4).toLowerCase() !== "type") {
            throw new Error();
        }
        bytes_read += 4;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        i = start_index + bytes_read;
        const j = /^[A-Za-z0-9.-]+/.exec(str.slice(i))?.[0].length ?? 0;
        const oid = str.slice(i, i + j);
        let type_: OBJECT_IDENTIFIER | undefined;
        try {
            type_ = ObjectIdentifier.fromString(oid);
        } catch {
            type_ = ctx.nameToObjectIdentifier.get(oid.toLowerCase());
        }
        if (!type_) {
            throw new Error();
        }
        bytes_read += j;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        let length: number | undefined;
        if (str[start_index + bytes_read] === ",") {
            bytes_read++;
            bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
            i = start_index + bytes_read;
            if (str.slice(i, i + 6).toLowerCase() !== "length") {
                throw new Error();
            }
            bytes_read += 6;
            bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
            const digits = /^\d+/.exec(str.slice(start_index + bytes_read))?.[0];
            if (!digits) {
                throw new Error();
            }
            length = Number.parseInt(digits, 10);
            bytes_read += digits.length;
            bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        }
        if (str[start_index + bytes_read] !== "}") {
            throw new Error();
        }
        bytes_read++;
        return [ bytes_read, { item: new UiiItem(type_, length) } ];
    } else if (str.slice(start_index, start_index + 3).toLowerCase() === "and") {
        bytes_read += 3;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        if (str[start_index + bytes_read] !== ":") {
            throw new Error();
        }
        bytes_read++;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        if (str[start_index + bytes_read] !== "{") {
            throw new Error();
        }
        bytes_read++;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        let i = start_index + bytes_read;
        const components: UiiFilter[] = [];
        while ((i < str.length) && (str[i] !== "}")) {
            const [ sub_bytes_read, component ] = decodeUiiFilter(ctx, str, i);
            bytes_read += sub_bytes_read;
            bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
            if (str[start_index + bytes_read] === ",") {
                bytes_read++;
                bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
            }
            i = start_index + bytes_read;
            components.push(component);
        }
        bytes_read++; // Skip over }
        return [ bytes_read, { and: components }];
    } else if (str.slice(start_index, start_index + 2).toLowerCase() === "or") {
        bytes_read += 2;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        if (str[start_index + bytes_read] !== ":") {
            throw new Error();
        }
        bytes_read++;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        if (str[start_index + bytes_read] !== "{") {
            throw new Error();
        }
        bytes_read++;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        let i = start_index + bytes_read;
        const components: UiiFilter[] = [];
        while ((i < str.length) && (str[i] !== "}")) {
            const [ sub_bytes_read, component ] = decodeUiiFilter(ctx, str, i);
            bytes_read += sub_bytes_read;
            bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
            if (str[start_index + bytes_read] === ",") {
                bytes_read++;
                bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
            }
            i = start_index + bytes_read;
            components.push(component);
        }
        bytes_read++; // Skip over }
        return [ bytes_read, { or: components }];
    } else if (str.slice(start_index, start_index + 3).toLowerCase() === "not") {
        bytes_read += 3;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        if (str[start_index + bytes_read] !== ":") {
            throw new Error();
        }
        bytes_read++;
        bytes_read += /^\s+/.exec(str.slice(start_index + bytes_read))?.[0].length ?? 0;
        const [ sub_bytes_read, component ] = decodeUiiFilter(ctx, str, start_index + bytes_read);
        bytes_read += sub_bytes_read;
        return [ bytes_read, { not: component }];
    } else {
        throw new Error("df565565-dba8-4fa6-9cc2-2f9d4bcd473a");
    }
}

export
function getUIIFormDecoder (ctx: Context): LDAPSyntaxDecoder {
    return (value: Uint8Array): ASN1Element => {
        const str = Buffer.from(value)
            .toString("latin1")
            .slice(1, -1)
            .trim();
        let baseObject: string | undefined;
        let subset: UiiFormat_subset | undefined;
        let i: number = 0;
        if (str.indexOf("baseObject") === 0) {
            i += "baseObject".length;
            // skip whitespace
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
            if (str[i] !== '"') {
                throw new Error("2b7d18a8-a093-4971-b65f-73247d5c8ee6");
            }
            i++;
            const indexOfNextQuote = str.indexOf('"', i);
            if (indexOfNextQuote < 0) {
                throw new Error("943e892d-cd42-477b-95dd-302a70f4e11b");
            }
            baseObject = str.slice(i, indexOfNextQuote);
            i = indexOfNextQuote + 1;
            // skip optional whitespace (technically should not be present)
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
            // skip over comma (technically must be present)
            if (str[i] === ',') {
                i++;
            }
            // skip whitespace
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
        }
        if (str.slice(i, i + 6).toLowerCase() === "subset") {
            i += "subset".length;
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
            if (str.slice(i).indexOf("baseObject") === 0) {
                i += "baseObject".length;
                subset = UiiFormat_subset_baseObject;
            }
            else if (str.slice(i).indexOf("oneLevel") === 0) {
                i += "oneLevel".length;
                subset = UiiFormat_subset_oneLevel;
            }
            else if (str.slice(i).indexOf("wholeSubtree") === 0) {
                i += "wholeSubtree".length;
                subset = UiiFormat_subset_wholeSubtree;
            }
            else {
                throw new Error("55d79cc7-b0c1-494d-b84e-81e13723e28f");
            }
            // skip optional whitespace (technically should not be present)
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
            // skip over comma (technically must be present)
            if (str[i] === ',') {
                i++;
            }
            // skip whitespace
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
        }
        if (str.slice(i, i + 4).toLowerCase() !== "next") {
            throw new Error("3c67bbb6-a390-4126-b54e-0aa4e1033509");
        }
        i += "next".length;
        // skip whitespace
        i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
        if (str.slice(i, i + 6).toLowerCase() === "length") {
            i += "length".length;
            // skip whitespace
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
            if (str[i] === ':') {
                i++;
            }
            // skip whitespace
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
            const digits = /^\d+/.exec(str.slice(i))?.[0];
            if (!digits) {
                throw new Error();
            }
            const length = Number.parseInt(digits, 10);
            i += digits.length;
            const u = new UiiFormat(
                baseObject,
                subset,
                {
                    length,
                },
            );
            return _encode_UiiFormat(u, BER);
        }
        // Otherwise, next must have taken the "filter" alternative.
        if (str.slice(i, i + 6).toLowerCase() !== "filter") {
            throw new Error("8ecb9919-b5ac-4ad6-a131-78043f05e18b");
        }
        i += "filter".length;
        // skip whitespace
        i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
        if (str[i] === ':') {
            i++;
        }
        // skip whitespace
        i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0;
        const [ filter_length, filter ] = decodeUiiFilter(ctx, str, i);
        i += filter_length;
        return _encode_UiiFormat(new UiiFormat(
            baseObject,
            subset,
            {
                filter,
            },
        ), BER);
    };
}

// EpcFormat ::= SEQUENCE {
//     fields          SEQUENCE SIZE (1..MAX) OF SEQUENCE {
//       bits            INTEGER,
//       charField       CHOICE {
//         characters  [0] INTEGER,
//         maxValue    [1] INTEGER },
//       result          ENUMERATED {
//         numericPad     (0),
//         numeric        (1),
//         alpha7bits     (2) } DEFAULT numericPad },
//     digitShift  [0] INTEGER                        OPTIONAL,
//     checkCalc   [1] INTEGER                        OPTIONAL,
//     urnPrefix       UTF8String                     OPTIONAL }
export
const epcForm: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value)
        .toString("utf-8")
        .slice(1, -1)
        .trim();
    if (str.slice(0, 6).toLowerCase() !== "fields") {
        throw new Error();
    }
    let i: number = 6;
    i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
    if (str[i] !== "{") {
        throw new Error();
    }
    i++;
    i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
    const fields: EpcFormat_fields_Item[] = [];
    while ((i < str.length) && (str[i] !== "}")) {
        const indexOfNextClosingCurly = str.indexOf("}", i);
        if (indexOfNextClosingCurly < i) {
            throw new Error();
        }
        const field_text = str
            .slice(i + 1, indexOfNextClosingCurly - 1)
            .trim()
            .slice(4) // skip "bits"
            .trimStart();
        const bits_digits = /^\d+/.exec(field_text.slice(0))?.[0];
        if (!bits_digits) {
            throw new Error();
        }
        const bits = Number.parseInt(bits_digits, 10);
        let j: number = bits_digits.length;
        j += /^\s+/.exec(field_text.slice(j))?.[0].length ?? 0; // skip whitespace
        if (field_text[j] !== ",") {
            throw new Error();
        }
        j++;
        j += /^\s+/.exec(field_text.slice(j))?.[0].length ?? 0; // skip whitespace
        if (field_text.slice(j, j + 9).toLowerCase() !== "charfield") {
            throw new Error();
        }
        j += 9;
        const cf_result = /^\s+([A-Za-z]+)\s*:\s*(\d+)\s*,?\s*/.exec(field_text.slice(j));
        if (!cf_result) {
            throw new Error();
        }
        const alt = cf_result[1].toLowerCase();
        const value = Number.parseInt(cf_result[2], 10);
        const charField: EpcFormat_fields_Item_charField = (alt === "characters")
            ? { characters: value }
            : ((alt === "maxvalue")
                ? { maxValue: value }
                : (() => {throw new Error()})());
        j += cf_result[0].length;
        let result: EpcFormat_fields_Item_result | undefined;
        if (field_text.slice(j, j + 6).toLowerCase() === "result") {
            j += 6;
            j += /^\s+/.exec(field_text.slice(j))?.[0].length ?? 0; // skip whitespace
            if (field_text.slice(j, j + 10).toLowerCase() === "numericpad") {
                j += 10;
                result = EpcFormat_fields_Item_result_numericPad;
            } else if (field_text.slice(j, j + 7).toLowerCase() === "numeric") {
                j += 7;
                j += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
                result = EpcFormat_fields_Item_result_numeric;
            } else if (field_text.slice(j, j + 10).toLowerCase() === "alpha7bits") {
                j += 10;
                j += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
                result = EpcFormat_fields_Item_result_alpha7bits;
            } else {
                throw new Error();
            }
        }
        i = indexOfNextClosingCurly + 1;
        i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
        if (str[i] === ",") {
            i++;
            i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
        }
        fields.push(new EpcFormat_fields_Item(
            bits,
            charField,
            result,
        ));
    }
    i++; // skips }
    i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
    if (str[i] === ",") {
        i++;
        i += /^\s+/.exec(str.slice(i))?.[0].length ?? 0; // skip whitespace
    }
    const other_fields_json = Object.fromEntries(
        str
            .slice(i)
            .split(",") // split into key-value pairs
            .map((f) => f
                .trim()
                .split(/\s+/) // split into [ key, value ]
                .map((korv) => korv.trim())), // trim the key and the value
    );
    const digitShift = other_fields_json["digitShift"]
        ? Number.parseInt(other_fields_json["digitShift"], 10)
        : undefined;
    const checkCalc = other_fields_json["checkCalc"]
        ? Number.parseInt(other_fields_json["checkCalc"], 10)
        : undefined;
    const urnPrefix = other_fields_json["urnPrefix"]?.replace(/"/g, "");
    const e = new EpcFormat(
        fields,
        digitShift,
        checkCalc,
        urnPrefix,
    );
    return _encode_EpcFormat(e, BER);
};

export
const countryString3c: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("latin1");
    if (str.length > 3 || !/[A-Z]/.test(str)) {
        throw new Error();
    }
    return _encodePrintableString(str, BER);
};

export
const countryString3n: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("latin1");
    if (str.length > 3 || !/\d+/.test(str)) {
        throw new Error();
    }
    return _encodeNumericString(str, BER);
};

export
const dnsString: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("utf-8");
    return _encodeUTF8String(str, BER);
};

export
const intEmailString: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("utf-8");
    const parsed = parseOneAddress({
        input: str,
        rfc6532: true, // Unicode
    });
    if (!parsed) {
        throw new Error();
    }
    return _encodeUTF8String(str, BER);
};

export
const jidString: LDAPSyntaxDecoder = (value: Uint8Array): ASN1Element => {
    const str = Buffer.from(value).toString("utf-8");
    const parsed = parseOneAddress({
        input: str,
        rfc6532: true, // Unicode
    });
    if (!parsed) {
        throw new Error();
    }
    return _encodeUTF8String(str, BER);
};
