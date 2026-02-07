# Design Regrets

- I think signature verification should of requests, results, and errors should
  be more streamlined. I keep having to copy the same code over and over again.
- I also think you should have basically one big "print" function for all error
  and result types instead of copying display logic everywhere.
- Using an ORM was the biggest mistake of all. Never again. Just write the damn
  SQL.

## Replicate Everything Feature

It seems like X.500 directories are implicitly forbidden from replicating
everything starting from (but of course excluding) the root DSE, but this is
never made explicit anywhere.

Evidence in favor:

- Annex O of ITU-T Rec. X.501 states that a Root DSE may not also be a context
  prefix
- ITU-T Rec. X.501, Section 24.2.1.5: "The supplierKnowledge attribute type is
  held in a DSE of type cp."

I had to hard-code a lot of exceptions into my codebase to make this work, and
even then, I'm not certain this isn't going to cause a ton of problems.
