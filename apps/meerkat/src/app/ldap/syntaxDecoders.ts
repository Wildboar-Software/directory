import type { Context } from "@wildboar/meerkat-types";
import type LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import { ASN1Element, ObjectIdentifier, OBJECT_IDENTIFIER } from "asn1-ts";
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
    SubtreeSpecification,
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    getSubtreeSpecLexer,
} from "./lexSubtreeSpec";

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
                            name.push(tokens[t].replace(/'/g, ""));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(tokens[t].replace(/'/g, ""));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
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
                        const spec = ctx.nameForms.get(tokens[t]);
                        if (!spec) {
                            throw new Error();
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
            throw new Error();
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
                            name.push(tokens[t].replace(/'/g, ""));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(tokens[t].replace(/'/g, ""));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
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
                                const spec = ctx.attributes.get(tokens[t]);
                                if (!spec) {
                                    throw new Error();
                                }
                                mandatories.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            mandatories.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.attributes.get(tokens[t]);
                            if (!spec) {
                                throw new Error();
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
                                    throw new Error();
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
                                throw new Error();
                            }
                            optionals.push(spec.id);
                        }
                    }
                    break;
                }
            }
        }
        if (!subordinate) {
            throw new Error();
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
                            name.push(tokens[t].replace(/'/g, ""));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(tokens[t].replace(/'/g, ""));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
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
                                    throw new Error();
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
                                throw new Error();
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
                                const spec = ctx.attributes.get(tokens[t]);
                                if (!spec) {
                                    throw new Error();
                                }
                                mandatory.push(spec.id);
                            }
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        if (isDigit(tokens[t].charCodeAt(0))) {
                            mandatory.push(ObjectIdentifier.fromString(tokens[t]));
                        } else {
                            const spec = ctx.attributes.get(tokens[t]);
                            if (!spec) {
                                throw new Error();
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
                                    throw new Error();
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
                                throw new Error();
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
                                    throw new Error();
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
                                throw new Error();
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
                        name.push(tokens[t].replace(/'/g, ""));
                        t++;
                    }
                } else if (tokens[t]) { // Checking that it's not undefined.
                    name.push(tokens[t].replace(/'/g, ""));
                }
                break;
            }
            case ("DESC"): {
                t++;
                if (tokens[t]) {
                    description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
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
                                throw new Error();
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
                            throw new Error();
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
                            const spec = ctx.attributes.get(tokens[t]);
                            if (!spec) {
                                throw new Error();
                            }
                            mandatories.push(spec.id);
                        }
                        t++;
                    }
                } else if (tokens[t]) { // Checking that it's not undefined.
                    if (isDigit(tokens[t].charCodeAt(0))) {
                        mandatories.push(ObjectIdentifier.fromString(tokens[t]));
                    } else {
                        const spec = ctx.attributes.get(tokens[t]);
                        if (!spec) {
                            throw new Error();
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
                                throw new Error();
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
                            throw new Error();
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
                            name.push(tokens[t].replace(/'/g, ""));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(tokens[t].replace(/'/g, ""));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
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
                            throw new Error();
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
                            throw new Error();
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
                            throw new Error();
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
                            throw new Error();
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
                undefined, // TODO:
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
        for (let t: number = 1; t < tokens.length; t++) { // We skip the first because it is the identifier.
            switch (tokens[t]) {
                case ("NAME"): {
                    t++;
                    if (tokens[t] === "(") {
                        t++;
                        while ((t < tokens.length) && (tokens[t] !== ")")) {
                            name.push(tokens[t].replace(/'/g, ""));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(tokens[t].replace(/'/g, ""));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
                    }
                    break;
                }
                case ("OBSOLETE"): {
                    obsolete = true;
                    break;
                }
            }
        }
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
            undefined, // TODO: Derive from LDAP syntax.
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
                            name.push(tokens[t].replace(/'/g, ""));
                            t++;
                        }
                    } else if (tokens[t]) { // Checking that it's not undefined.
                        name.push(tokens[t].replace(/'/g, ""));
                    }
                    break;
                }
                case ("DESC"): {
                    t++;
                    if (tokens[t]) {
                        description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
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
                                    throw new Error();
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
                                throw new Error();
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
                    description = tokens[t].replace(/'/g, ""); // FIXME: Proper escaping.
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
