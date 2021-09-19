export
function canFail (cb: () => string): string {
    try {
        return cb();
    } catch {
        return "ERROR";
    }
}

export default canFail;
