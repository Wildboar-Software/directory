
/**
 * I threw these tests in here because this behavior seems to be undocumented.
 * I found this StackOverflow question where people discuss this:
 * https://stackoverflow.com/questions/20328073/is-it-safe-to-resolve-a-promise-multiple-times
 *
 * Since this behavior _might_ be unspecified, I figure it would be a good idea
 * to put unit tests in here to check for it, since part of my code relies on
 * this behavior.
 */
describe("Promise", () => {

    it("only resolves once, even if resolve() is called multiple times", async () => {
        expect(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 100);
                setTimeout(resolve, 200);
            });
            // This is basically just a sleep to make sure both resolve()s above are called.
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }).not.toThrow();
    });

    it("only rejects once, even if reject() is called multiple times", async () => {
        expect(async () => {
            await new Promise((_, reject) => {
                setTimeout(() => reject(new TypeError("asdf")), 100);
                setTimeout(() => reject(new ReferenceError("zxcv")), 200);
            });
            // This is basically just a sleep to make sure both reject()s above are called.
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }).rejects.toThrowError(TypeError);
    });

});

/**
 * Again, I was not 100% sure whether this would work and my code relies on it,
 * so I wanted to test this assertion here.
 */
describe("try-finally", () => {
    it("runs the finally code even if the try code returns", () => {
        const fn = jest.fn();
        (() => {
            try {
                return;
            } finally {
                fn();
            }
        })();
        expect(fn).toHaveBeenCalled();
    });

    it("still throws", () => {
        const fn = jest.fn();
        expect(() => {
            try {
                throw new ReferenceError();
            } finally {
                fn();
            }
        }).toThrowError(ReferenceError);
        expect(fn).toHaveBeenCalled();
    });
});
