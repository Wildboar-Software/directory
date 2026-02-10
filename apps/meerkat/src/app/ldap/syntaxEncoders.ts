import { Buffer } from "node:buffer";
import type { Context } from "../types/index.js";
import { type LDAPSyntaxEncoder } from "@wildboar/ldap";
import { ASN1Element } from "@wildboar/asn1";
import { directoryStringToString } from "@wildboar/x500";
import encodeLDAPDN from "./encodeLDAPDN.js";
import type {
    UnboundedDirectoryString as UBS,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_ObjectClassDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_AttributeTypeDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_MatchingRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_MatchingRuleUseDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_DITContentRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_DITStructureRuleDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_NameFormDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    _decode_LdapSyntaxDescription,
} from "@wildboar/x500/LdapSystemSchema";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/InformationFramework";
import {
    AttributeUsage,
    AttributeUsage_dSAOperation,
    AttributeUsage_directoryOperation,
    AttributeUsage_distributedOperation,
    AttributeUsage_userApplications,
} from "@wildboar/x500/InformationFramework";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/InformationFramework";
import {
    Refinement,
} from "@wildboar/x500/InformationFramework";
import { phone } from "phone";
import {
    _decode_BootParameterSyntax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/BootParameterSyntax.ta.js";
import {
    _decode_NISNetgroupTripleSyntax,
} from "@wildboar/parity-schema/src/lib/modules/NIS/NISNetgroupTripleSyntax.ta.js";
import {
    _decode_ComponentFilter,
} from "@wildboar/parity-schema/src/lib/modules/RFC3687ComponentMatching/ComponentFilter.ta.js";
import {
    _decode_RelativeDistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { _decode_UiiFormat } from "@wildboar/x500/SelectedAttributeTypes";
import { UiiFilter } from "@wildboar/x500/SelectedAttributeTypes";
import { _decode_EpcFormat } from "@wildboar/x500/SelectedAttributeTypes";

function escapeUBS (str: UBS): string {
    return directoryStringToString(str)
        .replace(/'/g, "\\27")
        .replace(/\\/g, "\\5C")
        ;
}

function ock2str (ock: ObjectClassKind): string {
    switch (ock) {
        case (ObjectClassKind_abstract): return "ABSTRACT";
        case (ObjectClassKind_auxiliary): return "AUXILIARY";
        case (ObjectClassKind_structural): return "STRUCTURAL";
        default: return "STRUCTURAL";
    }
}

function au2str (au: AttributeUsage): string {
    switch (au) {
        case (AttributeUsage_userApplications): return "userApplications";
        case (AttributeUsage_directoryOperation): return "directoryOperation";
        case (AttributeUsage_distributedOperation): return "distributedOperation";
        case (AttributeUsage_dSAOperation): return "dSAOperation";
        default: return "userApplications";
    }
}


export
const objectClasses: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_ObjectClassDescription(value);
    const fields: string[] = [
        desc.identifier.toString(),
    ];
    if (desc.name?.length) {
        if (desc.name.length === 1) {
            fields.push(`NAME ${escapeUBS(desc.name[0])}`);
        } else {
            fields.push(`NAME ( '${desc.name.map(escapeUBS).join("' '")}' )`);
        }
    }
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    if (desc.obsolete) {
        fields.push("OBSOLETE");
    }
    if (desc.information.subclassOf?.length) {
        if (desc.information.subclassOf.length === 1) {
            fields.push(`SUP ${desc.information.subclassOf[0].toString()}`);
        } else {
            fields.push(`SUP ( ${desc.information.subclassOf.map((oid) => oid.toString()).join(" $ ")} )`);
        }
    }
    if (desc.information.kind !== undefined) {
        fields.push(ock2str(desc.information.kind));
    }
    if (desc.information.mandatories?.length) {
        if (desc.information.mandatories.length === 1) {
            fields.push(`MUST ${desc.information.mandatories[0].toString()}`);
        } else {
            fields.push(`MUST ( ${desc.information.mandatories.map((oid) => oid.toString()).join(" $ ")} )`);
        }
    }
    if (desc.information.optionals?.length) {
        if (desc.information.optionals.length === 1) {
            fields.push(`MAY ${desc.information.optionals[0].toString()}`);
        } else {
            fields.push(`MAY ( ${desc.information.optionals.map((oid) => oid.toString()).join(" $ ")} )`);
        }
    }
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

/**
 * @description
 *
 * WARNING: This will silently not report the SYNTAX if no LDAP syntax is
 * defined for a type that is passed in. This might be fine if a parent type
 * defines an LDAP syntax, but it might _not_ be fine if NO parent in the
 * ancestry does not define an LDAP syntax.
 *
 * @param ctx
 * @returns
 */
export
const attributeTypes: (ctx: Context) => LDAPSyntaxEncoder = (ctx: Context) => (value: ASN1Element): Uint8Array => {
    const desc = _decode_AttributeTypeDescription(value);
    const spec = ctx.attributeTypes.get(desc.identifier.toString());
    const ldapSyntax = ctx.ldapSyntaxes.get(spec?.ldapSyntax?.toString() ?? "");
    const fields: string[] = [
        desc.identifier.toString(),
    ];
    if (desc.name?.length) {
        if (desc.name.length === 1) {
            fields.push(`NAME ${escapeUBS(desc.name[0])}`);
        } else {
            fields.push(`NAME ( '${desc.name.map(escapeUBS).join("' '")}' )`);
        }
    }
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    if (desc.obsolete) {
        fields.push("OBSOLETE");
    }
    if (desc.information.derivation) {
        fields.push(`SUP ${desc.information.derivation.toString()}`);
    }
    if (desc.information.equalityMatch) {
        fields.push(`EQUALITY ${desc.information.equalityMatch.toString()}`);
    }
    if (desc.information.orderingMatch) {
        fields.push(`ORDERING ${desc.information.orderingMatch.toString()}`);
    }
    if (desc.information.substringsMatch) {
        fields.push(`SUBSTR ${desc.information.substringsMatch.toString()}`);
    }
    if (ldapSyntax) {
        fields.push(`SYNTAX ${ldapSyntax.id.toString()}`);
    }
    if (desc.information.multi_valued === false) {
        fields.push("SINGLE-VALUE");
    }
    if (desc.information.collective) {
        fields.push("COLLECTIVE");
    }
    if (desc.information.userModifiable === false) {
        fields.push("NO-USER-MODIFICATION");
    }
    if (desc.information.application !== undefined) {
        fields.push(`USAGE ${au2str(desc.information.application)}`);
    }
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

export
const getMatchingRulesEncoder: (ctx: Context) => LDAPSyntaxEncoder = (ctx: Context) => (value: ASN1Element): Uint8Array => {
    const desc = _decode_MatchingRuleDescription(value);
    const OID: string = desc.identifier.toString();
    const spec = ctx.equalityMatchingRules.get(OID)
        ?? ctx.orderingMatchingRules.get(OID)
        ?? ctx.substringsMatchingRules.get(OID);
    if (!spec?.ldapAssertionSyntax) {
        throw new Error(`Could not convert matchingRules value ${OID} to LDAP equivalent.`);
    }
    const fields: string[] = [
        desc.identifier.toString(),
    ];
    if (desc.name?.length) {
        if (desc.name.length === 1) {
            fields.push(`NAME ${escapeUBS(desc.name[0])}`);
        } else {
            fields.push(`NAME ( '${desc.name.map(escapeUBS).join("' '")}' )`);
        }
    }
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    if (desc.obsolete) {
        fields.push("OBSOLETE");
    }
    fields.push(`SYNTAX ${spec.ldapAssertionSyntax.toString()}`);
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

export
const matchingRuleUse: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_MatchingRuleUseDescription(value);
    const fields: string[] = [
        desc.identifier.toString(),
    ];
    if (desc.name?.length) {
        if (desc.name.length === 1) {
            fields.push(`NAME ${escapeUBS(desc.name[0])}`);
        } else {
            fields.push(`NAME ( '${desc.name.map(escapeUBS).join("' '")}' )`);
        }
    }
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    if (desc.obsolete) {
        fields.push("OBSOLETE");
    }
    if (desc.information.length === 1) {
        fields.push(`APPLIES ${desc.information[0].toString()}`);
    } else {
        fields.push(`APPLIES ( ${desc.information.map((oid) => oid.toString()).join(" $ ")} )`);
    }
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

export
const ldapSyntaxes: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_LdapSyntaxDescription(value);
    const fields: string[] = [
        desc.identifier.toString(),
    ];
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

export
const dITContentRules: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_DITContentRuleDescription(value);
    const fields: string[] = [
        desc.structuralObjectClass.toString(),
    ];
    if (desc.name?.length) {
        if (desc.name.length === 1) {
            fields.push(`NAME ${escapeUBS(desc.name[0])}`);
        } else {
            fields.push(`NAME ( '${desc.name.map(escapeUBS).join("' '")}' )`);
        }
    }
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    if (desc.obsolete) {
        fields.push("OBSOLETE");
    }
    if (desc.auxiliaries?.length) {
        if (desc.auxiliaries.length === 1) {
            fields.push(`AUX ${desc.auxiliaries[0].toString()}`);
        } else {
            fields.push(`AUX ( ${desc.auxiliaries.map((aux) => aux.toString()).join(" $ ")} )`);
        }
    }
    if (desc.mandatory?.length) {
        if (desc.mandatory.length === 1) {
            fields.push(`MUST ${desc.mandatory[0].toString()}`);
        } else {
            fields.push(`MUST ( ${desc.mandatory.map((oid) => oid.toString()).join(" $ ")} )`);
        }
    }
    if (desc.optional?.length) {
        if (desc.optional.length === 1) {
            fields.push(`MAY ${desc.optional[0].toString()}`);
        } else {
            fields.push(`MAY ( ${desc.optional.map((oid) => oid.toString()).join(" $ ")} )`);
        }
    }
    if (desc.precluded?.length) {
        if (desc.precluded.length === 1) {
            fields.push(`NOT ${desc.precluded[0].toString()}`);
        } else {
            fields.push(`NOT ( ${desc.precluded.map((oid) => oid.toString()).join(" $ ")} )`);
        }
    }
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

export
const dITStructureRules: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_DITStructureRuleDescription(value);
    const fields: string[] = [
        desc.ruleIdentifier.toString(),
    ];
    if (desc.name?.length) {
        if (desc.name.length === 1) {
            fields.push(`NAME ${escapeUBS(desc.name[0])}`);
        } else {
            fields.push(`NAME ( '${desc.name.map(escapeUBS).join("' '")}' )`);
        }
    }
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    if (desc.obsolete) {
        fields.push("OBSOLETE");
    }
    fields.push(`FORM ${desc.nameForm.toString()}`);
    if (desc.superiorStructureRules?.length) {
        if (desc.superiorStructureRules.length === 1) {
            fields.push(`SUP ${desc.superiorStructureRules[0].toString()}`);
        } else {
            fields.push(`SUP ( ${desc.superiorStructureRules.map((ssr) => ssr.toString()).join(" ")} )`);
        }
    }
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

export
const nameForms: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_NameFormDescription(value);
    const fields: string[] = [
        desc.identifier.toString(),
    ];
    if (desc.name?.length) {
        if (desc.name.length === 1) {
            fields.push(`NAME ${escapeUBS(desc.name[0])}`);
        } else {
            fields.push(`NAME ( '${desc.name.map(escapeUBS).join("' '")}' )`);
        }
    }
    if (desc.description) {
        fields.push(`DESC '${escapeUBS(desc.description)}'`);
    }
    if (desc.obsolete) {
        fields.push("OBSOLETE");
    }
    fields.push(`OC ${desc.information.subordinate.toString()}`);
    if (desc.information.namingMandatories.length === 1) {
        fields.push(`MUST ${desc.information.namingMandatories[0].toString()}`);
    } else {
        fields.push(`MUST ( ${desc.information.namingMandatories.map((oid) => oid.toString()).join(" ")} )`);
    }
    if (desc.information.namingOptionals?.length) {
        if (desc.information.namingOptionals.length === 1) {
            fields.push(`MAY ${desc.information.namingOptionals[0].toString()}`);
        } else {
            fields.push(`MAY ( ${desc.information.namingOptionals.map((oid) => oid.toString()).join(" ")} )`);
        }
    }
    return Buffer.from(`( ${fields.join(" ")} )`, "utf-8");
};

function refinementToString (ref: Refinement): string {
    if ("item" in ref) {
        return `item:${ref.item.toString()}`;
    } else if ("and" in ref) {
        return `and:{ ${ref.and.map(refinementToString).join(", ")} }`;
    } else if ("or" in ref) {
        return `or:{ ${ref.or.map(refinementToString).join(", ")} }`;
    } else if ("not" in ref) {
        return `not:${refinementToString(ref)}`;
    } else {
        return `and:{}`; // Not understood alternative shall just be treated as a NOOP.
    }
}

export
function getSubtreeSpecificationEncoder (
    ctx: Context,
): LDAPSyntaxEncoder {
    return (value: ASN1Element): Uint8Array => {
        const ss = _decode_SubtreeSpecification(value);
        const fields: string[] = [];
        if (ss.base) {
            const escapedLocalName: string = Buffer.from(encodeLDAPDN(ctx, ss.base))
                .toString("utf-8")
                .replace(/"/g, "\"\"");
            fields.push(`base "${escapedLocalName}"`);
        }
        if (ss.specificExclusions) {
            const seStr = ss.specificExclusions
                .map((se) => {
                    if ("chopBefore" in se) {
                        const escapedLocalName: string = Buffer
                            .from(encodeLDAPDN(ctx, se.chopBefore))
                            .toString("utf-8")
                            .replace(/"/g, "\"\"");
                        return `chopBefore:"${escapedLocalName}"`;
                    } else if ("chopAfter" in se) {
                        const escapedLocalName: string = Buffer
                            .from(encodeLDAPDN(ctx, se.chopAfter))
                            .toString("utf-8")
                            .replace(/"/g, "\"\"");
                        return `chopAfter:"${escapedLocalName}"`;
                    } else {
                        return null;
                    }
                })
                .filter((s): s is string => !!s)
                .join(", ");
            fields.push(`specificExclusions { ${seStr} }`);
        }
        if (ss.minimum) {
            fields.push(`minimum ${ss.minimum}`);
        }
        if (ss.maximum) {
            fields.push(`maximum ${ss.maximum}`);
        }
        if (ss.specificationFilter) {
            fields.push(`specificationFilter ${refinementToString(ss.specificationFilter)}`);
        }
        return Buffer.from(`{ ${fields.join(", ")} }`, "utf-8");
    };
}

export
const telephoneNumber: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const str = value.printableString;
    try {
        const pn: string | null = phone(str).phoneNumber;
        if (!pn) {
            return Buffer.from(str, "utf-8");
        }
        return Buffer.from(pn, "utf-8");
    } catch {
        return Buffer.from(str, "utf-8");
    }
};

// export
// const authPasswordSyntax: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {

// };

export
const bootParameterSyntax: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const bps = _decode_BootParameterSyntax(value);
    return Buffer.from(`${bps.key.replace(/=/g, "")}=${bps.server.replace(/:/g, "")}:${bps.path}`);
};

export
const nisNetgroupTripleSyntax: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const nts = _decode_NISNetgroupTripleSyntax(value);
    const str = [
        nts.hostname?.replace(/,/g, "") ?? "-",
        nts.username?.replace(/,/g, "") ?? "-",
        nts.domainname?.replace(/,/g, "") ?? "-",
    ].join(",");
    return Buffer.from(`(${str})`);
};

// export
// const componentFilter: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
//     const filter = _decode_ComponentFilter(value);
// };

export
const null_: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    return Buffer.from("NULL");
};

// export
// const open: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {

// };

export
function getRDNEncoder (ctx: Context): LDAPSyntaxEncoder {
    return (value: ASN1Element): Uint8Array => {
        const r = _decode_RelativeDistinguishedName(value);
        return encodeLDAPDN(ctx, [ r ]);
    };
}

//   UtmCoordinates ::= SEQUENCE {
//     zone      PrintableString,
//     easting   NumericString,
//     northing  NumericString }
export
const utmCoordinates: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const components = value.sequence;
    if (components.length !== 3) {
        throw new Error("833b2654-2626-4599-b7c9-f8f073c86de3");
    }
    const zone = components[0].printableString
        .slice(0, 3).replace(/"/g, ""); // Just for good measure.
    const easting = components[1].numericString;
    const northing = components[2].numericString;
    const str = `{ zone "${zone}", easting "${easting}", northing "${northing}" }`;
    return Buffer.from(str);
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

export
function uiiFilterToString (u: UiiFilter): string {
    if ("item" in u) {
        return u.item.length // I am pretty sure length can't be zero anyway.
            ? `item:{ type ${u.item.type_.toString()}, length ${u.item.length} }`
            : `item:{ type ${u.item.type_.toString()} }`;
    } else if ("and" in u) {
        const subs = u.and.map(uiiFilterToString);
        return `and:{ ${subs.join(", ")} }`;
    } else if ("or" in u) {
        const subs = u.or.map(uiiFilterToString);
        return `or:{ ${subs.join(", ")} }`;
    } else {
        return `not:${uiiFilterToString(u.not)}`;
    }
}

export
const uiiForm: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const substrings: string[] = [];
    const u = _decode_UiiFormat(value);
    if (u.baseObject) {
        const baseObject = u.baseObject.replace(/"/g, "%22");
        substrings.push(`uri "${baseObject}"`);
    }
    if (u.subset) {
        const subset: string | undefined = ([
            "baseObject",
            "oneLevel",
            "wholeSubtree",
        ])[u.subset];
        if (subset) {
            substrings.push(`subset ${subset}`);
        }
    }
    if ("length" in u.next) {
        u.next.length
        substrings.push(`next length:${u.next.length}`);
    } else {
        const filter = uiiFilterToString(u.next.filter);
        substrings.push(`next filter:${filter}`);
    }
    return Buffer.from(`{ ${substrings.join(", ")} }`);
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
const epcForm: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const substrings: string[] = [];
    const e = _decode_EpcFormat(value);
    const fieldSubstrings = e.fields.map((f) => {
        const result: string | undefined = ([
            "numericPad",
            "numeric",
            "alpha7bits",
        ])[f.result ?? 99];
        const choice = ("characters" in f.charField)
            ? `characters:${f.charField.characters}`
            : `maxValue:${f.charField.maxValue}`;
        return result
            ? `{ bits ${f.bits}, charField ${choice}, result ${result} }`
            : `{ bits ${f.bits}, charField ${choice} }`;
    });
    substrings.push(`fields { ${fieldSubstrings.join(", ")} }`);
    if (e.digitShift) {
        substrings.push(`digitShift ${e.digitShift}`);
    }
    if (e.checkCalc) {
        substrings.push(`checkCalc ${e.checkCalc}`);
    }
    if (e.urnPrefix) {
        substrings.push(`urnPrefix ${e.urnPrefix.replace(/"/g, "%22")}`);
    }
    return Buffer.from(`{ ${substrings.join(", ")} }`);
}

export
const countryString3c: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    return Buffer.from(value.printableString);
}

export
const countryString3n: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    return Buffer.from(value.numericString);
}

export
const dnsString: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    return Buffer.from(value.utf8String);
}

export
const intEmailString: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    return Buffer.from(value.utf8String);
}

export
const jidString: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    return Buffer.from(value.utf8String);
}
