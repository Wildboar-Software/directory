# The Wildboar X.500 Command-Line Interface

## Installation

Currently, this command can only be installed via [NPM](https://www.npmjs.com/),
which you can get by installing [NodeJS](https://nodejs.org/en/).

Run `npm install -g @wildboar/x500-cli`. If you get a permissions issue, you
may need to prefix your command with `sudo` on Unix-like systems or run this
command in a terminal that is "ran as administrator" on Windows.

If you get an error saying that the command `x500` does not exist after you
have done this, you may need to close out of the terminal and open a new one.

## Notes

It was far from obvious, but this was what it took to produce a cross-platform
CLI:

- There MUST be a custom `webpack.config.js` which uses the `BannerPlugin` to
  add a shebang to the top of the compiled `main.js`. This shebang must be
  present _even on Windows machines_ because
  [npm sets up a windows command](https://stackoverflow.com/a/10398567/6562635)
  if your script has a very particular shebang at the top.
- In the Nx / Webpack configuration, you MUST set `externalDependencies` to
  `none`. Otherwise, the compiled `main.js` will still expect there to be a
  `node_modules` folder with all of the dependencies, which is not viable for
  a command-line interface.