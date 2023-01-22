"use strict";(self.webpackChunkdirectory=self.webpackChunkdirectory||[]).push([[1605],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=i.createContext({}),h=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=h(e.components);return i.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},p=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=h(n),p=a,m=u["".concat(l,".").concat(p)]||u[p]||d[p]||r;return n?i.createElement(m,o(o({ref:t},c),{},{components:n})):i.createElement(m,o({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:a,o[1]=s;for(var h=2;h<r;h++)o[h]=n[h];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1894:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>p,frontMatter:()=>s,metadata:()=>h,toc:()=>u});var i=n(7462),a=n(3366),r=(n(7294),n(3905)),o=["components"],s={},l="Distributed / Chained Operations",h={unversionedId:"distributed",id:"distributed",title:"Distributed / Chained Operations",description:"Authentication of Distributed Operations",source:"@site/docs/distributed.md",sourceDirName:".",slug:"/distributed",permalink:"/directory/docs/distributed",draft:!1,editUrl:"https://github.com/Wildboar-Software/directory/edit/main/website/docs/distributed.md",tags:[],version:"current",frontMatter:{}},c={},u=[{value:"Authentication of Distributed Operations",id:"authentication-of-distributed-operations",level:2},{value:"Identity-Based Requester Authentication",id:"identity-based-requester-authentication",level:3},{value:"Signature-Based Requester Authentication",id:"signature-based-requester-authentication",level:3},{value:"Restrictions that Apply to Both",id:"restrictions-that-apply-to-both",level:2},{value:"Handling of Invalid Signatures",id:"handling-of-invalid-signatures",level:2},{value:"Authentication to Other DSAs",id:"authentication-to-other-dsas",level:2},{value:"Security Risks of Chaining",id:"security-risks-of-chaining",level:2}],d={toc:u};function p(e){var t=e.components,n=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"distributed--chained-operations"},"Distributed / Chained Operations"),(0,r.kt)("h2",{id:"authentication-of-distributed-operations"},"Authentication of Distributed Operations"),(0,r.kt)("p",null,"There are two ways defined for a DSA to authenticate the original requester of\na chained operation: either by trusted the ",(0,r.kt)("inlineCode",{parentName:"p"},"originator")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"authenticationLevel"),"\nasserted by a remote DSA in its ",(0,r.kt)("inlineCode",{parentName:"p"},"ChainingArguments")," by fiat (which is called\nIdentity-Based Requester Authentication (IBRA)), or by validating\ndigital signatures on signed DAP arguments (which is called Signature-Based\nRequester Authentication (SBRA)). The latter is obviously more secure\nthan the former. These are described in\n",(0,r.kt)("a",{parentName:"p",href:"https://www.itu.int/rec/T-REC-X.518/en"},"ITU Recommendation X.518 (2019)"),",\nSection 22."),(0,r.kt)("h3",{id:"identity-based-requester-authentication"},"Identity-Based Requester Authentication"),(0,r.kt)("p",null,"In Meerkat DSA, the only way to accept a new proposed operational binding\n(currently) is via the ",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/webadmin"},"web administration console"),'. When you\naccept an operational binding in the "Operational Bindings" section, you will\nbe able to check a box that indicates that the proposing DSA will be trusted\nfor Identity-Based Requester Authentication.'),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"This is a dangerous setting, because it means that you will trust that DSA to\nhonestly indicate the originator and authentication level. Do NOT enable this\nunless you completely trust the other DSA will ALL information in your DSA!")),(0,r.kt)("h3",{id:"signature-based-requester-authentication"},"Signature-Based Requester Authentication"),(0,r.kt)("p",null,"Unless you intentionally disable all signature validation (not recommended),\nSignature-Based Requester Authentication (SBRA) is ",(0,r.kt)("em",{parentName:"p"},"always")," enabled. If the\nsignature on the original DAP operation is cryptographically signed and this\nsignature is trustworthy according to the\n",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/signing#configuring-signing"},"trust anchors configured for signing"),',\nMeerkat DSA will use the subject of the end entity certificate as the requester\nand will attribute an authentication level of "strong" to the requester, since\na valid signed argument is effectively as good as strong authentication, ',(0,r.kt)("em",{parentName:"p"},"subject to the\nrestrictions below"),"."),(0,r.kt)("p",null,"In other words, if the DAP argument is signed, the requester's authentication\nlevel will (subject to the restrictions that follow), be equal to this\n",(0,r.kt)("inlineCode",{parentName:"p"},"AuthenticationLevel"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-asn1"},"withSignedDAPArgument AuthenticationLevel ::= {\n  basicLevels {\n    level strong,\n    signed TRUE\n  }\n}\n")),(0,r.kt)("h2",{id:"restrictions-that-apply-to-both"},"Restrictions that Apply to Both"),(0,r.kt)("p",null,"The effective authentication level for a user will be ",(0,r.kt)("em",{parentName:"p"},"the lesser of the level\nand localQualifier"),' for the DAP originator and the client DSA. This is not a\nrequirement of the X.500 specifications, but a nuance of how Meerkat DSA\noperates. For example, if a requester authenticates using strong authentication,\nbut the operation is chained via a DSA that anonymously binds to another DSA to\ncontinue the operation, the request is effectively considered "anonymous,"\ndespite the original user\'s strong authentication.'),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},'The rationale for this is that the real authentication level of a request could\nbe argued to be the authentication of the "weakest link" as a request traverses\none or more DSAs. Therefore, if a user authenticates using strong authentication,\nbut a DSA chains their operation by authenticating to another DSA with only a\npassword, the request itself is only as authenticated as a password.'),(0,r.kt)("p",{parentName:"admonition"},"This was a design choice in line with Meerkat DSA's philosophy: whenever an\nambiguity exists in the specification, pick the more secure interpretation.")),(0,r.kt)("p",null,'For this reason, it is important for DSAs that cooperate to perform chaining\nshould all use strong authentication and TLS, so that the authentication levels\nof chained operations do not get "downgraded" in the eyes of Meerkat DSA.'),(0,r.kt)("h2",{id:"handling-of-invalid-signatures"},"Handling of Invalid Signatures"),(0,r.kt)("p",null,"Invalid / untrusted signatures on arguments are not immediately treated as\nfailures by Meerkat DSA, because signed operations that are given to a DSA may\nend up being chained to another DSA. The DSA that initially receives the signed\narguments may not be the one that actually performs the operation. However,\naccess controls are still an important aspect of name resolution. Meerkat DSA\nhas to decide, before the operation is chained to another DSA, whether a bound\nDUA even has permission to know of the existence of a given subordinate\nreference, for instance."),(0,r.kt)("p",null,"For this reason, when a digital signature is invalid in the eyes of a given\nMeerkat DSA instance, the authentication level attributed to the request is\ndowngraded, such that ",(0,r.kt)("inlineCode",{parentName:"p"},"signed")," is ",(0,r.kt)("inlineCode",{parentName:"p"},"FALSE"),", and the operation proceeds with the\nresulting authentication level. This means that the Find DSE procedure may\ntraverse subtrees of the DIT that are only discoverable to, say,\npassword-authenticated users, but not ones that require valid signed arguments.\nOnce the target entry is located, and operation execution has begun, the\nperforming DSA (assuming it is a Meerkat DSA instance) will check if the\nargument is signed, but the authentication level's ",(0,r.kt)("inlineCode",{parentName:"p"},"signed")," component is set to\n",(0,r.kt)("inlineCode",{parentName:"p"},"FALSE"),", which indicates that the signature is invalid. If this is the case, it\nmeans that the signature was determined to be invalid earlier (in the request\nvalidation procedure), and at that point, the operation will fail with an error,\nindicating that the signature is invalid."),(0,r.kt)("p",null,"That was a mouthful. To summarize: the digital signature is checked by each\nMeerkat DSA instance in a distributed operation, and if the signature is\ninvalid, the authentication level is silently downgraded to reflect that, but\nthe operation continues. If the Meerkat DSA instance that actually performs the\noperation (as opposed to merely chaining the operation to another DSA) has\ndetermined that the signature is invalid, an error is returned."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"To be clear, the above only applies to Meerkat DSA. This behavior is not\nspecified in the X.500 specifications, so other DSA implementations may not\nconform to the behavior described above.")),(0,r.kt)("h2",{id:"authentication-to-other-dsas"},"Authentication to Other DSAs"),(0,r.kt)("p",null,"If signing is configured, Meerkat DSA will use its signing certificate and key\nto attempt strong authentication to every single DSA to which it chains. If this\nfails, Meerkat DSA will attempt credentials that are stored in the\n",(0,r.kt)("inlineCode",{parentName:"p"},"AccessPointCredentials")," table in the DBMS, if the targeted access point has\nconfigured credentials stored there. Otherwise, one last attempt will be made\nwith an anonymous bind."),(0,r.kt)("p",null,"Populating the ",(0,r.kt)("inlineCode",{parentName:"p"},"AccessPointCredentials")," table has to be done manually. There is\nno way to do this using Meerkat DSA (including the web admin console), currently."),(0,r.kt)("h2",{id:"security-risks-of-chaining"},"Security Risks of Chaining"),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"If you allow a user to add an entry via the ",(0,r.kt)("inlineCode",{parentName:"p"},"addEntry")," operation and they are\nauthorization to chain operations, they might be able to spam the DSA with\n",(0,r.kt)("inlineCode",{parentName:"p"},"targetSystem")," values containing LAN IP addresses and make the DSA act as a\nTCP port scanner and scan the local network and submit chained requests. This\ncould be an especially bad problem if a reached TCP port will interpret bytes of\na chained request as a different protocol packet, such as a MySQL packet!")),(0,r.kt)("p",null,"To prevent abuse as described above, do not generously grant permissions to\nadd entries, and require signed arguments for chaining to make it as difficult\nas possible to exploit this."),(0,r.kt)("p",null,"You can configure the authentication required for chaining via these\nconfiguration options:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkat_min_auth_level_for_chaining"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkat_min_auth_local_qualifier_for_chaining"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_CHAINING"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkat_signing_required_for_chaining"},(0,r.kt)("inlineCode",{parentName:"a"},"MEERKAT_SIGNING_REQUIRED_FOR_CHAINING")))),(0,r.kt)("p",null,"It is also strongly advised to configure network policies that prevent Meerkat\nDSA from reaching other services on its local network that it should not be able\nto reach. This is simple to do on Kubernetes or Docker."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Meerkat DSA will ",(0,r.kt)("strong",{parentName:"p"},"NOT")," chain to a transport service that has the same port\nnumber as the DBMS, while this may seem overly restrictive, it is to prevent\nMeerkat DSA from being tricked into sending directory requests to the DBMS,\nwhich could get interpreted as, for example, MySQL packets. This has to be\nimplemented within Meerkat DSA, because you cannot block Meerkat DSA's access\nto the DBMS at the network level.")))}p.isMDXComponent=!0}}]);