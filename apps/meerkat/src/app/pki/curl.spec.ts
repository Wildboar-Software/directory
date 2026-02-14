import {
    curlLDAP,
    curlFTP,
} from "./curl.js";
import { URL } from "node:url";
import { strict as assert } from "node:assert";

const LDAP_BASE: string = "ldap://seclab7.ncsl.nist.gov:389/cn=CA1%20-%20CP.04.03,ou=Testing,ou=DoD,o=u.s.%20government,c=us";
const LDAP_URL: string = `${LDAP_BASE}?certificateRevocationList;binary`;
const FTP_URL: string = "ftp://demo:password@test.rebex.net/readme.txt";

describe("curlLDAP()", () => {
    it("works", async () => {
        const url = new URL(LDAP_URL);
        const response = await curlLDAP(url, [ "certificateRevocationList;binary" ], undefined, 5000);
        assert(response);
        expect(response).toHaveLength(1);
        return expect(response[0]).toHaveLength(341);
    });
});

describe("curlFTP()", () => {
    it("works", async () => {
        const url = new URL(FTP_URL);
        const response = await curlFTP(url, undefined, 5000);
        return expect(response).toBeTruthy();
    });
});
