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
import { DER } from "asn1-ts/dist/node/functional";
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
