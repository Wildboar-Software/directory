import type { Vertex } from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    commonName,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/commonName.oa";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import {
    AttributeTypeAndValue,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import {
    prescriptiveACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/prescriptiveACI.oa";
import {
    entryACI,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/entryACI.oa";
import {
    contextAssertionDefaults,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionDefaults.oa";
import {
    searchRules,
} from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";
import {
    _encode_TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import {
    _encode_SearchRuleDescription,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import { pwdAttribute } from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAttribute.oa";
import { DER } from "asn1-ts/dist/node/functional";

/**
 * @summary Reads a specific subset of attributes from a subentry
 * @description
 *
 * This function reads a specific subset of attributes from a subentry. It's
 * purpose is for constructing subentry information when establishing
 * hierarchical operational bindings.
 *
 * @param subentry The subentry vertex whose attributes are to be read
 * @returns An array of attributes from the subentry
 *
 * @function
 */
export
function getAttributesFromSubentry (subentry: Vertex): Attribute[] {
    if (!subentry.dse.subentry) {
        return [];
    }
    const cn: AttributeTypeAndValue | undefined = subentry.dse.rdn
        .find((atav) => (atav.type_.isEqualTo(commonName!["&id"])));
    const subentryAttributes: Attribute[] = [
        new Attribute(
            subtreeSpecification["&id"],
            subentry.dse.subentry.subtreeSpecification
                .map((sts) => subtreeSpecification.encoderFor["&Type"]!(sts, DER)),
            undefined,
        ),
    ];
    if (cn) {
        subentryAttributes.push(new Attribute(
            commonName["&id"],
            [cn.value],
            undefined,
        ));
    }
    if (subentry.dse.entryACI) {
        subentryAttributes.push(new Attribute(
            entryACI["&id"],
            subentry.dse.entryACI
                .map((aci) => entryACI.encoderFor["&Type"]!(aci, DER)),
            undefined,
        ));
    }
    if (subentry.dse.subentry.prescriptiveACI) {
        subentryAttributes.push(new Attribute(
            prescriptiveACI["&id"],
            subentry.dse.subentry.prescriptiveACI
                .map((aci) => prescriptiveACI.encoderFor["&Type"]!(aci, DER)),
            undefined,
        ));
    }
    if (subentry.dse.subentry.collectiveAttributes) {
        subentryAttributes.push(...subentry.dse.subentry.collectiveAttributes);
    }
    if (subentry.dse.subentry.contextAssertionDefaults) {
        subentryAttributes.push(new Attribute(
            contextAssertionDefaults["&id"],
            subentry.dse.subentry.contextAssertionDefaults
                .map((cad) => _encode_TypeAndContextAssertion(cad, DER)),
            undefined,
        ));
    }

    if (subentry.dse.subentry.pwdAttribute) {
        subentryAttributes.push(new Attribute(
            pwdAttribute["&id"],
            [
                pwdAttribute.encoderFor["&Type"]!(subentry.dse.subentry.pwdAttribute, DER),
            ],
            undefined,
        ));
    }
    return subentryAttributes;
}

export default getAttributesFromSubentry;
