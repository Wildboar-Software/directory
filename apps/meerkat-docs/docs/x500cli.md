# The X.500 Command Line Interface

Wildboar Software is working on an X.500 Command Line Interface (CLI). This will
be released as an NPM package named `@wildboar/x500-cli`, which will install
an executable called `x500`.

With this tool, you will be able to run X.500 commands like so:

```bash
x500 dap read 'c=US,st=FL,cn=Jonathan M. Wilbur' \
  --accessPoint=idm://dsa01.root.mkdemo.wildboar.software:4632
```

```bash
x500 dap add subentry 'C=US,CN=Test subentry 2' \
  --accessPoint=idm://dsa01.root.mkdemo.wildboar.software:4632 \
  --commonName='Test subentry 2' \
  -b 'st=CA' \
  -n 1 \
  -x 5 \
  -c 'l=Los Angeles' \
  -a 'l=Silicon Valley' \
  -r '{ item:2.5.6.7 }'
```

The Wildboar X.500 command-line interface uses the standardized
[X.500 client configuration file](./client-config.md) defined by Wildboar
Software.

## Installation

Currently, this command can only be installed via [NPM](https://www.npmjs.com/),
which you can get by installing [NodeJS](https://nodejs.org/en/).

Run `npm install -g @wildboar/x500-cli`. If you get a permissions issue, you
may need to prefix your command with `sudo` on Unix-like systems or run this
command in a terminal that is "ran as administrator" on Windows.

If you get an error saying that the command `x500` does not exist after you
have done this, you may need to close out of the terminal and open a new one.

## Usage

Run the command `x500` from a terminal or pseudoterminal to see the subcommands
available. Currently, this output looks like this:

```
x500 <command>

Commands:
  x500 dap                    Directory Access Protocol
  x500 seed-countries <base>  seed directory with countries
  x500 config                 Configuration

Options:
  --version  Show version number                                                           [boolean]
  --help     Show help                                                                     [boolean]

Not enough non-option arguments: got 0, need at least 1
```

In most cases, you want to use `x500 dap` subcommands. Let's take a look at
those:

```
x500 dap

Directory Access Protocol

Commands:
  x500 dap add                              Add an entry
  x500 dap apw <object>                     Administer password
  x500 dap cpw <object>                     Change password
  x500 dap compare <object> <type> <value>  Compare an entry against an assertion
  x500 dap list <object>                    List subordinates of an entry
  x500 dap mod                              Modify an entry
  x500 dap moddn <src> <dest>               Move/Rename an entry
  x500 dap read <object>                    Read an entry
  x500 dap remove <object>                  Remove an entry
  x500 dap search <object> <subset>         Search

Options:
      --version         Show version number                                                [boolean]
      --help            Show help                                                          [boolean]
  -D, --bindDN          The distinguished name with which to bind.                          [string]
  -W, --password        The clear-text password. (Be careful. Your command history may be saved or
                        logged.)                                                            [string]
  -Y, --passwordFile    The path to a file containing the clear-text bind password, which does not
                        have to be UTF-8 encoded.                                           [string]
  -P, --promptPassword  Whether to interactively prompt for the bind password.             [boolean]
  -H, --accessPoint     The URL of the access point. (Must start with idm:// or idms://.)   [string]
  -Z, --noTLS           If TRUE, fails if TLS URL is used and prevents automatic StartTLS.
                                                                          [boolean] [default: false]
  -V, --verbose         Verbose output                                                     [boolean]

Not enough non-option arguments: got 0, need at least 1
```

Each of the above commands have additional options, which can be discovered by
running those subcommands with the `--help` flag (e.g. `x500 dap add --help`).

## Configuration

The X.500 CLI comes with utilities for manipulating your
[X.500 client configuration file](./client-config.md). Users of Kubernetes'
`kubectl` will find the user experience familiar. A tutorial for setting up
this file can be found [here](./tutorial01.md#configuration).

Without setting up the [X.500 client configuration file](./client-config.md),
all operations will have to have the `--accessPoint` option supplied in the
command, as well as credentials (if used). In this sense, setting up this
configuration file is optional, but it will quickly pay for itself by saving you
from typing out the same options over and over again.

:::tip

It is gently recommended to use these commands to interact with your
configuration file rather than editing it in a text editor, simply because these
commands abstract away the location, name, and format of the configuration file.

:::

## Seeding Countries

The `x500 seed-countries` subcommand will seed your Meerkat DSA instance with
countries (entries of object class `country`). This is a common use case. Many
people will likely want the top level of their DSA to include entries for, say,
`C=US`, `C=DE`, `C=RU`, etc.

In the future, there may be more seeding subcommands to assist with setting up
a directory service quickly.
