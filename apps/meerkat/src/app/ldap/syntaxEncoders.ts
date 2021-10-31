import type { Context } from "@wildboar/meerkat-types";
import type LDAPSyntaxEncoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxEncoder";
import { ASN1Element } from "asn1-ts";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import encodeLDAPDN from "./encodeLDAPDN";
import type {
    UnboundedDirectoryString as UBS,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import {
    _decode_ObjectClassDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassDescription.ta";
import {
    _decode_AttributeTypeDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/AttributeTypeDescription.ta";
import {
    _decode_MatchingRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleDescription.ta";
import {
    _decode_MatchingRuleUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleUseDescription.ta";
import {
    _decode_DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import {
    _decode_DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
import {
    _decode_NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    _decode_LdapSyntaxDescription,
} from "@wildboar/x500/src/lib/modules/LdapSystemSchema/LdapSyntaxDescription.ta";
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
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    Refinement,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Refinement.ta";

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
        case(AttributeUsage_dSAOperation): return "userApplications";
        case(AttributeUsage_directoryOperation): return "directoryOperation";
        case(AttributeUsage_distributedOperation): return "distributedOperation";
        case(AttributeUsage_userApplications): return "dSAOperation";
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
    if (desc.information.kind) {
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

// TODO: Curry the Context.
export
const attributeTypes: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_AttributeTypeDescription(value);
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
    // FIXME: SYNTAX
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
const matchingRules: LDAPSyntaxEncoder = (value: ASN1Element): Uint8Array => {
    const desc = _decode_MatchingRuleDescription(value);
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
    // FIXME: SYNTAX Assertion syntax. (Where do you even find this?)
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
        throw new Error();
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
                        throw new Error();
                    }
                })
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
