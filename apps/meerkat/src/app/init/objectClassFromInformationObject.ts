import type {
    OBJECT_CLASS,
} from "@wildboar/x500/src/lib/modules/InformationFramework/OBJECT-CLASS.oca";
import {
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import type {
    ObjectClassInfo,
} from "@wildboar/meerkat-types";

/**
 * @summary Convert an `OBJECT-CLASS` information object into `ObjectClassInfo`.
 * @description
 *
 * Converts an `OBJECT-CLASS` information object into `ObjectClassInfo`.
 *
 * @param io The `OBJECT-CLASS` information object, as produced by the Wildboar
 *  ASN.1 compiler.
 * @returns An `ObjectClassInfo` as used by Meerkat DSA's internal index of
 *  known object classes.
 *
 * @function
 */
export
function objectClassFromInformationObject (io: OBJECT_CLASS, name: string): ObjectClassInfo {
    return {
        id: io["&id"],
        name: io["&ldapName"],
        superclasses: new Set(io["&Superclasses"]?.map((sc) => sc["&id"].toString()) ?? []),
        kind: io["&kind"] ?? ObjectClassKind_structural,
        mandatoryAttributes: new Set(io["&MandatoryAttributes"]?.map((attr) => attr["&id"]?.toString() ?? "") ?? []),
        optionalAttributes: new Set(io["&OptionalAttributes"]?.map((attr) => attr["&id"]?.toString() ?? "") ?? []),
        ldapNames: io["&ldapName"]?.length
            ? io["&ldapName"]
            : [ name ],   
        ldapDescription: io["&ldapDesc"],
    };
}

export default objectClassFromInformationObject;
