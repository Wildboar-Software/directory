"use strict";(self.webpackChunkdirectory=self.webpackChunkdirectory||[]).push([[9168],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=a.createContext({}),d=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=d(n),h=i,m=c["".concat(l,".").concat(h)]||c[h]||u[h]||r;return n?a.createElement(m,o(o({ref:t},p),{},{components:n})):a.createElement(m,o({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:i,o[1]=s;for(var d=2;d<r;d++)o[d]=n[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},8851:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>d,toc:()=>c});var a=n(7462),i=n(3366),r=(n(7294),n(3905)),o=["components"],s={},l="Authentication",d={unversionedId:"authentication",id:"authentication",title:"Authentication",description:"Meerkat DSA supports simple authentication (meaning authentication with a",source:"@site/docs/authentication.md",sourceDirName:".",slug:"/authentication",permalink:"/directory/docs/authentication",draft:!1,editUrl:"https://github.com/Wildboar-Software/directory/edit/main/website/docs/authentication.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Authorization",permalink:"/directory/docs/authorization"},next:{title:"Logging and Monitoring",permalink:"/directory/docs/logging-monitoring"}},p={},c=[{value:"Anonymous Authentication",id:"anonymous-authentication",level:2},{value:"How Meerkat DSA Handles Passwords",id:"how-meerkat-dsa-handles-passwords",level:2},{value:"Simple Protected Passwords",id:"simple-protected-passwords",level:2},{value:"How to Set or Change Passwords",id:"how-to-set-or-change-passwords",level:2},{value:"Password Policy",id:"password-policy",level:2},{value:"Password Dictionaries",id:"password-dictionaries",level:3},{value:"Password Lockouts",id:"password-lockouts",level:3},{value:"Strong Authentication",id:"strong-authentication",level:2},{value:"SPKM Authentication",id:"spkm-authentication",level:2},{value:"External Authentication",id:"external-authentication",level:2},{value:"TLS Client Certificate Authentication",id:"tls-client-certificate-authentication",level:3},{value:"Custom External Authentication Procedures",id:"custom-external-authentication-procedures",level:3},{value:"Architectural Details",id:"architectural-details",level:2}],u={toc:c},h="wrapper";function m(e){var t=e.components,n=(0,i.Z)(e,o);return(0,r.kt)(h,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"authentication"},"Authentication"),(0,r.kt)("p",null,"Meerkat DSA supports simple authentication (meaning authentication with a\npassword) and strong authentication (meaning authentication with digital signatures)\nin DAP, DSP, and DOP. LDAP only supports simple authentication."),(0,r.kt)("h2",{id:"anonymous-authentication"},"Anonymous Authentication"),(0,r.kt)("p",null,"Users of Meerkat DSA may bind anonymously by supplying no password. If this is\nused, authentication will always succeed, even if the bound distinguished name\ndoes not correspond to any real entry present and even if the entry ",(0,r.kt)("em",{parentName:"p"},"does")," exist\nand has a password. This behavior is to avoid information disclosure."),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},'If Meerkat DSA did not do this, it would be possible for a nefarious\nactor to enumerate the entries in a DSA, despite access controls, by guessing\ndistinguished names in the bind operation and seeing which attempts come back\nwith errors saying "entry does not exist" and which come back with "invalid\npassword." This is the same reason that websites with logins must give you the\nsame error message, regardless of whether you got the username or password\nwrong.')),(0,r.kt)("p",null,"When users are bound anonymously, they may perform operations against Meerkat\nDSA. It is the responsibility of administrators to configure access controls to\nprevent anonymous users from doing things they should not be able to do."),(0,r.kt)("p",null,"Currently, anonymous usage can only be prevented by access control, but a future\nfeature will enable administrators to reject all anonymous traffic."),(0,r.kt)("h2",{id:"how-meerkat-dsa-handles-passwords"},"How Meerkat DSA Handles Passwords"),(0,r.kt)("p",null,"In the X.500 specifications, there is no specified attribute that is expected to\nserve as the authoritative source of the password for an entry. Each DSA may\nchoose to use a different attribute type to store password information; in fact,\npasswords might not even be stored in entries at all! This is why the\n",(0,r.kt)("inlineCode",{parentName:"p"},"administerPassword")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"changePassword")," operations were introduced to the\nDirectory Access Protocol (DAP)."),(0,r.kt)("p",null,"In Meerkat DSA, both the ",(0,r.kt)("inlineCode",{parentName:"p"},"userPassword")," attribute (specified in\n",(0,r.kt)("a",{parentName:"p",href:"https://www.itu.int/rec/T-REC-X.509/en"},"ITU Recommendation X.509"),") and the\n",(0,r.kt)("inlineCode",{parentName:"p"},"userPwd")," attribute (specified in\n",(0,r.kt)("a",{parentName:"p",href:"https://www.itu.int/rec/T-REC-X.520/en"},"ITU Recommendation X.520"),") are used.\nHowever, regardless of any access controls, whenever these values are read, they\nreturn empty strings. This is because passwords are extremely sensitive, and\nlet's face it: people re-use passwords between services. To prevent\nadministrators from misconfiguring Meerkat DSA and leaking all of their users'\npasswords, the passwords are simply never returned, even if queried directly,\nand even if access controls permit it. An empty string is returned as the value\nso that directory users can at least know ",(0,r.kt)("em",{parentName:"p"},"if")," an entry has a password. In other\nwords, passwords are ",(0,r.kt)("em",{parentName:"p"},"write-only")," in Meerkat DSA. This also applies to the\nencrypted variants of passwords: they are never returned so that they can never\nbe used for\n",(0,r.kt)("a",{parentName:"p",href:"https://csrc.nist.gov/glossary/term/offline_attack"},"offline password cracking"),"."),(0,r.kt)("p",null,"The password is stored in the database. If password is supplied using cleartext,\nit will be salted and hashed using the Scrypt algorithm and stored in the\ndatabase. If the password is already encrypted / hashed, it will be stored using\nthe algorithm that was used to encrypt it."),(0,r.kt)("h2",{id:"simple-protected-passwords"},"Simple Protected Passwords"),(0,r.kt)("p",null,"Simple authentication allows users to supply a ",(0,r.kt)("inlineCode",{parentName:"p"},"protected")," password. Unlike the\n",(0,r.kt)("inlineCode",{parentName:"p"},"unprotected")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"userPwd")," variants of the simple credentials password, this\nvariation can be protected against\n",(0,r.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Replay_attack"},"replay attacks"),", and it provides\na form of eavesdropping-mitigating encryption, even when TLS is not used to\nsecure the connection."),(0,r.kt)("p",null,"There is no specified algorithm for producing a ",(0,r.kt)("inlineCode",{parentName:"p"},"protected")," password, although\n",(0,r.kt)("a",{parentName:"p",href:"https://www.itu.int/rec/T-REC-X.511/en"},"ITU Recommendation X.511 (2019)"),",\nAnnex E, provides a suggested algorith. Meerkat DSA deviates from this\nalgorithm slightly for security reasons. The entirety of the procedures used by\nMeerkat DSA are documented ",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/deviations-nuances#protected-passwords"},"here"),"."),(0,r.kt)("p",null,"In short, to produce a protected password, a client must produce a DER-encoded\nvalue of an ASN.1 value having the following type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-asn1"},'Meerkats-Actual-Hashable1 ::= SEQUENCE {\n    name        DistinguishedName,\n    time1       GeneralizedTime,\n    random1     BIT STRING OPTIONAL,\n    password    encrypted < UserPwd -- This is an ASN.1 "selection type." -- }\n')),(0,r.kt)("p",null,"In the above type, ",(0,r.kt)("inlineCode",{parentName:"p"},"name")," is the distinguished name to which the user is\nattempting to bind, ",(0,r.kt)("inlineCode",{parentName:"p"},"time1")," is a time a few seconds into the future, ",(0,r.kt)("inlineCode",{parentName:"p"},"random1"),"\nis a sequence of randomly-generated bits of any length (preferrably at least 64\nbits), and ",(0,r.kt)("inlineCode",{parentName:"p"},"password")," is the ",(0,r.kt)("inlineCode",{parentName:"p"},"UserPwd")," construction of the user's password,\nwhich ",(0,r.kt)("em",{parentName:"p"},"must")," use the ",(0,r.kt)("inlineCode",{parentName:"p"},"encrypted")," alternative, and"),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"It is strongly advised to use protected passwords whenever simple authentication\nis used, since they are immune to replay attacks.")),(0,r.kt)("h2",{id:"how-to-set-or-change-passwords"},"How to Set or Change Passwords"),(0,r.kt)("p",null,"You may set or modify a password for an entry in four ways:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"At creation time, by including password attributes in the ",(0,r.kt)("inlineCode",{parentName:"li"},"addEntry")," operation."),(0,r.kt)("li",{parentName:"ul"},"By modifying the entry via the ",(0,r.kt)("inlineCode",{parentName:"li"},"modifyEntry")," operation.",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"If this is performed within a password administrative area, this requires\nthe ",(0,r.kt)("inlineCode",{parentName:"li"},"pwdModifyEntryAllowed")," operational attribute for the applicable\nsubentry to have a value of ",(0,r.kt)("inlineCode",{parentName:"li"},"TRUE"),"."))),(0,r.kt)("li",{parentName:"ul"},"By modifying the entry via the ",(0,r.kt)("inlineCode",{parentName:"li"},"changePassword")," operation",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"If this is performed within a password administrative area, this requires\nthe ",(0,r.kt)("inlineCode",{parentName:"li"},"pwdChangeAllowed")," operational attribute for the applicable subentry to\nhave a value of ",(0,r.kt)("inlineCode",{parentName:"li"},"TRUE"),"."))),(0,r.kt)("li",{parentName:"ul"},"By modifying the entry via the ",(0,r.kt)("inlineCode",{parentName:"li"},"administerPassword")," operation",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"In addition to requiring permission to add / modify / delete the ",(0,r.kt)("inlineCode",{parentName:"li"},"userPwd"),"\nand ",(0,r.kt)("inlineCode",{parentName:"li"},"userPassword")," values, as is the case for the other three, this option\nalso requires the same permissions for the ",(0,r.kt)("inlineCode",{parentName:"li"},"userPwdHistory")," attribute."),(0,r.kt)("li",{parentName:"ul"},"Note that, when this operation is used, the user will have to reset his or\nher password upon logging in again.")))),(0,r.kt)("p",null,"It is recommended to use the ",(0,r.kt)("inlineCode",{parentName:"p"},"administerPassword")," and/or ",(0,r.kt)("inlineCode",{parentName:"p"},"changePassword"),"\noperations to modify an entry's password, rather than the ",(0,r.kt)("inlineCode",{parentName:"p"},"modifyEntry")," or\n",(0,r.kt)("inlineCode",{parentName:"p"},"addEntry")," operations."),(0,r.kt)("h2",{id:"password-policy"},"Password Policy"),(0,r.kt)("p",null,"Meerkat DSA allows you to configure password policy exactly as described in ITU\nRecommendations X.501 and X.520."),(0,r.kt)("h3",{id:"password-dictionaries"},"Password Dictionaries"),(0,r.kt)("p",null,"You can configure password vocabulary by adding entries to the\n",(0,r.kt)("inlineCode",{parentName:"p"},"passwordDictionaryItem"),' table in the database (usually MySQL), along with a\n"bit number" indicating the category in which the vocabulary item appears,\naccording to the syntax of the ',(0,r.kt)("inlineCode",{parentName:"p"},"pwdVocabulary")," operational attribute, which is:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-asn1"},"PwdVocabulary ::= BIT STRING {\n  noDictionaryWords (0),\n  noPersonNames (1),\n  noGeographicalNames (2) }\n")),(0,r.kt)("p",null,"This means that, if you set the ",(0,r.kt)("inlineCode",{parentName:"p"},"bit")," to ",(0,r.kt)("inlineCode",{parentName:"p"},"2"),', the row that you create will be\nconsidered a "geographical name." ',(0,r.kt)("strong",{parentName:"p"},"Password dictionary items inserted into the\ndatabase MUST be upper-cased, or they will have no effect.")),(0,r.kt)("p",null,"There is no way to configure password dictionaries via DAP, currently. The\n",(0,r.kt)("inlineCode",{parentName:"p"},"pwdDictionaries")," is purely informative and is not used by the directory in any\nway."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},'It is recommended that you DO NOT use this operational attribute, as it goes\nagainst modern guidance on password-based authentication. Namely, it is actually\nrecommended to construct passwords from four or more dictionary words, as such\npasswords are more memorable, yet provide much more entropy than the\nprior guidance of the "8 characters minimum, at least one digit, at least one\nsymbol, etc." password.')),(0,r.kt)("h3",{id:"password-lockouts"},"Password Lockouts"),(0,r.kt)("p",null,"Meerkat DSA fully supports password lockouts, as described in\n",(0,r.kt)("a",{parentName:"p",href:"https://www.itu.int/rec/T-REC-X.511/en"},"ITU Recommendation X.511 (2019)"),'. This\nmeans that administrators can configure their directories to "lock out" users\nafter so many failed authentication attempts.'),(0,r.kt)("p",null,"To enable password lockouts, just set the ",(0,r.kt)("inlineCode",{parentName:"p"},"pwdMaxFailures")," operational attribute\non the applicable password administration subentries. You can make the lockout\ntemporary using the ",(0,r.kt)("inlineCode",{parentName:"p"},"pwdLockoutDuration")," operational attribute, if desired."),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"Enabling password lockouts might not be a good idea. This feature can allow\nnefarious users to purposefully guess wrong passwords for other users to lock\nthem out of their accounts. It may be a good idea to refrain from enabling this\nunless you are having problems with brute-force attacks, and even then, the\n",(0,r.kt)("inlineCode",{parentName:"p"},"pwdLockoutDuration")," should be set to a low value to ensure that accounts are\nautomatically unlocked after a short period of time.")),(0,r.kt)("h2",{id:"strong-authentication"},"Strong Authentication"),(0,r.kt)("p",null,"Meerkat DSA supports strong authentication. If a certification path is supplied,\nthis is used to verify the signature and trustworthiness of the bind token\nprovided in strong authentication."),(0,r.kt)("p",null,"If a certification path is ",(0,r.kt)("em",{parentName:"p"},"not")," supplied in the bind argument, but a name ",(0,r.kt)("em",{parentName:"p"},"is"),"\nsupplied (via the ",(0,r.kt)("inlineCode",{parentName:"p"},"name")," parameter), and if the environment variable\n",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/env#meerkatlookupuncertstrongauth"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_LOOKUP_UNCERT_STRONG_AUTH"))," is\nset to ",(0,r.kt)("inlineCode",{parentName:"p"},"1")," (enabled), Meerkat DSA searches internally for a user by the asserted\ndistinguished name; if this user is found, and it is of object class\n",(0,r.kt)("inlineCode",{parentName:"p"},"pkiCertPath"),", and it has an attribute of type ",(0,r.kt)("inlineCode",{parentName:"p"},"pkiPath"),", each value of its\n",(0,r.kt)("inlineCode",{parentName:"p"},"pkiPath")," attribute is tried until a certification path is found that verifies\nthe bind token. If no such vindicating certification path is found, Meerkat DSA\nrejects the authentication attempt. It is strongly preferred for clients to\nsupply a certification path in the bind argument so that this lookup need not\nhappen."),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"Enabling the above feature is risky, since it can open your DSA up to\ndenial-of-service attacks. See more\n",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/env#meerkatlookupuncertstrongauth"},"here"),".")),(0,r.kt)("p",null,"The certification path is verified with the trust anchors configured in\n",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/env#meerkatsigningcafile"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_SIGNING_CA_FILE")),". If this environment\nvariable is not configured, the bundle of certificates that are built in to\nthe NodeJS runtime are used by default."),(0,r.kt)("p",null,"If ",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/env#meerkatsigningdisableverification"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_SIGNING_DISABLE_VERIFICATION")),"\nis enabled (meaning that all signature verification is disabled in Meerkat DSA),\nstrong authentication will always fail."),(0,r.kt)("h2",{id:"spkm-authentication"},"SPKM Authentication"),(0,r.kt)("p",null,"Meerkat DSA supports SPKM Authentication, but does not use it when binding to\nother DSAs. It is almost identical in functionality and security to strong\nauthentication, except that it is based on existing standards exterior to the\nX.500 specifications. If you need high-security authentication, prefer the\n",(0,r.kt)("inlineCode",{parentName:"p"},"strong")," mechanism over ",(0,r.kt)("inlineCode",{parentName:"p"},"spkm"),"."),(0,r.kt)("h2",{id:"external-authentication"},"External Authentication"),(0,r.kt)("p",null,"Meerkat DSA supports the ",(0,r.kt)("inlineCode",{parentName:"p"},"externalProcedure")," authentication mechanism described\nin ",(0,r.kt)("a",{parentName:"p",href:"https://www.itu.int/rec/T-REC-X.511/en"},"ITU Recommendation X.511 (2019)"),".\nThis mechanism is an intentionally open-ended and extensible mechanism for\nauthentication. The parameter for an ",(0,r.kt)("inlineCode",{parentName:"p"},"externalProcedure")," authentication is an\nASN.1 ",(0,r.kt)("inlineCode",{parentName:"p"},"EXTERNAL"),"."),(0,r.kt)("p",null,"Meerkat DSA only uses an ",(0,r.kt)("inlineCode",{parentName:"p"},"EXTERNAL")," value that uses the ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax")," alternative of\nthe ",(0,r.kt)("inlineCode",{parentName:"p"},"identification")," field. When encoded according to the encoding rules\ndetailed in ITU Recommendation X.690, such as the Basic Encoding Rules, this\nfield is referred to as the ",(0,r.kt)("inlineCode",{parentName:"p"},"direct-reference")," field. If the\n",(0,r.kt)("inlineCode",{parentName:"p"},"indirect-reference")," field is supplied, or the ",(0,r.kt)("inlineCode",{parentName:"p"},"direct-reference")," field is not\nsupplied in the encoded ",(0,r.kt)("inlineCode",{parentName:"p"},"EXTERNAL"),' value, Meerkat DSA will respond with an\n"authentication mechanism unsupported" error.'),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax")," field of the ",(0,r.kt)("inlineCode",{parentName:"p"},"EXTERNAL")," (or ",(0,r.kt)("inlineCode",{parentName:"p"},"direct-reference"),' according to the\nX.690 parlance) is used to transmit an object identifier that identifies the\nexternal authentication mechanism. Meerkat DSA looks up the external\nauthentication procedure associated with that object identifier and calls a\nfunction to execute that authentication mechanism. If the mechanism is\nunrecognized or unsupported, Meerkat DSA will return an "authentication\nmechanism unsupported" error.'),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"There are two reasons that the ",(0,r.kt)("inlineCode",{parentName:"p"},"presentation-context-id")," is not recognized by\nMeerkat DSA for the external authentication procedure parameter:"),(0,r.kt)("ol",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ol"},'It would be really complicated from a code standpoint to "look up" the\npresentation contexts from the underlying protocol stack, especially when\nthat has been intentionally abstracted away from the Remote Operation\nService Element (ROSE).'),(0,r.kt)("li",{parentName:"ol"},"Presentation contexts presented by the presentation layers are likely not\ngoing to be used for the external authentication procedure because their\nabstract syntaxes usually describe an application-layer protocol, not an\nexternal procedure.")),(0,r.kt)("p",{parentName:"admonition"},"If you don't understand what this means, don't worry about it.")),(0,r.kt)("h3",{id:"tls-client-certificate-authentication"},"TLS Client Certificate Authentication"),(0,r.kt)("p",null,"Meerkat DSA comes with one ",(0,r.kt)("inlineCode",{parentName:"p"},"externalProcedure")," authentication mechanism\nbuilt-in: TLS client certificate authentication. It's parameter can be described\nusing the following ASN.1 syntax:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-asn1"},"id-tlsClientCertAuth OBJECT IDENTIFIER ::= { 1 3 6 1 4 1 56490 5 401 1 }\ntlsClientCertAuth ABSTRACT-SYNTAX ::= { NULL IDENTIFIED BY id-tlsClientCertAuth }\n")),(0,r.kt)("p",null,"In other words, if you send a bind request using an ",(0,r.kt)("inlineCode",{parentName:"p"},"externalProcedure"),"\ncredential having the ",(0,r.kt)("inlineCode",{parentName:"p"},"syntax")," of ",(0,r.kt)("inlineCode",{parentName:"p"},"1.3.6.1.4.1.56490.5.401.1")," and a ",(0,r.kt)("inlineCode",{parentName:"p"},"data-value"),"\nof ",(0,r.kt)("inlineCode",{parentName:"p"},"NULL")," (although this part is not validated or checked at all), Meerkat DSA\nwill use TLS Client Certificate Authentication."),(0,r.kt)("p",null,"This means that Meerkat DSA will determine the user's distinguished name from\nthe ",(0,r.kt)("inlineCode",{parentName:"p"},"subject")," field of the client certificate asserted via TLS, and consider the\nuser strongly-authenticated, assuming that the asserted certificate chain is\nvalid."),(0,r.kt)("p",null,"Note that, for this to be enabled, the client MUST connect over TLS, and Meerkat\nDSA MUST be configured to request a client certificate by either:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Setting ",(0,r.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkat_tls_request_cert"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_TLS_REQUEST_CERT"))," to ",(0,r.kt)("inlineCode",{parentName:"li"},"1"),", or"),(0,r.kt)("li",{parentName:"ol"},"Setting ",(0,r.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkat_tls_reject_unauthorized_clients"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS"))," to ",(0,r.kt)("inlineCode",{parentName:"li"},"1"))),(0,r.kt)("p",null,"(Of course, the client, must also actually ",(0,r.kt)("em",{parentName:"p"},"send")," the client certificate. That\nis implied.)"),(0,r.kt)("h3",{id:"custom-external-authentication-procedures"},"Custom External Authentication Procedures"),(0,r.kt)("p",null,"You can add your own external authentication procedures in the\n",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/env#meerkat_init_js"},"init script"),". An external authentication procedure\nfunction has a signature like so:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"type ExternalAuthFunction = (\n    ctx: Context, // The context object\n    socket: Socket | TLSSocket, // The TCP or TLS socket underlying the association with the client.\n    ext: EXTERNAL, // The EXTERNAL that is the parameter of the `externalProcedure` credential.\n    // Set to DirectoryBindError for DAP, and DSABindError otherwise.\n    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),\n) => Promise<BindReturn>;\n\n// This is what is returned from such a function.\ninterface BindReturn {\n    /**\n     * The bound vertex, which will only be set if this DSA has the bound DSE\n     * locally.\n     *\n     * Defined in @wildboar/meerkat-types.\n     */\n    boundVertex?: Vertex;\n\n    /**\n     * The bound distinguished name and optional unique identifier. The\n     * distinguished name will be set even if the user provided no credentials\n     * to prove that they were that entry. The unique identifier will be set if\n     * a local DSE having the bound distinguished name can be found and it has\n     * at least one `uniqueIdentifier` attribute value. The first\n     * `uniqueIdentifier` attribute value will be used to populate this field,\n     * even though there may potentially be multiple such values.\n     *\n     * Defined in @wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta\n     */\n    boundNameAndUID?: NameAndOptionalUID;\n\n    /**\n     * The level of credibility with which the user claimed to be the bound\n     * entry. Whether the user bound anonymously, with a password, or with a\n     * asymmetric cryptography will be represented here.\n     *\n     * Defined in @wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta\n     */\n    authLevel: AuthenticationLevel;\n\n    /**\n     * Information about a user password to return in the bind response or\n     * error.\n     *\n     * Defined in @wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue.ta\n     */\n    pwdResponse?: PwdResponseValue;\n\n    /**\n     * The clearances associated with this user.\n     *\n     * Defined in @wildboar/x500/src/lib/modules/EnhancedSecurity/Clearance.ta\n     */\n    clearances: Clearance[];\n\n    /**\n     * The credentials for the DSA to return to the client to provide mutual\n     * authentication.\n     *\n     * Defined in @wildboar/x500/src/lib/modules/DistributedOperations/DSACredentials.ta\n     */\n    reverseCredentials?: DSACredentials;\n\n}\n")),(0,r.kt)("p",null,"If you would like an example implementation, see\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/Wildboar-Software/directory/blob/master/apps/meerkat/src/app/authn/external/tls_client_auth.ts"},"this function"),",\nwhich is the implementation of the TLS Client Certificate Authentication\nmechanism described above."),(0,r.kt)("p",null,"Once you have your function defined, add it to Meerkat DSA's internal index of\n",(0,r.kt)("inlineCode",{parentName:"p"},"externalProcedure")," mechanisms in the init script like so:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'\nconst YOUR_MECHANISM_OID_REPLACE_ME = "1.2.3.4.5";\n\nasync function init(ctx) {\n  // Here, we associate the mechanism ID with the function that does the verification.\n  ctx.externalProcedureAuthFunctions.set(YOUR_MECHANISM_OID_REPLACE_ME, your_function);\n\n  // This is just logging, just to show you that you can do this. :)\n  ctx.log.info("Added my own custom external authentication mechanism");\n}\n\nexport default init;\n')),(0,r.kt)("h2",{id:"architectural-details"},"Architectural Details"),(0,r.kt)("p",null,"You might notice that it can take a few seconds to authenticate to Meerkat DSA.\nThis is no accident."),(0,r.kt)("p",null,"Authentication is protected against\n",(0,r.kt)("a",{parentName:"p",href:"https://ropesec.com/articles/timing-attacks/"},"timing attacks")," by response time\nrandomization and constant-time string comparison. (These two methods may seem\nto contradict each other, and you'd be right to point that out; however, both\nare used so that, if one does not work, the other will.) By default, Meerkat DSA\nalways waits one second, but potentially up to two seconds, before responding\nwith an authentication result. Response time randomization can be configured by administrators via the ",(0,r.kt)("inlineCode",{parentName:"p"},"MEERKAT_BIND_MIN_SLEEP_MS"),"\nand ",(0,r.kt)("inlineCode",{parentName:"p"},"MEERKAT_BIND_SLEEP_RANGE_MS")," environment variables."),(0,r.kt)("p",null,"Notably, Meerkat DSA does not sleep for a random amount of time, perform the\ncredential evaluation, then return a result; it performs a credential evaluation\nthen waits the remaining amount of time such that the randomly-selected sleep\ntime has passed. If the former methodology were used, nefarious actors could\nstill perform a timing attack by attempting authentication many times to see\nwhich attempts take the longest response time on average."))}m.isMDXComponent=!0}}]);