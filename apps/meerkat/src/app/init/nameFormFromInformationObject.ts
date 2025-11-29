import type {
    NAME_FORM,
} from "@wildboar/x500/InformationFramework";
import type { NameFormInfo } from "../types/index.js";

/**
 * @summary Convert a `NAME-FORM` information object into `NameFormInfo`.
 * @description
 *
 * Converts a `NAME_FORM` information object into `NameFormInfo`.
 *
 * @param io The `NAME_FORM` information object, as produced by the Wildboar
 *  ASN.1 compiler.
 * @returns An `NameFormInfo` as used by Meerkat DSA's internal index of
 *  known name forms.
 *
 * @function
 */
export
function nameFormFromInformationObject (io: NAME_FORM, name?: string[]): NameFormInfo {
    return {
        id: io["&id"],
        namedObjectClass: io["&namedObjectClass"]["&id"],
        mandatoryAttributes: io["&MandatoryAttributes"].map((attr) => attr["&id"]),
        optionalAttributes: io["&OptionalAttributes"]?.map((attr) => attr["&id"]) ?? [],
        name: (io["&ldapName"]?.length || !name)
            ? io["&ldapName"]
            : name,
        description: io["&ldapDesc"],
        obsolete: false,
    };
}

export default nameFormFromInformationObject;
