import { Buffer } from "node:buffer";
import type { Connection, Context, IndexableOID } from "../../types.js";
import {
    DER,
    _encodeNull,
    _encodePrintableString,
    _encodeObjectIdentifier,
    _encodeUTF8String,
} from "@wildboar/asn1/functional";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../utils/destringifyDN.js";
import {
    EstablishOperationalBindingArgumentData,
    _encode_EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    _encode_EstablishOperationalBindingArgument,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    Validity,
} from "@wildboar/x500/OperationalBindingManagement";
import { AccessPoint, _encode_AccessPoint } from "@wildboar/x500/DistributedOperations";
import { PresentationAddress } from "@wildboar/x500/SelectedAttributeTypes";
import {
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import { addSeconds } from "date-fns";
import { ASN1Construction, ASN1Element, ASN1TagClass, DERElement, OBJECT_IDENTIFIER, ObjectIdentifier, TRUE, unpackBits } from "@wildboar/asn1";
import { randomBytes, sign, createSign } from "node:crypto";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    establishOperationalBinding,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    SIGNED,
} from "@wildboar/x500/AuthenticationFramework";
import { getAlgorithmInfoFromKey } from "../../crypto/getAlgorithmInfoFromKey.js";
import {
    EstablishOperationalBindingArgument,
} from "@wildboar/x500/OperationalBindingManagement";
import {
    _decode_EstablishOperationalBindingResult,
} from "@wildboar/x500/OperationalBindingManagement";
import printError from "../../printers/Error_.js";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import { uriToNSAP } from "@wildboar/x500";
import { shadowOperationalBinding } from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    AttributeSelection,
    UnitOfReplication,
    UnitOfReplication_supplyContexts,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    UpdateMode,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    ShadowingAgreementInfo,
    _encode_ShadowingAgreementInfo,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { AreaSpecification } from "@wildboar/x500/DirectoryShadowAbstractService";
import { Knowledge, Knowledge_knowledgeType } from "@wildboar/x500/DirectoryShadowAbstractService";
import { PeriodicStrategy, SchedulingParameters } from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    ChopSpecification_specificExclusions_Item,
} from "@wildboar/x500/InformationFramework";
import { lexRefinement } from "../../parsers/parseRefinement.js";
import { ClassAttributeSelection } from "@wildboar/x500/DirectoryShadowAbstractService";
import { contexts } from "@wildboar/x500";
import {
    TypeAndContextAssertion,
    ContextSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ContextAssertion,
    SubtreeSpecification
} from "@wildboar/x500/InformationFramework";

const { languageContext, localeContext } = contexts;

export
async function do_shadow (
    ctx: Context,
    conn: Connection,
    argv: any,
    variant: "supply" | "consume",
): Promise<void> {
    if (!conn.certPath || !conn.signingKey) {
        throw new Error("You must provide a certification path and signing key in the configuration file.");
    }
    if (!conn.called_ae_title) {
        throw new Error("You must associate an AE-Title with the DSA in the configuration file.");
    }
    if (!Array.isArray(argv["naddr"]) || (argv["naddr"].length === 0)) {
        throw new Error("You must specify at least one network address for the DSA with which the SOB should be established.");
    }
    const alg_info = getAlgorithmInfoFromKey(conn.signingKey);
    if (!alg_info) {
        throw new Error("Could not determine a signing algorithm for your private key.");
    }
    const [ sig_alg_id, hash_str ] = alg_info;
    const cp: DistinguishedName = destringifyDN(ctx, argv.cp);
    const base: DistinguishedName | undefined = argv["base"]
        ? destringifyDN(ctx, argv["base"])
        : undefined;
    const spex: ChopSpecification_specificExclusions_Item[] = [];
    for (const chop of argv["chop-before"] ?? []) {
        spex.push({ chopBefore: destringifyDN(ctx, chop) });
    }
    for (const chop of argv["chop-after"] ?? []) {
        spex.push({ chopAfter: destringifyDN(ctx, chop) });
    }
    const refinement = argv.refinement
        ? lexRefinement(argv.refinement).refinement
        : undefined;
    const subtree = new SubtreeSpecification(
        base,
        spex.length ? spex : undefined,
        argv["min"],
        argv["max"],
        refinement,
    );
    const area_spec = new AreaSpecification(
        cp,
        subtree,
    );
    const attr_selection: AttributeSelection = [];
    for (const sel of argv["select"] ?? []) {
        // 'person:include:givenName,surname', ':exclude:ssn', 'organization:all:'
        const [ klass, choice, attrs ] = sel.split(":");
        const oc: OBJECT_IDENTIFIER | undefined = (klass.length > 0)
            ? ctx.objectClasses.get(klass)?.id ?? ObjectIdentifier.fromString(klass)
            : undefined;

        const attr_oids: OBJECT_IDENTIFIER[] = [];
        for (const attr of attrs.split(",")) {
            attr_oids.push(ctx.objectClasses.get(attr)?.id ?? ObjectIdentifier.fromString(attr));
        }

        switch (choice?.toLowerCase()) {
            case ("all"): {
                attr_selection.push(new ClassAttributeSelection(
                    oc,
                    { allAttributes: null },
                ));
                break;
            }
            case ("include"): {
                attr_selection.push(new ClassAttributeSelection(
                    oc,
                    { include: attr_oids },
                ));
                break;
            }
            case ("exclude"): {
                attr_selection.push(new ClassAttributeSelection(
                    oc,
                    { exclude: attr_oids },
                ));
                break;
            }
            default: {
                throw new Error(
                    "Invalid attribute selection syntax: unrecognized choice. Must be 'all', 'include', or 'exclude'.");
            }
        }
    }
    // If the user specifies no selections, we replicate all user attributes.
    if (attr_selection.length === 0) {
        attr_selection.push(new ClassAttributeSelection(
            undefined,
            { allAttributes: null },
        ));
    }
    let master_knowledge: boolean = false;
    let shadow_knowledge: boolean = false;
    if (argv["master-knowledge"]) {
        master_knowledge = true;
    }
    else if (argv["shadow-knowledge"]) {
        shadow_knowledge = true;
    }
    else if (argv["both-knowledge"]) {
        master_knowledge = true;
        shadow_knowledge = true;
    }
    let knowledge_type: Knowledge_knowledgeType = (master_knowledge && shadow_knowledge)
        ? Knowledge_knowledgeType.both
        : Knowledge_knowledgeType.master;
    if (!master_knowledge && shadow_knowledge) {
        knowledge_type = Knowledge_knowledgeType.shadow;
    }
    const knowledge = new Knowledge(
        knowledge_type,
        argv["ext-knowledge"],
    );
    let context_selection: ContextSelection | undefined;
    if (argv["all-contexts"]) {
        context_selection = { allContexts: null };
    }
    else if (argv["select-context"]) {
        const tacas: TypeAndContextAssertion[] = [];
        // TODO: Abstract context parsing.
        for (const sc of argv["select-context"]) {
            const end_of_attr = sc.indexOf(":");
            if (end_of_attr <= 0) {
                throw new Error("Invalid select-context syntax. It should be 'attr:context=value,context=value'. No end of attribute.");
            }
            const attr = sc.slice(0, end_of_attr);
            const context_and_value = sc.slice(end_of_attr + 1);
            const attr_oid = ctx.attributes.get(attr)?.id ?? ObjectIdentifier.fromString(attr);
            const valuesByType: Map<IndexableOID, ASN1Element[]> = new Map();
            const end_of_context_type = context_and_value.indexOf("=");
            if (end_of_context_type <= 0) {
                throw new Error("Invalid select-context syntax. It should be 'attr:context=value,context=value'. No end of context type.");
            }
            const context_type = context_and_value.slice(0, end_of_context_type);
            const context_value = context_and_value.slice(end_of_context_type + 1);
            const ctxt_oid = ctx.contextTypes.get(context_type)?.id ?? ObjectIdentifier.fromString(context_type);
            switch (ctxt_oid.toString()) {
                case (languageContext["&id"].toString()): {
                    const context_values = valuesByType.get(ctxt_oid.toString()) ?? [];
                    context_values.push(_encodePrintableString(context_value, DER));
                    valuesByType.set(ctxt_oid.toString(), context_values);
                    break;
                }
                case (localeContext["&id"].toString()): {
                    const context_values = valuesByType.get(ctxt_oid.toString()) ?? [];
                    try {
                        const encoded_value = ObjectIdentifier.fromString(context_value);
                        context_values.push(_encodeObjectIdentifier(encoded_value, DER));
                    } catch {
                        context_values.push(_encodeUTF8String(context_value, DER));
                    }
                    valuesByType.set(ctxt_oid.toString(), context_values);
                    break;
                }
                default: {
                    throw new Error("Invalid select-context syntax. Only languageContext and localeContext supported.");
                }
            }
            const context_assertions = Array.from(valuesByType.entries())
                .map(([ oid_str, values ]) => new ContextAssertion(
                    ObjectIdentifier.fromString(oid_str),
                    values,
                ));
            tacas.push(new TypeAndContextAssertion(
                attr_oid,
                {
                    all: context_assertions,
                },
            ));
        }
        context_selection = { selectedContexts: tacas };
    }
    let supply_contexts: UnitOfReplication_supplyContexts | undefined = undefined;
    if (argv["supply-all-contexts"]) {
        supply_contexts = { allContexts: null };
    }
    else if (argv["supply-context"]) {
        const selected: OBJECT_IDENTIFIER[] = [];
        for (const sc of argv["supply-context"]) {
            const ctxt_oid = ctx.contextTypes.get(sc)?.id ?? ObjectIdentifier.fromString(sc);
            selected.push(ctxt_oid);
        }
        supply_contexts = { selectedContexts: selected };
    }
    const area = new UnitOfReplication(
        area_spec,
        attr_selection,
        knowledge,
        argv.subordinates,
        context_selection,
        supply_contexts,
    );
    const periodic: PeriodicStrategy | undefined = (argv["window-size"] && argv["update-interval"])
        ? new PeriodicStrategy(
            argv["begin-time"]
                ? new Date(argv["begin-time"])
                : undefined,
            argv["window-size"],
            argv["update-interval"],
        )
        : undefined;
    const schedule = new SchedulingParameters(
        periodic,
        argv["other-times"],
    );
    if (
        !schedule.periodic
        && !schedule.othertimes
        && (
            !argv["supplier-initiated"]
            || !argv["on-change"]
        )
    ) {
        throw new Error("No update mode specified.")
    }
    const updateMode: UpdateMode = (argv["supplier-initiated"])
        ? {
            supplierInitiated: argv["on-change"]
                ? {
                    onChange: TRUE, // TODO: Document that the meaning of false is undocumented here.
                }
                : {
                    scheduled: schedule,
                },
        }
        : {
            consumerInitiated: schedule,
        };
    const master = argv["master-ae-title"]
        ? new AccessPoint(
            {
                rdnSequence: destringifyDN(ctx, argv["master-ae-title"]),
            },
            new PresentationAddress(
                (typeof argv["master-p-selector"] === "string")
                    ? Buffer.from(argv["p-selector"], "hex")
                    : undefined,
                (typeof argv["master-s-selector"] === "string")
                    ? Buffer.from(argv["s-selector"], "hex")
                    : undefined,
                (typeof argv["master-t-selector"] === "string")
                    ? Buffer.from(argv["t-selector"], "hex")
                    : undefined,
                argv["master-naddr"].map((naddr: string) => uriToNSAP(naddr, naddr.toLowerCase().startsWith("itot"))),
            ),
            undefined, // Protocol information unsupported.
        )
        : undefined;
    const agreement = new ShadowingAgreementInfo(
        area,
        updateMode,
        master,
        argv["secondary-shadows"],
    );

    const relayTo = new AccessPoint(
        {
            rdnSequence: destringifyDN(ctx, argv["ae-title"]),
        },
        new PresentationAddress(
            (typeof argv["p-selector"] === "string")
                ? Buffer.from(argv["p-selector"], "hex")
                : undefined,
            (typeof argv["s-selector"] === "string")
                ? Buffer.from(argv["s-selector"], "hex")
                : undefined,
            (typeof argv["t-selector"] === "string")
                ? Buffer.from(argv["t-selector"], "hex")
                : undefined,
            argv["naddr"].map((naddr: string) => uriToNSAP(naddr, naddr.toLowerCase().startsWith("itot"))),
        ),
        undefined, // Protocol information unsupported.
    );
    const relayToElement = _encode_AccessPoint(relayTo, DER);
    const relayToOuterElement = new DERElement();
    relayToOuterElement.tagClass = ASN1TagClass.private;
    relayToOuterElement.construction = ASN1Construction.constructed;
    relayToOuterElement.tagNumber = 0;
    relayToOuterElement.value = relayToElement.toBytes();

    const validity = new Validity(
        argv["valid-from"]
            ? { time: { generalizedTime: new Date(argv["valid-from"]) } }
            : { now: null },
        argv["valid-until"]
            ? { time: { generalizedTime: new Date(argv["valid-until"]) } }
            : { explicitTermination: null },
    );
    const sp = new SecurityParameters(
        conn.certPath,
        conn.called_ae_title,
        {
            generalizedTime: addSeconds(new Date(), 60),
        },
        unpackBits(randomBytes(4)),
        ProtectionRequest_signed,
        establishOperationalBinding["&operationCode"]!,
        ErrorProtectionRequest_signed,
    );
    const data = new EstablishOperationalBindingArgumentData(
        shadowOperationalBinding["&id"]!,
        undefined,
        /* This access point will be replaced automatically by the bound DSA. */
        new AccessPoint(
            {
                rdnSequence: [],
            },
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                [],
            ),
        ),
        (variant === "supply")
            ? {
                roleA_initiates: _encodeNull(null, DER),
            }
            : {
                roleB_initiates: _encodeNull(null, DER),
            },
        _encode_ShadowingAgreementInfo(agreement, DER),
        validity,
        sp,
        [ // This allows Meerkat DSA's relayed operational bindings.
            relayToOuterElement,
        ],
    );
    const data_bytes = _encode_EstablishOperationalBindingArgumentData(data, DER).toBytes();
    let arg!: EstablishOperationalBindingArgument;
    if (hash_str) {
        const signer = createSign(hash_str);
        signer.update(data_bytes);
        const signature = signer.sign(conn.signingKey);
        arg = {
            signed: new SIGNED(
                data,
                sig_alg_id,
                unpackBits(signature),
                undefined,
                undefined,
            ),
        };
    } else {
        const signature = sign(null, data_bytes, conn.signingKey);
        arg = {
            signed: new SIGNED(
                data,
                sig_alg_id,
                unpackBits(signature),
                undefined,
                undefined,
            ),
        };
    }
    const outcome = await conn.writeOperation({
        opCode: establishOperationalBinding["&operationCode"]!,
        argument: _encode_EstablishOperationalBindingArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result = _decode_EstablishOperationalBindingResult(outcome.result);
    const resData = getOptionallyProtectedValue(result);
    if (resData.bindingID) {
        ctx.log.info(`Operational binding established with ID ${resData.bindingID.identifier}`);
    } else {
        ctx.log.info("Operational binding established.");
    }
}

export default do_shadow;
