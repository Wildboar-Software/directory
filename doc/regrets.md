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

## Structured Logging

My current belief around logging is: all logging should be structured, the
actual log message itself should be extremely succinct and (usually) in
all-lowercased, minimally-punctuated English with no interpolated data, and
there should be a log message identifier / event type that never changes.

So a good log message would look like this:

```json
{
  "event_type": 1,
  "ts": 2479759222,
  "msg_en": "access denied to read attribute type",
  "dse_id": 123,
  "dse_uuid": "29e22186-e1b7-4e8d-aa78-21f6d80fe50e",
  "attr_type": "2.5.4.10"
}
```

I think the timestamp should be a Unix Epoch, but that comes at the cost of
readability to humans. I kind of think there should be an option to choose, but
it maybe makes more sense to have an option like `log_for_humans` that makes
log output more human-friendly in general.

In Meerkat DSA, these interpolated messages get huge, and I often end up logging
the same exact things in the structured data as I do in the messages. Making
these internationalized also introduced huge overhead. Using English-only
strings means that error messages can be looked up online. If you really want
to support different languages in these messages, you can use conditional
compilation to pick the hard-coded language: the event identifier stays the same
so the event can be looked up online regardless of language.

There's only one thing I'm not entirely clear on: how to handle journald.
If you're writing structured log messages like this, journald is going to be
littered with vague messages like "access denied" unless the user drills into
the structured data. Maybe this is still fine...

## Shadowing and Change Logging

I think if you were to store every modification operation in a change log whose
data structures are DISP incremental steps, the problem of having to send total
refreshes to secondary consumers would be fixed. Then again, maybe you don't
want to store this data exactly like the DISP incremental step, because that is
specific to SDSEs and all shadowing agreements are going to request different
information, so you would probably have to modify these incremental steps with
each shadow update anyway.

These may only be stored if there are any active shadowing agreements, and maybe
only the changes in the shadowed areas could be stored to this log.

Separately from this, I think there is a place for having an audit log, which
would store the entire requests from users, along with IP addresses, invoke IDs,
etc. But this sounds like a hell of a lot of logging.

## Database

I should have used a key-value store instead.

## Other Things

- Separate classes for each connection type `DAPClient`, `DOPClient`, etc.
  - This is all basically copied code with just a few differences between them,
    and it has been such a nightmare maintaining all these classes.
- I wish I had just used the `Attribute` construct instead, or something like
  it, since directories do seem to operate on whole attributes at a time.
