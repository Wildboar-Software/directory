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
