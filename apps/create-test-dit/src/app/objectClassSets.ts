import type { OBJECT_IDENTIFIER } from "asn1-ts";
import * as oc from "@wildboar/x500/src/lib/collections/objectClasses";
import {
    dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicObject.oa";
import {
    eduPerson,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPerson.oa";
import {
    pgpKeyInfo,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyInfo.oa";
import {
    posixAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixAccount.oa";
import {
    shadowAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowAccount.oa";
import {
    uidObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/uidObject.oa";
import {
    simpleSecurityObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/simpleSecurityObject.oa";
import {
    labeledURIObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/labeledURIObject.oa";
import {
    openLDAPdisplayableObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPdisplayableObject.oa";
import {
    qmailUser,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUser.oa";
import {
    sambaAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/sambaAccount.oa";
import {
    sambaSamAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSamAccount.oa";
import {
    mhs_user,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/mhs-user.oa";
import {
    edi_user,
} from "@wildboar/x400/src/lib/modules/EDIMUseOfDirectory/edi-user.oa";
import {
    bootableDevice,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootableDevice.oa";
import {
    ieee802Device,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ieee802Device.oa";
import {
    ipHost,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipHost.oa";

export
const commonAuxiliaryObjectClasses: OBJECT_IDENTIFIER[] = [
    oc.integrityInfo["&id"],
    oc.child["&id"],
    oc.pmiUser["&id"],
    oc.pmiAA["&id"],
    oc.pmiSOA["&id"],
    oc.attCertCRLDistributionPt["&id"],
    oc.pmiDelegationPath["&id"],
    oc.privilegePolicy["&id"],
    oc.protectedPrivilegePolicy["&id"],
    oc.pkiUser["&id"],
    oc.pkiCA["&id"],
    oc.deltaCRL["&id"],
    oc.cpCps["&id"],
    oc.pkiCertPath["&id"],
    oc.strongAuthenticationUser["&id"],
    oc.userSecurityInformation["&id"],
    oc.userPwdClass["&id"],
    oc.certificationAuthority["&id"],
    oc.certificationAuthority_V2["&id"],
    dynamicObject["&id"],
    eduPerson["&id"],
    pgpKeyInfo["&id"],
    posixAccount["&id"],
    shadowAccount["&id"],
    uidObject["&id"],
    simpleSecurityObject["&id"],
    labeledURIObject["&id"],
    openLDAPdisplayableObject["&id"],
    qmailUser["&id"],
    sambaAccount["&id"],
    sambaSamAccount["&id"],
    mhs_user["&id"],
    edi_user["&id"],
];

export
const deviceAuxiliaryObjectClasses: OBJECT_IDENTIFIER[] = [
    bootableDevice["&id"],
    ieee802Device["&id"],
    ipHost["&id"],
];