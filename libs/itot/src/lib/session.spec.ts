import {
    receiveTSDU,
    newSessionConnection,
    SI_CN_SPDU,
    PGI_CONNECTION_ID,
    PGI_CONNECT_ACCEPT,
    PGI_USER_DATA,
    PGI_EXTENDED_USER_DATA,
    PI_CALLING_SS_USER_REF,
    PI_COMMON_REFERENCE,
    PI_ADDITIONAL_REF_INFO,
    PI_PROTOCOL_OPTIONS,
    PI_TSDU_MAX_SIZE,
    PI_VERSION_NUMBER,
    PI_INITIAL_SERIAL_NUMBER,
    PI_TOKEN_SETTING_ITEM,
    PI_SECOND_INITIAL_SERIAL_NUMBER,
    PI_UPPER_LIMIT_SERIAL_NUMBER,
    PI_LARGE_INITIAL_SERIAL_NUMBER,
    PI_LARGE_SECOND_INITIAL_SERIAL_NUMBER,
    PI_SESSION_USER_REQUIREMENTS,
    PI_CALLING_SESSION_SELECTOR,
    PI_CALLED_SESSION_SELECTOR,
    PI_DATA_OVERFLOW,
    SERIAL_NUMBER_DIGIT_0,
    SERIAL_NUMBER_DIGIT_1,
    SERIAL_NUMBER_DIGIT_2,
    SERIAL_NUMBER_DIGIT_3,
    SERIAL_NUMBER_DIGIT_4,
    SERIAL_NUMBER_DIGIT_5,
    SERIAL_NUMBER_DIGIT_6,
    SERIAL_NUMBER_DIGIT_7,
    SERIAL_NUMBER_DIGIT_8,
    SERIAL_NUMBER_DIGIT_9,
} from "./session";
import { strict as assert } from "node:assert";

const tsdu1 = Buffer.from([
    SI_CN_SPDU,
    91, // 2 + 32 + 2 + 38 + 17
    PGI_CONNECTION_ID,
    32,
    PI_CALLING_SS_USER_REF,
    11,
    ...Array.from("Hello world").map((s) => s.charCodeAt(0)),
    PI_COMMON_REFERENCE,
    11,
    ...Array.from("Hello earth").map((s) => s.charCodeAt(0)),
    PI_ADDITIONAL_REF_INFO,
    4,
    ...[ 0x12, 0x34, 0x56, 0x78 ],
    PGI_CONNECT_ACCEPT,
    38,
    PI_PROTOCOL_OPTIONS,
    1,
    0x88,
    PI_TSDU_MAX_SIZE,
    4,
    ...[ 0xFF, 0xFF, 0xFF, 0xFF ],
    PI_VERSION_NUMBER,
    1,
    1,
    PI_INITIAL_SERIAL_NUMBER,
    6,
    ...[
        SERIAL_NUMBER_DIGIT_6,
        SERIAL_NUMBER_DIGIT_4,
        SERIAL_NUMBER_DIGIT_4,
        SERIAL_NUMBER_DIGIT_4,
        SERIAL_NUMBER_DIGIT_2,
        SERIAL_NUMBER_DIGIT_7,
    ],
    PI_TOKEN_SETTING_ITEM,
    1,
    0xBE,
    PI_SECOND_INITIAL_SERIAL_NUMBER,
    4,
    ...[
        SERIAL_NUMBER_DIGIT_6,
        SERIAL_NUMBER_DIGIT_4,
        SERIAL_NUMBER_DIGIT_4,
        SERIAL_NUMBER_DIGIT_2,
    ],
    PI_UPPER_LIMIT_SERIAL_NUMBER,
    1,
    6,
    PI_LARGE_INITIAL_SERIAL_NUMBER,
    1,
    SERIAL_NUMBER_DIGIT_6,
    PI_LARGE_SECOND_INITIAL_SERIAL_NUMBER,
    1,
    SERIAL_NUMBER_DIGIT_3,
    // End of Connect-Accept Item
    PI_SESSION_USER_REQUIREMENTS,
    2,
    0xDE, 0xAD,
    PI_CALLING_SESSION_SELECTOR,
    1,
    5,
    PI_CALLED_SESSION_SELECTOR,
    1,
    7,
    PGI_USER_DATA,
    5,
    ...Array.from("Hello").map((s) => s.charCodeAt(0)),
]);

// describe("receiveTSDU()", () => {
//     it("works", () => {
//         const conn = newSessionConnection();
//         conn.outgoingEvents.on("") = (pdu) => {
//             assert(pdu.connectionIdentifier);
//             assert(pdu.connectAcceptItem);
//             expect(pdu.connectionIdentifier.callingSSUserReference).toEqual(Buffer.from("Hello world"));
//             expect(pdu.connectionIdentifier.commonReference).toEqual(Buffer.from("Hello earth"));
//             expect(pdu.connectionIdentifier.additionalReferenceInformation).toEqual(Buffer.from([ 0x12, 0x34, 0x56, 0x78 ]));
//             expect(pdu.connectAcceptItem.protocolOptions).toEqual(0x88);
//             expect(pdu.connectAcceptItem.tsduMaximumSize).toEqual(0xFFFF_FFFF);
//             expect(pdu.connectAcceptItem.versionNumber).toEqual(1);
//             expect(pdu.connectAcceptItem.initialSerialNumber).toEqual(644427);
//             expect(pdu.connectAcceptItem.tokenSettingItem).toEqual(0xBE);
//             expect(pdu.connectAcceptItem.secondInitialSerialNumber).toEqual(6442);
//             expect(pdu.connectAcceptItem.upperLimitSerialNumber).toEqual(6);
//             expect(pdu.connectAcceptItem.largeInitialSerialNumber).toEqual(BigInt("6"));
//             expect(pdu.connectAcceptItem.largeSecondInitialSerialNumber).toEqual(BigInt("3"));
//             expect(pdu.sessionUserRequirements).toEqual(0xDEAD);
//             expect(pdu.callingSessionSelector).toEqual(Buffer.from([ 5 ]));
//             expect(pdu.calledSessionSelector).toEqual(Buffer.from([ 7 ]));
//             assert(pdu.userData);
//             expect(pdu.userData).toHaveLength(5);
//             expect(pdu.userData.toString("latin1")).toBe("Hello");
//         };
//         const [ spdus, err ] = receiveTSDU(conn, tsdu1);
//         expect(err).toBeUndefined();
//         expect(spdus).toHaveLength(1);
//     });
// });
