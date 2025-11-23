import {
    AsyncROSEClient,
    ROSETransport,
    BindParameters,
    RequestParameters,
    BindOutcome,
    OperationOutcome,
    UnbindOutcome,
} from "@wildboar/rose-transport";
import {
    directoryBind,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    read,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    compare,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    abandon,
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
} from "@wildboar/asn1";
import { AttributeValueAssertion } from "@wildboar/x500/InformationFramework";
import { PagedResultsRequest } from "@wildboar/x500/DirectoryAbstractService";
import { Filter } from "@wildboar/x500/DirectoryAbstractService";
import { RelaxationPolicy } from "@wildboar/x500/ServiceAdministration";
import { JoinArgument } from "@wildboar/x500/DirectoryAbstractService";
import { Attribute } from "@wildboar/pki-stub";
import { AccessPoint } from "@wildboar/x500/DistributedOperations";
import { EntryModification } from "@wildboar/x500/DirectoryAbstractService";
import { RelativeDistinguishedName } from "@wildboar/pki-stub";
import { BER, DER } from "@wildboar/asn1/functional";
import {
    generateSIGNED,
    ref_type_from,
    CommonArguments,
    DirectoryName,
    TargetsObject,
    SelectionOptions,
    name_option_to_name,
    critex_from,
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
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/DirectoryAbstractService";

export type BindArgument = typeof directoryBind["&ArgumentType"];
export type BindResult = typeof directoryBind["&ResultType"];
export type DAPBindParameters = BindParameters<BindArgument>;
export type DAPBindOutcome = BindOutcome<BindResult>;

export
interface RelaxationOptions extends RelaxationPolicy {

}

export
interface JoinArgumentOptions extends JoinArgument {

}

export
interface SearchControls {
    searchAliases?: boolean;
    matchedValuesOnly?: boolean;
    checkOverspecified?: boolean;
    performExactly?: boolean;
    includeAllAreas?: boolean;
    noSystemRelaxation?: boolean;
    dnAttribute?: boolean;
    matchOnResidualName?: boolean;
    entryCount?: boolean;
    useSubset?: boolean;
    separateFamilyMembers?: boolean;
    searchFamily?: boolean;
}

export
interface HierarchySelectionOptions {
    self?: boolean;
    children?: boolean;
    parent?: boolean;
    hierarchy?: boolean;
    top?: boolean;
    subtree?: boolean;
    siblings?: boolean;
    siblingChildren?: boolean;
    siblingSubtree?: boolean;
    all?: boolean;
}

export
interface ReadOptions extends CommonArguments, DAPOperationOptions, TargetsObject {
    selection?: SelectionOptions;
    modifyRightsRequest?: boolean;
}

export
interface CompareOptions extends CommonArguments, DAPOperationOptions, TargetsObject {
    purported: AttributeValueAssertion;
}

export
interface AbandonOptions extends DAPOperationOptions {
    invoke_id: number;
}

export
interface ListOptions extends CommonArguments, DAPOperationOptions, TargetsObject {
    pagination?: PagedResultsRequest;
    listFamily?: boolean;
}

export
interface SearchOptions extends CommonArguments, DAPOperationOptions, Partial<TargetsObject> {
    baseObject?: TargetsObject["object"],
    subset?: "base" | "level" | "subtree" | 0 | 1 | 2 | SearchArgumentData["subset"],
    filter?: Filter;
    searchAliases?: boolean;
    selection?: SelectionOptions;
    pagination?: PagedResultsRequest;
    matchedValuesOnly?: boolean;
    extendedFilter?: Filter;
    checkOverspecified?: boolean;
    relaxation?: RelaxationOptions;
    extendedArea?: SearchArgumentData["extendedArea"];
    hierarchySelection?: HierarchySelectionOptions;
    searchControls?: SearchControls;
    joinArguments?: JoinArgumentOptions[];
    joinType?: "inner" | "left" | "full" | 0 | 1 | 2;
}

export
interface AddEntryOptions extends CommonArguments, DAPOperationOptions, TargetsObject {
    entry: Attribute[];
    targetSystem?: AccessPoint;
}

export
interface RemoveEntryOptions extends CommonArguments, DAPOperationOptions, TargetsObject {

}

export
interface ModifyEntryOptions extends CommonArguments, DAPOperationOptions, TargetsObject {
    changes: EntryModification[];
    selection?: SelectionOptions;
}

export
interface ModifyDNOptions extends CommonArguments, DAPOperationOptions, TargetsObject {
    newRDN?: string | RelativeDistinguishedName;
    deleteOldRDN?: boolean;
    newSuperior?: DirectoryName;
}

export
interface ChangePasswordOptions extends DAPOperationOptions, TargetsObject {
    oldPassword: string | UserPwd;
    newPassword: string | UserPwd;
}

export
interface AdministerPasswordOptions extends DAPOperationOptions, TargetsObject {
    newPassword: string | UserPwd;
}

export
interface DAPOperationOptions extends DirectoryOperationOptions {}

export
interface DAPOptions extends DAPOperationOptions {

}

export
interface DAPClient extends AsyncROSEClient<BindArgument, BindResult>, DAPOptions, DirectoryVersioned {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DAPBindParameters) => Promise<DAPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    read: (arg: ReadOptions) => Promise<OperationOutcome<typeof read["&ResultType"]>>;
    compare: (arg: CompareOptions) => Promise<OperationOutcome<typeof compare["&ResultType"]>>;
    abandon: (arg: AbandonOptions) => Promise<OperationOutcome<typeof abandon["&ResultType"]>>;
    list: (arg: ListOptions) => Promise<OperationOutcome<typeof list["&ResultType"]>>;
    search: (arg: SearchOptions) => Promise<OperationOutcome<typeof search["&ResultType"]>>;
    addEntry: (arg: AddEntryOptions) => Promise<OperationOutcome<typeof addEntry["&ResultType"]>>;
    removeEntry: (arg: RemoveEntryOptions) => Promise<OperationOutcome<typeof removeEntry["&ResultType"]>>;
    modifyEntry: (arg: ModifyEntryOptions) => Promise<OperationOutcome<typeof modifyEntry["&ResultType"]>>;
    modifyDN: (arg: ModifyDNOptions) => Promise<OperationOutcome<typeof modifyDN["&ResultType"]>>;
    changePassword: (arg: ChangePasswordOptions) => Promise<OperationOutcome<typeof changePassword["&ResultType"]>>;
    administerPassword: (arg: AdministerPasswordOptions) => Promise<OperationOutcome<typeof administerPassword["&ResultType"]>>;
}

export
function create_dap_client (rose: ROSETransport): DAPClient {
    const dap: DAPClient = {
        rose,
        directoryVersion: 1,
        bind: async (params: DAPBindParameters): Promise<DAPBindOutcome> => {
            const parameter = directoryBind.encoderFor["&ArgumentType"]!(params.parameter, BER);
            const outcome = await rose.bind({
                ...params,
                parameter,
            });
            if ("result" in outcome) {
                const parameter = directoryBind.decoderFor["&ResultType"]!(outcome.result.parameter);
                if (parameter.versions?.[Versions_v2] === TRUE_BIT) {
                    dap.directoryVersion = 2;
                } else if (parameter.versions?.[Versions_v1] === TRUE_BIT) {
                    dap.directoryVersion = 1;
                } else {
                    dap.directoryVersion = 0;
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
        request: (params: RequestParameters): Promise<OperationOutcome> => rose.request(params),
        unbind: (): Promise<UnbindOutcome> => rose.unbind(),

        read: async (params: ReadOptions): Promise<OperationOutcome<typeof read["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, read["&operationCode"]!);
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: ReadArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ReadArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: read["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: read.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, read["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = read.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        compare: async (params: CompareOptions): Promise<OperationOutcome<typeof compare["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, compare["&operationCode"]!);
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: CompareArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_CompareArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: compare["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: compare.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, compare["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = compare.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        abandon: async (params: AbandonOptions): Promise<OperationOutcome<typeof abandon["&ResultType"]>> => {
            const data = new AbandonArgumentData(
                {
                    present: params.invoke_id,
                },
            );
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: AbandonArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_AbandonArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: abandon["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: abandon.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, abandon["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = abandon.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        list: async (params: ListOptions): Promise<OperationOutcome<typeof list["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, list["&operationCode"]!);
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: ListArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ListArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: list["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: list.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, list["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = list.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        search: async (params: SearchOptions): Promise<OperationOutcome<typeof search["&ResultType"]>> => {
            const name = name_option_to_name(params.baseObject ?? params.object!);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, search["&operationCode"]!);
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
                    })[typeof params.subset === "string" ? params.subset : Number()]
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
                params.hierarchySelection
                    ? hs
                    : undefined,
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: SearchArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_SearchArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: search["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: search.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, search["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = search.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        addEntry: async (params: AddEntryOptions): Promise<OperationOutcome<typeof addEntry["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, addEntry["&operationCode"]!);
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: AddEntryArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_AddEntryArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: addEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: addEntry.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, addEntry["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = addEntry.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        removeEntry: async (params: RemoveEntryOptions): Promise<OperationOutcome<typeof removeEntry["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, removeEntry["&operationCode"]!);
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: RemoveEntryArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_RemoveEntryArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: removeEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: removeEntry.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, removeEntry["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = removeEntry.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        modifyEntry: async (params: ModifyEntryOptions): Promise<OperationOutcome<typeof modifyEntry["&ResultType"]>> => {
            const name = name_option_to_name(params.object);
            if (!name) {
                return {
                    other: {
                        message: "Failed to parse target object name.",
                    },
                };
            }
            const svc = service_option_to(params);
            const sec = security_params_from(params, modifyEntry["&operationCode"]!);
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: ModifyEntryArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ModifyEntryArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: modifyEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: modifyEntry.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, modifyEntry["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = modifyEntry.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        modifyDN: async (params: ModifyDNOptions): Promise<OperationOutcome<typeof modifyDN["&ResultType"]>> => {
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
            const sec = security_params_from(params, modifyDN["&operationCode"]!);
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: ModifyDNArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ModifyDNArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: modifyDN["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: modifyDN.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, modifyDN["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = modifyDN.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        changePassword: async (params: ChangePasswordOptions): Promise<OperationOutcome<typeof changePassword["&ResultType"]>> => {
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: ChangePasswordArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_ChangePasswordArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: changePassword["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: changePassword.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, changePassword["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = changePassword.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        administerPassword: async (params: AdministerPasswordOptions): Promise<OperationOutcome<typeof administerPassword["&ResultType"]>> => {
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
            const key = params.key ?? dap.key;
            const cert_path = params.cert_path ?? dap.cert_path;
            const arg: AdministerPasswordArgument = (key && cert_path && (dap.directoryVersion === 2))
                ? generateSIGNED(key, data, _encode_AdministerPasswordArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = generateUnusedInvokeId();
            const outcome = await rose.request({
                code: administerPassword["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: administerPassword.encoderFor["&ArgumentType"]!(arg, DER),
                timeout: params.timeout,
            });
            if ("result" in outcome) {
                assert(compareCode(outcome.result.code, administerPassword["&operationCode"]!));
                assert("present" in outcome.result.invoke_id);
                assert(outcome.result.invoke_id.present.toString() === invoke_id.toString());
                const decoded = administerPassword.decoderFor["&ResultType"]!(outcome.result.parameter);
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
    return dap;
}

// export
// function create_dap_client_from_url (rose: ROSETransport): DAPClient {

// }
