# Zonal Matching

Meerkat DSA supports Zonal Matching which is a Mapping-Based Matching (defined
in [ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en),
Section 13.6.2) that is defined in
[ITU Recommendation X.520 (2019)](https://www.itu.int/rec/T-REC-X.520/en),
Section 8.8. Essentially, if a user-provided search filter does not yield any
results by selecting for entries in a specific locality (e.g. city, township),
Meerkat DSA can perform a geographically-intelligent replacement of the
excessively restrictive search filter items to a match on "zones" (if requested
by the user). In Meerkat DSA's case, postal codes are used as "zones."

This can be useful if, say, you are searching for a person that may not
technically live in `C=US,ST=FL,L=Tampa`, but might live within the greater
outlying "Tampa metropolitan area." If requested, and if no entries under
`C=US,ST=FL` had the locality name `Tampa` (as specified in the search filter),
search filter item asserting `Tampa` would be replaced with one or more equality
assertions of the `postalCode` attribute, whose asserted values would be postal
codes within and surrounding Tampa.

## Meerkat DSA's Zonal Matching Definition

There are no specific implementations of zonal matching defined in the X.500
specifications, and--as far as I know--none were ever defined anywhere. So
Meerkat DSA had to define its own zonal matching. Below is its ASN.1
specification, followed by an explanation of how it works.

```asn1
id-zmr-postalZonalMatch OBJECT IDENTIFIER ::= { /* TODO */ }
postalZonalMatch ZONAL-MATCHING ::= {
    SELECT BY           {
        id-at-countryName
        | id-at-stateOrProvinceName
        | id-at-localityName }
    APPLICABLE TO       { stateOrProvinceName | localityName }
    SUBTYPES INCLUDED   TRUE
    COMBINABLE          TRUE
    USER CONTROL        TRUE
    EXCLUSIVE           TRUE
    MATCHING RULE       zonalMatch.&id
    ID                  id-zmr-postalZonalMatch
}
```

The above means that, if zonal matching is requested, it will be chosen if the
base object name and the search filter together can produce `countryName`,
`stateOrProvinceName`, and `localityName` assertions. If any one of these is
missing, this zonal matching will not be used. Since this is the only zonal
matching implemented in Meerkat DSA, this also means that no zonal matching will
be used at all.

The above specification also indicates that `localityName` and
`stateOrProvinceName` will be replaced by the assertions this zonal mapping
produces in the search filter.

This implementation is combinable, meaning that multiple filter items can be
used to produce a mapping. It is user-controlled, meaning that the user can
specify different levels of breadth with which to expand the search area (e.g.
20 miles outside of the city or just 5). It is exclusive, which means that the
user can specify that they want their search to return only the marginal set of
results that were not present in the unrelaxed result set.

## Meerkat DSA's Zonal Matching Algorithm

As stated earlier, when zonal matching is requested, and when the proper
attribute value assertions are present in the base object name and search
filter, the asserted values in the filter (not in the base object name) are
replaced with `postalCode` assertions whose asserted values are the postal codes
associated with that locality. This corresponds to a zonal "area" of 0. These
postal codes are associated with one or more longitude-latitude points, which
are queried from the "gazetteer" and sorted.

If a greater area is specified, the "diameter" of the original area is obtained
by defining a box whose lower bound is the southern-most point, whose upper
bound is the northern-most point, whose left bound is the western-most point,
and whose right bound is the eastern-most point. The diagonal area of this box
is defined as the "diameter," for our purposes. ("Hypotenuse" would be a more
technically correct term, but since zonal matching is conceptually thought of
as outwardly-expanding concentric circles, and since it is "fuzzy" by nature, we
do not have to nitpick these terms.)

Each subsequent "area" or "level" of the zonal relaxation adds or subtracts
(whichever makes the box bigger) R / L to each
bound of the box described above, where R is the "radius" of the level-0 area,
and L is the level. (Note that this only applies above level-0, so that no
division by zero happens.) In other words, at level 1, all four edges of the box
expand outwards by R. At level 2, this is by R + R/2.

:::note

The rationale for this seemingly obtuse algorithm is that, as the "diameter" of
a circle doubles, the area within that circle _more than doubles_. Likewise, if
the expansion of the box proceeded at a constant length at each level, the area
captured would increase "exponentially," and so would the entries evaluated in
each marginal relaxation of the zonal match. Instead, we want an algorithm that
is inclined to return a roughly constant number of entries at each expansion of
the area. Dividing the added radius by the level at each level will result in
the box expanding by a decreasing radius at each iteration, but the area added
by each iteration will be less volatile.

:::

The algorithm doesn't end here. Once the box for a given zonal level is
determined, all postal codes that have a single point within that box are
selected as the replacement `postalCode` assertions for the `localityName` and
`stateOrProvinceName` assertions in the filter. It is a known and understood
drawback of this algorithm that this may result in a really jagged, irregular
search area.

## Nuances

- None of the selected locale attributes in the distinguished name of the base
  object are replaced. In other words, if your search the subtree under
  `C=US,ST=FL`, no amount of zonal relaxation will make your search cross the
  Floridian border into Georgia and return results under `C=US,ST=GA`.
- The algorithm _never_ returns `multiple-mappings`, even if there are two
  separate real localities that have the same exact names within the country
  and state-or-province. In such a case, all of their postal codes will be
  considered as one, leading to some very strange results.
- Your database is empty by default, so zonal matching will not work at all
  unless you seed it with postal codes and their geographic coordinates.

## Seeding the Gazetteer (Zonal Mapping Database)

To populate the _gazetteer_ (the internal database used for zonal matching),
you will need to seed the `PostalCodesGazetteEntry` and
`PostalCodeBoundaryPoints`. The former contains the country, state-or-province,
and locality name associated with each postal code. The latter contains one or
more geographic coordinates corresponding to points on the boundaries of the
postal code regions. These coordinates are composed of `northing` and `easting`
components, which are meters (postive or negative) from the prime equator and
prime meridian, respectively.

:::tip

Despite the name, you do not have to insert the coordinates of the _boundaries_
of the postal code region in your gazeteer. You can just insert any point within
the postal code region. This will have the effect of preventing the seemingly
absurd scenario of a postal code from being included in the mapping just by
having a single boundary point within the box described above. Boundary points
were selected just because they are readily available online; something else,
such as a "center of gravity" will have to be calculated from this data.

:::

## USA-only Gazetteer Seed

As part of developing Meerkat DSA, a USA-only dataset for the gazetteer was
created, and made freely available. Because these files were too large to commit
to Meerkat DSA's git repository, they are available instead as downloads from
blob storage. There is no license included with them, but if it matters at all,
I hereby release them under an MIT license. You can do whatever you want with
this data. I won't sue.

First, download the files. Using the `curl` command found on many unix-like
systems, you can run these commands from within the root of the cloned
[Meerkat DSA repo](https://github.com/Wildboar-Software/directory):

```
mkdir -p data/zonal
curl https://wildboarprod.blob.core.windows.net/public-data/boundary.csv -o data/zonal/boundary.csv
curl https://wildboarprod.blob.core.windows.net/public-data/gazette.csv -o data/zonal/gazette.csv
```

If you have your `DATABASE_URL` environment variable defined, you can then run
`node ./tools/seed.mjs` (provided that you have NodeJS installed). This will
take a minute or two, but it will load up your database with the gazetteer data.
You may set your `DATABASE_URL` in the root-level `.env` file. Just make sure
not to commit it, since this file is not in `.gitignore`!
