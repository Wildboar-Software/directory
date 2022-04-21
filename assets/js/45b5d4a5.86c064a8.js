"use strict";(self.webpackChunkdirectory=self.webpackChunkdirectory||[]).push([[141],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=c(n),m=i,h=d["".concat(s,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(h,a(a({ref:t},p),{},{components:n})):r.createElement(h,a({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var c=2;c<o;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5474:(e,t,n)=>{n.r(t),n.d(t,{contentTitle:()=>s,default:()=>d,frontMatter:()=>l,metadata:()=>c,toc:()=>p});var r=n(7462),i=n(3366),o=(n(7294),n(3905)),a=["components"],l={},s="Networking",c={unversionedId:"networking",id:"networking",title:"Networking",description:"Directory Protocols",source:"@site/docs/networking.md",sourceDirName:".",slug:"/networking",permalink:"/directory/docs/networking",editUrl:"https://github.com/Wildboar-Software/directory/edit/main/website/docs/networking.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Schema Administration",permalink:"/directory/docs/schema"},next:{title:"Operational Bindings",permalink:"/directory/docs/opbinding"}},p=[{value:"Directory Protocols",id:"directory-protocols",children:[],level:2},{value:"The Web Console",id:"the-web-console",children:[],level:2},{value:"Distributed Operation",id:"distributed-operation",children:[],level:2},{value:"TLS Configuration",id:"tls-configuration",children:[],level:2},{value:"Result Signing",id:"result-signing",children:[],level:2},{value:"DNS Configuration",id:"dns-configuration",children:[],level:2},{value:"The Future",id:"the-future",children:[],level:2}],u={toc:p};function d(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"networking"},"Networking"),(0,o.kt)("h2",{id:"directory-protocols"},"Directory Protocols"),(0,o.kt)("p",null,"Currently, Meerkat DSA only supports the transport of X.500 protocols via IDM\nor IDMS (IDM encapsulated in TLS).\nLDAP may be used as well, and may be optionally encapsulated in TLS. For both\ncategories of protocols, StartTLS may be used as well."),(0,o.kt)("p",null,"The protocols which Meerkat DSA uses can be controlled by the following\nenvironment variables, which specify the port number on which these services\nlisten:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_WEB_ADMIN_PORT")," (Recommended: 18080; be careful when exposing this.)"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_IDM_PORT")," (Recommended: 4632)"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_IDMS_PORT")," (Recommended: 44632)"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_LDAP_PORT")," (Recommended: 389; requires root privileges)"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_LDAPS_PORT")," (Recommended: 636; requires root privileges)")),(0,o.kt)("p",null,"If a port number is set, Meerkat DSA listens on that port for the given service.\nIf no port is set, that service does not listen at all. This means that it is\npossible to run Meerkat DSA as an LDAP-only or X.500-only server by simply\nnot configuring ports for those services."),(0,o.kt)("h2",{id:"the-web-console"},"The Web Console"),(0,o.kt)("p",null,"Meerkat DSA also provides a web-based administrative console, which does not\nlisten over TLS and which provides no authentication or security at all. ",(0,o.kt)("strong",{parentName:"p"},"Users\nare expected to place some sort of proxy in front of this that requires\nauthentication, or simply not expose it at all.")," It is only necessary for\naccepting or rejecting requested operational bindings; everything else can be\ndone using the X.500 protocols. In the future, we will find a way to make even\nthis possible without the web console."),(0,o.kt)("p",null,"Note that listening with the web-based\nadministrative console is a ",(0,o.kt)("strong",{parentName:"p"},"security risk")," because there is no\nauthentication or access controls required; all entries in memory may be read,\nentries may be deleted, and many more hazards. If you do not expect to need\nthis, it is strongly recommended that you do not enable it. Also note that, even\nif authentication is configured for the web console via a proxy, there may be\nother security issues; we suspect it may be vulnerable to CSRF, but this has yet\nto be tested."),(0,o.kt)("h2",{id:"distributed-operation"},"Distributed Operation"),(0,o.kt)("p",null,"For distributed operations, Meerkat DSA stores the access points obtained from\nknowledge attributes in the ",(0,o.kt)("inlineCode",{parentName:"p"},"AccessPoint")," table. Currently, Meerkat DSA can only\nmake use of IDM-based (and IDMS-based) access points. All other access points\nwill be ignored."),(0,o.kt)("p",null,"You may directly alter the rows in the ",(0,o.kt)("inlineCode",{parentName:"p"},"AccessPoint"),' table to add or remove\naccess points, but Meerkat DSA may have to be restarted for your changes to\ntake effect. (We say "may" literally: it might not require a restart if you are\nnot using in-memory caching of the DIT.) It is recommended that you instead use\nthe Directory Access Protocol with the ',(0,o.kt)("inlineCode",{parentName:"p"},"manageDSAIT")," flag set to modify\nknowledge attributes rather than altering the database directly."),(0,o.kt)("h2",{id:"tls-configuration"},"TLS Configuration"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Many details in this section will change soon.")),(0,o.kt)("p",null,"TLS can be configured via the following environment variables:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_TLS_CERT_FILE")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_TLS_KEY_FILE"))),(0,o.kt)("p",null,"Or by including"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_TLS_PFX_FILE"))),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"MEERKAT_TLS_CERT_FILE")," contains a file path to the X.509 certificate to be\nused for TLS. ",(0,o.kt)("inlineCode",{parentName:"p"},"MEERKAT_TLS_KEY_FILE")," shall contain the file path to the\nprivate key to be used for TLS. If both of these are present, TLS will be\nenabled. Otherwise, TLS will silently fail."),(0,o.kt)("p",null,"If either the key file or PFX file are password-protected, these can be\ndecrypted by supplying the passphrase in the ",(0,o.kt)("inlineCode",{parentName:"p"},"MEERKAT_TLS_KEY_PASSPHRASE"),"\nenvironment variable."),(0,o.kt)("h2",{id:"result-signing"},"Result Signing"),(0,o.kt)("p",null,"Currently, results may not be digitally-signed by Meerkat DSA, but the keypair\nto be used for digital-signing (eventually) can be configured via these\nenvironment variables:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_SIGNING_CERT_CHAIN")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_SIGNING_KEY"))),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"MEERKAT_SIGNING_CERT_CHAIN")," contains the file path to the PEM-encoded X.509\ncertificate chain. ",(0,o.kt)("inlineCode",{parentName:"p"},"MEERKAT_SIGNING_KEY")," shall contain the file path to the\nprivate key to be used for results signing."),(0,o.kt)("p",null,"Note that these settings may differ from the keypair used for TLS. This is\nintentional, because DSA administrators may want results to be signed with a\ndifferent keypair that what is used for transport-layer security."),(0,o.kt)("p",null,"Even if you do not plan to use results signing, you should still configure a\nsigning key-pair."),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"Meerkat DSA determines it's Application Entity (AE) title from its signing certificate.")),(0,o.kt)("h2",{id:"dns-configuration"},"DNS Configuration"),(0,o.kt)("p",null,"It is not necessary at all, but for the sake of service discovery, it is\nrecommended that you configure DNS for your domain to name your directory as\na service using ",(0,o.kt)("inlineCode",{parentName:"p"},"SRV")," records. If you want to keep your directory a secret, it\nis advised that you refrain from exposing it to the global Internet at all."),(0,o.kt)("p",null,"SRV records should be defined for IDM, IDMS, LDAP, and LDAPS like so:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"_idm._tcp.example.com 3600 IN SRV 0 5 <IDM port number> dsa01.example.com\n_idms._tcp.example.com 3600 IN SRV 0 5 <IDMS port number> dsa01.example.com\n_ldap._tcp.example.com 3600 IN SRV 0 5 <LDAP port number> dsa01.example.com\n_ldaps._tcp.example.com 3600 IN SRV 0 5 <LDAPS port number> dsa01.example.com\n")),(0,o.kt)("p",null,"Note that, in the above example you will need to swap out ",(0,o.kt)("inlineCode",{parentName:"p"},"example.com")," with\nyour domain, ",(0,o.kt)("inlineCode",{parentName:"p"},"dsa01")," with your DSA's host name, the port numbers enclosed in\nbrackets above and configure the other SRV record parameters as you see fit."),(0,o.kt)("p",null,"You will also need A and/or AAAA records corresponding to the hostnames on the\nright hand side of the SRV records."),(0,o.kt)("p",null,"Again, DNS configuration is NOT required for Meerkat DSA to work."),(0,o.kt)("h2",{id:"the-future"},"The Future"),(0,o.kt)("p",null,"In the future, Meerkat DSA may support:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"TOR / Onion Routing / SOCKS Transport"),(0,o.kt)("li",{parentName:"ul"},"ZMQ Transport"),(0,o.kt)("li",{parentName:"ul"},"ITOT Transport"),(0,o.kt)("li",{parentName:"ul"},"LPP Transport")))}d.isMDXComponent=!0}}]);