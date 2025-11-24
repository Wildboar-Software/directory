import {
    id_oc_dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/id-oc-dynamicObject.va.js";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa.js";
import {
    subschema,
} from "@wildboar/x500/SchemaAdministration";
import {
    alias,
    parent,
    child,
    subentry,
    pwdAdminSubentry,
    accessControlSubentry,
    collectiveAttributeSubentry,
    contextAssertionSubentry,
    serviceAdminSubentry,
    top,
    id_ar_autonomousArea,
} from "@wildboar/x500/InformationFramework";
import {
    id_ar_accessControlSpecificArea,
    id_ar_accessControlInnerArea,
    id_ar_pwdAdminSpecificArea,
    id_ar_subschemaAdminSpecificArea,
    id_ar_serviceSpecificArea,
    administrativeRole,
    aliasedEntryName,
    objectClass,
} from "@wildboar/x500/InformationFramework";
import {
    accessControlScheme,
} from "@wildboar/x500/BasicAccessControl";

// These exist to save on the computing expense of recalculating their string
// values every time they are used.
export const ID_OC: string = objectClass["&id"].toString();
export const ID_AEN: string = aliasedEntryName["&id"].toString();
export const ID_SUBENTRY: string = subentry["&id"].toString();
export const ID_PARENT: string = parent["&id"].toString();
export const ID_CHILD: string = child["&id"].toString();
export const ID_ADMIN_ROLE: string = administrativeRole["&id"].toString();
export const ID_ALIAS: string = alias["&id"].toString();
export const ID_DYNOBJ: string = id_oc_dynamicObject.toString();
export const ID_TTL: string = entryTtl["&id"].toString();
export const ID_ACS: string = accessControlScheme["&id"].toString();
export const ID_SUBSCHEMA: string = subschema["&id"].toString();
export const ID_PWD_ADMIN_SUB: string = pwdAdminSubentry["&id"].toString();
export const ID_AC_SUB: string = accessControlSubentry["&id"].toString();
export const ID_COLL_ATTR_SUB: string = collectiveAttributeSubentry["&id"].toString();
export const ID_CONT_ASS_SUB: string = contextAssertionSubentry["&id"].toString();
export const ID_SVC_ADMIN_SUB: string = serviceAdminSubentry["&id"].toString();
export const ID_TOP: string = top["&id"].toString();
export const ID_AUTONOMOUS: string = id_ar_autonomousArea.toString();
export const ID_AC_SPECIFIC: string = id_ar_accessControlSpecificArea.toString();
export const ID_AC_INNER: string = id_ar_accessControlInnerArea.toString();
export const ID_AR_SUBSCHEMA: string = id_ar_subschemaAdminSpecificArea.toString();
export const ID_AR_PWD_ADMIN: string = id_ar_pwdAdminSpecificArea.toString();
export const ID_AR_SERVICE: string = id_ar_serviceSpecificArea.toString();
