# Setup

## System Requirements

Meerkat DSA requires NodeJS version 17 or higher. With heavy usage, you can
expect Meerkat DSA's memory usage to get up to 300MB. It would be wise to
anticipate the extreme and ensure that Meerkat DSA has at least 500MB of memory.

In addition to this, Meerkat DSA needs a database (as detailed below), which may
take a lot more memory. You may also wish to set up a reverse HTTP proxy such as
Nginx, Caddy, or Apache, which will also consume some resources.

Added together, you should probably have no less than 1 GB of memory free for
Meerkat DSA, the database, and a reverse proxy (if used).

Meerkat DSA has only been tested on x86-64 platforms, so no guarantees can be
made about how it will run on other architectures. Meerkat DSA should run just
fine on Windows, Mac OS, Linux, and possibly more operating systems, and it has
been briefly tested on all three.

X.500 directory traffic is typically not time-sensitive, so high latency is
usually tolerable. However, the network may need to be able to afford high
throughput, since certain operations, such as `search` and `list`, can
potentially return a lot of data all at once.

## Installation / Deployment

It is recommended that you install Meerkat DSA in a Kubernetes cluster using
Helm. However, Meerkat DSA can be installed as a Docker Compose app and can also
run locally.

### Database

In any case that you deploy Meerkat DSA, you will need to configure a MySQL
database that will hold the DSA's data. Ideally, you should use a secure
password and TLS to secure the connection to the database. It is also strongly
recommended that Meerkat DSA coexist in a physically nearby location to the
database so that latency is low; if your Meerkat DSA instance has to send its
queries to a MySQL database on the other side of the planet, it will mean that
Meerkat DSA will respond slowly to requests!

You will need to manually create a database within your database server that
Meerkat DSA can use exclusively. Conventionally, this is named `directory`, but
you can name it anything you want as long as you configure your `DATABASE_URL`
to use that database.

:::note

The `bitnami/mysql` Helm chart will allow you to define a database to create
on startup, so you will not need to manually log into this database server to
create this database. Different container images may also allow you to define
a database to create on startup as well.

:::

The MySQL database will then need to be seeded with database schema. In
technical terms, we need to "deploy a migration" to the database. You will need
a user account that has all permissions to alter database schema. It is fine if
this is a root / administrator account, since this will only be used once. How
you actually deploy the migration will depend on how you have deployed Meerkat
DSA, so this will be described on a case-by-case basis in the sections to
follow.

After the database migration is complete, you can run Meerkat DSA with a
database account having just create + read + update + delete permissions for
the database.

#### Bitnami Helm Chart

One of the easiest ways to get a MySQL instance ready to go in a Kubernetes
cluster is the
[Bitnami Helm chart](https://artifacthub.io/packages/helm/bitnami/mysql).

Here is one way to do this:

Run this command to create a secret in Kubernetes:

```bash
kubectl create secret generic <your secret name> \
  --from-literal=mysql-root-password=<your root password> \
  --from-literal=mysql-replication-password=<your rep password> \
  --from-literal=mysql-password=<your other password> \
  --namespace=<your namespace>
```

Add the Bitnami Helm repo via this command:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

Finally, install MySQL from the Bitnami Helm repo via this command:

```bash
helm install <your database name> bitnami/mysql \
  --set auth.existingSecret=<your secret name> \
  --set auth.database=directory \
  --atomic \
  --namespace=<your namespace>
```

### Configuration

Meerkat DSA is configured through environment variables. These environment
variables and their effects are documented [here](./env.md).

At minimum, you MUST define `DATABASE_URL`. Besides that, you SHOULD define the
following other environment variables:

- `MEERKAT_SIGNING_CERTS_CHAIN_FILE`, which is documented [here](./env.md#meerkatsigningcertschainfile).
- `MEERKAT_SIGNING_KEY_FILE`, which is documented [here](./env.md#meerkatsigningkeyfile).
- `MEERKAT_TLS_CERT_FILE`, which is documented [here](./env.md#meerkattlscertfile).
- `MEERKAT_TLS_KEY_FILE`, which is documented [here](./env.md#meerkattlskeyfile).
- `NODE_ENV`, which should always be set to `production` unless you are
  debugging or developing Meerkat DSA.
- `LANG`, which should be set to the locale identifier for your desired locale.
  This will determine the language used for logging as well as the language for
  error messages. For American English, this should be `en_US.utf8`.

:::note

The `LANG` environment variable will NOT affect the web administration console.
The web administration console does not support internationalization at all.

:::

### Local

To do this, you must have Node.js version 17 or higher installed. This will
also install Node Package Manager (`npm`). You will also need Git installed.
You will also need a MySQL database somewhere ofr

You can run Meerkat DSA locally by cloning the
[source repository for Meerkat DSA](https://github.com/Wildboar-Software/directory)
by running `git clone https://github.com/Wildboar-Software/directory`.

Then run `npm install`. This will install all of the dependencies for this
project to build and work.

Run `npx nx run meerkat:build:production` to build Meerkat DSA for the system
you are running. This will put the compiled output into
`./dist/apps/meerkat/main.js`. You can run this JavaScript file via
`node ./dist/apps/meerkat/main.js`, however, it will probably not work right
away.

You will need to configure Meerkat DSA using environment variables. How
you do this will depend on whether you are using Windows, Linux, Mac, or some
other operating system, but you can look at what you need to get it up and
running on the [Configuration Environment Variables documentation](./env.md).

There is technically only one environment variable that is required, which is
`DATABASE_URL`. Set this to the URL of your database.

Once you have your environment variables defined to configure Meerkat DSA as
you'd like, you will need to actually configure the database with the schema
needed to store Meerkat DSA's data, which you can do by running
`npx prisma migrate deploy --schema=apps/meerkat/src/prisma/schema.prisma`.

Then run `node ./dist/apps/meerkat/main.js`. You should see your application
start up on the console (unless you turned off console logging).

### Docker / Docker-Compose

You can define your own Docker-Compose stack that will pull the Meerkat DSA
image `ghcr.io/wildboar-software/meerkat-dsa` and wire it up to a MySQL
database, but the
[source repository for Meerkat DSA](https://github.com/Wildboar-Software/directory)
has a
[starter template](https://github.com/Wildboar-Software/directory/blob/master/pkg/docker-compose.yaml)
that you can use.

The starter template will create a MySQL database, deploy the migrations to it,
and start Meerkat DSA. Pretty much all you have to do is configure the
environment variables and mount volumes for your signing key and cert, your
TLS key and cert, your CA certificates bundle, your CRLs, your init script, and
any other files that you may want to be in the container.

### Kubernetes

:::info

There is a lot that goes into using Kubernetes and Helm--far more than I could
possibly teach you in this documentation. Therefore, this documentation will
assume that you have a working understanding of Kubernetes.

:::

As with Docker-Compose, you may define your own Kubernetes manifests to deploy
Meerkat DSA, however, [Wildboar Software](https://wildboarsoftware.com/en) has
defined a [Helm](https://helm.sh/) chart for easy installation and removal.

To install via Helm, first you must have `helm` installed, which you can do by
following [these instructions](https://helm.sh/docs/intro/install/). You must
also have a Kubernetes cluster running.

:::tip

Note that you do not have to run the official Kubernetes control
plane. There are plenty of other great alternatives such as K3s, Microk8s, and
Minikube, all of which should work, and some of which are more suitable for
lower-powered devices.

:::

If you haven't [set up the database](#database), by now, do so.

When you have `helm` installed, a Kubernetes cluster up and running, and you
have authenticated to the cluster, you need to define a Kubernetes secret that
your Meerkat DSA deployment can use to access your database. This needs to be
a Kubernetes `Secret` and not a `ConfigMap`, because your database URL will most
likely include a username and password. You can create this secret using this
command:

```bash
kubectl create secret generic <your secret name> \
  --from-literal=databaseUrl=<your database url> \
  --namespace=<your namespace>
```

Obviously, substitute `<your secret name>`, `<your database url>`, and
`<your namespace>` in the example above. The Kubernetes secret MUST have the
key `databaseUrl`. You CANNOT name this something else. Note that
Wildboar Software's Helm chart, by default, will seek to mount a secret named
`meerkat-database-secret`, so this is what you SHOULD name this secret, unless
you have multiple DSA instances that you expect to run.

There may be other secrets that you wish to create, such as the signing secret
and TLS secret. These can be done with a slightly different command. Both of
these secrets are of type `kubernetes.io/tls` and can be created using the
command `kubectl create secret tls ...`.

When you have created all of the `ConfigMap`s and `Secret`s you plan to create,
run these commands to deploy Meerkat DSA:

1. Run `helm repo add wildboar https://wildboarprod.blob.core.windows.net/helm-charts`.
   This will install Wildboar Software's Helm repository to your saved list of
   repositories so you can use Helm charts defined by Wildboar Software.
2. Run `helm repo update`. This will update your local cache of all Helm charts
   that are available in your configured repositories.
3. Run `helm install <release-name> wildboar/meerkat-dsa ...`, but replace
   `<release-name>` with any name you choose for your Meerkat DSA deployment,
   and replace the `...` with any other command arguments you need to supply to
   Helm to customize your deployment. At a minimum, you may want to append
   `--set databaseSecretName=<your database secret name>`. If you want your
   instance to be publicly accessible, add `--set service.type=LoadBalancer` to
   that command.

:::tip

You should configure Kubernetes
[inter-pod affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
so that your Meerkat DSA runs on the same node as your database to minimize
latency. It does not seem like there is an easy way to do this using the Helm
CLI alone: you might have to define a values override file. See
`.github/workflows/main.yml` within this repository for an example
(specifically, the `deploy_demo` job).

:::

If you want access to the web admin console, add
`--set dangerouslyExposeWebAdmin=true` to the command above, but be sure to
configure authentication for it or put it behind a secure reverse HTTP proxy
that requires authentication and TLS. Client TLS authentication would be even
better than basic authentication.

:::warning

Access to the web administration console means full permission to do anything.
It is highly recommended that you not only configure
[authentication](./webadmin.md#authentication) for it, but also use Kubernetes
[Network Policy](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
to ensure that other pods cannot even reach it.

As an even more secure measure, you may simply not expose a service for that pod
at all, requiring that you use
[`kubectl port-forward`](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
to access it. This means that only your Kubernetes cluster administrators would
be able to reach the web admin console, but this might work for your use case.

:::

You can see example deployments to Kubernetes clusters in Bash scripts
[here](https://github.com/Wildboar-Software/directory/blob/master/scripts/publish.sh)
and in GitHub Actions YAML configuration
[here](https://github.com/Wildboar-Software/directory/blob/master/.github/workflows/main.yml).

## DSA Initialization

When your DSA comes online, if there is not root DSE, your DSA will create it.
Otherwise, there are no entries in existence.

## Access Control

At this point, your DSA will be world-readable and world-writeable. If you do
not want this, you will need to implement access controls. To do this, you will
need to define an Access Control Specific Area (ACSA) that spans the entirety of
your autonomous administrative area. To do this, you will need to do these
things in this specific order (details to follow):

1. Create an administrative user.
2. Set a password for the administrative user.
3. Create an administrative point, then
4. Create access control subentries under this administrative point, then
5. Add the `id-ar-accessControlSpecificArea` value to the `administrativeRole`
   attribute of the administrative point, and set the `accessControlScheme`
   attribute of the administrative point.

   - `basicAccessControlScheme`
   - `simplifiedAccessControlScheme`
   - `rule-based-access-control`
   - `rule-and-basic-access-control`
   - `rule-and-simple-access-control`

:::warning

If you create the administrative point with an ACSA role before creating the
subentries, you might be locked out, unable to read or write anything including
and below that administrative point! This is because an absence of Access
Control Information (ACI) items, as would be present in subentries, indicates
a denial of access. Creating the ACSA administrative point is the switch that
turns access control on. Ensure you configure your ACI items in your ACSA and
ACIA subentries are configured to allow you to continue to set up your DSA!

:::

### Creating the administrative user

You will need to create a DSE of type `entry` that will represent the
administrator of the DSA. There are no requirements as to what object classes
this entry must have.

### Set a password for the administrative user

This administrator's DSE should have a password set through the
`administerPassword` operation, which will set a password for this entry. The
password SHOULD NOT be set using the `modifyEntry` or `addEntry` operation.

### Creating the administrative point

You may use an existing administrative point if you'd like, but, again, anything
in your DSA that is not enclosed by an ACSA admininstrative point will be
world-readable and world-writeable. This administrative point MUST NOT have the
`id-ar-accessControlSpecificArea` role value present in its `administrativeRole`
attribute (for right now).

### Creating access control subentries

You will need to create access control subentries beneath your soon-to-be
access control administrative point. These subentries contain Access Control
Information (ACI) items. These subentries shall:

- Have an `objectClass` attribute having a value `accessControlSubentry`.
- Have a `prescriptiveACI` attribute with values.

Defining what ACI items are here is outside of scope for this documentation, but
the ACI items that you define SHOULD:

- Allow administrators all permissions to all entries.
- Allow users to read and write to their own entries,
  - Including:
    - Changing their passwords
    - Deleting their entry
  - Excluding:
    - Modifying operational attributes
- Allow unauthenticated / anonymous users to only read non-sensitive entries and
  attributes, if any.

When defining ACI items, keep in mind that the server will apply a configurable
local qualifier to the calculated `AuthenticationLevel` for a user based on
whether the connection is secured through Transport Layer Security (TLS) or some
other means. The "points" that Meerkat assigns to a connection secured as such
is determined by the value of the environment variable
`AUTH_LEVEL_LOCAL_QUALIFIER_POINTS_FOR_TLS`. This environment variable shall
contain a reasonably-sized (not extremely large) integer.

The ACI items you define SHOULD be few in number, and, for performance reasons,
all ACI items within an ACSA SHOULD have distinct `precedence` values.

### Making the administrative point an access control administrative point

You should then define an access control administrative point. This can overlap
with your autonomous administrative point. This is a DSE of type `admPoint` that
has an `administrativeRole` attribute having value
`id-ar-accessControlSpecificArea`.

:::warning

If you do not have access control administrative points defined, your DSA will
be world-readable and world-writeable!

:::

One this point exists, your access control will activate.
