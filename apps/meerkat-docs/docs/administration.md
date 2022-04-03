# Administration

## Hibernation

All requests, both DAP, DSP, and LDAP, return a `serviceError` with problem
`busy`.

## Handling Memory Pressure

What research I have done into this has shown me:

- There is almost no support in NodeJS or any NPM libraries for detecting
  dangerously high memory usage.
- There is no way to determine what the max heap size is.

That said, I think the only approach I can realistically use is to document what
to do if you run out of memory: increase the `max-old-heap-size` of NodeJS.
