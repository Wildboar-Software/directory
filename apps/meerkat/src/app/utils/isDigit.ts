export
function isDigit (char: number) {
    return (
        (char >= 0x30)
        && (char <= 0x39)
    );
}

export default isDigit;
