import lex from "./lexSchema";

// Yes, I know this is technically incorrect syntax.
const input1 = [
    "( 2.5.4.33",
    "NAME 'person'",
    "DESC 'Just a big guy'",
    "OBSOLETE",
    "SUP (2.4.3.4 $ 'surname' $ givenName))",
    "AUXILIARY",
    ")",
].join(" ");

const results1: string[] = [
    "(", "2.5.4.33",
    "NAME", "'person'",
    "DESC", "'Just a big guy'",
    "OBSOLETE",
    "SUP", "(2.4.3.4", "$", "'surname'", "$", "givenName))",
    "AUXILIARY",
    ")",
];

describe("lex", () => {

    test.each([
        [ input1, results1 ]
    ])("works with test case $#", (input, expectedResults) => {
        const lexed = Array.from(lex(input));
        expect(lexed).toEqual(expectedResults);
    });

});
