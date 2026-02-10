import {
    AsyncROSEClient,
    ROSETransport,
    BindParameters,
    RequestParameters,
    BindOutcome,
    OperationOutcome,
    UnbindOutcome,
    UnbindParameters,
} from "@wildboar/rose-transport";
import {
    read,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    compare,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    list,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    search,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    addEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    removeEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    modifyEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    modifyDN,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    changePassword,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    administerPassword,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ldapTransport,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    LinkedArgument,
    linkedLDAP,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ReadArgumentData, _encode_ReadArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    CompareArgumentData, _encode_CompareArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AbandonArgumentData, _encode_AbandonArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ListArgumentData, _encode_ListArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgumentData, _encode_SearchArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AddEntryArgumentData, _encode_AddEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    RemoveEntryArgumentData, _encode_RemoveEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgumentData, _encode_ModifyEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyDNArgumentData, _encode_ModifyDNArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ChangePasswordArgumentData, _encode_ChangePasswordArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AdministerPasswordArgumentData, _encode_AdministerPasswordArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ReadArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    CompareArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AbandonArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ListArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AddEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    RemoveEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyDNArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ChangePasswordArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AdministerPasswordArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FALSE_BIT,
    TRUE_BIT,
    BOOLEAN,
} from "@wildboar/asn1";
import { AttributeValueAssertion } from "@wildboar/x500/InformationFramework";
import { PagedResultsRequest } from "@wildboar/x500/DirectoryAbstractService";
import { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { JoinArgument } from "@wildboar/x500/DirectoryAbstractService";
import { Attribute } from "@wildboar/pki-stub";
import { AccessPoint } from "@wildboar/x500/DistributedOperations";
import { EntryModification } from "@wildboar/x500/DirectoryAbstractService";
import { RelativeDistinguishedName } from "@wildboar/pki-stub";
import { BER, DER } from "@wildboar/asn1/functional";
import {
    generateSIGNED,
    CommonArguments,
    DirectoryName,
    TargetsObject,
    ref_type_from,
    SelectionOptions,
    critex_from,
    name_option_to_name,
    security_params_from,
    selection_option_to_selection,
    service_option_to,
    DirectoryVersioned,
    generateUnusedInvokeId,
    DirectoryOperationOptions,
} from "./utils.js";
import { UserPwd } from "@wildboar/x500/PasswordPolicy";
import { strict as assert } from "node:assert";
import { compareCode } from "@wildboar/x500";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchControlOptions_searchAliases,
    SearchControlOptions_matchedValuesOnly,
    SearchControlOptions_checkOverspecified,
    SearchControlOptions_performExactly,
    SearchControlOptions_includeAllAreas,
    SearchControlOptions_noSystemRelaxation,
    SearchControlOptions_dnAttribute,
    SearchControlOptions_matchOnResidualName,
    SearchControlOptions_entryCount,
    SearchControlOptions_useSubset,
    SearchControlOptions_separateFamilyMembers,
    SearchControlOptions_searchFamily,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    HierarchySelections_self,
    HierarchySelections_children,
    HierarchySelections_parent,
    HierarchySelections_hierarchy,
    HierarchySelections_top,
    HierarchySelections_subtree,
    HierarchySelections_siblings,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_all,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgumentData_joinType_innerJoin,
    SearchArgumentData_joinType_leftOuterJoin,
    SearchArgumentData_joinType_fullOuterJoin,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ChainingArguments,
} from "@wildboar/x500/DistributedOperations";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import { chainedRead } from "@wildboar/x500/DistributedOperations";
import { chainedCompare } from "@wildboar/x500/DistributedOperations";
import { chainedAbandon } from "@wildboar/x500/DistributedOperations";
import { chainedList } from "@wildboar/x500/DistributedOperations";
import { chainedSearch } from "@wildboar/x500/DistributedOperations";
import { chainedAddEntry } from "@wildboar/x500/DistributedOperations";
import { chainedRemoveEntry } from "@wildboar/x500/DistributedOperations";
import { chainedModifyEntry } from "@wildboar/x500/DistributedOperations";
import { chainedModifyDN } from "@wildboar/x500/DistributedOperations";
import { chainedAdministerPassword } from "@wildboar/x500/DistributedOperations";
import { chainedChangePassword } from "@wildboar/x500/DistributedOperations";
import { chainedLdapTransport } from "@wildboar/x500/DistributedOperations";
import { chainedLinkedLDAP } from "@wildboar/x500/DistributedOperations";
import { LDAPMessage } from "@wildboar/ldap";
import { LinkId } from "@wildboar/x500/DirectoryAbstractService";
import { LdapArgumentData, _encode_LdapArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import { LdapArgument } from "@wildboar/x500/DirectoryAbstractService";
import { LinkedArgumentData, _encode_LinkedArgumentData } from "@wildboar/x500/DirectoryAbstractService";
import {
    dSABind, DSABindArgument, DSABindResult,
} from "@wildboar/x500/DistributedOperations";
import {
    SearchControls,
    HierarchySelectionOptions,
    RelaxationOptions,
    JoinArgumentOptions,
} from "./dap.js";
import {
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/DirectoryAbstractService";

type ChainedArg = typeof chainedRead["&ArgumentType"];
type BindArgument = DSABindArgument;
type BindResult = DSABindResult;
export type DSPBindParameters = BindParameters<BindArgument>;
export type DSPBindOutcome = BindOutcome<BindResult>;

export
interface ChainingOptions extends ChainingArguments {

}

export
interface WithChainingOptions {
    chaining: ChainingOptions;
}

export
interface DSPReadOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    selection?: SelectionOptions;
    modifyRightsRequest?: boolean;
}

export
interface DSPCompareOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    purported: AttributeValueAssertion;
}

export
interface DSPAbandonOptions
extends DSPOperationOptions {
    invoke_id: number;
}

export
interface DSPListOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    pagination?: PagedResultsRequest;
    listFamily?: boolean;
}

export
interface DSPSearchOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    subset?: "base" | "level" | "subtree" | 0 | 1 | 2,
    filter?: Filter;
    searchAliases?: boolean;
    selection?: SelectionOptions;
    pagination?: PagedResultsRequest;
    matchedValuesOnly?: boolean;
    extendedFilter?: Filter;
    checkOverspecified?: boolean;
    relaxation?: RelaxationOptions;
    extendedArea?: number;
    hierarchySelection?: HierarchySelectionOptions;
    searchControls?: SearchControls;
    joinArguments?: JoinArgumentOptions[];
    joinType?: "inner" | "left" | "full" | 0 | 1 | 2;
}

export
interface DSPAddEntryOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    entry: Attribute[];
    targetSystem?: AccessPoint;
}

export
interface DSPRemoveEntryOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {

}

export
interface DSPModifyEntryOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    changes: EntryModification[];
    selection?: SelectionOptions;
}

export
interface DSPModifyDNOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    newRDN?: string | RelativeDistinguishedName;
    deleteOldRDN?: boolean;
    newSuperior?: DirectoryName;
}

export
interface DSPChangePasswordOptions
extends DSPOperationOptions, TargetsObject, WithChainingOptions {
    oldPassword: string | UserPwd;
    newPassword: string | UserPwd;
}

export
interface DSPAdministerPasswordOptions
extends DSPOperationOptions, TargetsObject, WithChainingOptions {
    newPassword: string | UserPwd;
}

export
interface LDAPTransportOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    ldapMessage: LDAPMessage;
    linkId?: LinkId;
}

export
interface LinkedLDAPOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    ldapMessage: LDAPMessage;
    linkId: LinkId;
    returnToClient?: BOOLEAN;
}

export
interface DSPOperationOptions extends DirectoryOperationOptions {
    /**
     * Whether to sign the inner DAP argument. This should almost never be used,
     * but it's here if you want it.
     */
    sign_inner_dap?: boolean;
}

export
interface DSPOptions extends DSPOperationOptions {

}

export
interface DSPClient extends AsyncROSEClient<BindArgument, BindResult>, DSPOptions, DirectoryVersioned {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DSPBindParameters) => Promise<DSPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: (params?: UnbindParameters) => Promise<UnbindOutcome>;

    read: (arg: DSPReadOptions) => Promise<OperationOutcome<typeof chainedRead["&ResultType"]>>;
    compare: (arg: DSPCompareOptions) => Promise<OperationOutcome<typeof chainedCompare["&ResultType"]>>;
    abandon: (arg: DSPAbandonOptions) => Promise<OperationOutcome<typeof chainedAbandon["&ResultType"]>>;
    list: (arg: DSPListOptions) => Promise<OperationOutcome<typeof chainedList["&ResultType"]>>;
    search: (arg: DSPSearchOptions) => Promise<OperationOutcome<typeof chainedSearch["&ResultType"]>>;
    addEntry: (arg: DSPAddEntryOptions) => Promise<OperationOutcome<typeof chainedAddEntry["&ResultType"]>>;
    removeEntry: (arg: DSPRemoveEntryOptions) => Promise<OperationOutcome<typeof chainedRemoveEntry["&ResultType"]>>;
    modifyEntry: (arg: DSPModifyEntryOptions) => Promise<OperationOutcome<typeof chainedModifyEntry["&ResultType"]>>;
    modifyDN: (arg: DSPModifyDNOptions) => Promise<OperationOutcome<typeof chainedModifyDN["&ResultType"]>>;
    changePassword: (arg: DSPChangePasswordOptions) => Promise<OperationOutcome<typeof chainedChangePassword["&ResultType"]>>;
    administerPassword: (arg: DSPAdministerPasswordOptions) => Promise<OperationOutcome<typeof chainedAdministerPassword["&ResultType"]>>;
    ldapTransport: (arg: LDAPTransportOptions) => Promise<OperationOutcome<typeof chainedLdapTransport["&ResultType"]>>;
    linkedLDAP: (arg: LinkedLDAPOptions) => Promise<OperationOutcome<typeof chainedLinkedLDAP["&ResultType"]>>;
}

export
function chaining_arguments_from (ca: ChainingOptions): ChainingArguments {
    return new ChainingArguments(
        ca.originator,
        ca.targetObject,
        ca.operationProgress,
        ca.traceInformation,
        ca.aliasDereferenced,
        ca.aliasedRDNs,
        ca.returnCrossRefs,
        ca.referenceType,
        ca.info,
        ca.timeLimit,
        ca.securityParameters,
        ca.entryOnly,
        ca.uniqueIdentifier,
        ca.authenticationLevel,
        ca.exclusions,
        ca.excludeShadows,
        ca.nameResolveOnMaster,
        ca.operationIdentifier,
        ca.searchRuleId,
        ca.chainedRelaxation,
        ca.relatedEntry,
        ca.dspPaging,
        ca.excludeWriteableCopies,
        undefined,
    );
}

export
function create_dsp_client (rose: ROSETransport): DSPClient {
    const dsp: DSPClient = {
        rose,
        directoryVersion: 1,
        bind: async (params: DSPBindParameters): Promise<DSPBindOutcome> => {
            const parameter = dSABind.encoderFor["&ArgumentType"]!(params.parameter, BER);
            const outcome = await rose.bind({
                ...params,
                parameter,
            });
            if ("result" in outcome) {
                const parameter = dSABind.decoderFor["&ResultType"]!(outcome.result.parameter);
                if (parameter.versions?.[Versions_v2] === TRUE_BIT) {
                    dsp.directoryVersion = 2;
                } else if (parameter.versions?.[Versions_v1] === TRUE_BIT) {
                    dsp.directoryVersion = 1;
                } else {
                    dsp.directoryVersion = 0;
                }
                return {
                    result: {
                        ...outcome.result,
                        parameter,
                    },
                };
            } else {
                return outcome;
            }
        },
        request: async (params: RequestParameters): Promise<OperationOutcome> => rose.request(params),
        unbind: async (params?: UnbindParameters): Promise<UnbindOutcome> => rose.unbind(params),

        read: async (params: DSPReadOptions): Promise<OperationOutcome<typeof chainedRead["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedRead["&operationCode"]!);
            const data = new ReadArgumentData(
                name,
                selection_option_to_selection(params.selection),
                params.modifyRightsRequest,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: ReadArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ReadArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                read.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedRead["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedRead.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedRead["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedRead.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        compare: async (params: DSPCompareOptions): Promise<OperationOutcome<typeof chainedCompare["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedCompare["&operationCode"]!);
            const data = new CompareArgumentData(
                name,
                params.purported,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: CompareArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_CompareArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                compare.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedCompare["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedCompare.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedCompare["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedCompare.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        abandon: async (params: DSPAbandonOptions): Promise<OperationOutcome<typeof chainedAbandon["&ResultType"]>> => {
            const data = new AbandonArgumentData(
                {
                    present: params.invoke_id,
                },
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: AbandonArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_AbandonArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedAbandon["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedAbandon.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedAbandon["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedAbandon.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        list: async (params: DSPListOptions): Promise<OperationOutcome<typeof chainedList["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedList["&operationCode"]!);
            const data = new ListArgumentData(
                name,
                params.pagination,
                params.listFamily,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: ListArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ListArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                list.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedList["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedList.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedList["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedList.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        search: async (params: DSPSearchOptions): Promise<OperationOutcome<typeof chainedSearch["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedSearch["&operationCode"]!);
            const search_opts = new Uint8ClampedArray(12);
            search_opts[SearchControlOptions_searchAliases] = params.searchControls?.searchAliases ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_matchedValuesOnly] = params.searchControls?.matchedValuesOnly ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_checkOverspecified] = params.searchControls?.checkOverspecified ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_performExactly] = params.searchControls?.performExactly ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_includeAllAreas] = params.searchControls?.includeAllAreas ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_noSystemRelaxation] = params.searchControls?.noSystemRelaxation ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_dnAttribute] = params.searchControls?.dnAttribute ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_matchOnResidualName] = params.searchControls?.matchOnResidualName ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_entryCount] = params.searchControls?.entryCount ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_useSubset] = params.searchControls?.useSubset ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_separateFamilyMembers] = params.searchControls?.separateFamilyMembers ? TRUE_BIT : FALSE_BIT;
            search_opts[SearchControlOptions_searchFamily] = params.searchControls?.searchFamily ? TRUE_BIT : FALSE_BIT;
            const hs = new Uint8ClampedArray(10);
            hs[HierarchySelections_self] = params.hierarchySelection?.self ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_children] = params.hierarchySelection?.children ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_parent] = params.hierarchySelection?.parent ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_hierarchy] = params.hierarchySelection?.hierarchy ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_top] = params.hierarchySelection?.top ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_subtree] = params.hierarchySelection?.subtree ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_siblings] = params.hierarchySelection?.siblings ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_siblingChildren] = params.hierarchySelection?.siblingChildren ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_siblingSubtree] = params.hierarchySelection?.siblingSubtree ? TRUE_BIT : FALSE_BIT;
            hs[HierarchySelections_all] = params.hierarchySelection?.all ? TRUE_BIT : FALSE_BIT;
            const data = new SearchArgumentData(
                name,
                (params.subset !== undefined)
                    ? ({
                        "base": SearchArgumentData_subset_baseObject,
                        "level": SearchArgumentData_subset_oneLevel,
                        "subtree": SearchArgumentData_subset_wholeSubtree,
                        0: SearchArgumentData_subset_baseObject,
                        1: SearchArgumentData_subset_oneLevel,
                        2: SearchArgumentData_subset_wholeSubtree,
                    })[params.subset]
                    : undefined,
                params.filter,
                params.searchAliases,
                selection_option_to_selection(params.selection),
                params.pagination,
                params.matchedValuesOnly,
                params.extendedFilter,
                params.checkOverspecified,
                params.relaxation,
                params.extendedArea,
                hs,
                search_opts,
                params.joinArguments?.map((ja) => new JoinArgument(
                    ja.joinBaseObject,
                    ja.domainLocalID,
                    ja.joinSubset,
                    ja.joinFilter,
                    ja.joinAttributes,
                    ja.joinSelection,
                )),
                (params.joinType !== undefined)
                    ? ({
                        "inner": SearchArgumentData_joinType_innerJoin,
                        "left": SearchArgumentData_joinType_leftOuterJoin,
                        "full": SearchArgumentData_joinType_fullOuterJoin,
                        0: SearchArgumentData_joinType_innerJoin,
                        1: SearchArgumentData_joinType_leftOuterJoin,
                        2: SearchArgumentData_joinType_fullOuterJoin,
                    })[params.joinType]
                    : undefined,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: SearchArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_SearchArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                search.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedSearch["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedSearch.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedSearch["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedSearch.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        addEntry: async (params: DSPAddEntryOptions): Promise<OperationOutcome<typeof chainedAddEntry["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedAddEntry["&operationCode"]!);
            const data = new AddEntryArgumentData(
                name,
                params.entry,
                params.targetSystem,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: AddEntryArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_AddEntryArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                addEntry.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedAddEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedAddEntry.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedAddEntry["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedAddEntry.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        removeEntry: async (params: DSPRemoveEntryOptions): Promise<OperationOutcome<typeof chainedRemoveEntry["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedRemoveEntry["&operationCode"]!);
            const data = new RemoveEntryArgumentData(
                name,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: RemoveEntryArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_RemoveEntryArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                removeEntry.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedRemoveEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedRemoveEntry.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedRemoveEntry["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedRemoveEntry.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        modifyEntry: async (params: DSPModifyEntryOptions): Promise<OperationOutcome<typeof chainedModifyEntry["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedModifyEntry["&operationCode"]!);
            const data = new ModifyEntryArgumentData(
                name,
                params.changes,
                selection_option_to_selection(params.selection),
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: ModifyEntryArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ModifyEntryArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                modifyEntry.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedModifyEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedModifyEntry.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedModifyEntry["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedModifyEntry.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        modifyDN: async (params: DSPModifyDNOptions): Promise<OperationOutcome<typeof chainedModifyDN["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const newRDN = params.newRDN
                ? ((typeof params.newRDN === "string")
                    ? (name_option_to_name(params.newRDN)?.rdnSequence[0] ?? null)
                    : params.newRDN)
                : (name.rdnSequence[name.rdnSequence.length - 1] ?? []);
            if (newRDN === null) {
                return {
                    other: {
                        message: "Failed to parse new relative distinguished name.",
                    },
                };
            }
            const newSuperior = params.newSuperior
                ? name_option_to_name(params.newSuperior)
                : undefined;
            if (newSuperior === null) {
                return {
                    other: {
                        message: "Failed to parse new superior object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedModifyDN["&operationCode"]!);
            const data = new ModifyDNArgumentData(
                name.rdnSequence,
                newRDN,
                params.deleteOldRDN,
                newSuperior?.rdnSequence,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: ModifyDNArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ModifyDNArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                modifyDN.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedModifyDN["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedModifyDN.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedModifyDN["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedModifyDN.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        changePassword: async (params: DSPChangePasswordOptions): Promise<OperationOutcome<typeof chainedChangePassword["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const data = new ChangePasswordArgumentData(
                name.rdnSequence,
                (typeof params.oldPassword === "string")
                    ? {
                        clear: params.oldPassword,
                    }
                    : params.oldPassword,
                (typeof params.newPassword === "string")
                    ? {
                        clear: params.newPassword,
                    }
                    : params.newPassword,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: ChangePasswordArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ChangePasswordArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                changePassword.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedChangePassword["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedChangePassword.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedChangePassword["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedChangePassword.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        administerPassword: async (params: DSPAdministerPasswordOptions): Promise<OperationOutcome<typeof chainedAdministerPassword["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const data = new AdministerPasswordArgumentData(
                name.rdnSequence,
                (typeof params.newPassword === "string")
                    ? {
                        clear: params.newPassword,
                    }
                    : params.newPassword,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: AdministerPasswordArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_AdministerPasswordArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                administerPassword.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedAdministerPassword["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedAdministerPassword.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedAdministerPassword["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedAdministerPassword.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        ldapTransport: async (params: LDAPTransportOptions): Promise<OperationOutcome<typeof chainedLdapTransport["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedLdapTransport["&operationCode"]!);
            const data = new LdapArgumentData(
                name.rdnSequence,
                params.ldapMessage,
                params.linkId,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: LdapArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_LdapArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                ldapTransport.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedLdapTransport["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedLdapTransport.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedLdapTransport["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedLdapTransport.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
        linkedLDAP: async (params: LinkedLDAPOptions): Promise<OperationOutcome<typeof chainedLinkedLDAP["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, chainedLinkedLDAP["&operationCode"]!);
            const data = new LinkedArgumentData(
                name.rdnSequence,
                params.ldapMessage,
                params.linkId,
                params.returnToClient,
                [],
                svc,
                sec,
                params.requestor,
                params.operationProgress,
                params.aliasedRDNs,
                critex_from(params.criticalExtensions),
                ref_type_from(params.referenceType),
                params.entryOnly,
                params.exclusions,
                params.nameResolveOnMaster,
                params.operationContexts,
                params.familyGrouping,
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: LinkedArgument = (key && cert_path && params.sign_inner_dap && (dsp.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_LinkedArgumentData)
                : {
                    unsigned: data,
                };
            const chaining: ChainingArguments = chaining_arguments_from(params.chaining);
            const chained = new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chaining,
                linkedLDAP.encoderFor["&ArgumentType"]!(arg, DER),
            );
            const chained_arg: ChainedArg = (key && cert_path)
                ? generateSIGNED(key, chained, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1)
                : {
                    unsigned: chained,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: chainedLinkedLDAP["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedLinkedLDAP.encoderFor["&ArgumentType"]!(chained_arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, chainedLinkedLDAP["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = chainedLinkedLDAP.decoderFor["&ResultType"]!(outcome.result.parameter);
                return {
                    result: {
                        ...outcome.result,
                        parameter: decoded,
                    },
                };
            } else {
                return outcome;
            }
        },
    };
    return dsp;
}

// export
// function create_dsp_client_from_url (rose: ROSETransport): DSPClient {

// }
