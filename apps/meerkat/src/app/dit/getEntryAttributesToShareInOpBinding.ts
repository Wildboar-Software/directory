import { Context, Vertex } from "@wildboar/meerkat-types";
import { Attribute } from "@wildboar/pki-stub/src/lib/modules/InformationFramework/Attribute.ta";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import {
    entryUUID,
} from "@wildboar/parity-schema/src/lib/modules/UUID/entryUUID.oa";
import {
    entryDN,
} from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa";
import {
    isMemberOf,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/isMemberOf.oa";
import { readAttributes } from "../database/entry/readAttributes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import { TRUE } from "asn1-ts";

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
                    x500at.dseType["&id"],
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
