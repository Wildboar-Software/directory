
export
function isArrayOfStrings (value: unknown): value is string[] {
    return Array.isArray(value) && value.every((v) => (typeof v === "string"));
}

export default isArrayOfStrings;
