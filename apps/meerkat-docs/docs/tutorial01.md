# Tutorial 1: Set up the X.500 CLI

:::caution

The X.500 CLI is under heavy development right now. This documentation could
become invalidated. If you believe something is incorrect, please
[submit an issue](https://github.com/Wildboar-Software/directory/issues).

:::

## Installation

Currently, this command can only be installed via [NPM](https://www.npmjs.com/),
which you can get by installing [NodeJS](https://nodejs.org/en/).

Run `npm install -g @wildboar/x500-cli`. If you get a permissions issue, you
may need to prefix your command with `sudo` on Unix-like systems or run this
command in a terminal that is "ran as administrator" on Windows.

If you get an error saying that the command `x500` does not exist after you
have done this, you may need to close out of the terminal and open a new one.

## Configuration

You can use the X.500 command-line interface without a
[configuration file](./client-config.md), but as you use the CLI, you'll find
yourself repeatedly typing in the same options to connect to the same DSA, and
bind using the same entry, and express the same preferences, over and over
again. You can save yourself all of this trouble by creating an X.500
configuration file upfront, which you will learn in this tutorial.

The X.500 CLI comes with commands for manipulating the X.500 configuration file.
You absolutely can edit this file using a text editor or even through
automation, but the X.500 CLI will make it easy to get up and running quickly,
because it will (1) place this file in the correct location, (2) give it the
correct formatting, and (3) pre-populate it with a syntactically-correct
boilerplate configuration.

Let's get started by running this command: `x500 config init`.

Unless you got some error in your terminal, it worked and created an X.500
configuration file for you. Again, you can view this configuration file with a
text editor if you want, but you can quickly pull it up in the terminal by
running `x500 config view`.

In a Bash shell, you can also edit this file quickly by running one of these
commands to open this file with one of the many popular command-line text
editors:

```bash
nano $(x500 config path)
vi $(x500 config path)
vim $(x500 config path)
nvmim $(x500 config path)
emacs $(x500 config path)
```

Okay, now you know how to create, view, and edit this file, but let's use the
X.500 commands to do this the _elegant way_.

Run the following command to add a preference profile to your configuration
file, but replace `prefname` with whatever you want your preference profile to
be named, and change the settings below to whatever you want. Note that the
name is case-sensitive.

```bash
x500 config add pref prefname \
  --logLevel=debug \
  --sizeLimit=1000 \
  --timeLimit=30 \
  --attributeSizeLimit=10000 \
  --callingAETitle='c=US,st=FL,cn=Your name'
```

Then run `x500 config view` to make sure it was added and looks fine.

Now let's add a DSA. Run this command, but replace `yourdsa` with whatever name
you want, and replace the URLs in the `accessPoint` option with the actual
access points of your DSA. Note that you can use the `accessPoint` option
several times if your DSA has multiple access points. The URLs you supply for
a single access point should be comma-separated and should not contain a
username and/or password.

```bash
x500 config add dsa yourdsa \
  --accessPoint=master:idms://dsa01.yourdomain.com:44632,idm://dsa01.yourdomain.com:4632
```

Again, run `x500 config view` to make sure it was added and looks fine.

Finally, let's add a simple credential (which means a Bind DN and a password).
Use this command, but replace the distinguished name with the actual
distinguished name against which you wish to bind. Notice the `-p` at the end.
This will cause the command to prompt you for a password. Also, you probably
do not want to name this `mycred`, do you?

```bash
x500 config add cred simple mycred 'c=US,st=FL,l=Tampa,cn=Your name' -p
```

Supply your password at the prompt and hit `Enter`.

Run `x500 config view` to make sure it was added and looks fine.

Now we have created a preference profile, a DSA, and a credential. We have all
of the ingredients for a "context," which is simply a combination of all three.
The "context" construct exists so that you can re-use credentials, preference
profiles, and DSAs. Run the following command to create this combination, which
we will call `main`:

```bash
x500 config add context main --pref=prefname --cred=mycred --dsa=yourdsa
```

Run `x500 config view` to make sure it was added and looks fine.

Finally, we need to actually _use_ our newly-defined context. Run this command
to set the current context to the `main` context we just defined:

```bash
x500 config set-context main
```

Finally, run `x500 config view` to make sure your context was set and everything
else still looks okay.

Now we can test our set up. Just try to read the root DSA by typing in this
command alone:

```bash
x500 dap read ''
```

If you get an entry back, it worked!
