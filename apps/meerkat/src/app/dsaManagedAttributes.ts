import type { IndexableOID } from "./types";
import { createTimestamp } from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";
import { modifyTimestamp } from "@wildboar/x500/src/lib/modules/InformationFramework/modifyTimestamp.oa";
import { creatorsName } from "@wildboar/x500/src/lib/modules/InformationFramework/creatorsName.oa";
import { modifiersName } from "@wildboar/x500/src/lib/modules/InformationFramework/modifiersName.oa";
import { hasSubordinates } from "@wildboar/x500/src/lib/modules/InformationFramework/hasSubordinates.oa";
import { subschemaSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/subschemaSubentryList.oa";
import { accessControlSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentryList.oa";
import { collectiveAttributeSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentryList.oa";
import { contextDefaultSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/contextDefaultSubentryList.oa";
import { serviceAdminSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentryList.oa";
import { pwdAdminSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentryList.oa";
import { hierarchyLevel } from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyLevel.oa";
import { hierarchyBelow } from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyBelow.oa";
// import { hierarchyParent } from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyParent.oa";
import { hierarchyTop } from "@wildboar/x500/src/lib/modules/InformationFramework/hierarchyTop.oa";

// TODO: Get rid of this.
export
const dsaManagedAttributes: Set<IndexableOID> = new Set<IndexableOID>([
    createTimestamp["&id"].toString(),
    modifyTimestamp["&id"].toString(),
    creatorsName["&id"].toString(),
    modifiersName["&id"].toString(),
    hasSubordinates["&id"].toString(),
    subschemaSubentryList["&id"].toString(),
    accessControlSubentryList["&id"].toString(),
    collectiveAttributeSubentryList["&id"].toString(),
    contextDefaultSubentryList["&id"].toString(),
    serviceAdminSubentryList["&id"].toString(),
    pwdAdminSubentryList["&id"].toString(),
    hierarchyLevel["&id"].toString(),
    hierarchyBelow["&id"].toString(),
    /**
     * Parent is the only non-DSA-managed attribute type among the hierarchical
     * ones that users can modify. In fact, the addition of this attribute is
     * how hierarchical groups are created. All of the others are managed by
     * the DSA.
     */
    // hierarchyParent["&id"].toString(),
    hierarchyTop["&id"].toString(),
]);

export default dsaManagedAttributes;
