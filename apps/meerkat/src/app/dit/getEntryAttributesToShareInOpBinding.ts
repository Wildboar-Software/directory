import { Context, Vertex } from "../types/index.js";
import { Attribute } from "@wildboar/pki-stub";
import { attributes as x500at } from "@wildboar/x500";
import {
    entryUUID,
} from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa.js";
import {
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa.js";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa.js";
import {
    isMemberOf,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/isMemberOf.oa.js";
import { readAttributes } from "../database/entry/readAttributes.js";
import {
    EntryInformationSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import { TRUE } from "@wildboar/asn1";

export
async function getEntryAttributesToShareInOpBinding (ctx: Context, vertex: Vertex): Promise<Attribute[]> {
    const {
        userAttributes,
        operationalAttributes,
    } = await readAttributes(ctx, vertex, {
        selection: new EntryInformationSelection(
            {
                select: [
                    x500at.commonName["&id"],
                    x500at.pwdAttribute["&id"],
                    x500at.objectClass["&id"],
                    isMemberOf["&id"],
                    x500at.clearance["&id"],
                ],
            },
            undefined,
            {
                select: [
                    x500at.accessControlScheme["&id"],
                    x500at.administrativeRole["&id"],
                    x500at.createTimestamp["&id"],
                    x500at.entryACI["&id"],
                    x500at.governingStructureRule["&id"],
                    x500at.modifyTimestamp["&id"],
                    x500at.structuralObjectClass["&id"],
                    x500at.subentryACI["&id"],
                    x500at.subschemaTimestamp["&id"],
                    entryUUID["&id"],
                    entryDN["&id"],
                    superiorUUID["&id"],
                ],
            },
            {
                allContexts: null,
            },
            TRUE,
            undefined,
        ),
    });
    return [
        ...userAttributes,
        ...operationalAttributes,
    ];
}
