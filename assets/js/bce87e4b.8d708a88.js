"use strict";(self.webpackChunkdirectory=self.webpackChunkdirectory||[]).push([[4016],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(n),h=o,m=d["".concat(l,".").concat(h)]||d[h]||p[h]||r;return n?a.createElement(m,i(i({ref:t},c),{},{components:n})):a.createElement(m,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:o,i[1]=s;for(var u=2;u<r;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},258:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>u,toc:()=>d});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],s={},l="Tutorial 2: Hooking up Gitea with Meerkat DSA",u={unversionedId:"tutorial02",id:"tutorial02",title:"Tutorial 2: Hooking up Gitea with Meerkat DSA",description:"In this tutorial, we will configure a Gitea server to use",source:"@site/docs/tutorial02.md",sourceDirName:".",slug:"/tutorial02",permalink:"/directory/docs/tutorial02",draft:!1,editUrl:"https://github.com/Wildboar-Software/directory/edit/main/website/docs/tutorial02.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Tutorial 1: Set up the X.500 CLI",permalink:"/directory/docs/tutorial01"},next:{title:"Add NHOBs and Subordinates",permalink:"/directory/docs/tutorial03"}},c={},d=[{value:"How It Works",id:"how-it-works",level:2},{value:"Creating the Organization&#39;s DSE",id:"creating-the-organizations-dse",level:2},{value:"Configure Access Control",id:"configure-access-control",level:2},{value:"Creating Schema",id:"creating-schema",level:2},{value:"Creating Users",id:"creating-users",level:2},{value:"Gitea Configuration",id:"gitea-configuration",level:2}],p={toc:d},h="wrapper";function m(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)(h,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"tutorial-2-hooking-up-gitea-with-meerkat-dsa"},"Tutorial 2: Hooking up Gitea with Meerkat DSA"),(0,r.kt)("p",null,"In this tutorial, we will configure a ",(0,r.kt)("a",{parentName:"p",href:"https://gitea.io/"},"Gitea")," server to use\nMeerkat DSA as a source of authentication. After this tutorial, you will be\nable to add users to a Meerkat DSA instance and have them gain access to a\nGitea server automatically. These users will be members of a fictitious\norganization named Foobar, Inc."),(0,r.kt)("p",null,"Gitea was chosen for this tutorial because it is one of the easiest applications\nto start up with almost no configuration. In fact, merely installing it via the\n",(0,r.kt)("a",{parentName:"p",href:"https://gitea.com/gitea/helm-chart/"},"Helm chart")," with no modified settings is\nsufficient for this tutorial."),(0,r.kt)("p",null,"This tutorial will assume that you have a Meerkat DSA instance already started,\nbut there is no data other than the Root DSE (which is created automatically if\nit is not found)."),(0,r.kt)("p",null,"This tutorial will also assume that you have installed and configured the\n",(0,r.kt)("a",{parentName:"p",href:"/directory/docs/x500cli"},"X.500 command-line interface")," to connect anonymously to your DSA."),(0,r.kt)("h2",{id:"how-it-works"},"How It Works"),(0,r.kt)("p",null,"Gitea, as well as many other programs, support LDAP as a source of user\ninformation. Rather than storing user names and passwords in a program's\ndatabase, a lot of applications can wire up to an LDAP server to fetch\ninformation about users, groups, roles, permissions, etc. Unfortunately, DAP\nis not widely supported, but we are going to change that; for now, you have to\nuse LDAP. Still, for the sake of this tutorial, we can use DAP commands to set\nup Meerkat DSA, then we will configure Gitea to access our Meerkat DSA instance\nvia LDAP to authenticate users."),(0,r.kt)("h2",{id:"creating-the-organizations-dse"},"Creating the Organization's DSE"),(0,r.kt)("p",null,"Create an organization first-level DSE using the following command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap add org 'o=Foobar' --organizationName='Foobar'\n")),(0,r.kt)("p",null,"We are also going to set the password for the organization, because we will\nconsider this DSE to be the administrative user for the organization. It will\nhave supreme permissions to read and write everything in the organization."),(0,r.kt)("p",null,"We ",(0,r.kt)("em",{parentName:"p"},"could")," have done this\nin the previous command using the ",(0,r.kt)("inlineCode",{parentName:"p"},"--userPassword")," option, but this is less\nsecure, because this command might end up in your shell's history, and the\npassword can be transmitted hashed if we use the ",(0,r.kt)("inlineCode",{parentName:"p"},"apw")," command instead, which\nmeans that we can set the password without the DSA ever even knowing what it is.\nTo do so, run this command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap apw 'o=Foobar'\n")),(0,r.kt)("p",null,"Note that, because we defined our first password in this DSA, no users will be\nable to add top-level DSEs except this first one."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"There is no defined, standard way to restrict who can add first-level DSEs, so\nMeerkat DSA's solution is to grant the first user with a password the ability to\nadd first-level DSEs. Prior to this first password's existence, any user can add\nnew first-level DSEs. For this reason, it is important to create a user with a\npassword as soon as you have your first-level DSEs created. For clarification,\nthis special privilege is only for adding first-level DSEs; outside of adding\nthese entries, normal access controls apply.")),(0,r.kt)("h2",{id:"configure-access-control"},"Configure Access Control"),(0,r.kt)("p",null,"First we need to create an access control subentry. Its subtree specification\nwill cover the whole administrative area, which makes our command a lot\nsimpler."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap add subentry 'o=Foobar,cn=Access Control' --commonName='Access Control'\n")),(0,r.kt)("p",null,"Now, we want this subentry to become an access control subentry, so run this\ncommand:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod become acsub 'o=Foobar,cn=Access Control'\n")),(0,r.kt)("p",null,"Unfortunately, our next command is not simple at all. We have to define\nAccess Control Information (ACI) items, which define our access control rules.\nThe first one we should add establishes that the organization user (the\nadministrator) can do anything within the organzation."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod add aci 'o=Foobar,cn=Access Control' prescriptive 'Organization administrator' 250 simple \\\n  --userName='o=Foobar' \\\n  --entry \\\n  --allUserAttributeTypesAndValues \\\n  --allOperationalAttributeTypesAndValues \\\n  --grantAdd \\\n  --grantDiscloseOnError \\\n  --grantRead \\\n  --grantRemove \\\n  --grantBrowse \\\n  --grantExport \\\n  --grantImport \\\n  --grantModify \\\n  --grantRename \\\n  --grantReturnDN \\\n  --grantCompare \\\n  --grantFilterMatch \\\n  --grantInvoke\n")),(0,r.kt)("p",null,'The above command creates a prescriptive ACI item with the tag\n"Organization administrator" and a precedence of 250 (pretty high, ensuring that\nthe administrator will always have administrative access) and ',(0,r.kt)("inlineCode",{parentName:"p"},"simple"),"\nauthentication level. The ",(0,r.kt)("inlineCode",{parentName:"p"},"userName")," parameter specifically names ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," as\nthe subject of this ACI item. The ",(0,r.kt)("inlineCode",{parentName:"p"},"entry")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"allUserAttributeTypesAndValues"),"\noptions name entries themselves and all of their attribute types and values as\nthe objects of this ACI item. Finally, we use every single ",(0,r.kt)("inlineCode",{parentName:"p"},"--grant*")," option to\npermit the subject every permissions to the objects."),(0,r.kt)("p",null,"In X.500 directories, subentries are controlled separately by subentry ACI\nitems, which are stored in their respective administrative points. We need to\ncreate a separate ACI item for this so we can read and write to our subentry!"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod add aci 'o=Foobar' subentry 'Organization administrator' 250 simple \\\n  --userName='o=Foobar' \\\n  --entry \\\n  --allUserAttributeTypesAndValues \\\n  --allOperationalAttributeTypesAndValues \\\n  --grantAdd \\\n  --grantDiscloseOnError \\\n  --grantRead \\\n  --grantRemove \\\n  --grantBrowse \\\n  --grantExport \\\n  --grantImport \\\n  --grantModify \\\n  --grantRename \\\n  --grantReturnDN \\\n  --grantCompare \\\n  --grantFilterMatch \\\n  --grantInvoke\n")),(0,r.kt)("p",null,"Note that the above command is ",(0,r.kt)("em",{parentName:"p"},"almost")," the exact same as the one that came\nbefore it. We just changed ",(0,r.kt)("inlineCode",{parentName:"p"},"prescriptive")," to ",(0,r.kt)("inlineCode",{parentName:"p"},"subentry")," and we changed the\ntarget object to ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),". The idea is still the same: we are granting\n",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," all permission to do everything to all subentries within this\naccess control administrative area."),(0,r.kt)("p",null,'For now, we only need these two ACI items. In a real directory, you will\nprobably want to define many more before you "flip the switch" to turn on access\ncontrols. We are going to turn on access controls now, using the following\ncommands:'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod become admpoint 'o=Foobar' -z -a -u\n")),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"-z")," option will make this administrative point an autonomous administrative\npoint. (It should already be autonomous, though. The X.500 specifications\nrequire that all first-level DSEs are autonomous administrative points, so\nMeerkat DSA automatically adds the autonomous administrative role to first-level\nDSEs created without an ",(0,r.kt)("inlineCode",{parentName:"p"},"administrativeRole")," attribute.) The ",(0,r.kt)("inlineCode",{parentName:"p"},"-a")," option will\nmake this an access control administrative point for an Access Control Specific\nArea (ACSA). The ",(0,r.kt)("inlineCode",{parentName:"p"},"-u")," option will make this a subschema administrative area,\nwhich will be useful shortly."),(0,r.kt)("p",null,"Finally, there is one more step to turn on access controls: add an access\ncontrol scheme attribute to the administrative point by using this command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod add acs 'o=Foobar' 2.5.28.1\n")),(0,r.kt)("p",null,"This adds an access control scheme of ",(0,r.kt)("inlineCode",{parentName:"p"},"2.5.28.1")," to this administrative point,\nwhich enables the Basic Access Control detailed in ITU Recommendation X.501."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Because we enabled access controls, and we only defined ACI items for the\n",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," user, no other users will be able to do ",(0,r.kt)("em",{parentName:"p"},"anything")," in this Access\nControl Administrative Area (ACSA) unless the administrator, ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," adds\nmore ACI items to allow it.")),(0,r.kt)("p",null,"Because you enabled access controls, you will need to change your X.500\nconfiguration file to authenticate as ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," with a password instead of\nanonymously. You will not be able to do anything otherwise."),(0,r.kt)("h2",{id:"creating-schema"},"Creating Schema"),(0,r.kt)("p",null,"Just because you are logged in as a user whose access controls permit you to do\n",(0,r.kt)("em",{parentName:"p"},"anything")," does not ",(0,r.kt)("em",{parentName:"p"},"really")," mean that you can do anything. You are still\ngoverned by schema rules, and since you did not define any DIT structure rules,\nyou cannot add any entries beneath ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),", nor assign any auxiliary object\nclasses to any entries, nor use contexts, etc. Fortunately, ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," has the\npermissions needed to change this."),(0,r.kt)("p",null,"We are going to create a new subentry for the subschema."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"Technically, there is\nno reason you could not use the access control subentry for this, but we named\nthis subentry \"Access Control,\" so it would be a misleading name if we also put\nour subschema in there. Also, it is a requirement of the X.500 specifications\nthat subschema administrative areas apply to the whole area (e.g. the subtree\nspecification has to have 0 minimum, no maximum, no chops, no refinements, and\nan empty base), which means that, if we changed or added a subtree to our access\ncontrol subentry, it would make our subschema non-compliant. (Technically,\nMeerkat DSA just ignores the subtree specifications for subschema subentries, so\nthis shouldn't be a problem for Meerkat DSA, but you don't want to be\nnon-compliant, do you?)")),(0,r.kt)("p",null,"Run the following command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap add subentry 'o=Foobar,cn=Subschema' --commonName='Subschema'\n")),(0,r.kt)("p",null,"Now, we want to make this a subschema subentry, so run this command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod become subschema 'o=Foobar,cn=Subschema'\n")),(0,r.kt)("p",null,"Now, we can get to business. You could define your own name forms, but we are\njust going to use the ",(0,r.kt)("inlineCode",{parentName:"p"},"orgNameForm")," that comes installed in Meerkat DSA by\ndefault, so we just need to define a DIT structure rule to use it. Run this\ncommand to define a DIT structure rule that applies to the administrative point:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod add sr 'o=Foobar,cn=Subschema' 1 2.5.15.3\n")),(0,r.kt)("p",null,"The command above defines a DIT structure rule with ID 1 that applies to an\nadministrative point with the name form identified by the object identifier\n",(0,r.kt)("inlineCode",{parentName:"p"},"2.5.15.3"),". This object identifier is for ",(0,r.kt)("inlineCode",{parentName:"p"},"orgNameForm"),". Since this name form\nconforms to what we named our administrative point, and since this DIT structure\nrule names no superior structure rules, this structure rule applies to the\nadministrative point ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),", which will set the ",(0,r.kt)("em",{parentName:"p"},"governing structure rule"),"\nfor ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),". Now that ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," has a governing structure rule, you can\nplace other entries beneath it once you define other structure rules that permit\nthem."),(0,r.kt)("p",null,"Run this command to permit the creation of an ",(0,r.kt)("inlineCode",{parentName:"p"},"organizationalPerson")," with the\nname form ",(0,r.kt)("inlineCode",{parentName:"p"},"orgPersonNameForm")," beneath ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap mod add sr 'o=Foobar,cn=Subschema' 2 2.5.15.6 -s 1\n")),(0,r.kt)("p",null,"The above command will create a structure rule with an ID of 2. The object\nidentifier ",(0,r.kt)("inlineCode",{parentName:"p"},"2.5.15.6")," is for ",(0,r.kt)("inlineCode",{parentName:"p"},"orgPersonNameForm"),". The ",(0,r.kt)("inlineCode",{parentName:"p"},"-s 1")," says that this\nstructure rule may permit entries under another entry whose governing structure\nrule is 1 (which is our administrative point, ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),", in this case)."),(0,r.kt)("p",null,"That should be sufficient for our simple use case, but in a real DIT, you would\nprobably want to define many more structure rules, as well as content rules,\ncontext use rules, matching rule uses, etc."),(0,r.kt)("h2",{id:"creating-users"},"Creating Users"),(0,r.kt)("p",null,"Now, we need to have a heart-to-heart: the schema specified in the X.500\nspecifications is not perfect. Notably, the schema for an organizational person\ndoes not permit an email address, which is required by Gitea. Also, none of\nthese attributes are really suitable for storing a username. This means that\nwe are going to have to abuse these attributes' meanings and store email\naddresses and usernames where they do not belong. Again, this is just a\ntutorial, and you should define proper schema that does use the correct\nattribute types."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"In the very near future, Meerkat DSA will introduce a LOT more pre-installed\nschema, including the ",(0,r.kt)("inlineCode",{parentName:"p"},"inetOrgPerson")," object class widely uses in LDAP servers.\nThis object class would be a great choice for this use case, if you can wait.")),(0,r.kt)("p",null,"For our purposes, we are going to abuse the ",(0,r.kt)("inlineCode",{parentName:"p"},"commonName")," attribute to store the\nuser's username and the ",(0,r.kt)("inlineCode",{parentName:"p"},"title")," attribute to store their email address."),(0,r.kt)("p",null,"Now we can create this troublesome organizational user by running this command:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap add op 'o=Foobar,cn=cnorris' \\\n  --commonName='cnorris' \\\n  --surname='Norris' \\\n  --title='cnorris@gmail.com'\n")),(0,r.kt)("p",null,"If that command succeeded, we can now set the password for this user:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"x500 dap apw 'o=Foobar,cn=cnorris'\n")),(0,r.kt)("p",null,"And that's it for the Meerkat DSA setup. Now we can configure Gitea to search\nfor users under ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),"!"),(0,r.kt)("h2",{id:"gitea-configuration"},"Gitea Configuration"),(0,r.kt)("p",null,"If you installed Gitea via the\n",(0,r.kt)("a",{parentName:"p",href:"https://gitea.com/gitea/helm-chart/"},"Helm chart"),", there should already be an\nadmin user, whose credentials can be found in the ",(0,r.kt)("inlineCode",{parentName:"p"},"values.yaml")," file in the\nlinked repository (unless you overwrote them when you ran ",(0,r.kt)("inlineCode",{parentName:"p"},"helm"),'). Log in as\nthis user and click on the profile picture in the top right. Select\n"Site Administration" from the dropdown. Open the "Authentication Sources" tab.\nClick on "Add Authentication Source."'),(0,r.kt)("p",null,'In the Authentication Type dropdown, select "LDAP (via BindDN)." Give it a name,\nand specify the hostname and port of your Meerkat DSA instance. Your Bind DN\nshould be ',(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),". Your password should be the password you set for\n",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),". User search base should be ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar"),"."),(0,r.kt)("p",null,"Your search filter should be ",(0,r.kt)("inlineCode",{parentName:"p"},"(&(objectClass=organizationalPerson)(cn=%s))"),".\nThe ",(0,r.kt)("inlineCode",{parentName:"p"},"%s")," gets replaced with the username, so if you type in ",(0,r.kt)("inlineCode",{parentName:"p"},"cnorris")," on the\nlogin page, Gitea will search for an entry with object class\n",(0,r.kt)("inlineCode",{parentName:"p"},"organizationalPerson")," and with a common name of ",(0,r.kt)("inlineCode",{parentName:"p"},"cnorris"),"."),(0,r.kt)("p",null,"For the other settings:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Username Attribute: ",(0,r.kt)("inlineCode",{parentName:"li"},"cn")),(0,r.kt)("li",{parentName:"ul"},"First Name Attribute: ",(0,r.kt)("inlineCode",{parentName:"li"},"cn")),(0,r.kt)("li",{parentName:"ul"},"Surname Attribute: ",(0,r.kt)("inlineCode",{parentName:"li"},"sn")),(0,r.kt)("li",{parentName:"ul"},"Email Attribute: ",(0,r.kt)("inlineCode",{parentName:"li"},"title"))),(0,r.kt)("p",null,'Finally, at the bottom, check "Fetch Attributes in Bind DN Context."'),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"I don't fully understand what \"Fetch Attributes in Bind DN Context\" does (the\ndocumentation on Gitea's LDAP integration is a little sparse), but this is what\nI think it does:"),(0,r.kt)("p",{parentName:"admonition"},"When you use \"LDAP (via BindDN)\" authentication, the username and password\nsupplied at the configuration page are used to perform a search against the LDAP\nserver (in this case, Meerkat DSA) for the existence of a user according to a\nsearch filter, and if that user appears in the results, Gitea permits that login\nas that user, but Gitea still has to query that user's attributes to get their\nname and email address. By default, Gitea will query the user's entry with the\ncredentials given at the login page, but since we did not define any access\ncontrols that allow ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar,cn=cnorris")," to query his own entry, Gitea\nunexpectedly fails to read the attributes it needs. Specifically, it receives a\n",(0,r.kt)("inlineCode",{parentName:"p"},"noSuchObject")," error, because, technically, ",(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar,cn=cnorris"),' is not even\nallowed to know about its own existence! However, when we check "Fetch\nAttributes in Bind DN Context," I believe it will use the Bind DN credentials to\nquery the object\'s attributes, and ',(0,r.kt)("inlineCode",{parentName:"p"},"o=Foobar")," ",(0,r.kt)("em",{parentName:"p"},"is")," permitted to read this entry.")),(0,r.kt)("p",null,"And that's it! Save the authentication source and log in using the username\n",(0,r.kt)("inlineCode",{parentName:"p"},"cnorris")," and the password you created in Meerkat DSA for this user. Congrats on\nmaking it this far!"))}m.isMDXComponent=!0}}]);