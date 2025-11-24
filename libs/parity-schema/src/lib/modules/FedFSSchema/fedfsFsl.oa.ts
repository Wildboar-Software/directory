/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    abstract /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { top } from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
import { fedfsAnnotation } from '../FedFSSchema/fedfsAnnotation.oa';
import { fedfsDescr } from '../FedFSSchema/fedfsDescr.oa';
import { fedfsFslUuid } from '../FedFSSchema/fedfsFslUuid.oa';
import { fedfsFsnUuid } from '../FedFSSchema/fedfsFsnUuid.oa';


/* START_OF_SYMBOL_DEFINITION fedfsFsl */
/**
 * @summary fedfsFsl
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsFsl OBJECT-CLASS ::= {
 *     SUBCLASS OF     {top}
 *     KIND            abstract
 *     MUST CONTAIN    {fedfsFslUuid | fedfsFsnUuid}
 *     MAY CONTAIN     {fedfsAnnotation | fedfsDescr}
 *     LDAP-NAME       {"fedfsFsl"}
 *     LDAP-DESC       "A physical location of a fileset"
 *     ID              { daniel-ellard 1 1003 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const fedfsFsl: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [top] /* OBJECT_FIELD_SETTING */,
    '&kind': abstract /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        fedfsFslUuid,
        fedfsFsnUuid,
    ] /* OBJECT_FIELD_SETTING */,
    '&OptionalAttributes': [
        fedfsAnnotation,
        fedfsDescr,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsFsl'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'A physical location of a fileset' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 1003],
        daniel_ellard
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsFsl */

/* eslint-enable */
