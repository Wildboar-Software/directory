import type { Context, IndexableOID } from "../types";
import type {
    EntryInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import type {
    EntryInformation_information_Item
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import type {
    JoinAttPair,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/JoinAttPair.ta";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type { ASN1Element } from "asn1-ts";

function getApplicableValues (
    attr: Attribute,
    soughtContexts: Set<IndexableOID> | null,
): ASN1Element[] {
    return soughtContexts
        ? attr.valuesWithContext
            ?.filter((vwc) => vwc.contextList
                .some((c) => soughtContexts.has(c.contextType.toString())))
            .map((vwc) => vwc.value) ?? []
        : [
            ...attr.values,
            ...(attr.valuesWithContext?.map((vwc) => vwc.value) ?? [])
        ];
}

// JoinAttPair ::= SEQUENCE {
//   baseAtt      AttributeType,
//   joinAtt      AttributeType,
//   joinContext  SEQUENCE SIZE (1..MAX) OF JoinContextType OPTIONAL,
//   ... }

// JoinContextType ::= CONTEXT.&id({SupportedContexts})
export
function canJoin (
    ctx: Context,
    baseEntry: EntryInformation,
    joinEntry: EntryInformation,
    jap: JoinAttPair,
): boolean {
    const BASE_OID: string = jap.baseAtt.toString();
    const JOIN_OID: string = jap.joinAtt.toString();
    const baseSpec = ctx.attributes.get(BASE_OID);
    if (!baseSpec) {
        return false;
    }
    const matcher = baseSpec.equalityMatcher;
    if (!matcher) {
        return false;
    }
    const soughtBaseAttribute: EntryInformation_information_Item | undefined = baseEntry
        .information
        ?.find((info) => (
            ("attribute" in info)
            && (info.attribute.type_.toString() === BASE_OID)
        ));
    const soughtJoinAttribute: EntryInformation_information_Item | undefined = joinEntry
        .information
        ?.find((info) => (
            ("attribute" in info)
            && (info.attribute.type_.toString() === JOIN_OID)
        ));
    if (
        !soughtBaseAttribute
        || !soughtJoinAttribute
        || (!("attribute" in soughtBaseAttribute)) // Just to keep TypeScript happy.
        || (!("attribute" in soughtJoinAttribute)) // Just to keep TypeScript happy.
    ) {
        return false;
    }
    const soughtContexts: Set<IndexableOID> | null = jap.joinContext
        ? new Set(jap.joinContext.map((jc) => jc.toString()))
        : null;
    const baseAttr = soughtBaseAttribute.attribute;
    const joinAttr = soughtJoinAttribute.attribute;
    const baseValues = getApplicableValues(baseAttr, soughtContexts);
    const joinValues = getApplicableValues(joinAttr, soughtContexts);
    return baseValues.some((bv) => joinValues.some((jv) => matcher(bv, jv)));
}

export default canJoin;
