

describe("LDAP URLs", () => {
    it("are parsed as expected", () => {
        // This is taken directly from IETF RFC 5280.
        const input = "ldap://ldap.example.com/cn=CA,dc=example,dc=com?cACertificate;binary,crossCertificatePair;binary";
        const url = new URL(input);
        expect(url.protocol).toBe("ldap:");
        expect(url.hostname).toBe("ldap.example.com");
        expect(url.pathname).toBe("/cn=CA,dc=example,dc=com");
        expect(url.search).toBe("?cACertificate;binary,crossCertificatePair;binary");
        expect(url.searchParams.get("cACertificate;binary")).toBeDefined();
        expect(url.searchParams.get("crossCertificatePair;binary")).toBeDefined();
    });
});
