/* eslint-disable */
import type { OBJECT_CLASS } from '@wildboar/x500/InformationFramework';
import {
    structural /* IMPORTED_SHORT_ENUMERATION_ITEM */,
} from '@wildboar/x500/InformationFramework';
import { ObjectIdentifier as _OID } from '@wildboar/asn1';
import { daniel_ellard } from '../FedFSSchema/daniel-ellard.va';
import { fedfsFsl } from '../FedFSSchema/fedfsFsl.oa';
import { fedfsNfsClassChange } from '../FedFSSchema/fedfsNfsClassChange.oa';
import { fedfsNfsClassFileid } from '../FedFSSchema/fedfsNfsClassFileid.oa';
import { fedfsNfsClassHandle } from '../FedFSSchema/fedfsNfsClassHandle.oa';
import { fedfsNfsClassReaddir } from '../FedFSSchema/fedfsNfsClassReaddir.oa';
import { fedfsNfsClassSimul } from '../FedFSSchema/fedfsNfsClassSimul.oa';
import { fedfsNfsClassWritever } from '../FedFSSchema/fedfsNfsClassWritever.oa';
import { fedfsNfsCurrency } from '../FedFSSchema/fedfsNfsCurrency.oa';
import { fedfsNfsGenFlagGoing } from '../FedFSSchema/fedfsNfsGenFlagGoing.oa';
import { fedfsNfsGenFlagSplit } from '../FedFSSchema/fedfsNfsGenFlagSplit.oa';
import { fedfsNfsGenFlagWritable } from '../FedFSSchema/fedfsNfsGenFlagWritable.oa';
import { fedfsNfsReadOrder } from '../FedFSSchema/fedfsNfsReadOrder.oa';
import { fedfsNfsReadRank } from '../FedFSSchema/fedfsNfsReadRank.oa';
import { fedfsNfsTransFlagRdma } from '../FedFSSchema/fedfsNfsTransFlagRdma.oa';
import { fedfsNfsURI } from '../FedFSSchema/fedfsNfsURI.oa';
import { fedfsNfsValidFor } from '../FedFSSchema/fedfsNfsValidFor.oa';
import { fedfsNfsVarSub } from '../FedFSSchema/fedfsNfsVarSub.oa';
import { fedfsNfsWriteOrder } from '../FedFSSchema/fedfsNfsWriteOrder.oa';
import { fedfsNfsWriteRank } from '../FedFSSchema/fedfsNfsWriteRank.oa';


/* START_OF_SYMBOL_DEFINITION fedfsNfsFsl */
/**
 * @summary fedfsNfsFsl
 * @description
 *
 * ### ASN.1 Definition:
 *
 * ```asn1
 * fedfsNfsFsl OBJECT-CLASS ::= {
 *     SUBCLASS OF     {fedfsFsl}
 *     KIND            structural
 *     MUST CONTAIN    {
 *         fedfsNfsURI
 *         | fedfsNfsCurrency
 *         | fedfsNfsGenFlagWritable
 *         | fedfsNfsGenFlagGoing
 *         | fedfsNfsGenFlagSplit
 *         | fedfsNfsTransFlagRdma
 *         | fedfsNfsClassSimul
 *         | fedfsNfsClassHandle
 *         | fedfsNfsClassFileid
 *         | fedfsNfsClassWritever
 *         | fedfsNfsClassChange
 *         | fedfsNfsClassReaddir
 *         | fedfsNfsReadRank
 *         | fedfsNfsReadOrder
 *         | fedfsNfsWriteRank
 *         | fedfsNfsWriteOrder
 *         | fedfsNfsVarSub
 *         | fedfsNfsValidFor
 *     }
 *     LDAP-NAME       {"fedfsNfsFsl"}
 *     LDAP-DESC       "An NFS location of a fileset"
 *     ID              { daniel-ellard 1 1004 }
 * }
 * ```
 *
 * @constant
 * @type {OBJECT_CLASS}
 * @implements {OBJECT_CLASS}
 */
export const fedfsNfsFsl: OBJECT_CLASS = {
    class: 'OBJECT-CLASS',
    decoderFor: {},
    encoderFor: {},
    '&Superclasses': [fedfsFsl] /* OBJECT_FIELD_SETTING */,
    '&kind': structural /* OBJECT_FIELD_SETTING */,
    '&MandatoryAttributes': [
        fedfsNfsURI,
        fedfsNfsCurrency,
        fedfsNfsGenFlagWritable,
        fedfsNfsGenFlagGoing,
        fedfsNfsGenFlagSplit,
        fedfsNfsTransFlagRdma,
        fedfsNfsClassSimul,
        fedfsNfsClassHandle,
        fedfsNfsClassFileid,
        fedfsNfsClassWritever,
        fedfsNfsClassChange,
        fedfsNfsClassReaddir,
        fedfsNfsReadRank,
        fedfsNfsReadOrder,
        fedfsNfsWriteRank,
        fedfsNfsWriteOrder,
        fedfsNfsVarSub,
        fedfsNfsValidFor,
    ] /* OBJECT_FIELD_SETTING */,
    '&ldapName': ['fedfsNfsFsl'] /* OBJECT_FIELD_SETTING */,
    '&ldapDesc': 'An NFS location of a fileset' /* OBJECT_FIELD_SETTING */,
    '&id': _OID.fromParts(
        [1, 1004],
        daniel_ellard
    ) /* OBJECT_FIELD_SETTING */ /* UNIQUE_OBJECT_FIELD_SETTING */,
};
/* END_OF_SYMBOL_DEFINITION fedfsNfsFsl */

/* eslint-enable */
