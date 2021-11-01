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

## Customizing Log Formats and Transports

Logging can be customized via the init script. See the example below:

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
