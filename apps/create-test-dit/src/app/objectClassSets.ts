import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { objectClasses as oc } from "@wildboar/x500";
import {
    dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicObject.oa.js";
import {
    eduPerson,
} from "@wildboar/parity-schema/src/lib/modules/EduPersonSchema/eduPerson.oa.js";
import {
    pgpKeyInfo,
} from "@wildboar/parity-schema/src/lib/modules/LegacyPGPFramework/pgpKeyInfo.oa.js";
import {
    posixAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/posixAccount.oa.js";
import {
    shadowAccount,
} from "@wildboar/parity-schema/src/lib/modules/NIS/shadowAccount.oa.js";
import {
    uidObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/uidObject.oa.js";
import {
    simpleSecurityObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/simpleSecurityObject.oa.js";
import {
    labeledURIObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAPCoreSchema/labeledURIObject.oa.js";
import {
    openLDAPdisplayableObject,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/openLDAPdisplayableObject.oa.js";
import {
    qmailUser,
} from "@wildboar/parity-schema/src/lib/modules/QMailSchema/qmailUser.oa.js";
import {
    sambaAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaSchema/sambaAccount.oa.js";
import {
    sambaSamAccount,
} from "@wildboar/parity-schema/src/lib/modules/SambaV3Schema/sambaSamAccount.oa.js";
import {
    mhs_user,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";
import {
    edi_user,
} from "@wildboar/x400/EDIMUseOfDirectory";
import {
    bootableDevice,
} from "@wildboar/parity-schema/src/lib/modules/NIS/bootableDevice.oa.js";
import {
    ieee802Device,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ieee802Device.oa.js";
import {
    ipHost,
} from "@wildboar/parity-schema/src/lib/modules/NIS/ipHost.oa.js";
import {
    naturalPerson,
} from "@wildboar/pkcs/PKCS-9";

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
    naturalPerson["&id"],
];

export
const deviceAuxiliaryObjectClasses: OBJECT_IDENTIFIER[] = [
    bootableDevice["&id"],
    ieee802Device["&id"],
    ipHost["&id"],
];
