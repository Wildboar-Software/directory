import type { Connection, Context } from "../../types";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import destringifyDN from "../../utils/destringifyDN";
import {
    NonSpecificHierarchicalAgreement,
    _encode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import {
    NHOBSubordinateToSuperior,
    _encode_NHOBSubordinateToSuperior,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NHOBSubordinateToSuperior.ta";
import {
    EstablishOperationalBindingArgumentData,
    _encode_EstablishOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgumentData.ta";
import {
    _encode_EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import {
    Validity,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/Validity.ta";
import {
    nonSpecificHierarchicalOperationalBinding,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/nonSpecificHierarchicalOperationalBinding.oa";
import { AccessPoint, _encode_AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { PresentationAddress } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/PresentationAddress.ta";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";
import { addSeconds } from "date-fns";
import { ASN1Construction, ASN1TagClass, DERElement, unpackBits } from "asn1-ts";
import { randomBytes, sign, createSign } from "crypto";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import {
    establishOperationalBinding,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/establishOperationalBinding.oa";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { getAlgorithmInfoFromKey } from "../../crypto/getAlgorithmInfoFromKey";
import {
    EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import {
    _decode_EstablishOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResult.ta";
import printError from "../../printers/Error_";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { uriToNSAP } from "@wildboar/x500";

export
async function do_join_nssr (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    if (!conn.certPath || !conn.signingKey) {
        throw new Error("You must provide a certification path and signing key in the configuration file.");
    }
    if (!conn.called_ae_title) {
        throw new Error("You must associate an AE-Title with the DSA in the configuration file.");
    }
    if (!Array.isArray(argv["naddr"]) || (argv["naddr"].length === 0)) {
        throw new Error("You must specify at least one network address for the DSA with which the NHOB should be established.");
    }
    const alg_info = getAlgorithmInfoFromKey(conn.signingKey);
    if (!alg_info) {
        throw new Error("Could not determine a signing algorithm for your private key.");
    }
    const [ sig_alg_id, hash_str ] = alg_info;
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const agreement = new NonSpecificHierarchicalAgreement(objectName);
    const sub2sup = new NHOBSubordinateToSuperior(
        [], // There is no need to bother with this, since the DSA will replace it anyway.
        undefined,
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
        nonSpecificHierarchicalOperationalBinding["&id"]!,
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
        {
            roleB_initiates: _encode_NHOBSubordinateToSuperior(sub2sup, DER),
        },
        _encode_NonSpecificHierarchicalAgreement(agreement, DER),
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

export default do_join_nssr;
