# Blueprint for a global DIT

```
O=Wildboar Software
DC=.
  DC=com
    DC=wildboarsoftware
URBIT
IPNS
CA
O=United Nations (https://en.wikipedia.org/wiki/List_of_United_Nations_organizations_by_location)
O=European Union (And other IGOs: https://en.wikipedia.org/wiki/List_of_intergovernmental_organizations)
C=US
  O=Government
    CN=Access Control Inner Area
    CN=Password Administration
    CN=Schema Administration
    CN=Context Assertion Defaults
    CN=Service Administration
    CN=Collective Attributes Inner Area
    O=Supreme Court
    O=Central Bank (See: https://www.banknotestreet.com/country-banks)
    O=Military
    CN=UN Representative
  CN=Access Control
  CN=Password Administration
  CN=Schema Administration
  CN=Context Assertion Defaults
  CN=Collective Attributes
  ST=FL
    O=Government
      CN=Access Control Inner Area
      CN=Password Administration
      CN=Schema Administration
      CN=Context Assertion Defaults
      CN=Service Administration
      CN=Collective Attributes Inner Area
      O=Supreme Court
    L=Duval County
      O=Government
        CN=Access Control Inner Area
        CN=Password Administration
        CN=Schema Administration
        CN=Context Assertion Defaults
        CN=Service Administration
        CN=Collective Attributes Inner Area
      L=Jacksonville
        O=Government
          CN=Access Control Inner Area
          CN=Password Administration
          CN=Schema Administration
          CN=Context Assertion Defaults
          CN=Service Administration
          CN=Collective Attributes Inner Area
        GN=Jonathan+SN=Wilbur+dnQualifier=7F91D7AA-6CD9-440F-9021-99A89EC1D5E6
    O=Wildboar Software
```

- Each governmental body would have its own naming context
  - ...which would correspond to its own separate Meerkat server.
  - ...and which would implement HOBs with `subr`s
- Each governmental body would be represented by a DSE having:
  - Object class of `country`
  - Object class of `organization`

