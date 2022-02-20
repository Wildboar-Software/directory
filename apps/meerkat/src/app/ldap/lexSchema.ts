/**
 * @summary Lex an LDAP schema type syntax
 * @description
 *
 * IETF RFC 4512, Section 4.2 defines several attributes that are used to convey
 * directory schema information. However, all of these attribute share a
 * similar, vaguely CSON-like syntax. This function can be used for all of them.
 *
 * This function lexes attribute values of these types into a sequence of
 * tokens. Note that merely splitting the component by whitespace is not
 * feasible, because the LDAP attribute description may have spaces, and even
 * the LDAP attribute name (I think).
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4512#section-4.2
 *
 * @param text The string-form LDAP value
 * @returns An iterable iterator of lexemes
 *
 * @function
 */
export
function *lex (text: string): IterableIterator<string> {
    if (!text || text.length === 0) {
        return;
    }
    const tokens = text.split(/\s+/g).filter((token) => token.length);
    let cumulativeToken: string = "";
    for (const token of tokens) {
        if (token.startsWith("'") || cumulativeToken.startsWith("'")) {
            if (token.endsWith("'")) {
                cumulativeToken += token;
                yield cumulativeToken;
                cumulativeToken = "";
                continue;
            }
            cumulativeToken += token;
            cumulativeToken += " ";
            continue;
        } else {
            yield token;
        }
    }
}

export default lex;
