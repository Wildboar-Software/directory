import { OBJECT_IDENTIFIER } from "asn1-ts";

export const EXT_BIT_SUBENTRIES: number = 1;
export const EXT_BIT_COPY_SHALL_DO: number = 2;
export const EXT_BIT_ATTRIBUTE_SIZE_LIMIT: number = 3;
export const EXT_BIT_EXTRA_ATTRIBUTES: number = 4;
export const EXT_BIT_MODIFY_RIGHTS_REQUEST: number = 5;
export const EXT_BIT_PAGED_RESULTS_REQUEST: number = 6;
export const EXT_BIT_MATCHED_VALUES_ONLY: number = 7;
export const EXT_BIT_EXTENDED_FILTER: number = 8;
export const EXT_BIT_TARGET_SYSTEM: number = 9;
export const EXT_BIT_USE_ALIAS_ON_UPDATE: number = 10;
export const EXT_BIT_NEW_SUPERIOR: number = 11;
export const EXT_BIT_MANAGE_DSA_IT: number = 12;
export const EXT_BIT_USE_OF_CONTEXTS: number = 13;
export const EXT_BIT_PARTIAL_NAME_RESOLUTION: number = 14;
export const EXT_BIT_OVERSPEC_FILTER: number = 15;
export const EXT_BIT_SELECTION_ON_MODIFY: number = 16;
export const EXT_BIT_SECURITY_OPERATION_CODE: number = 18;
export const EXT_BIT_SECURITY_ATTRIBUTE_CERTIFICATION_PATH: number = 19;
export const EXT_BIT_SECURITY_ERROR_PROTECTION: number = 20;
export const EXT_BIT_SERVICE_ADMINISTRATION: number = 25;
export const EXT_BIT_ENTRY_COUNT: number = 26;
export const EXT_BIT_HIERARCHY_SELECTIONS: number = 27;
export const EXT_BIT_RELAXATION: number = 28;
export const EXT_BIT_FAMILY_GROUPING: number = 29;
export const EXT_BIT_FAMILY_RETURN: number = 30;
export const EXT_BIT_DN_ATTRIBUTES: number = 31;
export const EXT_BIT_FRIEND_ATTRIBUTES: number = 32;
export const EXT_BIT_ABANDON_OF_PAGED_RESULTS: number = 33;
export const EXT_BIT_PAGED_RESULTS_ON_THE_DSP: number = 34;
export const EXT_BIT_REPLACE_VALUES: number = 35;

type Operations = {
    read: boolean;
    compare: boolean;
    list: boolean;
    search: boolean;
    addEntry: boolean;
    removeEntry: boolean;
    modifyEntry: boolean;
    modifyDN: boolean;
    abandon: boolean;
};

type ExtensionInfo = {
    identifier: number;
    operations?: Partial<Operations>; // Undefined means "all"
    critical: boolean;
    ldapControl?: OBJECT_IDENTIFIER;
};

const extensions: { [name: string]: ExtensionInfo } = {
    extraAttributes: {
        identifier: EXT_BIT_EXTRA_ATTRIBUTES,
        operations: {
            read: true,
            search: true,
        },
        critical: false,
    },
    // TODO:
};

export default extensions;
