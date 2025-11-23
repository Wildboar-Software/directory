import { Vertex, ClientAssociation, OperationReturn, IndexableOID } from "@wildboar/meerkat-types";
import {
    ObjectIdentifier,
    TRUE_BIT,
    FALSE_BIT,
    OBJECT_IDENTIFIER,
    unpackBits,
    ASN1TagClass,
    FALSE,
    BOOLEAN,
    TRUE,
    ASN1Element,
    DERElement,
    ASN1Construction,
    OCTET_STRING,
} from "@wildboar/asn1";
import type { MeerkatContext } from "../ctx.js";
import * as errors from "@wildboar/meerkat-types";
import {
    _decode_ReadArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ReadResult,
    _encode_ReadResult,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ReadResultData,
    _encode_ReadResultData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/DistributedOperations";
import {
    ChainingResults,
} from "@wildboar/x500/DistributedOperations";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import {
    EntryInformation,
} from "@wildboar/x500/DirectoryAbstractService";
import { SecurityErrorData } from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_insufficientAccessRights,
    SecurityProblem_invalidSignature,
} from "@wildboar/x500/DirectoryAbstractService";
import getRelevantSubentries from "../dit/getRelevantSubentries.js";
import { type ACDFTuple } from "@wildboar/x500";
import { type ACDFTupleExtended } from "@wildboar/x500";
import { type ProtectedItem } from "@wildboar/x500";
import {
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_READ,
    PERMISSION_CATEGORY_RENAME,
    PERMISSION_CATEGORY_EXPORT,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
} from "@wildboar/x500";
import { getACDFTuplesFromACIItem } from "@wildboar/x500";
import getIsGroupMember from "../authz/getIsGroupMember.js";
import type { ModifyRights } from "@wildboar/x500/DirectoryAbstractService";
import { ModifyRights_Item } from "@wildboar/x500/DirectoryAbstractService";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    id_opcode_read,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    securityError,
} from "@wildboar/x500/DirectoryAbstractService";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import { DER, _encodeBitString } from "@wildboar/asn1/functional";
import readPermittedEntryInformation from "../database/entry/readPermittedEntryInformation.js";
import { codeToString } from "@wildboar/x500";
import getStatisticsFromCommonArguments from "../telemetry/getStatisticsFromCommonArguments.js";
import getEntryInformationSelectionStatistics from "../telemetry/getEntryInformationSelectionStatistics.js";
import failover from "../utils/failover.js";
import {
    AbandonedData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    abandoned,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyReturn_memberSelect_contributingEntriesOnly,
    FamilyReturn_memberSelect_participatingEntriesOnly,
} from "@wildboar/x500/DirectoryAbstractService";
import readFamily from "../database/family/readFamily.js";
import readCompoundEntry from "../database/family/readCompoundEntry.js";
import convertSubtreeToFamilyInformation from "../x500/convertSubtreeToFamilyInformation.js";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyEntries,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    family_information,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeProblem_noSuchAttributeOrValue,
} from "@wildboar/x500/DirectoryAbstractService";
import getACIItems from "../authz/getACIItems.js";
import { MINIMUM_MAX_ATTR_SIZE, UNTRUSTED_REQ_AUTH_LEVEL } from "../constants.js";
import {
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_dontSelectFriends,
} from "@wildboar/x500/DirectoryAbstractService";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import bacSettings from "../authz/bacSettings.js";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import preprocessTuples from "../authz/preprocessTuples.js";
import { attributeError } from "@wildboar/x500/DirectoryAbstractService";
import isOperationalAttributeType from "../x500/isOperationalAttributeType.js";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import { generateSignature } from "../pki/generateSignature.js";
import { SIGNED } from "@wildboar/x500/AuthenticationFramework";
import { stringifyDN } from "../x500/stringifyDN.js";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { printInvokeId } from "../utils/printInvokeId.js";
import dseFromDatabaseEntry from "../database/dseFromDatabaseEntry.js";
import {
    TBSAttributeCertificate,
    _encode_TBSAttributeCertificate,
} from "@wildboar/pki-stub";
import { AttCertVersion_v2 } from "@wildboar/pki-stub";
import { Holder } from "@wildboar/pki-stub";
import { AttCertIssuer } from "@wildboar/pki-stub";
import { IssuerSerial } from "@wildboar/pki-stub";
import * as crypto from "node:crypto";
import { AttCertValidityPeriod } from "@wildboar/pki-stub";
import { addSeconds } from "date-fns";
import { Extension } from "@wildboar/pki-stub";
import { singleUse } from "@wildboar/x500/AttributeCertificateDefinitions";
import { noAssertion } from "@wildboar/x500/AttributeCertificateDefinitions";
import { _encode_AlgorithmIdentifier } from "@wildboar/pki-stub";
import { acdf } from "../authz/acdf.js";

function createAttributeCertificate (
    ctx: MeerkatContext,
    dn: DistinguishedName,
    attributes: Attribute[],
    single_use: boolean,
    no_assertion: boolean,
): OCTET_STRING | undefined {
    const key = ctx.config.signing.key;
    const certPath = ctx.config.signing.certPath;
    if (!key || !certPath) {
        return undefined;
    }
    const myCert = certPath[certPath.length - 1];
    if (!myCert) {
        return undefined;
    }
    // Sign bullshit data so we can just get the signature algorithm.
    const sigAlg = generateSignature(key, new Uint8Array([ 1 ]))?.[0];
    if (!sigAlg) {
        return undefined;
    }
    const serialNumber = crypto.randomBytes(16);
    serialNumber[0] &= 0b0111_1111; // Ensure serial is not negative.
    const now = new Date();
    const extensions: Extension[] = [];
    if (single_use) {
        extensions.push(new Extension(
            singleUse["&id"]!,
            TRUE,
            Buffer.from([ 0x05, 0x00 ]),
        ));
    }
    if (no_assertion) {
        extensions.push(new Extension(
            noAssertion["&id"]!,
            TRUE,
            Buffer.from([ 0x05, 0x00 ]),
        ));
    }
    const tbs = new TBSAttributeCertificate(
        AttCertVersion_v2,
        new Holder(
            undefined,
            [
                {
                    directoryName: {
                        rdnSequence: dn,
                    },
                },
            ],
        ),
        new AttCertIssuer(
            [
                {
                    directoryName: {
                        rdnSequence: ctx.dsa.accessPoint.ae_title.rdnSequence,
                    },
                },
            ],
            new IssuerSerial(
                [
                    {
                        directoryName: myCert.toBeSigned.issuer,
                    },
                ],
                myCert.toBeSigned.serialNumber,
                myCert.toBeSigned.issuerUniqueIdentifier,
            ),
        ),
        sigAlg,
        serialNumber,
        new AttCertValidityPeriod(
            now,
            addSeconds(now, ctx.config.attributeCertificateDuration),
        ),
        attributes,
        undefined,
        undefined,
        (extensions.length > 0) ? extensions : undefined,
    );
    const tbsElement = _encode_TBSAttributeCertificate(tbs);
    const tbsBytes = tbsElement.toBytes();
    const signingResult = generateSignature(key, tbsBytes);
    if (!signingResult) {
        return undefined;
    }
    const [ sigAlg2, sigValue ] = signingResult;
    if (!sigAlg.algorithm.isEqualTo(sigAlg2.algorithm)) { // These should be equal.
        return undefined;
    }
    return DERElement.fromSequence([
        tbsElement,
        _encode_AlgorithmIdentifier(sigAlg, DER),
        _encodeBitString(unpackBits(sigValue), DER),
    ]).toBytes();
}

/**
 * @summary The read operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `read` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 10.1. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 19.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function read (
    ctx: MeerkatContext,
    assn: ClientAssociation | undefined,
    state: OperationDispatcherState,
): Promise<OperationReturn> {
    const target = state.foundDSE;
    const argument = _decode_ReadArgument(state.operationArgument);
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (!assn || assn.authorizedForSignedErrors)
    );
    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? state.chainingArguments.originator
        ?? data.requestor
        ?? assn?.boundNameAndUID?.dn;

    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     *
     * Meerkat DSA allows operations with invalid signatures to progress
     * through all pre-operation-evaluation procedures leading up to operation
     * evaluation, but with `AuthenticationLevel.basicLevels.signed` set to
     * `FALSE` so that access controls are still respected. Therefore, if we get
     * to this point in the code, and the argument is signed, but the
     * authentication level has the `signed` field set to `FALSE`, we throw an
     * `invalidSignature` error.
     */
    if (
        ("signed" in argument)
        && state.chainingArguments.authenticationLevel
        && ("basicLevels" in state.chainingArguments.authenticationLevel)
        && !state.chainingArguments.authenticationLevel.basicLevels.signed
    ) {
        const remoteHostIdentifier = assn
            ? `${assn.socket.remoteFamily}://${assn.socket.remoteAddress}/${assn.socket.remotePort}`
            : "INTERNAL://127.0.0.1/1"; // TODO: Make this a constant.
        const logInfo = {
            context: "arg",
            host: remoteHostIdentifier,
            aid: assn?.id,
            iid: printInvokeId(state.invokeId),
            ap: stringifyDN(ctx, requestor ?? []),
        };
        ctx.log.warn(ctx.i18n.t("log:invalid_signature", logInfo), logInfo);
        throw new errors.SecurityError(
            ctx.i18n.t("err:invalid_signature", logInfo),
            new SecurityErrorData(
                SecurityProblem_invalidSignature,
                undefined,
                undefined,
                undefined,
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    // #endregion Signature validation
    const op = ("present" in state.invokeId)
        ? assn?.invocations.get(Number(state.invokeId.present))
        : undefined;
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const targetDN = getDistinguishedName(target);
    const relevantSubentries: Vertex[] = (await Promise.all(
        state.admPoints.map((ap) => getRelevantSubentries(ctx, target, targetDN, ap)),
    )).flat();
    const accessControlScheme = [ ...state.admPoints ] // Array.reverse() works in-place, so we create a new array.
        .reverse()
        .find((ap) => ap.dse.admPoint!.accessControlScheme)?.dse.admPoint!.accessControlScheme;
    const relevantACIItems = await getACIItems(
        ctx,
        accessControlScheme,
        target.immediateSuperior,
        target,
        relevantSubentries,
        Boolean(target.dse.subentry),
    );
    const acdfTuples: ACDFTuple[] = (relevantACIItems ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const isMemberOfGroup = getIsGroupMember(ctx, NAMING_MATCHER);
    const user = requestor
        ? new NameAndOptionalUID(
            requestor,
            state.chainingArguments.uniqueIdentifier,
        )
        : undefined;
    const relevantTuples: ACDFTupleExtended[] = await preprocessTuples(
        accessControlScheme,
        acdfTuples,
        user,
        state.chainingArguments.authenticationLevel
            ?? assn?.authLevel
            ?? UNTRUSTED_REQ_AUTH_LEVEL,
        targetDN,
        isMemberOfGroup,
        NAMING_MATCHER,
    );
    const objectClasses: OBJECT_IDENTIFIER[] = Array.from(target.dse.objectClass).map(ObjectIdentifier.fromString);
    const getPermittedToDoXToY = (y: ProtectedItem): (permissions: number[]) => boolean =>
        (permissions: number[]) => !accessControlScheme || acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                permissions,
                relevantTuples,
                user,
                y,
                bacSettings,
                true,
            );
    const permittedToDoXToThisEntry = getPermittedToDoXToY({
        entry: objectClasses,
    });
    if (accessControlScheme) {
        if (!permittedToDoXToThisEntry([ PERMISSION_CATEGORY_READ ])) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_read"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    }

    if (op?.abandonTime) {
        op.events.emit("abandon");
        throw new errors.AbandonError(
            ctx.i18n.t("err:abandoned"),
            new AbandonedData(
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    abandoned["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }
    if (op) {
        op.pointOfNoReturnTime = new Date();
    }
    const attributeSizeLimit: number | undefined = (
        Number.isSafeInteger(Number(data.serviceControls?.attributeSizeLimit))
        && (Number(data.serviceControls?.attributeSizeLimit) >= MINIMUM_MAX_ATTR_SIZE)
    )
        ? Number(data.serviceControls!.attributeSizeLimit)
        : undefined;

    const noSubtypeSelection: boolean = (
        state.effectiveServiceControls?.[ServiceControlOptions_noSubtypeSelection] === TRUE_BIT);
    const dontSelectFriends: boolean = (
        state.effectiveServiceControls?.[ServiceControlOptions_dontSelectFriends] === TRUE_BIT);

    /**
     * This is a hack to ensure that `read` returns up-to-date information
     * despite caching of the most-recently-used vertex. If we see that we have
     * read the vertex from the cache, we update the cache and the vertex.
     *
     * Notice that the vertexes are compared by reference, not by value. This is
     * just to prevent mistaken refreshes from slowing down the `read` operation.
     */
    if (assn?.mostRecentVertex?.path?.length) {
        const path = assn.mostRecentVertex.path;
        const mruVertex = path[path.length - 1];
        if (mruVertex === target) {
            const dbe = await ctx.db.entry.findUnique({
                where: {
                    id: target.dse.id,
                },
                include: {
                    RDN: {
                        select: {
                            type_oid: true,
                            tag_class: true,
                            constructed: true,
                            tag_number: true,
                            content_octets: true,
                        },
                    },
                    EntryObjectClass: {
                        select: {
                            object_class: true,
                        },
                    },
                },
            });
            // This should always be true, but we just ignore it if the entry
            // could not be found. This is not a high-stakes operation.
            if (dbe) {
                target.dse = await dseFromDatabaseEntry(ctx, dbe);
            }
        }
    }

    const permittedEntryInfo = await readPermittedEntryInformation(
        ctx,
        assn,
        target,
        user,
        relevantTuples,
        accessControlScheme,
        {
            selection: data.selection,
            relevantSubentries,
            operationContexts: data.operationContexts,
            attributeSizeLimit,
            noSubtypeSelection,
            dontSelectFriends,
            outputAttributeTypes: state.outputAttributeTypes,
        },
    );

    const familyReturn = state.effectiveFamilyReturn ?? data.selection?.familyReturn;
    if (
        target.dse.familyMember
        && familyReturn
        && (familyReturn.memberSelect !== FamilyReturn_memberSelect_contributingEntriesOnly)
        && (familyReturn.memberSelect !== FamilyReturn_memberSelect_participatingEntriesOnly)
    ) {
        const familySelect: Set<IndexableOID> | null = familyReturn.familySelect?.length
            ? new Set(familyReturn.familySelect.map((oid) => oid.toString()))
            : null;
        const family = await readFamily(ctx, target);
        const familyMembers: Vertex[] = readCompoundEntry(family).next().value;
        const permittedEinfos = await Promise.all(
            familyMembers
                .slice(1) // Skip the first member, which is the read entry.
                .map((member) => readPermittedEntryInformation(
                    ctx,
                    assn,
                    member,
                    user,
                    relevantTuples,
                    accessControlScheme,
                    {
                        selection: data.selection,
                        relevantSubentries,
                        operationContexts: data.operationContexts,
                        attributeSizeLimit,
                        noSubtypeSelection,
                        outputAttributeTypes: state.outputAttributeTypes,
                    },
                )),
        );
        const permittedEinfoIndex: Map<number, EntryInformation_information_Item[]> = new Map(
            permittedEinfos.map((einfo, i) => [ familyMembers[i].dse.id, einfo.information ]),
        );
        const familyEntries: FamilyEntries[] = convertSubtreeToFamilyInformation(
            family,
            (vertex: Vertex) => permittedEinfoIndex.get(vertex.dse.id) ?? [],
        )
            .filter((fe) => (!familySelect || familySelect.has(fe.family_class.toString())));
        const familyInfoAttr: Attribute = new Attribute(
            family_information["&id"],
            familyEntries.map((fe) => family_information.encoderFor["&Type"]!(fe, DER)),
            undefined,
        );
        permittedEntryInfo.information.push({
            attribute: familyInfoAttr,
        });
    }

    const selectedAttributes = [
        ...(data.selection?.attributes && ("select" in data.selection.attributes))
            ? data.selection.attributes.select
            : [],
        ...(data.selection?.extraAttributes && ("select" in data.selection.extraAttributes))
            ? data.selection.extraAttributes.select
            : [],
    ];
    if (permittedEntryInfo.information.length === 0) {
        const discloseOnErrorOnAnyOfTheSelectedAttributes: boolean = selectedAttributes
            .some((attr) => !accessControlScheme || acdf(
                ctx,
                accessControlScheme,
                assn,
                target,
                [ PERMISSION_CATEGORY_DISCLOSE_ON_ERROR ],
                relevantTuples,
                user,
                {
                    attributeType: attr,
                    operational: isOperationalAttributeType(ctx, attr),
                },
                bacSettings,
                true,
            ));
        // See ITU Recommendation X.511 (2016), Section 10.1.5.1.b for this part:
        if (
            permittedEntryInfo.incompleteEntry // An attribute value was not permitted to be read...
            && selectedAttributes?.length // ...and the user selected specific attributes
            && discloseOnErrorOnAnyOfTheSelectedAttributes // ...and one such attribute has DiscloseOnError permission
        ) { // We can disclose the attribute's existence via an insufficientAccessRights error.
            throw new errors.SecurityError(
                ctx.i18n.t("err:not_authz_read_selection"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        // Otherwise, we must pretend that the selected attributes simply do not exist.
        throw new errors.AttributeError(
            ctx.i18n.t("err:no_such_attribute_or_value"),
            new AttributeErrorData(
                {
                    rdnSequence: targetDN,
                },
                [
                    ...(data.selection?.attributes && ("select" in data.selection.attributes))
                        ? data.selection.attributes.select
                        : [],
                    ...(data.selection?.extraAttributes && ("select" in data.selection.extraAttributes))
                        ? data.selection.extraAttributes.select
                        : [],
                ]
                    .map((oid) => new AttributeErrorData_problems_Item(
                        AttributeProblem_noSuchAttributeOrValue,
                        oid,
                        undefined,
                    )),
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    attributeError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                state.chainingArguments.aliasDereferenced,
                undefined,
            ),
            signErrors,
        );
    }

    const modifyRights: ModifyRights = [];
    if (
        assn
        && data.modifyRightsRequest
        // We only return these rights to the user if they are authenticated.
        // TODO: Make this behavior configurable.
        && (("basicLevels" in assn.authLevel) && (assn.authLevel.basicLevels.level > 0))
        && accessControlScheme
    ) {
        const authorizedToAddEntry: boolean = permittedToDoXToThisEntry([ PERMISSION_CATEGORY_ADD ]);
        const authorizedToRemoveEntry: boolean = permittedToDoXToThisEntry([ PERMISSION_CATEGORY_REMOVE ]);
        const authorizedToRenameEntry: boolean = permittedToDoXToThisEntry([ PERMISSION_CATEGORY_RENAME ]);
        const authorizedToMoveEntry: boolean = permittedToDoXToThisEntry([ PERMISSION_CATEGORY_EXPORT ]);
        modifyRights.push(new ModifyRights_Item(
            {
                entry: null,
            },
            new Uint8ClampedArray([
                authorizedToAddEntry ? TRUE_BIT : FALSE_BIT,
                authorizedToRemoveEntry ? TRUE_BIT : FALSE_BIT,
                authorizedToRenameEntry ? TRUE_BIT : FALSE_BIT,
                authorizedToMoveEntry ? TRUE_BIT : FALSE_BIT,
            ]),
        ));
        // Return permissions for the selected attribute types, since they seem to be of interest.
        for (const attr of selectedAttributes) {
            const permittedToDoXToAttributeType = getPermittedToDoXToY({
                attributeType: attr,
            });
            const authorizedToAdd: boolean = permittedToDoXToAttributeType([ PERMISSION_CATEGORY_ADD ]);
            const authorizedToRemove: boolean = permittedToDoXToAttributeType([ PERMISSION_CATEGORY_REMOVE ]);
            const authorizedToRename: boolean = permittedToDoXToAttributeType([ PERMISSION_CATEGORY_RENAME ]);
            const authorizedToMove: boolean = permittedToDoXToAttributeType([ PERMISSION_CATEGORY_EXPORT ]);
            modifyRights.push(new ModifyRights_Item(
                {
                    attribute: attr,
                },
                new Uint8ClampedArray([
                    authorizedToAdd ? TRUE_BIT : FALSE_BIT,
                    authorizedToRemove ? TRUE_BIT : FALSE_BIT,
                    authorizedToRename ? TRUE_BIT : FALSE_BIT,
                    authorizedToMove ? TRUE_BIT : FALSE_BIT,
                ]),
            ));
        }
    }

    const signResults: boolean = (
        (data.securityParameters?.target === ProtectionRequest_signed)
        && (!assn || assn.authorizedForSignedResults)
    );
    const createAttrCertElement = data._unrecognizedExtensionsList.find((ext) => (
        (ext.tagClass === ASN1TagClass.private)
        && (ext.tagNumber === 0)
    ));
    const extensions: ASN1Element[] = [];
    const attrCertsEnabled: boolean = !!(
        ctx.config.attributeCertificateDuration
        && (ctx.config.attributeCertificateDuration > 0)
        && Number.isSafeInteger(ctx.config.attributeCertificateDuration)
    );
    if (createAttrCertElement && assn?.authorizedForSignedResults && attrCertsEnabled) {
        const ac_els = createAttrCertElement.inner.sequence
            .filter((el) => el.tagClass === ASN1TagClass.context);
        const single_use: BOOLEAN = ac_els.find((el) => el.tagNumber === 0)?.inner.boolean ?? FALSE;
        const no_assertion: BOOLEAN = ac_els.find((el) => el.tagNumber === 1)?.inner.boolean ?? FALSE;
        const attributes = permittedEntryInfo.information
            .flatMap((info) => ("attribute" in info) ? info.attribute : []);
        const attrCert: OCTET_STRING | undefined = createAttributeCertificate(
            ctx,
            targetDN,
            attributes,
            single_use,
            no_assertion,
        );
        if (attrCert) {
            const outer = new DERElement();
            outer.tagClass = ASN1TagClass.private;
            outer.construction = ASN1Construction.primitive;
            outer.tagNumber = 0;
            outer.value = attrCert;
            extensions.push(outer);
        }
    }
    const resultData: ReadResultData = new ReadResultData(
        new EntryInformation(
            {
                rdnSequence: targetDN,
            },
            !target.dse.shadow,
            permittedEntryInfo.information,
            permittedEntryInfo.discloseIncompleteEntry
                ? permittedEntryInfo.incompleteEntry
                : false,
            state.partialName,
            false,
        ),
        (data.modifyRightsRequest && accessControlScheme)
            ? modifyRights
            : undefined,
        extensions,
        createSecurityParameters(
            ctx,
            signResults,
            assn?.boundNameAndUID?.dn,
            id_opcode_read,
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        state.chainingArguments.aliasDereferenced,
        undefined,
    );
    const result: ReadResult = signResults
        ? (() => {
            const resultDataBytes = _encode_ReadResultData(resultData, DER).toBytes();
            const key = ctx.config.signing?.key;
            if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
                return {
                    unsigned: resultData,
                };
            }
            const signingResult = generateSignature(key, resultDataBytes);
            if (!signingResult) {
                return {
                    unsigned: resultData,
                };
            }
            const [ sigAlg, sigValue ] = signingResult;
            return {
                signed: new SIGNED(
                    resultData,
                    sigAlg,
                    unpackBits(sigValue),
                    undefined,
                    undefined,
                ),
            };
        })()
        : {
            unsigned: resultData,
        };

    const signDSPResult: boolean = (
        (state.chainingArguments.securityParameters?.target === ProtectionRequest_signed)
        && (!assn || assn.authorizedForSignedResults)
    );
    return {
        result: {
            unsigned: new ChainedResult(
                new ChainingResults(
                    state.chainingResults.info,
                    state.chainingResults.crossReferences,
                    createSecurityParameters(
                        ctx,
                        signDSPResult,
                        assn?.boundNameAndUID?.dn,
                        id_opcode_read,
                    ),
                    state.chainingResults.alreadySearched,
                ),
                _encode_ReadResult(result, DER),
            ),
        },
        stats: {
            request: failover(() => ({
                operationCode: codeToString(id_opcode_read),
                ...getStatisticsFromCommonArguments(data),
                targetNameLength: targetDN.length,
                eis: data.selection
                    ? getEntryInformationSelectionStatistics(data.selection)
                    : undefined,
                modifyRightsRequest: data.modifyRightsRequest,
            }), undefined),
        },
    };
}

export default read;
