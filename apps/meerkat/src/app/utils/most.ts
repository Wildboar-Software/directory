export
function most <T> (arr: T[], predicate: (value: T, index: number) => boolean): boolean {
    let failBudget: number = Math.floor(arr.length / 2);
    for (let i = 0; i < arr.length; i++) {
        if (!predicate(arr[i], i)) {
            failBudget--;
        }
        if (failBudget <= 0) {
            return false;
        }
    }
    return true;
}

export default most;
