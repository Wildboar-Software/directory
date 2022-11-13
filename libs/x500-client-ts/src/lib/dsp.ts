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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBind.oa";
import {
    read,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import {
    compare,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import {
    list,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import {
    removeEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import {
    modifyEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import {
    modifyDN,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import {
    changePassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import {
    administerPassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import {
    ldapTransport,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ldapTransport.oa";
import {
    LinkedArgument,
    linkedLDAP,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/linkedLDAP.oa";
import {
    ReadArgumentData, _encode_ReadArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgumentData.ta";
import {
    CompareArgumentData, _encode_CompareArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta";
import {
    AbandonArgumentData, _encode_AbandonArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgumentData.ta";
import {
    ListArgumentData, _encode_ListArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgumentData.ta";
import {
    SearchArgumentData, _encode_SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    AddEntryArgumentData, _encode_AddEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import {
    RemoveEntryArgumentData, _encode_RemoveEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgumentData.ta";
import {
    ModifyEntryArgumentData, _encode_ModifyEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta";
import {
    ModifyDNArgumentData, _encode_ModifyDNArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgumentData.ta";
import {
    ChangePasswordArgumentData, _encode_ChangePasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgumentData.ta";
import {
    AdministerPasswordArgumentData, _encode_AdministerPasswordArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgumentData.ta";
import {
    ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    AbandonArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgument.ta";
import {
    ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import {
    ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import {
    ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import {
    AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    ASN1Element,
    BIT_STRING,
    FALSE_BIT,
    ObjectIdentifier,
    OBJECT_IDENTIFIER,
    TRUE_BIT,
    unpackBits,
    BERElement,
    BOOLEAN,
} from "asn1-ts";
import {
    CertificatePair,
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import { AttributeValueAssertion } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { PagedResultsRequest } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest.ta";
import { Filter } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Filter.ta";
import { RelaxationPolicy } from "@wildboar/x500/src/lib/modules/ServiceAdministration/RelaxationPolicy.ta";
import { JoinArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/JoinArgument.ta";
import { Attribute } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute.ta";
import { AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { EntryModification } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import { RelativeDistinguishedName } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/RelativeDistinguishedName.ta";
import { BER, DER } from "asn1-ts/dist/node/functional";
import {
    destringifyDN,
    generateSIGNED,
    CommonArguments,
    BitStringOption,
    OIDOption,
    CertPathOption,
    DirectoryName,
    SecurityOptions,
    ServiceOptions,
    TargetsObject,
    ref_type_from,
} from "./utils";
import { ServiceControls } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_localScope,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_subentries,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_allowWriteableCopy,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ServiceControls_manageDSAITPlaneRef,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-manageDSAITPlaneRef.ta";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import { SecurityParameters } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { KeyObject, randomBytes } from "node:crypto";
import { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import { strict as assert } from "node:assert";
import { compareCode } from "@wildboar/x500";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import {
    SearchArgumentData_joinType_innerJoin,
    SearchArgumentData_joinType_leftOuterJoin,
    SearchArgumentData_joinType_fullOuterJoin,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-joinType.ta";
import { readFileSync } from "node:fs";
import { PEMObject } from "pem-ts";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import { differenceInSeconds } from "date-fns";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1, _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import { chainedCompare } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedCompare.oa";
import { chainedAbandon } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAbandon.oa";
import { chainedList } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedList.oa";
import { chainedSearch } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedSearch.oa";
import { chainedAddEntry } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAddEntry.oa";
import { chainedRemoveEntry } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRemoveEntry.oa";
import { chainedModifyEntry } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedModifyEntry.oa";
import { chainedModifyDN } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedModifyDN.oa";
import { chainedAdministerPassword } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAdministerPassword.oa";
import { chainedChangePassword } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedChangePassword.oa";
import { chainedLdapTransport } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedLdapTransport.oa";
import { chainedLinkedLDAP } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedLinkedLDAP.oa";
import { LDAPMessage } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import { LinkId } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LinkId.ta";
import { LdapArgumentData, _encode_LdapArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LdapArgumentData.ta";
import { LdapArgument } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LdapArgument.ta";
import { LinkedArgumentData, _encode_LinkedArgumentData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LinkedArgumentData.ta";

export type ChainedArg = typeof chainedRead["&ArgumentType"];
export type BindArgument = typeof directoryBind["&ArgumentType"];
export type BindResult = typeof directoryBind["&ResultType"];
export type DSPBindParameters = BindParameters<BindArgument>;
export type DSPBindOutcome = BindOutcome<BindResult>;

export
interface SelectionOptions extends EntryInformationSelection {

}

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
interface ChainingOptions extends ChainingArguments {

}

export
interface WithChainingOptions {
    chaining: ChainingOptions;
}

export
interface ReadOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    selection?: SelectionOptions;
    modifyRightsRequest?: boolean;
}

export
interface CompareOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    purported: AttributeValueAssertion;
}

export
interface AbandonOptions
extends DSPOperationOptions {
    invoke_id: number;
}

export
interface ListOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    pagination?: PagedResultsRequest;
    listFamily?: boolean;
}

export
interface SearchOptions
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
interface AddEntryOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    entry: Attribute[];
    targetSystem?: AccessPoint;
}

export
interface RemoveEntryOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {

}

export
interface ModifyEntryOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    changes: EntryModification[];
    selection?: SelectionOptions;
}

export
interface ModifyDNOptions
extends CommonArguments, DSPOperationOptions, TargetsObject, WithChainingOptions {
    newRDN?: string | RelativeDistinguishedName;
    deleteOldRDN?: boolean;
    newSuperior?: DirectoryName;
}

export
interface ChangePasswordOptions
extends DSPOperationOptions, TargetsObject, WithChainingOptions {
    oldPassword: string | UserPwd;
    newPassword: string | UserPwd;
}

export
interface AdministerPasswordOptions
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
interface DSPOperationOptions {
    key?: KeyObject;
    cert_path?: CertPathOption;
    sign_inner_dap?: boolean;
}

export
interface DSPOptions extends DSPOperationOptions {

}

export
interface DSPClient extends AsyncROSEClient<BindArgument, BindResult>, DSPOptions {
    rose: ROSETransport;

    // From AsyncROSEClient
    bind: (params: DSPBindParameters, options?: DSPOperationOptions) => Promise<DSPBindOutcome>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: () => Promise<UnbindOutcome>;

    read: (arg: ReadOptions) => Promise<OperationOutcome<typeof chainedRead["&ResultType"]>>;
    compare: (arg: CompareOptions) => Promise<OperationOutcome<typeof chainedCompare["&ResultType"]>>;
    abandon: (arg: AbandonOptions) => Promise<OperationOutcome<typeof chainedAbandon["&ResultType"]>>;
    list: (arg: ListOptions) => Promise<OperationOutcome<typeof chainedList["&ResultType"]>>;
    search: (arg: SearchOptions) => Promise<OperationOutcome<typeof chainedSearch["&ResultType"]>>;
    addEntry: (arg: AddEntryOptions) => Promise<OperationOutcome<typeof chainedAddEntry["&ResultType"]>>;
    removeEntry: (arg: RemoveEntryOptions) => Promise<OperationOutcome<typeof chainedRemoveEntry["&ResultType"]>>;
    modifyEntry: (arg: ModifyEntryOptions) => Promise<OperationOutcome<typeof chainedModifyEntry["&ResultType"]>>;
    modifyDN: (arg: ModifyDNOptions) => Promise<OperationOutcome<typeof chainedModifyDN["&ResultType"]>>;
    changePassword: (arg: ChangePasswordOptions) => Promise<OperationOutcome<typeof chainedChangePassword["&ResultType"]>>;
    administerPassword: (arg: AdministerPasswordOptions) => Promise<OperationOutcome<typeof chainedAdministerPassword["&ResultType"]>>;
    ldapTransport: (arg: LDAPTransportOptions) => Promise<OperationOutcome<typeof chainedLdapTransport["&ResultType"]>>;
    linkedLDAP: (arg: LinkedLDAPOptions) => Promise<OperationOutcome<typeof chainedLinkedLDAP["&ResultType"]>>;
}

export
function name_option_to_name (
    name: DirectoryName,
    nameToOID?: (name: string) => OBJECT_IDENTIFIER | undefined | null,
    valueParser?: (str: string) => ASN1Element,
): Name | null {
    if (Array.isArray(name)) {
        return {
            rdnSequence: name,
        };
    } else if (typeof name === "object") {
        return name;
    } else {
        if (!nameToOID || !valueParser) {
            return null;
        }
        return {
            rdnSequence: destringifyDN(name, nameToOID, valueParser),
        };
    }
}

export
function selection_option_to_selection (sel?: SelectionOptions): EntryInformationSelection | undefined {
    if (!sel) {
        return undefined;
    }
    return new EntryInformationSelection(
        sel.attributes,
        sel.infoTypes,
        sel.extraAttributes,
        sel.contextSelection,
        sel.returnContexts,
        sel.familyReturn,
    );
}

export
function oid_option_to_oid (oid: OIDOption): OBJECT_IDENTIFIER {
    if (typeof oid === "string") {
        return ObjectIdentifier.fromString(oid);
    } else {
        return oid;
    }
}

export
function service_option_to (so: ServiceOptions): ServiceControls {
    const opts = new Uint8ClampedArray(15);
    opts[ServiceControlOptions_preferChaining] = so.preferChaining ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_chainingProhibited] = so.chainingProhibited ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_localScope] = so.localScope ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontUseCopy] = so.dontUseCopy ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontDereferenceAliases] = so.dontDereferenceAliases ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_subentries] = so.subentries ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_copyShallDo] = so.copyShallDo ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_partialNameResolution] = so.partialNameResolution ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_manageDSAIT] = so.manageDSAIT ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_noSubtypeMatch] = so.noSubtypeMatch ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_noSubtypeSelection] = so.noSubtypeSelection ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_countFamily] = so.countFamily ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontSelectFriends] = so.dontSelectFriends ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_dontMatchFriends] = so.dontMatchFriends ? TRUE_BIT : FALSE_BIT;
    opts[ServiceControlOptions_allowWriteableCopy] = so.allowWriteableCopy ? TRUE_BIT : FALSE_BIT;
    const mdsaitPlaneName = so.manageDSAITPlaneRef?.dsaName
        ? name_option_to_name(so.manageDSAITPlaneRef.dsaName)
        : undefined;
    return new ServiceControls(
        opts,
        so.priority,
        so.timeLimit
            ? ((typeof so.timeLimit === "object")
                ? Math.abs(differenceInSeconds(so.timeLimit, new Date()))
                : so.timeLimit)
            : undefined,
        so.sizeLimit,
        so.scopeOfReferral,
        so.attributeSizeLimit,
        mdsaitPlaneName
            ? new ServiceControls_manageDSAITPlaneRef(
                mdsaitPlaneName,
                new OperationalBindingID(
                    so.manageDSAITPlaneRef!.agreementID.identifier,
                    so.manageDSAITPlaneRef!.agreementID.version,
                ),
            )
            : undefined,
        so.serviceType
            ? oid_option_to_oid(so.serviceType)
            : undefined,
        so.userClass,
        [],
    );
}

export
function cert_path_from_option (cp?: CertPathOption): CertificationPath | undefined {
    if (!cp) {
        return undefined;
    }
    if (cp instanceof CertificationPath) {
        return cp;
    } else if (Array.isArray(cp) && (cp.length > 0)) {
        const userCert = cp[cp.length - 1] as Certificate;
        return new CertificationPath(
            userCert,
            (cp as Certificate[])
                .slice(0, -1)
                .reverse()
                .map((c: Certificate) => new CertificatePair(c, undefined)),
        );
    } else if (typeof cp === "string") {
        const certFile = readFileSync(cp, { encoding: "utf-8" });
        const certPems = PEMObject.parse(certFile);
        const certs = certPems.map((certPem) => {
            const el = new BERElement();
            el.fromBytes(certPem.data);
            return _decode_Certificate(el);
        });
        return cert_path_from_option(certs.reverse());
    } else {
        return undefined;
    }
}

export
function security_params_from (p: SecurityOptions, opCode: Code): SecurityParameters | undefined {
    if (!p.certification_path && !p.requestSignedResult && !p.requestSignedError) {
        return undefined;
    }
    const cert_path = cert_path_from_option(p.certification_path);
    return new SecurityParameters(
        cert_path,
        undefined, // Name
        cert_path
            ? {
                generalizedTime: new Date((new Date()).valueOf() + 60000),
            }
            : undefined,
        cert_path
            ? unpackBits(randomBytes(4))
            : undefined,
        p.requestSignedResult
            ? ProtectionRequest_signed
            : undefined,
        opCode,
        p.requestSignedError
            ? ErrorProtectionRequest_signed
            : undefined,
        undefined,
        undefined,
    );
}

export
function critex_from (bits?: BitStringOption): BIT_STRING | undefined {
    if (!bits) {
        return undefined;
    }
    if (bits instanceof Uint8ClampedArray) {
        return bits;
    } else {
        return new Uint8ClampedArray(
            Array
                .from(bits)
                .map((char) => (char === "1") ? TRUE_BIT : FALSE_BIT),
        );
    }
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
        bind: async (params: DSPBindParameters): Promise<DSPBindOutcome> => {
            const parameter = directoryBind.encoderFor["&ArgumentType"]!(params.parameter, BER);
            const outcome = await rose.bind({
                ...params,
                parameter,
            });
            if ("result" in outcome) {
                const parameter = directoryBind.decoderFor["&ResultType"]!(outcome.result.parameter);
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
        unbind: async (): Promise<UnbindOutcome> => rose.unbind(),

        read: async (params: ReadOptions): Promise<OperationOutcome<typeof chainedRead["&ResultType"]>> => {
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
            const arg: ReadArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedRead["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedRead.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        compare: async (params: CompareOptions): Promise<OperationOutcome<typeof chainedCompare["&ResultType"]>> => {
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
            const arg: CompareArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedCompare["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedCompare.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        abandon: async (params: AbandonOptions): Promise<OperationOutcome<typeof chainedAbandon["&ResultType"]>> => {
            const data = new AbandonArgumentData(
                {
                    present: params.invoke_id,
                },
            );
            const key = params.key ?? dsp.key;
            const cert_path = params.cert_path ?? dsp.cert_path;
            const arg: AbandonArgument = (key && cert_path && params.sign_inner_dap)
                ? generateSIGNED(key, data, _encode_AbandonArgumentData)
                : {
                    unsigned: data,
                };
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedAbandon["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedAbandon.encoderFor["&ArgumentType"]!(arg, DER),
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
        list: async (params: ListOptions): Promise<OperationOutcome<typeof chainedList["&ResultType"]>> => {
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
            const arg: ListArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedList["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedList.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        search: async (params: SearchOptions): Promise<OperationOutcome<typeof chainedSearch["&ResultType"]>> => {
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
            const arg: SearchArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedSearch["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedSearch.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        addEntry: async (params: AddEntryOptions): Promise<OperationOutcome<typeof chainedAddEntry["&ResultType"]>> => {
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
            const arg: AddEntryArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedAddEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedAddEntry.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        removeEntry: async (params: RemoveEntryOptions): Promise<OperationOutcome<typeof chainedRemoveEntry["&ResultType"]>> => {
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
            const arg: RemoveEntryArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedRemoveEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedRemoveEntry.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        modifyEntry: async (params: ModifyEntryOptions): Promise<OperationOutcome<typeof chainedModifyEntry["&ResultType"]>> => {
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
            const arg: ModifyEntryArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedModifyEntry["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedModifyEntry.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        modifyDN: async (params: ModifyDNOptions): Promise<OperationOutcome<typeof chainedModifyDN["&ResultType"]>> => {
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
            const arg: ModifyDNArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedModifyDN["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedModifyDN.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        changePassword: async (params: ChangePasswordOptions): Promise<OperationOutcome<typeof chainedChangePassword["&ResultType"]>> => {
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
            const arg: ChangePasswordArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedChangePassword["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedChangePassword.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
        administerPassword: async (params: AdministerPasswordOptions): Promise<OperationOutcome<typeof chainedAdministerPassword["&ResultType"]>> => {
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
            const arg: AdministerPasswordArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedAdministerPassword["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedAdministerPassword.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
            const arg: LdapArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedLdapTransport["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedLdapTransport.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
            const arg: LinkedArgument = (key && cert_path && params.sign_inner_dap)
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
            const invoke_id: number = randomBytes(4).readUint32BE();
            const outcome = await rose.request({
                code: chainedLinkedLDAP["&operationCode"]!,
                invoke_id: {
                    present: invoke_id,
                },
                parameter: chainedLinkedLDAP.encoderFor["&ArgumentType"]!(chained_arg, DER),
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
