"use strict";(self.webpackChunkdirectory=self.webpackChunkdirectory||[]).push([[412],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>p});var i=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},a=Object.keys(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=i.createContext({}),g=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=g(e.components);return i.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},m=i.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),m=g(n),p=o,c=m["".concat(s,".").concat(p)]||m[p]||u[p]||a;return n?i.createElement(c,r(r({ref:t},d),{},{components:n})):i.createElement(c,r({ref:t},d))}));function p(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,r=new Array(a);r[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,r[1]=l;for(var g=2;g<a;g++)r[g]=n[g];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4491:(e,t,n)=>{n.r(t),n.d(t,{contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>g,toc:()=>d});var i=n(7462),o=n(3366),a=(n(7294),n(3905)),r=["components"],l={},s="Logging and Monitoring",g={unversionedId:"logging-monitoring",id:"logging-monitoring",title:"Logging and Monitoring",description:"Meerkat DSA supports internationalized logging, and using different formats.",source:"@site/docs/logging-monitoring.md",sourceDirName:".",slug:"/logging-monitoring",permalink:"/directory/docs/logging-monitoring",editUrl:"https://github.com/Wildboar-Software/directory/edit/main/website/docs/logging-monitoring.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Authentication",permalink:"/directory/docs/authentication"},next:{title:"Schema Administration",permalink:"/directory/docs/schema"}},d=[{value:"Internationalization",id:"internationalization",children:[],level:2},{value:"Log Levels",id:"log-levels",children:[],level:2},{value:"Customizing Logging the Simple Way",id:"customizing-logging-the-simple-way",children:[],level:2},{value:"Customizing Log Formats and Transports via the Init Script",id:"customizing-log-formats-and-transports-via-the-init-script",children:[],level:2},{value:"SNMP Monitoring",id:"snmp-monitoring",children:[],level:2},{value:"Webhooks",id:"webhooks",children:[],level:2},{value:"&quot;Why are errors logged at DEBUG level?&quot;",id:"why-are-errors-logged-at-debug-level",children:[],level:2},{value:"&quot;Why log connection IDs instead of IP addresses?&quot;",id:"why-log-connection-ids-instead-of-ip-addresses",children:[],level:2}],u={toc:d};function m(e){var t=e.components,n=(0,o.Z)(e,r);return(0,a.kt)("wrapper",(0,i.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"logging-and-monitoring"},"Logging and Monitoring"),(0,a.kt)("p",null,"Meerkat DSA supports internationalized logging, and using different formats.\nUnder the hood, Meerkat DSA uses\n",(0,a.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/winston"},"winston")," for logging, which means that\nalmost any logging format and logging transport may be used. By default,\nMeerkat DSA logs plain text to the console."),(0,a.kt)("h2",{id:"internationalization"},"Internationalization"),(0,a.kt)("p",null,"The language of the logging used by Meerkat DSA is determined by the system's\nenvironment variable ",(0,a.kt)("inlineCode",{parentName:"p"},"LANG"),". If your selected language is not supported, English\nwill be used as a default."),(0,a.kt)("p",null,"Currently, only English is supported, but future editions may support other\nlanguages."),(0,a.kt)("h2",{id:"log-levels"},"Log Levels"),(0,a.kt)("p",null,"In Meerkat DSA, there are four log levels, which are common to many\napplications. Their meanings are described below:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"debug"),"-level messages are messages that log requests and responses, which\ncan be useful for seeing error messages. Note that errors in requests will\nbe logged at ",(0,a.kt)("inlineCode",{parentName:"li"},"debug")," level, not ",(0,a.kt)("inlineCode",{parentName:"li"},"error")," or ",(0,a.kt)("inlineCode",{parentName:"li"},"warn"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"info"),'-level messages are messages that may serve as important "landmarks"\nfor DSA administrators, but which have little value by themselves, such as\nseeing that the server began listening, or that a client connected.'),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"warn"),"-level messages are messages that indicate a potential problem with\nthe DSA, confidentiality, data integrity, availability, etc."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"error"),"-level messages are messages that have emerged from errors that\nrequire administrator attention, such as data corruption, loops, invalid\nschema, database connectivity issues, resource constraints, etc.")),(0,a.kt)("h2",{id:"customizing-logging-the-simple-way"},"Customizing Logging the Simple Way"),(0,a.kt)("p",null,"You can configure logging through environment variables."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_NO_COLOR")," to ",(0,a.kt)("inlineCode",{parentName:"li"},"1")," will disable colored logging output."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_NO_TIMESTAMP")," to ",(0,a.kt)("inlineCode",{parentName:"li"},"1")," will disable the timestamp from log\nmessages."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_LEVEL")," to a log level will log all messages having a\nseverity at that level or higher. It may be set to ",(0,a.kt)("inlineCode",{parentName:"li"},"debug"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"info"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"warn"),",\nor ",(0,a.kt)("inlineCode",{parentName:"li"},"error"),", in order of decreasing verbosity. The default is ",(0,a.kt)("inlineCode",{parentName:"li"},"info"),"."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_JSON")," to ",(0,a.kt)("inlineCode",{parentName:"li"},"1")," will cause Meerkat DSA to output logs in\nJSON format."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_NO_CONSOLE")," to ",(0,a.kt)("inlineCode",{parentName:"li"},"1")," will disable logging to the console.\nNote that if you have no other log transport configured, no logs will be\ncollected at all."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_FILE")," to the file path of a file to write logs will\ncause Meerkat DSA to write logs to that file."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_FILE_MAX_SIZE")," controls the number of bytes permitted in a\nlog file before it is rotated out for a new log file. This has no effect if\n",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_FILE")," is not set."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_FILE_MAX_FILES")," controls the maximum number of log files\nbefore which Meerkat DSA deletes the oldest one."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_ZIP")," to ",(0,a.kt)("inlineCode",{parentName:"li"},"1")," will make Meerkat DSA compress rotated-out\nlog files."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_TAILABLE")," to ",(0,a.kt)("inlineCode",{parentName:"li"},"1")," will... just read this: ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#file-transport"},"https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#file-transport"),"."),(0,a.kt)("li",{parentName:"ul"},"Setting ",(0,a.kt)("inlineCode",{parentName:"li"},"MEERKAT_LOG_HTTP")," to a URL will cause Meerkat DSA to use HTTP\ntransport for log messages. URL-based usernames and passwords may be used,\nwhich will enable the use of HTTP basic authentication.")),(0,a.kt)("h2",{id:"customizing-log-formats-and-transports-via-the-init-script"},"Customizing Log Formats and Transports via the Init Script"),(0,a.kt)("p",null,"In addition to the above logging configuration via environment variables,\nlogging can be customized via the init script. See the example below:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},'import winston from "winston";\n\nexport async function init (ctx) {\n  ctx.log = winston.createLogger({\n    level: "info",\n    format: winston.format.json(),\n    transports: [\n      new winston.transports.Console(),\n    ],\n  });\n}\n\nexport default init;\n')),(0,a.kt)("p",null,"The example above overwrites the context object's ",(0,a.kt)("inlineCode",{parentName:"p"},"log")," property with your\nown logger, which uses the JSON format."),(0,a.kt)("h2",{id:"snmp-monitoring"},"SNMP Monitoring"),(0,a.kt)("p",null,"Meerkat DSA will support SNMP monitoring in a paid version in the future."),(0,a.kt)("h2",{id:"webhooks"},"Webhooks"),(0,a.kt)("p",null,"Meerkat DSA will support custom webhooks in a paid version in the future. These\nwebhooks can be used to collect telemetry data."),(0,a.kt)("h2",{id:"why-are-errors-logged-at-debug-level"},'"Why are errors logged at DEBUG level?"'),(0,a.kt)("p",null,"When a user gets an error as a result of doing something wrong, (e.g. creating\nan entry where they are not allowed by access control, or creating an entry that\ndoes not conform to schema requirements), it is not an ",(0,a.kt)("em",{parentName:"p"},"issue")," for Meerkat DSA\nto respond with an error: it is expected behavior, in fact. The logs are meant\nfor DSA administrators, not users, and therefore the level or log messages\nshould reflect the level of attention that an administrator should pay to a\nmessage. Error messages should be displayed, say, if the database is corrupted,\nthe server is configured insecurely, resource utilization is unusually high,\nconnections are getting dropped, etc."),(0,a.kt)("p",null,"Note that some user-facing errors ",(0,a.kt)("em",{parentName:"p"},"will")," show up in non-debug level log\nmessages: namely invalid authentication attempts. Invalid authentication\nattempts are logged at WARN level, because repeated invalid attempts could\nindicate a brute-force password-guessing attack, or some other hacking attempt,\nwhich might warrant administrative intervention."),(0,a.kt)("p",null,"Also note that, in the future, a large number of errors may result in\nerror-level messages (as well as connections being dropped or blocked), because\nan unusually large number of errors may also indicate attempted hacking."),(0,a.kt)("h2",{id:"why-log-connection-ids-instead-of-ip-addresses"},'"Why log connection IDs instead of IP addresses?"'),(0,a.kt)("p",null,"There is a lot of information that goes into a connection / association:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Bound DN"),(0,a.kt)("li",{parentName:"ul"},"Auth Level"),(0,a.kt)("li",{parentName:"ul"},"Address family"),(0,a.kt)("li",{parentName:"ul"},"Remote address"),(0,a.kt)("li",{parentName:"ul"},"Remote port"),(0,a.kt)("li",{parentName:"ul"},"Protocol"),(0,a.kt)("li",{parentName:"ul"},"Whether TLS is used")),(0,a.kt)("p",null,"Therefore, to avoid duplicating all of this information, it makes sense just to\nlog, upon binding, all of this information one time alongside the UUID assigned\nto the association, so that from there out, the first message containing this\nUUID can be used to correlate the UUID to all of these data."),(0,a.kt)("p",null,"Also, it makes it easier to redact Personally-Identifiable Information (PII), if\nIP addresses count as such."))}m.isMDXComponent=!0}}]);