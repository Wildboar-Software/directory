// import type { Context } from "../types";
// import type { Result } from "@wildboar/x500/src/lib/types/Result";
// import { DER } from "asn1-ts/dist/node/functional";
// import type {
//     LDAPMessage,
// } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
// // import type { BindResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindResponse.ta";
// // import type { SearchResultEntry } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
// // import type { SearchResultDone } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultDone.ta";
// // import type { SearchResultReference } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultReference.ta";
// // import type { ModifyResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyResponse.ta";
// // import type { AddResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
// // import type { DelResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/DelResponse.ta";
// // import type { ModifyDNResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyDNResponse.ta";
// // import type { CompareResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareResponse.ta";
// // import type { ExtendedResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ExtendedResponse.ta";
// // import type { IntermediateResponse } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/IntermediateResponse.ta";

// TODO: I think I am going to need to first implement LDAP continuation references before I can meaningfully use this.
// The confusion here is that several DAP operations use the same LDAP response messages.

// export
// function ldapResultToDAPReply (req: LDAPMessage): Result {
//     if ("bindResponse" in req.protocolOp) {

//     }
//     else if ("searchResEntry" in req.protocolOp) {

//     }
//     else if ("searchResDone" in req.protocolOp) {

//     }
//     else if ("searchResRef" in req.protocolOp) {

//     }
//     else if ("modifyResponse" in req.protocolOp) {

//     }
//     else if ("addResponse" in req.protocolOp) {

//     }
//     else if ("delResponse" in req.protocolOp) {

//     }
//     else if ("modDNResponse" in req.protocolOp) {

//     }
//     else if ("compareResponse" in req.protocolOp) {

//     }
//     else if ("extendedResp" in req.protocolOp) {

//     }
//     else if ("intermediateResponse" in req.protocolOp) {

//     } else {
//         throw new Error();
//     }
// }

// export default ldapResultToDAPReply;
