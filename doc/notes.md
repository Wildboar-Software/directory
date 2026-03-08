# Notes

## Substring Matching Rules

I was confused at how substring matching rules worked, because they have their
own assertion syntaxes, but the `FilterItem` uses the attribute's own syntax
for values. The X.500 specifications don't say anything about this, but I
found this in [IETF RFC 4511](https://datatracker.ietf.org/doc/html/rfc4511#section-4.5.1.7.2):

> Note that the AssertionValue in a substrings filter item conforms to
> the assertion syntax of the EQUALITY matching rule for the attribute
> type rather than to the assertion syntax of the SUBSTR matching rule
> for the attribute type.  Conceptually, the entire SubstringFilter is
> converted into an assertion value of the substrings matching rule
> prior to applying the rule.

And the substrings matching rule returns a boolean, just like an equality
matching rule, as hinted at in this quote from the same document:
"The filter is TRUE when the SUBSTR rule returns TRUE as applied to the
attribute or subtype and the asserted value."
