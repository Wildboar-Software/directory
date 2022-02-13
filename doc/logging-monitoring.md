# Logging and Monitoring

Meerkat DSA supports internationalized logging, and using different formats.
Under the hood, Meerkat DSA uses
[winston](https://www.npmjs.com/package/winston) for logging, which means that
almost any logging format and logging transport may be used. By default,
Meerkat DSA logs plain text to the console.

## Internationalization

The language of the logging used by Meerkat DSA is determined by the system's
environment variable `LANG`. If your selected language is not supported, English
will be used as a default.

Currently, only English is supported, but future editions may support other
languages.

## Log Levels

In Meerkat DSA, there are four log levels, which are common to many
applications. Their meanings are described below:

- `debug`-level messages are messages that log requests and responses, which
  can be useful for seeing error messages. Note that errors in requests will
  be logged at `debug` level, not `error` or `warn`.
- `info`-level messages are messages that may serve as important "landmarks"
  for DSA administrators, but which have little value by themselves, such as
  seeing that the server began listening, or that a client connected.
- `warn`-level messages are messages that indicate a potential problem with
  the DSA, confidentiality, data integrity, availability, etc.
- `error`-level messages are messages that have emerged from errors that
  require administrator attention, such as data corruption, loops, invalid
  schema, database connectivity issues, resource constraints, etc.

## Customizing Logging the Simple Way

You can configure logging through environment variables.

- Setting `MEERKAT_NO_COLOR` to `1` will disable colored logging output.
- Setting `MEERKAT_NO_TIMESTAMP` to `1` will disable the timestamp from log
  messages.
- Setting `MEERKAT_LOG_LEVEL` to a log level will log all messages having a
  severity at that level or higher. It may be set to `debug`, `info`, `warn`,
  or `error`, in order of decreasing verbosity. The default is `info`.
- Setting `MEERKAT_LOG_JSON` to `1` will cause Meerkat DSA to output logs in
  JSON format.
- Setting `MEERKAT_NO_CONSOLE` to `1` will disable logging to the console.
  Note that if you have no other log transport configured, no logs will be
  collected at all.
- Setting `MEERKAT_LOG_FILE` to the file path of a file to write logs will
  cause Meerkat DSA to write logs to that file.
- `MEERKAT_LOG_FILE_MAX_SIZE` controls the number of bytes permitted in a
  log file before it is rotated out for a new log file. This has no effect if
  `MEERKAT_LOG_FILE` is not set.
- `MEERKAT_LOG_FILE_MAX_FILES` controls the maximum number of log files
  before which Meerkat DSA deletes the oldest one.
- Setting `MEERKAT_LOG_ZIP` to `1` will make Meerkat DSA compress rotated-out
  log files.
- Setting `MEERKAT_LOG_TAILABLE` to `1` will... just read this: https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#file-transport.
- Setting `MEERKAT_LOG_HTTP` to a URL will cause Meerkat DSA to use HTTP
  transport for log messages. URL-based usernames and passwords may be used,
  which will enable the use of HTTP basic authentication.

## Customizing Log Formats and Transports via the Init Script

In addition to the above logging configuration via environment variables,
logging can be customized via the init script. See the example below:

```javascript
import winston from "winston";

export async function init (ctx) {
  ctx.log = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
    ],
  });
}

export default init;
```

The example above overwrites the context object's `log` property with your
own logger, which uses the JSON format.

## SNMP Monitoring

Meerkat DSA will support SNMP monitoring in a paid version in the future.

## Webhooks

Meerkat DSA will support custom webhooks in a paid version in the future. These
webhooks can be used to collect telemetry data.

## "Why are errors logged at DEBUG level?"

When a user gets an error as a result of doing something wrong, (e.g. creating
an entry where they are not allowed by access control, or creating an entry that
does not conform to schema requirements), it is not an _issue_ for Meerkat DSA
to respond with an error: it is expected behavior, in fact. The logs are meant
for DSA administrators, not users, and therefore the level or log messages
should reflect the level of attention that an administrator should pay to a
message. Error messages should be displayed, say, if the database is corrupted,
the server is configured insecurely, resource utilization is unusually high,
connections are getting dropped, etc.

Note that some user-facing errors _will_ show up in non-debug level log
messages: namely invalid authentication attempts. Invalid authentication
attempts are logged at WARN level, because repeated invalid attempts could
indicate a brute-force password-guessing attack, or some other hacking attempt,
which might warrant administrative intervention.

Also note that, in the future, a large number of errors may result in
error-level messages (as well as connections being dropped or blocked), because
an unusually large number of errors may also indicate attempted hacking.

## "Why log connection IDs instead of IP addresses?"

There is a lot of information that goes into a connection / association:

- Bound DN
- Auth Level
- Address family
- Remote address
- Remote port
- Protocol
- Whether TLS is used

Therefore, to avoid duplicating all of this information, it makes sense just to
log, upon binding, all of this information one time alongside the UUID assigned
to the association, so that from there out, the first message containing this
UUID can be used to correlate the UUID to all of these data.

Also, it makes it easier to redact PII, if IP addresses count as such.
