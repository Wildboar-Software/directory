# Blueprint for a global DIT

```
C=US
    ST=FL+O=State of Florida
        L=Jacksonville
            GN=Jonathan+SN=Wilbur+dnQualifier=7F91D7AA-6CD9-440F-9021-99A89EC1D5E6
        O=Wildboar Software
```

- Each governmental body would have its own naming context
  - ...which would correspond to its own separate Meerkat server.
  - ...and which would implement HOBs with `subr`s
- Each governmental body would be represented by a DSE having:
  - Object class of `country`
  - Object class of `organization`

