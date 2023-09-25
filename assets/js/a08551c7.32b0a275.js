"use strict";(self.webpackChunkdirectory=self.webpackChunkdirectory||[]).push([[8253],{3905:(e,t,a)=>{a.d(t,{Zo:()=>h,kt:()=>c});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),d=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},h=function(e){var t=d(e.components);return n.createElement(l.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,h=s(e,["components","mdxType","originalType","parentName"]),p=d(a),m=i,c=p["".concat(l,".").concat(m)]||p[m]||u[m]||o;return a?n.createElement(c,r(r({ref:t},h),{},{components:a})):n.createElement(c,r({ref:t},h))}));function c(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,r=new Array(o);r[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:i,r[1]=s;for(var d=2;d<o;d++)r[d]=a[d];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},7928:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>h,contentTitle:()=>l,default:()=>c,frontMatter:()=>s,metadata:()=>d,toc:()=>p});var n=a(7462),i=a(3366),o=(a(7294),a(3905)),r=["components"],s={},l="Shadowing",d={unversionedId:"shadowing",id:"shadowing",title:"Shadowing",description:"Meerkat DSA supports all features of shadowing as described in",source:"@site/docs/shadowing.md",sourceDirName:".",slug:"/shadowing",permalink:"/directory/docs/shadowing",draft:!1,editUrl:"https://github.com/Wildboar-Software/directory/edit/main/website/docs/shadowing.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Operational Bindings",permalink:"/directory/docs/opbinding"},next:{title:"Dynamic Entries",permalink:"/directory/docs/dynamic"}},h={},p=[{value:"Shadow Update Size Limits",id:"shadow-update-size-limits",level:2},{value:"Establishment",id:"establishment",level:2},{value:"Update Behavior",id:"update-behavior",level:2},{value:"Secondary Shadows",id:"secondary-shadows",level:2},{value:"Timing Requirements and Behavior",id:"timing-requirements-and-behavior",level:2},{value:"Loops",id:"loops",level:2},{value:"Update Spill-over",id:"update-spill-over",level:2},{value:"Role Reversal",id:"role-reversal",level:2},{value:"Modification",id:"modification",level:2},{value:"Termination",id:"termination",level:2},{value:"Information Planes and Alternative Relative Distinguished Names",id:"information-planes-and-alternative-relative-distinguished-names",level:2},{value:"Overlapping Shadowed Areas",id:"overlapping-shadowed-areas",level:2},{value:"Performance",id:"performance",level:2},{value:"Network Disruption",id:"network-disruption",level:2},{value:"Usage of Shadowed Entries",id:"usage-of-shadowed-entries",level:2}],u={toc:p},m="wrapper";function c(e){var t=e.components,a=(0,i.Z)(e,r);return(0,o.kt)(m,(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"shadowing"},"Shadowing"),(0,o.kt)("p",null,"Meerkat DSA supports all features of shadowing as described in\n",(0,o.kt)("a",{parentName:"p",href:"https://www.itu.int/rec/T-REC-X.525/en"},"ITU Recommendation X.525 (2019)"),", as\nwell as the establishment of shadowing through the use of the\nDirectory Operational Binding Management Protocol (DOP). The Directory\nInformation Shadowing Protocol (DISP) is fully supported, and can use IDM, ITOT,\nIDM-over-TLS, and ITOT-over-TLS as transports (like the other directory\nprotocols). Meerkat DSA is capable of acting as a shadow supplier and consumer\nat the first-level and otherwise."),(0,o.kt)("h2",{id:"shadow-update-size-limits"},"Shadow Update Size Limits"),(0,o.kt)("p",null,"There are no size limits on shadow updates imposed by Meerkat DSA, but shadowing\nhas only been tested with 20,000 entries. It is believed that Meerkat DSA should\nwork fine up to 100,000 entries and beyond."),(0,o.kt)("h2",{id:"establishment"},"Establishment"),(0,o.kt)("p",null,"Shadow operational bindings may be proposed like other operational bindings\nvia the use of\n",(0,o.kt)("a",{parentName:"p",href:"/directory/docs/opbinding#relayed-operational-bindings"},"Relayed Operational Bindings"),".\nShadow operational bindings proposed by third parties may be agreed to via the\n",(0,o.kt)("a",{parentName:"p",href:"/directory/docs/webadmin"},"Web Administration Console"),"."),(0,o.kt)("h2",{id:"update-behavior"},"Update Behavior"),(0,o.kt)("p",null,"If Meerkat DSA is acting as a shadow supplier, upon first establishing a\nshadowing agreement, Meerkat DSA will provide a total refresh to its consumer.\nLikewise, when acting as a consumer, Meerkat DSA will request a total refresh\nfor the first update. Thereafter, Meerkat DSA produces and requests only\nincremental updates, with a few exceptions:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"After a shadowing agreement modification, a total refresh is performed."),(0,o.kt)("li",{parentName:"ul"},"Secondary shadows always receive total refreshes for every update."),(0,o.kt)("li",{parentName:"ul"},"If a previous total refresh did not succeed, another one will be performed.")),(0,o.kt)("h2",{id:"secondary-shadows"},"Secondary Shadows"),(0,o.kt)("p",null,"Meerkat DSA supports secondary shadows, however, secondary consumers will only\nreceive total refreshes as stated above. This can be extremely expensive in\nterms of performance, and it should only be used for a small number of entries."),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"The rationale for this is that it is difficult to determine whether the shadow\nupdate from the master DSA overlaps with the the shadowed area of the secondary.\nIf there is overlap, the attributes, values, and contexts received from the\nmaster may not be the same as those provided to the secondary. This problem gets\nvery complicated. Future versions of Meerkat DSA will likely improve upon this.")),(0,o.kt)("h2",{id:"timing-requirements-and-behavior"},"Timing Requirements and Behavior"),(0,o.kt)("p",null,'Shadowing updates can be configured to occur at regular intervals in the\nshadowing agreement, and they may be allowed to being at a configurable amount\nof time after the start of the interval (the "window"). Meerkat DSA will allow\nnearly any value (measured in number of seconds) for these intervals and windows,\nbut aberrant behavior is likely to be observed if the frequency of shadow\nupdates is less than one minute.'),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"It is strongly recommended to use shadow update intervals of no less than one\nhour, and shadow window sizes of no less than 30 minutes. Replicating a large\namount of data could take a very long time to insert into the database!")),(0,o.kt)("p",null,"Directory operations must eventually time out to ensure that resources are\nfreed up when correspondent DSAs become non-responsive. For the purposes of\ndetermining the timeouts used for the ",(0,o.kt)("inlineCode",{parentName:"p"},"updateShadow")," operation, Meerkat DSA\nmeasures the time taken to prepare the shadow update locally, multiplies it by\nten, and restricts this value between 30 seconds and the configured update\ninterval. This means that, if it takes 1 second to locally prepare a shadow\nupdate, Meerkat DSA will give the remote DSA 30 seconds to respond to the\n",(0,o.kt)("inlineCode",{parentName:"p"},"updateShadow")," operation before timing out; if it takes 30 seconds to produce\na shadow update, Meerkat DSA will grant the consumer 300 seconds to respond to\nthe ",(0,o.kt)("inlineCode",{parentName:"p"},"updateShadow")," operation, so long as the update interval is not smaller than\nthis number."),(0,o.kt)("h2",{id:"loops"},"Loops"),(0,o.kt)("p",null,"It is possible to create shadows that result in an infinite loop using the\n",(0,o.kt)("inlineCode",{parentName:"p"},"onChange")," update mode. In other words, if an entry changes, a master DSA may\nupdate its shadow, and its shadow may have another shadow that it updates\n",(0,o.kt)("inlineCode",{parentName:"p"},"onChange"),". This secondary shadow may have the master DSA as its shadow consumer,\nwhich would cause an infinite loop of updates."),(0,o.kt)("p",null,"Meerkat DSA has no defenses against this scenario. Administrators should only\naccept operational bindings from trustworthy parties. It falls upon\nadministrators to ensure the sanity of shadowing agreements before agreeing to\nthem."),(0,o.kt)("h2",{id:"update-spill-over"},"Update Spill-over"),(0,o.kt)("p",null,"Long-running shadow updates will not be terminated. They will run to completion,\nand if they take so long that they spill over into another shadow update,\nMeerkat DSA will not detect this or abort the shadow update. It falls on\nadministrators to ensure that shadow updates are not taking too long. In\ngeneral, it is recommended to make shadow update intervals no shorter than one\nhour."),(0,o.kt)("h2",{id:"role-reversal"},"Role Reversal"),(0,o.kt)("p",null,"Meerkat DSA does not support a shadow consumer becoming a shadow supplier\nthrough a modification of a shadow operational binding. The shadowing roles may\nnever be reversed. The use of the DISP operations are policed for their\norigination by the appropriate party in a shadow operational binding."),(0,o.kt)("h2",{id:"modification"},"Modification"),(0,o.kt)("p",null,"Under the hood, the modification of shadowing agreements has almost the same\neffect of terminating a shadowing agreement and creating a new one. The only\nexception, as stated above, is that the roles may not be reversed. However, the\nupdate modes may be reversed, meaning that a supplier-initiated shadowing may\nbecome consumer-initiated and vice versa."),(0,o.kt)("h2",{id:"termination"},"Termination"),(0,o.kt)("p",null,"When shadow operational bindings are terminated, the shadow DSEs that remained\nare not discarded. It is up to the administrator of the DSA to manually remove\nthese, if that is desired. Otherwise, they will continue to work as shadow DSEs,\nand never receive updates until an applicable shadowing agreement is resumed."),(0,o.kt)("h2",{id:"information-planes-and-alternative-relative-distinguished-names"},"Information Planes and Alternative Relative Distinguished Names"),(0,o.kt)("p",null,'The concepts of information "planes" and "alternative relative distinguished\nnames" introduced seemingly out of nowhere in ITU Recommendation X.525 are not\nsupported. Relative distinguished names must be unique for all DSEs within\nMeerkat DSA, even if they are shadows.'),(0,o.kt)("h2",{id:"overlapping-shadowed-areas"},"Overlapping Shadowed Areas"),(0,o.kt)("p",null,"Meerkat DSA neither supports the use of overlapping shadowed areas, nor\nverifies that all current shadowing agreements do not overlap with each other.\n",(0,o.kt)("strong",{parentName:"p"},"It is the responsibility of the administrator to ensure that shadowing\nagreements do not overlap.")),(0,o.kt)("p",null,'By "overlapping shadowed areas," this means overlap of entries specified by the\nshadowing agreements subtree specification, even if the attributes or values\nreplicated do not conflict.'),(0,o.kt)("p",null,"Note that refinement of said subtree using the ",(0,o.kt)("inlineCode",{parentName:"p"},"specificationFilter"),' can produce\nshadowed areas that do not overlap; shadowed areas that are "interleaved"\nthrough the use of object class refinement--in other words, those shadowed areas\nthat would overlap but for the use of the ',(0,o.kt)("inlineCode",{parentName:"p"},"specificationFilter"),"--should be free\nfrom conflict. For example, there should be no problem if one shadowing\nagreement replicates all entries of object class ",(0,o.kt)("inlineCode",{parentName:"p"},"person")," and another replicates\nall entries of object class ",(0,o.kt)("inlineCode",{parentName:"p"},"country")," for an otherwise identical subtree\nspecification."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"It is still strongly recommended to avoid using overlapping shadowed areas. The\nuse of overlapping shadowed areas has not been tested at all. If overlapping\nshadowed areas are used at all, it would likely be less error-prone to replicate\nfrom different context prefixes or base entries at least.")),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"The reason that overlapping shadowed areas are not supported is that it is\nunclear how to handle certain conflicting facts. For instance, if one DSA says\nthat an SDSE has SDSEType ",(0,o.kt)("inlineCode",{parentName:"p"},"nssr")," and another says it has type ",(0,o.kt)("inlineCode",{parentName:"p"},"familyMember"),',\nwhat is to be done? There are too many combinations of SDSE types to validate\nall of them and ensure that the shadowed DSE is coherent. In addition to this,\nresolving which attributes and values are "complete" as a result of merging two\nshadow updates from differing origins could be very error-prone.'),(0,o.kt)("p",{parentName:"admonition"},"On top of this, I believe overlapping shadowed areas is a strange edge case that\nis not worthy of much support: there is supposed to be only one master DSA for\nany given entry, so it would be strange for there to be multiple shadowing\nagreements for the same area. If you really need this functionality, let me\nknow!")),(0,o.kt)("h2",{id:"performance"},"Performance"),(0,o.kt)("p",null,"Shadowing will be much faster if context selections are not used and if either\nall contexts or no contexts are supplied. Otherwise, little can be done to\nspeed up shadowing specifically."),(0,o.kt)("h2",{id:"network-disruption"},"Network Disruption"),(0,o.kt)("p",null,"Meerkat DSA's shadowing is resilient to network failure. When\nacting as a shadow supplier, Meerkat DSA does not discard its queue of pending\nincremental shadow updates until it receives a response to the ",(0,o.kt)("inlineCode",{parentName:"p"},"updateShadow"),"\noperation from a consumer. If no update has ever succeeded, a Meerkat DSA\nsupplier will provide a total refresh. In either case, refreshes are\nidempotent, meaning that duplicate entries, attributes, values, etc. should just\nbe ignored. If you experience a deviation on this front, it is a bug."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"This does not mean that Meerkat DSA is resilient to storage / database failures.\nDepending on the configuration of your operating system or database, writes may\nnot really be persisted. Meerkat DSA responds to the ",(0,o.kt)("inlineCode",{parentName:"p"},"updateShadow")," operation\nwhen the database ",(0,o.kt)("em",{parentName:"p"},"claims"),' that it has saved the data. What constitutes\n"persistence" is a much greater philosophical topic; to learn more, search for\nthe terms "Write-Through" or "Write-Back."')),(0,o.kt)("h2",{id:"usage-of-shadowed-entries"},"Usage of Shadowed Entries"),(0,o.kt)("p",null,"The X.500 specifications are somewhat vague as to how to validate whether the\nlocally shadowed information can satisfy a request, and therefore, whether a\nshadow DSA should respond to the request, or chain it to the master DSA,\nparticularly as it relates to the ",(0,o.kt)("inlineCode",{parentName:"p"},"search")," operation."),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"Meerkat DSA's rules for determining whether a request can be satisfied locally\ncan and will change throughout time, and in addition to this, the code\nembodying these rules is very complex and likely to be buggy. What follows\nshould be considered to be ",(0,o.kt)("em",{parentName:"p"},"generally")," true.")),(0,o.kt)("p",null,'As heuristics for determining whether a Meerkat DSA shadow consumer will\nconsider its shadowed data "suitable" for fulfilling the request, the following\ngeneral principles apply:'),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"All modification operations always get chained to the master DSA."),(0,o.kt)("li",{parentName:"ul"},"For shadowed information to be suitable, the target entry / entries must be\npresent.",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"This is obvious for single-entry interrogation procedures, such as ",(0,o.kt)("inlineCode",{parentName:"li"},"read")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"compare"),"."),(0,o.kt)("li",{parentName:"ul"},"For ",(0,o.kt)("inlineCode",{parentName:"li"},"list"),", all immediate subordinates must be replicated, but they do not\nhave to have any specific attributes or values."),(0,o.kt)("li",{parentName:"ul"},"For ",(0,o.kt)("inlineCode",{parentName:"li"},"search")," requests, only the base entry must be present if ",(0,o.kt)("inlineCode",{parentName:"li"},"baseObject"),(0,o.kt)("inlineCode",{parentName:"li"},"search")," is used.",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Theoretically, a search could return the subtree of family members from a\n",(0,o.kt)("inlineCode",{parentName:"li"},"baseObject")," search. This implementation will assume that compound\nentries are always replicated as a unit."))),(0,o.kt)("li",{parentName:"ul"},"All immediate subordinates under the base entry must be replicated if\n",(0,o.kt)("inlineCode",{parentName:"li"},"oneLevel")," ",(0,o.kt)("inlineCode",{parentName:"li"},"search")," is used."),(0,o.kt)("li",{parentName:"ul"},"If ",(0,o.kt)("inlineCode",{parentName:"li"},"wholeSubtree")," ",(0,o.kt)("inlineCode",{parentName:"li"},"search")," is used, all shadowing agreements that apply to\nthe searched area must use empty shadow subtrees (a ",(0,o.kt)("inlineCode",{parentName:"li"},"SubtreeSpecification"),"\nthat specifies no ",(0,o.kt)("inlineCode",{parentName:"li"},"base"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"minimum"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"maximum"),", ",(0,o.kt)("inlineCode",{parentName:"li"},"specificExclusions"),", or\n",(0,o.kt)("inlineCode",{parentName:"li"},"specificationFilter")," of any kind). This is the only way to ensure that the\nshadowed area would contain all the same entries that the master DSA(s)\nwould."))),(0,o.kt)("li",{parentName:"ul"},"In addition to this, the filtering and selection of attributes is considered:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"As stated in the specifications, operational attributes never factor into\ndeciding whether or not an entry is suitable, because they are always\nconsidered incomplete within shadowed DSEs. If you want authoritative,\nup-to-date operational attributes, query the master DSA."),(0,o.kt)("li",{parentName:"ul"},"For single-entry interrogation operations (e.g. ",(0,o.kt)("inlineCode",{parentName:"li"},"read")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"compare"),"), the\nentry will always be suitable if all attributes are replicated, as indicated\nby the shadow DSE's ",(0,o.kt)("inlineCode",{parentName:"li"},"attributesComplete")," flag."),(0,o.kt)("li",{parentName:"ul"},"For ",(0,o.kt)("inlineCode",{parentName:"li"},"search"),", the shadowing agreement is consulted to ensure that all\nfiltered and selected attributes are replicated and complete."),(0,o.kt)("li",{parentName:"ul"},"Given the targeted nature of ",(0,o.kt)("inlineCode",{parentName:"li"},"compare"),", the ",(0,o.kt)("inlineCode",{parentName:"li"},"compare")," operation is extremely\npicky with respect to considering an entry suitable. If ",(0,o.kt)("inlineCode",{parentName:"li"},"noSubtypeMatch")," is\nnot provided as a service control and the entry is incomplete, the shadow\nDSE will not be suitable, because it cannot be known whether some unknown\nsubtype of the asserted attribute type has been replicated.",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"For similar reasons, the target entry will be unsuitable unless the\n",(0,o.kt)("inlineCode",{parentName:"li"},"dontMatchFriends")," service control is used or all friend attributes are\nreplicated as well."))))),(0,o.kt)("li",{parentName:"ul"},"Determining entry suitability based on contexts is somewhat shaky. The code\nfor determining if there is sufficient overlap between replicated contexts and\nasserted or requested contexts gets extremely complicated. As such, it is\nstrongly recommended to always replicate all contexts in Meerkat DSA."),(0,o.kt)("li",{parentName:"ul"},"In general, the more narrow the focus of an operation, the more picky Meerkat\nDSA's implementation of the Check Suitability procedure will be for\ndetermining whether the shadowed data is suitable. A ",(0,o.kt)("inlineCode",{parentName:"li"},"compare")," operation will\nbe extremely strict, whereas a ",(0,o.kt)("inlineCode",{parentName:"li"},"search")," operation will be much more inclined\nto using shadowed data.")),(0,o.kt)("p",null,"You can check the ",(0,o.kt)("inlineCode",{parentName:"p"},"performer"),' field of the responses to see whether the shadow\nDSA or the master DSA responded. This will tell you whether or not the target\nentry was determined to be "suitable" with respect to the request.'))}c.isMDXComponent=!0}}]);