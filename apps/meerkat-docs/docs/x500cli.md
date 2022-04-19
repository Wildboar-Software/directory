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

This tool has not been released yet, but you can find the source repository
[here](https://github.com/Wildboar-Software/directory).

The Wildboar X.500 command-line interface uses the standardized
[X.500 client configuration file](./client-config.md) defined by Wildboar
Software.
